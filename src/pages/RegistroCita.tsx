import './RegistroCita.css'

export default function RegistroCita() {
  return (
    <div>
      <h2>Registro de cita</h2>
      <p>Esta pantalla permite a la Operadora y al Admin registrar una cita.</p>
      <div className="registro-page">
        <form className="registro-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-row">
          <label htmlFor="cliente">Cliente:</label>
          <input id="cliente" name="cliente" placeholder="Nombre cliente" />
        </div>

        <div className="form-row">
          <label htmlFor="fecha">Fecha y hora:</label>
          <input id="fecha" name="fecha" type="datetime-local" />
        </div>

        <div className="form-row">
          <label htmlFor="notas">Notas:</label>
          <textarea id="notas" name="notas" placeholder="Notas sobre la cita" />
        </div>

          <div className="registro-actions">
            <button className="btn" type="submit">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
