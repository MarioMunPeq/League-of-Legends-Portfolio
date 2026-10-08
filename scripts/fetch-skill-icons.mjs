/**
 * Logos de marca de los materiales de Artesania.
 *
 * El cliente no dibuja los iconos de sus objetos, asi que las marcas tecnicas
 * salen de Simple Icons: son los logotipos oficiales de cada lenguaje, framework
 * o herramienta, no aproximaciones dibujadas a mano. El archivo se guarda con
 * el nombre del slug (`public/assets/icons/skills/<slug>.svg`) y la pantalla lo
 * pinta como mascara para teñirlo del color de su categoria.
 *
 * Un material puede llevar varios logos (`html-css` usa `html5` y `css`, `git`
 * usa `git` y `github`), de ahi que `icono` sea una lista. Los candidatos estan
 * ordenados: se baja el primero que exista y se sigue con el siguiente para el
 * resto. Un material sin ninguno usa el glifo dibujado de `MaterialIcon.tsx`.
 *
 *   node scripts/fetch-skill-icons.mjs [--force]
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs'

const VERSION = '15.13.0'
const BASE = `https://cdn.jsdelivr.net/npm/simple-icons@${VERSION}/icons`
const DEST = 'public/assets/icons/skills'

/**
 * Candidatos por material, del mas al menos exacto. Ojo con los nombres de la
 * v15: `css3` paso a llamarse `css` y `threejs` a `threedotjs`.
 */
export const SKILL_ICONS = {
  // Lenguajes
  typescript: ['typescript'],
  javascript: ['javascript'],
  python: ['python'],
  java: ['openjdk'],
  kotlin: ['kotlin'],
  csharp: ['dotnet'],
  sql: ['sqlite'],
  'html-css': ['html5', 'css'],

  // Herramientas, frameworks y calidad
  react: ['react'],
  vite: ['vite'],
  tailwind: ['tailwindcss'],
  'css-arquitectura': ['css'],
  threejs: ['threedotjs'],
  gsap: ['gsap'],
  mapbox: ['mapbox'],
  'web-audio': [],
  'd3-force': ['d3'],
  'unity-godot': ['unity', 'godotengine'],
  zustand: [],
  firebase: ['firebase'],
  liferay: [],
  odoo: ['odoo'],
  pega: [],
  'power-platform': [],
  android: ['android'],
  'scikit-learn': ['scikitlearn'],
  pandas: ['pandas'],
  pytorch: ['pytorch'],
  'ollama-groq': ['ollama'],
  git: ['git', 'github'],
  pytest: ['pytest'],
  pwa: [],
  a11y: [],
  figma: ['figma'],
}

/** Los materiales sin ningun candidato resuelto quedan con el glifo dibujado. */
export function skillSlugs() {
  const salida = {}
  for (const [material, candidatos] of Object.entries(SKILL_ICONS)) {
    const ok = candidatos.filter((c) => existsSync(`${DEST}/${c}.svg`))
    if (ok.length) salida[material] = ok
  }
  return salida
}

const force = process.argv.includes('--force')
mkdirSync(DEST, { recursive: true })

const bajados = []
const yaEstaban = []
const sinLogo = []

for (const [material, candidatos] of Object.entries(SKILL_ICONS)) {
  if (!candidatos.length) {
    sinLogo.push(material)
    continue
  }

  let alguno = false
  for (const slug of candidatos) {
    const ruta = `${DEST}/${slug}.svg`
    if (existsSync(ruta)) {
      yaEstaban.push(slug)
      alguno = true
      continue
    }
    if (force) {
      try {
        const res = await fetch(`${BASE}/${slug}.svg`)
        if (!res.ok) continue
        writeFileSync(ruta, await res.text(), 'utf8')
        bajados.push(slug)
        alguno = true
        continue
      } catch {
        // sin red
      }
    }
    // sin archivo y sin red: este candidato no se pudo resolver
    continue
  }

  if (!alguno) sinLogo.push(material)
}

console.log(`logos de marca -> ${DEST}`)
console.log(`  ya estaban: ${yaEstaban.length}   bajados: ${bajados.length}`)
for (const b of bajados) console.log(`    + ${b}.svg`)
if (sinLogo.length) {
  console.log(`  con glifo dibujado en su lugar: ${sinLogo.length}`)
  console.log(`    ${sinLogo.join(', ')}`)
}
