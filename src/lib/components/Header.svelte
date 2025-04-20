<script lang="ts">
    export let title: string;
    export let subtitle: string = '';
  </script>
  
  <header>
    <h1>{title}</h1>
    {#if subtitle}
      <p>{subtitle}</p>
    {/if}
    <div class="underline"></div>
  </header>
  
  <style>
    header {
      text-align: center;
      margin-bottom: 3rem;
    }
  
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
      background: linear-gradient(to right, #3b82f6, #10b981);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  
    p {
      color: #6b7280;
      font-size: 1.125rem;
      max-width: 600px;
      margin: 0 auto 1rem;
    }
  
    .underline {
      height: 4px;
      width: 70px;
      background: linear-gradient(to right, #3b82f6, #10b981);
      margin: 0 auto;
      border-radius: 2px;
    }
  </style>