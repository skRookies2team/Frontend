import "clsx";
import { B as Button } from "../../../chunks/button.js";
function _page($$renderer) {
  $$renderer.push(`<div class="creator-page svelte-1onb9i7"><section class="hero svelte-1onb9i7"><div class="hero-video-wrapper svelte-1onb9i7"><video class="hero-video svelte-1onb9i7" autoplay muted loop playsinline preload="auto"><source src="/111281-690770684_small.mp4" type="video/mp4" class="svelte-1onb9i7"/></video> <div class="hero-video-overlay svelte-1onb9i7"></div></div> <div class="hero-container svelte-1onb9i7"><div class="hero-content svelte-1onb9i7"><div class="hero-badge svelte-1onb9i7">✨ AI 기반 스토리 크리에이터</div> <h1 class="hero-title svelte-1onb9i7">당신의 이야기를<br class="svelte-1onb9i7"/> <span class="gradient-text svelte-1onb9i7">인터랙티브 소설</span>로</h1> <p class="hero-description svelte-1onb9i7">AI 기술로 더 쉽고 빠르게 인터랙티브 스토리를 제작하고,<br class="svelte-1onb9i7"/> 전 세계 독자들과 공유하세요.</p> <div class="hero-actions svelte-1onb9i7">`);
  Button($$renderer, {
    size: "lg",
    onclick: () => window.location.href = "/creator/wizard",
    children: ($$renderer2) => {
      $$renderer2.push(`<!---->시작하기`);
    },
    $$slots: { default: true }
  });
  $$renderer.push(`<!----></div></div></div></section></div>`);
}
export {
  _page as default
};
