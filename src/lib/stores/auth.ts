/**
 * Authentication Store
 * Manages authentication state using Svelte stores
 */

import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';

export interface AuthUser {
  userId: number;
  username: string;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
};

// Create writable store
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    
    /**
     * Set user authentication data
     */
    setUser: (user: AuthUser | null) => {
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false
      });
    },

    /**
     * Update tokens
     */
    updateTokens: (accessToken: string, refreshToken: string) => {
      update(state => {
        if (state.user) {
          return {
            ...state,
            user: {
              ...state.user,
              accessToken,
              refreshToken
            }
          };
        }
        return state;
      });
    },

    /**
     * Clear authentication state
     */
    clear: () => {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    },

    /**
     * Set loading state
     */
    setLoading: (loading: boolean) => {
      update(state => ({
        ...state,
        isLoading: loading
      }));
    },

    /**
     * Initialize from server data
     */
    init: (user: AuthUser | null) => {
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false
      });
    }
  };
}

export const authStore = createAuthStore();

// Derived stores for convenience
export const user = derived(authStore, $auth => $auth.user);
export const isAuthenticated = derived(authStore, $auth => $auth.isAuthenticated);
export const isLoading = derived(authStore, $auth => $auth.isLoading);

// Helper functions
export function getAccessToken(): string | null {
  if (!browser) return null;
  const state = get(authStore);
  return state.user?.accessToken || null;
}

export function getRefreshToken(): string | null {
  if (!browser) return null;
  const state = get(authStore);
  return state.user?.refreshToken || null;
}

export function getCurrentUserId(): number | null {
  if (!browser) return null;
  const state = get(authStore);
  return state.user?.userId || null;
}

export function getCurrentUsername(): string | null {
  if (!browser) return null;
  const state = get(authStore);
  return state.user?.username || null;
}

