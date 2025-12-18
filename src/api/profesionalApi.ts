import apiFetch from './client'

export type ProfesionalDto = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  isActive: boolean;
  specialtyId: number;
  specialtyName: string;
}

export async function getProfesionales(): Promise<ProfesionalDto[]> {
  return apiFetch('/api/profesionales', { method: 'GET' })
}
