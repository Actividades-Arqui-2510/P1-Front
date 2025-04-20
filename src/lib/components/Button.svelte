<script lang="ts">
    export let icon: string = '';
    export let variant: 'primary' | 'secondary' = 'primary';
    export let size: 'sm' | 'md' | 'lg' = 'md';
    export let disabled: boolean = false;
    
    // Permitir que los eventos pasen
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
  </script>
  
  <button 
    class="button {variant} {size}" 
    {disabled}
    on:click
  >
    {#if icon}
      <span class="icon">{icon}</span>
    {/if}
    <span class="text"><slot /></span>
  </button>
  
  <style>
    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      transition: all 0.2s ease;
      cursor: pointer;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      font-family: 'Poppins', sans-serif;
    }
  
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  
    .button:active {
      transform: translateY(0);
    }
  
    .primary {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
    }
  
    .secondary {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
    }
  
    .sm { padding: 0.5rem 1rem; font-size: 0.875rem; }
    .md { padding: 0.75rem 1.5rem; font-size: 1rem; }
    .lg { padding: 1rem 2rem; font-size: 1.125rem; }
  
    .icon {
      font-size: 1.25em;
    }
  </style>