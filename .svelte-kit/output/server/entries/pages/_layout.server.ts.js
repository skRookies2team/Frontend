import { b as building } from "../../chunks/environment.js";
const load = async ({ locals }) => {
  if (building) {
    return {
      user: null
    };
  }
  return {
    user: locals.user || null
  };
};
export {
  load
};
