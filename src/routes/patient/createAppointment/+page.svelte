<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { doctorService } from '$lib/services/doctorService';
    import type { Doctor } from '$lib/types/doctor';
    import type { Patient } from '$lib/types/patient';
    import { appointmentService } from '$lib/services/appointmentService';
  
    let doctorId = '';
    let appointmentDate = '';
    let startTime = '';
    let endTime = '';
    const status = 'SCHEDULED';
    let notes = '';
  
    let availableDoctors: Doctor[] = [];
    let usuario: Patient | null = null;
  
    let loading = false;
    let successMessage = '';
    let errorMessage = '';
    let visible = false;
  
    onMount(async () => {
      const usuarioStr = localStorage.getItem("usuario");
      usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  
      if (!usuario) {
        goto('/');
        return;
      }
  
      visible = true;
  
      try {
        availableDoctors = await doctorService.getAllDoctors();
      } catch (e) {
        errorMessage = "Error al cargar los doctores";
        console.error(e);
      }
    });

    function validateTimes() {
      if (!startTime || !endTime) return true;
      return startTime < endTime;
    }
  
    async function handleSubmit() {
      errorMessage = '';
      successMessage = '';
  
      if (!doctorId || !appointmentDate || !startTime || !endTime || !status) {
        errorMessage = '⚠️ Todos los campos marcados con * son obligatorios.';
        return;
      }

      if (!validateTimes()) {
        errorMessage = '⚠️ La hora de finalización debe ser posterior a la hora de inicio.';
        return;
      }
  
      loading = true;
  
      const selectedDoctor = availableDoctors.find(d => String(d.doctorId) === doctorId);
  
      try {
        await appointmentService.createAppointment({
          appointmentDate,
          startTime,
          endTime,
          status,
          notes,
          doctor: selectedDoctor!,
          patient: usuario!
        });
  
        successMessage = '✅ Cita creada exitosamente. Redirigiendo...';
        setTimeout(() => goto('/patient/homePatient'), 2000);
      } catch (err) {
        console.error(err);
        errorMessage = '❌ No se pudo crear la cita';
      } finally {
        loading = false;
      }
    }
  </script>
  
  <svelte:head>
    <title>Crear Cita Médica | Sistema Médico</title>
  </svelte:head>
  
  <div class="form-wrapper {visible ? 'visible' : ''}">
    <h1>📅 Crear Nueva Cita</h1>
    <p>Completa la información para agendar tu cita médica.</p>
  
    <div class="form">
      <div class="form-group">
        <label for="doctor">Doctor *</label>
        <select id="doctor" bind:value={doctorId}>
          <option value="" disabled selected>Selecciona un doctor</option>
          {#each availableDoctors as doctor}
            <option value={doctor.doctorId}>
              Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialty})
            </option>
          {/each}
        </select>
      </div>
  
      <div class="form-group">
        <label for="date">Fecha *</label>
        <input type="date" id="date" bind:value={appointmentDate} />
      </div>
  
      <div class="form-group">
        <label for="start">Hora Inicio *</label>
        <input type="time" id="start" bind:value={startTime} />
      </div>
  
      <div class="form-group">
        <label for="end">Hora Fin *</label>
        <input type="time" id="end" bind:value={endTime} />
      </div>
  
      <div class="form-group">
        <label>Estado de la cita</label>
        <div class="status-indicator scheduled">
          PROGRAMADA <span class="icon">✓</span>
        </div>
        <small>Las citas nuevas siempre se crean con estado "Programada"</small>
      </div>
  
      <div class="form-group">
        <label for="notes">Notas (opcional)</label>
        <textarea id="notes" bind:value={notes} rows="3" placeholder="Ej: Traer resultados de laboratorio"></textarea>
      </div>
  
      {#if errorMessage}
        <div class="error">{errorMessage}</div>
      {/if}
  
      {#if successMessage}
        <div class="success">{successMessage}</div>
      {/if}
  
      <button on:click={handleSubmit} disabled={loading}>
        {loading ? 'Creando...' : 'Crear Cita'}
      </button>
    </div>
  </div>
  
  <style>
    .form-wrapper {
      max-width: 600px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.5s ease;
    }
  
    .visible {
      opacity: 1;
      transform: translateY(0);
    }
  
    h1 {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
  
    p {
      color: #6b7280;
      margin-bottom: 2rem;
    }
  
    .form-group {
      margin-bottom: 1rem;
    }
  
    label {
      font-weight: 500;
      display: block;
      margin-bottom: 0.4rem;
    }
  
    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
    }
  
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
  
    .error {
      color: #b91c1c;
      background: #fee2e2;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
  
    .success {
      color: #065f46;
      background: #d1fae5;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 1rem;
    }
  
    button {
      padding: 0.75rem 1.5rem;
      background-color: #10b981;
      color: white;
      font-weight: bold;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
  
    button:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }

    .status-indicator {
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 500;
    display: inline-block;
    margin-bottom: 0.5rem;
  }
  
  .status-indicator.scheduled {
    background-color: #dbeafe;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }
  
  .status-indicator .icon {
    margin-left: 0.5rem;
  }
  
  small {
    color: #6b7280;
    display: block;
    font-size: 0.8rem;
  }
  </style>  