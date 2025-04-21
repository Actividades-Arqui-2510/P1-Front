<script lang="ts">
    import SearchAppointment from '$lib/components/SearchAppointment.svelte';
    import { getAllAppointments } from '$lib/services/appointmentService';
    import { onMount } from 'svelte';
    import type { Appointment } from '$lib/types/appointment';
  
    let patientId: number | null = null;
    let appointments: Appointment[] = [];
  
    onMount(async () => {
      const patientStr = localStorage.getItem("usuario");
      if (patientStr) {
        const patient = JSON.parse(patientStr);
        patientId = patient.patientId;
        const all = await getAllAppointments();
        appointments = all.filter(a => String(a.patient.patientId) === String(patientId));
      }
    });
  </script>
  
  <svelte:head>
    <title>Buscar Cita | Sistema Médico</title>
  </svelte:head>
  
  <div style="padding: 2rem;">
    <SearchAppointment availableAppointments={appointments} />
  </div>  