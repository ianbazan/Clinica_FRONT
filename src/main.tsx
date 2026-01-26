import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import emailjs from '@emailjs/browser'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Inicializar EmailJS si se proporcionó la clave pública en las env vars de Vite
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_USER_ID || import.meta.env.VITE_EMAILJS_PUBLIC_KEY
if (EMAILJS_PUBLIC_KEY) {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY)
    // console.info('EmailJS initialized')
  } catch (e) {
    // initialization error will be visible en consola
    console.warn('EmailJS init failed', e)
  }
} else {
  // Not initialized — email send will fail with explicit error from EmailJS
  console.warn('EmailJS public key not found. Set VITE_EMAILJS_USER_ID or VITE_EMAILJS_PUBLIC_KEY in .env')
}

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
