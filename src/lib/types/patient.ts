export interface Patient {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string
}

export interface PatientUpdateData {
  patientId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}