import { a as attr_class, b as attr, s as store_get, u as unsubscribe_stores } from "../../chunks/index2.js";
import { B as Button } from "../../chunks/button.js";
import { p as page } from "../../chunks/stores.js";
import { a as api } from "../../chunks/index3.js";
import { i as isAuthenticated, u as user } from "../../chunks/auth.js";
import { V as escape_html } from "../../chunks/context.js";
function Navbar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let searchQuery = "";
    async function handleLogout() {
      try {
        await api.auth.logout();
        sessionStorage.clear();
        localStorage.removeItem("wizard-state");
        window.location.href = "/";
      } catch (error) {
        console.error("로그아웃 실패:", error);
        sessionStorage.clear();
        localStorage.removeItem("wizard-state");
        window.location.href = "/";
      }
    }
    $$renderer2.push(`<nav class="navbar svelte-1qrzhyq"><div class="nav-wrapper svelte-1qrzhyq"><div class="nav-left svelte-1qrzhyq"><a href="/" class="brand svelte-1qrzhyq">IF Story</a> <div class="nav-menu svelte-1qrzhyq"><a href="/"${attr_class("nav-link svelte-1qrzhyq", void 0, {
      "active": (
        // You can handle search query changes here
        store_get($$store_subs ??= {}, "$page", page).url.pathname === "/"
      )
    })} aria-label="스토리">스토리</a> <a href="/creator"${attr_class("nav-link svelte-1qrzhyq", void 0, {
      "active": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/creator"
    })} aria-label="크리에이터">크리에이터</a> <a href="/community"${attr_class("nav-link svelte-1qrzhyq", void 0, {
      "active": store_get($$store_subs ??= {}, "$page", page).url.pathname === "/community"
    })} aria-label="커뮤니티">커뮤니티</a></div></div> <div class="nav-right svelte-1qrzhyq"><div class="search-box svelte-1qrzhyq"><input type="text" placeholder="작품이름을 입력해 주세요"${attr("value", searchQuery)} class="search-input svelte-1qrzhyq"/> <button type="button" class="search-btn svelte-1qrzhyq" aria-label="검색"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg></button></div> `);
    if (store_get($$store_subs ??= {}, "$isAuthenticated", isAuthenticated) && store_get($$store_subs ??= {}, "$user", user)) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="user-info svelte-1qrzhyq"><span class="username svelte-1qrzhyq">${escape_html(store_get($$store_subs ??= {}, "$user", user).username)}</span></div> `);
      Button($$renderer2, {
        variant: "outline",
        size: "sm",
        onclick: handleLogout,
        "aria-label": "로그아웃",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->로그아웃`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> <button type="button" class="profile-btn svelte-1qrzhyq" aria-label="프로필"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"></circle><circle cx="12" cy="10" r="3" fill="currentColor"></circle><path d="M6.5 18.5c1-2 3-3.5 5.5-3.5s4.5 1.5 5.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
      Button($$renderer2, {
        variant: "default",
        size: "sm",
        onclick: () => window.location.href = "/login",
        "aria-label": "로그인",
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->로그인`);
        },
        $$slots: { default: true }
      });
    }
    $$renderer2.push(`<!--]--></div></div></nav>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { children, data } = $$props;
    let showNavbar = !store_get($$store_subs ??= {}, "$page", page).url.pathname.startsWith("/play");
    if (showNavbar) {
      $$renderer2.push("<!--[-->");
      Navbar($$renderer2);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    children($$renderer2);
    $$renderer2.push(`<!---->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
