import { useMemo } from 'react'
import dayjs from 'dayjs'

type Appointment = {
  id: number
  client: string
  date: string // ISO
  notes: string
}

interface Props {
  month: dayjs.Dayjs
  appointments: Appointment[]
  onPrev: () => void
  onNext: () => void
  onSelectDate: (d: dayjs.Dayjs) => void
  filterClient?: string | null
}

export default function CalendarGrid({ month, appointments, onPrev, onNext, onSelectDate, filterClient }: Props) {
  const start = month.startOf('month').startOf('week')
  const days: dayjs.Dayjs[] = useMemo(() => {
    const arr: dayjs.Dayjs[] = []
    for (let i = 0; i < 42; i++) {
      arr.push(start.add(i, 'day'))
    }
    return arr
  }, [start])

  const apptsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>()
    for (const a of appointments) {
      if (filterClient && filterClient !== 'ALL' && a.client !== filterClient) continue
      const key = dayjs(a.date).format('YYYY-MM-DD')
      const list = map.get(key) ?? []
      list.push(a)
      map.set(key, list)
    }
    return map
  }, [appointments, filterClient])

  return (
    <div className="calendar-root">
      <div className="calendar-header">
        <button onClick={onPrev}>&lt;</button>
        <div className="calendar-title">{month.format('MMMM YYYY')}</div>
        <button onClick={onNext}>&gt;</button>
      </div>

      <div className="calendar-weeknames">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((w) => (
          <div key={w} className="calendar-weekname">
            {w}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((d) => {
          const key = d.format('YYYY-MM-DD')
          const cellAppts = apptsByDate.get(key) ?? []
          const inMonth = d.month() === month.month()
          return (
            <div
              key={key}
              className={`day-cell ${inMonth ? '' : 'muted'}`}
              onDoubleClick={() => onSelectDate(d)}
            >
              <div className="day-number">{d.date()}</div>
              <div className="appointments">
                {cellAppts.slice(0, 3).map((a) => (
                  <div key={a.id} className="appt">
                    <span className="appt-time">{dayjs(a.date).format('HH:mm')}</span>
                    <span className="appt-client"> — {a.client}</span>
                    <div className="appt-notes">{a.notes}</div>
                  </div>
                ))}
                {cellAppts.length > 3 && <div className="more">+{cellAppts.length - 3} more</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
