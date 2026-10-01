export const DDRAGON_VERSION = '16.19.1'
export const DDRAGON = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`
export const DDRAGON_UNVERSIONED = 'https://ddragon.leagueoflegends.com/cdn'

export const CD = 'https://raw.communitydragon.org/latest'
export const CD_UI = `${CD}/plugins/rcp-fe-lol-static-assets/global/default`
export const CD_UKIT = `${CD}/plugins/rcp-fe-lol-uikit/global/default`
export const CD_GAME_DATA = `${CD}/plugins/rcp-be-lol-game-data/global/default/v1`
export const CD_FONTS = `${CD}/game/assets/ux/fonts`

export const RANKS = [
  'iron',
  'bronze',
  'silver',
  'gold',
  'platinum',
  'emerald',
  'diamond',
  'master',
  'grandmaster',
  'challenger',
]

/**
 * Insignias de rango. Ojo: ranked-emblem/emblem-<rank>.png son composiciones de
 * 1280x720 con el escudo diminuto en el centro; sirven de fondo, no de icono.
 * Para la insignia que va junto al nivel usamos los mini crests, vectores
 * limpios de 20x20 que el cliente escala.
 */
export const MINI_CRESTS = [
  'unranked',
  'iron',
  'bronze',
  'silver',
  'gold',
  'platinum',
  'emerald',
  'diamond',
  'master',
  'grandmaster',
  'challenger',
]

export const RUNE_STYLES = [
  'domination',
  'precision',
  'sorcery',
  'inspiration',
  'resolve',
]

export const RUNE_TREES = [
  '7200_domination',
  '7201_precision',
  '7202_sorcery',
  '7203_whimsy',
  '7204_resolve',
]

export const RUNE_KEYS = [
  ['domination', 'electrocute'],
  ['domination', 'predator'],
  ['domination', 'darkharvest'],
  ['domination', 'treasurehunter'],
  ['domination', 'suddenimpact'],
  ['precision', 'presstheattack'],
  ['precision', 'conqueror'],
  ['precision', 'coupdegrace'],
  ['precision', 'legendalacrity'],
  ['sorcery', 'summonaery'],
  ['sorcery', 'arcanecomet'],
  ['sorcery', 'scorch'],
  ['sorcery', 'gatheringstorm'],
  ['sorcery', 'transcendence'],
  ['inspiration', 'firststrike'],
  ['inspiration', 'unsealedspellbook'],
  ['inspiration', 'celestialbody'],
  ['inspiration', 'hextechflashtraption'],
  ['resolve', 'guardian'],
  ['resolve', 'boneplating'],
  ['resolve', 'mirrorshell'],
  ['resolve', 'overgrowth'],
  ['resolve', 'veteranaftershock'],
]

export const RUNE_FILENAME_OVERRIDES = {
  lethaltempo: 'lethaltempotemp',
  jackofalltrades: 'jackofalltrades2',
}

export const PROFILE_ICONS = [1, 12, 26, 588, 1013, 1420, 3008, 5886]

export const ITEM_IDS = [
  1001, 3009, 3117, 3158, 2502, 2504, 3004, 3011, 3033, 3053, 3068, 3071, 3078,
  3087, 3089, 3107, 3116, 3119, 3124, 3146, 3152, 3181, 3190, 3193, 3302, 3504,
  3742, 4401, 4402, 4633, 4646, 6617, 6630, 6632, 6653, 6660, 6672, 6675, 6694,
]

export const SUMMONER_SPELLS = [
  'SummonerFlash',
  'SummonerHeal',
  'SummonerBarrier',
  'SummonerSmite',
  'SummonerExhaust',
  'SummonerTeleport',
  'SummonerDot',
  'SummonerSnowball',
  'SummonerMana',
  'SummonerHaste',
]
