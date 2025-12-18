import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, MenuItem, Select, Box } from '@mui/material';
import { listTreatmentPlans, closeTreatmentPlan, reevaluateTreatmentPlan } from '../api/planApi';
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
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (pacienteId && open) {
      listTreatmentPlans(pacienteId, true).then(ps => setPlanes(ps));
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
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setError(e.message || 'Error al actualizar el plan');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          {planes.map(p => (
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
        {error && <Box color="error.main" mt={2}>{error}</Box>}
        {success && <Box color="success.main" mt={2}>Plan actualizado correctamente.</Box>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleAccion} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
