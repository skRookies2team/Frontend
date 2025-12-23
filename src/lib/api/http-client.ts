/**
 * HTTP Client
 * Handles all HTTP requests with authentication and error handling
 */

import { appConfig } from '$lib/config/app-config';
import { getAccessToken as getTokenFromStore } from '$lib/stores/auth';
import { getCookie } from '$lib/utils/cookies';

// 메인 백엔드 URL (인증, 스토리 관리, 커뮤니티 등)
// 환경변수 PUBLIC_API_BASE_URL에서 가져옴
// 개발: http://localhost:8080
// 프로덕션: https://api.yourdomain.com (환경변수에 설정)
const API_BASE_URL = appConfig.backend.baseUrl;

// 릴레이 서버 URL (AI 기능: 분석, 생성, 이미지, 채팅)
// 환경변수 PUBLIC_RELAY_API_URL에서 가져옴
// 개발: http://localhost:8081
// 프로덕션: https://relay.yourdomain.com (환경변수에 설정)
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
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get access token from store or cookies
   */
  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    // Try to get from store first
    const tokenFromStore = getTokenFromStore();
    if (tokenFromStore) return tokenFromStore;
    
    // Fallback to cookie
    return getCookie('accessToken');
  }

  /**
   * Build URL with query parameters
   * 
   * 도메인 정보는 환경변수(PUBLIC_API_BASE_URL 또는 PUBLIC_RELAY_API_URL)에서 가져오고,
   * path는 상대 경로만 전달하면 됩니다.
   * 
   * 예시:
   * - baseUrl: 'http://localhost:8080' (환경변수에서)
   * - path: '/api/posts/1/comments' (코드에서)
   * - 결과: 'http://localhost:8080/api/posts/1/comments'
   * 
   * 프로덕션에서는:
   * - baseUrl: 'https://api.yourdomain.com' (환경변수에서)
   * - path: '/api/posts/1/comments' (동일한 코드)
   * - 결과: 'https://api.yourdomain.com/api/posts/1/comments'
   */
  private buildUrl(path: string, params?: Record<string, any>): string {
    // new URL(상대경로, baseUrl)을 사용하여 절대 URL 생성
    // baseUrl은 환경변수에서 가져온 값 (http://localhost:8080 또는 https://api.yourdomain.com)
    const url = new URL(path, this.baseUrl);
    
    // 쿼리 파라미터 추가 (선택사항)
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
   * Refresh token and wait for it to complete
   * This prevents multiple simultaneous refresh requests
   * Uses dynamic import to avoid circular dependency
   */
  private async handleTokenRefresh(): Promise<void> {
    // If already refreshing, wait for the existing refresh to complete
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start refresh process
    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        // Use dynamic import to avoid circular dependency
        const { authApi } = await import('./auth-api');
        await authApi.refreshToken();
      } catch (error) {
        console.error('[Token Refresh] Failed to refresh token:', error);
        // If refresh fails, clear tokens and redirect to login
        if (typeof window !== 'undefined') {
          // Clear auth cookies
          const { clearAuthCookies } = await import('$lib/utils/cookies');
          clearAuthCookies();
          // Redirect to login page
          window.location.href = '/login';
        }
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Make HTTP request
   */
  private async request<T>(
    path: string,
    config: RequestConfig = {},
    isRetry: boolean = false
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
      // 디버깅: 요청 URL 로그 (개발 환경에서만)
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log(`[API Request] ${init.method || 'GET'} ${url}`);
      }
      
      const response = await fetch(url, {
        ...init,
        headers: requestHeaders,
      });

      // Handle non-OK responses
      if (!response.ok) {
        // Handle 401 Unauthorized - try to refresh token
        // Check before reading response body to avoid consuming it
        if (response.status === 401 && requiresAuth && !isRetry) {
          // Skip refresh for auth endpoints to avoid infinite loop
          if (!path.includes('/api/auth/refresh') && !path.includes('/api/auth/login')) {
            try {
              // Clone response to read error data later if refresh fails
              const responseClone = response.clone();
              
              // Wait for token refresh to complete
              await this.handleTokenRefresh();
              
              // Retry the original request with new token
              return this.request<T>(path, config, true);
            } catch (refreshError) {
              // Refresh failed, read and throw the original 401 error
              console.error('[Token Refresh] Token refresh failed, redirecting to login');
              
              // Read error data from cloned response
              let errorData;
              const contentType = response.headers.get('content-type');
              try {
                const text = await response.text();
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
                errorData = 'Token refresh failed';
              }
              
              throw new ApiError(response.status, response.statusText, errorData);
            }
          }
        }

        // Read error data for non-401 errors or when refresh is not applicable
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
        
        // 디버깅: 에러 정보 로그
        console.error(`[API Error] ${response.status} ${response.statusText}`, {
          url,
          errorData,
          headers: Object.fromEntries(response.headers.entries())
        });
        
        throw new ApiError(response.status, response.statusText, errorData);
      }

      // Handle successful responses
      // 응답을 텍스트로 먼저 읽어서 실제로 JSON인지 확인
      const contentType = response.headers.get('content-type');
      const text = await response.text();
      
      // 빈 응답 처리
      if (!text || text.trim().length === 0) {
        return null as T;
      }
      
      // HTML 응답인지 확인 (서버가 HTML 에러 페이지를 반환하는 경우)
      if (text.trim().toLowerCase().startsWith('<!doctype') || 
          text.trim().toLowerCase().startsWith('<html')) {
        console.error('[API Error] Server returned HTML instead of JSON', {
          url,
          contentType,
          preview: text.substring(0, 200)
        });
        throw new ApiError(
          response.status,
          'Server returned HTML instead of JSON. The API endpoint may be incorrect or the server is not running.',
          text
        );
      }
      
      // Content-Type이 JSON이 아니면 텍스트로 반환
      if (!contentType || !contentType.includes('application/json')) {
        return text as T;
      }

      // JSON 파싱 시도
      try {
        return JSON.parse(text) as T;
      } catch (parseError) {
        console.error('[API Error] Failed to parse JSON response', {
          url,
          contentType,
          preview: text.substring(0, 200),
          error: parseError instanceof Error ? parseError.message : String(parseError)
        });
        throw new ApiError(
          response.status,
          'Invalid JSON response from server',
          text
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // 네트워크 에러 또는 기타 에러 처리
      console.error('[API Network Error]', {
        url,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      throw new Error(`Network error: ${error instanceof Error ? error.message : String(error)}`);
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

