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
export async function createTreatmentPlan(body: Omit<TreatmentPlanDto, 'id' | 'objectives'>): Promise<TreatmentPlanDto> {
  const res = await fetch('/api/treatment-plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function listTreatmentPlans(patientId?: number, isActive?: boolean): Promise<TreatmentPlanDto[]> {
  const params = [];
  if (typeof isActive === 'boolean') params.push(`status=${isActive}`);
  if (patientId) params.push(`patientId=${patientId}`);
  const res = await fetch(`/api/treatment-plans${params.length ? '?' + params.join('&') : ''}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function updateTreatmentPlan(id: number, body: Partial<TreatmentPlanDto>): Promise<TreatmentPlanDto> {
  const res = await fetch(`/api/treatment-plans/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function closeTreatmentPlan(id: number): Promise<TreatmentPlanDto> {
  const res = await fetch(`/api/treatment-plans/${id}/close`, { method: 'PATCH' });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function reevaluateTreatmentPlan(id: number): Promise<TreatmentPlanDto> {
  const res = await fetch(`/api/treatment-plans/${id}/reevaluate`, { method: 'PATCH' });
  if (!res.ok) throw await res.json();
  return res.json();
}

// --- Objectives ---
export async function createObjective(planId: number, body: Omit<ObjectiveDto, 'id' | 'isActive'>): Promise<ObjectiveDto> {
  const res = await fetch(`/api/treatment-plans/${planId}/objectives`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function listObjectives(planId: number): Promise<ObjectiveDto[]> {
  const res = await fetch(`/api/treatment-plans/${planId}/objectives`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function updateObjective(id: number, body: Partial<ObjectiveDto>): Promise<ObjectiveDto> {
  const res = await fetch(`/api/objectives/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// --- Therapy Sessions ---
export async function createTherapySession(body: Omit<TherapySessionDto, 'id'>): Promise<TherapySessionDto> {
  const res = await fetch('/api/therapy-sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function listTherapySessions(patientId?: number, isActive?: boolean, from?: string, to?: string): Promise<TherapySessionDto[]> {
  const params = [];
  if (typeof isActive === 'boolean') params.push(`status=${isActive}`);
  if (patientId) params.push(`patientId=${patientId}`);
  if (from) params.push(`from=${encodeURIComponent(from)}`);
  if (to) params.push(`to=${encodeURIComponent(to)}`);
  const res = await fetch(`/api/therapy-sessions${params.length ? '?' + params.join('&') : ''}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function updateTherapySession(id: number, body: Partial<TherapySessionDto>): Promise<TherapySessionDto> {
  const res = await fetch(`/api/therapy-sessions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// --- Activities ---
export async function createActivity(body: Omit<ActivityDto, 'id'>): Promise<ActivityDto> {
  const res = await fetch('/api/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function listActivities(therapySessionId?: number, isActive?: boolean): Promise<ActivityDto[]> {
  const params = [];
  if (typeof isActive === 'boolean') params.push(`status=${isActive}`);
  if (therapySessionId) params.push(`therapySessionId=${therapySessionId}`);
  const res = await fetch(`/api/activities${params.length ? '?' + params.join('&') : ''}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function updateActivity(id: number, body: Partial<ActivityDto>): Promise<ActivityDto> {
  const res = await fetch(`/api/activities/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

// --- Progress Report ---
export async function getProgressReport(patientId: number, from: string, to: string): Promise<any> {
  const res = await fetch(`/api/progress-report?patientId=${patientId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function generateProgressReportPDF(patientId: number, from: string, to: string): Promise<Blob> {
  const res = await fetch(`/api/progress-report/pdf?patientId=${patientId}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, {
    method: 'POST',
  });
  if (!res.ok) throw await res.json();
  return res.blob();
}

// Eliminado ObjetivoDto duplicado, usar solo ObjectiveDto

// --- (No duplicar funciones en español, ya existen en inglés arriba) ---

// --- (No duplicar funciones en español, ya existen en inglés arriba) ---

// Listar planes de un paciente
export async function listarPlanesPorPaciente(pacienteId: number): Promise<PlanTratamientoDto[]> {
  const res = await fetch(`/api/plan_tratamiento?pacienteId=${pacienteId}`);
  if (!res.ok) throw await res.json();
  return res.json();
}

// Listar objetivos de un plan
// --- (No duplicar funciones en español, ya existen en inglés arriba) ---
