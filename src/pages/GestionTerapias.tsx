import { useMemo, useState } from 'react';
import { therapies } from '../data/mockTherapies';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';

export default function GestionTerapias() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return therapies
    return therapies.filter((p) => Object.values(p).join(' ').toLowerCase().includes(q))
  }, [query])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageData = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize])
  const goto = (n: number) => setPage(Math.max(1, Math.min(totalPages, n)))

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Gestión de terapias</Typography>
      <Typography variant="body1" gutterBottom>Accesible por Admin y Operadora. Administrar tipos de terapia, sesiones, etc.</Typography>

      <Box display="flex" gap={2} alignItems="center" mt={1} mb={1}>
        <TextField
          placeholder="Buscar terapias..."
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

      <Box display="grid" gap={2} mt={2}>
        {pageData.map((t) => (
          <Paper key={t.id} sx={{ p: 2, borderRadius: 2 }} elevation={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{t.name}</Typography>
              <Typography variant="body2">{t.durationMin} min</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={1}>{t.description}</Typography>
            <Box mt={1}>
              <Typography variant="body2"><strong>Precio:</strong> {t.price ? `${t.price} CLP` : '—'}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

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
