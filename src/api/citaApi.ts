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
  const res = await fetch('/api/citas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    // Si el error es 404, devolver el mensaje exacto
    if (res.status === 404) {
      const err = await res.json();
      throw { message: err.message || 'El dni del paciente no está registrado' };
    }
    throw await res.json();
  }
  return res.json();
}

// Obtener cita por id
export async function obtenerCita(id: number): Promise<CitaDto> {
  const res = await fetch(`/api/citas/${id}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// Listar citas (con filtros opcionales)
export async function listarCitas(params: Record<string, any> = {}): Promise<any> {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`/api/citas${query ? `?${query}` : ''}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// Actualizar cita
export async function actualizarCita(id: number, body: Partial<CitaDto>): Promise<CitaDto> {
  const res = await fetch(`/api/citas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Eliminar cita (soft delete)
export async function eliminarCita(id: number): Promise<void> {
  const res = await fetch(`/api/citas/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw await res.json();
}