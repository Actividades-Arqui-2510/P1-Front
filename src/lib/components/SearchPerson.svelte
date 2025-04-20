<script lang="ts">
    import EntitySearch from './EntitySearch.svelte';
    import { onMount } from 'svelte';
    import { doctorService } from '$lib/services/doctorService';
    import { patientService } from '$lib/services/patientService';
    import type { Doctor } from '$lib/types/doctor';
    import type { Patient } from '$lib/types/patient';
    
    // Props to make the component configurable
    export let personType: 'doctor' | 'patient' = 'doctor';
    
    // Configuration based on person type
    const config = {
      doctor: {
        title: "Buscar Doctor",
        description: "Ingresa el ID del doctor para ver su información",
        icon: "🩺",
        iconGradient: "135deg, #10b981, #059669",
        entityLabel: "Doctor",
        placeholder: "Ejemplo: DOC123",
        avatarIcon: "👨‍⚕️",
        specialtyLabel: "Especialidad",
        idPrefix: "DOC"
      },
      patient: {
        title: "Buscar Paciente",
        description: "Ingresa el ID del paciente para ver su información",
        icon: "🧑‍⚕️",
        iconGradient: "135deg, #3b82f6, #2563eb",
        entityLabel: "Paciente",
        placeholder: "Ejemplo: PAT123",
        avatarIcon: "👤",
        specialtyLabel: "Fecha de Nacimiento",
        idPrefix: "PAT"
      }
    };
    
    // Choose the appropriate search function based on personType
    async function searchPerson(id: string): Promise<Doctor | Patient | null> {
      if (personType === 'doctor') {
        return await doctorService.getDoctorById(id);
      } else {
        return await patientService.getPatientById(id);
      }
    }
    
    // If ID doesn't have the prefix, add it
    function formatId(id: string): string {
      const prefix = config[personType].idPrefix;
      if (!id.startsWith(prefix)) {
        return `${prefix}${id}`;
      }
      return id;
    }
  </script>
  
  <svelte:head>
    <title>Buscar {config[personType].entityLabel} | Sistema Médico</title>
  </svelte:head>
  
  <EntitySearch
    title={config[personType].title}
    description={config[personType].description}
    icon={config[personType].icon}
    iconGradient={config[personType].iconGradient}
    entityLabel={config[personType].entityLabel}
    entityIdPlaceholder={config[personType].placeholder}
    entityAvatarIcon={config[personType].avatarIcon}
    search={searchPerson}
  >
    <svelte:fragment slot="result" let:entity={person}>
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar" style="background: linear-gradient({config[personType].iconGradient})">
            {config[personType].avatarIcon}
          </div>
          <div class="profile-title">
            <h3>{person.firstName} {person.lastName}</h3>
            {#if personType === 'doctor' && 'specialty' in person}
              <span class="specialty">{person.specialty}</span>
            {:else if personType === 'patient' && 'dateOfBirth' in person}
              <span class="specialty">Nacimiento: {new Date(person.dateOfBirth).toLocaleDateString()}</span>
            {/if}
          </div>
        </div>
        
        <div class="detail-section">
          <div class="detail-item">
            <span class="detail-icon">🆔</span>
            <div class="detail-content">
              <span class="detail-label">ID</span>
              <span class="detail-value">
                {personType === 'doctor' ? person.doctorId : person.patientId}
              </span>
            </div>
          </div>
          
          <div class="detail-item">
            <span class="detail-icon">✉️</span>
            <div class="detail-content">
              <span class="detail-label">Email</span>
              <span class="detail-value">{person.email}</span>
            </div>
          </div>
          
          <div class="detail-item">
            <span class="detail-icon">📱</span>
            <div class="detail-content">
              <span class="detail-label">Teléfono</span>
              <span class="detail-value">{person.phone || 'No disponible'}</span>
            </div>
          </div>
          
          {#if personType === 'patient' && 'dateOfBirth' in person}
            <div class="detail-item">
              <span class="detail-icon">🎂</span>
              <div class="detail-content">
                <span class="detail-label">Edad</span>
                <span class="detail-value">
                  {calculateAge(person.dateOfBirth)} años
                </span>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </svelte:fragment>
  </EntitySearch>
  
  <style>
    .profile-card {
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      background-color: white;
    }
    
    .profile-header {
      padding: 1.5rem;
      background-color: #f9fafb;
      display: flex;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .profile-title h3 {
      margin: 0 0 0.25rem;
      font-size: 1.25rem;
      color: #111827;
      font-weight: 600;
    }
    
    .specialty {
      color: #4b5563;
      font-size: 0.9rem;
      font-weight: 500;
      display: block;
    }
    
    .detail-section {
      padding: 0.5rem 0;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .detail-item:last-child {
      border-bottom: none;
    }
    
    .detail-icon {
      font-size: 1.25rem;
      margin-right: 1rem;
      color: #4b5563;
      width: 1.5rem;
      text-align: center;
    }
    
    .detail-content {
      flex: 1;
    }
    
    .detail-label {
      display: block;
      font-size: 0.8rem;
      color: #6b7280;
      margin-bottom: 0.25rem;
    }
    
    .detail-value {
      font-weight: 500;
      color: #1f2937;
    }
    
    @media (max-width: 480px) {
      .profile-header {
        flex-direction: column;
        text-align: center;
      }
      
      .detail-item {
        padding: 0.75rem 1rem;
      }
    }
  </style>
  
  <script context="module" lang="ts">
    // Helper function to calculate age
    function calculateAge(dateOfBirth: string): number {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    }
  </script>