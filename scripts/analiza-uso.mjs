/**
 * Analiza que archivos del proyecto estan realmente en uso.
 *
 * Dos cosas que un grep no pilla y que aqui se resuelven a mano:
 *
 * 1. Rutas de asset construidas con plantillas (`assets/spells/${file}`). Los
 *    nombres posibles salen de los datos de verdad: el manifiesto de
 *    campeones, proyectos.json, los rangos, los sonidos y el mapa de logos.
 * 2. Alcanzabilidad del codigo. Se construye el grafo de imports desde
 *    `src/main.tsx` y se marca lo que no se puede alcanzar, en vez de buscar
 *    nombres sueltos (que daria falsos positivos por prefijo).
 *
 * El informe separa dos Conjuntos:
 *   - SEGURO: no hay ninguna referencia posible. Se puede borrar.
 *   - REVISAR: solo se referencia a traves de una familia de la que se han
 *     guardado mas valores de los que se pintan (los retratos de los 143
 *     campeones del manifiesto, cuando solo se pintan los de proyectos.json).
 *     Borrarlos tambien es correcto, pero conviene saberlo.
 *
 *   node scripts/analiza-uso.mjs               # informe
 *   node scripts/analiza-uso.mjs --borrar      # borra solo SEGURO -> _fuera/
 *   node scripts/analiza-uso.mjs --borrar -t   # borra tambien REVISAR
 */
import { readFileSync, readdirSync, statSync, existsSync, mkdirSync, renameSync } from 'node:fs'
import { join, relative, sep, dirname, resolve } from 'node:path'

const borrar = process.argv.includes('--borrar')
const conEspeculativos = process.argv.includes('-t') || process.argv.includes('--todos')
const P = (p) => p.split('/').join(sep)
const posix = (p) => p.split(sep).join('/')
const leer = (p) => readFileSync(p, 'utf8')

function walk(dir) {
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const r = join(dir, e.name)
    if (e.isDirectory()) out.push(...walk(r))
    else out.push(r)
  }
  return out
}

const raiz = resolve('.')
const abs = (p) => resolve(raiz, p)

/* ================================================================ 1. CODIGO */

/** Todo en absoluto: si no, el grafo de imports no casa al resolver. */
const fuentesAbs = walk('src')
  .filter((f) => /\.(ts|tsx|css)$/.test(f))
  .map((f) => abs(f))
const porAbs = new Set(fuentesAbs.map((f) => posix(f)))

