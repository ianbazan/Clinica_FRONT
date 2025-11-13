import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import CalendarGrid from '../components/CalendarGrid'
import { appointments as mockAppointments } from '../data/mockAppointments'
import Modal from '../components/Modal'
import NoteBox from '../components/NoteBox'
import Select from '../components/Select'
import './Calendario.css'

export default function Calendario() {
  const [month, setMonth] = useState(() => dayjs())
  const clients = useMemo(() => ['ALL', ...Array.from(new Set(mockAppointments.map((a) => a.client)))], [])
  const [client, setClient] = useState<string>('ALL')

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const onPrev = () => setMonth((m) => m.subtract(1, 'month'))
  const onNext = () => setMonth((m) => m.add(1, 'month'))
  const onSelectDate = (d: dayjs.Dayjs) => {
    setSelectedDate(d)
    setModalOpen(true)
  }

  // month/year selectors
  const monthNames = Array.from({ length: 12 }).map((_, i) => dayjs().month(i).format('MMMM'))
  const currentYear = dayjs().year()
  const yearRange = Array.from({ length: 21 }).map((_, i) => currentYear - 10 + i) // -10..+10
  const onChangeMonth = (mIdx: number) => setMonth((m) => m.year(m.year()).month(mIdx).startOf('month'))
  const onChangeYear = (y: number) => setMonth((m) => m.year(y).startOf('month'))

  const appointmentsForSelected = selectedDate
    ? mockAppointments.filter((a) => dayjs(a.date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD') && (client === 'ALL' || a.client === client))
    : []

  return (
    <div>
      <h2>Calendario</h2>
      <div style={{ marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Cliente:{' '}
          <Select value={client} onChange={(e) => setClient(e.target.value)}>
            {clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </label>

        <label>
          Mes:{' '}
          <Select value={month.month()} onChange={(e) => onChangeMonth(Number(e.target.value))}>
            {monthNames.map((name, i) => (
              <option key={i} value={i}>
                {name}
              </option>
            ))}
          </Select>
        </label>

        <label>
          Año:{' '}
          <Select value={month.year()} onChange={(e) => onChangeYear(Number(e.target.value))}>
            {yearRange.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="calendar-layout">
        <div className="calendar-main">
          <CalendarGrid month={month} appointments={mockAppointments} onPrev={onPrev} onNext={onNext} onSelectDate={onSelectDate} filterClient={client} />
        </div>

        <NoteBox>
          <p style={{ margin: 0 }}>Doble clic en una celda para ver las citas de ese día.</p>
        </NoteBox>
      </div>

      <Modal open={modalOpen} title={selectedDate ? `Citas — ${selectedDate.format('YYYY-MM-DD')}` : 'Citas'} onClose={() => setModalOpen(false)}>
        {appointmentsForSelected.length === 0 ? (
          <div>No hay citas para esta fecha.</div>
        ) : (
          <ul>
            {appointmentsForSelected.map((a) => (
              <li key={a.id} style={{ marginBottom: 8 }}>
                <strong>{dayjs(a.date).format('HH:mm')}</strong> — <em>{a.client}</em>
                <div>{a.notes}</div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  )
}
