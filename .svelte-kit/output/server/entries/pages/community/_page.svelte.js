import { a as attr_class, e as ensure_array_like } from "../../../chunks/index2.js";
import { B as Button } from "../../../chunks/button.js";
import "../../../chunks/auth.js";
import { g as goto } from "../../../chunks/client.js";
import { V as escape_html } from "../../../chunks/context.js";
var PostType = /* @__PURE__ */ ((PostType2) => {
  PostType2["GENERAL"] = "GENERAL";
  PostType2["STORY"] = "STORY";
  PostType2["QUESTION"] = "QUESTION";
  PostType2["GUIDE"] = "GUIDE";
  PostType2["NOTICE"] = "NOTICE";
  return PostType2;
})(PostType || {});
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activeTab = "popular";
    PostType.GENERAL;
    function openWriteModal() {
      {
        alert("글 작성은 로그인이 필요합니다.");
        goto();
        return;
      }
    }
    $$renderer2.push(`<div class="community-page svelte-131htjm"><div class="community-container svelte-131htjm"><header class="community-header svelte-131htjm"><div class="header-content svelte-131htjm"><div class="svelte-131htjm"><h1 class="page-title svelte-131htjm">커뮤니티</h1> <p class="page-description svelte-131htjm">창작자들과 소통하고 영감을 나누세요</p></div> `);
    Button($$renderer2, {
      size: "lg",
      onclick: (
        // Watch tab changes
        openWriteModal
      ),
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->✍️ 글쓰기`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></header> <div class="tabs svelte-131htjm"><button${attr_class("tab svelte-131htjm", void 0, { "active": activeTab === "popular" })}>🔥 인기</button> <button${attr_class("tab svelte-131htjm", void 0, { "active": activeTab === "recent" })}>🆕 최신</button> <button${attr_class("tab svelte-131htjm", void 0, { "active": activeTab === "following" })}>⭐ 팔로잉</button></div> <div class="content-grid svelte-131htjm"><div class="posts-section svelte-131htjm">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading-message svelte-131htjm">로딩중...</div>`);
    }
    $$renderer2.push(`<!--]--></div> <aside class="sidebar svelte-131htjm"><div class="sidebar-card svelte-131htjm"><h3 class="sidebar-title svelte-131htjm">인기 태그</h3> <div class="tags-grid svelte-131htjm"><button class="tag-btn svelte-131htjm">#판타지</button> <button class="tag-btn svelte-131htjm">#로맨스</button> <button class="tag-btn svelte-131htjm">#추리</button> <button class="tag-btn svelte-131htjm">#SF</button> <button class="tag-btn svelte-131htjm">#팁</button> <button class="tag-btn svelte-131htjm">#질문</button> <button class="tag-btn svelte-131htjm">#AI</button> <button class="tag-btn svelte-131htjm">#완성</button></div></div> <div class="sidebar-card svelte-131htjm"><h3 class="sidebar-title svelte-131htjm">활동중인 작가</h3> <div class="users-list svelte-131htjm"><!--[-->`);
    const each_array_1 = ensure_array_like(["김작가", "이소설", "박스토리", "최문학", "정이야기"]);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let user = each_array_1[$$index_1];
      $$renderer2.push(`<div class="user-item svelte-131htjm"><div class="user-status svelte-131htjm"></div> <span class="svelte-131htjm">${escape_html(user)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="sidebar-card svelte-131htjm"><h3 class="sidebar-title svelte-131htjm">커뮤니티 규칙</h3> <ul class="rules-list svelte-131htjm"><li class="svelte-131htjm">서로를 존중해주세요</li> <li class="svelte-131htjm">건설적인 피드백을 나눠요</li> <li class="svelte-131htjm">스포일러 주의!</li> <li class="svelte-131htjm">저작권을 지켜요</li></ul></div></aside></div></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
