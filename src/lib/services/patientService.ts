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
  
  getPatientById: async (patientId: string): Promise<Patient | null> => {
    const soapBody = `<soap:getPatient><patientId>${patientId}</patientId></soap:getPatient>`;
    const response = await userSoapService.callService("getPatient", soapBody);
    
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
  }
};