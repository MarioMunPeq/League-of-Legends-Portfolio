import { readFileSync, existsSync } from 'node:fs'

const data = JSON.parse(readFileSync('src/data/proyectos.json', 'utf8'))
const gen = readFileSync('src/data/champs.generated.ts', 'utf8')
const appSrc = readFileSync('src/App.tsx', 'utf8')
const iconSrc = readFileSync('src/components/ui/MaterialIcon.tsx', 'utf8')

const problemas = []

/** Texto de relleno o de plantilla que nunca debe llegar a produccion. */
const PLACEHOLDERS = [
  'Lorem ipsum',
  'ya cambiaré',
  'no se que poner',
  'hola Jesu',
  'FIXME',
  'asdf',
]

/** Marcadores de plantilla que solo valen como palabras enteras y en mayusculas. */
const TOKEN_PLACEHOLDERS = ['TODO', 'TBD', 'XXX']

function scanPlaceholders(value, path) {
  if (typeof value === 'string') {
    for (const bad of PLACEHOLDERS) {
      if (value.toLowerCase().includes(bad.toLowerCase())) {
        problemas.push(`texto de relleno "${bad}" en ${path}: ${value.slice(0, 60)}`)
      }
    }
    for (const tok of TOKEN_PLACEHOLDERS) {
      if (new RegExp(`\\b${tok}\\b`).test(value)) {
        problemas.push(`marcador "${tok}" en ${path}: ${value.slice(0, 60)}`)
      }
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => scanPlaceholders(v, `${path}[${i}]`))
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) scanPlaceholders(v, `${path}.${k}`)
  }
}

scanPlaceholders(data, 'proyectos.json')

/** El mapa MASTERY de App.tsx debe cubrir los proyectos reales, no ids inventados. */
const masteryIds = [...appSrc.matchAll(/^\s{2}'?([a-z0-9-]+)'?:\s*\d+,/gm)].map((m) => m[1])
const realIds = new Set(data.proyectos.map((p) => p.id))
const staleMastery = masteryIds.filter((id) => !realIds.has(id))
if (staleMastery.length) {
  problemas.push(`MASTERY en App.tsx tiene ids que no existen: ${staleMastery.join(', ')}`)
}
const sinMastery = data.proyectos
  .filter((p) => !new RegExp(`['"]?${p.id}['"]?:\\s*\\d`).test(appSrc))
  .map((p) => p.id)
if (sinMastery.length) {
  problemas.push(`proyectos sin entrada en MASTERY: ${sinMastery.join(', ')}`)
}

for (const p of data.proyectos) {
  if (!gen.includes(`name: "${p.campeon}"`)) {
    problemas.push(`campeon "${p.campeon}" no esta en champs.generated.ts (${p.id})`)
  }
  if (!existsSync(`public/assets/champions/square/${p.campeon}.png`)) {
    problemas.push(`falta square/${p.campeon}.png (${p.id})`)
  }
  if (!existsSync(`public/assets/champions/splash/${p.campeon}.jpg`)) {
    problemas.push(`falta splash/${p.campeon}.jpg (${p.id})`)
  }
  if (!existsSync(`public/assets/ranked/crest/emerald.svg`)) {
    problemas.push('falta la insignia de rango')
    break
  }
  for (const e of p.enlaces) {
    if (!/^https?:\/\//.test(e.url)) problemas.push(`enlace no http en ${p.id}: ${e.etiqueta}`)
  }
  if (!p.metricas?.length) problemas.push(`sin metricas: ${p.id}`)
  if (!p.highlights?.length) problemas.push(`sin highlights: ${p.id}`)
}

for (const m of data.materiales) {
  // el glifo SVG de cada material vive en MaterialIcon.tsx, con la clave = id
  if (!new RegExp(`^\\s{2}'?${m.id}'?:\\s*[\\[{]`, 'm').test(iconSrc)) {
    problemas.push(`material sin icono SVG: ${m.id}`)
  }
  if (typeof m.nivel !== 'number') problemas.push(`nivel no numerico: ${m.nombre}`)
}

for (const e of data.enlaces) {
  // el portfolio no expone correo, asi que mailto queda fuera a proposito
  if (/^mailto:/i.test(e.url)) problemas.push(`enlace por correo no permitido: ${e.nombre}`)
  else if (!/^https?:\/\//.test(e.url)) problemas.push(`enlace social invalido: ${e.nombre} -> ${e.url}`)
}

// El contacto se resuelve por red: ni correo ni otros esquemas.
for (const k of ['github', 'linkedin']) {
  if (!/^https:\/\//.test(data.contacto?.[k] ?? '')) {
    problemas.push(`contacto.${k} no es una URL https`)
  }
}
if (/@/.test(JSON.stringify(data.contacto ?? {}))) {
  problemas.push('el bloque de contacto expone un correo')
}

const ids = data.proyectos.map((p) => p.id)
if (new Set(ids).size !== ids.length) problemas.push('ids de proyecto duplicados')

const ords = data.proyectos.map((p) => p.orden).sort((a, b) => a - b)
if (ords.join(',') !== data.proyectos.map((_, i) => i + 1).join(',')) {
  problemas.push(`orden no correlativo: ${ords.join(',')}`)
}

if (problemas.length) {
  console.log(`PROBLEMAS (${problemas.length}):`)
  for (const p of problemas) console.log('  ' + p)
  process.exitCode = 1
} else {
  console.log(
    `datos ok: ${data.proyectos.length} proyectos, ${data.materiales.length} materiales, ${data.enlaces.length} enlaces`,
  )
}
