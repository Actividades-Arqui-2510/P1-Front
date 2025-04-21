<script lang="ts">
    import { getAppointmentDetails } from '$lib/services/appointmentService';
    import type { Appointment } from '$lib/types/appointment';
  
    export let availableAppointments: Appointment[] = [];
  
    let searchId = '';
    let appointment: Appointment | null = null;
    let error = '';
    let loading = false;
  
    async function search() {
      if (!searchId) return;
  
      const validIds = availableAppointments.map((a) => String(a.appointmentId));
      if (!validIds.includes(searchId)) {
        error = `❌ Solo puedes buscar citas asignadas a ti.`;
        return;
      }
  
      error = '';
      appointment = null;
      loading = true;
  
      try {
        appointment = await getAppointmentDetails(searchId);
        if (!appointment) {
          error = `No se encontró ninguna cita con ID ${searchId}`;
        }
      } catch (err) {
        console.error('Error al buscar cita:', err);
        error = 'Ocurrió un error al buscar la cita.';
      } finally {
        loading = false;
      }
    }
  </script>
  
  <div class="search-container">
    <h2>🔍 Buscar Cita Médica</h2>
    <p>Selecciona o ingresa el ID de una cita asignada a ti para ver los detalles</p>
  
    <input
      bind:value={searchId}
      list="appointments"
      placeholder="Ej: 101"
      on:keydown={(e) => e.key === 'Enter' && search()}
    />
    <datalist id="appointments">
      {#each availableAppointments as app}
        <option value={app.appointmentId}>Paciente: {app.patient.firstName} {app.patient.lastName}</option>
      {/each}
    </datalist>
  
    <button on:click={search} disabled={loading}>
      {loading ? 'Buscando...' : 'Buscar'}
    </button>
  
    {#if error}
      <p class="error">{error}</p>
    {/if}
  
    {#if appointment}
      <div class="appointment-card">
        <h3>📅 Cita #{appointment.appointmentId}</h3>
        <p><strong>Fecha:</strong> {appointment.appointmentDate}</p>
        <p><strong>Hora:</strong> {appointment.startTime} - {appointment.endTime}</p>
        <p><strong>Estado:</strong> {appointment.status}</p>
        <p><strong>Notas:</strong> {appointment.notes || 'Sin notas'}</p>
  
        <hr />
  
        <h4>👨‍⚕️ Doctor</h4>
        <p>{appointment.doctor.firstName} {appointment.doctor.lastName}</p>
        <p><em>{appointment.doctor.specialty}</em></p>
        <p>{appointment.doctor.email} | {appointment.doctor.phone}</p>
  
        <hr />
  
        <h4>🧑 Paciente</h4>
        <p>{appointment.patient.firstName} {appointment.patient.lastName}</p>
        <p>DOB: {new Date(appointment.patient.dateOfBirth).toLocaleDateString()}</p>
        <p>{appointment.patient.email} | {appointment.patient.phone}</p>
      </div>
    {/if}
  </div>
  
  <style>
    .search-container {
      max-width: 600px;
      margin: 0 auto;
    }
  
    input {
      padding: 0.5rem;
      font-size: 1rem;
      margin-right: 0.5rem;
      width: 220px;
    }
  
    button {
      padding: 0.5rem 1rem;
      font-weight: bold;
      background-color: #10b981;
      color: white;
      border: none;
      border-radius: 4px;
    }
  
    .error {
      color: #b91c1c;
      margin-top: 0.5rem;
    }
  
    .appointment-card {
      margin-top: 1.5rem;
      background: #f9fafb;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
  
    .appointment-card h3,
    .appointment-card h4 {
      margin-top: 1rem;
      margin-bottom: 0.5rem;
    }
  
    hr {
      margin: 1rem 0;
      border: none;
      border-top: 1px solid #e5e7eb;
    }
  </style>
  