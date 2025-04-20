<script lang="ts">
    import { onMount } from 'svelte';
    import Button from './Button.svelte';
    
    // Props for customization
    export let title: string;
    export let description: string;
    export let icon: string;
    export let iconGradient: string = '135deg, #10b981, #059669';
    export let entityLabel: string;
    export let entityIdPlaceholder: string = 'Ejemplo: 123';
    export let entityAvatarIcon: string = '👤';
    
    // Methods passed from parent
    export let search: (id: string) => Promise<any>;
    
    // Local state
    let entityId = "";
    let entity: any | null = null;
    let loading = false;
    let error = "";
    let searched = false;
    let visible = false;
    
    onMount(() => {
      setTimeout(() => {
        visible = true;
      }, 100);
    });
    
    async function handleSearch() {
      // Validar entrada
      if (!entityId?.trim()) {
        error = `Por favor ingrese un ID de ${entityLabel.toLowerCase()}`;
        return;
      }
      
      loading = true;
      error = "";
      searched = true;
      entity = null;
      
      try {
        entity = await search(entityId.trim());
        if (!entity) {
          error = `No se encontró ningún ${entityLabel.toLowerCase()} con el ID: ${entityId}`;
        }
      } catch (err) {
        console.error(`Error al buscar ${entityLabel.toLowerCase()}:`, err);
        error = `Ocurrió un error al buscar el ${entityLabel.toLowerCase()}`;
      } finally {
        loading = false;
      }
    }
    
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        handleSearch();
      }
    }
    
    function resetSearch() {
      entityId = "";
      entity = null;
      error = "";
      searched = false;
    }
  </script>
  
  <div class="search-container {visible ? 'visible' : ''}">
    <div class="search-card">
      <div class="card-header">
        <div class="icon-wrapper" style="background: linear-gradient({iconGradient})">
          <span class="header-icon">{icon}</span>
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      
      <div class="search-form">
        <div class="input-group">
          <label for="entityId">ID del {entityLabel}</label>
          <div class="input-container">
            <span class="input-icon">🔍</span>
            <input 
              id="entityId"
              type="text" 
              bind:value={entityId} 
              placeholder={entityIdPlaceholder}
              on:keydown={handleKeyDown}
              disabled={loading}
            />
          </div>
        </div>
        
        <div class="button-container">
          <Button 
            variant="primary" 
            on:click={handleSearch}
            disabled={loading}
          >
            {loading ? `Buscando...` : `Buscar ${entityLabel}`}
          </Button>
        </div>
      </div>
      
      {#if error}
        <div class="error-message">
          <span>⚠️</span> {error}
        </div>
      {/if}
      
      {#if searched && entity}
        <div class="result-container">
          <h2>Información del {entityLabel}</h2>
          
          <slot name="result" {entity} />
          
          <div class="action-row">
            <Button 
              variant="secondary" 
              size="sm"
              on:click={resetSearch}
            >
              Nueva Búsqueda
            </Button>
          </div>
        </div>
      {/if}
      
      <div class="card-footer">
        <a href="/" class="back-link">
          <span>←</span> Volver al inicio
        </a>
      </div>
    </div>
  </div>
  
  <style>
    .search-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem 1rem;
      background: linear-gradient(135deg, #f0f9ff, #e6f7ff);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .search-card {
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      width: 100%;
      max-width: 600px;
      overflow: hidden;
    }
    
    .card-header {
      padding: 2rem;
      text-align: center;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .icon-wrapper {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }
    
    .header-icon {
      font-size: 2rem;
      color: white;
    }
    
    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem;
    }
    
    p {
      color: #6b7280;
      margin: 0;
    }
    
    .search-form {
      padding: 2rem;
    }
    
    .input-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.95rem;
    }
    
    .input-container {
      position: relative;
    }
    
    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.25rem;
    }
    
    input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 3rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      font-family: 'Poppins', sans-serif;
      box-sizing: border-box;
    }
    
    input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
    }
    
    input::placeholder {
      color: #9ca3af;
    }
    
    .button-container {
      margin-top: 1rem;
    }
    
    .error-message {
      margin: 0 2rem 2rem;
      padding: 0.75rem 1rem;
      background-color: #fee2e2;
      border-radius: 8px;
      color: #b91c1c;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
    
    .result-container {
      padding: 0 2rem 2rem;
      animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .result-container h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1rem;
    }
    
    .action-row {
      margin-top: 1.5rem;
      display: flex;
      justify-content: center;
    }
    
    .card-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid #f3f4f6;
      text-align: center;
    }
    
    .back-link {
      color: #6b7280;
      text-decoration: none;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s ease;
    }
    
    .back-link:hover {
      color: #3b82f6;
    }
  </style>