import apiFetch from './client'

export interface MedicalHistoryDto {
  id: number
  patientId: number
  professionalId: number
  createdAt: string
  description?: string
  diagnosis?: string
  isActive: boolean
}

export async function listMedicalHistories(patientId?: number): Promise<MedicalHistoryDto[]> {
  const query: Record<string, string | number | boolean> = {}
  if (patientId) query.patientId = patientId
  return apiFetch('/api/medical-histories', { query })
}

export async function getMedicalHistory(id: number): Promise<MedicalHistoryDto> {
  return apiFetch(`/api/medical-histories/${id}`)
}
