import type { Doctor } from './doctor';
import type { Patient } from './patient';

export interface Appointment {
  appointmentId: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string;
  doctor: Doctor;
  patient: Patient;
};
