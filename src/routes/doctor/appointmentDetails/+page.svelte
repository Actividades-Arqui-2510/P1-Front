<script lang="ts">
    import SearchAppointment from '$lib/components/SearchAppointment.svelte';
    import { getAllAppointments } from '$lib/services/appointmentService';
    import type { Appointment } from '$lib/types/appointment';
    import { onMount } from 'svelte';
  
    let doctorId: number | null = null;
    let appointments: Appointment[] = [];
  
    onMount(async () => {
      const doctorStr = localStorage.getItem("doctor");
      if (doctorStr) {
        const doctor = JSON.parse(doctorStr);
        doctorId = doctor.doctorId;
  
        const all = await getAllAppointments();
        appointments = all.filter(a => String(a.doctor.doctorId) === String(doctorId));
      }
    });
  </script>
  
  <svelte:head>
    <title>Buscar Cita | Sistema Médico</title>
  </svelte:head>
  
  <div style="padding: 2rem;">
    <SearchAppointment availableAppointments={appointments} />
  </div>
  