import { asset } from './assets'
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
  return asset(`assets/ranked/crest/${RANKS[rango].slug}.svg`)
}

/**
 * Emblema grande de rango: la pieza de arte que el cliente dibuja a un palmo
 * bajo la cifra "5V5 FLEXIBLE" de la ficha. En el cliente son composiciones de
 * 1280x720 (algunas 2560x1440) con el escudo diminuto en el centro; aqui estan
 * ya recortados al alfa del escudo, asi que basta con mostrarlos a tamano.
 */
export function rankEmblem(rango: Rango): string {
  return asset(`assets/ranked/emblem/emblem-${RANKS[rango].slug}.png`)
}

/** Marco hexagonal del perfil, dibujado sobre el icono de cuenta. */
export const PROFILE_FRAME = asset('assets/ranked/frame/ranked-emblem.png')

/** Marco sin rango, para cuando la cuenta todavia no tiene insignia. */
export const PROFILE_FRAME_NEUTRAL = asset('assets/ranked/frame/ranked-crest-placeholder.png')

/** Listones de la ficha del jugador en el lobby. */
export const MEMBER_BANNER = asset('assets/ranked/frame/member-banner.png')

/**
 * Icono de cuenta del jugador. Es una pieza real del cliente (los profile-icon
 * del juego de datos), no la insignia de rango: tanto la ficha como la barra
 * superior repiten el mismo retrato de la sesion.
 */
export function profileIcon(id: number): string {
  return asset(`assets/icons/profile/${id}.jpg`)
}

/**
 * Retrato de la cuenta: el mismo archivo en la ficha y en la barra superior.
 * Es el profile-icon 26 del juego de datos, el que lleva esta sesion.
 */
export const PLAYER_ICON = profileIcon(26)
