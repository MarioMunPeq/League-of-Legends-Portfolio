import { skillIcon } from '../../data/assets'
import { MaterialIcon, type MaterialIconName } from './MaterialIcon'
import type { Material } from '../../data/types'

/**
 * Tinte por grupo. El cliente tambien da un color a cada categoria de su botin,
 * asi que aqui el color va por grupo y no por tecnologia: dos logos contiguos
 * nunca rompen el ritmo de la retícula.
 */
const COLOR_GRUPO: Record<string, string> = {
  Lenguajes: '#5aa9ff',
  'Herramientas y calidad': '#e0c184',
}

function colorGrupo(categoria: string): string {
  return COLOR_GRUPO[categoria] ?? '#c8aa6e'
}

type Props = {
  material: Material
  size?: number
  className?: string
}

/**
 * Logo de un material.
 *
 * Si trae marca (los logotipos oficiales que baja `fetch-skill-icons.mjs`) se
 * pinta como mascara, que es como el cliente tiñe sus iconos monocromos: el
 * glifo va en `currentColor` y el color lo pone la pantalla. Un material sin
 * marca, o un nombre que agrupa dos tecnologias (`html-css`, `git`), apila los
 * logos que tenga; si no tiene ninguno, cae al glifo dibujado de `MaterialIcon`.
 */
export function SkillLogo({ material, size = 28, className }: Props) {
  const slugs =
    material.icono === undefined ? [] : Array.isArray(material.icono) ? material.icono : [material.icono]

  if (!slugs.length) {
    return (
      <MaterialIcon
        name={material.id as MaterialIconName}
        categoria={material.categoria}
        size={size + 16}
        className={`skill-logo skill-logo--glifo ${className ?? ''}`}
      />
    )
  }

  /* con dos logos se achican un poco para que el conjunto quepa en la placa */
  const lado = slugs.length > 1 ? Math.round(size * 0.68) : size

  return (
    <span className={`skill-logo ${className ?? ''}`} style={{ color: colorGrupo(material.categoria) }}>
      {slugs.map((slug) => (
        <span
          key={slug}
          className="skill-logo__mark"
          style={{
            width: lado,
            height: lado,
            maskImage: `url("${skillIcon(slug)}")`,
            WebkitMaskImage: `url("${skillIcon(slug)}")`,
          }}
        />
      ))}
    </span>
  )
}
