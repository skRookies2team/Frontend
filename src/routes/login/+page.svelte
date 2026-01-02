<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { api, ApiError } from '$lib/api';
  import { goto } from '$app/navigation';
  
  let username = $state('');
  let email = $state('');
  let password = $state('');
  let isSignUp = $state(false);
  let nickname = $state('');
  let loading = $state(false);
  let errorMessage = $state('');
  
  async function handleSubmit(e: Event) {
    e.preventDefault();
    errorMessage = '';
    loading = true;
    
    try {
      if (isSignUp) {
        // 회원가입
        await api.auth.signUp({
          username,
          email,
          password,
          nickname
        });
        alert('회원가입이 완료되었습니다!');
        goto('/', { invalidateAll: true });
      } else {
        // 로그인
        const response = await api.auth.login({
          username,
          password
        });
        
        console.log('로그인 응답:', response);
        
        alert('로그인 되었습니다!');

        // 페이지 이동 (모든 데이터 새로고침)
        goto('/', { invalidateAll: true });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        errorMessage = error.data?.message || '요청에 실패했습니다.';
      } else {
        errorMessage = '네트워크 오류가 발생했습니다.';
      }
      console.error('Auth error:', error);
    } finally {
      loading = false;
    }
  }
</script>

<div class="login-page">
  <div class="login-container">
    <!-- Left Side - Branding -->
    <div class="branding-section">
      <div class="branding-content">
        <h1 class="brand-title">
          <span class="gradient-text">IF Story</span>
        </h1>
        <p class="brand-subtitle">인터랙티브 스토리의 세계로</p>
        <ul class="features-list">
          <li>
            <span class="feature-icon">📚</span>
            <span>수백 가지 인터랙티브 소설</span>
          </li>
          <li>
            <span class="feature-icon">✨</span>
            <span>AI 기반 스토리 생성</span>
          </li>
          <li>
            <span class="feature-icon">🎨</span>
            <span>나만의 작품 창작</span>
          </li>
          <li>
            <span class="feature-icon">👥</span>
            <span>창작자 커뮤니티</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="form-section">
      <div class="form-container">
        <!-- Tab Toggle -->
        <div class="form-tabs">
          <button 
            class="tab"
            class:active={!isSignUp}
            onclick={() => isSignUp = false}
          >
            로그인
          </button>
          <button 
            class="tab"
            class:active={isSignUp}
            onclick={() => isSignUp = true}
          >
            회원가입
          </button>
        </div>

        <!-- Form -->
        <form class="login-form" onsubmit={handleSubmit}>
          {#if errorMessage}
            <div class="error-message">{errorMessage}</div>
          {/if}

          <div class="form-group">
            <label for="username" class="form-label">사용자명</label>
            <input 
              id="username"
              type="text"
              class="form-input"
              placeholder="사용자명을 입력하세요"
              bind:value={username}
              disabled={loading}
              required
            />
          </div>

          {#if isSignUp}
            <div class="form-group">
              <label for="nickname" class="form-label">닉네임</label>
              <input 
                id="nickname"
                type="text"
                class="form-input"
                placeholder="닉네임을 입력하세요"
                bind:value={nickname}
                disabled={loading}
                required
              />
            </div>

            <div class="form-group">
              <label for="email" class="form-label">이메일</label>
              <input 
                id="email"
                type="email"
                class="form-input"
                placeholder="email@example.com"
                bind:value={email}
                disabled={loading}
                required
              />
            </div>
          {/if}

          <div class="form-group">
            <label for="password" class="form-label">비밀번호</label>
            <input 
              id="password"
              type="password"
              class="form-input"
              placeholder="비밀번호를 입력하세요"
              bind:value={password}
              disabled={loading}
              required
            />
          </div>

          {#if !isSignUp}
            <div class="form-options">
              <label class="checkbox-label">
                <input type="checkbox" />
                <span>로그인 상태 유지</span>
              </label>
              <button type="button" class="link-btn">비밀번호 찾기</button>
            </div>
          {/if}

          <Button type="submit" class="submit-btn w-full" size="lg" disabled={loading}>
            {loading ? '처리중...' : isSignUp ? '회원가입' : '로그인'}
          </Button>
        </form>

        <!-- Footer -->
        <div class="form-footer">
          {#if isSignUp}
            <p>
              이미 계정이 있으신가요?
              <button type="button" class="link-btn" onclick={() => isSignUp = false}>
                로그인하기
              </button>
            </p>
          {:else}
            <p>
              계정이 없으신가요?
              <button type="button" class="link-btn" onclick={() => isSignUp = true}>
                회원가입하기
              </button>
            </p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(var(--background));
  }

  .login-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 1200px;
    width: 100%;
    min-height: 600px;
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  }

  /* Branding Section */
  .branding-section {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
    padding: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .branding-content {
    color: white;
  }

  .brand-title {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 1rem;
  }

  .gradient-text {
    background: white;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .brand-subtitle {
    font-size: 1.25rem;
    margin-bottom: 3rem;
    opacity: 0.9;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .features-list li {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.125rem;
  }

  .feature-icon {
    font-size: 2rem;
  }

  /* Form Section */
  .form-section {
    padding: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .form-container {
    width: 100%;
    max-width: 400px;
  }

  .form-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    border-bottom: 2px solid hsl(var(--border));
  }

  .tab {
    flex: 1;
    padding: 1rem;
    background: none;
    border: none;
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s;
  }

  .tab:hover {
    color: hsl(var(--foreground));
  }

  .tab.active {
    color: hsl(var(--primary));
    border-bottom-color: hsl(var(--primary));
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .form-input {
    padding: 0.75rem 1rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    font-size: 1rem;
    color: hsl(var(--foreground));
    transition: all 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .link-btn {
    background: none;
    border: none;
    color: hsl(var(--primary));
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
  }

  .link-btn:hover {
    color: hsl(var(--primary) / 0.8);
  }

  .form-footer {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .error-message {
    padding: 0.75rem;
    background: hsl(0 84.2% 60.2% / 0.1);
    border: 1px solid hsl(0 84.2% 60.2%);
    border-radius: var(--radius-md);
    color: hsl(0 84.2% 60.2%);
    font-size: 0.875rem;
    text-align: center;
  }

  @media (max-width: 968px) {
    .login-container {
      grid-template-columns: 1fr;
    }

    .branding-section {
      display: none;
    }

    .form-section {
      padding: 2rem 1rem;
    }
  }
</style>

