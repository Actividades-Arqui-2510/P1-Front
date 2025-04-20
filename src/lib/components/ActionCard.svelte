<script lang="ts">
    export let icon: string;
    export let title: string;
    export let description: string = '';
    export let variant: 'primary' | 'secondary' | 'danger' | 'warning' | 'info' = 'primary';
  
    const variantStyles = {
      primary: {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-500',
        border: 'border-blue-200',
        hover: 'hover:border-blue-300 hover:bg-blue-100',
        textColor: 'text-blue-800'
      },
      secondary: {
        bg: 'bg-green-50',
        iconBg: 'bg-green-500',
        border: 'border-green-200',
        hover: 'hover:border-green-300 hover:bg-green-100',
        textColor: 'text-green-800'
      },
      danger: {
        bg: 'bg-red-50',
        iconBg: 'bg-red-500',
        border: 'border-red-200',
        hover: 'hover:border-red-300 hover:bg-red-100',
        textColor: 'text-red-800'
      },
      warning: {
        bg: 'bg-amber-50',
        iconBg: 'bg-amber-500',
        border: 'border-amber-200',
        hover: 'hover:border-amber-300 hover:bg-amber-100',
        textColor: 'text-amber-800'
      },
      info: {
        bg: 'bg-indigo-50',
        iconBg: 'bg-indigo-500',
        border: 'border-indigo-200',
        hover: 'hover:border-indigo-300 hover:bg-indigo-100',
        textColor: 'text-indigo-800'
      }
    };
  </script>
  
  <div class="action-card {variant}">
    <div class="icon-container">
      <span class="action-icon">{icon}</span>
    </div>
    <div class="content">
      <h3>{title}</h3>
      {#if description}
        <p>{description}</p>
      {/if}
      <div class="action-button">
        <slot />
      </div>
    </div>
  </div>
  
  <style>
    .action-card {
      display: flex;
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
      transition: all 0.2s ease;
      cursor: pointer;
      margin-bottom: 1rem;
    }
    
    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .icon-container {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .action-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    
    .content {
      flex: 1;
      padding: 1rem 1.5rem 1rem 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    h3 {
      margin: 0 0 0.25rem;
      font-size: 1.125rem;
      font-weight: 600;
    }
    
    p {
      margin: 0 0 0.75rem;
      font-size: 0.875rem;
      opacity: 0.75;
    }
    
    .action-button {
      margin-top: 0.5rem;
    }
    
    /* Variant styles */
    .primary .action-icon {
      background-color: #3b82f6;
      color: white;
    }
    
    .primary h3 {
      color: #1e40af;
    }
    
    .secondary .action-icon {
      background-color: #10b981;
      color: white;
    }
    
    .secondary h3 {
      color: #047857;
    }
    
    .danger .action-icon {
      background-color: #ef4444;
      color: white;
    }
    
    .danger h3 {
      color: #b91c1c;
    }
    
    .warning .action-icon {
      background-color: #f59e0b;
      color: white;
    }
    
    .warning h3 {
      color: #b45309;
    }
    
    .info .action-icon {
      background-color: #6366f1;
      color: white;
    }
    
    .info h3 {
      color: #4338ca;
    }
  </style>