/**
 * Health Check API
 */

import { httpClient, relayHttpClient } from './http-client';
import type { HealthCheckResponse } from './backend-types';
import type { AIHealthResponse } from './ai-api';

export class HealthApi {
  /**
   * 메인 백엔드 헬스 체크 (포트 8080)
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    return httpClient.get<HealthCheckResponse>('/api/health', {
      requiresAuth: false
    });
  }

  /**
   * Database health check
   */
  async databaseStatus(): Promise<HealthCheckResponse> {
    return httpClient.get<HealthCheckResponse>('/api/health/database', {
      requiresAuth: false
    });
  }

  /**
   * AI server health check (via main backend)
   * @deprecated use relayServerStatus() for direct relay server check
   */
  async aiServerStatus(): Promise<HealthCheckResponse> {
    return httpClient.get<HealthCheckResponse>('/api/health/ai-server', {
      requiresAuth: false
    });
  }

  /**
   * Relay 서버 및 AI 서버 헬스 체크 (포트 8081)
   * 분석 AI, 이미지 생성 AI, RAG AI 서버 상태를 확인합니다
   */
  async relayServerStatus(): Promise<AIHealthResponse> {
    return relayHttpClient.get<AIHealthResponse>('/ai/health', {
      requiresAuth: false
    });
  }

  /**
   * 전체 시스템 헬스 체크 (메인 백엔드 + 릴레이 서버)
   */
  async fullSystemStatus(): Promise<{
    backend: HealthCheckResponse | { status: string; error: string };
    relay: AIHealthResponse | { status: string; error: string };
  }> {
    const [backendResult, relayResult] = await Promise.allSettled([
      this.healthCheck(),
      this.relayServerStatus()
    ]);

    return {
      backend: backendResult.status === 'fulfilled' 
        ? backendResult.value 
        : { status: 'down', error: String(backendResult.reason) },
      relay: relayResult.status === 'fulfilled'
        ? relayResult.value
        : { status: 'down', error: String(relayResult.reason) }
    };
  }
}

export const healthApi = new HealthApi();






