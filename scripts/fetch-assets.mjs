import { mkdir, writeFile, readFile, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DDRAGON,
  DDRAGON_UNVERSIONED,
  CD_UI,
  CD_UKIT,
  CD_GAME_DATA,
  CD_FONTS,
  MINI_CRESTS,
  RUNE_STYLES,
  RUNE_TREES,
  RUNE_KEYS,
  RUNE_FILENAME_OVERRIDES,
  PROFILE_ICONS,
  ITEM_IDS,
  SUMMONER_SPELLS,
} from './assets.config.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'assets')
const MANIFEST = join(OUT, 'manifest.json')

const CHAMPIONS = [
  'Sett',
  'Gnar',
  'Mordekaiser',
  'Illaoi',
  'Yasuo',
  'Yone',
  'Ornn',
  'Gwen',
  'Malphite',
  'TahmKench',
]

/** Fondos de pantalla: los que la app usa como hero o portada del perfil. */
const HERO_SPLASH = ['Yasuo', 'Janna']

/**
 * Roster de relleno para la pantalla de seleccion: aparecen bloqueados,
 * como en el cliente, y dan cuerpo a la grilla sin ser proyectos.
 */
const EXTRA_CHAMPIONS = [
  'Akali',
  'Akshan',
  'Alistar',
  'Amumu',
  'Annie',
  'Aphelios',
  'Ashe',
  'AurelionSol',
  'Azir',
  'Bard',
  'Belveth',
  'Blitzcrank',
  'Braum',
  'Caitlyn',
  'Camille',
  'Cassiopeia',
  'Chogath',
  'Darius',
  'Diana',
  'Draven',
  'Ekko',
  'Elise',
  'Ezreal',
  'Fiddlesticks',
  'Fiora',
  'Fizz',
  'Galio',
  'Gangplank',
  'Garen',
  'Gragas',
  'Graves',
  'Hecarim',
  'Heimerdinger',
  'Illaoi',
  'Irelia',
  'Ivern',
  'Janna',
  'JarvanIV',
  'Jax',
  'Jayce',
  'Jhin',
  'Jinx',
  'Kaisa',
  'Karma',
  'Kayn',
  'Kennen',
  'Kindred',
  'Kled',
  'KSante',
  'Leblanc',
  'LeeSin',
  'Leona',
  'Lillia',
  'Lissandra',
  'Lucian',
  'Lulu',
  'Lux',
  'Malzahar',
  'Maokai',
  'MasterYi',
  'MissFortune',
  'Mordekaiser',
  'Morgana',
  'Nami',
  'Nasus',
  'Nautilus',
  'Neeko',
  'Nocturne',
  'Olaf',
  'Orianna',
  'Pantheon',
  'Poppy',
  'Pyke',
  'Qiyana',
  'Quinn',
  'Rakan',
  'Rammus',
  'RekSai',
  'Renekton',
  'Rengar',
  'Riven',
  'Rumble',
  'Ryze',
  'Samira',
  'Sejuani',
  'Senna',
  'Seraphine',
  'Shaco',
  'Shyvana',
  'Singed',
  'Sion',
  'Sivir',
  'Sona',
  'Soraka',
  'Swain',
  'Sylas',
  'Syndra',
  'Taliyah',
  'Talon',
  'Taric',
  'Teemo',
  'Thresh',
  'Tristana',
  'Trundle',
  'Tryndamere',
  'TwistedFate',
  'Twitch',
  'Udyr',
  'Urgot',
  'Varus',
  'Vayne',
  'Veigar',
  'Velkoz',
  'Vex',
  'Vi',
  'Viego',
  'Viktor',
  'Vladimir',
  'Volibear',
  'Warwick',
  'Xayah',
  'Xerath',
  'XinZhao',
  'Yorick',
  'Yuumi',
  'Zac',
  'Zed',
  'Zeri',
  'Ziggs',
  'Zilean',
  'Zoe',
  'Zyra',
]

/** Nombres que Data Dragon escribe pegados, con su forma legible. */
const DISPLAY_NAMES = {
  TahmKench: 'Tahm Kench',
  LeeSin: 'Lee Sin',
  MissFortune: 'Miss Fortune',
  KSante: "K'Sante",
  Nunu: 'Nunu & Willump',
  DrMundo: 'Dr. Mundo',
  RekSai: 'Rek\u2019Sai',
  VelKoz: "Vel'Koz",
}

