<script lang="ts">
  import { onMount } from 'svelte';

  // 노드 타입 정의
  export interface TreeNode {
    id: string;
    text: string;
    depth: number;
    choices?: Array<{ text: string; tags: string[] }>;
    children?: TreeNode[];
    details?: {
      situation?: string;
      npc_emotions?: Record<string, string>;
      relations_update?: Record<string, string>;
    };
  }
  
  // Props
  let { 
    rootNode = null as TreeNode | null,
    selectedNodeId = '',
    maxDepth = 3,
    episodeTitle = '',
    onselectnode
  }: {
    rootNode?: TreeNode | null;
    selectedNodeId?: string;
    maxDepth?: number;
    episodeTitle?: string;
    onselectnode?: (e: CustomEvent<{ node: TreeNode }>) => void;
  } = $props();
  
  // 드래그 패닝 상태
  let scrollContainer: HTMLDivElement;
  let isDragging = $state(false);
  let startX = $state(0);
  let startY = $state(0);
  let scrollLeft = $state(0);
  let scrollTop = $state(0);
  
  function handleNodeClick(node: TreeNode) {
    // 드래그 중이면 노드 클릭 무시
    if (isDragging) return;
    
    console.log('노드 클릭됨:', node.id);
    if (onselectnode) {
      onselectnode(new CustomEvent('selectnode', { detail: { node } }));
    }
  }
  
  function isSelected(nodeId: string): boolean {
    return selectedNodeId === nodeId;
  }
  
  function getNodeColor(depth: number): string {
    const colors = [
      '#ff4d4f',   // depth 0 - 빨강
      '#1890ff',   // depth 1 - 파랑
      '#52c41a',   // depth 2 - 초록
      '#faad14',   // depth 3 - 주황
      '#722ed1',   // depth 4 - 보라
    ];
    return colors[Math.min(depth, colors.length - 1)];
  }

  function truncateText(text: string, maxLen: number = 60): string {
    if (!text) return '';
    return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
  }

  // 드래그 시작
  function handleMouseDown(e: MouseEvent) {
    // 노드 버튼 위에서는 드래그 시작 안함
    if ((e.target as HTMLElement).closest('.node-card')) {
      return;
    }
    
    isDragging = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    startY = e.pageY - scrollContainer.offsetTop;
    scrollLeft = scrollContainer.scrollLeft;
    scrollTop = scrollContainer.scrollTop;
  }

  // 드래그 중
  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - scrollContainer.offsetLeft;
    const y = e.pageY - scrollContainer.offsetTop;
    const walkX = (x - startX) * 1.5; // 속도 조절
    const walkY = (y - startY) * 1.5;
    
    scrollContainer.scrollLeft = scrollLeft - walkX;
    scrollContainer.scrollTop = scrollTop - walkY;
  }

  // 드래그 끝
  function handleMouseUp() {
    isDragging = false;
  }

  // 마우스가 영역을 벗어났을 때
  function handleMouseLeave() {
    isDragging = false;
  }

  // 줌 기능 (마우스 휠 + Ctrl)
  let scale = $state(1);
  
  function handleWheel(e: WheelEvent) {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      scale = Math.min(Math.max(0.5, scale + delta), 2);
    }
  }

  function resetZoom() {
    scale = 1;
  }
</script>

