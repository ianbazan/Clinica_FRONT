import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField, Typography, FormControl, InputLabel } from '@mui/material';
import dayjs from 'dayjs';
import { getProgressReport, generateProgressReportPDF } from '../api/planApi';
import useApiError from '../hooks/useApiError';

const pacientesMock = [
  { id: 1, nombre: 'Luis Espinoza' },
  { id: 2, nombre: 'Alexandra Espinoza' },
];

export default function InformeProgresoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [pacienteId, setPacienteId] = useState<number | ''>('');
  const [fechaInicio, setFechaInicio] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [fechaFin, setFechaFin] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));
  const [comentarios, setComentarios] = useState('');
  const [consolidado, setConsolidado] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { format } = useApiError();

  const handleConsultar = async () => {
    setError(null);
    if (!pacienteId) {
      setError('Selecciona un paciente.');
      return;
    }
    try {
      const fromDateTime = dayjs(fechaInicio).format('YYYY-MM-DDT00:00:00')
      const toDateTime = dayjs(fechaFin).format('YYYY-MM-DDT23:59:59')
      const data = await getProgressReport(Number(pacienteId), fromDateTime, toDateTime);
      setConsolidado(data);
    } catch (e: any) {
      setError(format(e));
    }
  };

  const handleGenerarPDF = async () => {
    setError(null);
    if (!pacienteId) {
      setError('Selecciona un paciente.');
      return;
    }
    try {
      const fromDateTime = dayjs(fechaInicio).format('YYYY-MM-DDT00:00:00')
      const toDateTime = dayjs(fechaFin).format('YYYY-MM-DDT23:59:59')
      const blob = await generateProgressReportPDF(Number(pacienteId), fromDateTime, toDateTime);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (e: any) {
      setError(format(e));
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
      <DialogTitle>Informe de Progreso Terapéutico</DialogTitle>
      <DialogContent><br/>
        <Box display="flex" gap={2} mb={2}>
          
          <FormControl fullWidth>
            <InputLabel>Paciente</InputLabel>
            <Select
              value={pacienteId}
              label="Paciente"
              onChange={e => setPacienteId(Number(e.target.value))}
            >
              <MenuItem value=""><em>Seleccione</em></MenuItem>
              {pacientesMock.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
            </Select>
          </FormControl>
          
        </Box>
        <br/>
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Desde"
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Hasta"
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" onClick={handleConsultar}>Consultar</Button>
        </Box>

        {error && <Box color="error.main" mb={2}>{error}</Box>}
        {consolidado && (
          <Box>
            <Typography variant="h6">Sesiones registradas</Typography>
            {(consolidado.sesiones ?? []).map((s: any, idx: number) => (
              <Box key={idx} mb={1} p={1} border={1} borderColor="#eee">
                <strong>{s.fecha}</strong>: {s.nota}<br />
                Actividades: {(s.actividades ?? []).join(', ')}<br />
                Objetivos: {(s.objetivos ?? []).map((o: any) => `${o.titulo} (${o.estado})`).join(', ')}
              </Box>
            ))}
            <Typography variant="h6" mt={2}>Resumen de Objetivos</Typography>
            <ul>
              {(consolidado.resumenObjetivos ?? []).map((o: any, idx: number) => (
                <li key={idx}>{o.titulo}: {o.estado}</li>
              ))}
            </ul>
            <TextField
              label="Comentarios adicionales"
              value={comentarios}
              onChange={e => setComentarios(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              minRows={2}
            />
            <Button variant="contained" color="success" onClick={handleGenerarPDF} sx={{ mt: 2 }}>Generar PDF</Button>
            {pdfUrl && <Box mt={2}><a href={pdfUrl} target="_blank" rel="noopener noreferrer">Descargar informe PDF</a></Box>}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
