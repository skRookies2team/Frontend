<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { X, Save, RotateCcw, Settings, BookOpen } from 'lucide-svelte';
  
  let { 
    onClose,
    onSave,
    onRestart,
    onSettings
  }: {
    onClose: () => void;
    onSave?: () => void;
    onRestart?: () => void;
    onSettings?: () => void;
  } = $props();
</script>

<!-- Add tabindex to fix a11y warning -->
<div 
  class="menu-overlay" 
  role="dialog" 
  aria-modal="true" 
  tabindex="0"
  onkeydown={(e) => e.key === 'Escape' && onClose()}
>
  <div class="menu-content" role="document">
    <div class="menu-header">
      <h2 class="menu-title">게임 메뉴</h2>
      <Button variant="ghost" size="icon" onclick={onClose}>
        <X class="w-5 h-5" />
      </Button>
    </div>
    
    <div class="menu-body">
      <div class="menu-items">
        <button class="menu-item" onclick={onClose}>
          <BookOpen class="w-5 h-5" />
          <span>게임 계속하기</span>
        </button>
        
        {#if onSave}
          <button class="menu-item" onclick={() => { onSave?.(); onClose(); }}>
            <Save class="w-5 h-5" />
            <span>저장하기</span>
          </button>
        {/if}
        
        {#if onSettings}
          <button class="menu-item" onclick={() => { onSettings?.(); onClose(); }}>
            <Settings class="w-5 h-5" />
            <span>설정</span>
          </button>
        {/if}
        
        {#if onRestart}
          <button class="menu-item destructive" onclick={() => { onRestart?.(); onClose(); }}>
            <RotateCcw class="w-5 h-5" />
            <span>처음부터 다시 시작</span>
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
    animation: fadeIn 0.2s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .menu-content {
    background: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-xl);
    max-width: 400px;
    width: 100%;
    animation: slideUp 0.3s ease;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid hsl(var(--border));
  }
  
  .menu-title {
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  .menu-body {
    padding: 1rem;
  }
  
  .menu-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .menu-item:hover {
    background: hsl(var(--muted));
    border-color: hsl(var(--primary));
  }
  
  .menu-item.destructive {
    color: hsl(var(--destructive));
  }
  
  .menu-item.destructive:hover {
    background: hsl(var(--destructive) / 0.1);
    border-color: hsl(var(--destructive));
  }
</style>
