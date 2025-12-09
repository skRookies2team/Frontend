<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { api, type PostResponseDto, type CommentResponseDto, ApiError } from '$lib/api';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  let postId = $derived(parseInt($page.params.postId));
  let post: PostResponseDto | null = $state(null);
  let comments: CommentResponseDto[] = $state([]);
  let loading = $state(true);
  let error = $state('');
  
  // 댓글 작성
  let commentContent = $state('');
  let submitting = $state(false);
  let replyTo: number | null = $state(null);
  let isLoggedIn = $state(false);
  
  onMount(() => {
    // 로그인 상태 확인
    isLoggedIn = api.auth.isAuthenticated();
    
    loadPost();
    loadComments();
  });
  
  async function loadPost() {
    loading = true;
    error = '';
    
    try {
      post = await api.post.getPost(postId);
    } catch (err) {
      console.error('Failed to load post:', err);
      error = '게시글을 불러오는데 실패했습니다.';
    } finally {
      loading = false;
    }
  }
  
  async function loadComments() {
    try {
      comments = await api.comment.getComments(postId);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  }
  
  async function handleLike() {
    if (!post) return;
    
    // 로그인 체크
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      goto('/login');
      return;
    }
    
    try {
      await api.post.toggleLike(postId);
      await loadPost();
    } catch (err) {
      console.error('Failed to toggle like:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  }
  
  async function handleBookmark() {
    if (!post) return;
    
    // 로그인 체크
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      goto('/login');
      return;
    }
    
    try {
      await api.post.toggleBookmark(postId);
      await loadPost();
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
      alert('북마크 처리에 실패했습니다.');
    }
  }
  
  async function handleCommentSubmit() {
    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    
    // 로그인 체크 (이중 체크)
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      goto('/login');
      return;
    }
    
    submitting = true;
    try {
      await api.comment.createComment(postId, {
        content: commentContent,
        parentId: replyTo
      });
      
      commentContent = '';
      replyTo = null;
      await loadComments();
    } catch (err) {
      console.error('Failed to create comment:', err);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      submitting = false;
    }
  }
  
  async function handleCommentLike(commentId: number) {
    // 로그인 체크
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      goto('/login');
      return;
    }
    
    try {
      await api.comment.toggleLike(commentId);
      await loadComments();
    } catch (err) {
      console.error('Failed to toggle comment like:', err);
    }
  }
  
  function handleReply(commentId: number, authorName: string) {
    // 로그인 체크
    if (!isLoggedIn) {
      alert('댓글 작성은 로그인이 필요합니다.');
      goto('/login');
      return;
    }
    
    replyTo = commentId;
    commentContent = `@${authorName} `;
  }
  
  function cancelReply() {
    replyTo = null;
    commentContent = '';
  }
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function getPostTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      GENERAL: '일반',
      STORY: '스토리',
      QUESTION: '질문',
      GUIDE: '가이드',
      NOTICE: '공지'
    };
    return labels[type] || type;
  }
</script>

