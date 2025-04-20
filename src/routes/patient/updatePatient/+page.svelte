<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { patientService} from '$lib/services/patientService';
  import type { Patient, PatientUpdateData } from '$lib/types/patient';
  import Button from '$lib/components/Button.svelte';
  import DashboardLayout from '$lib/components/DashboardLayout.svelte';
  import NavItem from '$lib/components/NavItem.svelte';
  import { onMount } from 'svelte';

  // Form data
  let paciente: Patient = {
    patientId: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    phone: ""
  };

  // Form state
  let loading = false;
  let successMessage = "";
  let errorMessage = "";
  let formTouched = false;
  
  // Page state
  let loadingUser = true;

  onMount(() => {
    if (browser) {
      const storedUser = localStorage.getItem("usuario");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Map data from localStorage to our form
          paciente = {
            patientId: userData.patientId || userData.id || "",
            firstName: userData.firstName || userData.name || "",
            lastName: userData.lastName || "",
            dateOfBirth: userData.dateOfBirth || "",
            email: userData.email || "",
            phone: userData.phone || ""
          };
          
          loadingUser = false;
        } catch (err) {
          console.error("Error parsing user data:", err);
          errorMessage = "Error al cargar datos del usuario";
          setTimeout(() => goto('/'), 2000);
        }
      } else {
        // No user found in localStorage, redirect to login
        goto('/');
      }
    }
  });

  function validateForm() {
    formTouched = true;
    
    if (!paciente.firstName?.trim()) {
      errorMessage = "El nombre es requerido";
      return false;
    }
    
    if (!paciente.lastName?.trim()) {
      errorMessage = "El apellido es requerido";
      return false;
    }
    
    if (!paciente.email?.trim()) {
      errorMessage = "El email es requerido";
      return false;
    } else if (!isValidEmail(paciente.email)) {
      errorMessage = "El formato del email es inválido";
      return false;
    }
    
    if (!paciente.phone?.trim()) {
      errorMessage = "El teléfono es requerido";
      return false;
    }
    
    return true;
  }
  
  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function actualizarPaciente() {
    if (!validateForm()) return;
    
    errorMessage = "";
    loading = true;
    
    try {
      console.log("📤 Actualizando paciente:", paciente);
      
      const updateData: PatientUpdateData = {
        patientId: paciente.patientId,
        firstName: paciente.firstName,
        lastName: paciente.lastName,
        email: paciente.email,
        phone: paciente.phone
      };
      
      const success = await patientService.updatePatient(updateData);
      
      if (success) {
        successMessage = "✅ Datos actualizados correctamente";
        
        // Actualizar datos en localStorage
        localStorage.setItem("usuario", JSON.stringify(paciente));
        
        setTimeout(() => {
          goto('/patient/homePatient');
        }, 2000);
      } else {
        errorMessage = "❌ No se pudo actualizar la información";
      }
    } catch (err) {
      console.error("Error al actualizar paciente:", err);
      errorMessage = "❌ Error de conexión al intentar actualizar";
    } finally {
      loading = false;
    }
  }
  
  async function cerrarSesion() {
    if (browser) {
      localStorage.removeItem("usuario");
      await goto('/');
    }
  }
</script>

<svelte:head>
  <title>Actualizar Datos | Sistema Médico</title>
</svelte:head>

{#if loadingUser}
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>Cargando datos del usuario...</p>
  </div>
{:else}
  <DashboardLayout 
    title="Panel de Paciente" 
    userName={`${paciente.firstName} ${paciente.lastName}`}
    userAvatar="👨‍⚕️"
  >
    <svelte:fragment slot="sidebar">
      <NavItem 
        icon="🏠" 
        text="Inicio"
        on:click={() => goto('/patient/homePatient')} 
      />
      <NavItem 
        icon="📅" 
        text="Mis Citas" 
        on:click={() => goto('/patient/citas')} 
      />
      <NavItem 
        icon="📝" 
        text="Actualizar Datos" 
        active={true}
      />
      <NavItem 
        icon="🚪" 
        text="Cerrar Sesión" 
        on:click={cerrarSesion} 
      />
    </svelte:fragment>

    <div class="page-header">
      <h2>Actualizar Datos Personales</h2>
      <p>Modifica tu información personal para mantenerla actualizada.</p>
    </div>

    <div class="form-card">
      <div class="form-group">
        <label for="firstName">
          Nombre <span class="required">*</span>
        </label>
        <div class="input-container">
          <span class="input-icon">👤</span>
          <input 
            id="firstName"
            type="text" 
            bind:value={paciente.firstName} 
            placeholder="Tu nombre" 
            class:error-input={formTouched && !paciente.firstName}
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
            bind:value={paciente.lastName} 
            placeholder="Tu apellido" 
            class:error-input={formTouched && !paciente.lastName}
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
            bind:value={paciente.email} 
            placeholder="ejemplo@correo.com" 
            class:error-input={formTouched && (!paciente.email || !isValidEmail(paciente.email))}
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
            type="text" 
            bind:value={paciente.phone} 
            placeholder="Tu número de teléfono" 
            class:error-input={formTouched && !paciente.phone}
          />
        </div>
      </div>

      <div class="form-group">
        <label for="dob">
          Fecha de Nacimiento
        </label>
        <div class="input-container">
          <span class="input-icon">🎂</span>
          <input 
            id="dob"
            type="date" 
            bind:value={paciente.dateOfBirth} 
            disabled
          />
          <div class="helper-text">
            La fecha de nacimiento no se puede modificar
          </div>
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
          variant="secondary"
          on:click={() => goto('/patient/homePatient')}
        >
          Cancelar
        </Button>
        
        <Button 
          variant="primary"
          on:click={actualizarPaciente}
          disabled={loading}
        >
          {#if loading}
            Actualizando...
          {:else}
            Guardar Cambios
          {/if}
        </Button>
      </div>
    </div>
  </DashboardLayout>
{/if}

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: #6b7280;
  }
  
  .loading-spinner {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    border: 3px solid #e5e7eb;
    border-radius: 50%;
    border-top-color: #3b82f6;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-header h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }
  
  .page-header p {
    color: #6b7280;
    margin: 0;
    font-size: 1rem;
  }
  
  .form-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    padding: 2rem;
    max-width: 600px;
  }
  
  .form-group {
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
    opacity: 0.7;
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
  
  input:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
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
  
  .helper-text {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 0.5rem;
    font-style: italic;
  }
  
  .error-message {
    background-color: #fee2e2;
    color: #b91c1c;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin: 1.5rem 0;
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
    margin: 1.5rem 0;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
</style>