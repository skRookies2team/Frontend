import { a as appConfig, g as getAccessToken } from "./auth.js";
function getCookie(name) {
  return null;
}
const API_BASE_URL = appConfig.backend.baseUrl;
const RELAY_API_URL = appConfig.backend.relayUrl;
class ApiError extends Error {
  constructor(status, statusText, data) {
    super(`API Error ${status}: ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.name = "ApiError";
  }
}
class HttpClient {
  baseUrl;
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }
  /**
   * Get access token from store or cookies
   */
  getAccessToken() {
    if (typeof window === "undefined") return null;
    const tokenFromStore = getAccessToken();
    if (tokenFromStore) return tokenFromStore;
    return getCookie();
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
  buildUrl(path, params) {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0 && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, String(v)));
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
  async request(path, config = {}) {
    const { params, requiresAuth = true, headers = {}, ...init } = config;
    const url = this.buildUrl(path, params);
    const requestHeaders = {
      "Content-Type": "application/json",
      ...headers
    };
    if (requiresAuth) {
      const token = this.getAccessToken();
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      }
    }
    try {
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        console.log(`[API Request] ${init.method || "GET"} ${url}`);
      }
      const response = await fetch(url, {
        ...init,
        headers: requestHeaders
      });
      if (!response.ok) {
        let errorData;
        const contentType2 = response.headers.get("content-type");
        try {
          const text = await response.text();
          if (contentType2 && contentType2.includes("application/json") && text) {
            try {
              errorData = JSON.parse(text);
            } catch {
              errorData = text;
            }
          } else {
            errorData = text;
          }
        } catch {
          errorData = "Unknown error";
        }
        console.error(`[API Error] ${response.status} ${response.statusText}`, {
          url,
          errorData,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new ApiError(response.status, response.statusText, errorData);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        return text;
      }
      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error("[API Network Error]", {
        url,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : void 0
      });
      throw new Error(`Network error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  /**
   * GET request
   */
  async get(path, config) {
    return this.request(path, { ...config, method: "GET" });
  }
  /**
   * POST request
   */
  async post(path, data, config) {
    return this.request(path, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : void 0
    });
  }
  /**
   * PUT request
   */
  async put(path, data, config) {
    return this.request(path, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : void 0
    });
  }
  /**
   * DELETE request
   */
  async delete(path, config) {
    return this.request(path, { ...config, method: "DELETE" });
  }
  /**
   * Upload file directly to S3 using presigned URL
   */
  async uploadToS3(presignedUrl, file, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      if (onProgress) {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = e.loaded / e.total * 100;
            onProgress(progress);
          }
        });
      }
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`S3 Upload failed with status ${xhr.status}`));
        }
      });
      xhr.addEventListener("error", () => {
        reject(new Error("S3 Upload failed"));
      });
      xhr.addEventListener("abort", () => {
        reject(new Error("S3 Upload aborted"));
      });
      xhr.open("PUT", presignedUrl);
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
      xhr.send(file);
    });
  }
}
const httpClient = new HttpClient(API_BASE_URL);
const relayHttpClient = new HttpClient(RELAY_API_URL);
class AiApi {
  /**
   * 소설 분석 (요약, 캐릭터, 게이지 추출)
   */
  async analyzeNovel(data) {
    return relayHttpClient.post("/ai/analyze", data);
  }
  /**
   * 전체 스토리 생성
   */
  async generateStory(data) {
    return relayHttpClient.post("/ai/generate", data);
  }
  /**
   * 이미지 생성
   */
  async generateImage(data) {
    return relayHttpClient.post("/ai/generate-image", data);
  }
  /**
   * 노드 수정 후 서브트리 재생성
   */
  async regenerateSubtree(data) {
    return relayHttpClient.post("/ai/regenerate-subtree", data);
  }
  /**
   * RAG용 캐릭터 인덱싱
   */
  async indexCharacter(data) {
    return relayHttpClient.post("/ai/chat/index-character", data);
  }
  /**
   * 캐릭터 채팅 메시지 전송
   */
  async sendChatMessage(data) {
    return relayHttpClient.post("/ai/chat/message", data);
  }
  /**
   * AI 서버 헬스 체크
   */
  async checkHealth() {
    return relayHttpClient.get("/ai/health", { requiresAuth: false });
  }
}
const aiApi = new AiApi();
export {
  ApiError as A,
  aiApi as a,
  httpClient as h,
  relayHttpClient as r
};
