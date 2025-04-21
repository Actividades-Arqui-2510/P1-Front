<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { appointmentService } from "$lib/services/appointmentService";
    import { patientService } from "$lib/services/patientService";
    import type { Doctor } from "$lib/types/doctor";
    import type { Appointment } from "$lib/types/appointment";
    
    import DashboardLayout from "$lib/components/DashboardLayout.svelte";
    import NavItem from "$lib/components/NavItem.svelte";
    import { onMount } from "svelte";
    
    let doctor: Doctor | null = null;
    let appointments: Appointment[] = [];
    let patientCount = 0;
    let loading = true;
    let error = "";
    
    // Estadísticas calculadas
    let totalAppointments = 0;
    let upcomingAppointments = 0;
    let completedAppointments = 0;
    let cancelledAppointments = 0;
    let uniquePatients = new Set();
    let appointmentsByDay = [0, 0, 0, 0, 0, 0, 0]; // Dom, Lun, Mar, Mié, Jue, Vie, Sáb
    
    onMount(async () => {
      if (browser) {
        const doctorStr = localStorage.getItem("doctor");
        doctor = doctorStr ? JSON.parse(doctorStr) : null;
        
        if (!doctor) {
          goto("/doctor/loginDoctor");
          return;
        }
        
        try {
          // Cargar citas del doctor
          appointments = await appointmentService.getAppointmentsByDoctorId(doctor.doctorId ?? "");
          
          // Calcular estadísticas
          calculateStatistics(appointments);
          
          // Obtener todos los pacientes para el conteo
          const allPatients = await patientService.getAllPatients();
          patientCount = allPatients.length;
          
        } catch (err) {
          console.error("Error al cargar datos para estadísticas:", err);
          error = "No se pudieron cargar los datos para las estadísticas";
        } finally {
          loading = false;
        }
      }
    });
    
    function calculateStatistics(appointments: Appointment[]) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      totalAppointments = appointments.length;
      
      // Contar citas por estado y pacientes únicos
      appointments.forEach(app => {
        // Contar por estado
        if (app.status === "COMPLETED") {
          completedAppointments++;
        } else if (app.status === "CANCELLED") {
          cancelledAppointments++;
        } else {
          // Verificar si es una cita futura
          const appDate = new Date(app.appointmentDate);
          if (appDate >= today) {
            upcomingAppointments++;
          }
        }
        
        // Agregar paciente único
        uniquePatients.add(app.patient.patientId);
        
        // Contar citas por día de la semana
        const date = new Date(app.appointmentDate);
        const dayOfWeek = date.getDay(); // 0 = domingo, 6 = sábado
        appointmentsByDay[dayOfWeek]++;
      });
    }
    
    function cerrarSesion() {
      if (browser) {
        localStorage.removeItem("doctor");
        goto("/");
      }
    }
    
    // Nombres de los días para la visualización
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  </script>
  
  <svelte:head>
    <title>Estadísticas | Panel Médico</title>
  </svelte:head>
  
  {#if loading}
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando estadísticas...</p>
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
          on:click={() => goto('/doctor/homeDoctor')} 
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
          icon="📊" 
          text="Estadísticas" 
          active={true}
        />
        <NavItem 
          icon="🚪" 
          text="Cerrar Sesión" 
          on:click={cerrarSesion} 
        />
      </svelte:fragment>
  
      <div class="page-header">
        <h2>Estadísticas y Análisis</h2>
        <p>Resumen de su actividad médica y citas</p>
      </div>
  
      {#if error}
        <div class="error-alert">
          <span>⚠️</span> {error}
        </div>
      {/if}
  
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{totalAppointments}</div>
            <div class="stat-label">Total de citas</div>
          </div>
        </div>
        
        <div class="stat-card upcoming">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-value">{upcomingAppointments}</div>
            <div class="stat-label">Citas próximas</div>
          </div>
        </div>
        
        <div class="stat-card completed">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{completedAppointments}</div>
            <div class="stat-label">Citas completadas</div>
          </div>
        </div>
        
        <div class="stat-card cancelled">
          <div class="stat-icon">❌</div>
          <div class="stat-content">
            <div class="stat-value">{cancelledAppointments}</div>
            <div class="stat-label">Citas canceladas</div>
          </div>
        </div>
        
        <div class="stat-card patients">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-value">{uniquePatients.size}</div>
            <div class="stat-label">Pacientes atendidos</div>
          </div>
        </div>
        
        <div class="stat-card rate">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <div class="stat-value">{totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0}%</div>
            <div class="stat-label">Tasa de completitud</div>
          </div>
        </div>
      </div>
  
      <div class="chart-section">
        <h3>Citas por día de la semana</h3>
        <div class="week-chart">
          {#each appointmentsByDay as count, day}
            <div class="chart-bar-container">
              <div class="chart-bar-label">{dayNames[day]}</div>
              <div class="chart-bar" style="height: {count ? Math.max(count * 15, 30) : 30}px">
                <span class="chart-bar-value">{count}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
  
      <div class="recent-section">
        <h3>Próximas citas</h3>
        {#if appointments.filter(a => a.status === "SCHEDULED").length > 0}
          <ul class="recent-list">
            {#each appointments
              .filter(a => a.status === "SCHEDULED")
              .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
              .slice(0, 5) as appointment}
              <li class="recent-item">
                <div class="recent-date">
                  <span class="date">{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                  <span class="time">{appointment.startTime} - {appointment.endTime}</span>
                </div>
                <div class="recent-details">
                  <span class="patient-name">{appointment.patient.firstName} {appointment.patient.lastName}</span>
                  <span class="appointment-id">ID: {appointment.appointmentId}</span>
                </div>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="empty-message">No hay citas programadas próximamente</p>
        {/if}
      </div>
    </DashboardLayout>
  {:else}
    <div class="error-container">
      <h1>No has iniciado sesión</h1>
      <p>Para acceder a esta página, debes iniciar sesión como doctor.</p>
      <a href="/doctor/loginDoctor" class="login-button">Iniciar sesión</a>
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
    
    .page-header {
      margin-bottom: 2rem;
    }
    
    .page-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }
    
    .page-header p {
      color: #6b7280;
      margin: 0;
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
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    
    .stat-card {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      transition: all 0.2s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .stat-icon {
      font-size: 2rem;
      opacity: 0.8;
    }
    
    .stat-content {
      flex: 1;
    }
    
    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #111827;
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }
    
    .stat-card.total {
      border-left: 4px solid #6366f1;
    }
    
    .stat-card.upcoming {
      border-left: 4px solid #10b981;
    }
    
    .stat-card.completed {
      border-left: 4px solid #0ea5e9;
    }
    
    .stat-card.cancelled {
      border-left: 4px solid #ef4444;
    }
    
    .stat-card.patients {
      border-left: 4px solid #f59e0b;
    }
    
    .stat-card.rate {
      border-left: 4px solid #8b5cf6;
    }
    
    .chart-section, .recent-section {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    
    h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #111827;
      margin-top: 0;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1rem;
    }
    
    .week-chart {
      display: flex;
      height: 200px;
      align-items: flex-end;
      justify-content: space-between;
      padding: 0 1rem;
    }
    
    .chart-bar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 12%;
    }
    
    .chart-bar {
      width: 100%;
      background-color: #10b981;
      border-radius: 6px 6px 0 0;
      position: relative;
      display: flex;
      justify-content: center;
      padding-top: 5px;
      color: white;
      font-weight: 600;
      font-size: 0.85rem;
      min-height: 30px;
    }
    
    .chart-bar-value {
      position: absolute;
      top: -20px;
      font-weight: 600;
      font-size: 0.85rem;
      color: #111827;
    }
    
    .chart-bar-label {
      margin-top: 0.75rem;
      font-size: 0.9rem;
      color: #6b7280;
      font-weight: 500;
    }
    
    .recent-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .recent-item {
      display: flex;
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
      transition: background-color 0.2s ease;
    }
    
    .recent-item:last-child {
      border-bottom: none;
    }
    
    .recent-item:hover {
      background-color: #f9fafb;
    }
    
    .recent-date {
      min-width: 120px;
      display: flex;
      flex-direction: column;
    }
    
    .recent-date .date {
      font-weight: 600;
      color: #111827;
    }
    
    .recent-date .time {
      font-size: 0.85rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }
    
    .recent-details {
      display: flex;
      flex-direction: column;
      margin-left: 1rem;
    }
    
    .recent-details .patient-name {
      font-weight: 500;
      color: #111827;
    }
    
    .recent-details .appointment-id {
      font-size: 0.85rem;
      color: #6b7280;
      margin-top: 0.25rem;
    }
    
    .empty-message {
      color: #6b7280;
      font-style: italic;
      text-align: center;
      padding: 1.5rem 0;
      border: 1px dashed #e5e7eb;
      border-radius: 8px;
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
    
    .login-button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #10b981;
      color: white;
      border-radius: 8px;
      font-weight: 500;
      text-decoration: none;
      transition: background-color 0.2s ease;
    }
    
    .login-button:hover {
      background-color: #059669;
    }
    
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 1rem;
      }
      
      .stat-card {
        padding: 1rem;
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
      }
      
      .stat-icon {
        font-size: 1.5rem;
      }
      
      .stat-value {
        font-size: 1.5rem;
      }
      
      .chart-bar-container {
        width: 10%;
      }
      
      .recent-item {
        flex-direction: column;
      }
      
      .recent-details {
        margin-left: 0;
        margin-top: 0.75rem;
      }
    }
  </style>