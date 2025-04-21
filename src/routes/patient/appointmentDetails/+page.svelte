<script lang="ts">
    import SearchAppointment from '$lib/components/SearchAppointment.svelte';
    import { onMount } from 'svelte';
    import type { Appointment } from '$lib/types/appointment';
    import { appointmentService } from '$lib/services/appointmentService';
  
    let patientId: string | null = null;
    let appointments: Appointment[] = [];
  
    onMount(async () => {
      const patientStr = localStorage.getItem("usuario");
      if (patientStr) {
        const patient = JSON.parse(patientStr);
        patientId = patient.patientId?.toString() ?? null;
      
        if (patientId !== null) {
          appointments = await appointmentService.getAppointmentsByPatientId(patientId);
        }
      }
    });
  </script>
  
  <svelte:head>
    <title>Buscar Cita | Sistema Médico</title>
  </svelte:head>
  
  <div style="padding: 2rem;">
    <SearchAppointment availableAppointments={appointments} />
  </div>  