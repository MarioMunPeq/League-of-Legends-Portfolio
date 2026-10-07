export const DDRAGON_VERSION = '16.19.1'
export const DDRAGON = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`
export const DDRAGON_UNVERSIONED = 'https://ddragon.leagueoflegends.com/cdn'

export const CD = 'https://raw.communitydragon.org/latest'
export const CD_UI = `${CD}/plugins/rcp-fe-lol-static-assets/global/default`
export const CD_UKIT = `${CD}/plugins/rcp-fe-lol-uikit/global/default`
export const CD_GAME_DATA = `${CD}/plugins/rcp-be-lol-game-data/global/default/v1`
export const CD_FONTS = `${CD}/game/assets/ux/fonts`
export const CD_NAV = `${CD}/plugins/rcp-fe-lol-navigation/global/default`
export const CD_SOCIAL = `${CD}/plugins/rcp-fe-lol-social/global/default`
export const CD_LOOT = `${CD}/plugins/rcp-fe-lol-loot/global/default`

/**
 * Iconos de navegacion del cliente, por seccion del portfolio. Son los mismos
 * archivos que carga la League: `nav-icon-profile` para la ficha,
 * `nav-icon-collections` para la coleccion de campeones, `nav-icon-loot` para
 * la armeria y `nav-icon-store` para la tienda.
 */
export const NAV_ICONS = ['collections', 'loot', 'profile', 'store']

/**
 * Mascaras del panel social. El cliente las pinta como `mask-image`, no como
 * `<img>`, para que el icono tome el color del texto que tiene encima.
 */
export const SOCIAL_MASKS = [
  'add_person_mask.png',
  'add_folder_mask.png',
  'sort_mask.png',
  'search_mask.png',
  'mute_mask.png',
  'check_mask.png',
  'person_mask.png',
]

/** Iconos vectoriales del panel social, que ya traen su propio color. */
export const SOCIAL_SVGS = ['message-mask.svg', 'profile-mask.svg', 'party-invite-mask.svg', 'ring.svg']

/** Logo de League: la placa de la izquierda de la barra superior. */
export const LEAGUE_LOGO = [
  'activity-center/league-logo-rest.svg',
  'activity-center/league-logo-hover.svg',
  'activity-center/league-logo-active.svg',
]

/** Boton de buscar partida (CONFIRMAR) de la pantalla de modos. */
export const FIND_MATCH = [
  'find_match_default.png',
  'find_match_hover.png',
  'find_match_active.png',
]

/** Anillo de nivel de la ficha de jugador. */
export const LEVEL_RING = [
  'theme-1-ring.png',
  'theme-1-simplified-border.png',
  'theme-1-solid-border.png',
]

/**
 * Iconos de categoria de la armeria. Son los mismos que usa la pantalla de
 * artesanado del cliente: MATERIALES es `all`, CAMPEONES es `champion`,
 * ASPECTOS es `skin`, EFIGIES es `eternals` y EMOTICONOS es `emote`.
 */
export const LOOT_CATEGORIES = [
  'all',
  'champion',
  'chest',
  'companion',
  'emote',
  'eternals',
  'skin',
  'summonericon',
  'wardskin',
]

/** Cristales de rareza de maestria, uno por nivel de la ficha de campeon. */
export const RARITY_ICONS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * Iconos de interfaz que sustituyen a los que estaban dibujados a mano: los
 * de ajustes, cerrar,ayuda y recargar salen de uikit y de los hextech.
 */
export const UIKIT_ICONS = [
  'icon_settings.png',
  'icon_add.png',
  'icon_plus.png',
  'icon_clearall.png',
  'x-icon.png',
  'close.png',
  'refresh.png',
  'caret.png',
  'preview.svg',
  'play-video.svg',
]

/**
 * Marcos de gema de la coleccion de campeones. El cliente engarza cada ficha
 * con una gema distinta segun el nivel de maestria; el marco lo aporta el
 * cliente y dentro va el retrato del campeon.
 */
export const GEM_BORDERS = [
  'knorarity',
  '1',
  '2',
  '4',
  '5',
  '6',
  '7',
  '9',
  'kepic',
  'klegendary',
  'kmythic',
  'kultimate',
  'kexalted',
  'ktranscendent',
]

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

/**
 * Emblema grande de rango: el que el cliente dibuja a un palmo bajo la cifra
 * "5V5 FLEXIBLE" de la ficha. A diferencia de los mini crests, este si es una
 * pieza de arte con relieve y brillo, y es la que se ve en la captura.
 */
export const RANK_EMBLEMS = [
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