const stats = { ok: 0, skipped: 0, failed: 0, bytes: 0 }
const failures = []
const manifest = {}

const exists = async (p) => {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function download(url, relPath, { force = false } = {}) {
  const dest = join(OUT, relPath)
  if (!force && (await exists(dest))) {
    stats.skipped++
    return dest
  }
  await mkdir(dirname(dest), { recursive: true })
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) {
    stats.failed++
    failures.push({ url, relPath, status: res.status })
    return null
  }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length === 0) {
    stats.failed++
    failures.push({ url, relPath, status: 'empty' })
    return null
  }
  await writeFile(dest, buf)
  stats.ok++
  stats.bytes += buf.length
  return dest
}

const group = (name) => {
  manifest[name] ??= []
  return manifest[name]
}

/**
 * Los splash pesan ~165 kB cada uno: con los 173直播间 serian 28 MB.
 * Solo se descargan los que la app usa de fondo (proyectos, portada, inicio);
 * para el resto alcanza con el icono cuadrado de la grilla de seleccion.
 */
const SPLASH_CHAMPIONS = [...new Set([...CHAMPIONS, ...HERO_SPLASH])]

async function fetchChampions() {
  const raw = await fetch(`${DDRAGON}/data/en_US/champion.json`)
  const all = (await raw.json()).data

  for (const name of [...CHAMPIONS, ...EXTRA_CHAMPIONS]) {
    const c = all[name]
    if (!c) {
      failures.push({ url: `champion:${name}`, relPath: '-', status: 'missing-from-ddragon' })
      stats.failed++
      continue
    }
    const detailRes = await fetch(`${DDRAGON}/data/en_US/champion/${name}.json`)
    const detail = (await detailRes.json()).data[name]

    // cuadrado: siempre, es la grilla de Seleccion (~27 kB)
    await download(`${DDRAGON}/img/champion/${name}.png`, `champions/square/${name}.png`)

    const conDetalle = CHAMPIONS.includes(name) || SPLASH_CHAMPIONS.includes(name)
    if (conDetalle) {
      await download(`${DDRAGON_UNVERSIONED}/img/champion/splash/${name}_0.jpg`, `champions/splash/${name}.jpg`)
      for (const spell of detail.spells ?? []) {
        const f = spell.image?.full
        if (f) await download(`${DDRAGON}/img/spell/${f}`, `spells/${f}`)
      }
      const passive = detail.passive?.image?.full
      if (passive) await download(`${DDRAGON}/img/passive/${passive}`, `passives/${passive}`)
    }

    group('champions').push({
      name,
      displayName: DISPLAY_NAMES[name] ?? name,
      key: c.key,
      title: detail.title ?? c.title,
      blurb: detail.blurb,
      tags: c.tags,
      info: c.info,
      hasSplash: SPLASH_CHAMPIONS.includes(name),
      spells: conDetalle
        ? (detail.spells ?? []).map((s) => ({
            name: s.name,
            description: s.description,
            icon: s.image?.full,
          }))
        : [],
      passive: conDetalle
        ? {
            name: detail.passive?.name,
            description: detail.passive?.description,
            icon: detail.passive?.image?.full,
          }
        : { name: '', icon: '', description: '' },
    })
  }
}

async function fetchRanked() {
  // insignias vectoriales: son las que se ven junto al nivel en la barra superior
  for (const rank of MINI_CRESTS) {
    await download(`${CD_UI}/ranked-mini-crests/${rank}.svg`, `ranked/crest/${rank}.svg`)
  }

  // emblemas grandes para el fondo de la ficha de perfil
  await download(`${CD_UI}/ranked-emblem.png`, `ranked/frame/ranked-emblem.png`)
  await download(`${CD_UI}/ranked_crest_placeholder.png`, `ranked/frame/ranked-crest-placeholder.png`)
  await download(`${CD_UI}/member-banner.png`, `ranked/frame/member-banner.png`)
  await download(`${CD_UI}/current-player-banner.png`, `ranked/frame/current-player-banner.png`)
  await download(`${CD_UI}/rank-notification.svg`, `ranked/rank-notification.svg`)
  await download(`${CD_UI}/division_icon_completed.png`, `ranked/division-completed.png`)
  await download(`${CD_UI}/division_icon_current.png`, `ranked/division-current.png`)
}

