<script>
    import { goto } from '$app/navigation';
  </script>
  
  <div class="container">
      <h1>Bienvenido</h1>
      <a href="/loginPaciente" on:click|preventDefault={() => goto('/loginPaciente')}>
          <button>👨‍⚕️ Soy Paciente</button>
      </a>
      <a href="/loginDoctor" on:click|preventDefault={() => goto('/loginDoctor')}>
          <button>🩺 Soy Doctor</button>
      </a>
  </div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    button {
        margin: 10px;
        padding: 12px 24px;
        font-size: 16px;
        cursor: pointer;
    }
</style>
