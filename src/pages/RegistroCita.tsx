import React from 'react'

export default function RegistroCita() {
  return (
    <div>
      <h2>Registro de cita</h2>
      <p>Esta pantalla permite a la Operadora y al Admin registrar una cita.</p>
      <form>
        <div>
          <label>Cliente: <input placeholder="Nombre cliente" /></label>
        </div>
        <div>
          <label>Fecha y hora: <input type="datetime-local" /></label>
        </div>
        <div>
          <label>Notas: <input placeholder="Notas" /></label>
        </div>
        <button type="button">Registrar</button>
      </form>
    </div>
  )
}
