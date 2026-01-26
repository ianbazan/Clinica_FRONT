import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, FormControlLabel, Switch } from '@mui/material'
import dayjs from 'dayjs'
import { createTreatmentPlan } from '../api/planApi'

interface CreatePlanModalProps {
  open: boolean
  onClose: () => void
  pacienteId: number
  profesionalId: number
  onSuccess?: (planId: number) => void
}

export default function CreatePlanModal({ open, onClose, pacienteId, profesionalId, onSuccess }: CreatePlanModalProps) {
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(dayjs().add(3, 'month').format('YYYY-MM-DD'))
  const [evaluation, setEvaluation] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async () => {
    setError(null)
    if (!pacienteId || !profesionalId) {
      setError('Falta paciente o profesional asignado.')
      return
    }
    if (!startDate || !endDate || !evaluation.trim()) {
      setError('Completa fechas y evaluación.')
      return
    }
    setLoading(true)
    try {
      const body = {
        patientId: pacienteId,
        professionalId: profesionalId,
        startDate,
        endDate,
        evaluation,
        isActive,
      }
      const created = await createTreatmentPlan(body as any)
      // show success message, then close and call onSuccess so user sees confirmation
      setError(null)
      setLoading(false)
      setSuccessMessage('Plan creado correctamente.')
      try {
        if (onSuccess) onSuccess(created.id)
      } catch {}
      // give user a moment to see the message
      setTimeout(() => {
        setSuccessMessage(null)
        onClose()
      }, 1000)
    } catch (e: any) {
      setError(e?.message || 'Error al crear plan')
    } finally {
      // loading already cleared on success path
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md"
      fullWidth
      disableEnforceFocus
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.1)' } }}>
      <DialogTitle>Crear Plan Terapéutico</DialogTitle>
      <DialogContent>
        <br/>
        <Box display="flex" gap={2} mb={2}>
          <TextField label="Fecha inicio" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Fecha fin" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
        </Box>
        <TextField
          label="Evaluación inicial"
          value={evaluation}
          onChange={e => setEvaluation(e.target.value)}
          fullWidth
          multiline
          minRows={3}
          autoFocus
        />
        <Box mt={2}>
          <FormControlLabel control={<Switch checked={isActive} onChange={(_, v) => setIsActive(v)} />} label="Activo" />
        </Box>
        {error && <Box color="error.main" mt={2}>{error}</Box>}
        {successMessage && <Box color="success.main" mt={2}>{successMessage}</Box>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>{loading ? 'Creando...' : 'Crear Plan'}</Button>
      </DialogActions>
    </Dialog>
  )
}
