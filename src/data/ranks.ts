import type { Rango } from './types'

/**
 * El cliente guarda los emblemas de rango con nombre ingles (emblem-emerald.png)
 * mientras la interfaz esta en espanol. Este mapa es el unico punto donde se
 * resuelve esa diferencia.
 *
 * Las insignias son los mini crests: vectores de 20x20 que el cliente escala
 * junto al nivel de cuenta. Los emblemas de ranked-emblem/ son composiciones de
 * 1280x720 con el escudo diminuto al centro, utiles como marco, no como icono.
 */
export const RANKS: Record<Rango, { slug: string; label: string }> = {
  hierro: { slug: 'iron', label: 'Hierro' },
  bronce: { slug: 'bronze', label: 'Bronce' },
  plata: { slug: 'silver', label: 'Plata' },
  oro: { slug: 'gold', label: 'Oro' },
  platino: { slug: 'platinum', label: 'Platino' },
  esmeralda: { slug: 'emerald', label: 'Esmeralda' },
  diamante: { slug: 'diamond', label: 'Diamante' },
}

export const RANK_ORDER: Rango[] = [
  'hierro',
  'bronce',
  'plata',
  'oro',
  'platino',
  'esmeralda',
  'diamante',
]

export function rankSlug(rango: Rango): string {
  return RANKS[rango].slug
}

export function rankLabel(rango: Rango): string {
  return RANKS[rango].label
}

/** Insignia de rango junto al nivel, como en la barra superior. */
export function crestPath(rango: Rango): string {
  return `/assets/ranked/crest/${RANKS[rango].slug}.svg`
}

export const UNRANKED_CREST = '/assets/ranked/crest/unranked.svg'

/** Marco hexagonal del perfil, dibujado sobre el icono de cuenta. */
export const PROFILE_FRAME = '/assets/ranked/frame/ranked-emblem.png'

/** Marco sin rango, para cuando la cuenta Todavia no tiene insignia. */
export const PROFILE_FRAME_NEUTRAL = '/assets/ranked/frame/ranked-crest-placeholder.png'

/** Listones de la ficha del jugador en el lobby. */
export const MEMBER_BANNER = '/assets/ranked/frame/member-banner.png'
