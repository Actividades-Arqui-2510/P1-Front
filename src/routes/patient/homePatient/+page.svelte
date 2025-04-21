<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { doctorService } from "$lib/services/doctorService";
  import { patientService } from "$lib/services/patientService";
  import {
    getAllAppointments,
    deleteAppointment,
  } from "$lib/services/appointmentService";

  import type { Doctor } from "$lib/types/doctor";
  import type { Patient } from "$lib/types/patient";
  import type { Appointment } from "$lib/types/appointment";

  import DashboardLayout from "$lib/components/DashboardLayout.svelte";
  import Button from "$lib/components/Button.svelte";
  import DataTable from "$lib/components/DataTable.svelte";
  import NavItem from "$lib/components/NavItem.svelte";
  import ActionCard from "$lib/components/ActionCard.svelte";
  import { onMount } from "svelte";

  let usuario: Patient | null = null;
  let loadingUser = true;
  let successMessage = "";

  onMount(() => {
    if (browser) {
      const usuarioStr = localStorage.getItem("usuario");
      usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
      loadingUser = false;

      if (!usuario) {
        goto("/");
      }
    }

    window.addEventListener("delete-appointment", async (e: any) => {
      const id = e.detail;
      const confirmDelete = confirm(
        `¿Eliminar la cita #${id}? Esta acción no se puede deshacer.`,
      );
      if (!confirmDelete) return;

      try {
        loadingAppointments = true;
        await deleteAppointment(id);
        appointments = appointments.filter((a) => a.appointmentId !== id);
        successMessage = `✅ Cita #${id} eliminada correctamente`;

        setTimeout(() => {
          successMessage = "";
        }, 3000);
      } catch (err) {
        alert("❌ Error al eliminar la cita.");
        console.error(err);
      } finally {
        loadingAppointments = false;
      }
    });
  });

  let doctores: Doctor[] = [];
  let error = "";
  let loadingDoctors = false;
  let mostrarDoctores = false;

  async function getAllDoctors() {
    if (mostrarDoctores) {
      mostrarDoctores = false;
      return;
    }

    try {
      loadingDoctors = true;
      doctores = await doctorService.getAllDoctors();
      mostrarDoctores = true;
      error = "";
    } catch (err) {
      console.error("Error al obtener doctores:", err);
      error = "Ocurrió un error al consultar los doctores.";
    } finally {
      loadingDoctors = false;
    }
  }

  let appointments: Appointment[] = [];
  let loadingAppointments = false;
  let mostrarAppointments = false;

  async function verAppointments() {
    if (mostrarAppointments) {
      mostrarAppointments = false;
      return;
    }

    try {
      loadingAppointments = true;
      appointments = await getAllAppointments();
      mostrarAppointments = true;
      error = "";
    } catch (err) {
      console.error("Error al obtener citas:", err);
      error = "Ocurrió un error al consultar tus citas.";
    } finally {
      loadingAppointments = false;
    }
  }

  async function cerrarSesion() {
    if (browser) {
      localStorage.removeItem("usuario");
      await goto("/");
    }
  }

  async function eliminarPaciente() {
    if (!usuario) return;

    const confirmacion = confirm(
      "⚠️ ¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
    );
    if (!confirmacion) return;

    try {
      const success = await patientService.deletePatient(usuario.patientId);

      if (success) {
        alert("✅ Cuenta eliminada correctamente.");
        localStorage.removeItem("usuario");
        await goto("/");
      } else {
        alert("❌ Error al eliminar la cuenta.");
      }
    } catch (err) {
      console.error("Error al eliminar paciente:", err);
      alert("❌ Error de red al eliminar la cuenta.");
    }
  }

  const doctorColumns = [
    { key: "doctorId", title: "ID" },
    { key: "firstName", title: "Nombre" },
    { key: "lastName", title: "Apellido" },
    { key: "specialty", title: "Especialidad" },
    { key: "email", title: "Email" },
    { key: "phone", title: "Teléfono" },
  ];
</script>

<svelte:head>
  <title
    >{usuario ? `Bienvenido, ${usuario.firstName}` : "Panel de Paciente"} | Sistema
    Médico</title
  >
</svelte:head>

