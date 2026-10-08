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
 * bajo la cifra "5V5 FLEXIBLE" de la ficha. Son composiciones de 1280x720 (algunas
 * 2560x1440) con el escudo en el centro, asi que hay que recortarlo con
 * `object-fit` sobre un lienzo cuadrado o se veria el marco entero.
 */
export function rankEmblem(rango: Rango): string {
  return asset(`assets/ranked/emblem/emblem-${RANKS[rango].slug}.png`)
}

/**
 * El emblema viene en un lienzo mucho mayor que el escudo que contiene. Estos
 * son los factores con los que hay que encogerlo para que el escudo, y no el
 * fondo, sea lo que ocupa la caja; se midieron sobre el alfa de cada PNG.
 */
export const EMBLEM_CROP: Record<string, number> = {
  iron: 0.15,
  bronze: 0.178,
  silver: 0.202,
  gold: 0.197,
  platinum: 0.204,
  emerald: 0.223,
  diamond: 0.234,
  master: 0.23,
  grandmaster: 0.239,
  challenger: 0.244,
  unranked: 0.2,
}

export function emblemCrop(rango: Rango): number {
  return EMBLEM_CROP[RANKS[rango].slug] ?? 0.2
}

/** Marco hexagonal del perfil, dibujado sobre el icono de cuenta. */
export const PROFILE_FRAME = asset('assets/ranked/frame/ranked-emblem.png')

/** Marco sin rango, para cuando la cuenta todavia no tiene insignia. */
export const PROFILE_FRAME_NEUTRAL = asset('assets/ranked/frame/ranked-crest-placeholder.png')

/** Listones de la ficha del jugador en el lobby. */
export const MEMBER_BANNER = asset('assets/ranked/frame/member-banner.png')

/**
 * Icono de cuenta del jugador. Es una pieza real del cliente (los profile-icon
 * del juego de datos), no la insignia de rango: la ficha muestra el retrato de
 * la cuenta dentro del marco, no un escudo.
 */
export function profileIcon(id: number): string {
  return asset(`assets/icons/profile/${id}.jpg`)
}
