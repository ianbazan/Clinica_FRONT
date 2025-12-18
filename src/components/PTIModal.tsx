import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, IconButton, List, ListItem, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import { createTreatmentPlan, createObjective } from '../api/planApi';
import type { ObjectiveDto } from '../api/planApi';

interface PTIModalProps {
  open: boolean;
  onClose: () => void;
  pacienteId: number;
  profesionalId: number;
  onSuccess?: () => void;
}

export default function PTIModal({ open, onClose, pacienteId, profesionalId, onSuccess }: PTIModalProps) {
  const [fechaInicio, setFechaInicio] = useState(dayjs().format('YYYY-MM-DD'));
  const [fechaFinal, setFechaFinal] = useState(dayjs().add(3, 'M').format('YYYY-MM-DD'));
  const [evaluacion, setEvaluacion] = useState('');
  const [objetivos, setObjetivos] = useState<Pick<ObjectiveDto, 'title' | 'description'>[]>([]);
  const [nuevoObjetivo, setNuevoObjetivo] = useState({ title: '', description: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddObjetivo = () => {
    if (!nuevoObjetivo.title.trim()) return;
    setObjetivos([...objetivos, { ...nuevoObjetivo }]);
    setNuevoObjetivo({ title: '', description: '' });
  };
  const handleRemoveObjetivo = (idx: number) => {
    setObjetivos(objetivos.filter((_, i) => i !== idx));
  };

  const handleGuardar = async () => {
    setError(null);
    if (!evaluacion.trim() || !fechaInicio || !fechaFinal || objetivos.length === 0) {
      setError('Completa evaluación, fechas y al menos un objetivo.');
      return;
    }
    setLoading(true);
    try {
      // 1. Crear plan
      const plan = await createTreatmentPlan({
        patientId: pacienteId,
        professionalId: profesionalId,
        startDate: fechaInicio,
        endDate: fechaFinal,
        evaluation: evaluacion,
        isActive: true,
      });
      // 2. Crear objetivos
      for (const obj of objetivos) {
        await createObjective(plan.id, { ...obj, status: 'Pendiente' });
      }
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setError(e.message || 'Error al guardar el plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Plan Terapéutico Individualizado (PTI)</DialogTitle>
      <DialogContent>
        <TextField
          label="Evaluación inicial"
          value={evaluacion}
          onChange={e => setEvaluacion(e.target.value)}
          fullWidth
          margin="normal"
          required
          multiline
          minRows={2}
        />
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Fecha inicio"
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            sx={{ flex: 1 }}
          />
          <TextField
            label="Fecha fin"
            type="date"
            value={fechaFinal}
            onChange={e => setFechaFinal(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            sx={{ flex: 1 }}
          />
        </Box>
        <Typography variant="subtitle1" mt={2}>Objetivos terapéuticos</Typography>
        <Box display="flex" gap={1} alignItems="center" mb={1}>
          <TextField
            label="Título objetivo"
            value={nuevoObjetivo.title}
            onChange={e => setNuevoObjetivo(o => ({ ...o, title: e.target.value }))}
            size="small"
            sx={{ flex: 2 }}
          />
          <TextField
            label="Descripción"
            value={nuevoObjetivo.description}
            onChange={e => setNuevoObjetivo(o => ({ ...o, description: e.target.value }))}
            size="small"
            sx={{ flex: 3 }}
          />
          <IconButton onClick={handleAddObjetivo} color="primary" size="small" disabled={!nuevoObjetivo.title.trim()}><AddIcon /></IconButton>
        </Box>
        <List dense>
          {objetivos.map((obj, idx) => (
            <ListItem key={idx} secondaryAction={
              <IconButton edge="end" onClick={() => handleRemoveObjetivo(idx)}><DeleteIcon /></IconButton>
            }>
              <ListItemText primary={obj.title} secondary={obj.description} />
            </ListItem>
          ))}
        </List>
        {error && <Box color="error.main" mt={2}>{error}</Box>}
        {success && <Box color="success.main" mt={2}>Plan y objetivos registrados correctamente.</Box>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGuardar} variant="contained" disabled={loading}>Guardar PTI</Button>
      </DialogActions>
    </Dialog>
  );
}
