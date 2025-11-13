  # Clinica Frontend (React + TypeScript + Vite)

  Guía rápida para colaboradores — qué hacer después de clonar este repositorio.

  Requisitos mínimos
  - Node.js (recomendado >= 16)
  - npm (incluido con Node)

  Pasos para arrancar localmente

  1. Clonar el repositorio y entrar en la carpeta del proyecto:

  ```powershell
  git clone https://github.com/ianbazan/Clinica_FRONT.git
  cd Clinica_front
  ```

  2. Instalar dependencias:

  ```powershell
  npm install
  ```

  3. Levantar el servidor de desarrollo:

  ```powershell
  npm run dev
  ```

  4. Abrir la aplicación en el navegador en la URL que muestre Vite (por defecto http://localhost:5173).

  Notas útiles
  - Si usas PowerShell y ves un error por ejecución de scripts, puedes permitir ejecuciones para tu usuario con este comando (opcional y seguro):

  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
  ```

  - Para pruebas rápidas en la UI hay botones en la cabecera para seleccionar un rol (Admin / Psicologo / Operadora). Selecciona un rol y navega a las páginas protegidas como "Calendario" o "Registro de cita".

  - La rama principal del repositorio es `main`.

  Estructura y desarrollo
  - El frontend está hecho con Vite + React + TypeScript.
  - Páginas importantes ya implementadas (placeholders y mocks):
    - Registro de cita
    - Historial clínico
    - Gestor de empleados
    - Gestión de terapias
    - Calendario (vista mensual + modal de citas)

  Contribuir
  - Crea una rama nueva para tu feature: `git checkout -b feature/nombre`.
  - Haz commits pequeños y descriptivos.
  - Empuja tu rama al remote y abre un Pull Request.

  Problemas comunes
  - Si encuentras errores de tipos o falta de paquetes, ejecuta `npm install` y reinicia el servidor.
  - Si algo no carga en la UI, abre la consola del navegador (F12) y pega aquí los errores.

  Contacto
  - Si tienes dudas, abre un issue en el repo o pregúntame directamente.

  Gracias — ¡vamos a construir una clínica genial! 👩‍⚕️👨‍⚕️
