import { StrictMode } from 'react'
import App from './App'

/**
 * El arbol exacto que monta el navegador.
 *
 * Vive aparte porque ahora lo consumen DOS entradas: `main.tsx` (hidrata en el
 * navegador) y `entry-prerender.tsx` (lo serializa en Node durante el build).
 * Si cada una compusiera su propia version, el HTML pre-renderizado y el
 * primer render del cliente podrian divergir y la hidratacion fallaria:
 * React veria otro arbol, lo reconstruiria entero y avisaria por consola.
 */
export function Root() {
  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}
