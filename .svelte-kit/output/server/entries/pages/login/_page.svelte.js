import { a as attr_class, b as attr } from "../../../chunks/index2.js";
import { B as Button } from "../../../chunks/button.js";
import "../../../chunks/auth.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { V as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let username = "";
    let password = "";
    let isSignUp = false;
    let loading = false;
    $$renderer2.push(`<div class="login-page svelte-1x05zx6"><div class="login-container svelte-1x05zx6"><div class="branding-section svelte-1x05zx6"><div class="branding-content svelte-1x05zx6"><h1 class="brand-title svelte-1x05zx6"><span class="gradient-text svelte-1x05zx6">IF Story</span></h1> <p class="brand-subtitle svelte-1x05zx6">인터랙티브 스토리의 세계로</p> <ul class="features-list svelte-1x05zx6"><li class="svelte-1x05zx6"><span class="feature-icon svelte-1x05zx6">📚</span> <span>수백 가지 인터랙티브 소설</span></li> <li class="svelte-1x05zx6"><span class="feature-icon svelte-1x05zx6">✨</span> <span>AI 기반 스토리 생성</span></li> <li class="svelte-1x05zx6"><span class="feature-icon svelte-1x05zx6">🎨</span> <span>나만의 작품 창작</span></li> <li class="svelte-1x05zx6"><span class="feature-icon svelte-1x05zx6">👥</span> <span>창작자 커뮤니티</span></li></ul></div></div> <div class="form-section svelte-1x05zx6"><div class="form-container svelte-1x05zx6"><div class="form-tabs svelte-1x05zx6"><button${attr_class("tab svelte-1x05zx6", void 0, { "active": !isSignUp })}>로그인</button> <button${attr_class("tab svelte-1x05zx6", void 0, { "active": isSignUp })}>회원가입</button></div> <form class="login-form svelte-1x05zx6">`);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="form-group svelte-1x05zx6"><label for="username" class="form-label svelte-1x05zx6">사용자명</label> <input id="username" type="text" class="form-input svelte-1x05zx6" placeholder="사용자명을 입력하세요"${attr("value", username)}${attr("disabled", loading, true)} required/></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="form-group svelte-1x05zx6"><label for="password" class="form-label svelte-1x05zx6">비밀번호</label> <input id="password" type="password" class="form-input svelte-1x05zx6" placeholder="비밀번호를 입력하세요"${attr("value", password)}${attr("disabled", loading, true)} required/></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="form-options svelte-1x05zx6"><label class="checkbox-label svelte-1x05zx6"><input type="checkbox"/> <span>로그인 상태 유지</span></label> <button type="button" class="link-btn svelte-1x05zx6">비밀번호 찾기</button></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    Button($$renderer2, {
      type: "submit",
      class: "submit-btn w-full",
      size: "lg",
      disabled: loading,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->${escape_html("로그인")}`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></form> <div class="divider svelte-1x05zx6"><span>또는</span></div> <div class="social-login svelte-1x05zx6"><button type="button" class="social-btn kakao svelte-1x05zx6"><span class="social-icon svelte-1x05zx6">💬</span> <span>카카오로 시작하기</span></button> <button type="button" class="social-btn google svelte-1x05zx6"><span class="social-icon svelte-1x05zx6">G</span> <span>Google로 시작하기</span></button> <button type="button" class="social-btn github svelte-1x05zx6"><span class="social-icon svelte-1x05zx6">🐙</span> <span>GitHub로 시작하기</span></button></div> <div class="form-footer svelte-1x05zx6">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<p>계정이 없으신가요? <button type="button" class="link-btn svelte-1x05zx6">회원가입하기</button></p>`);
    }
    $$renderer2.push(`<!--]--></div></div></div></div></div>`);
  });
}
export {
  _page as default
};