<div class="tree-container">
  <!-- 컨트롤 바 -->
  <div class="tree-controls">
    <div class="control-hint">
      <span class="hint-icon">✋</span>
      <span>빈 공간 드래그로 이동</span>
    </div>
    <div class="control-actions">
      <span class="zoom-label">확대: {Math.round(scale * 100)}%</span>
      <button type="button" class="zoom-btn" onclick={() => scale = Math.max(0.5, scale - 0.1)}>−</button>
      <button type="button" class="zoom-btn" onclick={() => scale = Math.min(2, scale + 0.1)}>+</button>
      <button type="button" class="zoom-btn reset" onclick={resetZoom}>↺</button>
    </div>
  </div>

  <!-- 스크롤 영역 -->
  <div 
    class="tree-scroll-area"
    class:dragging={isDragging}
    bind:this={scrollContainer}
    onmousedown={handleMouseDown}
    onmousemove={handleMouseMove}
    onmouseup={handleMouseUp}
    onmouseleave={handleMouseLeave}
    onwheel={handleWheel}
    role="application"
    aria-label="스토리 트리 뷰어"
  >
    {#if rootNode}
      <div class="tree-content" style="transform: scale({scale}); transform-origin: top left;">
        {#snippet renderNode(node: TreeNode, isRoot: boolean = false)}
          <div class="node-branch" class:is-root={isRoot}>
            <!-- 노드 카드 -->
            <button
              type="button"
              class="node-card"
              class:selected={isSelected(node.id)}
              style="--node-color: {getNodeColor(node.depth)}"
              onclick={() => handleNodeClick(node)}
            >
              <!-- 상단 뱃지 영역 -->
              <div class="node-badges">
                <span class="depth-badge" style="background: {getNodeColor(node.depth)}">
                  D{node.depth}
                </span>
                <span class="id-badge">{node.id}</span>
              </div>
              
              <!-- 노드 텍스트 -->
              <div class="node-body">
                <p class="node-text">{truncateText(node.text)}</p>
              </div>
              
              <!-- 하단 정보 -->
              <div class="node-footer">
                {#if node.choices && node.choices.length > 0}
                  <span class="choices-badge">
                    🎯 {node.choices.length}
                  </span>
                {/if}
                {#if node.children && node.children.length > 0}
                  <span class="children-badge">
                    🌿 {node.children.length}
                  </span>
                {/if}
              </div>
              
              <!-- 선택 인디케이터 -->
              {#if isSelected(node.id)}
                <div class="selected-indicator">
                  <span>✏️ 편집 중</span>
                </div>
              {/if}
            </button>
            
            <!-- 자식 노드들 -->
            {#if node.children && node.children.length > 0}
              <div class="children-wrapper">
                <div class="connector-vertical"></div>
                <div class="connector-horizontal"></div>
                <div class="children-row">
                  {#each node.children as child, idx}
                    <div class="child-branch">
                      <div class="connector-to-child"></div>
                      {@render renderNode(child, false)}
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/snippet}
        
        {@render renderNode(rootNode, true)}
      </div>
    {:else}
      <div class="empty-state">
        <span class="empty-icon">🌳</span>
        <p>트리 데이터가 없습니다.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .tree-container {
    width: 100%;
    height: 100%;
    min-height: 450px;
    max-height: 65vh;
    background: linear-gradient(135deg, 
      hsl(var(--background)) 0%,
      hsl(var(--muted) / 0.15) 100%);
    border-radius: var(--radius-md);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  /* 컨트롤 바 */
  .tree-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.625rem 1rem;
    background: hsl(var(--muted) / 0.4);
    border-bottom: 1px solid hsl(var(--border));
    flex-shrink: 0;
  }

  .control-hint {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: hsl(var(--muted-foreground));
  }

  .hint-icon {
    font-size: 1rem;
  }

  .control-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .zoom-label {
    font-size: 0.75rem;
    color: hsl(var(--muted-foreground));
    margin-right: 0.5rem;
    font-family: monospace;
  }

  .zoom-btn {
    width: 28px;
    height: 28px;
    border: 1px solid hsl(var(--border));
    border-radius: 6px;
    background: hsl(var(--card));
    color: hsl(var(--foreground));
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .zoom-btn:hover {
    background: hsl(var(--primary) / 0.1);
    border-color: hsl(var(--primary));
    color: hsl(var(--primary));
  }

  .zoom-btn.reset {
    font-size: 0.9rem;
  }
  
  /* 스크롤 영역 */
  .tree-scroll-area {
    flex: 1;
    overflow: scroll;
    padding: 1.5rem;
    cursor: grab;
    user-select: none;
  }

  .tree-scroll-area.dragging {
    cursor: grabbing;
  }
  
  /* 스크롤바 스타일 */
  .tree-scroll-area::-webkit-scrollbar {
    width: 12px;
    height: 12px;
    display: block;
  }
  
  .tree-scroll-area::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.3);
    border-radius: 6px;
  }
  
  .tree-scroll-area::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.6));
    border-radius: 6px;
    border: 2px solid hsl(var(--muted) / 0.3);
  }
  
  .tree-scroll-area::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary));
  }
  
  .tree-scroll-area::-webkit-scrollbar-corner {
    background: hsl(var(--muted) / 0.3);
  }
  
  .tree-content {
    display: inline-block;
    min-width: max-content;
    padding: 1rem;
    transition: transform 0.1s ease;
  }
  
  .node-branch {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  /* === 노드 카드 스타일 === */
  .node-card {
    width: 180px;
    height: 140px;
    padding: 0;
    background: hsl(var(--card));
    border: 2px solid hsl(var(--border));
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    text-align: left;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 3px 10px hsla(0 0% 0% / 0.12);
  }
  
  .node-card:hover {
    transform: translateY(-3px) scale(1.03);
    border-color: var(--node-color);
    box-shadow: 
      0 6px 20px hsla(0 0% 0% / 0.18),
      0 0 0 2px var(--node-color),
      0 0 16px color-mix(in srgb, var(--node-color) 35%, transparent);
  }
  
  .node-card.selected {
    border-color: hsl(var(--primary));
    background: linear-gradient(135deg, 
      hsl(var(--primary) / 0.12) 0%,
      hsl(var(--card)) 100%);
    box-shadow: 
      0 0 0 3px hsl(var(--primary) / 0.35),
      0 6px 20px hsl(var(--primary) / 0.25),
      0 0 24px hsl(var(--primary) / 0.15);
    transform: scale(1.05);
  }
  
  /* 뱃지 영역 */
  .node-badges {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.625rem;
    background: hsl(var(--muted) / 0.25);
    border-bottom: 1px solid hsl(var(--border));
  }
  
  .depth-badge {
    font-size: 0.6rem;
    font-weight: 700;
    color: white;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }
  
  .id-badge {
    font-size: 0.55rem;
    font-family: 'SF Mono', Monaco, monospace;
    color: hsl(var(--muted-foreground));
    background: hsl(var(--background));
    padding: 0.15rem 0.35rem;
    border-radius: 3px;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* 노드 본문 */
  .node-body {
    flex: 1;
    padding: 0.625rem;
    overflow: hidden;
  }
  
  .node-text {
    font-size: 0.75rem;
    line-height: 1.4;
    color: hsl(var(--foreground));
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-break: keep-all;
  }
  
  /* 하단 정보 */
  .node-footer {
    display: flex;
    gap: 0.375rem;
    padding: 0.4rem 0.625rem;
    background: hsl(var(--muted) / 0.15);
    border-top: 1px solid hsl(var(--border));
  }
  
  .choices-badge,
  .children-badge {
    font-size: 0.6rem;
    font-weight: 600;
    padding: 0.15rem 0.4rem;
    border-radius: 3px;
    background: hsl(var(--primary) / 0.12);
    color: hsl(var(--primary));
  }
  
  .children-badge {
    background: hsl(142 76% 36% / 0.12);
    color: hsl(142 76% 36%);
  }
  
  /* 선택 인디케이터 */
  .selected-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 0.3rem;
    background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.85));
    color: white;
    font-size: 0.65rem;
    font-weight: 700;
    text-align: center;
    animation: pulse-indicator 2s ease-in-out infinite;
  }
  
  @keyframes pulse-indicator {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.85; }
  }
  
  /* === 연결선 스타일 === */
  .children-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0;
    position: relative;
  }
  
  .connector-vertical {
    width: 2px;
    height: 20px;
    background: linear-gradient(180deg, #00d4ff, #00d4ff80);
    box-shadow: 0 0 6px #00d4ff60;
  }
  
  .connector-horizontal {
    height: 2px;
    background: linear-gradient(90deg, transparent, #00d4ff, transparent);
    box-shadow: 0 0 6px #00d4ff60;
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 180px);
    min-width: 0;
  }
  
  .children-row {
    display: flex;
    gap: 1.25rem;
    padding-top: 0;
  }
  
  .child-branch {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .connector-to-child {
    width: 2px;
    height: 20px;
    background: linear-gradient(180deg, #00d4ff80, #00d4ff);
    box-shadow: 0 0 6px #00d4ff60;
  }
  
  /* === 빈 상태 === */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 300px;
    color: hsl(var(--muted-foreground));
    gap: 1rem;
  }
  
  .empty-icon {
    font-size: 3rem;
    opacity: 0.5;
  }
  
  .empty-state p {
    font-size: 1rem;
    margin: 0;
  }
</style>