{#if loadingUser}
  <div class="loading-container">
    <div class="loading-spinner"></div>
    <p>Cargando perfil...</p>
  </div>
{:else if usuario}
  <DashboardLayout
    title="Panel de Paciente"
    userName={`${usuario.firstName} ${usuario.lastName}`}
    userAvatar="🧑‍⚕️"
  >
    <svelte:fragment slot="sidebar">
      <NavItem icon="🏠" text="Inicio" active={true} />
      <NavItem
        icon="📅"
        text="Mis Citas"
        on:click={() => goto("/patient/appointments")}
      />
      <NavItem
        icon="📝"
        text="Actualizar Datos"
        on:click={() => goto("/patient/updatePatient")}
      />
      <NavItem icon="🚪" text="Cerrar Sesión" on:click={cerrarSesion} />
      <NavItem
        icon="🗑️"
        text="Eliminar Cuenta"
        danger={true}
        on:click={eliminarPaciente}
      />
    </svelte:fragment>

    <div class="dashboard-welcome">
      <h2>Bienvenido, {usuario.firstName} 👋</h2>
      <p>Gestiona tus citas médicas y encuentra el médico adecuado para ti.</p>
    </div>

    <div class="cards-grid">
      <ActionCard
        icon="👨‍⚕️"
        title="Ver Doctores"
        description="Consulta la lista de doctores disponibles"
        variant="primary"
      >
        <Button
          variant={mostrarDoctores ? "secondary" : "primary"}
          on:click={getAllDoctors}
          size="sm"
        >
          {mostrarDoctores ? "Ocultar Doctores" : "Ver Doctores"}
        </Button>
      </ActionCard>

      <ActionCard
        icon="📅"
        title="Ver Citas"
        description="Consulta tus citas médicas programadas"
        variant="success"
      >
        <Button
          variant={mostrarAppointments ? "secondary" : "primary"}
          on:click={verAppointments}
          size="sm"
        >
          {mostrarAppointments ? "Ocultar Citas" : "Ver Citas"}
        </Button>
      </ActionCard>

      <ActionCard
        icon="🔍"
        title="Buscar Doctor"
        description="Busca un doctor específico por ID"
        variant="secondary"
      >
        <Button
          variant="secondary"
          size="sm"
          on:click={() => goto("/doctorById")}
        >
          Buscar
        </Button>
      </ActionCard>

      <ActionCard
        icon="🔎"
        title="Buscar Cita"
        description="Consulta una cita específica por ID"
        variant="info"
      >
        <Button
          variant="primary"
          size="sm"
          on:click={() => goto("/patient/appointmentDetails")}
        >
          Buscar Cita
        </Button>
      </ActionCard>

      <ActionCard
        icon="✏️"
        title="Actualizar Datos"
        description="Modifica tu información personal"
        variant="info"
      >
        <Button
          variant="primary"
          size="sm"
          on:click={() => goto("/patient/updatePatient")}
        >
          Actualizar
        </Button>
      </ActionCard>
    </div>

    {#if error}
      <div class="error-alert">
        <span>⚠️</span>
        {error}
      </div>
    {/if}

    {#if mostrarDoctores}
      <div class="table-section">
        <h3>Lista de Doctores</h3>
        <DataTable
          data={doctores}
          columns={doctorColumns}
          loading={loadingDoctors}
          emptyMessage="No hay doctores disponibles en este momento."
        />
      </div>
    {/if}

    {#if mostrarAppointments}
      <div class="table-section">
        <h3>Mis Citas Médicas</h3>
        <DataTable
          data={appointments
            .filter(
              (a) => String(a.patient.patientId) === String(usuario?.patientId),
            )
            .map((a) => ({
              appointmentId: a.appointmentId,
              appointmentDate: a.appointmentDate,
              startTime: a.startTime,
              endTime: a.endTime,
              status: a.status,
              doctorName: `${a.doctor.firstName ?? ""} ${a.doctor.lastName ?? ""}`,
              actions: a.appointmentId,
            }))}
          columns={[
            { key: "appointmentId", title: "ID" },
            { key: "appointmentDate", title: "Fecha" },
            { key: "startTime", title: "Inicio" },
            { key: "endTime", title: "Fin" },
            { key: "status", title: "Estado" },
            { key: "doctorName", title: "Doctor" },
            {
              key: "actions",
              title: "Acciones",
              render: (id) => `
            <a class="action-link" href="/patient/updateAppointment?appointmentId=${id}">✏️ Editar</a>
            &nbsp;|&nbsp;
            <a class="action-link delete" href="#" onclick="event.preventDefault(); dispatchEvent(new CustomEvent('delete-appointment', { detail: ${id} }));">🗑️ Eliminar</a>
          `,
            },
          ]}
          loading={loadingAppointments}
          emptyMessage="No tienes citas médicas registradas."
        />
        {#if successMessage}
          <div class="success-toast">{successMessage}</div>
        {/if}
      </div>
    {/if}
  </DashboardLayout>
{:else}
  <div class="error-container">
    <h1>No has iniciado sesión</h1>
    <p>Para acceder a esta página, debes iniciar sesión primero.</p>
    <Button on:click={() => goto("/patient/loginPatient")}
      >Iniciar sesión</Button
    >
  </div>
{/if}

<style>
  .action-link {
    color: #3b82f6;
    font-weight: 500;
    text-decoration: none;
  }
  .action-link.delete {
    color: #dc2626;
  }
  .action-link:hover {
    text-decoration: underline;
  }
  .success-toast {
    background-color: #d1fae5;
    color: #065f46;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 500;
    font-size: 0.95rem;
    margin-top: 1rem;
    max-width: 600px;
    transition: opacity 0.3s ease;
  }
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
    border-top-color: #3b82f6;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .dashboard-welcome {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .dashboard-welcome h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 0.5rem 0;
  }

  .dashboard-welcome p {
    color: #6b7280;
    margin: 0;
    font-size: 1.1rem;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
