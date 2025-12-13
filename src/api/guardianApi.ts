import apiFetch from './client'

export type GuardianDto = {
  id?: number;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  dni: string;
  tipoRelacionId: number;
}

export async function getGuardians(): Promise<GuardianDto[]> {
  return apiFetch('/api/guardian', { method: 'GET' })
}

export async function createGuardian(body: GuardianDto): Promise<GuardianDto> {
  return apiFetch('/api/guardian', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export async function updateGuardian(id: number, body: GuardianDto): Promise<GuardianDto> {
  return apiFetch(`/api/guardian/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}

export async function deleteGuardian(id: number): Promise<void> {
  await apiFetch(`/api/guardian/${id}`, { method: 'DELETE' })
}
