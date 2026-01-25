import type { SelectChangeEvent } from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { useState, useEffect } from 'react'
import apiFetch from '../api/client'
import { useAuth } from '../auth/mockAuth'
import { listarCitas } from '../api/citaApi'

async function patchCitaStatus(id: number, body: Record<string, any>) {
  return apiFetch(`api/citas/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

async function checkDisponibilidad(profesionalId: number, fechaProgramada: string) {
  return apiFetch('api/citas/disponibilidad', { query: { profesionalId, fechaProgramada } })
}
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
import { getProfesionales, type ProfesionalDto } from '../api/profesionalApi'
import PTIModal from '../components/PTIModal';
import SesionTerapiaModal from '../components/SesionTerapiaModal';
import InformeProgresoModal from '../components/InformeProgresoModal';
import CerrarPlanModal from '../components/CerrarPlanModal';


const estados = [
  '',
  'Pendiente',
  'CONFIRMADA',
  'Completada',
  'Cancelada',
  'No asistió',
]

export default function ListadoCitas() {
    // Estado para modal de cierre/reevaluación de plan
    const [showCerrarPlanModal, setShowCerrarPlanModal] = useState(false);
    // Estado para modal de informe de progreso
    const [showInformeModal, setShowInformeModal] = useState(false);
    // Estado para modal de sesión de terapia
    const [showSesionModal, setShowSesionModal] = useState(false);
  const { role } = useAuth();
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

  // Profesionales activos
  const [profesionales, setProfesionales] = useState<ProfesionalDto[]>([]);
  useEffect(() => {
    getProfesionales()
      .then(data => setProfesionales(data || []))
      .catch(() => setProfesionales([]));
  }, []);
  // Estados y funciones para el modal de asignación de profesional
  const [showModal, setShowModal] = useState(false)
  const [citaSeleccionada, setCitaSeleccionada] = useState<CitaDto | null>(null)
  const [profesionalId, setProfesionalId] = useState<number | ''>('')
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalSuccess, setModalSuccess] = useState<string | null>(null)
  const [showReject, setShowReject] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState('')
  // Estados para atención clínica
  const [showAtencion, setShowAtencion] = useState(false)
  const [atencion, setAtencion] = useState({
    motivo: '',
    evaluacion: '',
    diagnostico: '',
    observaciones: '',
    plan: '',
  })
  // Estado para modal PTI
  const [showPTIModal, setShowPTIModal] = useState(false);

  const abrirModal = (cita: CitaDto) => {
    setCitaSeleccionada(cita)
    setProfesionalId('')
    setModalError(null)
    setShowModal(true)
    setShowAtencion(false)
    setShowReject(false)
    setMotivoRechazo('')
    setAtencion({ motivo: '', evaluacion: '', diagnostico: '', observaciones: '', plan: '' })
  }
  // Guardar atención clínica y marcar cita como atendida
  const handleGuardarAtencion = async () => {
    if (!citaSeleccionada) return;
    // Validar campos obligatorios
    if (!atencion.motivo.trim() || !atencion.evaluacion.trim() || !atencion.plan.trim()) {
      setModalError('Completa motivo, evaluación y plan de intervención.');
      return;
    }
    setModalError(null);
    try {
      // PATCH a la cita con los datos de atención y estado Atendida
      await patchCitaStatus(citaSeleccionada.id, {
        estado: 'Atendida',
        motivoAtencion: atencion.motivo,
        evaluacionClinica: atencion.evaluacion,
        diagnostico: atencion.diagnostico,
        observaciones: atencion.observaciones,
        planIntervencion: atencion.plan,
      });
      setModalSuccess('Atención clínica registrada exitosamente.');
      cerrarModal();
      setShowAtencion(false);
      fetchCitas();
    } catch (err: any) {
      setModalError(err.message || 'Error al registrar atención clínica');
    }
  };

  const cerrarModal = () => {
    setShowModal(false)
    setCitaSeleccionada(null)
    setProfesionalId('')
    setModalError(null)
  }

  // Aprobar cita: valida disponibilidad y PATCH estado
  const handleAsignarProfesional = async () => {
    if (!citaSeleccionada || !profesionalId) return;
    setModalError(null);
    try {
      // 1. Validar disponibilidad
      const disponible = await checkDisponibilidad(profesionalId, citaSeleccionada.fechaProgramada);
      if (!disponible.available) {
        setModalError('Profesional no disponible en ese horario.');
        return;
      }
      // 2. Aprobar cita
      await patchCitaStatus(citaSeleccionada.id, { estado: 'Confirmada', profesionalId });
      setModalSuccess('Cita aprobada y confirmada exitosamente.');
      cerrarModal();
      fetchCitas();
    } catch (err: any) {
      if (err.status === 409) setModalError('Profesional no disponible en ese horario.');
      else setModalError(err.message || 'Error al aprobar cita');
    }
  };

  // Rechazar cita: PATCH estado y motivo
  const handleRechazarCita = async () => {
    if (!citaSeleccionada || !motivoRechazo.trim()) {
      setModalError('Debes ingresar un motivo de rechazo.');
      return;
    }
    setModalError(null);
    try {
      await patchCitaStatus(citaSeleccionada.id, { estado: 'Rechazada', motivoRechazo });
      setModalSuccess('Cita rechazada correctamente.');
      cerrarModal();
      setShowReject(false);
      setMotivoRechazo('');
      fetchCitas();
    } catch (err: any) {
      setModalError(err.message || 'Error al rechazar cita');
    }
  };

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
                <TableCell>{cita.pacienteNombre || cita.pacienteId}</TableCell>
                <TableCell>{cita.profesionalNombre || 'Sin asignar'}</TableCell>
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
                  {/* Solo mostrar botón de atención si es profesional y la cita está confirmada y asignada a él */}
                  {role === 'Psicologo' && cita.estado === 'Confirmada' && cita.profesionalId && (
                    <>
                      <IconButton onClick={() => { abrirModal(cita); setShowAtencion(true); }} color="primary" aria-label="Registrar atención clínica">
                        <EditIcon />
                      </IconButton>
                      <Button size="small" variant="outlined" sx={{ ml: 1 }} onClick={() => { setCitaSeleccionada(cita); setShowPTIModal(true); }}>
                        Registrar PTI
                      </Button>
                      <Button size="small" variant="contained" sx={{ ml: 1 }} color="secondary" onClick={() => { setCitaSeleccionada(cita); setShowSesionModal(true); }}>
                        Registrar Sesión
                      </Button>
                    </>
                  )}
                              {/* Botón para abrir informe de progreso (solo profesional) */}
                              {role === 'Psicologo' && (
                                <>
                                  <Button variant="outlined" color="info" sx={{ mb: 2, mr: 2 }} onClick={() => setShowInformeModal(true)}>
                                    Consultar / Generar Informe de Progreso
                                  </Button>
                                  <Button variant="outlined" color="warning" sx={{ mb: 2 }} onClick={() => setShowCerrarPlanModal(true)}>
                                    Cerrar / Reevaluar Plan Terapéutico
                                  </Button>
                                </>
                              )}
                                    {/* Modal para cierre/reevaluación de plan */}
                                    <CerrarPlanModal
                                      open={showCerrarPlanModal}
                                      onClose={() => setShowCerrarPlanModal(false)}
                                      pacienteId={citaSeleccionada?.pacienteId || 0}
                                      onSuccess={() => setShowCerrarPlanModal(false)}
                                    />
                              {/* Modal para registrar sesión de terapia y progreso */}
                                {/* Modal para informe de progreso */}
                                <InformeProgresoModal open={showInformeModal} onClose={() => setShowInformeModal(false)} />
                              <SesionTerapiaModal
                                open={showSesionModal}
                                onClose={() => setShowSesionModal(false)}
                                pacienteId={citaSeleccionada?.pacienteId || 0}
                                planActivo={undefined} // Aquí se puede pasar el plan activo si se obtiene
                                onSuccess={() => { setShowSesionModal(false); fetchCitas(); }}
                              />
                        {/* Modal para registrar PTI y objetivos */}
                        <PTIModal
                          open={showPTIModal}
                          onClose={() => setShowPTIModal(false)}
                          pacienteId={citaSeleccionada?.pacienteId || 0}
                          profesionalId={citaSeleccionada?.profesionalId || 0}
                          onSuccess={() => { setShowPTIModal(false); fetchCitas(); }}
                        />
                  {/* Botón normal para admin/operadora o para asignar profesional */}
                  {((role !== 'Psicologo') || (cita.estado !== 'Confirmada' || !cita.profesionalId)) && (
                    <IconButton onClick={() => abrirModal(cita)} color="primary" aria-label="Editar cita">
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal MUI para asignar profesional */}
      <Dialog open={showModal} onClose={cerrarModal}>
        <DialogTitle>
          {showAtencion ? 'Registrar Atención Clínica' : 'Gestión de solicitud de cita'}
        </DialogTitle>
        <DialogContent>
          {showAtencion ? (
            <>
              <TextField
                label="Motivo de consulta"
                value={atencion.motivo}
                onChange={e => setAtencion(a => ({ ...a, motivo: e.target.value }))}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Evaluación clínica"
                value={atencion.evaluacion}
                onChange={e => setAtencion(a => ({ ...a, evaluacion: e.target.value }))}
                fullWidth
                margin="normal"
                required
                multiline
                minRows={2}
              />
              <TextField
                label="Diagnóstico (opcional)"
                value={atencion.diagnostico}
                onChange={e => setAtencion(a => ({ ...a, diagnostico: e.target.value }))}
                fullWidth
                margin="normal"
                multiline
                minRows={1}
              />
              <TextField
                label="Observaciones"
                value={atencion.observaciones}
                onChange={e => setAtencion(a => ({ ...a, observaciones: e.target.value }))}
                fullWidth
                margin="normal"
                multiline
                minRows={1}
              />
              <TextField
                label="Plan de intervención / seguimiento"
                value={atencion.plan}
                onChange={e => setAtencion(a => ({ ...a, plan: e.target.value }))}
                fullWidth
                margin="normal"
                required
                multiline
                minRows={2}
              />
            </>
          ) : showReject ? (
            <>
              <TextField
                label="Motivo de rechazo"
                value={motivoRechazo}
                onChange={e => setMotivoRechazo(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                margin="normal"
              />
            </>
          ) : (
            <>
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
                  {(profesionales ?? [])
                    .filter(prof => prof.isActive)
                    .map(prof => (
                      <MenuItem key={prof.id} value={prof.id}>
                        {prof.firstName} {prof.lastName} ({prof.specialtyName})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </>
          )}
          {modalError && <div style={{ color: 'red', marginTop: 12 }}>{modalError}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal}>Cancelar</Button>
          {showAtencion ? (
            <Button onClick={handleGuardarAtencion} variant="contained" color="primary">Guardar atención</Button>
          ) : showReject ? (
            <Button onClick={handleRechazarCita} variant="contained" color="error">Confirmar rechazo</Button>
          ) : (
            <>
              <Button onClick={() => setShowReject(true)} color="error">Rechazar</Button>
              <Button onClick={handleAsignarProfesional} variant="contained">Aprobar</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Modal de éxito */}
      <Dialog open={!!modalSuccess} onClose={() => setModalSuccess(null)}>
        <DialogTitle>Éxito</DialogTitle>
        <DialogContent>
          <div style={{ color: 'green', margin: 12 }}>{modalSuccess}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalSuccess(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
