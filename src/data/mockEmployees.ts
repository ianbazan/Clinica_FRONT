export interface Employee {
  id: number
  name: string
  role: string
  email?: string
}

export const employees: Employee[] = [
  { id: 1, name: 'Ana Torres', role: 'Admin', email: 'ana.torres@clinica.local' },
  { id: 2, name: 'Luis Martínez', role: 'Psicologo', email: 'luis.martinez@clinica.local' },
  { id: 3, name: 'Sofía Rojas', role: 'Operadora', email: 'sofia.rojas@clinica.local' },
]
