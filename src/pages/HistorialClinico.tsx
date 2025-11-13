import { useMemo, useState } from 'react'
import { patients } from '../data/mockPatients'
import Select from '../components/Select'

export default function HistorialClinico() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter((p) => Object.values(p).join(' ').toLowerCase().includes(q))
  }, [query])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageData = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize])

  const goto = (n: number) => setPage(Math.max(1, Math.min(totalPages, n)))

  return (
    <div>
      <h2>Historial clínico</h2>
      <p>Acceso para Psicólogos y Admin. Aquí se muestran los historiales de los pacientes.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <input placeholder="Buscar pacientes..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} style={{ padding: 8, flex: 1 }} />
        <Select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 4 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Nombre</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Fecha Nac.</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Última visita</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Notas</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: 8, borderBottom: '1px solid #f4f4f4' }}>{p.name}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f4f4f4' }}>{p.dob}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f4f4f4' }}>{p.lastVisit}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f4f4f4' }}>{p.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div>
          Mostrando {Math.min((page - 1) * pageSize + 1, total)} - {Math.min(page * pageSize, total)} de {total}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn" onClick={() => goto(page - 1)} disabled={page <= 1}>Anterior</button>
          <span>Pagina {page} / {totalPages}</span>
          <button className="btn" onClick={() => goto(page + 1)} disabled={page >= totalPages}>Siguiente</button>
        </div>
      </div>
    </div>
  )
}
