import React, { useState } from 'react'
import { Box, Button, TextField, Typography, Paper, Alert, CircularProgress, Checkbox, FormControlLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../api/authApi'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [guardianDni, setGuardianDni] = useState('')
  const [guardianName, setGuardianName] = useState('')
  const [guardianLastName, setGuardianLastName] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validate = () => {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Ingrese un email válido.')
      return false
    }
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return false
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return false
    }
    if (!/^[0-9]{8}$/.test(guardianDni)) {
      setError('El DNI del tutor debe tener 8 dígitos.')
      return false
    }
    if (!guardianName || !guardianLastName) {
      setError('Ingrese nombre y apellido del tutor.')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        user: { email, password, isActive },
        guardian: { dni: guardianDni, name: guardianName, lastName: guardianLastName },
      }
      await registerUser(payload)
      navigate('/login')
    } catch (err: any) {
      const { format } = await import('../hooks/useApiError')
      setError(format(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper elevation={3} sx={{ width: 480, p: 4 }}>
        <Typography variant="h5" color={'primary'} align="center" gutterBottom>
          Registro de Usuario
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} disabled={loading} />
          <TextField label="Contraseña" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
          <TextField label="Confirmar contraseña" type="password" fullWidth margin="normal" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={loading} />

          <Typography variant="h6" sx={{ mt: 2 }}>Datos del tutor</Typography>
          <TextField label="DNI" fullWidth margin="normal" inputProps={{ maxLength: 8, inputMode: 'numeric', pattern: '[0-9]*' }} value={guardianDni} onChange={e => setGuardianDni(e.target.value.replace(/\D/g, '').slice(0,8))} disabled={loading} />
          <TextField label="Nombre" fullWidth margin="normal" value={guardianName} onChange={e => setGuardianName(e.target.value)} disabled={loading} />
          <TextField label="Apellido" fullWidth margin="normal" value={guardianLastName} onChange={e => setGuardianLastName(e.target.value)} disabled={loading} />

          <FormControlLabel control={<Checkbox checked={isActive} onChange={e => setIsActive(e.target.checked)} />} label="Usuario activo" />

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={loading} startIcon={loading ? <CircularProgress size={18} /> : undefined}>
            {loading ? 'Creando...' : 'Crear cuenta'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
