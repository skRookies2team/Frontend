/**
 * Authentication API
 */

import { httpClient } from './http-client';
import type {
  SignUpRequestDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  TokenResponseDto
} from './backend-types';

export class AuthApi {
  /**
   * User sign up
   */
  async signUp(data: SignUpRequestDto): Promise<TokenResponseDto> {
    const response = await httpClient.post<TokenResponseDto>(
      '/api/auth/signup',
      data,
      { requiresAuth: false }
    );
    
    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userId', String(response.userId));
      localStorage.setItem('username', response.username);
    }
    
    return response;
  }

  /**
   * User login
   */
  async login(data: LoginRequestDto): Promise<TokenResponseDto> {
    const response = await httpClient.post<TokenResponseDto>(
      '/api/auth/login',
      data,
      { requiresAuth: false }
    );
    
    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userId', String(response.userId));
      localStorage.setItem('username', response.username);
    }
    
    return response;
  }

  /**
   * User logout
   */
  async logout(): Promise<string> {
    try {
      // Try to call backend logout endpoint
      const response = await httpClient.post<string>('/api/auth/logout');
      return response;
    } catch (error) {
      console.error('Backend logout failed:', error);
      // Continue to clear tokens even if backend call fails
    } finally {
      // Always clear tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
      }
    }
    
    return 'Logged out';
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<TokenResponseDto> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot refresh token on server side');
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const data: RefreshTokenRequestDto = { refreshToken };
    const response = await httpClient.post<TokenResponseDto>(
      '/api/auth/refresh',
      data,
      { requiresAuth: false }
    );
    
    // Update tokens
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    
    return response;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('accessToken');
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): number | null {
    if (typeof window === 'undefined') return null;
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Get current username
   */
  getCurrentUsername(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('username');
  }
}

export const authApi = new AuthApi();

