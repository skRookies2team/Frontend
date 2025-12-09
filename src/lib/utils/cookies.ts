/**
 * Cookie utilities
 * Helper functions for managing cookies on the client side
 */

import { browser } from '$app/environment';

/**
 * Set a cookie
 */
export function setCookie(name: string, value: string, days: number = 7): void {
  if (!browser) return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  // Secure and SameSite for better security
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`;
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  if (!browser) return null;
  
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string): void {
  if (!browser) return;
  
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Clear all authentication cookies
 */
export function clearAuthCookies(): void {
  if (!browser) return;
  
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
  deleteCookie('userId');
  deleteCookie('username');
}

