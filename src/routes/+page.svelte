<script>
    import Header from '$lib/components/Header.svelte';
    import RoleCard from '$lib/components/RoleCard.svelte';
  
    // Agregar animaciones cuando la página carga
    import { onMount } from 'svelte';
    
    let visible = false;
    
    onMount(() => {
      // Pequeño retraso para que se active la animación
      setTimeout(() => {
        visible = true;
      }, 100);
    });
  </script>
  
  <svelte:head>
    <title>Bienvenido | Sistema de Gestión Médica</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  </svelte:head>
  
  <div class="page-container {visible ? 'visible' : ''}">
    <Header 
      title="Sistema de Gestión Médica" 
      subtitle="Selecciona tu rol para comenzar a usar nuestra plataforma"
    />
    
    <div class="cards-container">
      <RoleCard
        title="Acceso Pacientes"
        icon="👨‍⚕️"
        description="Gestiona tus citas médicas y accede a tu historial clínico."
        route="/patient/loginPatient"
        variant="primary"
      />
      
      <RoleCard
        title="Acceso Médicos"
        icon="🩺"
        description="Administra tu agenda y consulta historiales de pacientes."
        route="/doctor/loginDoctor"
        variant="secondary"
      />
    </div>
    
    <footer>
      <p>© {new Date().getFullYear()} Sistema de Gestión Médica | Todos los derechos reservados</p>
    </footer>
  </div>
  
  <style>
    :global(body) {
      margin: 0;
      padding: 0;
      font-family: 'Poppins', sans-serif;
      background-color: #f9fafb;
    }
    
    .page-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .visible {
      opacity: 1;
      transform: translateY(0);
    }
  
    .cards-container {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      justify-content: center;
      margin: 1rem 0 3rem;
    }
    
    footer {
      margin-top: auto;
      padding: 2rem 0 0;
      text-align: center;
      color: #9ca3af;
      font-size: 0.875rem;
    }
    
    @media (max-width: 640px) {
      .cards-container {
        flex-direction: column;
        align-items: center;
      }
    }
  </style>