import { useCallback, useEffect, useRef, useState } from 'react'
import { play } from '../data/audio'

export type Route = 'inicio' | 'jugar' | 'perfil' | 'coleccion' | 'artesania'

const ROUTES: Route[] = ['inicio', 'jugar', 'perfil', 'coleccion', 'artesania']

function readHash(): { route: Route; param?: string } {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [route = '', param] = raw.split('/')
  return {
    route: (ROUTES as string[]).includes(route) ? (route as Route) : 'inicio',
    param: param || undefined,
  }
}

export function useHashRoute() {
  const [state, setState] = useState(readHash)

  useEffect(() => {
    const onChange = () => setState(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((route: Route, param?: string) => {
    window.location.hash = param ? `#/${route}/${param}` : `#/${route}`
  }, [])

  return { route: state.route, param: state.param, navigate }
}

/**
 * Reproduce el sonido de carga de pagina una vez por ruta,
 * igual que el cliente al cambiar de seccion.
 */
export function usePageSound(route: string) {
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    void play('page')
  }, [route])
}
