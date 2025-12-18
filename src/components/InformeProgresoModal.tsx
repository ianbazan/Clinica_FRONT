import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, TextField, Typography, FormControl, InputLabel } from '@mui/material';
import dayjs from 'dayjs';
// Aquí deberías importar la API real de pacientes, sesiones, actividades y objetivos
// import { listarPacientes, listarSesionesPorPaciente, listarObjetivos, ... } from '../api/...' 

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

  const handleConsultar = async () => {
    setError(null);
    // Aquí deberías llamar a la API para consolidar sesiones, actividades y objetivos
    // Ejemplo:
    // const data = await consolidarProgreso({ pacienteId, fechaInicio, fechaFin });
    // setConsolidado(data);
    // Simulación:
    if (!pacienteId) {
      setError('Selecciona un paciente.');
      return;
    }
    setConsolidado({
      sesiones: [
        { fecha: '2025-12-01', nota: 'Sesión 1', actividades: ['Juego', 'Lectura'], objetivos: [{ titulo: 'Habla', estado: 'En progreso' }] },
        { fecha: '2025-12-08', nota: 'Sesión 2', actividades: ['Dibujo'], objetivos: [{ titulo: 'Habla', estado: 'Completado' }] },
      ],
      resumenObjetivos: [
        { titulo: 'Habla', estado: 'Completado' },
        { titulo: 'Socialización', estado: 'En progreso' },
      ],
    });
  };

  const handleGenerarPDF = async () => {
    // Aquí deberías llamar a la API para generar el PDF y obtener la URL
    // Ejemplo: const url = await generarInformePDF({ pacienteId, fechaInicio, fechaFin, comentarios });
    setPdfUrl('/ejemplo-informe.pdf');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Informe de Progreso Terapéutico</DialogTitle>
      <DialogContent>
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
            {consolidado.sesiones.map((s: any, idx: number) => (
              <Box key={idx} mb={1} p={1} border={1} borderColor="#eee">
                <strong>{s.fecha}</strong>: {s.nota}<br />
                Actividades: {s.actividades.join(', ')}<br />
                Objetivos: {s.objetivos.map((o: any) => `${o.titulo} (${o.estado})`).join(', ')}
              </Box>
            ))}
            <Typography variant="h6" mt={2}>Resumen de Objetivos</Typography>
            <ul>
              {consolidado.resumenObjetivos.map((o: any, idx: number) => (
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
