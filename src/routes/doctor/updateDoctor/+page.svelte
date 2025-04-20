<script lang="ts">
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { doctorService } from '$lib/services/doctorService';
    import type { Doctor, DoctorUpdateData } from '$lib/types/doctor';
    
    import Button from '$lib/components/Button.svelte';
    import DashboardLayout from '$lib/components/DashboardLayout.svelte';
    import NavItem from '$lib/components/NavItem.svelte';
    import { onMount } from 'svelte';
  
    // Form data
    let doctor: Doctor = {
      doctorId: "",
      firstName: "",
      lastName: "",
      specialty: "",
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
        const storedUser = localStorage.getItem("doctor");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            
            // Map data from localStorage to our form
            doctor = {
              doctorId: userData.doctorId || userData.id || "",
              firstName: userData.firstName || userData.name || "",
              lastName: userData.lastName || "",
              specialty: userData.specialty || "",
              email: userData.email || "",
              phone: userData.phone || ""
            };
            
            loadingUser = false;
          } catch (err) {
            console.error("Error parsing doctor data:", err);
            errorMessage = "Error al cargar datos del médico";
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
      
      if (!doctor.firstName?.trim()) {
        errorMessage = "El nombre es requerido";
        return false;
      }
      
      if (!doctor.lastName?.trim()) {
        errorMessage = "El apellido es requerido";
        return false;
      }
      
      if (!doctor.specialty?.trim()) {
        errorMessage = "La especialidad es requerida";
        return false;
      }
      
      if (!doctor.email?.trim()) {
        errorMessage = "El email es requerido";
        return false;
      } else if (!isValidEmail(doctor.email)) {
        errorMessage = "El formato del email es inválido";
        return false;
      }
      
      if (!doctor.phone?.trim()) {
        errorMessage = "El teléfono es requerido";
        return false;
      }
      
      return true;
    }
    
    function isValidEmail(email: string) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
  
    async function actualizarDoctor() {
      if (!validateForm()) return;
      
      errorMessage = "";
      loading = true;
      
      try {
        console.log("📤 Actualizando doctor:", doctor);
        
        const updateData: DoctorUpdateData = {
          doctorId: doctor.doctorId ?? "",
          firstName: doctor.firstName ?? "",
          lastName: doctor.lastName ?? "",
          specialty: doctor.specialty ?? "",
          email: doctor.email ?? "",
          phone: doctor.phone ?? ""
        };
        
        const success = await doctorService.updateDoctor(updateData);
        
        if (success) {
          successMessage = "✅ Datos actualizados correctamente";
          
          // Actualizar datos en localStorage
          localStorage.setItem("doctor", JSON.stringify(doctor));
          
          setTimeout(() => {
            goto('/doctor/homeDoctor');
          }, 2000);
        } else {
          errorMessage = "❌ No se pudo actualizar la información";
        }
      } catch (err) {
        console.error("Error al actualizar doctor:", err);
        errorMessage = "❌ Error de conexión al intentar actualizar";
      } finally {
        loading = false;
      }
    }
    
    async function cerrarSesion() {
      if (browser) {
        localStorage.removeItem("doctor");
        await goto('/');
      }
    }
  </script>
  
  <svelte:head>
    <title>Actualizar Datos | Panel Médico</title>
  </svelte:head>
  
  {#if loadingUser}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando datos del médico...</p>
    </div>
  {:else}
    <DashboardLayout 
      title="Panel Médico" 
      userName={`Dr. ${doctor.firstName} ${doctor.lastName}`}
      userAvatar="👨‍⚕️"
    >
      <svelte:fragment slot="sidebar">
        <NavItem 
          icon="🏠" 
          text="Inicio"
          on:click={() => goto('/doctor/homeDoctor')} 
        />
        <NavItem 
          icon="📅" 
          text="Agenda" 
          on:click={() => goto('/doctor/agenda')} 
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
        <h2>Actualizar Datos Profesionales</h2>
        <p>Modifica tu información para mantenerla actualizada.</p>
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
              bind:value={doctor.firstName} 
              placeholder="Tu nombre" 
              class:error-input={formTouched && !doctor.firstName}
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
              bind:value={doctor.lastName} 
              placeholder="Tu apellido" 
              class:error-input={formTouched && !doctor.lastName}
            />
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
              bind:value={doctor.specialty} 
              placeholder="Tu especialidad médica" 
              class:error-input={formTouched && !doctor.specialty}
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
              bind:value={doctor.email} 
              placeholder="ejemplo@hospital.com" 
              class:error-input={formTouched && (!doctor.email || !isValidEmail(doctor.email))}
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
              bind:value={doctor.phone} 
              placeholder="Tu número de contacto" 
              class:error-input={formTouched && !doctor.phone}
            />
          </div>
        </div>
  
        <div class="form-group id-field">
          <label for="doctorId">
            ID de Doctor
          </label>
          <div class="input-container">
            <span class="input-icon">🔢</span>
            <input 
              id="doctorId"
              type="text" 
              value={doctor.doctorId} 
              disabled
            />
            <div class="helper-text">
              El ID no se puede modificar
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
            on:click={() => goto('/doctor/homeDoctor')}
          >
            Cancelar
          </Button>
          
          <Button 
            variant="primary"
            on:click={actualizarDoctor}
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
      border-top-color: #10b981;
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
    
    .id-field {
      opacity: 0.8;
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
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
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