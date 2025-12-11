import { b as attr, a as attr_class } from "../../chunks/index2.js";
import "../../chunks/auth.js";
import "../../chunks/button.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let stories = [];
    let searchQuery = "";
    let categoryDropdownOpen = false;
    let recommendationDropdownOpen = false;
    let viewMode = "grid";
    (() => {
      let result = stories;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter((story) => story.title.toLowerCase().includes(query) || story.description.toLowerCase().includes(query));
      }
      return result;
    })();
    $$renderer2.push(`<div class="platform svelte-1uha8ag"><main class="main-content svelte-1uha8ag"><div class="netflix-header svelte-1uha8ag"><div class="header-left svelte-1uha8ag"><h1 class="page-title svelte-1uha8ag">시리즈</h1> <div class="header-dropdowns svelte-1uha8ag"><div class="dropdown-wrapper svelte-1uha8ag"><button type="button" class="header-dropdown-trigger svelte-1uha8ag"${attr("aria-expanded", categoryDropdownOpen)}><span>장르</span> <svg${attr_class("dropdown-icon svelte-1uha8ag", void 0, { "open": categoryDropdownOpen })} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="dropdown-wrapper svelte-1uha8ag"><button type="button" class="header-dropdown-trigger svelte-1uha8ag"${attr("aria-expanded", recommendationDropdownOpen)}><span>추천 콘텐츠</span> <svg${attr_class("dropdown-icon svelte-1uha8ag", void 0, { "open": recommendationDropdownOpen })} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="header-right svelte-1uha8ag"><div class="view-toggle svelte-1uha8ag"><button type="button"${attr_class("view-toggle-btn svelte-1uha8ag", void 0, { "active": viewMode === "list" })} aria-label="리스트 뷰"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="2" rx="1" fill="currentColor"></rect><rect x="2" y="7" width="12" height="2" rx="1" fill="currentColor"></rect><rect x="2" y="11" width="12" height="2" rx="1" fill="currentColor"></rect></svg></button> <button type="button"${attr_class("view-toggle-btn svelte-1uha8ag", void 0, { "active": viewMode === "grid" })} aria-label="그리드 뷰"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor"></rect><rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor"></rect><rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor"></rect><rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor"></rect></svg></button></div></div></div> <div class="content-area svelte-1uha8ag">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading-state svelte-1uha8ag"><p>로딩중...</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></main></div>`);
  });
}
export {
  _page as default
};
