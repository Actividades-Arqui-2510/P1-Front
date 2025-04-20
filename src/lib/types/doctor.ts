export interface Doctor {
  doctorId: string | null;
  firstName: string | null;
  lastName: string | null;
  specialty: string | null;
  email: string | null;
  phone: string | null;
}

export interface DoctorUpdateData {
  doctorId: string;
  firstName?: string;
  lastName?: string;
  specialty?: string;
  email?: string;
  phone?: string;
}