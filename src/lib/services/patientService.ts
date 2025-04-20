import type { Patient, PatientUpdateData } from '$lib/types/patient';
import { userSoapService } from './soapService';



export const patientService = {
  loginPatient: async (email: string, password: string): Promise<Patient | null> => {
    const soapBody = `
      <soap:loginPatient>
        <email>${email}</email>
        <password>${password}</password>
      </soap:loginPatient>
    `;
    const { xmlDoc, success } = await userSoapService.callService('loginPatient', soapBody);
    if (!success) return null;

    const patientNode = xmlDoc.querySelector('patient');
    if (!patientNode) return null;

    // parseamos dateOfBirth y forzamos formato YYYY-MM-DD
    const rawDob = patientNode.querySelector('dateOfBirth')?.textContent || '';
    const dob = new Date(rawDob).toISOString().slice(0, 10);

    return {
      patientId: patientNode.querySelector('patientId')?.textContent || '',
      firstName: patientNode.querySelector('firstName')?.textContent || '',
      lastName: patientNode.querySelector('lastName')?.textContent || '',
      email: patientNode.querySelector('email')?.textContent || '',
      phone: patientNode.querySelector('phone')?.textContent || '',
      dateOfBirth: dob
    };
  },

  deletePatient: async (patientId: string): Promise<boolean> => {
    const soapBody = `<soap:deletePatient><patientId>${patientId}</patientId></soap:deletePatient>`;
    const response = await userSoapService.callService("deletePatient", soapBody);
    return response.success;
  },
  
  updatePatient: async (patientData: PatientUpdateData): Promise<boolean> => {
    // Construimos el cuerpo XML basado en los campos proporcionados
    let fieldsXml = `<patientId>${patientData.patientId}</patientId>`;
    
    if (patientData.firstName) fieldsXml += `<firstName>${patientData.firstName}</firstName>`;
    if (patientData.lastName) fieldsXml += `<lastName>${patientData.lastName}</lastName>`;
    if (patientData.email) fieldsXml += `<email>${patientData.email}</email>`;
    if (patientData.phone) fieldsXml += `<phone>${patientData.phone}</phone>`;
    
    const soapBody = `<soap:updatePatient>${fieldsXml}</soap:updatePatient>`;
    const response = await userSoapService.callService("updatePatient", soapBody);
    return response.success;
  },

  registerPatient: async (patientData: Omit<Patient, 'patientId'>, password: string): Promise<boolean> => {
    // Construir el XML según el formato requerido por el endpoint
    const soapBody = `
      <soap:savePatient>
        <patient>
          <firstName>${patientData.firstName}</firstName>
          <lastName>${patientData.lastName}</lastName>
          <dateOfBirth>${patientData.dateOfBirth}</dateOfBirth>
          <email>${patientData.email}</email>
          <phone>${patientData.phone}</phone>
        </patient>
        <password>${password}</password>
      </soap:savePatient>
    `;
    
    try {
      const response = await userSoapService.callService("savePatient", soapBody);
      return response.success;
    } catch (error) {
      console.error("Error al registrar paciente:", error);
      throw error;
    }
  },
  
  getPatientById: async (patientId: string): Promise<Patient | null> => {
    const soapBody = `<soap:getPatientById><patientId>${patientId}</patientId></soap:getPatientById>`;
    const response = await userSoapService.callService("getPatientById", soapBody);
    
    if (!response.success) {
      throw new Error('Error al obtener datos del paciente');
    }
    
    const patientNode = response.xmlDoc.getElementsByTagName("patient")[0];
    if (!patientNode) return null;
    
    return {
      patientId: patientNode.getElementsByTagName("patientId")[0]?.textContent || '',
      firstName: patientNode.getElementsByTagName("firstName")[0]?.textContent || '',
      lastName: patientNode.getElementsByTagName("lastName")[0]?.textContent || '',
      email: patientNode.getElementsByTagName("email")[0]?.textContent || '',
      phone: patientNode.getElementsByTagName("phone")[0]?.textContent || '',
      dateOfBirth: patientNode.getElementsByTagName("dateOfBirth")[0]?.textContent || ''
    };
  },

  getAllPatients: async (): Promise<Patient[]> => {
    const soapBody = `<soap:getAllPatients/>`;
    
    const { xmlDoc, success } = await userSoapService.callService("getAllPatients", soapBody);
    if (!success) return [];
    
    const patientNodes = Array.from(xmlDoc.querySelectorAll('patients'));
    
    return patientNodes.map(patient => {
      // parseamos dateOfBirth y forzamos formato YYYY-MM-DD
      const rawDob = patient.querySelector('dateOfBirth')?.textContent || '';
      const dob = new Date(rawDob).toISOString().slice(0, 10);
      
      return {
        patientId: patient.querySelector('patientId')?.textContent || '',
        firstName: patient.querySelector('firstName')?.textContent || '',
        lastName: patient.querySelector('lastName')?.textContent || '',
        email: patient.querySelector('email')?.textContent || '',
        phone: patient.querySelector('phone')?.textContent || '',
        dateOfBirth: dob
      };
    });
  }
};