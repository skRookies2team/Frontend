/**
 * Authentication API
 */

import { httpClient } from './http-client';
import type {
  SignUpRequestDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  TokenResponseDto
} from './types/backend-types';
import { setCookie, deleteCookie, clearAuthCookies, getCookie } from '$lib/utils/cookies';
import { authStore } from '$lib/stores/auth';
import { browser } from '$app/environment';

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
    
    // Store tokens in cookies and update store
    if (browser) {
      setCookie('accessToken', response.accessToken, 7);
      setCookie('refreshToken', response.refreshToken, 30);
      setCookie('userId', String(response.userId), 7);
      setCookie('username', response.username, 7);
      
      // Update auth store
      authStore.setUser({
        userId: response.userId,
        username: response.username,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      });
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
    
    // Store tokens in cookies and update store
    if (browser) {
      setCookie('accessToken', response.accessToken, 7);
      setCookie('refreshToken', response.refreshToken, 30);
      setCookie('userId', String(response.userId), 7);
      setCookie('username', response.username, 7);
      
      // Update auth store
      authStore.setUser({
        userId: response.userId,
        username: response.username,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      });
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
      // Always clear tokens from cookies and store
      if (browser) {
        clearAuthCookies();
        authStore.clear();
        
        // 크리에이터 wizard 상태도 초기화 (sessionStorage + localStorage 둘 다)
        sessionStorage.removeItem('wizard-state');
        localStorage.removeItem('wizard-state');
        // 혹시 모를 다른 키들도 정리
        sessionStorage.clear();
      }
    }
    
    return 'Logged out';
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<TokenResponseDto> {
    if (!browser) {
      throw new Error('Cannot refresh token on server side');
    }

    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const data: RefreshTokenRequestDto = { refreshToken };
    const response = await httpClient.post<TokenResponseDto>(
      '/api/auth/refresh',
      data,
      { requiresAuth: false }
    );
    
    // Update tokens in cookies and store
    setCookie('accessToken', response.accessToken, 7);
    setCookie('refreshToken', response.refreshToken, 30);
    
    authStore.updateTokens(response.accessToken, response.refreshToken);
    
    return response;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (!browser) return false;
    // Check both store and cookie for reliability
    const token = getCookie('accessToken');
    if (token) {
      // If token exists in cookie but not in store, sync it
      const userId = getCookie('userId');
      const username = getCookie('username');
      const refreshToken = getCookie('refreshToken');
      if (userId && username) {
        authStore.setUser({
          userId: parseInt(userId, 10),
          username,
          accessToken: token,
          refreshToken: refreshToken || null
        });
      }
      return true;
    }
    return false;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): number | null {
    if (!browser) return null;
    const userId = getCookie('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Get current username
   */
  getCurrentUsername(): string | null {
    if (!browser) return null;
    return getCookie('username');
  }
}

export const authApi = new AuthApi();

