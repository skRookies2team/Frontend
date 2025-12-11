import { b as building } from "./environment.js";
const handle = async ({ event, resolve }) => {
  if (building) {
    return await resolve(event);
  }
  const accessToken = event.cookies.get("accessToken");
  const refreshToken = event.cookies.get("refreshToken");
  const userId = event.cookies.get("userId");
  const username = event.cookies.get("username");
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
export {
  handle
};
