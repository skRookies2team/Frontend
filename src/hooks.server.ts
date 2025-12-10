/**
 * Server Hooks
 * Handles authentication and sets user context
 * 
 * Note: For static build (CloudFront + S3), this will be skipped
 * and authentication will be handled client-side
 */

import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
  // Static build 시 서버 사이드 인증 건너뛰기
  if (building) {
    return await resolve(event);
  }

  // Preview/Dev 모드에서만 서버 사이드 인증 처리
  const accessToken = event.cookies.get('accessToken');
  const refreshToken = event.cookies.get('refreshToken');
  const userId = event.cookies.get('userId');
  const username = event.cookies.get('username');

  // Set user in event.locals if authenticated
  if (accessToken && userId && username) {
    event.locals.user = {
      userId: parseInt(userId, 10),
      username,
      accessToken,
      refreshToken: refreshToken || null
    };
  } else {
    event.locals.user = null;
  }

  const response = await resolve(event);
  return response;
};

