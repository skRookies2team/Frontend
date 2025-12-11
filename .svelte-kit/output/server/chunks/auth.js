import { d as derived, w as writable } from "./index.js";
const __vite_import_meta_env__ = { "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SSR": true };
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}
function getEnvVar(key, defaultValue, required = false) {
  const isBrowser = typeof window !== "undefined";
  const env = isBrowser ? __vite_import_meta_env__ : {};
  const value = env[key] || defaultValue;
  if (required && !value) {
    const errorMsg = `환경 변수 ${key}가 설정되지 않았습니다. 프로덕션 환경에서는 반드시 설정해야 합니다. .env 파일을 확인하거나 배포 플랫폼의 환경 변수 설정을 확인하세요.`;
    console.error(`[Config Error] ${errorMsg}`);
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      console.warn(`[Config Warning] ${key}가 설정되지 않아 기본값을 사용합니다: ${defaultValue}`);
      return defaultValue || "";
    }
    throw new Error(errorMsg);
  }
  return value || "";
}
function loadConfig() {
  const isBrowser = typeof window !== "undefined";
  const env = isBrowser ? __vite_import_meta_env__ : {};
  const isProduction = env.MODE === "production" || env.PROD === true;
  const apiMode = env.PUBLIC_API_MODE || "mock";
  const isProductionMode2 = apiMode === "production";
  const defaultBaseUrl = "http://localhost:8080";
  const defaultRelayUrl = "http://localhost:8081";
  const baseUrl = getEnvVar(
    "PUBLIC_API_BASE_URL",
    defaultBaseUrl,
    isProduction && isProductionMode2
  );
  const relayUrl = getEnvVar(
    "PUBLIC_RELAY_API_URL",
    defaultRelayUrl,
    isProduction && isProductionMode2
  );
  if (isProductionMode2 && !isValidUrl(baseUrl)) {
    console.warn(
      `⚠️ PUBLIC_API_BASE_URL이 유효한 URL 형식이 아닙니다: ${baseUrl}
프로덕션 환경에서는 https://api.yourdomain.com 형식의 완전한 URL이 필요합니다.`
    );
  }
  if (isProductionMode2 && !isValidUrl(relayUrl)) {
    console.warn(
      `⚠️ PUBLIC_RELAY_API_URL이 유효한 URL 형식이 아닙니다: ${relayUrl}
프로덕션 환경에서는 https://relay.yourdomain.com 형식의 완전한 URL이 필요합니다.`
    );
  }
  return {
    apiMode,
    backend: {
      baseUrl,
      relayUrl
    },
    llm: {
      provider: env.PUBLIC_LLM_PROVIDER || "openai",
      apiKey: env.PUBLIC_OPENAI_API_KEY || env.PUBLIC_ANTHROPIC_API_KEY || "",
      model: env.PUBLIC_OPENAI_MODEL || env.PUBLIC_ANTHROPIC_MODEL || "gpt-4-turbo-preview"
    },
    image: {
      provider: env.PUBLIC_IMAGE_API_PROVIDER || "backend",
      apiKey: env.PUBLIC_IMAGE_API_KEY || "",
      model: env.PUBLIC_IMAGE_MODEL || "dall-e-3"
    },
    storage: {
      type: env.PUBLIC_STORAGE_TYPE || "localStorage"
    }
  };
}
const appConfig = loadConfig();
function isMockMode() {
  return appConfig.apiMode === "mock";
}
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true
};
function createAuthStore() {
  const { subscribe, set, update } = writable(initialState);
  return {
    subscribe,
    /**
     * Set user authentication data
     */
    setUser: (user2) => {
      set({
        user: user2,
        isAuthenticated: !!user2,
        isLoading: false
      });
    },
    /**
     * Update tokens
     */
    updateTokens: (accessToken, refreshToken) => {
      update((state) => {
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
    setLoading: (loading) => {
      update((state) => ({
        ...state,
        isLoading: loading
      }));
    },
    /**
     * Initialize from server data
     */
    init: (user2) => {
      set({
        user: user2,
        isAuthenticated: !!user2,
        isLoading: false
      });
    }
  };
}
const authStore = createAuthStore();
const user = derived(authStore, ($auth) => $auth.user);
const isAuthenticated = derived(authStore, ($auth) => $auth.isAuthenticated);
derived(authStore, ($auth) => $auth.isLoading);
function getAccessToken() {
  return null;
}
export {
  appConfig as a,
  isMockMode as b,
  getAccessToken as g,
  isAuthenticated as i,
  user as u
};
