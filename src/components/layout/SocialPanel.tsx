import { useState, type CSSProperties } from 'react'
import { useButtonSound } from '../../hooks/useAudio'
import { asset } from '../../data/assets'
import type { EnlaceSocial } from '../../data/types'
import './chrome.css'

const AVATARS = [1, 12, 26, 588, 1013, 1420]

/** Los grupos plegados del panel, tal y como los pinta el cliente. */
const GRUPOS = [
  { id: 'reclutamiento', label: 'RECLUTAMIENTO', total: 3 },
  { id: 'general', label: 'GENERAL', total: 12 },
]

type Props = {
  enlaces: EnlaceSocial[]
}

/**
 * El panel social del cliente: cabecera "SOCIAL" con cuatro botones de icono,
 * el grupo PANAS con el nivel de cada persona, dos grupos plegados y la barra
 * inferior de chat, amigos y micro. Los iconos son las mascaras que carga la
 * League, pintadas como mascara para heredar el color.
 */
export function SocialPanel({ enlaces }: Props) {
  const [abiertos, setAbiertos] = useState<Record<string, boolean>>({})
  const sound = useButtonSound('grid')

  const alternar = (id: string) => setAbiertos((v) => ({ ...v, [id]: !v[id] }))

  return (
    <aside className="social" aria-label="Enlaces y contacto">
      <div className="social__head">
        <span className="social__title">SOCIAL</span>
        <div className="social__tools">
          <button
            type="button"
            className="social__tool"
            aria-label="Anadir enlace"
            {...sound}
          >
            <Mask name="add_person_mask.png" size={20} />
          </button>
          <button type="button" className="social__tool" aria-label="Anadir carpeta" {...sound}>
            <Mask name="add_folder_mask.png" size={20} />
          </button>
          <button type="button" className="social__tool" aria-label="Ordenar" {...sound}>
            <Mask name="sort_mask.png" size={20} />
          </button>
          <button type="button" className="social__tool" aria-label="Buscar" {...sound}>
            <Mask name="search_mask.png" size={20} />
          </button>
        </div>
      </div>

      <div className="social__list">
        <div className="social__group social__group--static">
          <span className="social__caret social__caret--open" aria-hidden="true">
            ▼
          </span>
          <span>PANAS</span>
          <span className="social__count">(1/{AVATARS.length + 1})</span>
        </div>

        {enlaces.map((enlace, i) => (
          <a
            key={enlace.id}
            className="social__member"
            href={enlace.url}
            target={enlace.url.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer noopener"
            {...sound}
          >
            <span className="social__avatar">
              <img
                src={asset(`assets/icons/profile/${AVATARS[i % AVATARS.length]}.jpg`)}
                alt=""
                loading="lazy"
              />
            </span>
            <span className="social__member-text">
              <span className="social__member-name">{enlace.nombre}</span>
              <span className="social__member-handle">{enlace.handle}</span>
            </span>
            <span
              className={`social__member-state ${
                enlace.estado === 'En linea'
                  ? 'social__member-state--online'
                  : enlace.estado === 'Ocupado'
                    ? 'social__member-state--busy'
                    : ''
              }`}
            >
              {enlace.estado}
            </span>
          </a>
        ))}

        {GRUPOS.map((grupo) => {
          const abierto = abiertos[grupo.id] ?? false
          const relleno = grupo.total - (abierto ? 1 : 0)
          return (
            <div key={grupo.id}>
              <button
                type="button"
                className="social__group"
                aria-expanded={abierto}
                onClick={() => alternar(grupo.id)}
                {...sound}
              >
                <span
                  className={`social__caret ${abierto ? 'social__caret--open' : ''}`}
                  aria-hidden="true"
                >
                  ▶
                </span>
                <span>{grupo.label}</span>
                <span className="social__count">
                  ({relleno}/{grupo.total})
                </span>
              </button>
              {abierto && (
                <p className="social__note">
                  Este grupo se abre en el cliente real. Aqui no hay {grupo.total} personas que
                  listar: los enlaces de arriba son los canales reales de contacto.
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="social__bottom">
        <p className="social__note social__note--legal">
          Proyecto fan no afiliado a Riot Games. League of Legends y todos sus personajes son marcas
          de Riot Games.
        </p>
        <div className="social__foot">
          <button type="button" className="social__foot-btn" aria-label="Chat" {...sound}>
            <img src={asset('assets/ui/social/message-mask.svg')} alt="" />
          </button>
          <button type="button" className="social__foot-btn" aria-label="Amigos" {...sound}>
            <img src={asset('assets/ui/social/profile-mask.svg')} alt="" />
          </button>
          <button type="button" className="social__foot-btn" aria-label="Micro" {...sound}>
            <Mask name="mute_mask.png" size={22} />
          </button>
          <span className="social__version">26.19</span>
        </div>
      </div>
    </aside>
  )
}

/** Icono del cliente pintado como mascara, para heredar el color del texto. */
function Mask({ name, size }: { name: string; size: number }) {
  const url = asset(`assets/ui/social/${name}`)
  return (
    <span
      className="maskicon"
      style={
        {
          width: size,
          height: size,
          maskImage: `url("${url}")`,
          WebkitMaskImage: `url("${url}")`,
        } as CSSProperties
      }
    />
  )
}