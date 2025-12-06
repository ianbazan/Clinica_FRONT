import { useState } from 'react'
import './RegistroPaciente.css'
import { createGuardian, createPatient } from '../api/patientApi'

export default function RegistroPaciente() {
  const [guardianData, setGuardianData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    dni: '',
    tipoRelacionId: 1, // Valor por defecto
  })

  const [patientData, setPatientData] = useState({
    nombre: '',
    apellido: '',
    genero: '',
    dni: '',
    fechaNacimiento: '',
    nivelAutismo: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [newPatientId, setNewPatientId] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Crear tutor/apoderado
      const guardianResponse = await createGuardian({
        name: guardianData.nombre,
        lastName: guardianData.apellido,
        telephone: guardianData.telefono,
        address: guardianData.direccion || undefined,
        dni: guardianData.dni,
        tipoRelacionId: guardianData.tipoRelacionId,
      })

      console.log('Tutor creado:', guardianResponse)

      // 2. Crear paciente con el guardianId retornado
      const patientResponse = await createPatient({
        name: patientData.nombre,
        lastName: patientData.apellido,
        gender: patientData.genero === 'true',
        dni: patientData.dni,
        birthDate: patientData.fechaNacimiento,
        autismLevel: patientData.nivelAutismo,
        guardianId: guardianResponse.id!,
        isActive: true,
      })

      console.log('Paciente creado:', patientResponse)

      setNewPatientId(patientResponse.id ?? null)
      setShowModal(true)

      // Limpiar formulario
      setGuardianData({ nombre: '', apellido: '', telefono: '', direccion: '', dni: '', tipoRelacionId: 1 })
      setPatientData({ nombre: '', apellido: '', genero: '', dni: '', fechaNacimiento: '', nivelAutismo: '' })
    } catch (err: any) {
      console.error('Error al registrar:', err)
      setError(err.message || 'Error al registrar paciente y tutor')
      alert('❌ Error: ' + (err.message || 'No se pudo completar el registro'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: '#fff',
            padding: 32,
            borderRadius: 12,
            boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
            minWidth: 320,
            textAlign: 'center'
          }}>
            <h3 style={{marginBottom: 16}}>✅ Registro exitoso</h3>
            <p><strong>ID del nuevo paciente:</strong></p>
            <div style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#1976d2',
              margin: '12px 0 24px'
            }}>{newPatientId}</div>
            <button className="btn" onClick={() => setShowModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      <h2>Registrar Nuevo Paciente</h2>
      <p>Esta pantalla permite a la Recepcionista registrar un nuevo paciente y su tutor.</p>
      
      {error && (
        <div style={{ 
          background: '#fee', 
          border: '1px solid #fcc', 
          padding: 12, 
          borderRadius: 8, 
          marginBottom: 16,
          maxWidth: 900,
          margin: '0 auto 16px'
        }}>
          ❌ {error}
        </div>
      )}

      <div className="registro-page">
        <form className="registro-form" onSubmit={handleSubmit}>
          
          {/* SECCIÓN TUTOR/APODERADO */}
          <fieldset className="form-section" disabled={loading}>
            <legend>Datos del Tutor/Apoderado</legend>
            
            <div className="form-row">
              <label htmlFor="tutor-nombre">Nombre:</label>
              <input
                id="tutor-nombre"
                name="tutor-nombre"
                placeholder="Nombre del tutor"
                value={guardianData.nombre}
                onChange={(e) => setGuardianData({ ...guardianData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="tutor-apellido">Apellido:</label>
              <input
                id="tutor-apellido"
                name="tutor-apellido"
                placeholder="Apellido del tutor"
                value={guardianData.apellido}
                onChange={(e) => setGuardianData({ ...guardianData, apellido: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="tutor-dni">DNI:</label>
              <input
                id="tutor-dni"
                name="tutor-dni"
                placeholder="DNI (8 dígitos)"
                maxLength={8}
                value={guardianData.dni}
                onChange={(e) => setGuardianData({ ...guardianData, dni: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="tutor-telefono">Teléfono:</label>
              <input
                id="tutor-telefono"
                name="tutor-telefono"
                placeholder="Teléfono (9 dígitos)"
                maxLength={9}
                value={guardianData.telefono}
                onChange={(e) => setGuardianData({ ...guardianData, telefono: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="tutor-direccion">Dirección:</label>
              <input
                id="tutor-direccion"
                name="tutor-direccion"
                placeholder="Dirección (opcional)"
                value={guardianData.direccion}
                onChange={(e) => setGuardianData({ ...guardianData, direccion: e.target.value })}
              />
            </div>
              <div className="form-row">
                <label htmlFor="tutor-tipo-relacion">Tipo de relación:</label>
                <select
                  id="tutor-tipo-relacion"
                  name="tutor-tipo-relacion"
                  value={guardianData.tipoRelacionId}
                  onChange={(e) => setGuardianData({ ...guardianData, tipoRelacionId: Number(e.target.value) })}
                  required
                >
                  <option value={1}>Madre</option>
                  <option value={2}>Padre</option>
                  <option value={3}>Tutor legal</option>
                  <option value={4}>Abuela</option>
                </select>
              </div>
          </fieldset>

          {/* SECCIÓN PACIENTE */}
          <fieldset className="form-section" disabled={loading}>
            <legend>Datos del Paciente</legend>
            
            <div className="form-row">
              <label htmlFor="paciente-nombre">Nombre:</label>
              <input
                id="paciente-nombre"
                name="paciente-nombre"
                placeholder="Nombre del paciente"
                value={patientData.nombre}
                onChange={(e) => setPatientData({ ...patientData, nombre: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="paciente-apellido">Apellido:</label>
              <input
                id="paciente-apellido"
                name="paciente-apellido"
                placeholder="Apellido del paciente"
                value={patientData.apellido}
                onChange={(e) => setPatientData({ ...patientData, apellido: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="paciente-dni">DNI:</label>
              <input
                id="paciente-dni"
                name="paciente-dni"
                placeholder="DNI (8 dígitos)"
                maxLength={8}
                value={patientData.dni}
                onChange={(e) => setPatientData({ ...patientData, dni: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="paciente-genero">Género:</label>
              <select
                id="paciente-genero"
                name="paciente-genero"
                value={patientData.genero}
                onChange={(e) => setPatientData({ ...patientData, genero: e.target.value })}
                required
              >
                <option value="">Seleccione...</option>
                <option value="true">Masculino</option>
                <option value="false">Femenino</option>
              </select>
            </div>

            <div className="form-row">
              <label htmlFor="paciente-fecha-nacimiento">Fecha de Nacimiento:</label>
              <input
                id="paciente-fecha-nacimiento"
                name="paciente-fecha-nacimiento"
                type="date"
                value={patientData.fechaNacimiento}
                onChange={(e) => setPatientData({ ...patientData, fechaNacimiento: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <label htmlFor="paciente-nivel-autismo">Nivel de Autismo:</label>
              <select
                id="paciente-nivel-autismo"
                name="paciente-nivel-autismo"
                value={patientData.nivelAutismo}
                onChange={(e) => setPatientData({ ...patientData, nivelAutismo: e.target.value })}
                required
              >
                <option value="">Seleccione...</option>
                <option value="Leve">Leve</option>
                <option value="Moderado">Moderado</option>
                <option value="Grave">Grave</option>
              </select>
            </div>
          </fieldset>

          {/* BOTONES */}
          <div className="registro-actions">
            <button type="button" className="btn btn-secondary" disabled={loading}>Cancelar</button>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
