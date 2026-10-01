import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// GitHub Pages sirve el proyecto bajo /<nombre-del-repo>/. Con las rutas
// absolutas de /assets el build local funciona pero en Pages daria 404, asi
// que base lleva el prefijo del despliegue. Para servirlo en otro sitio,
// cambiar el valor (o pasarlo por --base en el build).
const REPO = 'League-of-Legends-Portfolio'

export default defineConfig({
  base: `/${REPO}/`,
  plugins: [react()],
})
