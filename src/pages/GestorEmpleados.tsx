import { useMemo, useState, useEffect } from 'react';
import { getProfesionales, type ProfesionalDto } from '../api/profesionalApi';
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

export default function GestorEmpleados() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [profesionales, setProfesionales] = useState<ProfesionalDto[]>([])
  const [loading, setLoading] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return profesionales
    return profesionales.filter((p) => {
      const hay = `${p.id} ${p.firstName} ${p.lastName} ${p.phone} ${p.specialtyName} ${p.isActive}`
      return hay.toLowerCase().includes(q)
    })
  }, [query, profesionales])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageData = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize])
  const goto = (n: number) => setPage(Math.max(1, Math.min(totalPages, n)))

  useEffect(() => {
    setLoading(true)
    getProfesionales()
      .then(data => setProfesionales(data || []))
      .catch(() => setProfesionales([]))
      .finally(() => setLoading(false))
  }, [])

  const handleExport = async () => {
    try {
      const data = profesionales
      if (!data || data.length === 0) return
      const XLSX = await import('xlsx')
      const sheetData = data.map(p => ({
        ID: p.id,
        Nombre: `${p.firstName} ${p.lastName}`,
        Especialidad: p.specialtyName,
        Telefono: p.phone,
        Activo: p.isActive ? 'Sí' : 'No'
      }))
      const ws = XLSX.utils.json_to_sheet(sheetData)
      // apply styles: borders for all cells, bold header and column widths
      const range = XLSX.utils.decode_range(ws['!ref'] || '')
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_address = { c: C, r: R }
          const cell_ref = XLSX.utils.encode_cell(cell_address)
          const cell = ws[cell_ref] || { t: 's', v: '' }
          cell.s = cell.s || {}
          cell.s.border = {
            top: { style: 'thin', color: { auto: 1 } },
            bottom: { style: 'thin', color: { auto: 1 } },
            left: { style: 'thin', color: { auto: 1 } },
            right: { style: 'thin', color: { auto: 1 } },
          }
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
      ws['!cols'] = [{ wch: 6 }, { wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 8 }]
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Empleados')
      XLSX.writeFile(wb, 'empleados.xlsx')
    } catch (e) {
      console.error('Error exportando:', e)
    }
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Gestor de empleados</Typography>
      <Typography variant="body1" gutterBottom>Sólo accesible por Admin. Aquí podrás ver y administrar empleados.</Typography>

      <Box display="flex" gap={2} alignItems="center" mt={1} mb={1}>
        <TextField
          placeholder="Buscar empleados..."
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
        <Button variant="outlined" onClick={handleExport} disabled={loading || profesionales.length===0}>Exportar</Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Especialidad</TableCell>
              <TableCell>Especialidad ID</TableCell>
              <TableCell>Activo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageData.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.firstName} {p.lastName}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>{p.specialtyName}</TableCell>
                <TableCell>{p.specialtyId}</TableCell>
                <TableCell>{p.isActive ? 'Sí' : 'No'}</TableCell>
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
