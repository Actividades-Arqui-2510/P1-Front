<script lang="ts">
    import { goto } from '$app/navigation';
    import { doctorService } from '$lib/services/doctorService';
    import { patientService } from '$lib/services/patientService';
    import type { Doctor } from '$lib/types/doctor';
    
    const usuarioStr = localStorage.getItem("usuario");
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
  
    let doctores: Doctor[] = [];
    let error = "";
    let mostrarDoctores = false;
  
    async function getAllDoctors() {
      try {
        doctores = await doctorService.getAllDoctors();
        mostrarDoctores = true;
      } catch (err) {
        console.error("Error al obtener doctores:", err);
        error = "Ocurrió un error al consultar los doctores.";
      }
    }
  
    async function cerrarSesion() {
      localStorage.removeItem("usuario");
      await goto("/");
    }
  
    async function eliminarPaciente() {
      const confirmacion = confirm("⚠️ ¿Estás seguro que deseas eliminar tu cuenta?");
      if (!confirmacion || !usuario) return;
  
      try {
        const success = await patientService.deletePatient(usuario.id);
        
        if (success) {
          alert("🗑 Cuenta eliminada correctamente.");
          localStorage.removeItem("usuario");
          await goto("/");
        } else {
          alert("❌ Error al eliminar el paciente.");
        }
      } catch (err) {
        console.error("Error al eliminar paciente:", err);
        alert("❌ Error de red al eliminar.");
      }
    }
  </script>
  
  <style>
    .container {
      padding: 20px;
    }
  
    button {
      margin: 10px;
      padding: 10px 20px;
      font-size: 16px;
    }
  
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 20px;
    }
  
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }
  
    th {
      background-color: #f5f5f5;
    }
  
    .error {
      color: red;
    }
  
    a {
      text-decoration: none;
    }
  </style>
  
  <div class="container">
    {#if usuario}
      <h2>👋 Hola paciente, {usuario.name}</h2>
  
      <button on:click={getAllDoctors}>👨‍⚕️ Ver Doctores</button>
  
      <a href="/buscarDoctorId" on:click|preventDefault={() => goto('/buscarDoctorId')}>
        <button>🔍 Buscar Doctor por ID</button>
      </a>
  
      <a href="/actualizarPaciente" on:click|preventDefault={() => goto('/actualizarPaciente')}>
        <button>✏️ Actualizar Mis Datos</button>
      </a>
  
      <button on:click={cerrarSesion}>🚪 Cerrar Sesión</button>
  
      <!-- 🗑 Botón nuevo -->
      <button on:click={eliminarPaciente} style="background-color: crimson; color: white;">
        🗑 Eliminar Cuenta
      </button>
  
      {#if error}
        <p class="error">{error}</p>
      {/if}
  
      {#if mostrarDoctores}
        <h3>Lista de Doctores</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Especialidad</th>
              <th>Email</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {#each doctores as d}
              <tr>
                <td>{d.doctorId}</td>
                <td>{d.firstName}</td>
                <td>{d.lastName}</td>
                <td>{d.specialty}</td>
                <td>{d.email}</td>
                <td>{d.phone}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    {:else}
      <p>No has iniciado sesión</p>
    {/if}
  </div>