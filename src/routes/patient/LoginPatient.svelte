<script lang="ts">
    import { goto } from '$app/navigation';
    import { patientService } from '$lib/services/patientService';
    import type { Patient } from '$lib/types/patient';
  
    let email = '';
    let password = '';
    let error = '';
  
    async function handleLogin() {
      error = '';
      const paciente: Patient | null = await patientService.loginPatient(email, password);
      if (paciente) {
        localStorage.setItem('usuario', JSON.stringify(paciente));
        location.hash = '/homePaciente';
      } else {
        error = 'Correo o contraseña incorrectos';
      }
    }
  
    async function goToRegister() {
      await goto('/registrarPaciente');
    }
  </script>
  
  <input placeholder="Email" bind:value={email} />
  <input type="password" placeholder="Password" bind:value={password} />
  
  <div style="display: flex; gap: 1rem; margin-top: 1rem;">
    <button on:click={handleLogin}>Iniciar sesión</button>
    <button on:click={goToRegister}>Registrarse</button>
  </div>
  
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}