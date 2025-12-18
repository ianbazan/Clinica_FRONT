// Extiende el tipo Appointment para incluir professionalName y professionalId
export type Appointment = {
  id: number;
  year: number;
  month: number;
  day: number;
  reason: string;
  patientName: string;
  status: string;
  isActive: boolean;
  scheduledDate: string;
  professionalName?: string;
  professionalId?: number;
};
