import { useMemo } from 'react'
import dayjs from 'dayjs'

type Appointment = {
  id: number;
  year: number;
  month: number;
  day: number;
  reason: string;
  patientName: string;
  status: string;
  isActive: boolean;
  scheduledDate: string;
};

interface Props {
  month: dayjs.Dayjs;
  appointments: Appointment[];
  onPrev: () => void;
  onNext: () => void;
  onSelectDate: (d: dayjs.Dayjs) => void;
  filterClient?: string | null;
}

export default function CalendarGrid({ month, appointments, onPrev, onNext, onSelectDate, filterClient }: Props) {
  const start = month.startOf('month').startOf('week');
  const days: dayjs.Dayjs[] = useMemo(() => {
    const arr: dayjs.Dayjs[] = [];
    for (let i = 0; i < 42; i++) {
      arr.push(start.add(i, 'day'));
    }
    return arr;
  }, [start]);

  // Agrupar por fecha (YYYY-MM-DD)
  const apptsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of appointments) {
      if (filterClient && filterClient !== 'ALL' && a.patientName !== filterClient) continue;
      const key = dayjs(a.scheduledDate).format('YYYY-MM-DD');
      const list = map.get(key) ?? [];
      list.push(a);
      map.set(key, list);
    }
    return map;
  }, [appointments, filterClient]);

  return (
    <div className="calendar-root">
      <div className="calendar-header">
        <button onClick={onPrev}>&lt;</button>
        <div className="calendar-title">{month.format('MMMM YYYY')}</div>
        <button onClick={onNext}>&gt;</button>
      </div>

      <div className="calendar-weeknames">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((w) => (
          <div key={w} className="calendar-weekname">
            {w}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((d) => {
          const key = d.format('YYYY-MM-DD');
          const cellAppts = apptsByDate.get(key) ?? [];
          const inMonth = d.month() === month.month();
          return (
            <div
              key={key}
              className={`day-cell ${inMonth ? '' : 'muted'}`}
              onDoubleClick={() => onSelectDate(d)}
            >
              <div className="day-number">{d.date()}</div>
              <div className="appointments">
                {cellAppts.slice(0, 3).map((a) => (
                  <div key={a.id} className="appt" style={{ borderLeft: `5px solid ${getStatusColor(a.status)}` }}>
                    <span className="appt-time">{dayjs(a.scheduledDate).format('HH:mm')}</span>
                    <span className="appt-client"> — {a.patientName}</span>
                    <div className="appt-notes">{a.reason}</div>
                  </div>
                ))}
                {cellAppts.length > 3 && <div className="more">+{cellAppts.length - 3} más</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Helper para color de estado
  function getStatusColor(status: string) {
    if (!status) return '#bdbdbd';
    if (status.toLowerCase().includes('pend')) return '#ffe066'; // amarillo
    if (status.toLowerCase().includes('conf')) return '#81c784'; // verde
    if (status.toLowerCase().includes('cancel')) return '#e57373'; // rojo
    return '#90caf9'; // azul claro por defecto
  }
}
