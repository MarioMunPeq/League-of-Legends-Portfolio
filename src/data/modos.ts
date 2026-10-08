import { asset } from './assets'

export type Modo = {
  id: string
  /** etiqueta corta sobre el título, como el "5 vs. 5" o el "TCT" del cliente */
  jugadores: string
  titulo: string
  descripcion: string
  icono: string
  /** cifras del panel lateral de la pantalla */
  etapas: string[]
}

/**
 * Los dos modos de partida que ofrece el portfolio. El resto de modos del
 * cliente se omiten a proposito: no llevan a ninguna parte. Los iconos son los
 * emblemas reales del carrusel, recortados de una captura del propio cliente.
 * La tupla con cabeza obliga a que la lista no este vacia, que es lo que hace
 * el codigo al tomar el primero.
 */
export const MODOS: readonly [Modo, Modo] = [
  {
    id: 'flex',
    jugadores: '5 vs. 5',
    titulo: 'Grieta del Invocador',
    descripcion:
      'La partida de siempre, con la libertad de llevar el campeón que quieras en cualquier posición. Elige tu proyecto y ábrelo: cada campeón de la colección es un trabajo con su repositorio, su demo y sus decisiones.',
    icono: asset('assets/ui/modes/mode-flex.png'),
    etapas: ['Elegir campeón', 'Ver proyecto', 'Demo y repositorio'],
  },
  {
    id: 'aram',
    jugadores: '5 vs. 5',
    titulo: 'ARAM',
    descripcion:
      'Un solo mapa, un solo objetivo y ningún rol que respetar. La versión corta del portfolio: la misma colección de campeones, abierta sin rodeos y con las cifras de cada proyecto a un clic.',
    icono: asset('assets/ui/modes/mode-aram.png'),
    etapas: ['Elegir campeón', 'Ver proyecto', 'Fijar como destacado'],
  },
]

export const modoPorId = (id: string | null) => MODOS.find((m) => m.id === id)