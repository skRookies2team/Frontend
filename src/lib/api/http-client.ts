/**
 * HTTP Client
 * Handles all HTTP requests with authentication and error handling
 */

import { appConfig } from '$lib/config/app-config';

// 메인 백엔드 URL (인증, 스토리 관리, 커뮤니티 등)
const API_BASE_URL = appConfig.backend.baseUrl;
// 릴레이 서버 URL (AI 기능: 분석, 생성, 이미지, 채팅)
const RELAY_API_URL = appConfig.backend.relayUrl;

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, any>;
  requiresAuth?: boolean;
}

class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get access token from storage
   */
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(path: string, params?: Record<string, any>): string {
    const url = new URL(path, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    return url.toString();
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    path: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, requiresAuth = true, headers = {}, ...init } = config;

    const url = this.buildUrl(path, params);

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add authorization header if required
    if (requiresAuth) {
      const token = this.getAccessToken();
      if (token) {
        (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...init,
        headers: requestHeaders,
      });

      // Handle non-OK responses
      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        try {
          // 먼저 텍스트로 읽기
          const text = await response.text();
          
          // JSON인지 확인하고 파싱 시도
          if (contentType && contentType.includes('application/json') && text) {
            try {
              errorData = JSON.parse(text);
            } catch {
              errorData = text;
            }
          } else {
            errorData = text;
          }
        } catch {
          errorData = 'Unknown error';
        }
        
        throw new ApiError(response.status, response.statusText, errorData);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        return text as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(`Network error: ${error}`);
    }
  }

  /**
   * GET request
   */
  async get<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(path: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(path: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(path, { ...config, method: 'DELETE' });
  }

  /**
   * Upload file directly to S3 using presigned URL
   */
  async uploadToS3(
    presignedUrl: string,
    file: File | Blob,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`S3 Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('S3 Upload failed'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('S3 Upload aborted'));
      });

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      xhr.send(file);
    });
  }
}

// Singleton instances
// 메인 백엔드 클라이언트 (인증, 스토리 관리, 커뮤니티 등)
export const httpClient = new HttpClient(API_BASE_URL);
// 릴레이 서버 클라이언트 (AI 기능: 분석, 생성, 이미지, 채팅)
export const relayHttpClient = new HttpClient(RELAY_API_URL);

