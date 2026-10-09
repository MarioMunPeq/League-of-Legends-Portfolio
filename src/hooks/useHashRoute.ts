import { useCallback, useEffect, useState } from 'react'

export type Route = 'inicio' | 'jugar' | 'perfil' | 'coleccion' | 'artesania'

const ROUTES: Route[] = ['inicio', 'jugar', 'perfil', 'coleccion', 'artesania']

/**
 * El navegador guarda el hash con los espacios escapados, asi que un grupo como
 * `Herramientas y calidad` llega como `Herramientas%20y%20calidad`. Sin
 * descifrar no casaria nunca con su nombre. Se protege el caso de un hash mal
 * formado (un `%` suelto hace lanzar a `decodeURIComponent`).
 */
function descifrar(segmento: string | undefined): string | undefined {
  if (!segmento) return undefined
  try {
    return decodeURIComponent(segmento) || undefined
  } catch {
    return segmento
  }
}

type RouteState = { route: Route; param?: string }

function readHash(): RouteState {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [ruta = '', param] = raw.split('/')
  return {
    route: (ROUTES as string[]).includes(ruta) ? (ruta as Route) : 'inicio',
    param: descifrar(param),
  }
}

/**
 * Estado inicial compartido por el servidor y el primer render del cliente.
 *
 * No se lee el hash aqui a proposito. El HTML pre-renderizado siempre muestra
 * `inicio`, asi que si el cliente arrancara leyendo `window.location.hash` una
 * visita a `#/perfil` hydrataria contra un arbol distinto y React lo
 * reconstruiria entero (con el aviso de desajuste en consola). Arrancando
 * siempre en `inicio` la hydratacion es exacta y el enlace profundo se
 * corrige en el efecto de abajo, antes de que llegue a pintar nada.
 */
const INICIO: RouteState = { route: 'inicio' }

export function useHashRoute() {
  const [state, setState] = useState(INICIO)

  useEffect(() => {
    const onChange = () => setState(readHash())
    // Se lee una vez al montar: entra aqui la visita con enlace profundo, que
    // el HTML pre-renderizado no puede conocer.
    onChange()
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((route: Route, param?: string) => {
    window.location.hash = param ? `#/${route}/${param}` : `#/${route}`
  }, [])

  return { route: state.route, param: state.param, navigate }
}
