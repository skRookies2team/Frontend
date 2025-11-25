<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { page } from '$app/stores';
  import { api } from '$lib/api';
  import { onMount } from 'svelte';
  
  let searchQuery = $state('');
  let isLoggedIn = $state(false);
  let username = $state('');
  
  // 로그인 상태 확인
  function checkAuth() {
    isLoggedIn = api.auth.isAuthenticated();
    if (isLoggedIn) {
      username = api.auth.getCurrentUsername() || '사용자';
    }
  }
  
  onMount(() => {
    checkAuth();
    
    // 페이지 변경 시마다 체크
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  });
  
  async function handleLogout() {
    try {
      await api.auth.logout();
      isLoggedIn = false;
      username = '';
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  }
  
  $effect(() => {
    // You can handle search query changes here
    console.log('Search query:', searchQuery);
  });
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
          class="search-input"
        />
        <button type="button" class="search-btn" aria-label="검색">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      
      {#if isLoggedIn}
        <!-- 로그인 상태 -->
        <div class="user-info">
          <span class="username">{username}</span>
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
    </div>
  </div>
</nav>

<style>
  .navbar {
    position: sticky;
    top: 0;
    background: hsl(var(--background));
    border-bottom: 1px solid hsl(var(--border));
    z-index: 50;
    padding: 0.75rem 0;
  }

  .nav-wrapper {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 2rem;
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
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #ef4444, #f97316);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
  }

  .nav-menu {
    display: flex;
    gap: 2rem;
  }

  .nav-link {
    color: hsl(var(--foreground));
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: color 0.2s;
    position: relative;
  }

  .nav-link:hover {
    color: hsl(var(--primary));
  }

  .nav-link.active {
    color: hsl(var(--primary));
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 0;
    right: 0;
    height: 2px;
    background: hsl(var(--primary));
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
    padding: 0.625rem 2.5rem 0.625rem 1rem;
    background: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-full);
    font-size: 0.9rem;
    transition: all 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
    background: hsl(var(--background));
  }

  .search-btn {
    position: absolute;
    right: 0.5rem;
    padding: 0.375rem;
    background: none;
    border: none;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .profile-btn {
    padding: 0.375rem;
    background: none;
    border: none;
    color: hsl(var(--foreground));
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
    padding: 0.5rem 1rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
  }

  .username {
    font-weight: 600;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
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

