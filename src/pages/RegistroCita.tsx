import './RegistroCita.css'
import { useState } from 'react'
import { crearCita } from '../api/citaApi'
import { format } from '../hooks/useApiError'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

export default function RegistroCita() {
  const [razon, setRazon] = useState('')
  const [fecha, setFecha] = useState('')
  const [pacienteDni, setPacienteDni] = useState('')
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje(null)
    setError(null)
    try {
      const cita = await crearCita({
        razon,
        pacienteDni: pacienteDni.trim(),
        fechaProgramada: fecha,
      })
      setMensaje(`Solicitud enviada. Estado: ${cita.estado}. ID: ${cita.id}`)
      setRazon('')
      setFecha('')
      setPacienteDni('')
    } catch (err: any) {
      try {
        const friendly = format(err) || 'Error al crear cita'
        const raw = String(err?.message ?? err ?? '')
        // Si el mensaje contiene referencia a DNI, mostrar texto específico más claro
        if (/dni/i.test(friendly) || /dni/i.test(raw)) {
          setError('El DNI del paciente no está registrado')
        } else {
          setError(friendly)
        }
      } catch (e) {
        setError('Error al crear cita')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2>Solicitar Cita</h2>
      <TextField
        label="Razón"
        value={razon}
        onChange={e => setRazon(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Fecha y hora"
        type="datetime-local"
        value={fecha}
        onChange={e => setFecha(e.target.value)}
        required
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="DNI del Paciente"
        type="text"
        value={pacienteDni}
        onChange={e => setPacienteDni(e.target.value.replace(/[^0-9]/g, ''))}
        required
        fullWidth
        inputProps={{ maxLength: 8, inputMode: 'numeric', pattern: '[0-9]*' }}
      />
      <Button type="submit" variant="contained">Solicitar</Button>
      {mensaje && <div style={{ color: 'green' }}>{mensaje}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  )
}