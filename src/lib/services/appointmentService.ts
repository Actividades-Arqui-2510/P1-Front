import { appointmentSoapService } from './soapService';
import type { Appointment } from '$lib/types/appointment';

export const appointmentService = {
  // Obtener todas las citas
  getAllAppointments: async (): Promise<Appointment[]> => {
    const soapBody = `<soap:getAllAppointments/>`;
    const { xmlDoc, success } = await appointmentSoapService.callService(
      'getAllAppointments',
      soapBody
    );
    if (!success) throw new Error('Error al obtener citas');

    const nodes = Array.from(xmlDoc.getElementsByTagName('appointment'));
    return nodes.map((el) => {
      const get = (tag: string, parent: Element = el) =>
        parent.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';

      const doctorEl = el.getElementsByTagName('doctor')[0];
      const patientEl = el.getElementsByTagName('patient')[0];

      return {
        appointmentId: Number(get('appointmentId')),
        appointmentDate: get('appointmentDate'),
        startTime: get('startTime'),
        endTime: get('endTime'),
        status: get('status'),
        notes: get('notes'),
        doctor: {
          doctorId: get('doctorId', doctorEl),
          firstName: get('firstName', doctorEl),
          lastName: get('lastName', doctorEl),
          specialty: get('specialty', doctorEl),
          email: get('email', doctorEl),
          phone: get('phone', doctorEl)
        },
        patient: {
          patientId: get('patientId', patientEl),
          firstName: get('firstName', patientEl),
          lastName: get('lastName', patientEl),
          dateOfBirth: get('dateOfBirth', patientEl),
          email: get('email', patientEl),
          phone: get('phone', patientEl)
        }
      };
    });
  },

  // Obtener detalles de una cita específica por ID
  getAppointmentById: async (appointmentId: string | number): Promise<Appointment | null> => {
    const soapBody = `
      <soap:getAppointmentDetails>
        <appointmentId>${appointmentId}</appointmentId>
      </soap:getAppointmentDetails>
    `;
    
    try {
      const { xmlDoc, success } = await appointmentSoapService.callService(
        'getAppointmentDetails', 
        soapBody
      );
      
      if (!success) return null;
      
      const appointmentEl = xmlDoc.querySelector('appointment');
      if (!appointmentEl) return null;
      
      const get = (tag: string, parent: Element = appointmentEl) =>
        parent.querySelector(tag)?.textContent?.trim() ?? '';
        
      const doctorEl = appointmentEl.querySelector('doctor');
      const patientEl = appointmentEl.querySelector('patient');
      
      if (!doctorEl || !patientEl) return null;
      
      return {
        appointmentId: Number(get('appointmentId')),
        appointmentDate: get('appointmentDate'),
        startTime: get('startTime'),
        endTime: get('endTime'),
        status: get('status'),
        notes: get('notes'),
        doctor: {
          doctorId: get('doctorId', doctorEl),
          firstName: get('firstName', doctorEl),
          lastName: get('lastName', doctorEl),
          specialty: get('specialty', doctorEl),
          email: get('email', doctorEl),
          phone: get('phone', doctorEl)
        },
        patient: {
          patientId: get('patientId', patientEl),
          firstName: get('firstName', patientEl),
          lastName: get('lastName', patientEl),
          dateOfBirth: get('dateOfBirth', patientEl),
          email: get('email', patientEl),
          phone: get('phone', patientEl)
        }
      };
    } catch (error) {
      console.error('Error al obtener detalles de la cita:', error);
      return null;
    }
  },

  // Crear una nueva cita
  createAppointment: async (appointment: Omit<Appointment, 'appointmentId'>): Promise<boolean> => {
    // Aseguramos que las fechas tengan el formato YYYY-MM-DD y las horas HH:MM
    const appointmentDate = appointment.appointmentDate; // Ya debe venir en formato YYYY-MM-DD
    const startTime = appointment.startTime; // Ya debe venir en formato HH:MM
    const endTime = appointment.endTime; // Ya debe venir en formato HH:MM
    
    const soapBody = `
      <soap:createAppointment>
        <appointment>
          <doctor>
            <doctorId>${appointment.doctor.doctorId}</doctorId>
          </doctor>
          <patient>
            <patientId>${appointment.patient.patientId}</patientId>
          </patient>
          <appointmentDate>${appointmentDate}</appointmentDate>
          <startTime>${startTime}</startTime>
          <endTime>${endTime}</endTime>
          <status>${appointment.status}</status>
          <notes>${appointment.notes || ''}</notes>
        </appointment>
      </soap:createAppointment>
    `;
    
    try {
      const { success } = await appointmentSoapService.callService(
        'createAppointment',
        soapBody
      );
      return success;
    } catch (error) {
      console.error('Error al crear cita:', error);
      return false;
    }
  },

  // Actualizar una cita existente
  updateAppointment: async (appointment: Appointment): Promise<boolean> => {
    // Aseguramos que las fechas tengan el formato YYYY-MM-DD y las horas HH:MM
    const appointmentDate = appointment.appointmentDate; // Ya debe venir en formato YYYY-MM-DD
    const startTime = appointment.startTime; // Ya debe venir en formato HH:MM
    const endTime = appointment.endTime; // Ya debe venir en formato HH:MM
    
    const soapBody = `
      <soap:updateAppointment>
        <appointment>
          <appointmentId>${appointment.appointmentId}</appointmentId>
          <doctor>
            <doctorId>${appointment.doctor.doctorId}</doctorId>
          </doctor>
          <patient>
            <patientId>${appointment.patient.patientId}</patientId>
          </patient>
          <appointmentDate>${appointmentDate}</appointmentDate>
          <startTime>${startTime}</startTime>
          <endTime>${endTime}</endTime>
          <status>${appointment.status}</status>
          <notes>${appointment.notes || ''}</notes>
        </appointment>
      </soap:updateAppointment>
    `;
    
    try {
      const { success } = await appointmentSoapService.callService(
        'updateAppointment',
        soapBody
      );
      return success;
    } catch (error) {
      console.error('Error al actualizar cita:', error);
      return false;
    }
  },

  // Eliminar una cita por ID
  deleteAppointment: async (appointmentId: string | number): Promise<boolean> => {
    const soapBody = `
      <soap:deleteAppointment>
        <appointmentId>${appointmentId}</appointmentId>
      </soap:deleteAppointment>
    `;
    const { success } = await appointmentSoapService.callService(
      'deleteAppointment',
      soapBody
    );
    return success;
  },
  
  // Obtener citas de un doctor específico
  getAppointmentsByDoctorId: async (doctorId: string): Promise<Appointment[]> => {
    const soapBody = `
      <soap:getAppointmentsByDoctorId>
        <doctorId>${doctorId}</doctorId>
      </soap:getAppointmentsByDoctorId>
    `;
    
    try {
      const { xmlDoc, success } = await appointmentSoapService.callService(
        'getAppointmentsByDoctorId',
        soapBody
      );
      
      if (!success) return [];
      
      const nodes = Array.from(xmlDoc.getElementsByTagName('appointments'));
      return nodes.map((el) => {
        const get = (tag: string, parent: Element = el) =>
          parent.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';
  
        const doctorEl = el.getElementsByTagName('doctor')[0];
        const patientEl = el.getElementsByTagName('patient')[0];
  
        return {
          appointmentId: Number(get('appointmentId')),
          appointmentDate: get('appointmentDate'),
          startTime: get('startTime'),
          endTime: get('endTime'),
          status: get('status'),
          notes: get('notes'),
          doctor: {
            doctorId: get('doctorId', doctorEl),
            firstName: get('firstName', doctorEl),
            lastName: get('lastName', doctorEl),
            specialty: get('specialty', doctorEl),
            email: get('email', doctorEl),
            phone: get('phone', doctorEl)
          },
          patient: {
            patientId: get('patientId', patientEl),
            firstName: get('firstName', patientEl),
            lastName: get('lastName', patientEl),
            dateOfBirth: get('dateOfBirth', patientEl),
            email: get('email', patientEl),
            phone: get('phone', patientEl)
          }
        };
      });
    } catch (error) {
      console.error('Error al obtener citas del doctor:', error);
      return [];
    }
  },
  
  // Obtener citas de un paciente específico
  getAppointmentsByPatientId: async (patientId: string): Promise<Appointment[]> => {
    const soapBody = `
      <soap:getAppointmentsByPatientId>
        <patientId>${patientId}</patientId>
      </soap:getAppointmentsByPatientId>
    `;
    
    try {
      const { xmlDoc, success } = await appointmentSoapService.callService(
        'getAppointmentsByPatientId',
        soapBody
      );

      console.log(success); // Log the SOAP response for debugging
      
      if (!success) return [];
      
      const nodes = Array.from(xmlDoc.getElementsByTagName('appointments'));
      return nodes.map((el) => {
        const get = (tag: string, parent: Element = el) =>
          parent.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';
  
        const doctorEl = el.getElementsByTagName('doctor')[0];
        const patientEl = el.getElementsByTagName('patient')[0];
  
        return {
          appointmentId: Number(get('appointmentId')),
          appointmentDate: get('appointmentDate'),
          startTime: get('startTime'),
          endTime: get('endTime'),
          status: get('status'),
          notes: get('notes'),
          doctor: {
            doctorId: get('doctorId', doctorEl),
            firstName: get('firstName', doctorEl),
            lastName: get('lastName', doctorEl),
            specialty: get('specialty', doctorEl),
            email: get('email', doctorEl),
            phone: get('phone', doctorEl)
          },
          patient: {
            patientId: get('patientId', patientEl),
            firstName: get('firstName', patientEl),
            lastName: get('lastName', patientEl),
            dateOfBirth: get('dateOfBirth', patientEl),
            email: get('email', patientEl),
            phone: get('phone', patientEl)
          }
        };
      });
    } catch (error) {
      console.error('Error al obtener citas del paciente:', error);
      return [];
    }
  }
};