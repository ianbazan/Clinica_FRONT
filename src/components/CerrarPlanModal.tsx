import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, MenuItem, Select, Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import emailjs from '@emailjs/browser'
import { listTreatmentPlans, closeTreatmentPlan, reevaluateTreatmentPlan } from '../api/planApi';
import { listPatients } from '../api/patientApi'
import { getProfesionales } from '../api/profesionalApi'
import type { TreatmentPlanDto } from '../api/planApi';

interface CerrarPlanModalProps {
  open: boolean;
  onClose: () => void;
  pacienteId: number;
  onSuccess?: () => void;
}

export default function CerrarPlanModal({ open, onClose, pacienteId, onSuccess }: CerrarPlanModalProps) {
  const [planes, setPlanes] = useState<TreatmentPlanDto[]>([]);
  const [planId, setPlanId] = useState<number | ''>('');
  const [accion, setAccion] = useState<'cerrar' | 'reevaluar' | ''>('');
  const [estadoReeval, setEstadoReeval] = useState<'En evaluación' | 'Reevaluado'>('En evaluación');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [noPlans, setNoPlans] = useState(false);
  const [sendEmail, setSendEmail] = useState(false)
  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL as string) || ''
  const [emailTo, setEmailTo] = useState(adminEmail)

  useEffect(() => {
    if (pacienteId && open) {
      setNoPlans(false)
      listTreatmentPlans(pacienteId, true)
        .then(ps => {
          if (ps === null) {
            // apiFetch returns null for 204 No Content
            setPlanes([])
            setNoPlans(true)
          } else {
            setPlanes(ps || [])
            setNoPlans(false)
          }
        })
        .catch(() => {
          setPlanes([])
          setNoPlans(false)
        })
    }
  }, [pacienteId, open]);

  const handleAccion = async () => {
    setError(null);
    if (!planId || !accion) {
      setError('Selecciona plan y acción.');
      return;
    }
    try {
      if (accion === 'cerrar') {
        await closeTreatmentPlan(Number(planId));
      } else {
        await reevaluateTreatmentPlan(Number(planId));
      }
      // show specific success message and delay calling onSuccess so user sees it
      const msg = accion === 'cerrar' ? 'Plan cerrado correctamente.' : 'Plan reevaluado correctamente.';
      setSuccessMessage(msg);
      // enviar correo si fue solicitado
      if (sendEmail) {
        try {
          const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
          const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_PLAN_TEMPLATE_ID
          const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_USER_ID || import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
            console.warn('EmailJS env vars missing for plan notifications')
          } else {
            const selectedPlan: any = (planes || []).find(p => Number(p.id) === Number(planId))
            const startDate = selectedPlan?.startDate ?? selectedPlan?.start_date ?? ''
            const endDate = selectedPlan?.endDate ?? selectedPlan?.end_date ?? ''
            // Prefer explicit fields: evaluation for summary, patientId/professionalId for lookups
            let summary = selectedPlan?.evaluation ?? selectedPlan?.summary ?? selectedPlan?.resumen ?? selectedPlan?.description ?? ''
            let patient_name = ''
            let professional_name = ''

            try {
              // try to resolve patient name
              const patients = await listPatients()
              const p = patients.find(x => Number(x.id) === Number(selectedPlan?.patientId ?? pacienteId))
              if (p) patient_name = `${p.name} ${p.lastName}`
            } catch (err) {
              // ignore
            }
            try {
              // try to resolve professional name
              const profs = await getProfesionales()
              const pf = profs.find(x => Number(x.id) === Number(selectedPlan?.professionalId))
              if (pf) professional_name = `${pf.firstName} ${pf.lastName}`
            } catch (err) {
              // ignore
            }

            const templateParams = {
              to_email: emailTo,
              action: accion,
              plan_id: planId,
              patient_id: pacienteId,
              patient_name,
              professional_name,
              startDate,
              endDate,
              summary,
              sent_time: new Date().toLocaleString(),
              view_link: `${window.location.origin}/plans/${planId}`,
            }
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
            setSuccessMessage((s) => (s ? s + ' — Correo enviado.' : 'Correo enviado.'))
          }
        } catch (mailErr) {
          const errAny: any = mailErr
          console.error('EmailJS error', errAny)
          const detail = errAny?.text || errAny?.message || String(errAny)
          setError(`Plan actualizado, pero no se pudo enviar el correo: ${detail}`)
        }
      }
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1200);
    } catch (e: any) {
      setError(e.message || 'Error al actualizar el plan');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.1)' } }}
    >
      <DialogTitle>Cerrar o Reevaluar Plan Terapéutico</DialogTitle>
      <DialogContent>
        <Typography variant="body2" mb={2}>Selecciona el plan activo y la acción a realizar.</Typography>
        <Select
          value={planId}
          onChange={e => setPlanId(Number(e.target.value))}
          displayEmpty
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value=""><em>Seleccione plan</em></MenuItem>
          {(planes ?? []).map(p => (
            <MenuItem key={p.id} value={p.id}>Plan #{p.id} ({p.startDate} a {p.endDate})</MenuItem>
          ))}
        </Select>
        <Select
          value={accion}
          onChange={e => setAccion(e.target.value as any)}
          displayEmpty
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value=""><em>Seleccione acción</em></MenuItem>
          <MenuItem value="cerrar">Cerrar plan (alta terapéutica)</MenuItem>
          <MenuItem value="reevaluar">Reevaluar plan</MenuItem>
        </Select>
        {accion === 'reevaluar' && (
          <Box mb={2}>
            <Typography variant="body2">Estado de reevaluación:</Typography>
            <Select
              value={estadoReeval}
              onChange={e => setEstadoReeval(e.target.value as any)}
              fullWidth
            >
              <MenuItem value="En evaluación">En evaluación</MenuItem>
              <MenuItem value="Reevaluado">Reevaluado</MenuItem>
            </Select>
          </Box>
        )}
        <Box mb={2}>
          <FormControlLabel
            control={<Checkbox checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />}
            label="Enviar notificación por correo"
          />
          {sendEmail && (
            <TextField
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              fullWidth
              size="small"
              placeholder="Correo destinatario"
              sx={{ mt: 1 }}
            />
          )}
        </Box>
        {error && <Box color="error.main" mt={2}>{error}</Box>}
        {successMessage && <Box color="success.main" mt={2}>{successMessage}</Box>}
        {noPlans && <Box color="info.main" mt={2}>Aún no se registra un plan para este paciente.</Box>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleAccion} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
