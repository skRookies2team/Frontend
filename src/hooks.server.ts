/**
 * Server Hooks
 * Handles authentication and sets user context
 */

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Read authentication tokens from cookies
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

