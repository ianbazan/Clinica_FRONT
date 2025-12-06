import apiFetch from './client'

export type GuardianDto = {
  id?: number
  name: string
  phone?: string
  email?: string
}

export async function getGuardians(): Promise<GuardianDto[]> {
  return apiFetch('/guardian', { method: 'GET' })
}

export async function createGuardian(body: GuardianDto): Promise<GuardianDto> {
  return apiFetch('/guardian', { method: 'POST', body: JSON.stringify(body) })
}

export async function updateGuardian(id: number, body: GuardianDto): Promise<GuardianDto> {
  return apiFetch(`/guardian/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}

export async function deleteGuardian(id: number): Promise<void> {
  await apiFetch(`/guardian/${id}`, { method: 'DELETE' })
}