async function fetchMastery() {
  const files = [
    'mastery-mark.png',
    'mastery-mark-empty.png',
    'icon-mark-of-mastery.png',
    'background-mastery.png',
    'icon-mastery.svg',
    'mastery-icon.svg',
    'generic-mastery-icon.svg',
    'icon-legacy.svg',
  ]
  for (const f of files) {
    await download(`${CD_UI}/champion-mastery/${f}`, `mastery/${f}`)
  }
}

async function fetchUi() {
  const nav = ['collections', 'loot', 'profile', 'store']
  for (const n of nav) {
    await download(`${CD_UI}/nav-icon-${n}.svg`, `ui/nav/nav-icon-${n}.svg`)
  }

  const roles = ['jungle', 'support', 'role-swapping']
  for (const r of roles) {
    await download(`${CD_UI}/icons/blue-${r}-icon.svg`, `ui/roles/blue-${r}-icon.svg`)
  }

  const positions = ['top', 'jungle', 'middle', 'bottom', 'utility']
  for (const p of positions) {
    await download(`${CD_UI}/svg/position-${p}.svg`, `ui/roles/position-${p}.svg`)
    await download(`${CD_UI}/svg/position-${p}-light.svg`, `ui/roles/position-${p}-light.svg`)
  }

  const honor = ['cool', 'heart', 'shotcaller']
  for (const h of honor) {
    await download(`${CD_UI}/honor/${h}_miniicon.png`, `ui/honor/${h}-miniicon.png`)
    await download(`${CD_UI}/honor/${h}_selected.png`, `ui/honor/${h}-selected.png`)
    await download(`${CD_UI}/honor/${h}_unselected.png`, `ui/honor/${h}-unselected.png`)
  }

  const buttons = [
    'play-button-lobby-default.png',
    'play-button-lobby-hover.png',
    'play-button-lobby-pressed.png',
    'play-button-default.png',
    'play-button-hover.png',
    'play-button-pressed.png',
    'play-button-disabled.png',
    'play-button-frame-default.png',
    'play-button-frame-disabled.png',
    'button-accept-default.png',
    'button-accept-hover.png',
    'button-accept-disabled.png',
    'button-replay-normal.png',
    'button-replay-hover.png',
  ]
  for (const b of buttons) {
    await download(`${CD_UI}/${b}`, `ui/buttons/${b}`)
  }

  const chrome = [
    'x.png',
    'x_hover.png',
    'x_active.png',
    'spinner.png',
    'empty-icon.png',
    'empty_logo.png',
    'default-background.png',
    'vignette_background.png',
    'loading-bg.png',
    'magic-bg.jpg',
    'gradient_left.png',
    'gradient_right.png',
    'line-vertical-fade.png',
    'person_mask.png',
    'po-icon-helmet.png',
    'po-legacy-icon.png',
    'po-main-rule.png',
    'hover_bg.png',
    'splash-active.png',
    'splash-inactive.png',
    'video-active.png',
    'video-inactive.png',
    'icon-checkmark.png',
    'checkmark.svg',
    'close.svg',
    'check_mask.png',
    'progress-bar-back-plate.png',
  ]
  for (const c of chrome) {
    await download(`${CD_UI}/${c}`, `ui/chrome/${c}`)
  }

  const currency = [
    'icon-rp.png',
    'icon-rp-24.png',
    'icon-rp-32.png',
    'icon-rp-48.png',
    'icon-rp-72.png',
    'icon-rp-gradient-32.png',
    'icon-be-150.png',
    'icon-star-shards-36.png',
    'icon-star-shards-active-88.png',
    'currency-ip-mini.png',
    'two-tickets.svg',
  ]
  for (const c of currency) {
    await download(`${CD_UI}/${c}`, `ui/currency/${c}`)
  }

  const borders = [
    'sub-border-primary-horizontal.png',
    'sub-border-secondary-horizontal.png',
    'sub-border-primary-vertical.png',
    'sub-border-secondary-vertical.png',
    'nav-highlight.png',
    'nav-pointer.png',
    'title_divider.png',
    'sheen.png',
    'pip_done.png',
    'pip_selected.png',
    'pip_unfilled.png',
    'search-box-clear.png',
    'slider-btn.png',
    'dropdown-bg.png',
    'dropdown-border.png',
    'dropdown-check.png',
    'dropdown-select-dot.png',
    'caret.png',
    'arrow-right.png',
    'tooltip-caret.png',
    'tooltip-system-caret.png',
    'icon_add.png',
    'icon_back.png',
    'icon_next.png',
    'icon_edit.png',
    'info-icon.svg',
    'info-icon-hover.svg',
    'ellipses.svg',
  ]
  for (const b of borders) {
    await download(`${CD_UKIT}/images/${b}`, `ui/borders/${b}`)
  }

  const meters = [
    'empty-meter-blue.png',
    'full-meter-blue.png',
    'empty-meter-champion.png',
    'full-meter-champion.png',
    'empty-meter-white.png',
    'full-meter-white.png',
    'empty-meter-pink.png',
    'full-meter-pink.png',
  ]
  for (const m of meters) {
    await download(`${CD_UKIT}/images/${m}`, `ui/meters/${m}`)
  }

  await download(`${CD_UKIT}/main.css`, `ui/uikit-main.css`)
  await download(`${CD_UI}/hextech-ui-icons/question-mark.svg`, `ui/hextech/question-mark.svg`)
  await download(`${CD_UI}/hextech-ui-icons/lock-closed.svg`, `ui/hextech/lock-closed.svg`)
  await download(`${CD_UI}/hextech-ui-icons/clock.svg`, `ui/hextech/clock.svg`)
  await download(`${CD_UI}/empty_states/sleeping-poro.svg`, `ui/states/sleeping-poro.svg`)
  await download(`${CD_UI}/summoner-icon/summoner-icon-rare.png`, `ui/states/summoner-icon-rare.png`)
  await download(`${CD_UI}/backgrounds/sanctum-background.jpg`, `backgrounds/sanctum.jpg`)
  await download(`${CD_UI}/backgrounds/roll-vignette-background.jpg`, `backgrounds/roll-vignette.jpg`)
  await download(`${CD_UI}/ranked-intro-background.jpg`, `backgrounds/ranked-intro.jpg`)
}

