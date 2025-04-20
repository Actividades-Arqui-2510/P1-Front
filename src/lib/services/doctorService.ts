import type { Doctor, DoctorUpdateData } from '$lib/types/doctor';
import { userSoapService } from './soapService';

export const doctorService = {
  loginDoctor: async (email: string, password: string): Promise<Doctor | null> => {
    const soapBody = `
      <soap:loginDoctor>
        <email>${email}</email>
        <password>${password}</password>
      </soap:loginDoctor>
    `;
    const response = await userSoapService.callService("loginDoctor", soapBody);
    
    if (!response.success) {
        return null;
    } 
    const doctorNode = response.xmlDoc.getElementsByTagName("doctor")[0];
    if (!doctorNode) return null; 
    return {
        doctorId: doctorNode.getElementsByTagName("doctorId")[0]?.textContent,
        firstName: doctorNode.getElementsByTagName("firstName")[0]?.textContent,
        lastName: doctorNode.getElementsByTagName("lastName")[0]?.textContent,
        specialty: doctorNode.getElementsByTagName("specialty")[0]?.textContent,
        email: doctorNode.getElementsByTagName("email")[0]?.textContent,
        phone: doctorNode.getElementsByTagName("phone")[0]?.textContent,
    };
  },
  getAllDoctors: async (): Promise<Doctor[]> => {
    const soapBody = `<soap:getAllDoctors/>`;
    const response = await userSoapService.callService("getAllDoctors", soapBody);
    
    if (!response.success) {
      throw new Error('Error al obtener doctores');
    }

    const doctorNodes = Array.from(response.xmlDoc.getElementsByTagName("doctors"));
    return doctorNodes.map(el => ({
      doctorId: el.getElementsByTagName("doctorId")[0]?.textContent,
      firstName: el.getElementsByTagName("firstName")[0]?.textContent,
      lastName: el.getElementsByTagName("lastName")[0]?.textContent,
      specialty: el.getElementsByTagName("specialty")[0]?.textContent,
      email: el.getElementsByTagName("email")[0]?.textContent,
      phone: el.getElementsByTagName("phone")[0]?.textContent,
    }));
  },
  
  getDoctorById: async (doctorId: string): Promise<Doctor | null> => {
    const soapBody = `<soap:getDoctorById><doctorId>${doctorId}</doctorId></soap:getDoctorById>`;
    const response = await userSoapService.callService("getDoctorById", soapBody);
    
    if (!response.success) {
      throw new Error('Error al obtener doctor');
    }
    
    const doctorNode = response.xmlDoc.getElementsByTagName("doctor")[0];
    if (!doctorNode) return null;
    
    return {
      doctorId: doctorNode.getElementsByTagName("doctorId")[0]?.textContent,
      firstName: doctorNode.getElementsByTagName("firstName")[0]?.textContent,
      lastName: doctorNode.getElementsByTagName("lastName")[0]?.textContent,
      specialty: doctorNode.getElementsByTagName("specialty")[0]?.textContent,
      email: doctorNode.getElementsByTagName("email")[0]?.textContent,
      phone: doctorNode.getElementsByTagName("phone")[0]?.textContent,
    };
  },

  updateDoctor: async (doctorData: DoctorUpdateData): Promise<boolean> => {
    const soapBody = `
      <soap:updateDoctor>
        <doctor>
          <doctorId>${doctorData.doctorId}</doctorId>
          <firstName>${doctorData.firstName}</firstName>
          <lastName>${doctorData.lastName}</lastName>
          <specialty>${doctorData.specialty}</specialty>
          <email>${doctorData.email}</email>
          <phone>${doctorData.phone}</phone>
        </doctor>
      </soap:updateDoctor>
    `;
    
    try {
      const response = await userSoapService.callService("updateDoctor", soapBody);
      return response.success;
    } catch (error) {
      console.error("Error al actualizar doctor:", error);
      throw error;
    }
  },

  registerDoctor: async (doctorData: Omit<Doctor, 'doctorId'>, password: string): Promise<boolean> => {
    // Construir el XML según el formato requerido por el endpoint
    const soapBody = `
      <soap:saveDoctor>
        <doctor>
          <firstName>${doctorData.firstName}</firstName>
          <lastName>${doctorData.lastName}</lastName>
          <specialty>${doctorData.specialty}</specialty>
          <email>${doctorData.email}</email>
          <phone>${doctorData.phone}</phone>
        </doctor>
        <password>${password}</password>
      </soap:saveDoctor>
    `;
    
    try {
      const response = await userSoapService.callService("saveDoctor", soapBody);
      return response.success;
    } catch (error) {
      console.error("Error al registrar doctor:", error);
      throw error;
    }
  },

  deleteDoctor: async (doctorId: string): Promise<boolean> => {
    const soapBody = `<soap:deleteDoctor><doctorId>${doctorId}</doctorId></soap:deleteDoctor>`;
    const response = await userSoapService.callService("deleteDoctor", soapBody);
    
    return response.success;
  }
};