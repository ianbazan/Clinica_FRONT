import { useMemo, useState, useEffect } from 'react';
import { getSpecialties, type SpecialtyDto } from '../api/specialtyApi';
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
  const [specialties, setSpecialties] = useState<SpecialtyDto[]>([])
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return specialties
    return specialties.filter((p) => `${p.id} ${p.name} ${p.description} ${p.isActive}`.toLowerCase().includes(q))
  }, [query, specialties])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageData = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize])
  const goto = (n: number) => setPage(Math.max(1, Math.min(totalPages, n)))

  useEffect(() => {
    setLoading(true)
    getSpecialties()
      .then(data => setSpecialties(data || []))
      .catch(() => setSpecialties([]))
      .finally(() => setLoading(false))
  }, [])

  const handleExport = async () => {
    try {
      if (!specialties || specialties.length === 0) return
      const XLSX = await import('xlsx')
      const sheetData = specialties.map(s => ({
        ID: s.id,
        Nombre: s.name,
        Descripcion: s.description || '',
        Activo: s.isActive ? 'Sí' : 'No'
      }))
      const ws = XLSX.utils.json_to_sheet(sheetData)
      // apply simple styles: header bold + borders for all cells
      const range = XLSX.utils.decode_range(ws['!ref'] || '')
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = { c: C, r: R }
          const cell_ref = XLSX.utils.encode_cell(cell_address)
          const cell = ws[cell_ref] || { t: 's', v: '' }
          // Add border to every cell
          cell.s = cell.s || {}
          cell.s.border = {
            top: { style: 'thin', color: { auto: 1 } },
            bottom: { style: 'thin', color: { auto: 1 } },
            left: { style: 'thin', color: { auto: 1 } },
            right: { style: 'thin', color: { auto: 1 } },
          }
          // Header row styling
          if (R === range.s.r) {
            cell.s.font = { bold: true }
            cell.s.fill = { fgColor: { rgb: 'FFDDDDDD' } }
            cell.s.alignment = { horizontal: 'center', vertical: 'center' }
          } else {
            cell.s.alignment = { horizontal: 'left', vertical: 'center' }
          }
          ws[cell_ref] = cell
        }
      }
      // set reasonable column widths
      ws['!cols'] = [{ wch: 6 }, { wch: 30 }, { wch: 50 }, { wch: 8 }]
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Especialidades')
      XLSX.writeFile(wb, 'especialidades.xlsx')
    } catch (e) {
      console.error('Error exportando especialidades:', e)
    }
  }

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
        <Button variant="outlined" onClick={handleExport} disabled={loading || specialties.length===0}>Exportar</Button>
      </Box>

      <Box display="grid" gap={2} mt={2}>
        {pageData.map((t) => (
          <Paper key={t.id} sx={{ p: 2, borderRadius: 2 }} elevation={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{t.name}</Typography>
              <Typography variant="body2" sx={{ color: t.isActive ? 'success.main' : 'error.main' }}>
                {t.isActive ? 'Activo' : 'Inactivo'}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" mt={1}>{t.description}</Typography>
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
