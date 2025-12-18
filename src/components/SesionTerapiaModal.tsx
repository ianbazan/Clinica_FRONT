import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, MenuItem, Select, InputLabel, FormControl, List, ListItem, ListItemText, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { listTreatmentPlans, listObjectives, updateObjective, createTherapySession, createActivity } from '../api/planApi';
import type { ObjectiveDto } from '../api/planApi';

interface SesionTerapiaModalProps {
  open: boolean;
  onClose: () => void;
  pacienteId: number;
  planActivo?: number;
  onSuccess?: () => void;
}

export default function SesionTerapiaModal({ open, onClose, pacienteId, planActivo, onSuccess }: SesionTerapiaModalProps) {
  const [nota, setNota] = useState('');
  const [objetivos, setObjetivos] = useState<ObjectiveDto[]>([]);
  const [actividades, setActividades] = useState<string[]>([]);
  const [nuevaActividad, setNuevaActividad] = useState('');
  const [objetivoEstados, setObjetivoEstados] = useState<Record<number, ObjectiveDto['status']>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (planActivo) {
      listObjectives(planActivo).then(setObjetivos);
    } else if (pacienteId) {
      // Buscar plan activo automáticamente si no se pasa planActivo
      listTreatmentPlans(pacienteId, true).then(plans => {
        if (plans.length > 0) {
          listObjectives(plans[0].id).then(setObjetivos);
        }
      });
    }
  }, [planActivo, pacienteId]);

  const handleAddActividad = () => {
    if (!nuevaActividad.trim()) return;
    setActividades([...actividades, nuevaActividad]);
    setNuevaActividad('');
  };
  const handleRemoveActividad = (idx: number) => {
    setActividades(actividades.filter((_, i) => i !== idx));
  };

  const handleGuardar = async () => {
    setError(null);
    if (!nota.trim() || actividades.length === 0) {
      setError('Debes ingresar nota y al menos una actividad.');
      return;
    }
    try {
      // 1. Crear sesión de terapia
      const planId = planActivo || (objetivos.length > 0 ? objetivos[0].id : null);
      if (!planId) {
        setError('No se encontró un plan de tratamiento activo.');
        return;
      }
      const session = await createTherapySession({
        patientId: pacienteId,
        treatmentPlanId: planId,
        date: new Date().toISOString(),
        note: nota,
        isActive: true,
      });
      // 2. Crear actividades
      for (const act of actividades) {
        await createActivity({
          title: act,
          description: '',
          therapySessionId: session.id,
          status: 'Completada',
          isActive: true,
        });
      }
      // 3. Actualizar estado de objetivos
      for (const [objId, estado] of Object.entries(objetivoEstados)) {
        await updateObjective(Number(objId), { status: estado });
      }
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setError(e.message || 'Error al registrar la sesión');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Registrar Sesión de Terapia y Progreso</DialogTitle>
      <DialogContent>
        <TextField
          label="Nota de la sesión"
          value={nota}
          onChange={e => setNota(e.target.value)}
          fullWidth
          margin="normal"
          required
          multiline
          minRows={2}
        />
        <Typography variant="subtitle1" mt={2}>Actividades realizadas</Typography>
        <Box display="flex" gap={1} alignItems="center" mb={1}>
          <TextField
            label="Nueva actividad"
            value={nuevaActividad}
            onChange={e => setNuevaActividad(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
          />
          <IconButton onClick={handleAddActividad} color="primary" size="small" disabled={!nuevaActividad.trim()}><AddIcon /></IconButton>
        </Box>
        <List dense>
          {actividades.map((act, idx) => (
            <ListItem key={idx} secondaryAction={
              <IconButton edge="end" onClick={() => handleRemoveActividad(idx)}><DeleteIcon /></IconButton>
            }>
              <ListItemText primary={act} />
            </ListItem>
          ))}
        </List>
        <Typography variant="subtitle1" mt={2}>Actualizar estado de objetivos</Typography>
        <List dense>
          {objetivos.map(obj => (
            <ListItem key={obj.id}>
              <ListItemText primary={obj.title} secondary={obj.description} />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={objetivoEstados[obj.id] || obj.status}
                  label="Estado"
                  onChange={e => setObjetivoEstados(s => ({ ...s, [obj.id]: e.target.value as ObjectiveDto['status'] }))}
                >
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="En progreso">En progreso</MenuItem>
                  <MenuItem value="Completado">Completado</MenuItem>
                  <MenuItem value="Cancelado">Cancelado</MenuItem>
                  <MenuItem value="En espera">En espera</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
          ))}
        </List>
        {error && <Box color="error.main" mt={2}>{error}</Box>}
        {success && <Box color="success.main" mt={2}>Sesión registrada correctamente.</Box>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleGuardar} variant="contained">Guardar sesión</Button>
      </DialogActions>
    </Dialog>
  );
}
