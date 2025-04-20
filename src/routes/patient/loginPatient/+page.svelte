<script lang="ts">
  import { goto } from '$app/navigation';
  import { patientService } from '$lib/services/patientService';
  import type { Patient } from '$lib/types/patient';
  import LoginForm from '$lib/components/LoginForm.svelte';

  async function handlePatientLogin(email: string, password: string): Promise<void> {
    const paciente: Patient | null = await patientService.loginPatient(email, password);
    if (paciente) {
      localStorage.setItem('usuario', JSON.stringify(paciente));
      console.log('Usuario logueado:', paciente);
      await goto('/patient/homePatient');
    } else {
      throw new Error('Correo o contraseña incorrectos');
    }
  }
</script>

<svelte:head>
  <title>Iniciar sesión | Paciente</title>
</svelte:head>

<LoginForm
  roleTitle="Paciente"
  roleIcon="👨‍⚕️"
  roleDescription="Accede como paciente para gestionar tus citas médicas"
  gradientColors="135deg, #3b82f6, #2563eb"
  registerPath="/patient/registerPatient"
  handleLoginSubmit={handlePatientLogin}
/>