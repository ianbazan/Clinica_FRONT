import apiFetch from './client'

export type CitaDto = {
  pacienteNombre: number
  profesionalNombre: string
  id: number
  razon: string
  pacienteId: number
  pacienteDni: string
  profesionalId: number | null
  fechaProgramada: string // ISO LocalDateTime
  estado: string
  fechaCreacion: string
  estaActivo: boolean
}

// Crear cita
export async function crearCita(body: { razon: string; pacienteDni: string; fechaProgramada: string }): Promise<CitaDto> {
  return apiFetch('/api/citas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

// Obtener cita por id
export async function obtenerCita(id: number): Promise<CitaDto> {
  return apiFetch(`/api/citas/${id}`)
}

// Listar citas (con filtros opcionales)
export async function listarCitas(params: Record<string, any> = {}): Promise<any> {
  return apiFetch('/api/citas', { query: params })
}

// Actualizar cita
export async function actualizarCita(id: number, body: Partial<CitaDto>): Promise<CitaDto> {
  return apiFetch(`/api/citas/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

// Eliminar cita (soft delete)
export async function eliminarCita(id: number): Promise<void> {
  return apiFetch(`/api/citas/${id}`, { method: 'DELETE' })
}