// Interfaz para plan de tratamiento (versión en español)
export interface PlanTratamientoDto {
  id: number;
  pacienteId: number;
  profesionalId: number;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string; // YYYY-MM-DD
  evaluacion: string;
  estaActivo: boolean;
  objetivos?: ObjectiveDto[];
}

// API para plan de tratamiento (PTI), objetivos, sesiones, actividades e informes de progreso


export interface TreatmentPlanDto {
  id: number;
  patientId: number;
  professionalId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  evaluation: string;
  isActive: boolean;
  objectives?: ObjectiveDto[];
}

export interface ObjectiveDto {
  id: number;
  title: string;
  description?: string;
  status: 'Pendiente' | 'En progreso' | 'Completado' | 'Cancelado' | 'En espera';
  isActive: boolean;
}

export interface TherapySessionDto {
  id: number;
  patientId: number;
  treatmentPlanId: number;
  date: string;
  note: string;
  isActive: boolean;
}

export interface ActivityDto {
  id: number;
  title: string;
  description: string;
  therapySessionId: number;
  status: string;
  progressNote?: string;
  isActive: boolean;
}

// --- Treatment Plans ---
import apiFetch, { API_BASE } from './client'

export async function createTreatmentPlan(body: Omit<TreatmentPlanDto, 'id' | 'objectives'>): Promise<TreatmentPlanDto> {
  return apiFetch('/api/treatment-plans', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

export async function listTreatmentPlans(patientId?: number, isActive?: boolean): Promise<TreatmentPlanDto[]> {
  const query: Record<string, string | number | boolean> = {}
  if (typeof isActive === 'boolean') query.status = isActive
  if (patientId) query.patientId = patientId
  return apiFetch('/api/treatment-plans', { query })
}

export async function updateTreatmentPlan(id: number, body: Partial<TreatmentPlanDto>): Promise<TreatmentPlanDto> {
  return apiFetch(`/api/treatment-plans/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

export async function closeTreatmentPlan(id: number): Promise<TreatmentPlanDto> {
  return apiFetch(`/api/treatment-plans/${id}/close`, { method: 'PATCH' })
}

export async function reevaluateTreatmentPlan(id: number): Promise<TreatmentPlanDto> {
  return apiFetch(`/api/treatment-plans/${id}/reevaluate`, { method: 'PATCH' })
}

// --- Objectives ---
export async function createObjective(planId: number, body: Omit<ObjectiveDto, 'id' | 'isActive'>): Promise<ObjectiveDto> {
  return apiFetch(`/api/treatment-plans/${planId}/objectives`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

export async function listObjectives(planId: number): Promise<ObjectiveDto[]> {
  return apiFetch(`/api/treatment-plans/${planId}/objectives`)
}

export async function updateObjective(id: number, body: Partial<ObjectiveDto>): Promise<ObjectiveDto> {
  return apiFetch(`/api/objectives/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

// --- Therapy Sessions ---
export async function createTherapySession(body: Omit<TherapySessionDto, 'id'>): Promise<TherapySessionDto> {
  return apiFetch('/api/therapy-sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

export async function listTherapySessions(patientId?: number, isActive?: boolean, from?: string, to?: string): Promise<TherapySessionDto[]> {
  const query: Record<string, string | number | boolean> = {}
  if (typeof isActive === 'boolean') query.status = isActive
  if (patientId) query.patientId = patientId
  if (from) query.from = from
  if (to) query.to = to
  return apiFetch('/api/therapy-sessions', { query })
}

export async function updateTherapySession(id: number, body: Partial<TherapySessionDto>): Promise<TherapySessionDto> {
  return apiFetch(`/api/therapy-sessions/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

// --- Activities ---
export async function createActivity(body: Omit<ActivityDto, 'id'>): Promise<ActivityDto> {
  return apiFetch('/api/activities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

export async function listActivities(therapySessionId?: number, isActive?: boolean): Promise<ActivityDto[]> {
  const query: Record<string, string | number | boolean> = {}
  if (typeof isActive === 'boolean') query.status = isActive
  if (therapySessionId) query.therapySessionId = therapySessionId
  return apiFetch('/api/activities', { query })
}

export async function updateActivity(id: number, body: Partial<ActivityDto>): Promise<ActivityDto> {
  return apiFetch(`/api/activities/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

// --- Progress Report ---
export async function getProgressReport(patientId: number, from: string, to: string): Promise<any> {
  const query: Record<string, string | number | boolean> = { patientId, from, to }
  return apiFetch('/api/progress-report', { query })
}

export async function generateProgressReportPDF(patientId: number, from: string, to: string): Promise<Blob> {
  // apiFetch parses JSON; for binary response use fetch with absolute URL
  const path = `/api/progress-report/pdf?patientId=${patientId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  const res = await fetch(new URL(path, API_BASE).toString(), { method: 'POST' })
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`)
  return res.blob()
}

// Eliminado ObjetivoDto duplicado, usar solo ObjectiveDto

// --- (No duplicar funciones en español, ya existen en inglés arriba) ---

// --- (No duplicar funciones en español, ya existen en inglés arriba) ---

// Listar planes de un paciente
export async function listarPlanesPorPaciente(pacienteId: number): Promise<PlanTratamientoDto[]> {
  return apiFetch('/api/plan_tratamiento', { query: { pacienteId } })
}

// Listar objetivos de un plan
// --- (No duplicar funciones en español, ya existen en inglés arriba) ---
