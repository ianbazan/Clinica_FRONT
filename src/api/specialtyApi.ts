import apiFetch from './client'

export type SpecialtyDto = {
  id: number
  name: string
  description?: string
  isActive: boolean
}

export async function getSpecialties(): Promise<SpecialtyDto[]> {
  return apiFetch('/api/specialties', { method: 'GET' })
}

export default { getSpecialties }
