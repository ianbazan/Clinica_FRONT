import { useMemo, useState, useEffect } from 'react'
import apiFetch from '../api/client'
import dayjs from 'dayjs'
import CalendarGrid from '../components/CalendarGrid';
import type { Appointment } from '../types/appointment';
import Modal from '../components/Modal';
import NoteBox from '../components/NoteBox';
import { Box, MenuItem, Select, Typography, ToggleButton, ToggleButtonGroup, Paper, Button } from '@mui/material';
import './Calendario.css'

export default function Calendario() {
  const [month, setMonth] = useState(() => dayjs());
  const [client, setClient] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<'month' | 'week'>('month');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professional, setProfessional] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Fetch appointments from backend
  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      setError(null);
      try {
        const query: Record<string, string | number | boolean | undefined> = {
          patient: client !== 'ALL' ? client : undefined,
          professional: professional !== 'ALL' ? professional : undefined,
          month: month.month() + 1,
          year: month.year(),
        }
        const data = await apiFetch('/api/appointments/calendar', { query: query as Record<string, string | number | boolean> })
        setAppointments(data ?? []);
      } catch (e: any) {
        setError(e.message || 'Error de red al cargar citas');
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [client, professional, month]);

  // Obtener lista de pacientes únicos para el filtro
  const clients = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach((a: any) => set.add(a.patientName));
    return ['ALL', ...Array.from(set)];
  }, [appointments]);

  // Obtener lista de profesionales únicos para el filtro
  const professionals = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach((a: any) => {
      if (a.professionalName) set.add(a.professionalName);
      else if (a.professionalId) set.add(`ID:${a.professionalId}`);
    });
    return ['ALL', ...Array.from(set)];
  }, [appointments]);

  const onPrev = () => {
    if (view === 'month') setMonth((m) => m.subtract(1, 'month'));
    else setMonth((m) => m.subtract(1, 'week'));
  };
  const onNext = () => {
    if (view === 'month') setMonth((m) => m.add(1, 'month'));
    else setMonth((m) => m.add(1, 'week'));
  };
  const onSelectDate = (d: dayjs.Dayjs) => {
    setSelectedDate(d);
    setModalOpen(true);
  };

  // month/year selectors
  const monthNames = Array.from({ length: 12 }).map((_, i) => dayjs().month(i).format('MMMM'));
  const currentYear = dayjs().year();
  const yearRange = Array.from({ length: 21 }).map((_, i) => currentYear - 10 + i); // -10..+10
  const onChangeMonth = (mIdx: number) => setMonth((m) => m.year(m.year()).month(mIdx).startOf('month'));
  const onChangeYear = (y: number) => setMonth((m) => m.year(y).startOf('month'));

  // Semana actual (para vista semanal)
  const weekStart = month.startOf('week');
  const weekDays = Array.from({ length: 7 }).map((_, i) => weekStart.add(i, 'day'));
  const hours = Array.from({ length: 12 }).map((_, i) => 8 + i); // 8:00 a 19:00

  // Citas de la semana y cliente
  const weekAppointments = appointments.filter((a: any) => {
    const d = dayjs(a.scheduledDate);
    return d.isAfter(weekStart.subtract(1, 'day')) && d.isBefore(weekStart.add(7, 'day')) && (client === 'ALL' || a.patientName === client);
  });

  // Citas del día seleccionado
  const appointmentsForSelected = selectedDate
    ? appointments.filter((a: any) => dayjs(a.scheduledDate).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD') && (client === 'ALL' || a.patientName === client))
    : [];

  // Agrupar citas por día para la vista mensual


  // Colores por estado
  const statusColor = (status: string) => {
    if (!status) return '#bdbdbd';
    if (status.toLowerCase().includes('pend')) return '#ffe066'; // amarillo
    if (status.toLowerCase().includes('conf')) return '#81c784'; // verde
    if (status.toLowerCase().includes('cancel')) return '#e57373'; // rojo
    return '#90caf9'; // azul claro por defecto
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Calendario</Typography>
      <Box mb={1.5} display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">Cliente:</Typography>
          <Select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            {clients.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">Profesional:</Typography>
          <Select
            value={professional}
            onChange={(e) => setProfessional(e.target.value)}
            size="small"
            sx={{ minWidth: 140 }}
          >
            {professionals.map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">Mes:</Typography>
          <Select
            value={month.month()}
            onChange={(e) => onChangeMonth(Number(e.target.value))}
            size="small"
            sx={{ minWidth: 120 }}
          >
            {monthNames.map((name, i) => (
              <MenuItem key={i} value={i}>{name}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">Año:</Typography>
          <Select
            value={month.year()}
            onChange={(e) => onChangeYear(Number(e.target.value))}
            size="small"
            sx={{ minWidth: 100 }}
          >
            {yearRange.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </Box>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && setView(v)}
          size="small"
          sx={{ ml: 2 }}
        >
          <ToggleButton value="month">Mes</ToggleButton>
          <ToggleButton value="week">Semana</ToggleButton>
        </ToggleButtonGroup>
      </Box>


      {error && (
        <Box color="error.main" mb={2}>{error}</Box>
      )}
      {loading && (
        <Box mb={2}>Cargando citas...</Box>
      )}
      {view === 'month' && (
        <div className="calendar-root">
          <div className="calendar-layout">
            <div className="calendar-main">
              <CalendarGrid
                month={month}
                appointments={professional === 'ALL' ? appointments : appointments.filter((a) => ((a.professionalName ?? (a.professionalId ? `ID:${a.professionalId}` : '')) === professional))}
                onPrev={onPrev}
                onNext={onNext}
                onSelectDate={onSelectDate}
                filterClient={client}
              />
            </div>
            <NoteBox>
              <p style={{ margin: 0 }}>Doble clic en una celda para ver las citas de ese día.</p>
            </NoteBox>
          </div>
        </div>
      )}
      {view === 'week' && (
        <div className="calendar-root">
          <Paper sx={{ p: 2, mt: 2, overflowX: 'auto' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">Semana del {weekStart.format('DD MMM YYYY')}</Typography>
              <Box>
                <Button variant="outlined" size="small" onClick={onPrev} sx={{ mr: 1 }}>Anterior</Button>
                <Button variant="outlined" size="small" onClick={onNext}>Siguiente</Button>
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns={`80px repeat(7, 1fr)`}>
              <Box></Box>
              {weekDays.map((d) => (
                <Box key={d.format('YYYY-MM-DD')} sx={{ textAlign: 'center', fontWeight: 600, color: 'primary.main', mb: 1 }}>
                  {d.format('ddd DD')}
                </Box>
              ))}
              {hours.map((h) => [
                <Box key={h} sx={{ borderTop: '1px solid #eee', py: 1, fontSize: 13, color: '#888', textAlign: 'right', pr: 1 }}>{h}:00</Box>,
                ...weekDays.map((d) => {
                  const cellAppts = weekAppointments.filter((a: any) => {
                    const matchDay = dayjs(a.scheduledDate).format('YYYY-MM-DD') === d.format('YYYY-MM-DD');
                    const matchHour = dayjs(a.scheduledDate).hour() === h;
                    const profName = a.professionalName ?? (a.professionalId ? `ID:${a.professionalId}` : '');
                    const matchProf = professional === 'ALL' || profName === professional;
                    return matchDay && matchHour && matchProf;
                  });
                  return (
                    <Box key={d.format('YYYY-MM-DD') + h} sx={{ borderTop: '1px solid #eee', minHeight: 36, px: 0.5 }}>
                      {cellAppts.map((a: any) => (
                        <Paper key={a.id} sx={{ mb: 0.5, p: 0.5, fontSize: 12, bgcolor: 'grey.100', borderLeft: `5px solid ${statusColor(a.status)}` }}>
                          <span style={{ fontWeight: 700, color: '#1976d2' }}>{dayjs(a.scheduledDate).format('HH:mm')}</span>
                          <span style={{ marginLeft: 4 }}>{a.patientName}</span>
                          <div style={{ fontSize: 11, color: '#555' }}>{a.reason}</div>
                          <div style={{ fontSize: 11, color: '#888' }}>
                            {(() => {
                              const prof = a.professionalName ?? (a.professionalId ? `ID:${a.professionalId}` : '');
                              return prof ? `Prof: ${prof}` : '';
                            })()}
                          </div>
                        </Paper>
                      ))}
                    </Box>
                  );
                })
              ])}
            </Box>
          </Paper>
        </div>
      )}

      <Modal open={modalOpen} title={selectedDate ? `Citas — ${selectedDate.format('YYYY-MM-DD')}` : 'Citas'} onClose={() => setModalOpen(false)}>
        {appointmentsForSelected.length === 0 ? (
          <div>No hay citas para esta fecha.</div>
        ) : (
          <ul>
            {appointmentsForSelected
              .filter((a: any) => {
                const profName = a.professionalName ?? (a.professionalId ? `ID:${a.professionalId}` : '');
                return professional === 'ALL' || profName === professional;
              })
              .map((a: any) => (
                <li key={a.id} style={{ marginBottom: 8 }}>
                  <strong>{dayjs(a.scheduledDate).format('HH:mm')}</strong> — <em>{a.patientName}</em>
                  <div>{a.reason}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>
                    {(() => {
                      const prof = a.professionalName ?? (a.professionalId ? `ID:${a.professionalId}` : '');
                      return prof ? `Prof: ${prof}` : '';
                    })()}
                  </div>
                  <div style={{ fontSize: 12, color: statusColor(a.status) }}>{a.status}</div>
                </li>
              ))}
          </ul>
        )}
      </Modal>
    </div>
  )
}
