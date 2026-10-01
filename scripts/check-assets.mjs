import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const SRC = join(root, 'src')
const PUBLIC = join(root, 'public')

const exists = (p) => {
  try {
    return statSync(p).isFile()
  } catch {
    return false
  }
}

/* ------------------------------------------------------------------
   1. Referencias literales a /assets y /audio en el codigo
   ------------------------------------------------------------------ */

const refs = new Set()
const PATTERN = /["'`(](\/(?:assets|audio)\/[A-Za-z0-9._/-]+)/g

function scan(text) {
  for (const m of text.matchAll(PATTERN)) refs.add(m[1])
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full)
    else if (/\.(ts|tsx|css|html)$/.test(entry)) scan(readFileSync(full, 'utf8'))
  }
}

walk(SRC)
scan(readFileSync(join(root, 'index.html'), 'utf8'))

/**
 * Solo cuentan las rutas completas. Las de functions/assets.ts son
 * plantillas a proposito (asset("assets/...") se resuelve en runtime) y las
 * que terminan en guion son prefijos de plantilla.
 */
const isTemplate = (r) =>
  r.endsWith('-') || r.endsWith('/') || r.includes('-${') || r.includes('/...')

const literal = [...refs].filter((r) => !isTemplate(r))
const templates = [...refs].filter(isTemplate)

const problems = []
const okCount = literal.filter((ref) => exists(join(PUBLIC, ref))).length
for (const ref of literal) if (!exists(join(PUBLIC, ref))) problems.push(ref)

console.log(`referencias literales: ${literal.length}  ok: ${okCount}`)
if (problems.length) {
  console.log(`\nFALTAN (${problems.length}):`)
  for (const p of problems.sort()) console.log('  ' + p)
}

/* ------------------------------------------------------------------
   2. Plantillas de ranks.ts, resueltas con los slugs reales
   ------------------------------------------------------------------ */

const rankSrc = readFileSync(join(SRC, 'data', 'ranks.ts'), 'utf8')

// slug -> etiqueta, para resolver la lista RANKS_WITH_PLATE
const slugToRank = new Map(
  [...rankSrc.matchAll(/(\w+):\s*\{\s*slug:\s*'([a-z]+)'/g)].map((m) => [m[2], m[1]]),
)

if (slugToRank.size === 0) problems.push('ranks.ts: no se pudo leer el mapa RANKS')

const rankResolved = [
  ...[...slugToRank.keys()].map((slug) => `/assets/ranked/crest/${slug}.svg`),
  '/assets/ranked/crest/unranked.svg',
  '/assets/ranked/frame/ranked-emblem.png',
  '/assets/ranked/frame/ranked-crest-placeholder.png',
  '/assets/ranked/frame/member-banner.png',
  '/assets/ranked/frame/current-player-banner.png',
]

const rankMissing = rankResolved.filter((ref) => !exists(join(PUBLIC, ref)))
const rankOk = rankResolved.length - rankMissing.length
console.log(`assets de rango: ${rankResolved.length}  ok: ${rankOk}`)
if (rankMissing.length) {
  console.log(`\nFALTAN de rango (${rankMissing.length}):`)
  for (const m of rankMissing) console.log('  ' + m)
}

/* ------------------------------------------------------------------
   3. Assets dinamicos de los proyectos y materiales
   ------------------------------------------------------------------ */

const data = JSON.parse(readFileSync(join(SRC, 'data', 'proyectos.json'), 'utf8'))

const champMissing = []
for (const p of data.proyectos) {
  for (const [dir, ext] of [
    ['square', 'png'],
    ['splash', 'jpg'],
  ]) {
    if (!exists(join(PUBLIC, 'assets', 'champions', dir, `${p.campeon}.${ext}`))) {
      champMissing.push(`champions/${dir}/${p.campeon}.${ext}`)
    }
  }
}
console.log(
  champMissing.length
    ? `championes: faltan ${champMissing.length}`
    : `championes: ok (${data.proyectos.length * 2} archivos)`,
)
for (const m of champMissing) console.log('  ' + m)

const materialMissing = []
for (const m of data.materiales) {
  if (!exists(join(PUBLIC, m.icono))) materialMissing.push(m.icono)
}
console.log(
  materialMissing.length
    ? `materiales: faltan ${materialMissing.length}`
    : `materiales: ok (${data.materiales.length})`,
)
for (const m of materialMissing) console.log('  ' + m)

/* ------------------------------------------------------------------
   4. Assets citados por los resumenes del script de descarga
   ------------------------------------------------------------------ */

const manifestPath = join(PUBLIC, 'assets', 'manifest.json')
const manifest = exists(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : null
console.log(
  manifest ? `manifiesto: ${manifest.champions?.length ?? 0} campeones` : 'manifiesto: ausente',
)

const total =
  problems.length + rankMissing.length + champMissing.length + materialMissing.length
if (total > 0) {
  console.log(`\n${total} referencias sin resolver`)
  process.exitCode = 1
} else {
  console.log(`\ntodo resuelve (plantillas detectadas: ${templates.length})`)
}
