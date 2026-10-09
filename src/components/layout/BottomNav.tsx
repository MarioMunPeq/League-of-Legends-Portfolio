import { Icon } from '../ui/Icon'
import { useAudio, useButtonSound } from '../../hooks/useAudio'
import type { Route } from '../../hooks/useHashRoute'
/* La hoja de estilos la carga App.tsx, que es donde se decide su orden. */

/**
 * Barra de navegacion inferior. Solo existe en movil (hasta 767 px): a partir de
 * ahi la resuelven la barra superior del cliente y el panel social, que en
 * escritorio tienen mucho mas sitio que en la palma de la mano.
 *
 * En movil la barra de arriba se queda sin secciones (no caben) y la del
 * cliente esta pensada para raton, asi que la navegacion se baja al borde
 * inferior, que es donde llega el pulgar.
 *
 * Son cuatro, no cinco: Jugar no se repite porque la placa de la barra
 * superior ya lleva ahi, y en vertical queda justo encima del pulgar, a un
 * tap. Dos caminos a la misma pantalla en el mismo sitio era ruido.
 *
 * El icono va con `Mask`-style: glifo monocromo y lo pone el color del estado,
 * igual que los iconos de la barra social del cliente.
 */
const SECCIONES: { route: Route; label: string; glifo: Parameters<typeof Icon>[0]['name'] }[] = [
  { route: 'inicio', label: 'Inicio', glifo: 'home' },
  { route: 'coleccion', label: 'Coleccion', glifo: 'collection' },
  { route: 'artesania', label: 'Artesania', glifo: 'loot' },
  { route: 'perfil', label: 'Perfil', glifo: 'profile' },
]

type Props = {
  route: Route
  onNavigate: (route: Route) => void
}

export function BottomNav({ route, onNavigate }: Props) {
  const { play } = useAudio()
  const sound = useButtonSound('grid')

  return (
    <nav className="botnav" aria-label="Secciones">
      {SECCIONES.map((s) => {
        const activo = route === s.route
        return (
          <button
            key={s.route}
            type="button"
            className={`botnav__item${activo ? ' botnav__item--activo' : ''}`}
            aria-current={activo ? 'page' : undefined}
            onClick={() => {
              play('nav-click')
              onNavigate(s.route)
            }}
            {...sound}
          >
            <span className="botnav__icon" aria-hidden="true">
              <Icon name={s.glifo} size={22} />
            </span>
            <span className="botnav__label">{s.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
