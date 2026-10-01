/**
 * Resuelve una ruta dentro de public/ para que funcione tanto en dev como en
 * GitHub Pages, que sirve el proyecto bajo /<nombre-del-repo>/.
 *
 * Vite solo reescribe las rutas que ve en los imports y en el CSS: las
 * cadenas construidas en JS ("/assets/...") llegan al navegador tal cual y
 * darian 404 con un subdirectorio. Todo lo dinamico pasa por aqui.
 */
const BASE = import.meta.env.BASE_URL || '/'

export function asset(path: string): string {
  const clean = path.replace(/^\/+/, '')
  return BASE.endsWith('/') ? `${BASE}${clean}` : `${BASE}/${clean}`
}

/** Paths de una pieza de campeon: square para la grilla, splash para el fondo. */
export const champSquare = (name: string) => asset(`assets/champions/square/${name}.png`)
export const champSplash = (name: string) => asset(`assets/champions/splash/${name}.jpg`)
export const champSpell = (file: string) => asset(`assets/spells/${file}`)
export const champPassive = (file: string) => asset(`assets/passives/${file}`)