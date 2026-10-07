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
  /**
   * El cliente separa con un filete de oro el grupo de TFT del resto de modos.
   * Solo lo lleva el ultimo de la lista.
   */
  separado?: boolean
}

/**
 * Los modos de partida que ofrece el portfolio, en el mismo orden y con las
 * mismas etiquetas que el carrusel del cliente. Todos acaban en la coleccion de
 * campeones: lo que cambia es como se recorre. La tupla con cabeza obliga a que
 * la lista no este vacia, que es lo que hace el codigo al tomar el primero.
 */
export const MODOS: readonly [Modo, ...Modo[]] = [
  {
    id: 'flex',
    jugadores: '5 vs. 5',
    titulo: 'Grieta del Invocador',
    descripcion:
      'La partida de siempre, con la libertad de llevar el campeón que quieras en cualquier posición. Elige tu proyecto y ábrelo: cada campeón de la colección es un trabajo con su repositorio, su demo y sus decisiones.',
    icono: asset('assets/ui/modes/mode-flex.svg'),
    etapas: ['Elegir campeón', 'Ver proyecto', 'Demo y repositorio'],
  },
  {
    id: 'classic',
    jugadores: '5 vs. 5',
    titulo: 'Grieta Classic',
    descripcion:
      'La temporada original, tal y como entró en la carpeta: los proyectos antes de las reescrituras, con el stack de la primera versión y el historial de cambios a la vista.',
    icono: asset('assets/ui/modes/mode-classic.svg'),
    etapas: ['Elegir campeón', 'Primera versión', 'Historial'],
  },
  {
    id: 'aram',
    jugadores: '5 vs. 5',
    titulo: 'ARAM',
    descripcion:
      'Un solo mapa, un solo objetivo y ningún rol que respetar. La versión corta del portfolio: la misma colección de campeones, abierta sin rodeos y con las cifras de cada proyecto a un clic.',
    icono: asset('assets/ui/modes/mode-aram.svg'),
    etapas: ['Elegir campeón', 'Ver proyecto', 'Fijar como destacado'],
  },
  {
    id: 'arena',
    jugadores: '2 vs. 2',
    titulo: 'Arena',
    descripcion:
      'Parejas de proyectos que se sostienen mutuamente: dos piezas del mismo sistema, montadas para jugar juntas. Abre la pareja y compara cómo se reparten el trabajo.',
    icono: asset('assets/ui/modes/mode-arena.svg'),
    etapas: ['Elegir pareja', 'Ver los dos', 'Comparar'],
  },
  {
    id: 'tft',
    jugadores: 'TCT',
    titulo: 'Teamfight Tactics',
    descripcion:
      'El tablero completo: los diez proyectos alineados por rol, con la hoja de ruta y las cifras globales del portfolio a la vista.',
    icono: asset('assets/ui/modes/mode-tft.svg'),
    etapas: ['Ver tablero', 'Reparto de roles', 'Hoja de ruta'],
    separado: true,
  },
]

export const modoPorId = (id: string | null) => MODOS.find((m) => m.id === id)