async function fetchRunes() {
  for (const style of RUNE_STYLES) {
    await download(
      `${CD_GAME_DATA}/perk-images/styles/${style}/${style}_icon.svg`,
      `perks/styles/${style}.svg`,
    )
    await download(
      `${CD_GAME_DATA}/perk-images/styles/${style}/${style}_icon_16.svg`,
      `perks/styles/${style}-16.svg`,
    )
  }
  for (const tree of RUNE_TREES) {
    await download(`${CD_GAME_DATA}/perk-images/styles/${tree}.png`, `perks/trees/${tree}.png`)
  }
  for (const [style, key] of RUNE_KEYS) {
    const file = RUNE_FILENAME_OVERRIDES[key] ?? key
    await download(
      `${CD_GAME_DATA}/perk-images/styles/${style}/${key}/${file}.png`,
      `perks/runes/${key}.png`,
    )
  }
  await download(`${CD_GAME_DATA}/perk-images/styles/runesicon.png`, `perks/runesicon.png`)
  for (const s of SUMMONER_SPELLS) {
    await download(`${DDRAGON}/img/spell/${s}.png`, `spells/${s}.png`)
  }
}

async function fetchItems() {
  for (const id of ITEM_IDS) {
    await download(`${DDRAGON}/img/item/${id}.png`, `items/${id}.png`)
  }
}

async function fetchProfileIcons() {
  for (const id of PROFILE_ICONS) {
    await download(`${CD_GAME_DATA}/profile-icons/${id}.jpg`, `icons/profile/${id}.jpg`)
  }
  for (const id of PROFILE_ICONS) {
    await download(`${DDRAGON}/img/profileicon/${id}.png`, `icons/profileicon/${id}.png`)
  }
  for (const rarity of [0, 1, 2, 3, 4, 5, 6, 7]) {
    await download(`${CD_GAME_DATA}/rarity-gem-icons/${rarity}_large.png`, `icons/rarity/${rarity}.png`)
  }
}

async function fetchFonts() {
  const fonts = [
    'spiegel-regular.otf',
    'spiegel-semibold.otf',
    'spiegel-bold.otf',
    'spiegel-regularitalic.otf',
    'beaufortforlol-regular.otf',
    'beaufortforlol-bold.otf',
    'beaufortforlol-heavy.otf',
    'beaufortforlol-light.otf',
  ]
  for (const f of fonts) {
    await download(`${CD_FONTS}/${f}`, `fonts/${f}`)
  }
}

