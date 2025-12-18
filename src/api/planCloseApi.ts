// API para cerrar o reevaluar plan terapéutico
import type { PlanTratamientoDto } from './planApi';
import apiFetch from './client'

// Cerrar plan terapéutico (marcar como inactivo/finalizado)
export async function cerrarPlanTratamiento(planId: number): Promise<PlanTratamientoDto> {
  return apiFetch(`/api/plan_tratamiento/${planId}/cerrar`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estaActivo: false }) })
}

// Reevaluar plan terapéutico (opcional: dejar en evaluación o crear nuevo ciclo)
export async function reevaluarPlanTratamiento(planId: number, estado: 'En evaluación' | 'Reevaluado'): Promise<PlanTratamientoDto> {
  return apiFetch(`/api/plan_tratamiento/${planId}/reevaluar`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado }) })
}
