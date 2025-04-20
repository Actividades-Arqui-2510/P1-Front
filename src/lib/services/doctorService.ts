import type { Doctor } from '$lib/types/doctor';
import { userSoapService } from './soapService';

export const doctorService = {
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
    const soapBody = `<soap:getDoctor><doctorId>${doctorId}</doctorId></soap:getDoctor>`;
    const response = await userSoapService.callService("getDoctor", soapBody);
    
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
  }
};