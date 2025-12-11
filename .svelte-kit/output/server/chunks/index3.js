import { h as httpClient, r as relayHttpClient, a as aiApi } from "./ai-api.js";
import "./auth.js";
class AuthApi {
  /**
   * User sign up
   */
  async signUp(data) {
    const response = await httpClient.post(
      "/api/auth/signup",
      data,
      { requiresAuth: false }
    );
    return response;
  }
  /**
   * User login
   */
  async login(data) {
    const response = await httpClient.post(
      "/api/auth/login",
      data,
      { requiresAuth: false }
    );
    return response;
  }
  /**
   * User logout
   */
  async logout() {
    try {
      const response = await httpClient.post("/api/auth/logout");
      return response;
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
    }
    return "Logged out";
  }
  /**
   * Refresh access token
   */
  async refreshToken() {
    {
      throw new Error("Cannot refresh token on server side");
    }
  }
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return false;
  }
  /**
   * Get current user ID
   */
  getCurrentUserId() {
    return null;
  }
  /**
   * Get current username
   */
  getCurrentUsername() {
    return null;
  }
}
const authApi = new AuthApi();
class UserApi {
  /**
   * Get my profile
   */
  async getMyProfile() {
    return httpClient.get("/api/users/me");
  }
  /**
   * Update my profile
   */
  async updateProfile(data) {
    return httpClient.put("/api/users/me", data);
  }
  /**
   * Get user profile by username
   */
  async getUserProfile(username) {
    return httpClient.get(`/api/users/${username}`);
  }
  /**
   * Get game play history
   */
  async getGameHistory() {
    return httpClient.get("/api/users/me/history");
  }
  /**
   * Get achievements
   */
  async getAchievements() {
    return httpClient.get("/api/users/me/achievements");
  }
}
const userApi = new UserApi();
class PostApi {
  /**
   * Get all posts
   */
  async getPosts(pageable) {
    return httpClient.get("/api/posts", {
      params: pageable
    });
  }
  /**
   * Get posts by type
   */
  async getPostsByType(type, pageable) {
    return httpClient.get(`/api/posts/type/${type}`, {
      params: pageable
    });
  }
  /**
   * Search posts
   */
  async searchPosts(keyword, pageable) {
    return httpClient.get("/api/posts/search", {
      params: { keyword, ...pageable }
    });
  }
  /**
   * Get post by ID
   */
  async getPost(postId) {
    return httpClient.get(`/api/posts/${postId}`);
  }
  /**
   * Create new post
   */
  async createPost(data) {
    return httpClient.post("/api/posts", data);
  }
  /**
   * Update post
   */
  async updatePost(postId, data) {
    return httpClient.put(`/api/posts/${postId}`, data);
  }
  /**
   * Delete post
   */
  async deletePost(postId) {
    return httpClient.delete(`/api/posts/${postId}`);
  }
  /**
   * Toggle like on post
   */
  async toggleLike(postId) {
    return httpClient.post(`/api/posts/${postId}/like`);
  }
  /**
   * Toggle bookmark on post
   */
  async toggleBookmark(postId) {
    return httpClient.post(`/api/posts/${postId}/bookmark`);
  }
}
const postApi = new PostApi();
class CommentApi {
  /**
   * Get comments for a post
   * 
   * 실제 요청 URL은 환경변수에 따라 자동으로 결정됩니다:
   * - 개발: http://localhost:8080/api/posts/{postId}/comments
   * - 프로덕션: https://api.yourdomain.com/api/posts/{postId}/comments
   * 
   * 도메인 정보는 환경변수(PUBLIC_API_BASE_URL)에서 가져오므로,
   * 코드에서는 상대 경로만 작성하면 됩니다.
   */
  async getComments(postId) {
    return httpClient.get(`/api/posts/${postId}/comments`);
  }
  /**
   * Create comment
   */
  async createComment(postId, data) {
    return httpClient.post(`/api/posts/${postId}/comments`, data);
  }
  /**
   * Update comment
   */
  async updateComment(commentId, content) {
    return httpClient.put(
      `/api/comments/${commentId}`,
      content
    );
  }
  /**
   * Delete comment
   */
  async deleteComment(commentId) {
    return httpClient.delete(`/api/comments/${commentId}`);
  }
  /**
   * Toggle like on comment
   */
  async toggleLike(commentId) {
    return httpClient.post(`/api/comments/${commentId}/like`);
  }
}
const commentApi = new CommentApi();
class ReviewApi {
  /**
   * Get reviews for a story
   */
  async getReviewsByStory(storyDataId, pageable) {
    return httpClient.get(
      `/api/reviews/story/${storyDataId}`,
      { params: pageable }
    );
  }
  /**
   * Get story rating stats
   */
  async getStoryRatingStats(storyDataId) {
    return httpClient.get(`/api/reviews/story/${storyDataId}/stats`);
  }
  /**
   * Get my review for a story
   */
  async getMyReviewForStory(storyDataId) {
    return httpClient.get(`/api/reviews/story/${storyDataId}/me`);
  }
  /**
   * Create review
   */
  async createReview(data) {
    return httpClient.post("/api/reviews", data);
  }
  /**
   * Update review
   */
  async updateReview(reviewId, data) {
    return httpClient.put(`/api/reviews/${reviewId}`, data);
  }
  /**
   * Delete review
   */
  async deleteReview(reviewId) {
    return httpClient.delete(`/api/reviews/${reviewId}`);
  }
}
const reviewApi = new ReviewApi();
class GameApi {
  /**
   * Get all stories
   */
  async getAllStories() {
    return httpClient.get("/api/game/stories");
  }
  /**
   * Upload story
   */
  async uploadStory(title, storyJson, description) {
    return httpClient.post(
      "/api/game/stories",
      storyJson,
      {
        params: { title, description }
      }
    );
  }
  /**
   * Generate story using AI
   */
  async generateStory(data) {
    return httpClient.post("/api/game/stories/generate", data);
  }
  /**
   * Start new game
   */
  async startGame(data) {
    return httpClient.post("/api/game/start", data);
  }
  /**
   * Get game state
   */
  async getGameState(sessionId) {
    return httpClient.get(`/api/game/${sessionId}`);
  }
  /**
   * Make choice in game
   */
  async makeChoice(sessionId, choiceIndex) {
    const data = { choiceIndex };
    return httpClient.post(`/api/game/${sessionId}/choice`, data);
  }
  /**
   * Check AI server health
   */
  async checkAiHealth() {
    return httpClient.get("/api/game/ai/health");
  }
  /**
   * Get ending information (episode or final ending)
   */
  async getEnding(sessionId) {
    return httpClient.get(`/api/game/${sessionId}/ending`);
  }
}
const gameApi = new GameApi();
class HealthApi {
  /**
   * 메인 백엔드 헬스 체크 (포트 8080)
   */
  async healthCheck() {
    return httpClient.get("/api/health", {
      requiresAuth: false
    });
  }
  /**
   * Database health check
   */
  async databaseStatus() {
    return httpClient.get("/api/health/database", {
      requiresAuth: false
    });
  }
  /**
   * AI server health check (via main backend)
   * @deprecated use relayServerStatus() for direct relay server check
   */
  async aiServerStatus() {
    return httpClient.get("/api/health/ai-server", {
      requiresAuth: false
    });
  }
  /**
   * Relay 서버 및 AI 서버 헬스 체크 (포트 8081)
   * 분석 AI, 이미지 생성 AI, RAG AI 서버 상태를 확인합니다
   */
  async relayServerStatus() {
    return relayHttpClient.get("/ai/health", {
      requiresAuth: false
    });
  }
  /**
   * 전체 시스템 헬스 체크 (메인 백엔드 + 릴레이 서버)
   */
  async fullSystemStatus() {
    const [backendResult, relayResult] = await Promise.allSettled([
      this.healthCheck(),
      this.relayServerStatus()
    ]);
    return {
      backend: backendResult.status === "fulfilled" ? backendResult.value : { status: "down", error: String(backendResult.reason) },
      relay: relayResult.status === "fulfilled" ? relayResult.value : { status: "down", error: String(relayResult.reason) }
    };
  }
}
const healthApi = new HealthApi();
class StoryApi {
  /**
   * 1단계: 소설 업로드 및 분석 시작 (텍스트 직접 전송)
   * @deprecated S3 업로드 방식(uploadNovelFromS3) 사용을 권장합니다
   */
  async uploadNovel(data) {
    return httpClient.post("/api/stories/upload", data);
  }
  /**
   * 1단계: S3에서 소설 업로드 및 분석 시작 (권장)
   * 사용 방법:
   * 1. uploadApi.uploadStoryFile()로 파일을 S3에 업로드하여 fileKey를 받음
   * 2. 이 메서드에 fileKey를 전달하여 분석 시작
   */
  async uploadNovelFromS3(data) {
    return httpClient.post("/api/stories/upload-from-s3", data);
  }
  /**
   * 2단계: 요약 조회
   */
  async getSummary(storyId) {
    return httpClient.get(`/api/stories/${storyId}/summary`);
  }
  /**
   * 2단계: 캐릭터 조회
   */
  async getCharacters(storyId) {
    return httpClient.get(`/api/stories/${storyId}/characters`);
  }
  /**
   * 3단계: 게이지 제안 조회 (5개)
   */
  async getGauges(storyId) {
    return httpClient.get(`/api/stories/${storyId}/gauges`);
  }
  /**
   * 3단계: 게이지 선택 (2개)
   */
  async selectGauges(storyId, data) {
    return httpClient.post(
      `/api/stories/${storyId}/gauges/select`,
      data
    );
  }
  /**
   * 4단계: 생성 설정
   */
  async configureStory(storyId, data) {
    return httpClient.post(`/api/stories/${storyId}/config`, data);
  }
  /**
   * 5단계: 첫 번째 에피소드(EP1) 생성 시작 - 동기 방식
   * AI 서버에서 에피소드 생성이 완료될 때까지 대기 후 EpisodeDto 반환
   */
  async startEpisodeGeneration(storyId) {
    return httpClient.post(
      `/api/stories/${storyId}/generate`,
      {}
    );
  }
  /**
   * 다음 에피소드 생성 - 동기 방식
   * 이전 에피소드 완료 후 호출, 생성 완료 시 EpisodeDto 반환
   */
  async generateNextEpisode(storyId) {
    return httpClient.post(
      `/api/stories/${storyId}/generate-next-episode`,
      {}
    );
  }
  /**
   * 노드 수정 및 서브트리 재생성 - 동기 방식
   * 특정 노드를 수정하고 하위 노드들을 AI가 재생성합니다
   */
  async regenerateSubtree(storyId, episodeOrder, nodeId, data) {
    return httpClient.put(
      `/api/stories/${storyId}/episodes/${episodeOrder}/nodes/${nodeId}/regenerate`,
      data
    );
  }
  /**
   * 분석 진행률 조회 (storyId 기반)
   * 소설 업로드 후 분석 단계에서 사용
   */
  async getProgress(storyId) {
    return httpClient.get(`/api/stories/${storyId}/progress`);
  }
  /**
   * 7단계: 생성 완료 결과 조회
   */
  async getResult(storyId) {
    return httpClient.get(`/api/stories/${storyId}/result`);
  }
  /**
   * 전체 스토리 데이터 조회
   * 게임 플레이용 전체 JSON 데이터
   */
  async getFullStoryData(storyId) {
    return httpClient.get(`/api/stories/${storyId}/data`);
  }
}
const storyApi = new StoryApi();
class UploadApi {
  /**
   * 스토리 파일 업로드용 Pre-signed URL 생성
   * 지원 형식: .txt, .pdf, .doc, .docx
   * 최대 크기: 10MB
   */
  async getStoryPresignedUrl(fileName, fileSize) {
    return httpClient.get("/api/upload/story/presigned-url", {
      params: { fileName, fileSize }
    });
  }
  /**
   * 이미지 파일 업로드용 Pre-signed URL 생성
   * 지원 형식: .jpg, .jpeg, .png, .gif, .webp
   * 최대 크기: 5MB
   */
  async getImagePresignedUrl(fileName, fileSize) {
    return httpClient.get("/api/upload/image/presigned-url", {
      params: { fileName, fileSize }
    });
  }
  /**
   * 동영상 파일 업로드용 Pre-signed URL 생성
   * 지원 형식: .mp4, .avi, .mov, .wmv, .flv, .mkv
   * 최대 크기: 100MB
   */
  async getVideoPresignedUrl(fileName, fileSize) {
    return httpClient.get("/api/upload/video/presigned-url", {
      params: { fileName, fileSize }
    });
  }
  /**
   * 파일 업로드 완료 확인
   * S3에 파일이 정상적으로 업로드되었는지 확인
   */
  async verifyUpload(fileKey) {
    return httpClient.post("/api/upload/verify", null, {
      params: { fileKey }
    });
  }
  /**
   * 다운로드용 Pre-signed URL 생성
   * URL은 1시간 동안 유효
   */
  async getDownloadUrl(fileKey) {
    return httpClient.get("/api/upload/download-url", {
      params: { fileKey }
    });
  }
  /**
   * 파일 삭제
   * 업로드 실패 시 정리용으로 사용
   */
  async deleteFile(fileKey) {
    return httpClient.delete("/api/upload/file", {
      params: { fileKey }
    });
  }
  /**
   * S3에 파일 직접 업로드 (헬퍼 메서드)
   * @param file 업로드할 파일
   * @param onProgress 진행률 콜백 (0-100)
   * @returns fileKey
   */
  async uploadStoryFile(file, onProgress) {
    const { uploadUrl, fileKey } = await this.getStoryPresignedUrl(
      file.name,
      file.size
    );
    await httpClient.uploadToS3(uploadUrl, file, onProgress);
    await this.verifyUpload(fileKey);
    return fileKey;
  }
  /**
   * 이미지 파일 S3 업로드 헬퍼
   */
  async uploadImageFile(file, onProgress) {
    const { uploadUrl, fileKey } = await this.getImagePresignedUrl(
      file.name,
      file.size
    );
    await httpClient.uploadToS3(uploadUrl, file, onProgress);
    await this.verifyUpload(fileKey);
    return fileKey;
  }
  /**
   * 동영상 파일 S3 업로드 헬퍼
   */
  async uploadVideoFile(file, onProgress) {
    const { uploadUrl, fileKey } = await this.getVideoPresignedUrl(
      file.name,
      file.size
    );
    await httpClient.uploadToS3(uploadUrl, file, onProgress);
    await this.verifyUpload(fileKey);
    return fileKey;
  }
}
const uploadApi = new UploadApi();
const api = {
  // 메인 백엔드 (포트 8080)
  auth: authApi,
  user: userApi,
  post: postApi,
  comment: commentApi,
  review: reviewApi,
  game: gameApi,
  health: healthApi,
  story: storyApi,
  upload: uploadApi,
  // 릴레이 서버 (포트 8081)
  ai: aiApi
};
export {
  api as a
};
