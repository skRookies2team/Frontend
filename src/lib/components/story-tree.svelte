<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
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
    episodeTitle = ''
  } = $props();
  
  const dispatch = createEventDispatcher<{
    selectNode: { node: TreeNode };
  }>();
  
  function handleNodeClick(node: TreeNode) {
    dispatch('selectNode', { node });
  }
  
  function isSelected(nodeId: string): boolean {
    return selectedNodeId === nodeId;
  }
  
  function getNodeColor(depth: number): string {
    const colors = [
      'hsl(0, 85%, 55%)',   // depth 0 - 빨강
      'hsl(200, 70%, 50%)',   // depth 1 - 파랑
      'hsl(160, 70%, 45%)',   // depth 2 - 초록
      'hsl(45, 80%, 50%)',    // depth 3 - 주황
      'hsl(0, 70%, 55%)',     // depth 4 - 빨강
    ];
    return colors[Math.min(depth, colors.length - 1)];
  }
</script>

<div class="tree-container">
  {#if episodeTitle}
    <h3 class="episode-title">📖 {episodeTitle}</h3>
  {/if}
  
  {#if rootNode}
    <div class="tree-wrapper">
      <div class="tree-level">
        {#snippet renderNode(node: TreeNode, isRoot: boolean = false)}
          <div class="node-branch" class:is-root={isRoot}>
            <button
              type="button"
              class="tree-node"
              class:selected={isSelected(node.id)}
              style="--node-color: {getNodeColor(node.depth)}"
              onclick={() => handleNodeClick(node)}
            >
              <div class="node-header">
                <span class="node-depth">D{node.depth}</span>
                <span class="node-id">{node.id}</span>
              </div>
              <div class="node-text">
                {node.text.length > 80 ? node.text.slice(0, 80) + '...' : node.text}
              </div>
              {#if node.choices && node.choices.length > 0}
                <div class="node-choices">
                  {node.choices.length}개 선택지
                </div>
              {/if}
            </button>
            
            {#if node.children && node.children.length > 0}
              <div class="children-container">
                <div class="connector-line"></div>
                <div class="children-nodes">
                  {#each node.children as child}
                    {@render renderNode(child, false)}
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/snippet}
        
        {@render renderNode(rootNode, true)}
      </div>
    </div>
  {:else}
    <div class="empty-state">
      <p>트리 데이터가 없습니다.</p>
    </div>
  {/if}
</div>

<style>
  .tree-container {
    width: 100%;
    overflow-x: auto;
    padding: 1rem;
  }
  
  .episode-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .tree-wrapper {
    display: flex;
    justify-content: center;
    min-width: fit-content;
  }
  
  .tree-level {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .node-branch {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .node-branch.is-root {
    /* 루트 노드 스타일 */
  }
  
  .tree-node {
    min-width: 180px;
    max-width: 220px;
    padding: 0.75rem;
    background: hsl(var(--card));
    border: 2px solid var(--node-color, hsl(var(--border)));
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    position: relative;
  }
  
  .tree-node:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px hsla(var(--primary) / 0.2);
  }
  
  .tree-node.selected {
    border-color: hsl(var(--primary));
    background: hsl(var(--primary) / 0.1);
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.3);
  }
  
  .node-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
  }
  
  .node-depth {
    background: var(--node-color, hsl(var(--muted)));
    color: white;
    padding: 0.125rem 0.375rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
  }
  
  .node-id {
    color: hsl(var(--muted-foreground));
    font-family: monospace;
  }
  
  .node-text {
    font-size: 0.8rem;
    line-height: 1.4;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
    word-break: keep-all;
  }
  
  .node-choices {
    font-size: 0.7rem;
    color: hsl(var(--muted-foreground));
    background: hsl(var(--muted) / 0.5);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    text-align: center;
  }
  
  .children-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 0.5rem;
  }
  
  .connector-line {
    width: 2px;
    height: 1.5rem;
    background: #00e0ff;
    box-shadow: 0 0 6px rgba(0, 224, 255, 0.7);
  }
  
  .children-nodes {
    display: flex;
    gap: 1rem;
    position: relative;
  }
  
  .children-nodes::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 180px);
    height: 2px;
    background: #00e0ff;
    box-shadow: 0 0 6px rgba(0, 224, 255, 0.7);
  }
  
  .children-nodes > .node-branch {
    position: relative;
  }
  
  .children-nodes > .node-branch::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 1rem;
    background: #00e0ff;
    box-shadow: 0 0 6px rgba(0, 224, 255, 0.7);
  }
  
  .children-nodes > .node-branch > .tree-node {
    margin-top: 1rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    color: hsl(var(--muted-foreground));
  }
  
  /* 스크롤 가능하도록 */
  .tree-container::-webkit-scrollbar {
    height: 8px;
  }
  
  .tree-container::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.3);
    border-radius: 4px;
  }
  
  .tree-container::-webkit-scrollbar-thumb {
    background: hsl(var(--muted));
    border-radius: 4px;
  }
  
  .tree-container::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--muted-foreground));
  }
</style>