async function fetchSfx() {
  const sfx = [
    'sfx-uikit-button-gold-hover.ogg',
    'sfx-uikit-button-gold-click.ogg',
    'sfx-uikit-button-generic-hover.ogg',
    'sfx-uikit-button-generic-click.ogg',
    'sfx-uikit-grid-hover.ogg',
    'sfx-uikit-grid-click.ogg',
    'sfx-uikit-text-click-small.ogg',
    'sfx-uikit-button-pageup-click.ogg',
    'sfx-lobby-strawberry-button-main-click.ogg',
    'sfx-lobby-strawberry-page-load.ogg',
    'sfx-nav-button-play-hover.ogg',
    'sfx-nav-button-play-click.ogg',
    'sfx-regalia-lobby-visor-open.ogg',
    'sfx-regalia-lobby-visor-close.ogg',
    'sfx-profile-summoner-big-click.ogg',
  ]
  for (const s of sfx) {
    await download(`${CD_UI}/sounds/${s}`, `../audio/${s}`)
  }
}

/**
 * Convierte el manifiesto de campeones en un modulo TypeScript tipado,
 * de modo que la app no tenga que leer public/ en runtime.
 */
async function writeChampionsModule() {
  const stripHtml = (s) => (s ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  const rows = manifest.champions
    .slice()
    .sort((a, b) => Number(a.key) - Number(b.key))
    .map((c) => {
      const spells = c.spells.map((s) => ({
        name: s.name,
        icon: s.icon,
        description: stripHtml(s.description),
      }))
      return [
        `  {`,
        `    name: ${JSON.stringify(c.name)},`,
        `    displayName: ${JSON.stringify(c.displayName)},`,
        `    key: ${JSON.stringify(c.key)},`,
        `    title: ${JSON.stringify(c.title)},`,
        `    blurb: ${JSON.stringify(stripHtml(c.blurb))},`,
        `    tags: ${JSON.stringify(c.tags)},`,
        `    info: ${JSON.stringify(c.info)},`,
        `    hasSplash: ${c.hasSplash === true},`,
        `    passive: {`,
        `      name: ${JSON.stringify(c.passive?.name ?? '')},`,
        `      icon: ${JSON.stringify(c.passive?.icon ?? '')},`,
        `      description: ${JSON.stringify(stripHtml(c.passive?.description))},`,
        `    },`,
        `    spells: ${JSON.stringify(spells, null, 6).replace(/\n/g, '\n    ')},`,
        `  },`,
      ].join('\n')
    })

  const out = `// Generado por scripts/fetch-assets.mjs. No editar a mano.
import type { Champ } from './types'

export const CHAMPS: Champ[] = [
${rows.join('\n')}
]

export const CHAMPS_BY_NAME = new Map(CHAMPS.map((c) => [c.name, c]))

export function getChamp(name: string): Champ | undefined {
  return CHAMPS_BY_NAME.get(name)
}
`
  await writeFile(join(ROOT, 'src', 'data', 'champs.generated.ts'), out, 'utf8')
}

async function main() {
  const force = process.argv.includes('--force')

  await fetchChampions()
  await fetchRanked()
  await fetchMastery()
  await fetchUi()
  await fetchRunes()
  await fetchItems()
  await fetchProfileIcons()
  await fetchFonts()
  await fetchSfx()

  const previous = force ? {} : await readFile(MANIFEST, 'utf8').then(JSON.parse).catch(() => ({}))
  const merged = { ...previous, ...manifest, _stats: { ...stats } }
  await writeFile(MANIFEST, JSON.stringify(merged, null, 2))

  await writeChampionsModule()

  const mb = (stats.bytes / 1024 / 1024).toFixed(2)
  console.log(`descargados: ${stats.ok}  omitidos: ${stats.skipped}  fallidos: ${stats.failed}  (${mb} MB)`)
  if (failures.length) {
    console.log('\nfallos:')
    for (const f of failures.slice(0, 40)) console.log(`  ${f.status}  ${f.relPath}`)
    if (failures.length > 40) console.log(`  ... y ${failures.length - 40} mas`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
