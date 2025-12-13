import { useState } from 'react';
import './RegistroPaciente.css';
import { createGuardian, createPatient } from '../api/patientApi';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
} from '@mui/material';

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
    <Box>
      {showModal && (
        <Box sx={{
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
          <Paper sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            minWidth: 320,
            textAlign: 'center'
          }}>
            <Typography variant="h5" gutterBottom>✅ Registro exitoso</Typography>
            <Typography variant="body1"><strong>ID del nuevo paciente:</strong></Typography>
            <Box sx={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#1976d2',
              my: 2
            }}>{newPatientId}</Box>
            <Button variant="contained" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
          </Paper>
        </Box>
      )}
      <Typography variant="h4" gutterBottom>Registrar Nuevo Paciente</Typography>
      <Typography variant="body1" gutterBottom>Esta pantalla permite a la Recepcionista registrar un nuevo paciente y su tutor.</Typography>

      {error && (
        <Box sx={{
          background: '#fee',
          border: '1px solid #fcc',
          p: 1.5,
          borderRadius: 2,
          mb: 2,
          maxWidth: 900,
          mx: 'auto'
        }}>
          ❌ {error}
        </Box>
      )}

      <Box className="registro-page">
        <form className="registro-form" onSubmit={handleSubmit}>
          {/* SECCIÓN TUTOR/APODERADO */}
          <fieldset className="form-section" disabled={loading} style={{ border: 0, marginBottom: 24 }}>
            <legend>Datos del Tutor/Apoderado</legend>
            <Box display="grid" gap={2}>
              <TextField
                id="tutor-nombre"
                label="Nombre del tutor"
                value={guardianData.nombre}
                onChange={(e) => setGuardianData({ ...guardianData, nombre: e.target.value })}
                required
              />
              <TextField
                id="tutor-apellido"
                label="Apellido del tutor"
                value={guardianData.apellido}
                onChange={(e) => setGuardianData({ ...guardianData, apellido: e.target.value })}
                required
              />
              <TextField
                id="tutor-dni"
                label="DNI (8 dígitos)"
                inputProps={{ maxLength: 8 }}
                value={guardianData.dni}
                onChange={(e) => setGuardianData({ ...guardianData, dni: e.target.value })}
                required
              />
              <TextField
                id="tutor-telefono"
                label="Teléfono (9 dígitos)"
                inputProps={{ maxLength: 9 }}
                value={guardianData.telefono}
                onChange={(e) => setGuardianData({ ...guardianData, telefono: e.target.value })}
                required
              />
              <TextField
                id="tutor-direccion"
                label="Dirección (opcional)"
                value={guardianData.direccion}
                onChange={(e) => setGuardianData({ ...guardianData, direccion: e.target.value })}
              />
              <FormControl required>
                <InputLabel id="tutor-tipo-relacion-label">Tipo de relación</InputLabel>
                <Select
                  labelId="tutor-tipo-relacion-label"
                  id="tutor-tipo-relacion"
                  value={guardianData.tipoRelacionId}
                  label="Tipo de relación"
                  onChange={(e) => setGuardianData({ ...guardianData, tipoRelacionId: Number(e.target.value) })}
                >
                  <MenuItem value={1}>Madre</MenuItem>
                  <MenuItem value={2}>Padre</MenuItem>
                  <MenuItem value={3}>Tutor legal</MenuItem>
                  <MenuItem value={4}>Abuela</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </fieldset>

          {/* SECCIÓN PACIENTE */}
          <fieldset className="form-section" disabled={loading} style={{ border: 0, marginBottom: 24 }}>
            <legend>Datos del Paciente</legend>
            <Box display="grid" gap={2}>
              <TextField
                id="paciente-nombre"
                label="Nombre del paciente"
                value={patientData.nombre}
                onChange={(e) => setPatientData({ ...patientData, nombre: e.target.value })}
                required
              />
              <TextField
                id="paciente-apellido"
                label="Apellido del paciente"
                value={patientData.apellido}
                onChange={(e) => setPatientData({ ...patientData, apellido: e.target.value })}
                required
              />
              <TextField
                id="paciente-dni"
                label="DNI (8 dígitos)"
                inputProps={{ maxLength: 8 }}
                value={patientData.dni}
                onChange={(e) => setPatientData({ ...patientData, dni: e.target.value })}
                required
              />
              <FormControl required>
                <InputLabel id="paciente-genero-label">Género</InputLabel>
                <Select
                  labelId="paciente-genero-label"
                  id="paciente-genero"
                  value={patientData.genero}
                  label="Género"
                  onChange={(e) => setPatientData({ ...patientData, genero: e.target.value })}
                >
                  <MenuItem value="">Seleccione...</MenuItem>
                  <MenuItem value="true">Masculino</MenuItem>
                  <MenuItem value="false">Femenino</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="paciente-fecha-nacimiento"
                label="Fecha de Nacimiento"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={patientData.fechaNacimiento}
                onChange={(e) => setPatientData({ ...patientData, fechaNacimiento: e.target.value })}
                required
              />
              <FormControl required>
                <InputLabel id="paciente-nivel-autismo-label">Nivel de Autismo</InputLabel>
                <Select
                  labelId="paciente-nivel-autismo-label"
                  id="paciente-nivel-autismo"
                  value={patientData.nivelAutismo}
                  label="Nivel de Autismo"
                  onChange={(e) => setPatientData({ ...patientData, nivelAutismo: e.target.value })}
                >
                  <MenuItem value="">Seleccione...</MenuItem>
                  <MenuItem value="Leve">Leve</MenuItem>
                  <MenuItem value="Moderado">Moderado</MenuItem>
                  <MenuItem value="Grave">Grave</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </fieldset>

          {/* BOTONES */}
          <Box className="registro-actions" display="flex" gap={2}>
            <Button type="button" variant="outlined" color="secondary" disabled={loading}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Paciente'}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
}
