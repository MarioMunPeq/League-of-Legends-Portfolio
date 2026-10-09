import { renderToString } from 'react-dom/server'
import { Root } from './root'

/*
 * Entrada de SOLO build. Serializa el arbol a HTML para que `vite.config.ts`
 * lo inyecte dentro de `<div id="root">`.
 *
 * No se importa desde `main.tsx` a proposito: ese es el bundle del navegador y
 * arrastrarla aqui meteria `react-dom/server` en el paquete que descarga cada
 * visitante, que pesa y no se usa para nada en el cliente.
 */
export function render(): string {
  return renderToString(<Root />)
}
