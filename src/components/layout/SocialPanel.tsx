import { useState } from 'react'
import { Icon } from '../ui/Icon'
import { useButtonSound } from '../../hooks/useAudio'
import { asset } from '../../data/assets'
import type { EnlaceSocial } from '../../data/types'
import './chrome.css'

const AVATARS = [1, 12, 26, 588, 1013, 1420]

type Props = {
  enlaces: EnlaceSocial[]
}

/** La barra social del cliente, con los enlaces externos como lista de amigos. */
export function SocialPanel({ enlaces }: Props) {
  const [open, setOpen] = useState(true)
  const sound = useButtonSound('grid')

  return (
    <aside className="social" aria-label="Enlaces y contacto">
      <div className="social__head">
        <span className="social__title">CONTACTO</span>
        <div className="social__tools">
          <button type="button" className="social__tool" aria-label="Buscar" {...sound}>
            <Icon name="search" size={18} />
          </button>
          <button type="button" className="social__tool" aria-label="Anadir enlace" {...sound}>
            <Icon name="plus" size={18} />
          </button>
        </div>
      </div>

      <div className="social__list">
        <button
          type="button"
          className="social__group"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          {...sound}
        >
            <Icon
              name="caret"
              size={14}
              className={`social__caret ${open ? 'social__caret--open' : ''}`}
            />
          EN LÍNEA ({enlaces.filter((e) => e.estado === 'En linea').length})
        </button>

        {open &&
          enlaces.map((enlace, i) => (
            <a
              key={enlace.id}
              className="social__member"
              href={enlace.url}
              target={enlace.url.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer noopener"
              {...sound}
            >
              <span className="social__avatar">
                {enlace.estado === 'En linea' ? (
                  <img src={asset(`assets/icons/profile/${AVATARS[i % AVATARS.length]}.jpg`)} alt="" />
                ) : (
                  <Icon name={enlace.icono} size={18} className="social__avatar--empty" />
                )}
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
              {enlace.url.startsWith('http') && (
                <Icon name="external" size={14} className="social__ext" />
              )}
            </a>
          ))}
      </div>

      <div>
        <p className="social__note">
          Proyecto fan no afiliado a Riot Games. League of Legends y todos sus personajes son marcas de
          Riot Games.
        </p>
        <div className="social__foot">
          <Icon name="help" size={16} />
          <Icon name="settings" size={16} />
          <span className="spacer" />
          <span style={{ fontSize: '0.75rem', color: 'var(--ink-ghost)' }}>26.19</span>
        </div>
      </div>
    </aside>
  )
}
