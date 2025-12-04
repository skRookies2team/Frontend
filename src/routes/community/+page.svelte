<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { api, PostType, type PostResponseDto } from '$lib/api';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let activeTab = $state<'popular' | 'recent' | 'following'>('popular');
  let posts: PostResponseDto[] = $state([]);
  let loading = $state(true);
  let currentPage = $state(0);
  let totalPages = $state(0);
  let error = $state('');
  let isLoggedIn = $state(false);
  
  // 글쓰기 모달
  let showWriteModal = $state(false);
  let postTitle = $state('');
  let postContent = $state('');
  let postType = $state<PostType>(PostType.GENERAL);
  let submitting = $state(false);
  
  // 파일 업로드
  let uploading = $state(false);
  let uploadProgress = $state(0);
  let uploadingFileName = $state('');
  
  
  // 에디터 설정
  let fontSize = $state(15);
  let fontFamily = $state('본문');
  let isBold = $state(false);
  let isItalic = $state(false);
  let isUnderline = $state(false);
  let isStrikethrough = $state(false);
  let textAlign = $state('left');
  
  let contentEditableElement: HTMLDivElement;

  onMount(() => {
    // 로그인 상태 확인
    isLoggedIn = api.auth.isAuthenticated();
    
    loadPosts();
  });

  async function loadPosts() {
    loading = true;
    error = '';
    
    try {
      // Load posts based on active tab
      const response = await api.post.getPosts({
        page: currentPage,
        size: 10,
        sort: activeTab === 'recent' ? ['createdAt,desc'] : ['likeCount,desc']
      });
      
      posts = response.content;
      totalPages = response.totalPages;
    } catch (err) {
      console.error('Failed to load posts:', err);
      error = '게시글을 불러오는데 실패했습니다.';
    } finally {
      loading = false;
    }
  }

  async function handleLike(postId: number) {
    // 로그인 체크
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      goto('/login');
      return;
    }
    
    try {
      await api.post.toggleLike(postId);
      // Reload posts to update like count
      await loadPosts();
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  }

  async function handleBookmark(postId: number) {
    // 로그인 체크
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      goto('/login');
      return;
    }
    
    try {
      await api.post.toggleBookmark(postId);
      // Reload posts to update bookmark status
      await loadPosts();
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  }

  function goToPost(postId: number) {
    goto(`/community/${postId}`);
  }

  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${diffDays}일 전`;
  }
  
  // HTML 태그 제거 및 미디어 표시 함수
  function getPreviewText(htmlContent: string): string {
    let text = htmlContent;
    
    // 이미지 태그를 [이미지]로 대체
    text = text.replace(/<img[^>]*>/gi, ' [이미지] ');
    
    // 동영상 태그를 [동영상]으로 대체
    text = text.replace(/<video[^>]*>.*?<\/video>/gi, ' [동영상] ');
    
    // 나머지 모든 HTML 태그 제거
    text = text.replace(/<[^>]+>/g, '');
    
    // HTML 엔티티 디코딩
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&quot;/g, '"');
    
    // 연속된 공백 제거
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }
  
  function openWriteModal() {
    // 로그인 체크
    if (!isLoggedIn) {
      alert('글 작성은 로그인이 필요합니다.');
      goto('/login');
      return;
    }
    showWriteModal = true;
  }
  
  function closeWriteModal() {
    if (uploading) {
      alert('파일 업로드가 진행 중입니다. 잠시만 기다려주세요.');
      return;
    }
    
    showWriteModal = false;
    postTitle = '';
    postContent = '';
    postType = PostType.GENERAL;
    
    // 에디터 초기화
    if (contentEditableElement) {
      contentEditableElement.innerHTML = '';
    }
    fontSize = 15;
    fontFamily = '본문';
    isBold = false;
    isItalic = false;
    isUnderline = false;
    isStrikethrough = false;
    
    // 업로드 상태 초기화
    uploading = false;
    uploadProgress = 0;
    uploadingFileName = '';
  }
  
  // 에디터 기능 함수들
  function execCommand(command: string, value?: string) {
    document.execCommand(command, false, value);
    contentEditableElement?.focus();
  }
  
  function toggleBold() {
    isBold = !isBold;
    execCommand('bold');
  }
  
  function toggleItalic() {
    isItalic = !isItalic;
    execCommand('italic');
  }
  
  function toggleUnderline() {
    isUnderline = !isUnderline;
    execCommand('underline');
  }
  
  function toggleStrikethrough() {
    isStrikethrough = !isStrikethrough;
    execCommand('strikeThrough');
  }
  
  function changeFontSize(size: number) {
    fontSize = size;
    execCommand('fontSize', '3');
    // 선택된 텍스트의 폰트 크기 변경
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = `${size}px`;
      range.surroundContents(span);
    }
  }
  
  function changeFontFamily(family: string) {
    fontFamily = family;
    const fontMap: Record<string, string> = {
      '본문': 'inherit',
      '굴림': 'Gulim',
      '돋움': 'Dotum',
      '맑은 고딕': 'Malgun Gothic',
      '나눔고딕': 'Nanum Gothic',
      '나눔명조': 'Nanum Myeongjo'
    };
    execCommand('fontName', fontMap[family] || family);
  }
  
  function setTextAlign(align: string) {
    textAlign = align;
    execCommand(`justify${align.charAt(0).toUpperCase() + align.slice(1)}`);
  }
  
  function insertLink() {
    const url = prompt('링크 URL을 입력하세요:');
    if (url) {
      execCommand('createLink', url);
    }
  }
  
  function insertHorizontalRule() {
    execCommand('insertHorizontalRule');
  }
  
  function undo() {
    execCommand('undo');
  }
  
  function redo() {
    execCommand('redo');
  }
  
  function setHeading(level: string) {
    if (level === 'p') {
      execCommand('formatBlock', '<p>');
    } else {
      execCommand('formatBlock', `<${level}>`);
    }
  }
  
  async function insertImageFromEditor() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;
      
      uploading = true;
      
      try {
        // 여러 파일을 순차적으로 업로드
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          uploadingFileName = file.name;
          uploadProgress = 0;
          
          // 파일 크기 검증 (5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert(`${file.name}은(는) 5MB를 초과합니다.`);
            continue;
          }
          
          console.log(`이미지 업로드 시작: ${file.name}`);
          
          // S3에 업로드
          const fileKey = await api.upload.uploadImageFile(file, (progress) => {
            uploadProgress = progress;
          });
          
          console.log(`이미지 업로드 완료: ${fileKey}`);
          
          // S3 URL 생성 (다운로드 URL 받기)
          const imageUrl = await api.upload.getDownloadUrl(fileKey);
          
          console.log(`이미지 URL: ${imageUrl}`);
          
          // 에디터에 이미지 삽입 (더 안전한 방법)
          if (contentEditableElement) {
            // 이미지 생성
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = file.name;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '8px';
            img.style.margin = '8px 0';
            img.style.display = 'block';
            
            // 이미지 로드 완료 후 표시
            img.onload = () => {
              console.log('이미지 로드 완료');
            };
            
            img.onerror = () => {
              console.error('이미지 로드 실패:', imageUrl);
              alert('이미지를 불러올 수 없습니다.');
            };
            
            // 에디터에 직접 삽입
            contentEditableElement.appendChild(img);
            
            // 줄바꿈 추가
            const br = document.createElement('br');
            contentEditableElement.appendChild(br);
            
            // 에디터 포커스 및 스크롤
            contentEditableElement.focus();
            img.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            console.log(`에디터에 이미지 삽입 완료`);
          } else {
            console.error('contentEditableElement가 없습니다');
            alert('에디터가 준비되지 않았습니다. 페이지를 새로고침해주세요.');
          }
        }
        
        console.log(`총 ${files.length}개 이미지 업로드 완료`);
        // alert 제거 - 사용자 경험 개선
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
        alert('이미지 업로드에 실패했습니다.');
      } finally {
        uploading = false;
        uploadProgress = 0;
        uploadingFileName = '';
      }
    };
    input.click();
  }
  
  async function insertVideoFromEditor() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;
      
      uploading = true;
      
      try {
        // 여러 파일을 순차적으로 업로드
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          uploadingFileName = file.name;
          uploadProgress = 0;
          
          // 파일 크기 검증 (100MB)
          if (file.size > 100 * 1024 * 1024) {
            alert(`${file.name}은(는) 100MB를 초과합니다.`);
            continue;
          }
          
          console.log(`동영상 업로드 시작: ${file.name}`);
          
          // S3에 업로드
          const fileKey = await api.upload.uploadVideoFile(file, (progress) => {
            uploadProgress = progress;
          });
          
          console.log(`동영상 업로드 완료: ${fileKey}`);
          
          // S3 URL 생성 (다운로드 URL 받기)
          const videoUrl = await api.upload.getDownloadUrl(fileKey);
          
          console.log(`동영상 URL: ${videoUrl}`);
          
          // 에디터에 동영상 삽입 (더 안전한 방법)
          if (contentEditableElement) {
            const video = document.createElement('video');
            video.src = videoUrl;
            video.controls = true;
            video.style.maxWidth = '100%';
            video.style.height = 'auto';
            video.style.borderRadius = '8px';
            video.style.margin = '8px 0';
            video.style.display = 'block';
            
            video.onloadedmetadata = () => {
              console.log('동영상 로드 완료');
            };
            
            video.onerror = () => {
              console.error('동영상 로드 실패:', videoUrl);
              alert('동영상을 불러올 수 없습니다.');
            };
            
            // 에디터에 직접 삽입
            contentEditableElement.appendChild(video);
            
            // 줄바꿈 추가
            const br = document.createElement('br');
            contentEditableElement.appendChild(br);
            
            // 에디터 포커스 및 스크롤
            contentEditableElement.focus();
            video.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            console.log(`에디터에 동영상 삽입 완료`);
          } else {
            console.error('contentEditableElement가 없습니다');
            alert('에디터가 준비되지 않았습니다. 페이지를 새로고침해주세요.');
          }
        }
        
        console.log(`총 ${files.length}개 동영상 업로드 완료`);
        // alert 제거 - 사용자 경험 개선
      } catch (err) {
        console.error('동영상 업로드 실패:', err);
        alert('동영상 업로드에 실패했습니다.');
      } finally {
        uploading = false;
        uploadProgress = 0;
        uploadingFileName = '';
      }
    };
    input.click();
  }
  
  function getEditorContent(): string {
    return contentEditableElement?.innerHTML || postContent;
  }
  
  async function submitPost() {
    const editorContent = getEditorContent();
    
    if (!postTitle.trim() || !editorContent.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }
    
    if (uploading) {
      alert('파일 업로드가 진행 중입니다. 잠시만 기다려주세요.');
      return;
    }
    
    submitting = true;
    try {
      await api.post.createPost({
        title: postTitle,
        content: editorContent,
        type: postType
      });
      
      alert('게시글이 작성되었습니다!');
      closeWriteModal();
      await loadPosts();
    } catch (err) {
      console.error('게시글 작성 실패:', err);
      alert('게시글 작성에 실패했습니다.');
    } finally {
      submitting = false;
    }
  }

  // Watch tab changes
  $effect(() => {
    activeTab;
    loadPosts();
  });
</script>

<div class="community-page">
  <div class="community-container">
    <!-- Header -->
    <header class="community-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">커뮤니티</h1>
          <p class="page-description">창작자들과 소통하고 영감을 나누세요</p>
        </div>
        <Button size="lg" onclick={openWriteModal}>
          ✍️ 글쓰기
        </Button>
      </div>
    </header>

    <!-- Tabs -->
    <div class="tabs">
      <button 
        class="tab"
        class:active={activeTab === 'popular'}
        onclick={() => activeTab = 'popular'}
      >
        🔥 인기
      </button>
      <button 
        class="tab"
        class:active={activeTab === 'recent'}
        onclick={() => activeTab = 'recent'}
      >
        🆕 최신
      </button>
      <button 
        class="tab"
        class:active={activeTab === 'following'}
        onclick={() => activeTab = 'following'}
      >
        ⭐ 팔로잉
      </button>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <!-- Posts -->
      <div class="posts-section">
        {#if loading}
          <div class="loading-message">로딩중...</div>
        {:else if error}
          <div class="error-message">{error}</div>
        {:else if posts.length === 0}
          <div class="empty-message">게시글이 없습니다.</div>
        {:else}
          {#each posts as post}
            <article class="post-card" onclick={() => goToPost(post.postId)}>
              <div class="post-header">
                <div class="author-info">
                  <div class="author-avatar">👤</div>
                  <div>
                    <div class="author-name">{post.authorNickname}</div>
                    <div class="post-time">{formatTimeAgo(post.createdAt)}</div>
                  </div>
                </div>
                <span class="post-type">{post.type}</span>
              </div>
              
              <h2 class="post-title">{post.title}</h2>
              <p class="post-content">{getPreviewText(post.content).substring(0, 200)}{getPreviewText(post.content).length > 200 ? '...' : ''}</p>
              
              <div class="post-footer">
                <button 
                  class="action-btn" 
                  class:active={post.isLiked}
                  onclick={(e) => { e.stopPropagation(); handleLike(post.postId); }}
                >
                  {post.isLiked ? '❤️' : '🤍'} {post.likeCount}
                </button>
                <button class="action-btn" onclick={(e) => { e.stopPropagation(); goToPost(post.postId); }}>
                  💬 {post.commentCount}
                </button>
                <button 
                  class="action-btn"
                  class:active={post.isBookmarked}
                  onclick={(e) => { e.stopPropagation(); handleBookmark(post.postId); }}
                >
                  {post.isBookmarked ? '⭐' : '☆'} 북마크
                </button>
                <span class="view-count">👁️ {post.viewCount}</span>
              </div>
            </article>
          {/each}

          {#if totalPages > 1}
            <div class="pagination">
              <Button 
                variant="outline" 
                disabled={currentPage === 0}
                onclick={() => { currentPage--; loadPosts(); }}
              >
                이전
              </Button>
              <span>{currentPage + 1} / {totalPages}</span>
              <Button 
                variant="outline" 
                disabled={currentPage >= totalPages - 1}
                onclick={() => { currentPage++; loadPosts(); }}
              >
                다음
              </Button>
            </div>
          {/if}
        {/if}
      </div>

      <!-- Sidebar -->
      <aside class="sidebar">
        <!-- Popular Tags -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">인기 태그</h3>
          <div class="tags-grid">
            <button class="tag-btn">#판타지</button>
            <button class="tag-btn">#로맨스</button>
            <button class="tag-btn">#추리</button>
            <button class="tag-btn">#SF</button>
            <button class="tag-btn">#팁</button>
            <button class="tag-btn">#질문</button>
            <button class="tag-btn">#AI</button>
            <button class="tag-btn">#완성</button>
          </div>
        </div>

        <!-- Active Users -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">활동중인 작가</h3>
          <div class="users-list">
            {#each ['김작가', '이소설', '박스토리', '최문학', '정이야기'] as user}
              <div class="user-item">
                <div class="user-status"></div>
                <span>{user}</span>
              </div>
            {/each}
          </div>
        </div>

        <!-- Community Rules -->
        <div class="sidebar-card">
          <h3 class="sidebar-title">커뮤니티 규칙</h3>
          <ul class="rules-list">
            <li>서로를 존중해주세요</li>
            <li>건설적인 피드백을 나눠요</li>
            <li>스포일러 주의!</li>
            <li>저작권을 지켜요</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</div>

<!-- 글쓰기 모달 -->
{#if showWriteModal}
  <div class="modal-overlay" onclick={closeWriteModal}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <div class="modal-header">
        <h2 class="modal-title">✍️ 새 글 쓰기</h2>
        <button class="modal-close" onclick={closeWriteModal}>✕</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="post-type" class="form-label">카테고리</label>
          <select 
            id="post-type" 
            class="form-select" 
            bind:value={postType}
            style="background-color: #1a1a1a; color: #ffffff;"
          >
            <option value={PostType.GENERAL} style="background-color: #1a1a1a; color: #ffffff;">일반</option>
            <option value={PostType.STORY} style="background-color: #1a1a1a; color: #ffffff;">스토리</option>
            <option value={PostType.QUESTION} style="background-color: #1a1a1a; color: #ffffff;">질문</option>
            <option value={PostType.GUIDE} style="background-color: #1a1a1a; color: #ffffff;">가이드</option>
            <option value={PostType.NOTICE} style="background-color: #1a1a1a; color: #ffffff;">공지</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="post-title" class="form-label">제목</label>
          <input 
            id="post-title"
            type="text" 
            class="form-input" 
            placeholder="제목을 입력하세요"
            bind:value={postTitle}
            maxlength="200"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">내용</label>
          
          <!-- 에디터 툴바 -->
          <div class="editor-toolbar">
            <!-- 첫 번째 줄: 미디어 및 기능 버튼 -->
            <div class="toolbar-row">
              <button type="button" class="toolbar-btn media-btn" onclick={insertImageFromEditor} title="사진" disabled={uploading}>
                <span class="btn-icon">📷</span>
                <span class="btn-label">사진</span>
              </button>
              <button type="button" class="toolbar-btn media-btn" onclick={insertVideoFromEditor} title="동영상" disabled={uploading}>
                <span class="btn-icon">🎥</span>
                <span class="btn-label">동영상</span>
              </button>
              <button type="button" class="toolbar-btn media-btn" onclick={insertLink} title="링크">
                <span class="btn-icon">🔗</span>
                <span class="btn-label">링크</span>
              </button>
              <button type="button" class="toolbar-btn media-btn" onclick={insertHorizontalRule} title="구분선">
                <span class="btn-icon">➖</span>
                <span class="btn-label">구분선</span>
              </button>
              
              <div class="toolbar-divider"></div>
              
              <!-- 정렬 버튼 -->
              <button 
                type="button" 
                class="toolbar-btn" 
                class:active={textAlign === 'left'}
                onclick={() => setTextAlign('left')} 
                title="왼쪽 정렬"
              >
                ◀️
              </button>
              <button 
                type="button" 
                class="toolbar-btn"
                class:active={textAlign === 'center'}
                onclick={() => setTextAlign('center')} 
                title="가운데 정렬"
              >
                ⏸️
              </button>
              <button 
                type="button" 
                class="toolbar-btn"
                class:active={textAlign === 'right'}
                onclick={() => setTextAlign('right')} 
                title="오른쪽 정렬"
              >
                ▶️
              </button>
            </div>
            
            <!-- 두 번째 줄: 텍스트 스타일 -->
            <div class="toolbar-row">
              <!-- 문단 스타일 -->
              <select 
                class="toolbar-select" 
                onchange={(e) => setHeading((e.target as HTMLSelectElement).value)}
              >
                <option value="p">본문</option>
                <option value="h1">제목 1</option>
                <option value="h2">제목 2</option>
                <option value="h3">제목 3</option>
              </select>
              
              <!-- 글꼴 선택 -->
              <select 
                class="toolbar-select" 
                bind:value={fontFamily}
                onchange={(e) => changeFontFamily((e.target as HTMLSelectElement).value)}
              >
                <option value="본문">본문</option>
                <option value="굴림">굴림</option>
                <option value="돋움">돋움</option>
                <option value="맑은 고딕">맑은 고딕</option>
                <option value="나눔고딕">나눔고딕</option>
                <option value="나눔명조">나눔명조</option>
              </select>
              
              <!-- 글자 크기 -->
              <select 
                class="toolbar-select toolbar-select-small" 
                bind:value={fontSize}
                onchange={(e) => changeFontSize(Number((e.target as HTMLSelectElement).value))}
              >
                <option value="10">10</option>
                <option value="12">12</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="18">18</option>
                <option value="20">20</option>
                <option value="24">24</option>
                <option value="28">28</option>
                <option value="32">32</option>
                <option value="36">36</option>
              </select>
              
              <div class="toolbar-divider"></div>
              
              <!-- 텍스트 스타일 버튼 -->
              <button 
                type="button" 
                class="toolbar-btn"
                class:active={isBold}
                onclick={toggleBold} 
                title="굵게"
              >
                <strong>B</strong>
              </button>
              <button 
                type="button" 
                class="toolbar-btn"
                class:active={isItalic}
                onclick={toggleItalic} 
                title="기울임"
              >
                <em>I</em>
              </button>
              <button 
                type="button" 
                class="toolbar-btn"
                class:active={isUnderline}
                onclick={toggleUnderline} 
                title="밑줄"
              >
                <u>U</u>
              </button>
              <button 
                type="button" 
                class="toolbar-btn"
                class:active={isStrikethrough}
                onclick={toggleStrikethrough} 
                title="취소선"
              >
                <s>S</s>
              </button>
              
              <div class="toolbar-divider"></div>
              
              <!-- 실행 취소/다시 실행 -->
              <button 
                type="button" 
                class="toolbar-btn"
                onclick={undo} 
                title="실행 취소"
              >
                ↶
              </button>
              <button 
                type="button" 
                class="toolbar-btn"
                onclick={redo} 
                title="다시 실행"
              >
                ↷
              </button>
            </div>
          </div>
          
          <!-- 에디터 영역 -->
          <div 
            class="editor-content"
            contenteditable="true"
            bind:this={contentEditableElement}
            placeholder="내용을 입력하세요"
          ></div>
          
          <!-- 업로드 진행률 표시 -->
          {#if uploading}
            <div class="upload-progress-container">
              <div class="upload-status">
                <div class="upload-icon">⏳</div>
                <div class="upload-info">
                  <p class="upload-text">
                    {uploadingFileName} 업로드 중...
                  </p>
                  <div class="upload-progress-bar">
                    <div class="upload-progress-fill" style="width: {uploadProgress}%"></div>
                  </div>
                  <p class="upload-percentage">{uploadProgress.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>
      
      <div class="modal-footer">
        <Button variant="outline" onclick={closeWriteModal} disabled={submitting || uploading}>
          취소
        </Button>
        <Button onclick={submitPost} disabled={submitting || uploading}>
          {uploading ? '업로드 중...' : submitting ? '작성 중...' : '작성하기'}
        </Button>
      </div>
    </div>
  </div>
{/if}

<style>
  .community-page {
    min-height: calc(100vh - 60px);
    background: hsl(var(--background));
  }

  .community-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .community-header {
    margin-bottom: 2rem;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .page-title {
    font-size: 2.75rem;
    font-weight: 900;
    margin-bottom: 0.75rem;
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 80%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
    animation: fadeIn 0.6s ease-out;
  }

  .page-description {
    font-size: 1.25rem;
    color: hsl(var(--muted-foreground));
    animation: fadeIn 0.6s ease-out 0.2s backwards;
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    border-bottom: 1px solid hsla(250 50% 50% / 0.2);
    position: relative;
  }
  
  .tabs::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, hsla(250 50% 50% / 0.3), transparent);
  }

  .tab {
    padding: 1rem 1.75rem;
    background: none;
    border: none;
    font-size: 1rem;
    font-weight: 700;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
  }

  .tab:hover {
    color: hsl(var(--foreground));
    transform: translateY(-2px);
  }

  .tab.active {
    color: hsl(0 0% 100%);
    border-bottom-color: transparent;
    background: var(--gradient-primary);
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    box-shadow: 0 -4px 12px hsla(250 100% 70% / 0.3);
  }

  /* Content Grid */
  .content-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
  }

  .posts-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .post-card {
    position: relative;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.75rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    box-shadow: var(--glow-card);
    animation: fadeIn 0.5s ease-out backwards;
  }
  
  .post-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, hsla(250 100% 70% / 0.05), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .post-card:hover {
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.3),
      0 0 0 1px hsla(250 100% 70% / 0.2);
    transform: translateY(-4px);
    border-color: hsl(var(--border-bright));
  }
  
  .post-card:hover::before {
    opacity: 1;
  }
  
  .post-card:nth-child(2) { animation-delay: 0.1s; }
  .post-card:nth-child(3) { animation-delay: 0.2s; }
  .post-card:nth-child(4) { animation-delay: 0.3s; }
  .post-card:nth-child(5) { animation-delay: 0.4s; }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .author-info {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .author-avatar {
    font-size: 2rem;
  }

  .author-name {
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .post-time {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .post-title {
    font-size: 1.375rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 85%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.01em;
    position: relative;
    z-index: 1;
  }

  .post-content {
    color: hsl(var(--muted-foreground));
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .post-tags {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .tag {
    padding: 0.25rem 0.75rem;
    background: hsl(var(--muted));
    color: hsl(var(--foreground));
    border-radius: var(--radius-full);
    font-size: 0.875rem;
  }

  .post-footer {
    display: flex;
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid hsl(var(--border));
  }

  .action-btn {
    padding: 0.625rem 1.25rem;
    background: hsla(240 12% 15% / 0.6);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1;
  }

  .action-btn:hover {
    color: hsl(var(--primary));
    background: hsla(250 100% 70% / 0.1);
    border-color: hsl(var(--border-bright));
    transform: translateY(-2px);
  }

  .action-btn.active {
    color: hsl(0 0% 100%);
    background: var(--gradient-primary);
    border-color: hsl(var(--primary));
    box-shadow: 0 4px 12px hsla(250 100% 70% / 0.3);
  }

  .post-type {
    padding: 0.375rem 1rem;
    background: linear-gradient(135deg, hsla(250 100% 70% / 0.2), hsla(280 100% 65% / 0.15));
    border: 1px solid hsla(250 50% 50% / 0.3);
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 700;
    color: hsl(var(--accent));
    text-transform: uppercase;
    letter-spacing: 0.05em;
    position: relative;
    z-index: 1;
  }

  .view-count {
    margin-left: auto;
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
  }

  .loading-message,
  .error-message,
  .empty-message {
    padding: 4rem 3rem;
    text-align: center;
    color: hsl(var(--muted-foreground));
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    box-shadow: var(--glow-card);
    font-size: 1.125rem;
    font-weight: 600;
    position: relative;
    overflow: hidden;
  }
  
  .loading-message::before,
  .error-message::before,
  .empty-message::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, hsla(250 100% 70% / 0.05), transparent 70%);
    animation: pulse-bg 2s ease-in-out infinite;
  }

  .error-message {
    background: linear-gradient(135deg, hsla(0 85% 60% / 0.1), hsl(240 12% 10%));
  }
  
  .error-message::before {
    background: radial-gradient(circle at center, hsla(0 85% 60% / 0.08), transparent 70%);
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
  }

  /* Sidebar */
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sidebar-card {
    position: relative;
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.75rem;
    box-shadow: var(--glow-card);
    transition: all 0.3s ease;
    animation: fadeIn 0.6s ease-out backwards;
  }
  
  .sidebar-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--radius-lg);
    background: linear-gradient(135deg, hsla(250 100% 70% / 0.05), transparent);
    pointer-events: none;
  }
  
  .sidebar-card:hover {
    border-color: hsl(var(--border-bright));
    transform: translateX(-2px);
  }

  .sidebar-title {
    font-size: 1.125rem;
    font-weight: 800;
    margin-bottom: 1.25rem;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    font-size: 0.95rem;
  }

  .tags-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .tag-btn {
    padding: 0.625rem;
    background: hsla(240 12% 15% / 0.6);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .tag-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-primary);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .tag-btn span {
    position: relative;
    z-index: 1;
  }

  .tag-btn:hover {
    background: var(--gradient-primary);
    color: white;
    border-color: hsl(var(--primary));
    box-shadow: 0 4px 12px hsla(250 100% 70% / 0.3);
    transform: translateY(-2px);
  }
  
  .tag-btn:hover::before {
    opacity: 1;
  }

  .users-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .user-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
  }

  .user-status {
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
  }

  .rules-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .rules-list li {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    padding-left: 1.25rem;
    position: relative;
  }

  .rules-list li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: hsl(var(--primary));
  }

  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }

    .sidebar {
      display: none;
    }
  }

  /* 모달 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: hsla(240 15% 6% / 0.92);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
    animation: fadeIn 0.3s ease-out;
  }

  .modal-content {
    background: linear-gradient(135deg, hsl(240 12% 12%), hsl(240 12% 10%));
    border: 1px solid hsl(var(--border-bright));
    border-radius: var(--radius-xl);
    width: 100%;
    max-width: 1800px;
    max-height: 90vh;
    box-shadow: 
      0 24px 64px hsla(0 0% 0% / 0.5),
      0 0 0 1px hsla(250 100% 70% / 0.2),
      inset 0 1px 0 hsla(255 255 255 / 0.1);
    animation: fadeIn 0.4s ease-out, float 0.4s ease-out;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 1001;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    border-bottom: 1px solid hsla(250 50% 50% / 0.2);
    background: linear-gradient(135deg, hsla(250 100% 70% / 0.05), transparent);
  }

  .modal-title {
    font-size: 1.75rem;
    font-weight: 900;
    background: linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 80%));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.02em;
  }

  .modal-close {
    background: hsla(240 12% 15% / 0.6);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    font-size: 1.5rem;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    line-height: 1;
    transition: all 0.3s ease;
  }

  .modal-close:hover {
    color: hsl(var(--foreground));
    background: hsla(250 100% 70% / 0.1);
    border-color: hsl(var(--border-bright));
    transform: scale(1.1);
  }

  .modal-body {
    padding: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .form-hint {
    font-size: 0.8rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }

  .form-select,
  .form-input {
    width: 100%;
    padding: 0.875rem 1rem;
    background: hsla(240 15% 8% / 0.8);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 1rem;
    transition: all 0.3s ease;
    font-weight: 500;
  }
  
  .form-select:hover,
  .form-input:hover {
    border-color: hsl(var(--border-bright));
  }

  /* Select 드롭다운 옵션 스타일 - 강제 적용 */
  .form-select {
    background-color: #1a1a1a !important;
    color: #ffffff !important;
  }

  .form-select option {
    background-color: #1a1a1a !important;
    color: #ffffff !important;
    padding: 0.5rem;
  }

  /* 라이트 모드용 미디어 쿼리 */
  @media (prefers-color-scheme: light) {
    .form-select {
      background-color: #ffffff !important;
      color: #000000 !important;
    }

    .form-select option {
      background-color: #ffffff !important;
      color: #000000 !important;
    }
  }

  .form-select:focus,
  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: hsl(var(--primary));
  }

  .form-textarea {
    width: 100%;
    padding: 0.75rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 1rem;
    resize: vertical;
    min-height: 200px;
    font-family: inherit;
  }

  /* 리치 에디터 스타일 */
  .editor-toolbar {
    background: hsl(var(--muted) / 0.3);
    border: 1px solid hsl(var(--border));
    border-bottom: none;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    padding: 0.5rem;
  }

  .toolbar-row {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    flex-wrap: wrap;
    padding: 0.25rem 0;
  }

  .toolbar-row + .toolbar-row {
    border-top: 1px solid hsl(var(--border));
    margin-top: 0.5rem;
    padding-top: 0.75rem;
  }

  .toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
    padding: 0.375rem 0.625rem;
    background: hsla(240 12% 15% / 0.6);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toolbar-btn:hover {
    background: hsla(250 100% 70% / 0.15);
    border-color: hsl(var(--border-bright));
    transform: translateY(-1px);
  }

  .toolbar-btn.active {
    background: var(--gradient-primary);
    color: white;
    border-color: hsl(var(--primary));
    box-shadow: 0 2px 8px hsla(250 100% 70% / 0.3);
  }

  .toolbar-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* 미디어 버튼 (사진, 동영상, 링크, 구분선) 스타일 */
  .toolbar-btn.media-btn {
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    min-width: auto;
  }

  .toolbar-btn.media-btn .btn-icon {
    font-size: 1rem;
    line-height: 1;
  }

  .toolbar-btn.media-btn .btn-label {
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .toolbar-divider {
    width: 1px;
    height: 24px;
    background: hsl(var(--border));
    margin: 0 0.5rem;
  }

  .toolbar-select {
    padding: 0.25rem 0.5rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-sm);
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    cursor: pointer;
    min-width: 100px;
  }

  .toolbar-select-small {
    min-width: 60px;
  }

  .toolbar-select:hover {
    border-color: hsl(var(--primary));
  }

  .toolbar-select:focus {
    outline: none;
    border-color: hsl(var(--primary));
  }

  .toolbar-select option {
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    padding: 0.5rem;
  }

  .editor-content {
    width: 100%;
    min-height: 300px;
    max-height: 500px;
    padding: 1.25rem;
    background: hsla(240 15% 8% / 0.8);
    border: 1px solid hsl(var(--border));
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
    color: hsl(var(--foreground));
    font-size: 1rem;
    line-height: 1.7;
    overflow-y: auto;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  .editor-content:focus {
    outline: none;
    border-color: hsl(var(--primary));
    box-shadow: 0 0 0 3px hsla(250 100% 70% / 0.1);
    background: hsla(240 15% 10% / 0.9);
  }

  .editor-content:empty:before {
    content: attr(placeholder);
    color: hsl(var(--muted-foreground));
    pointer-events: none;
  }

  /* 에디터 내부 요소 스타일 */
  .editor-content img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    margin: 0.5rem 0;
  }

  .editor-content a {
    color: hsl(var(--primary));
    text-decoration: underline;
  }

  .editor-content hr {
    border: none;
    border-top: 2px solid hsl(var(--border));
    margin: 1rem 0;
  }

  .editor-content h1, .editor-content h2, .editor-content h3,
  .editor-content h4, .editor-content h5, .editor-content h6 {
    margin: 1rem 0 0.5rem;
    font-weight: 700;
  }

  .editor-content h1 { font-size: 2rem; }
  .editor-content h2 { font-size: 1.5rem; }
  .editor-content h3 { font-size: 1.25rem; }

  .editor-content p {
    margin: 0.5rem 0;
  }

  .editor-content video {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    margin: 0.5rem 0;
  }

  /* 업로드 진행률 */
  .upload-progress-container {
    margin-top: 1rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, hsla(250 100% 70% / 0.1), hsla(280 100% 65% / 0.05));
    border: 1px solid hsl(var(--border-bright));
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 16px hsla(250 100% 70% / 0.2);
  }

  .upload-status {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  .upload-icon {
    font-size: 2.5rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    filter: drop-shadow(0 0 8px hsla(250 100% 70% / 0.5));
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.1); }
  }

  .upload-info {
    flex: 1;
  }

  .upload-text {
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.75rem;
    font-size: 1rem;
  }

  .upload-progress-bar {
    width: 100%;
    height: 0.625rem;
    background: hsla(240 12% 15% / 0.8);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: 0.5rem;
    box-shadow: inset 0 2px 4px hsla(0 0% 0% / 0.3);
  }

  .upload-progress-fill {
    height: 100%;
    background: var(--gradient-primary);
    border-radius: var(--radius-full);
    transition: width 0.3s ease;
    box-shadow: 0 0 12px hsla(250 100% 70% / 0.4);
  }

  .upload-percentage {
    font-size: 0.875rem;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: right;
    margin: 0;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding: 2rem;
    border-top: 1px solid hsla(250 50% 50% / 0.2);
    background: linear-gradient(180deg, transparent, hsla(250 100% 70% / 0.02));
  }


  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: 1fr;
    }

    .sidebar {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 2rem;
    }

    .header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .modal-content {
      max-width: 100%;
      margin: 0.5rem;
    }

    .editor-toolbar {
      padding: 0.25rem;
    }

    .toolbar-row {
      gap: 0.125rem;
    }

    .toolbar-btn {
      min-width: 28px;
      height: 28px;
      font-size: 0.75rem;
      padding: 0.125rem 0.25rem;
    }

    .toolbar-btn.media-btn {
      padding: 0.25rem 0.5rem;
    }

    .toolbar-btn.media-btn .btn-icon {
      font-size: 0.875rem;
    }

    .toolbar-btn.media-btn .btn-label {
      font-size: 0.7rem;
    }

    .toolbar-select {
      font-size: 0.75rem;
      min-width: 80px;
      padding: 0.25rem;
    }

    .toolbar-select-small {
      min-width: 50px;
    }

    .editor-content {
      min-height: 200px;
      font-size: 0.875rem;
    }
  }
</style>

