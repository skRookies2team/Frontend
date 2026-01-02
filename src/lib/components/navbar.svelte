<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { api } from '$lib/api';
  import { isAuthenticated, user, isLoading } from '$lib/stores/auth';

  let searchQuery = $state('');

  async function handleLogout() {
    try {
      await api.auth.logout();
      // 추가로 직접 클리어 (확실하게)
      sessionStorage.clear();
      localStorage.removeItem('wizard-state');
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 에러가 나도 스토리지는 클리어
      sessionStorage.clear();
      localStorage.removeItem('wizard-state');
      window.location.href = '/';
    }
  }

  function handleSearch() {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      goto(`/search?keyword=${encodeURIComponent(trimmedQuery)}`);
    } else {
      goto('/search');
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }
</script>

<nav class="navbar">
  <div class="nav-wrapper">
    <div class="nav-left">
      <a href="/" class="brand">IF Story</a>
      <div class="nav-menu">
        <a href="/" class="nav-link" class:active={$page.url.pathname === '/'} aria-label="스토리">스토리</a>
        <a href="/creator" class="nav-link" class:active={$page.url.pathname === '/creator'} aria-label="크리에이터">크리에이터</a>
        <a href="/community" class="nav-link" class:active={$page.url.pathname === '/community'} aria-label="커뮤니티">커뮤니티</a>
      </div>
    </div>
    
    <div class="nav-right">
      <div class="search-box">
        <input
          type="text"
          placeholder="작품이름을 입력해 주세요"
          bind:value={searchQuery}
          onkeydown={handleKeydown}
          class="search-input"
        />
        <button type="button" class="search-btn" onclick={handleSearch} aria-label="검색">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      
      {#if !$isLoading}
        {#if $isAuthenticated && $user}
          <!-- 로그인 상태 -->
          <div class="user-info">
            <span class="username">{$user.username}</span>
          </div>
          <Button variant="outline" size="sm" onclick={handleLogout} aria-label="로그아웃">
            로그아웃
          </Button>
          <button type="button" class="profile-btn" onclick={() => window.location.href = '/profile'} aria-label="프로필">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="10" r="3" fill="currentColor"/>
              <path d="M6.5 18.5c1-2 3-3.5 5.5-3.5s4.5 1.5 5.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        {:else}
          <!-- 로그인 안 된 상태 -->
          <Button variant="default" size="sm" onclick={() => window.location.href = '/login'} aria-label="로그인">
            로그인
          </Button>
        {/if}
      {/if}
    </div>
  </div>
</nav>

<style>
  .navbar {
    position: sticky;
    top: 0;
    background: hsla(240 15% 6% / 0.8);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border-bottom: 1px solid hsla(0 70% 45% / 0.2);
    box-shadow: 
      0 4px 24px hsla(0 0% 0% / 0.2),
      inset 0 1px 0 hsla(255 255 255 / 0.05);
    z-index: 50;
    padding: 0.75rem 0;
  }

  .nav-wrapper {
    width: 100%;
    margin: 0 auto;
    padding: 0 4%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 3rem;
  }

  .brand {
    font-size: 1.625rem;
    font-weight: 900;
    background: linear-gradient(135deg, hsl(0 90% 48%), hsl(0 85% 42%), hsl(0 80% 50%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
    letter-spacing: -0.02em;
    position: relative;
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 8px hsla(0 90% 48% / 0.3));
  }
  
  .brand:hover {
    filter: drop-shadow(0 0 16px hsla(0 90% 48% / 0.5));
    transform: scale(1.05);
  }

  .nav-menu {
    display: flex;
    gap: 2rem;
  }

  .nav-link {
    color: hsl(0 0% 85%);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    position: relative;
    padding: 0.5rem 0;
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: var(--gradient-primary);
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  .nav-link:hover {
    color: hsl(0 0% 100%);
    text-shadow: 0 0 8px hsla(0 90% 48% / 0.3);
  }
  
  .nav-link:hover::after {
    width: 100%;
  }

  .nav-link.active {
    color: hsl(0 0% 100%);
    font-weight: 700;
  }

  .nav-link.active::after {
    width: 100%;
    box-shadow: 0 0 8px hsla(0 90% 48% / 0.5);
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-input {
    width: 320px;
    padding: 0.75rem 2.75rem 0.75rem 1.25rem;
    background: hsla(0 15% 15% / 0.6);
    border: 1px solid hsla(0 70% 45% / 0.3);
    border-radius: var(--radius-full);
    font-size: 0.9rem;
    color: hsl(0 0% 100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
  }

  .search-input::placeholder {
    color: hsl(0 0% 60%);
  }

  .search-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
    background: hsla(0 15% 18% / 0.8);
    box-shadow: 
      0 0 0 3px hsla(0 90% 48% / 0.1),
      0 4px 12px hsla(0 0% 0% / 0.2);
    transform: translateY(-1px);
  }

  .search-btn {
    position: absolute;
    right: 0.5rem;
    padding: 0.375rem;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-btn:hover {
    color: #ffffff;
  }

  .profile-btn {
    padding: 0.375rem;
    background: none;
    border: none;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .profile-btn:hover {
    color: hsl(var(--primary));
  }

  .user-info {
    display: flex;
    align-items: center;
    padding: 0.625rem 1.25rem;
    background: linear-gradient(135deg, hsla(0 90% 48% / 0.15), hsla(0 85% 42% / 0.15));
    border: 1px solid hsla(0 70% 45% / 0.3);
    border-radius: var(--radius-full);
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }
  
  .user-info:hover {
    background: linear-gradient(135deg, hsla(0 90% 48% / 0.25), hsla(0 85% 42% / 0.25));
    border-color: hsla(0 70% 45% / 0.5);
    box-shadow: 0 4px 12px hsla(0 90% 48% / 0.2);
  }

  .username {
    font-weight: 700;
    font-size: 0.875rem;
    color: hsl(0 0% 100%);
    text-shadow: 0 0 8px hsla(0 90% 48% / 0.3);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Apple SD Gothic Neo', 'Malgun Gothic', 'Nanum Gothic', sans-serif;
  }

  @media (max-width: 768px) {
    .nav-menu {
      display: none;
    }

    .search-input {
      width: 200px;
    }
  }
</style>

