// API para cerrar o reevaluar plan terapéutico
import type { PlanTratamientoDto } from './planApi';

// Cerrar plan terapéutico (marcar como inactivo/finalizado)
export async function cerrarPlanTratamiento(planId: number): Promise<PlanTratamientoDto> {
  const res = await fetch(`/api/plan_tratamiento/${planId}/cerrar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estaActivo: false }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// Reevaluar plan terapéutico (opcional: dejar en evaluación o crear nuevo ciclo)
export async function reevaluarPlanTratamiento(planId: number, estado: 'En evaluación' | 'Reevaluado'): Promise<PlanTratamientoDto> {
  const res = await fetch(`/api/plan_tratamiento/${planId}/reevaluar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
