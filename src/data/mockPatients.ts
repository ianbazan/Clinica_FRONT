export interface Patient {
  id: number
  name: string
  dob: string
  lastVisit: string
  notes?: string
}

export const patients: Patient[] = [
  { id: 1, name: 'Juan Perez', dob: '2015-04-12', lastVisit: '2025-11-12', notes: 'Tratamiento en curso: terapia cognitiva' },
  { id: 2, name: 'María Gómez', dob: '2016-09-03', lastVisit: '2025-10-20', notes: 'Alta propuesta, seguimiento en 3 meses' },
  { id: 3, name: 'Carlos López', dob: '2014-01-25', lastVisit: '2025-09-05', notes: 'Observaciones: ansiedad leve' },
]
