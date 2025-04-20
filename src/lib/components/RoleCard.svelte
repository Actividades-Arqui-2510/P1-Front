<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from './Button.svelte';
    
    export let title: string;
    export let icon: string;
    export let description: string;
    export let route: string;
    export let variant: 'primary' | 'secondary' = 'primary';
  </script>
  
  <button
    type="button"
    class="role-card"
    on:click={() => goto(route)}
    aria-label={`Ingresar a ${title}`}
  >
    <div class="icon-container {variant}">
      <span class="role-icon">{icon}</span>
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </button>
  <style>
    .role-card {
      background-color: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 280px;
      transition: all 0.3s ease;
      cursor: pointer;
      border: none;
      outline: none;
      text-align: inherit;
      font: inherit;
    }
  
    .role-card:focus {
      box-shadow: 0 0 0 3px #2563eb55;
    }
  
    .role-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
  
    .role-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    }
  
    .icon-container {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
  
    .primary {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
    }
  
    .secondary {
      background: linear-gradient(135deg, #10b981, #059669);
    }
  
    .role-icon {
      font-size: 2.5rem;
      color: white;
    }
  
    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: #1f2937;
    }
  
    p {
      text-align: center;
      color: #6b7280;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
      line-height: 1.5;
    }
  
    .button-container {
      margin-top: auto;
    }
  </style>