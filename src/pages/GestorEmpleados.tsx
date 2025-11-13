import { useMemo, useState } from 'react'
import { employees } from '../data/mockEmployees'
import Select from '../components/Select'

export default function GestorEmpleados() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return employees
    return employees.filter((p) => Object.values(p).join(' ').toLowerCase().includes(q))
  }, [query])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageData = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize])
  const goto = (n: number) => setPage(Math.max(1, Math.min(totalPages, n)))

  return (
    <div>
      <h2>Gestor de empleados</h2>
      <p>Sólo accesible por Admin. Aquí podrás ver y administrar empleados.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <input placeholder="Buscar empleados..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} style={{ padding: 8, flex: 1 }} />
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
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Rol</th>
            <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((e) => (
            <tr key={e.id}>
              <td style={{ padding: 8, borderBottom: '1px solid #f4f4f4' }}>{e.name}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f4f4f4' }}>{e.role}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f4f4f4' }}>{e.email}</td>
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