<div class="post-detail-page">
  <div class="container">
    {#if loading}
      <div class="loading">로딩중...</div>
    {:else if error}
      <div class="error">{error}</div>
    {:else if post}
      <!-- 게시글 헤더 -->
      <div class="post-header">
        <Button variant="ghost" onclick={() => goto('/community')}>
          ← 목록으로
        </Button>
      </div>
      
      <!-- 게시글 본문 -->
      <article class="post-card">
        <div class="post-meta">
          <span class="post-type">{getPostTypeLabel(post.type)}</span>
          <span class="post-date">{formatDate(post.createdAt)}</span>
        </div>
        
        <h1 class="post-title">{post.title}</h1>
        
        <div class="post-author">
          <div class="author-avatar">
            {post.authorNickname.charAt(0)}
          </div>
          <div class="author-info">
            <div class="author-name">{post.authorNickname}</div>
            <div class="author-username">@{post.authorUsername}</div>
          </div>
        </div>
        
        <div class="post-content">
          {@html post.content.replace(/\n/g, '<br>')}
        </div>
        
        <div class="post-actions">
          <button 
            class="action-btn"
            class:active={post.isLiked}
            onclick={handleLike}
          >
            {post.isLiked ? '❤️' : '🤍'} {post.likeCount}
          </button>
          
          <button 
            class="action-btn"
            class:active={post.isBookmarked}
            onclick={handleBookmark}
          >
            {post.isBookmarked ? '⭐' : '☆'} 북마크
          </button>
          
          <div class="action-info">
            👁️ {post.viewCount} · 💬 {post.commentCount}
          </div>
        </div>
      </article>
      
      <!-- 댓글 섹션 -->
      <section class="comments-section">
        <h2 class="section-title">
          💬 댓글 {comments.length}
        </h2>
        
        <!-- 댓글 작성 -->
        <div class="comment-write">
          {#if !isLoggedIn}
            <div class="login-required">
              <p class="login-required-text">
                💬 댓글을 작성하려면 로그인이 필요합니다
              </p>
              <Button onclick={() => goto('/login')}>
                로그인하기
              </Button>
            </div>
          {:else}
            {#if replyTo !== null}
              <div class="reply-indicator">
                답글 작성 중
                <button onclick={cancelReply}>취소</button>
              </div>
            {/if}
            
            <textarea 
              class="comment-input"
              placeholder="댓글을 입력하세요..."
              bind:value={commentContent}
              rows="3"
            ></textarea>
            
            <div class="comment-write-footer">
              <Button onclick={handleCommentSubmit} disabled={submitting}>
                {submitting ? '작성 중...' : '댓글 작성'}
              </Button>
            </div>
          {/if}
        </div>
        
        <!-- 댓글 목록 -->
        <div class="comments-list">
          {#if comments.length === 0}
            <div class="empty-comments">
              첫 번째 댓글을 작성해보세요!
            </div>
          {:else}
            {#each comments as comment}
              <div class="comment-item">
                <div class="comment-avatar">
                  {comment.authorNickname.charAt(0)}
                </div>
                
                <div class="comment-content">
                  <div class="comment-header">
                    <span class="comment-author">{comment.authorNickname}</span>
                    <span class="comment-username">@{comment.authorUsername}</span>
                    <span class="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  
                  <div class="comment-text">
                    {comment.content}
                  </div>
                  
                  <div class="comment-actions">
                    <button 
                      class="comment-action-btn"
                      class:active={comment.isLiked}
                      onclick={() => handleCommentLike(comment.commentId)}
                    >
                      {comment.isLiked ? '❤️' : '🤍'} {comment.likeCount}
                    </button>
                    
                    <button 
                      class="comment-action-btn"
                      onclick={() => handleReply(comment.commentId, comment.authorNickname)}
                    >
                      💬 답글
                    </button>
                  </div>
                  
                  <!-- 대댓글 -->
                  {#if comment.replies && comment.replies.length > 0}
                    <div class="replies">
                      {#each comment.replies as reply}
                        <div class="reply-item">
                          <div class="comment-avatar small">
                            {reply.authorNickname.charAt(0)}
                          </div>
                          
                          <div class="comment-content">
                            <div class="comment-header">
                              <span class="comment-author">{reply.authorNickname}</span>
                              <span class="comment-username">@{reply.authorUsername}</span>
                              <span class="comment-date">{formatDate(reply.createdAt)}</span>
                            </div>
                            
                            <div class="comment-text">
                              {reply.content}
                            </div>
                            
                            <div class="comment-actions">
                              <button 
                                class="comment-action-btn"
                                class:active={reply.isLiked}
                                onclick={() => handleCommentLike(reply.commentId)}
                              >
                                {reply.isLiked ? '❤️' : '🤍'} {reply.likeCount}
                              </button>
                            </div>
                          </div>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          {/if}
        </div>
      </section>
    {/if}
  </div>
</div>

<style>
  .post-detail-page {
    min-height: 100vh;
    background: hsl(var(--background));
    padding: 2rem 0;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .loading,
  .error {
    text-align: center;
    padding: 3rem;
    color: hsl(var(--muted-foreground));
  }

  .error {
    color: hsl(0 84.2% 60.2%);
  }

  .post-header {
    margin-bottom: 1.5rem;
  }

  .post-card {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .post-type {
    padding: 0.25rem 0.75rem;
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border-radius: var(--radius-full);
    font-weight: 600;
  }

  .post-date {
    color: hsl(var(--muted-foreground));
  }

  .post-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: hsl(var(--foreground));
    line-height: 1.3;
  }

  .post-author {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .author-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.25rem;
  }

  .author-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .author-name {
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .author-username {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .post-content {
    font-size: 1.125rem;
    line-height: 1.8;
    color: hsl(var(--foreground));
    margin-bottom: 2rem;
    white-space: pre-wrap;
  }

  .post-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid hsl(var(--border));
  }

  .action-btn {
    padding: 0.5rem 1rem;
    background: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: hsl(var(--muted) / 0.7);
  }

  .action-btn.active {
    background: hsl(var(--primary) / 0.1);
    border-color: hsl(var(--primary));
    color: hsl(var(--primary));
  }

  .action-info {
    margin-left: auto;
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
  }

  /* 댓글 섹션 */
  .comments-section {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: hsl(var(--foreground));
  }

  .comment-write {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .login-required {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
    background: linear-gradient(135deg, hsla(0 90% 48% / 0.1), hsla(0 85% 42% / 0.05));
    border: 2px dashed hsl(var(--border));
    border-radius: var(--radius-lg);
    text-align: center;
    gap: 1.5rem;
  }

  .login-required-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    margin: 0;
  }

  .reply-indicator {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-md);
    font-size: 0.875rem;
  }

  .reply-indicator button {
    margin-left: auto;
    padding: 0.25rem 0.5rem;
    background: none;
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-sm);
    cursor: pointer;
  }

  .comment-input {
    width: 100%;
    padding: 0.75rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
    margin-bottom: 0.75rem;
  }

  .comment-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
  }

  .comment-write-footer {
    display: flex;
    justify-content: flex-end;
  }

  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .empty-comments {
    text-align: center;
    padding: 3rem;
    color: hsl(var(--muted-foreground));
  }

  .comment-item,
  .reply-item {
    display: flex;
    gap: 0.75rem;
  }

  .comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
  }

  .comment-avatar.small {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }

  .comment-content {
    flex: 1;
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  .comment-author {
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .comment-username {
    color: hsl(var(--muted-foreground));
  }

  .comment-date {
    margin-left: auto;
    color: hsl(var(--muted-foreground));
  }

  .comment-text {
    color: hsl(var(--foreground));
    line-height: 1.6;
    margin-bottom: 0.75rem;
  }

  .comment-actions {
    display: flex;
    gap: 0.75rem;
  }

  .comment-action-btn {
    padding: 0.25rem 0.5rem;
    background: none;
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .comment-action-btn:hover {
    background: hsl(var(--muted));
  }

  .comment-action-btn.active {
    background: hsl(var(--primary) / 0.1);
    border-color: hsl(var(--primary));
    color: hsl(var(--primary));
  }

  .replies {
    margin-top: 1rem;
    padding-left: 1rem;
    border-left: 2px solid hsl(var(--border));
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .post-title {
      font-size: 1.5rem;
    }

    .post-content {
      font-size: 1rem;
    }

    .post-card,
    .comments-section {
      padding: 1.5rem;
    }
  }
</style>



