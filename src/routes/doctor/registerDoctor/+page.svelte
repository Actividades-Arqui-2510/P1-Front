<script lang="ts">
    import { goto } from '$app/navigation';
    import { doctorService } from '$lib/services/doctorService';
    import Button from '$lib/components/Button.svelte';
    import { onMount } from 'svelte';
  
    // Form data
    let firstName = "";
    let lastName = "";
    let specialty = "";
    let email = "";
    let phone = "";
    let password = "";
    let confirmPassword = "";
  
    // Form state
    let loading = false;
    let successMessage = "";
    let errorMessage = "";
    let formTouched = false;
    let visible = false;
    
    onMount(() => {
      setTimeout(() => {
        visible = true;
      }, 100);
    });
  
    function validateForm() {
      formTouched = true;
      
      // Validar campos requeridos
      if (!firstName?.trim()) return "El nombre es requerido";
      if (!lastName?.trim()) return "El apellido es requerido";
      if (!specialty?.trim()) return "La especialidad es requerida";
      if (!email?.trim()) return "El email es requerido";
      if (!isValidEmail(email)) return "El formato del email es inválido";
      if (!phone?.trim()) return "El teléfono es requerido";
      if (!password) return "La contraseña es requerida";
      if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
      if (password !== confirmPassword) return "Las contraseñas no coinciden";
      
      return null; // Sin errores
    }
    
    function isValidEmail(email: string) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    async function registerDoctor() {
      const validationError = validateForm();
      if (validationError) {
        errorMessage = validationError;
        return;
      }
      
      errorMessage = "";
      loading = true;
      
      try {
        // Crear el doctor con el formato necesario para el servicio SOAP
        const doctorData = {
          firstName,
          lastName,
          specialty,
          email,
          phone
        };
        
        console.log("📤 Registrando doctor:", doctorData);
        
        const success = await doctorService.registerDoctor(doctorData, password);
        
        if (success) {
          successMessage = "✅ Registro exitoso. Redirigiendo al inicio de sesión...";
          
          setTimeout(() => {
            goto('/doctor/loginDoctor');
          }, 2000);
        } else {
          errorMessage = "❌ No se pudo completar el registro";
        }
      } catch (err) {
        console.error("Error al registrar doctor:", err);
        errorMessage = "❌ Error de conexión al intentar registrar";
      } finally {
        loading = false;
      }
    }
  </script>
  
  <svelte:head>
    <title>Registro de Médico | Sistema Médico</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  </svelte:head>
  
  <div class="registration-container {visible ? 'visible' : ''}">
    <div class="registration-card">
      <div class="card-header">
        <div class="logo">
          <span class="icon">👨‍⚕️</span>
        </div>
        <h1>Registro de Médico</h1>
        <p>Crea tu cuenta para administrar pacientes y citas</p>
      </div>
      
      <div class="form-container">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">
              Nombre <span class="required">*</span>
            </label>
            <div class="input-container">
              <span class="input-icon">👤</span>
              <input 
                id="firstName"
                type="text" 
                bind:value={firstName} 
                placeholder="Tu nombre" 
                class:error-input={formTouched && !firstName}
              />
            </div>
          </div>
  
          <div class="form-group">
            <label for="lastName">
              Apellido <span class="required">*</span>
            </label>
            <div class="input-container">
              <span class="input-icon">👤</span>
              <input 
                id="lastName"
                type="text" 
                bind:value={lastName} 
                placeholder="Tu apellido" 
                class:error-input={formTouched && !lastName}
              />
            </div>
          </div>
        </div>
  
        <div class="form-group">
          <label for="specialty">
            Especialidad <span class="required">*</span>
          </label>
          <div class="input-container">
            <span class="input-icon">🏥</span>
            <input 
              id="specialty"
              type="text" 
              bind:value={specialty} 
              placeholder="Tu especialidad médica" 
              class:error-input={formTouched && !specialty}
            />
          </div>
        </div>
  
        <div class="form-group">
          <label for="email">
            Correo Electrónico <span class="required">*</span>
          </label>
          <div class="input-container">
            <span class="input-icon">✉️</span>
            <input 
              id="email"
              type="email" 
              bind:value={email} 
              placeholder="ejemplo@hospital.com" 
              class:error-input={formTouched && (!email || !isValidEmail(email))}
            />
          </div>
        </div>
  
        <div class="form-group">
          <label for="phone">
            Teléfono <span class="required">*</span>
          </label>
          <div class="input-container">
            <span class="input-icon">📱</span>
            <input 
              id="phone"
              type="tel" 
              bind:value={phone} 
              placeholder="Tu número de contacto" 
              class:error-input={formTouched && !phone}
            />
          </div>
        </div>
  
        <div class="form-group">
          <label for="password">
            Contraseña <span class="required">*</span>
          </label>
          <div class="input-container">
            <span class="input-icon">🔒</span>
            <input 
              id="password"
              type="password" 
              bind:value={password} 
              placeholder="Mínimo 6 caracteres" 
              class:error-input={formTouched && (!password || password.length < 6)}
            />
          </div>
        </div>
  
        <div class="form-group">
          <label for="confirmPassword">
            Confirmar Contraseña <span class="required">*</span>
          </label>
          <div class="input-container">
            <span class="input-icon">🔒</span>
            <input 
              id="confirmPassword"
              type="password" 
              bind:value={confirmPassword} 
              placeholder="Repite tu contraseña" 
              class:error-input={formTouched && (password !== confirmPassword)}
            />
          </div>
        </div>
  
        {#if errorMessage}
          <div class="error-message">
            <span>⚠️</span> {errorMessage}
          </div>
        {/if}
  
        {#if successMessage}
          <div class="success-message">
            <span>✅</span> {successMessage}
          </div>
        {/if}
  
        <div class="form-actions">
          <Button 
            variant="primary"
            on:click={registerDoctor}
            disabled={loading}
          >
            {#if loading}
              Registrando...
            {:else}
              Crear Cuenta
            {/if}
          </Button>
        </div>
        
        <div class="login-link">
          ¿Ya tienes una cuenta? <a href="/doctor/loginDoctor">Iniciar sesión</a>
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
    .registration-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem 1rem;
      background: linear-gradient(135deg, #ecfdf5, #d1fae5);
      opacity: 0;
      transform: translateY(10px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .registration-card {
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      width: 100%;
      max-width: 600px;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    .registration-card:hover {
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
      background: linear-gradient(135deg, #10b981, #059669);
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
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    @media (max-width: 480px) {
      .form-row {
        grid-template-columns: 1fr;
      }
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
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
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
    
    .required {
      color: #ef4444;
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
    
    .success-message {
      background-color: #d1fae5;
      color: #065f46;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1.25rem;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .form-actions {
      margin-top: 1.5rem;
    }
    
    .login-link {
      text-align: center;
      margin-top: 1.5rem;
      color: #6b7280;
    }
    
    .login-link a {
      color: #10b981;
      text-decoration: none;
      font-weight: 500;
    }
    
    .login-link a:hover {
      text-decoration: underline;
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
      color: #10b981;
    }
  </style>