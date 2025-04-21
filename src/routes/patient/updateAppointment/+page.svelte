<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import type { Appointment } from '$lib/types/appointment';
  
    import Button from '$lib/components/Button.svelte';
    import DashboardLayout from '$lib/components/DashboardLayout.svelte';
    import NavItem from '$lib/components/NavItem.svelte';
    import { appointmentService } from '$lib/services/appointmentService';
  
    let usuario: any = null;
    let appointmentId = '';
    let appointment: Appointment | null = null;
  
    let loadingUser = true;
    let loading = false;
    let errorMessage = '';
    let successMessage = '';
    let formTouched = false;
  
    // Obtener parámetro por URL
    $: {
      const idParam = $page.url.searchParams.get('appointmentId');
      if (idParam) appointmentId = idParam;
    }
  
    onMount(async () => {
      if (browser) {
        const stored = localStorage.getItem('usuario');
        if (stored) {
          usuario = JSON.parse(stored);
          loadingUser = false;
  
          if (appointmentId) {
            await buscarCita();
          }
        } else {
          goto('/');
        }
      }
    });
  
    async function buscarCita() {
      errorMessage = '';
      appointment = null;
  
      if (!appointmentId) {
        errorMessage = 'Por favor ingresa un ID de cita';
        return;
      }
  
      try {
        loading = true;
        const cita = await appointmentService.getAppointmentById(appointmentId);
        if (cita && cita.patient.patientId === usuario.patientId) {
          appointment = cita;
        } else {
          errorMessage = `La cita no te pertenece o no existe`;
        }
      } catch (err) {
        console.error(err);
        errorMessage = 'Error al buscar la cita';
      } finally {
        loading = false;
      }
    }
  
    function validateTimes(appt: Appointment): boolean {
      return appt.startTime < appt.endTime;
    }
    
    async function guardarCambios() {
      if (!appointment) return;
      formTouched = true;
      errorMessage = '';
      successMessage = '';
      
      // Validar que la hora final sea posterior a la inicial
      if (!validateTimes(appointment)) {
        errorMessage = '⚠️ La hora de finalización debe ser posterior a la hora de inicio.';
        return;
      }
      
      loading = true;
  
      try {
        await appointmentService.updateAppointment(appointment);
        successMessage = '✅ Cita actualizada correctamente';
  
        setTimeout(() => {
          goto('/patient/homePatient');
        }, 2000);
      } catch (err) {
        console.error(err);
        errorMessage = '❌ Error al actualizar la cita';
      } finally {
        loading = false;
      }
    }
  
    async function cerrarSesion() {
      if (browser) {
        localStorage.removeItem("usuario");
        await goto("/");
      }
    }
  </script>
  
  <svelte:head>
    <title>Actualizar Cita | Panel Paciente</title>
  </svelte:head>
  
  {#if loadingUser}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando datos del paciente...</p>
    </div>
  {:else}
    <DashboardLayout
      title="Actualizar Cita"
      userName={`${usuario.firstName} ${usuario.lastName}`}
      userAvatar="👤"
    >
      <svelte:fragment slot="sidebar">
        <NavItem icon="🏠" text="Inicio" on:click={() => goto('/patient/homePatient')} />
        <NavItem icon="📅" text="Mis Citas" on:click={() => goto('/patient/appointments')} />
        <NavItem icon="📝" text="Actualizar Datos" on:click={() => goto('/patient/updatePatient')} />
        <NavItem icon="🚪" text="Cerrar Sesión" on:click={cerrarSesion} />
      </svelte:fragment>
  
      <div class="page-header">
        <h2>Editar Cita Médica</h2>
        <p>Busca una de tus citas para actualizar los detalles.</p>
      </div>
  
      <div class="form-card">
        <div class="form-group">
          <label>ID de Cita</label>
          <input type="text" bind:value={appointmentId} placeholder="Ej: 105" />
          <Button on:click={buscarCita} variant="secondary" size="sm">Buscar</Button>
        </div>
  
        {#if appointment}
          <div class="form-group">
            <label>Fecha</label>
            <input type="date" bind:value={appointment.appointmentDate} />
          </div>
  
          <div class="form-group">
            <label>Hora de Inicio</label>
            <input type="time" bind:value={appointment.startTime} />
          </div>
  
          <div class="form-group">
            <label>Hora de Fin</label>
            <input type="time" bind:value={appointment.endTime} />
          </div>
  
          <div class="form-group">
            <label>Notas</label>
            <textarea bind:value={appointment.notes} placeholder="Notas opcionales..."></textarea>
          </div>
  
          {#if errorMessage}
            <div class="error-message"><span>⚠️</span> {errorMessage}</div>
          {/if}
          {#if successMessage}
            <div class="success-message"><span>✅</span> {successMessage}</div>
          {/if}
  
          <div class="form-actions">
            <Button on:click={() => goto('/patient/homePatient')} variant="secondary">Cancelar</Button>
            <Button on:click={guardarCambios} variant="primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        {/if}
      </div>
    </DashboardLayout>
  {/if}
  
  <style>
    .loading-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      color: #6b7280;
    }
  
    .loading-spinner {
      width: 3rem;
      height: 3rem;
      border: 3px solid #e5e7eb;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
  
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  
    .page-header {
      margin-bottom: 1.5rem;
    }
  
    .form-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      max-width: 600px;
    }
  
    .form-group {
      margin-bottom: 1.25rem;
    }
  
    label {
      font-weight: 500;
      display: block;
      margin-bottom: 0.5rem;
    }
  
    input, textarea {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-family: 'Poppins', sans-serif;
      box-sizing: border-box;
    }
  
    textarea {
      min-height: 100px;
    }
  
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
  
    .error-message,
    .success-message {
      padding: 1rem;
      border-radius: 8px;
      font-size: 0.95rem;
      margin: 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  
    .error-message {
      background: #fee2e2;
      color: #b91c1c;
    }
  
    .success-message {
      background: #d1fae5;
      color: #065f46;
    }
  </style>
  