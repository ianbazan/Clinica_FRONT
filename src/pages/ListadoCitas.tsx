import type { SelectChangeEvent } from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useState, useEffect } from 'react'
import { listarCitas } from '../api/citaApi'
import type { CitaDto } from '../api/citaApi'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { employees } from '../data/mockEmployees'

const estados = [
  '',
  'Pendiente',
  'Confirmada',
  'Completada',
  'Cancelada',
  'No asistió',
]

export default function ListadoCitas() {
  const [citas, setCitas] = useState<CitaDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState({
    pacienteId: '',
    profesionalId: '',
    estado: '',
    from: '',
    to: '',
  })

  // Estados y funciones para el modal de asignación de profesional
  const [showModal, setShowModal] = useState(false)
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaDto | null>(null)
  const [profesionalId, setProfesionalId] = useState<number | ''>('')
  const [modalError, setModalError] = useState<string | null>(null)

  const abrirModal = (cita: CitaDto) => {
    setCitaSeleccionada(cita)
    setProfesionalId('')
    setModalError(null)
    setShowModal(true)
  }

  const cerrarModal = () => {
    setShowModal(false)
    setCitaSeleccionada(null)
    setProfesionalId('')
    setModalError(null)
  }

  const handleAsignarProfesional = async () => {
    if (!citaSeleccionada || !profesionalId) return
    setModalError(null)
    try {
      // Aquí debes llamar a tu función para actualizar la cita, por ejemplo:
      // await actualizarCita(citaSeleccionada.id, { profesionalId: Number(profesionalId) })
      // fetchCitas()
      cerrarModal()
    } catch (err: any) {
      setModalError(err?.error?.detail || 'Error al asignar profesional')
    }
  }

  useEffect(() => {
    fetchCitas()
  }, [])

  const fetchCitas = async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listarCitas(params)
      setCitas(data.content || [])
    } catch (err: any) {
      setError('Error al cargar citas')
    } finally {
      setLoading(false)
    }
  }

  const handleFiltroChange = (e: React.ChangeEvent<any>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value })
  }

  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault()
    const params: Record<string, any> = {}
    if (filtros.pacienteId) params.pacienteId = filtros.pacienteId
    if (filtros.profesionalId) params.profesionalId = filtros.profesionalId
    if (filtros.estado) params.estado = filtros.estado
    if (filtros.from) params.from = filtros.from
    if (filtros.to) params.to = filtros.to
    fetchCitas(params)
  }

  return (
    <div>
      <h2>Listado de Citas</h2>
      <form onSubmit={handleFiltrar} style={{ marginBottom: 24, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          label="ID Paciente"
          name="pacienteId"
          value={filtros.pacienteId}
          onChange={handleFiltroChange}
          type="number"
          size="small"
        />
        <TextField
          label="ID Profesional"
          name="profesionalId"
          value={filtros.profesionalId}
          onChange={handleFiltroChange}
          type="number"
          size="small"
        />
        <FormControl size="small" style={{ minWidth: 140 }}>
          <InputLabel id="estado-label">Estado</InputLabel>
          <Select
            labelId="estado-label"
            label="Estado"
            name="estado"
            value={filtros.estado}
            onChange={handleSelectChange}
          >
            {estados.map(e => (
              <MenuItem key={e} value={e}>{e || 'Todos'}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Desde"
          name="from"
          value={filtros.from}
          onChange={handleFiltroChange}
          type="datetime-local"
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Hasta"
          name="to"
          value={filtros.to}
          onChange={handleFiltroChange}
          type="datetime-local"
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <Button type="submit" variant="contained">Filtrar</Button>
      </form>
      {loading && <div>Cargando...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <TableContainer component={Paper} style={{ marginTop: 16 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Razón</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Profesional</TableCell>
              <TableCell>Fecha Programada</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citas.map(cita => (
              <TableRow key={cita.id}>
                <TableCell>{cita.id}</TableCell>
                <TableCell>{cita.razon}</TableCell>
                <TableCell>{cita.pacienteId}</TableCell>
                <TableCell>{cita.profesionalId ?? '-'}</TableCell>
                <TableCell>{cita.fechaProgramada.replace('T', ' ')}</TableCell>
                <TableCell>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 8,
                    background: cita.estado === 'Pendiente' ? '#ffe082' :
                      cita.estado === 'Confirmada' ? '#b9f6ca' :
                      cita.estado === 'Completada' ? '#82b1ff' :
                      cita.estado === 'Cancelada' ? '#e0e0e0' :
                      cita.estado === 'No asistió' ? '#ff8a80' : '#eee',
                    color: '#333',
                    fontWeight: 500
                  }}>{cita.estado}</span>
                </TableCell>
                <TableCell>{cita.estaActivo ? 'Sí' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => abrirModal(cita)} color="primary" aria-label="Editar cita">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal MUI para asignar profesional */}
      <Dialog open={showModal} onClose={cerrarModal}>
        <DialogTitle>Asignar profesional</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel id="profesional-label">Profesional</InputLabel>
            <Select
              labelId="profesional-label"
              label="Profesional"
              value={profesionalId}
              onChange={e => setProfesionalId(Number(e.target.value))}
            >
              <MenuItem value="">
                <em>Seleccione un profesional</em>
              </MenuItem>
              {employees
                .filter(emp => emp.role.toLowerCase() !== 'admin' && emp.role.toLowerCase() !== 'operadora')
                .map(emp => (
                  <MenuItem key={emp.id} value={emp.id}>{emp.name} ({emp.role})</MenuItem>
                ))}
            </Select>
          </FormControl>
          {/* Buscador simple: filtra por nombre al escribir en el select (simulado) */}
          {modalError && <div style={{ color: 'red', marginTop: 12 }}>{modalError}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal}>Cancelar</Button>
          <Button onClick={handleAsignarProfesional} variant="contained">Asignar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
