export interface Therapy {
  id: number
  name: string
  durationMin: number
  price?: number
  description?: string
}

export const therapies: Therapy[] = [
  { id: 1, name: 'Terapia cognitivo-conductual', durationMin: 50, price: 35000, description: 'Orientada a manejo de emociones y conductas.' },
  { id: 2, name: 'Terapia familiar', durationMin: 60, price: 45000, description: 'Sesiones con padres y niño/a para mejora de dinámicas familiares.' },
  { id: 3, name: 'Terapia de juego', durationMin: 40, price: 30000, description: 'Terapia lúdica para desarrollo y expresión emocional.' },
]
