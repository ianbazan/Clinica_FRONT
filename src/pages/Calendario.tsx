import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import CalendarGrid from '../components/CalendarGrid'
import { appointments as mockAppointments } from '../data/mockAppointments'
import Modal from '../components/Modal'
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

  const appointmentsForSelected = selectedDate
    ? mockAppointments.filter((a) => dayjs(a.date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD') && (client === 'ALL' || a.client === client))
    : []

  return (
    <div>
      <h2>Calendario</h2>
      <div style={{ marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <label>
          Cliente:{' '}
          <select value={client} onChange={(e) => setClient(e.target.value)}>
            {clients.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <CalendarGrid month={month} appointments={mockAppointments} onPrev={onPrev} onNext={onNext} onSelectDate={onSelectDate} filterClient={client} />
      <p style={{ marginTop: 8 }}>Doble clic en una celda para ver las citas de ese día.</p>

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
