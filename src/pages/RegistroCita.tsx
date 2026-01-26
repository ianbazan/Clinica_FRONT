import './RegistroCita.css'
import { useState } from 'react'
import { crearCita } from '../api/citaApi'
import { format } from '../hooks/useApiError'
import emailjs from '@emailjs/browser'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Checkbox, FormControlLabel } from '@mui/material'

export default function RegistroCita() {
  const [razon, setRazon] = useState('')
  const [fecha, setFecha] = useState('')
  const [pacienteDni, setPacienteDni] = useState('')
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sendEmail, setSendEmail] = useState(false)
  const [emailTo, setEmailTo] = useState('')

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
      // Si el usuario marcó enviar email, intentar envío con EmailJS
      if (sendEmail) {
        const to = emailTo.trim()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!to || !emailRegex.test(to)) {
          setError('Ingrese un correo válido para el envío (o desmarque la casilla).')
        } else {
          try {
              // IDs desde variables de entorno Vite: VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_USER_ID
              const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
              const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_APPOINTMENT_TEMPLATE_ID
              const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_USER_ID || import.meta.env.VITE_EMAILJS_PUBLIC_KEY

              if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
                console.warn('EmailJS env vars missing', { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY })
                setError('Cita creada, pero la configuración de correo está incompleta. Contacta al administrador.')
              } else {
                // template params (ajusta según tu template en EmailJS)
                const templateParams = {
                  to_email: to,
                  patient_name: '',
                  patient_dni: pacienteDni.trim(),
                  reason: razon,
                  scheduled_at: fecha,
                  appointment_id: cita.id,
                  sent_time: new Date().toLocaleString(),
                  view_link: `${window.location.origin}/appointments/${cita.id}`,
                }
                await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
                setMensaje((m) => (m ? m + ' — Correo enviado.' : 'Correo enviado.'))
              }
            } catch (mailErr) {
              console.error('EmailJS error', mailErr)
              const errAny: any = mailErr
              const detail = errAny?.text || errAny?.message || String(errAny)
              setError(`Cita creada, pero no se pudo enviar el correo: ${detail}`)
            }
        }
      }
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
      <FormControlLabel
        control={<Checkbox checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />}
        label="Enviar correo al crear la cita"
      />
      {sendEmail && (
        <TextField
          label="Correo destinatario"
          type="email"
          value={emailTo}
          onChange={e => setEmailTo(e.target.value)}
          fullWidth
        />
      )}
      <Button type="submit" variant="contained">Solicitar</Button>
      {mensaje && <div style={{ color: 'green' }}>{mensaje}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  )
}