<script lang="ts">
    import { goto } from '$app/navigation';
    import { doctorService } from '$lib/services/doctorService';
    import type { Doctor } from '$lib/types/doctor';
    import LoginForm from '$lib/components/LoginForm.svelte';
  
    async function handleDoctorLogin(email: string, password: string): Promise<void> {
      const doctor: Doctor | null = await doctorService.loginDoctor(email, password);
      if (doctor) {
        localStorage.setItem('doctor', JSON.stringify(doctor));
        console.log('Doctor logueado:', doctor);
        await goto('/doctor/homeDoctor');
      } else {
        throw new Error('Correo o contraseña incorrectos');
      }
    }
  </script>
  
  <svelte:head>
    <title>Iniciar sesión | Doctor</title>
  </svelte:head>
  
  <LoginForm
    roleTitle="Doctor"
    roleIcon="🩺"
    roleDescription="Accede como médico para administrar tu agenda y pacientes"
    gradientColors="135deg, #10b981, #059669"
    registerPath="/doctor/registerDoctor"
    handleLoginSubmit={handleDoctorLogin}
  />