export function isRunningInDocker(): boolean {
    // Si tenemos una variable explícita, la usamos (recomendado)
    if (import.meta.env.VITE_DOCKER_ENV === 'true') {
      return true;
    }
    
    // Si no hay variable explícita, asumimos que no está en Docker
    return false;
  }
  
  /**
   * Obtiene la URL base de la API según el entorno
   */
  export function getApiUrl(): string {
    // Si hay una URL explícita configurada, usarla siempre
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    // De lo contrario, usar URLs predeterminadas según el entorno
    return isRunningInDocker() 
      ? 'http://localhost:8080/soap'       // URL predeterminada para Docker
      : 'https://ubiquitous-barnacle-4jjjr69754wp25qxv-8080.app.github.dev/soap'; // URL predeterminada para desarrollo local
  }
  
  // Exportar configuración centralizada
  export const config = {
    apiUrl: getApiUrl(),
    isDocker: isRunningInDocker()
  };