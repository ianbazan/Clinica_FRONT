import apiFetch from './client'

export type GuardianDto = {
  id?: number
  name: string
  lastName: string
  telephone: string
  address?: string
  dni: string
  tipoRelacionId: number
}

export type PatientDto = {
  id?: number
  name: string
  lastName: string
  gender: boolean
  dni: string
  birthDate: string // LocalDate as ISO string (YYYY-MM-DD)
  autismLevel: string // 'Leve' | 'Moderado' | 'Grave'
  guardianId: number
  isActive?: boolean
}

// Guardian endpoints
export async function createGuardian(body: GuardianDto): Promise<GuardianDto> {
  return apiFetch('/guardian', { method: 'POST', body: JSON.stringify(body) })
}

// Patient endpoints
export async function createPatient(body: PatientDto): Promise<PatientDto> {
  return apiFetch('/patient', { method: 'POST', body: JSON.stringify(body) })
}