function resolver(espec, desdeAbs) {
  const base = resolve(dirname(desdeAbs), espec)
  for (const c of [base, `${base}.ts`, `${base}.tsx`, `${base}.css`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
    if (porAbs.has(posix(c))) return posix(c)
  }
  return null
}

const entrada = posix(abs('src/main.tsx'))
const alcanzado = new Set([entrada])
const cola = [entrada]
const paquetes = new Set()

while (cola.length) {
  const f = cola.pop()
  const fuente = leer(abs(f))
  // `from '...'` cubre los imports con salto de linea; `import '...'` los de
  // efecto. Un unico patron con `[\s\S]*?` se comia lineas de otros imports.
  for (const m of [
    ...fuente.matchAll(/\bfrom\s*['"]([^'"]+)['"]/g),
    ...fuente.matchAll(/\bimport\s*['"]([^'"]+)['"]/g),
  ]) {
    const espec = m[1]
    if (!espec.startsWith('.')) {
      paquetes.add(espec)
      continue
    }
    const destino = resolver(espec, abs(f))
    if (destino && !alcanzado.has(destino)) {
      alcanzado.add(destino)
      cola.push(destino)
    }
  }
}

const codigoHuerfano = [...porAbs].filter((f) => !alcanzado.has(f)).sort()

/*
 * Los literales se buscan tambien fuera de src/: el script de descarga y el
 * validador de assets citan rutas literales que son de verdad (por ejemplo
 * public/assets/manifest.json, que fetch-assets relee como cache de lo ya
 * descargado). Buscar solo en src/ los daba por muertos y los borraba.
 */
const literalesExtra = [
  'index.html',
  'vite.config.ts',
  'package.json',
  '.github/workflows/deploy.yml',
  /*
   * Ojo con esto: fetch-assets.mjs y fetch-skill-icons.mjs NO cuentan como
   * consumidores. Son productores: nombran todo lo que existe en el CDN, y el
   * juego trae montones de piezas que la interfaz no llega a pintar. Si se
   * tuvieran en cuenta, cada uno de esos downloads resucitaria su asset y el
   * analisis no encontraria nada que borrar.
   */
  ...walk('scripts')
    .filter((f) => !/^scripts[\\/]fetch-/.test(f))
    // y menos este propio fichero: si no, sus literales de ejemplo (los
    // nombres de carpeta que prueba en los resolutores) se contarian como
    // referencias reales y no encontraria nunca nada que borrar
    .filter((f) => !/^scripts[\\/]analiza-uso\.mjs$/.test(f))
    .map((f) => posix(abs(f))),
]
const texto = [
  ...[...alcanzado].map((f) => leer(abs(f))),
  ...literalesExtra.filter(existsSync).map((f) => leer(abs(f))),
].join('\n')

/* =============================================================== 2. ASSETS */

/** Rutas que se pintan seguro: literales y valores de las familias. */
const seguras = new Set()

// 2.1 literales: cadenas y url() que ya son una ruta completa
for (const m of texto.matchAll(/['"`]([^'"`]*assets\/[^'"`]+)['"`]/g)) {
  const r = m[1].replace(/^\//, '')
  if (!r.includes('${')) seguras.add(r)
}
for (const m of texto.matchAll(/url\(\s*['"]?(\/?assets\/[^'")]+)/g)) seguras.add(m[1].replace(/^\//, ''))

// 2.2 audio: el mapa de sonidos declara `clave: 'fichero.ogg'`
for (const m of leer(abs('src/data/audio.ts')).matchAll(/:\s*'([^']+\.ogg)'/g)) seguras.add(`audio/${m[1]}`)

// 2.3-API: parseo por campeon, separando la pasiva de los hechizos. El manifiesto
// guarda el nombre de archivo pelado y en dos carpetas distintas, asi que si se
// mezclaran los dos would-marking multiplicaria el resultado por dos.
const gen = leer(abs('src/data/champs.generated.ts'))
const proyectos = JSON.parse(leer(abs('src/data/proyectos.json')))

const championsPintados = new Set([
  ...proyectos.proyectos.map((p) => p.campeon),
  proyectos.hero.champFavorito,
  proyectos.hero.portada,
  proyectos.hero.fondoInicio,
].filter(Boolean))

const bloqueDe = (nombre) => {
  const i = gen.indexOf(`\n    name: "${nombre}",`)
  if (i < 0) return ''
  const j = gen.indexOf('\n    name: "', i + 1)
  return gen.slice(i, j < 0 ? gen.length : j)
}

/** `hasSplash` esta mas alla del blurb, asi que no vale mirar solo elprincipio. */
const conSplash = (bloque) => bloque.includes('hasSplash: true')

/**
 * El manifiesto escribe la pasiva como `icon: "..."` y los hechizos como
 * `"icon": "..."` (son objetos JSON dentro del array), de ahi las dos claves.
 */
const iconoPasiva = (bloque) => bloque.match(/passive:\s*\{[\s\S]*?icon:\s*"([^"]+)"/)?.[1]
const iconosHechizos = (bloque) => {
  const spells = bloque.match(/spells:\s*\[([\s\S]*?)\n {4}\],/)?.[1] ?? ''
  return [...spells.matchAll(/"icon":\s*"([^"]+)"/g)].map((m) => m[1])
}

/** Los 143 del manifiesto: puede que algun dia hagan falta. */
const posibles = new Set()
for (const m of gen.matchAll(/^ {4}name: "([^"]+)",/gm)) {
  const nombre = m[1]
  const bloque = bloqueDe(nombre)
  posibles.add(`assets/champions/square/${nombre}.png`)
  if (conSplash(bloque)) posibles.add(`assets/champions/splash/${nombre}.jpg`)
  const pasiva = iconoPasiva(bloque)
  if (pasiva) posibles.add(`assets/passives/${pasiva}`)
  for (const s of iconosHechizos(bloque)) posibles.add(`assets/spells/${s}`)
}

/** Los que se pintan de verdad: solo los de los proyectos y del heroe. */
for (const c of championsPintados) {
  const bloque = bloqueDe(c)
  seguras.add(`assets/champions/square/${c}.png`)
  if (conSplash(bloque)) seguras.add(`assets/champions/splash/${c}.jpg`)
  const pasiva = iconoPasiva(bloque)
  if (pasiva) seguras.add(`assets/passives/${pasiva}`)
  for (const s of iconosHechizos(bloque)) seguras.add(`assets/spells/${s}`)
}

// 2.4 rangos. El mapa RANKS no basta para dar el crest por usado: hay que que
// el codigo mencione la carpeta de verdad, porque pueden quedar solo los
// emblemas grandes y ningun sitio pintar la insignia.
for (const m of leer(abs('src/data/ranks.ts')).matchAll(/slug: '([^']+)'/g)) {
  if (texto.includes('ranked/crest/')) seguras.add(`assets/ranked/crest/${m[1]}.svg`)
  if (texto.includes('ranked/emblem/')) seguras.add(`assets/ranked/emblem/emblem-${m[1]}.png`)
}

// 2.5 retratos de cuenta: la lista del manifiesto mas los que pide el codigo
const cfg = leer(abs('scripts/assets.config.mjs'))
for (const m of (cfg.match(/PROFILE_ICONS = \[([^\]]+)\]/)?.[1] ?? '').matchAll(/\d+/g)) {
  seguras.add(`assets/icons/profile/${m[0]}.jpg`)
}
for (const m of texto.matchAll(/profileIcon\((\d+)\)/g)) seguras.add(`assets/icons/profile/${m[1]}.jpg`)

// 2.6 logos de marca: el mapa de fetch-skill-icons (sin extension en el fuente)
const skillSrc = leer(abs('scripts/fetch-skill-icons.mjs'))
const bloqueSkill = skillSrc.slice(skillSrc.indexOf('export const SKILL_ICONS'))
for (const m of bloqueSkill.matchAll(/: \[([^\]]*)\]/g)) {
  for (const s of (m[1].matchAll(/'([^']+)'/g)).map((x) => x[1])) seguras.add(`assets/icons/skills/${s}.svg`)
}

/*
 * 2.7 Rutas con una variable en medio. Se sacan del propio dato que las
 * alimenta, no de un regexp sobre el codigo, que no distingue un nombre de
 * icono de cualquier otra cadena:
 *   assets/ui/nav/${icono}      -> SECCIONES de TopBar
 *   assets/ui/social/${name}    -> argumentos de <Mask> en TopBar y SocialPanel
 *   assets/ui/rarity/${n}.png   -> gemas de maestria (1..9) de Coleccion
 */
const topBar = leer(abs('src/components/layout/TopBar.tsx'))
const social = leer(abs('src/components/layout/SocialPanel.tsx'))
const coleccion = leer(abs('src/components/screens/Coleccion.tsx'))

for (const m of topBar.matchAll(/icono: '([^']+)'/g)) seguras.add(`assets/ui/nav/${m[1]}`)
for (const f of [topBar, social]) {
  /*
   * Cada componente resuelve el nombre como le place: TopBar antepone
   * `assets/ui/social/` y SocialPanel solo `assets/ui/` (sus llamadas ya
   * brought the subcarpeta). Se marcan las dos formas, que es el sesgo seguro.
   */
  for (const m of f.matchAll(/<Mask\s+name="([^"]+)"/g)) {
    seguras.add(`assets/ui/${m[1]}`)
    seguras.add(`assets/ui/social/${m[1]}`)
  }
}
/*
 * El nivel de gema no se lee de una lista literal: Coleccion lo calcula con
 * gemaDe(nivel), que recorta a 1..9. Hay que resolver esa aritmetica, no
 * buscar numeros sueltos en el fichero (daria 0, y rarity0.png no existe).
 */
if (texto.includes('assets/ui/rarity/')) {
  const rango = coleccion.match(/Math\.max\(\s*(\d+)\s*,\s*Math\.min\(\s*(\d+)/)
  const lo = rango ? Number(rango[1]) : 1
  const hi = rango ? Number(rango[2]) : 9
  /*
   * El prefijo tambien sale del codigo, porque la plantilla es `rarity${...}`.
   * Escribir aqui `rarity${n}.png` a mano salia mal y dejaba los 9
   * ficheros como si no los usara nadie.
   */
  const prefijo = coleccion.match(/`([A-Za-z0-9_-]*)\$\{Math\.max\(/)?.[1] ?? ''
  for (let n = lo; n <= hi; n++) seguras.add(`assets/ui/rarity/${prefijo}${n}.png`)
}

/* ================================================================ 3. INFORME */

const publicFiles = walk('public')
const rel = (f) => relative('public', f).split(sep).join('/')
const todos = publicFiles.map(rel).sort()

const seguros = todos.filter((f) => !seguras.has(f) && !posibles.has(f))
const revisables = todos.filter((f) => !seguras.has(f) && posibles.has(f))

const tam = (fs) => fs.reduce((a, f) => a + statSync(abs(join('public', P(f)))).size, 0)
const kb = (n) => `${(n / 1024).toFixed(1)} KB`
const desglose = (lista) => {
  const m = new Map()
  for (const f of lista) {
    const d = f.split('/').slice(0, -1).join('/')
    m.set(d, (m.get(d) ?? 0) + 1)
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

console.log('=== 1. CODIGO SIN ALCANZAR DESDE src/main.tsx ===')
console.log(codigoHuerfano.length ? codigoHuerfano.map((h) => `    ${h}`).join('\n') : '    ninguno')
console.log(`    (${alcanzado.size} archivos alcanzados de ${porAbs.size})`)

console.log()
console.log('=== 2. ASSETS SIN NINGUNA REFERENCIA (SEGURO) ===')
console.log(`  ${seguros.length} archivos · ${kb(tam(seguros))}`)
for (const [d, n] of desglose(seguros)) console.log(`  ${String(n).padStart(4)}  ${d || '(raiz de public/)'}`)

console.log()
console.log('=== 3. ASSETS DE LA FAMILIA AMPLIADA (REVISAR) ===')
console.log(`  ${revisables.length} archivos · ${kb(tam(revisables))}`)
console.log('  Son los retratos y hechizos de los 143 campeones del manifiesto,')
console.log('  de los que la app solo pinta los de proyectos.json. Borrarlos tambien')
console.log('  es correcto; se pierden si algun dia anades un proyecto con esos.')
for (const [d, n] of desglose(revisables)) console.log(`  ${String(n).padStart(4)}  ${d || '(raiz de public/)'}`)

console.log()
console.log('=== 4. CARPETAS VACIAS ===')
const vacias = []
for (const e of readdirSync('.', { withFileTypes: true })) {
  if (!e.isDirectory() || ['node_modules', 'dist', '.git'].includes(e.name)) continue
  if (walk(e.name).length === 0) vacias.push(e.name)
}
console.log(vacias.length ? vacias.map((v) => `    ${v}/`).join('\n') : '    ninguna')

/* Rutas que el codigo pide y no existen: 404 garantizados. */
const rotas = []
for (const f of [...alcanzado].filter((f) => f.endsWith('.css'))) {
  for (const m of leer(abs(f)).matchAll(/url\(\s*['"]?(\/?assets\/[^'")]+)/g)) {
    const r = m[1].replace(/^\//, '')
    if (!existsSync(abs(join('public', P(r))))) rotas.push(`${posix(f).split('/src/')[1]} -> ${r}`)
  }
}
for (const m of texto.matchAll(/['"`](\/?assets\/[^'"`$]+)['"`]/g)) {
  const r = m[1].replace(/^\//, '')
  if (r.includes('...') || r.endsWith('/')) continue // documentacion, no una ruta
  if (!existsSync(abs(join('public', P(r))))) rotas.push(`codigo -> ${r}`)
}
console.log()
console.log('=== 5. RUTAS QUE EL CODIGO PIDE Y NO EXISTEN (404) ===')
console.log(rotas.length ? [...new Set(rotas)].map((r) => `    ${r}`).join('\n') : '    ninguna')

const aBorrar = conEspeculativos ? [...seguros, ...revisables] : seguros

if (borrar && aBorrar.length) {
  const destino = '_fuera'
  mkdirSync(destino, { recursive: true })
  for (const f of aBorrar) {
    const d = join(destino, P(f))
    mkdirSync(dirname(d), { recursive: true })
    renameSync(abs(join('public', P(f))), d)
  }
  console.log()
  console.log(`movidos ${aBorrar.length} archivos a ${destino}/`)
  console.log('para volver: git checkout -- public')
} else if (borrar) {
  console.log()
  console.log('nada que borrar')
}

if (!borrar) {
  console.log()
  console.log('detalle de SEGURO:')
  for (const f of seguros) console.log(`    ${f}`)
}
