import { useState, type CSSProperties } from 'react'
import { useButtonSound } from '../../hooks/useAudio'
import { asset } from '../../data/assets'
import type { EnlaceSocial } from '../../data/types'
import { AVISO_FAN_CORTO } from '../../data/legal'
import './chrome.css'

const AVATARS = [1, 12, 26, 588, 1013, 1420]

/**
 * Los grupos plegados del panel. El cliente no lista los miembros de estos
 * grupos: solo ensena el total y cuantos hay disponibles, asi que aqui se
 * declaran las dos cifras y no un relleno que se recalcula al desplegar.
 */
const GRUPOS = [
  { id: 'reclutamiento', label: 'RECLUTAMIENTO', disponibles: 0, total: 3 },
  { id: 'general', label: 'GENERAL', disponibles: 1, total: 12 },
]

/** Avisos sin leer apilados sobre el boton de grupo, como en el cliente. */
const AVISOS = 7

type Props = {
  enlaces: EnlaceSocial[]
}

/**
 * El panel social del cliente: cabecera "SOCIAL" con cuatro botones de icono,
 * el grupo PANAS con el nivel de cada persona, dos grupos plegados y la barra
 * inferior de chat, amigos, micro y ajustes. Los iconos son las mascaras que
 * carga la League, pintadas como mascara para heredar el color.
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
            <Mask name="social/add_person_mask.png" size={22} />
          </button>
          <button type="button" className="social__tool" aria-label="Anadir carpeta" {...sound}>
            <Mask name="social/add_folder_mask.png" size={22} />
          </button>
          <button type="button" className="social__tool" aria-label="Ordenar" {...sound}>
            <Mask name="social/sort_mask.png" size={22} />
          </button>
          <button type="button" className="social__tool" aria-label="Buscar" {...sound}>
            <Mask name="social/search_mask.png" size={22} />
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
            title={`${enlace.nombre} · ${enlace.estado}`}
            {...sound}
          >
            <span className="social__avatar">
              <img
                src={asset(`assets/icons/profile/${AVATARS[i % AVATARS.length]}.jpg`)}
                alt=""
                loading="lazy"
              />
              {/*
                El cliente no escribe el estado a la derecha de la fila: lo
                marca con un punto encajado en el aro del avatar.
              */}
              <span
                className={`social__pip social__pip--${estadoSlug(enlace.estado)}`}
                aria-hidden="true"
              />
            </span>
            <span className="social__member-text">
              <span className="social__member-name">{enlace.nombre}</span>
              <span className="social__member-handle">{enlace.handle}</span>
            </span>
          </a>
        ))}

        {GRUPOS.map((grupo) => {
          const abierto = abiertos[grupo.id] ?? false
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
                  ({grupo.disponibles}/{grupo.total})
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
        <div className="social__foot">
          <button type="button" className="social__foot-btn" aria-label="Chat" {...sound}>
            <Mask name="social/message-mask.svg" size={24} />
          </button>
          <button
            type="button"
            className="social__foot-btn social__foot-btn--badged"
            aria-label="Amigos"
            {...sound}
          >
            <Mask name="social/party-invite-mask.svg" size={24} />
            <span className="social__badge">{AVISOS}</span>
          </button>
          <button type="button" className="social__foot-btn" aria-label="Micro" {...sound}>
            <Mask name="social/mute_mask.png" size={24} />
          </button>
          <span className="social__version">26.19</span>
          {/*
            El boton de ajustes vive al otro extremo de la barra, separado del
            grupo de chat: el cliente lo deja suelto contra el borde.
          */}
          <button
            type="button"
            className="social__foot-btn social__foot-btn--settings"
            aria-label="Ajustes"
            {...sound}
          >
            <Mask name="uikit-icons/icon_settings.png" size={24} />
          </button>
        </div>

        {/*
          El aviso legal, en version corta y con tipografia de nota al pie. No es
          un banner: es la linea mas discreta del panel, del Tamano de una nota
          al pie de pagina. El texto largo esta en la pestana de contacto de la
          ficha, que es donde se lee con calma.
        */}
        <p className="social__legal">{AVISO_FAN_CORTO}</p>
      </div>
    </aside>
  )
}

/** El estado sepainta como clase; el texto va en el title de la fila. */
function estadoSlug(estado: EnlaceSocial['estado']) {
  if (estado === 'En linea') return 'online'
  if (estado === 'Ocupado') return 'busy'
  return 'away'
}

/** Icono del cliente pintado como mascara, para heredar el color del texto. */
function Mask({ name, size }: { name: string; size: number }) {
  const url = asset(`assets/ui/${name}`)
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