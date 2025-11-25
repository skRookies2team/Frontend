/**
 * Health Check API
 */

import { httpClient } from './http-client';
import type { HealthCheckResponse } from './backend-types';

export class HealthApi {
  /**
   * General health check
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
   * AI server health check
   */
  async aiServerStatus(): Promise<HealthCheckResponse> {
    return httpClient.get<HealthCheckResponse>('/api/health/ai-server', {
      requiresAuth: false
    });
  }
}

export const healthApi = new HealthApi();



