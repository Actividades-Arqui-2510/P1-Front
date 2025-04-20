<script lang="ts">
    import { onMount } from 'svelte';
    
    export let title: string;
    export let userName: string = '';
    export let userAvatar: string = '👤';
    
    let menuOpen = false;
    let visible = false;
    
    onMount(() => {
      setTimeout(() => {
        visible = true;
      }, 100);
    });
    
    function toggleMenu() {
      menuOpen = !menuOpen;
    }
  </script>
  
  <div class="dashboard-container {visible ? 'visible' : ''}">
    <header class="dashboard-header">
      <div class="header-left">
        <button class="menu-toggle" on:click={toggleMenu}>
          <span class="menu-icon">☰</span>
        </button>
        <h1>{title}</h1>
      </div>
      
      <div class="user-profile">
        <span class="user-avatar">{userAvatar}</span>
        <span class="user-name">{userName}</span>
      </div>
    </header>
    
    <div class="dashboard-content">
      <aside class="sidebar {menuOpen ? 'open' : ''}">
        <div class="sidebar-header">
          <h2>Menú</h2>
          <button class="close-menu" on:click={toggleMenu}>✕</button>
        </div>
        
        <nav>
          <slot name="sidebar" />
        </nav>
      </aside>
      
      <main>
        <slot />
      </main>
    </div>
  </div>
  
  <style>
    .dashboard-container {
      min-height: 100vh;
      background-color: #f9fafb;
      display: flex;
      flex-direction: column;
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .dashboard-header {
      background-color: white;
      padding: 1rem 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 10;
      position: sticky;
      top: 0;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .menu-toggle {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #4b5563;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
    }
    
    h1 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
    
    .user-profile {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      border-radius: 2rem;
      transition: all 0.2s;
    }
    
    .user-profile:hover {
      background-color: #f3f4f6;
    }
    
    .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1.25rem;
    }
    
    .user-name {
      font-weight: 500;
      color: #374151;
    }
    
    .dashboard-content {
      display: flex;
      flex: 1;
    }
    
    .sidebar {
      width: 280px;
      background-color: white;
      box-shadow: 1px 0 3px rgba(0, 0, 0, 0.05);
      padding: 1.5rem 0;
      transition: transform 0.3s ease;
      z-index: 5;
    }
    
    .sidebar-header {
      padding: 0 1.5rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f3f4f6;
      margin-bottom: 1rem;
    }
    
    .sidebar-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0;
    }
    
    .close-menu {
      display: none;
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #6b7280;
    }
    
    main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }
    
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        transform: translateX(-100%);
        box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      }
      
      .sidebar.open {
        transform: translateX(0);
      }
      
      .close-menu {
        display: block;
      }
    }
  </style>