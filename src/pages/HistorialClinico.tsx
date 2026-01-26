import { useMemo, useState, useEffect } from 'react';
import { listPatients } from '../api/patientApi';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';

export default function HistorialClinico() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [patients, setPatients] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    listPatients()
      .then((data) => { if (!mounted) return; setPatients(data ?? []) })
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter((p) => Object.values(p).join(' ').toLowerCase().includes(q))
  }, [query, patients])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageData = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize])

  const goto = (n: number) => setPage(Math.max(1, Math.min(totalPages, n)))

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Historial clínico</Typography>
      <Typography variant="body1" gutterBottom>Acceso para Psicólogos y Admin. Aquí se muestran los historiales de los pacientes.</Typography>

      <Box display="flex" gap={2} alignItems="center" mt={1} mb={1}>
        <TextField
          placeholder="Buscar pacientes..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          size="small"
          fullWidth
        />
        <Select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          size="small"
          sx={{ minWidth: 80 }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha Nac.</TableCell>
              <TableCell>Última visita</TableCell>
              <TableCell>Notas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.dob}</TableCell>
                <TableCell>{p.lastVisit}</TableCell>
                <TableCell>{p.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2">
          Mostrando {Math.min((page - 1) * pageSize + 1, total)} - {Math.min(page * pageSize, total)} de {total}
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
          <Button variant="contained" onClick={() => goto(page - 1)} disabled={page <= 1}>Anterior</Button>
          <Typography variant="body2">Pagina {page} / {totalPages}</Typography>
          <Button variant="contained" onClick={() => goto(page + 1)} disabled={page >= totalPages}>Siguiente</Button>
        </Box>
      </Box>
    </Box>
  );
}
