import { s as store_get, u as unsubscribe_stores } from "../../../../chunks/index2.js";
import "../../../../chunks/button.js";
import "../../../../chunks/auth.js";
import { p as page } from "../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    parseInt(store_get($$store_subs ??= {}, "$page", page).params.postId);
    $$renderer2.push(`<div class="post-detail-page svelte-epin4w"><div class="container svelte-epin4w">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading svelte-epin4w">로딩중...</div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
