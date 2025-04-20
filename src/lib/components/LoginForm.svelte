<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from './Button.svelte';
    
    // Props para personalización
    export let roleTitle: string;
    export let roleIcon: string;
    export let roleDescription: string;
    export let gradientColors: string = '135deg, #3b82f6, #2563eb';
    export let registerPath: string;
    export let handleLoginSubmit: (email: string, password: string) => Promise<void>;
    
    // Estado local
    let email = '';
    let password = '';
    let error = '';
    let loading = false;
    let visible = false;
    
    import { onMount } from 'svelte';
    
    onMount(() => {
      setTimeout(() => {
        visible = true;
      }, 100);
    });
    
    async function submitLogin() {
      if (!email || !password) {
        error = 'Por favor complete todos los campos';
        return;
      }
      
      error = '';
      loading = true;
      
      try {
        await handleLoginSubmit(email, password);
      } catch (err) {
        console.error('Error durante el login:', err);
        error = 'Ocurrió un error al intentar iniciar sesión';
      } finally {
        loading = false;
      }
    }
    
    async function goToRegister() {
      await goto(registerPath);
    }
    
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        submitLogin();
      }
    }
  </script>
  
  <div class="login-container {visible ? 'visible' : ''}">
    <div class="login-card">
      <div class="card-header">
        <div class="logo" style="background: linear-gradient({gradientColors});">
          <span class="icon">{roleIcon}</span>
        </div>
        <h1>Iniciar sesión</h1>
        <p>{roleDescription}</p>
      </div>
      
      <div class="form-container">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <div class="input-container">
            <span class="input-icon">✉️</span>
            <input 
              id="email"
              type="email" 
              placeholder="ejemplo@correo.com" 
              bind:value={email} 
              on:keydown={handleKeyDown}
              class:error-input={error && !email}
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-container">
            <span class="input-icon">🔒</span>
            <input 
              id="password"
              type="password" 
              placeholder="Tu contraseña" 
              bind:value={password} 
              on:keydown={handleKeyDown}
              class:error-input={error && !password}
            />
          </div>
        </div>
        
        {#if error}
          <div class="error-message">
            <span>⚠️</span> {error}
          </div>
        {/if}
        
        <div class="action-buttons">
          <Button 
            variant="primary" 
            on:click={submitLogin} 
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
          
          <div class="divider">
            <span>o</span>
          </div>
          
          <Button 
            variant="secondary" 
            on:click={goToRegister}
          >
            Crear cuenta nueva
          </Button>
        </div>
      </div>
      
      <div class="card-footer">
        <a href="/" class="back-link">
          <span>←</span> Volver al inicio
        </a>
      </div>
    </div>
  </div>
  
  <style>
    .login-container {
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
    
    .login-card {
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      width: 100%;
      max-width: 480px;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .login-card:hover {
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    }
    
    .card-header {
      padding: 2.5rem 2rem 1rem;
      text-align: center;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .icon {
      font-size: 2.5rem;
      color: white;
    }
    
    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
      color: #1f2937;
    }
    
    p {
      color: #6b7280;
      margin-top: 0.75rem;
      font-size: 1rem;
    }
    
    .form-container {
      padding: 1rem 2rem 2rem;
    }
    
    .form-group {
      margin-bottom: 1.25rem;
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
    
    .error-input {
      border-color: #ef4444;
    }
    
    .error-input:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
    }
    
    .error-message {
      background-color: #fee2e2;
      color: #b91c1c;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.25rem;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .divider {
      position: relative;
      text-align: center;
      margin: 0.5rem 0;
    }
    
    .divider::before, 
    .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 42%;
      height: 1px;
      background-color: #e5e7eb;
    }
    
    .divider::before {
      left: 0;
    }
    
    .divider::after {
      right: 0;
    }
    
    .divider span {
      display: inline-block;
      padding: 0 10px;
      background-color: white;
      position: relative;
      color: #9ca3af;
      font-size: 0.9rem;
    }
    
    .card-footer {
      padding: 1rem 2rem 2rem;
      text-align: center;
      border-top: 1px solid #f3f4f6;
      margin-top: 1rem;
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
    
    @media (max-width: 480px) {
      .login-card {
        border-radius: 12px;
      }
      
      .form-container, 
      .card-header, 
      .card-footer {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
    }
  </style>