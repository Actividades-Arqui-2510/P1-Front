<script lang="ts">
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { doctorService } from '$lib/services/doctorService';
    import { patientService } from '$lib/services/patientService';
    import type { Doctor } from '$lib/types/doctor';
    import type { Patient } from '$lib/types/patient';
    
    import DashboardLayout from '$lib/components/DashboardLayout.svelte';
    import Button from '$lib/components/Button.svelte';
    import DataTable from '$lib/components/DataTable.svelte';
    import NavItem from '$lib/components/NavItem.svelte';
    import ActionCard from '$lib/components/ActionCard.svelte';
    import { onMount } from 'svelte';
    
    // Proteger acceso a localStorage
    let doctor: Doctor | null = null;
    let loadingUser = true;
    
    onMount(() => {
      if (browser) {
        const doctorStr = localStorage.getItem("doctor");
        doctor = doctorStr ? JSON.parse(doctorStr) : null;
        loadingUser = false;
        
        if (!doctor) {
          goto('/');
        }
      }
    });
    
    // Estado para la tabla de pacientes
    let pacientes: Patient[] = [];
    let error = "";
    let loadingPatients = false;
    let mostrarPacientes = false;
    
    async function getAllPatients() {
      if (mostrarPacientes) {
        mostrarPacientes = false;
        return;
      }
      
      try {
        loadingPatients = true;
        pacientes = await patientService.getAllPatients();
        mostrarPacientes = true;
        error = "";
      } catch (err) {
        console.error("Error al obtener pacientes:", err);
        error = "Ocurrió un error al consultar los pacientes.";
      } finally {
        loadingPatients = false;
      }
    }
    
    async function cerrarSesion() {
      if (browser) {
        localStorage.removeItem("doctor");
        await goto("/");
      }
    }
    
    async function eliminarDoctor() {
      if (!doctor) return;
      
      const confirmacion = confirm("⚠️ ¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
      if (!confirmacion) return;
      
      try {
        const success = await doctorService.deleteDoctor(doctor.doctorId ?? '');
        
        if (success) {
          alert("✅ Cuenta eliminada correctamente.");
          localStorage.removeItem("doctor");
          await goto("/");
        } else {
          alert("❌ Error al eliminar la cuenta.");
        }
      } catch (err) {
        console.error("Error al eliminar doctor:", err);
        alert("❌ Error de red al eliminar la cuenta.");
      }
    }
    
    const patientColumns = [
      { key: 'patientId', title: 'ID' },
      { key: 'firstName', title: 'Nombre' },
      { key: 'lastName', title: 'Apellido' },
      { key: 'dateOfBirth', title: 'Fecha de Nacimiento' },
      { key: 'email', title: 'Email' },
      { key: 'phone', title: 'Teléfono' }
    ];
  </script>
  
  <svelte:head>
    <title>{doctor ? `Bienvenido, ${doctor.firstName}` : 'Panel de Doctor'} | Sistema Médico</title>
  </svelte:head>
  
  {#if loadingUser}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando perfil...</p>
    </div>
  {:else if doctor}
    <DashboardLayout 
      title="Panel Médico" 
      userName={`Dr. ${doctor.firstName} ${doctor.lastName}`}
      userAvatar="👨‍⚕️"
    >
      <svelte:fragment slot="sidebar">
        <NavItem 
          icon="🏠" 
          text="Inicio" 
          active={true} 
        />
        <NavItem 
          icon="📅" 
          text="Agenda" 
          on:click={() => goto('/doctor/appointments')} 
        />
        <NavItem 
          icon="📝" 
          text="Actualizar Datos" 
          on:click={() => goto('/doctor/updateDoctor')} 
        />
        <NavItem 
          icon="🚪" 
          text="Cerrar Sesión" 
          on:click={cerrarSesion} 
        />
        <NavItem 
          icon="🗑️" 
          text="Eliminar Cuenta" 
          danger={true} 
          on:click={eliminarDoctor} 
        />
      </svelte:fragment>
      
      <div class="dashboard-welcome">
        <h2>Bienvenido, Dr. {doctor.firstName} 👋</h2>
        <p>Gestione sus pacientes y consulte su agenda médica desde aquí.</p>
        {#if doctor.specialty}
          <span class="specialty-badge">{doctor.specialty}</span>
        {/if}
      </div>
      
      <div class="cards-grid">
        <ActionCard 
          icon="👥" 
          title="Ver Pacientes" 
          description="Consulta la lista completa de pacientes registrados"
          variant="primary"
        >
          <Button 
            variant={mostrarPacientes ? "secondary" : "primary"} 
            on:click={getAllPatients}
            size="sm"
          >
            {mostrarPacientes ? "Ocultar Pacientes" : "Ver Pacientes"}
          </Button>
        </ActionCard>
        
        <ActionCard 
          icon="🔍" 
          title="Buscar Paciente" 
          description="Busca un paciente específico por ID"
          variant="secondary"
        >
          <Button 
            variant="secondary" 
            size="sm" 
            on:click={() => goto('/patientById')}
          >
            Buscar
          </Button>
        </ActionCard>
        
        <ActionCard 
          icon="✏️" 
          title="Actualizar Datos" 
          description="Modifica tu información profesional"
          variant="info"
        >
          <Button 
            variant="primary" 
            size="sm" 
            on:click={() => goto('/doctor/updateDoctor')}
          >
            Actualizar
          </Button>
        </ActionCard>
        
        <ActionCard 
          icon="📊" 
          title="Estadísticas" 
          description="Visualiza datos sobre tus pacientes"
          variant="warning"
        >
          <Button 
            variant="secondary" 
            size="sm" 
            on:click={() => goto('/doctor/statistics')}
          >
            Ver Estadísticas
          </Button>
        </ActionCard>
      </div>
      
      {#if error}
        <div class="error-alert">
          <span>⚠️</span> {error}
        </div>
      {/if}
      
      {#if mostrarPacientes}
        <div class="table-section">
          <h3>Lista de Pacientes</h3>
          <DataTable 
            data={pacientes} 
            columns={patientColumns}
            loading={loadingPatients}
            emptyMessage="No hay pacientes registrados en el sistema."
          />
        </div>
      {/if}
    </DashboardLayout>
  {:else}
    <div class="error-container">
      <h1>No has iniciado sesión</h1>
      <p>Para acceder a esta página, debes iniciar sesión como doctor.</p>
      <Button on:click={() => goto('/doctor/loginDoctor')}>Iniciar sesión</Button>
    </div>
  {/if}
  
  <style>
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      color: #6b7280;
    }
    
    .loading-spinner {
      display: inline-block;
      width: 3rem;
      height: 3rem;
      border: 3px solid #e5e7eb;
      border-radius: 50%;
      border-top-color: #10b981;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .dashboard-welcome {
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      position: relative;
    }
    
    .dashboard-welcome h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }
    
    .dashboard-welcome p {
      color: #6b7280;
      margin: 0 0 0.75rem 0;
      font-size: 1.1rem;
    }
    
    .specialty-badge {
      display: inline-block;
      background-color: #10b981;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 500;
      margin-top: 0.5rem;
    }
    
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    
    .error-alert {
      padding: 1rem;
      background-color: #fee2e2;
      border-radius: 8px;
      color: #b91c1c;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .table-section {
      margin-top: 1.5rem;
    }
    
    .table-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin-bottom: 1rem;
    }
    
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
      padding: 0 1rem;
    }
    
    .error-container h1 {
      font-size: 1.75rem;
      color: #1f2937;
      margin-bottom: 1rem;
    }
    
    .error-container p {
      color: #6b7280;
      margin-bottom: 2rem;
    }
  </style>