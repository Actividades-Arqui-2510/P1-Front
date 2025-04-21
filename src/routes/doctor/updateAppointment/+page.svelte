<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import type { Appointment } from '$lib/types/appointment';
  
    import Button from '$lib/components/Button.svelte';
    import DashboardLayout from '$lib/components/DashboardLayout.svelte';
    import NavItem from '$lib/components/NavItem.svelte';
    import { appointmentService } from '$lib/services/appointmentService';
    import { page } from '$app/stores';
  
    let doctor: any = null;
    let appointmentId = '';
    let appointment: Appointment | null = null;
  
    let loadingUser = true;
    let loading = false;
    let errorMessage = '';
    let successMessage = '';
    let formTouched = false;
  
    $: {
      const idParam = $page.url.searchParams.get('appointmentId');
      if (idParam && appointmentId !== idParam) {
        appointmentId = idParam;
        // Buscar la cita automáticamente cuando cambia el ID
        if (doctor && !loading) {
          buscarCita();
        }
      }
    }
    
    onMount(async () => {
      if (browser) {
        const storedDoctor = localStorage.getItem('doctor');
        if (storedDoctor) {
          doctor = JSON.parse(storedDoctor);
          loadingUser = false;
          
          // Si ya tenemos un ID de la URL, buscar la cita
          if (appointmentId) {
            buscarCita();
          }
        } else {
          goto('/');
        }
      }
    });
  
    async function buscarCita() {
      errorMessage = '';
      successMessage = '';
      appointment = null;
  
      if (!appointmentId) {
        errorMessage = 'Por favor ingresa un ID de cita';
        return;
      }
  
      try {
        loading = true;
        const cita = await appointmentService.getAppointmentById(appointmentId);
  
        if (!cita) {
          errorMessage = `No se encontró la cita con ID ${appointmentId}`;
        } else if (cita.doctor.doctorId !== doctor.doctorId) {
          errorMessage = '❌ Esta cita no te pertenece';
        } else {
          appointment = cita;
        }
      } catch (err) {
        console.error(err);
        errorMessage = 'Ocurrió un error al buscar la cita';
      } finally {
        loading = false;
      }
    }
  
    function isValidAppointment(appt: Appointment): boolean {
      // Primero validamos los campos requeridos
      if (!(appt.appointmentDate && appt.startTime && appt.endTime &&
          ['SCHEDULED', 'COMPLETED', 'CANCELLED'].includes(appt.status))) {
        return false;
      }
      
      // Luego validamos que la hora final sea posterior a la inicial
      return appt.startTime < appt.endTime;
    }
  
    async function guardarCambios() {
      formTouched = true;
      errorMessage = '';
      successMessage = '';
  
      if (!appointment) return;
  
      if (!isValidAppointment(appointment)) {
        // Identificar el error específico para mostrar un mensaje más claro
        if (appointment.startTime >= appointment.endTime) {
          errorMessage = '⚠️ La hora de finalización debe ser posterior a la hora de inicio.';
        } else {
          errorMessage = '⚠️ Verifica que todos los campos estén completos y válidos.';
        }
        return;
      }
  
      loading = true;
  
      try {
        await appointmentService.updateAppointment(appointment);
        successMessage = '✅ Cita actualizada correctamente';
  
        setTimeout(() => {
          goto('/doctor/homeDoctor');
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
        localStorage.removeItem("doctor");
        await goto("/");
      }
    }
  </script>
  
  <svelte:head>
    <title>Actualizar Cita | Panel Médico</title>
  </svelte:head>
  
  {#if loadingUser}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando datos del médico...</p>
    </div>
  {:else}
    <DashboardLayout
      title="Actualizar Cita"
      userName={`Dr. ${doctor.firstName} ${doctor.lastName}`}
      userAvatar="🩺"
    >
      <svelte:fragment slot="sidebar">
        <NavItem icon="🏠" text="Inicio" on:click={() => goto('/doctor/homeDoctor')} />
        <NavItem icon="📅" text="Agenda" on:click={() => goto('/doctor/appointments')} />
        <NavItem icon="📝" text="Actualizar Datos" on:click={() => goto('/doctor/updateDoctor')} />
        <NavItem icon="🚪" text="Cerrar Sesión" on:click={cerrarSesion} />
      </svelte:fragment>
  
      <div class="page-header">
        <h2>Editar Cita Médica</h2>
        <p>Ingresa el ID de la cita para buscar y editar sus detalles.</p>
      </div>
  
      <div class="form-card">
        <div class="form-group">
          <label for="appointmentId">ID de Cita</label>
          <input id="appointmentId" type="text" bind:value={appointmentId} placeholder="Ej: 102" />
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
            <label>Estado</label>
            <select bind:value={appointment.status}>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
  
          <div class="form-group">
            <label>Notas</label>
            <textarea bind:value={appointment.notes} placeholder="Observaciones opcionales..."></textarea>
          </div>
  
          {#if errorMessage}
            <div class="error-message"><span>⚠️</span> {errorMessage}</div>
          {/if}
          {#if successMessage}
            <div class="success-message"><span>✅</span> {successMessage}</div>
          {/if}
  
          <div class="form-actions">
            <Button on:click={() => goto('/doctor/homeDoctor')} variant="secondary">Cancelar</Button>
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
      justify-content: center;
      align-items: center;
      height: 100vh;
      flex-direction: column;
      color: #6b7280;
    }
  
    .loading-spinner {
      width: 3rem;
      height: 3rem;
      border: 3px solid #e5e7eb;
      border-top-color: #10b981;
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
  
    input, select, textarea {
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
  