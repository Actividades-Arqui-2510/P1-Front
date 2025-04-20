<script lang="ts">
    export let icon: string;
    export let text: string;
    export let active: boolean = false;
    export let danger: boolean = false;
  </script>
  
  <button
    type="button"
    class="nav-item {active ? 'active' : ''} {danger ? 'danger' : ''}"
    on:click
  >
    <span class="nav-icon">{icon}</span>
    <span class="nav-text">{text}</span>
  </button>
  
  <style>
    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      color: #4b5563;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
    }
    
    .nav-item:hover {
      background-color: #f3f4f6;
      color: #1f2937;
    }
    
    .nav-item.active {
      background-color: #eff6ff;
      color: #1d4ed8;
      border-right: 3px solid #3b82f6;
    }
    
    .nav-item.danger {
      color: #b91c1c;
    }
    
    .nav-item.danger:hover {
      background-color: #fee2e2;
      color: #991b1b;
    }
    
    .nav-icon {
      margin-right: 0.75rem;
      font-size: 1.25rem;
      width: 1.5rem;
      display: inline-flex;
      justify-content: center;
    }
    
    .nav-text {
      font-weight: 500;
      font-size: 0.9rem;
    }
  </style>