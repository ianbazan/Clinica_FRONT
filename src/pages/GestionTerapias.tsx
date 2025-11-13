import React, { useMemo, useState } from 'react'
import { therapies } from '../data/mockTherapies'
import Select from '../components/Select'

export default function GestionTerapias() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return therapies
    return therapies.filter((p) => Object.values(p).join(' ').toLowerCase().includes(q))
  }, [query])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const pageData = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page, pageSize])
  const goto = (n: number) => setPage(Math.max(1, Math.min(totalPages, n)))

  return (
    <div>
      <h2>Gestión de terapias</h2>
      <p>Accesible por Admin y Operadora. Administrar tipos de terapia, sesiones, etc.</p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <input placeholder="Buscar terapias..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} style={{ padding: 8, flex: 1 }} />
        <Select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Select>
      </div>

      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        {pageData.map((t) => (
          <div key={t.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{t.name}</strong>
              <span>{t.durationMin} min</span>
            </div>
            <div style={{ color: '#666', marginTop: 6 }}>{t.description}</div>
            <div style={{ marginTop: 8 }}><strong>Precio:</strong> {t.price ? `${t.price} CLP` : '—'}</div>
          </div>
        ))}
      </div>

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
