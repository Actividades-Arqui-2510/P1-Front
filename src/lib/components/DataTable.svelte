<script lang="ts">
    export let data: any[] = [];
    export let columns: { key: string; title: string; }[] = [];
    export let loading: boolean = false;
    export let emptyMessage: string = "No hay datos disponibles";
  </script>
  
  <div class="data-table-container">
    {#if loading}
      <div class="loading-indicator">
        <span class="loading-spinner"></span>
        <p>Cargando datos...</p>
      </div>
    {:else if data.length === 0}
      <div class="empty-state">
        <p>{emptyMessage}</p>
      </div>
    {:else}
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              {#each columns as column}
                <th>{column.title}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each data as row}
              <tr>
                {#each columns as column}
                  <td>{row[column.key]}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
  
  <style>
    .data-table-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .table-responsive {
      width: 100%;
      overflow-x: auto;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .data-table th {
      text-align: left;
      padding: 1rem;
      background-color: #f9fafb;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
      border-bottom: 1px solid #e5e7eb;
      white-space: nowrap;
    }
    
    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      color: #4b5563;
    }
    
    .data-table tbody tr:hover {
      background-color: #f9fafb;
    }
    
    .data-table tbody tr:last-child td {
      border-bottom: none;
    }
    
    .loading-indicator, .empty-state {
      padding: 3rem;
      text-align: center;
      color: #6b7280;
    }
    
    .loading-spinner {
      display: inline-block;
      width: 2rem;
      height: 2rem;
      border: 2px solid #e5e7eb;
      border-radius: 50%;
      border-top-color: #3b82f6;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>