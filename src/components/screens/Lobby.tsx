import { useMemo, useState } from 'react'
import { GoldButton } from '../ui/GoldButton'
import { TextArea, TextField } from '../ui/Fields'
import { Icon } from '../ui/Icon'
import { useAudio } from '../../hooks/useAudio'
import type { PortfolioData } from '../../data/types'
import type { Route } from '../../hooks/useHashRoute'
import './screens.css'

const MOTIVOS = ['Contratar', 'Consultar', 'Colaborar', 'Charla', 'Otro']

type Errores = Partial<Record<'nombre' | 'email' | 'mensaje', string>>

type Props = {
  data: PortfolioData
  onNavegar: (route: Route) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Lobby -> Grupo: el formulario de contacto con la identidad del grupo abierto. */
export function Lobby({ data, onNavegar }: Props) {
  const { play } = useAudio()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [asunto, setAsunto] = useState(MOTIVOS[0])
  const [mensaje, setMensaje] = useState('')
  const [errores, setErrores] = useState<Errores>({})
  const [enviado, setEnviado] = useState(false)

  const progreso = useMemo(() => Math.min(3, Math.floor(mensaje.length / 40)), [mensaje])

  const validar = (): boolean => {
    const next: Errores = {}
    if (nombre.trim().length < 2) next.nombre = 'Escribí tu nombre.'
    if (!EMAIL_RE.test(email.trim())) next.email = 'Revisá el correo: no parece válido.'
    if (mensaje.trim().length < 10) next.mensaje = 'Contame un poco más (mínimo 10 caracteres).'
    setErrores(next)
    return Object.keys(next).length === 0
  }

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validar()) return

    play('click')
    const cuerpo = [
      `Nombre: ${nombre.trim()}`,
      `Correo: ${email.trim()}`,
      `Motivo: ${asunto}`,
      '',
      mensaje.trim(),
    ].join('\n')

    window.location.href = `mailto:${data.contacto.destinatario}?subject=${encodeURIComponent(
      `${data.contacto.asunto} — ${asunto}`,
    )}&body=${encodeURIComponent(cuerpo)}`
    setEnviado(true)
  }

  return (
    <>
      <div className="subnav">
        <span className="label">GI · PORTFOLIO ABIERTO</span>
        <span className="chip chip--gold">
          <Icon name="party" size={14} />
          GRUPO ABIERTO
        </span>
        <span className="chip chip--cyan">1/10 Norma</span>
      </div>

      <div className="screen">
        <div className="lobby">
          <div>
            <div className="lobby__status">
              <span className="top__status-dot" style={{ color: 'var(--green-online)' }} />
              <strong style={{ color: 'var(--ink-bright)' }}>xNaque</strong>
              <span className="muted">Mente maestra · Esmeralda IV · Nivel 559</span>
              <span className="spacer" />
              <GoldButton size="sm" onClick={() => onNavegar('seleccion')}>
                INVITAR A OTRO
              </GoldButton>
            </div>

            <div className="section-title">
              <h2>CONTACTAR</h2>
              <span>abrí el grupo y escribí</span>
            </div>

            {enviado ? (
              <div className="panel panel--capped lobby__form" style={{ alignItems: 'center', textAlign: 'center' }}>
                <Icon name="check" size={40} />
                <h3>Mensaje preparado</h3>
                <p className="muted" style={{ maxWidth: '30rem' }}>
                  Se abrió tu programa de correo con el mensaje listo. Si no se abrió, escribí directo a{' '}
                  <a href={`mailto:${data.contacto.destinatario}`}>{data.contacto.destinatario}</a>.
                </p>
                <GoldButton variant="ghost" onClick={() => setEnviado(false)}>
                  ESCRIBIR OTRO
                </GoldButton>
              </div>
            ) : (
              <form className="panel panel--capped lobby__form" onSubmit={enviar} noValidate>
                <div className="row" style={{ gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="nombre">Nombre</label>
                    <TextField
                      label="Nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className={errores.nombre ? 'input--invalid' : ''}
                      placeholder="Cómo te llamás"
                      autoComplete="name"
                    />
                    {errores.nombre && <p className="lobby__error">{errores.nombre}</p>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor="email">Correo</label>
                    <TextField
                      label="Correo"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={errores.email ? 'input--invalid' : ''}
                      placeholder="vos@ejemplo.com"
                      autoComplete="email"
                    />
                    {errores.email && <p className="lobby__error">{errores.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="motivo">Motivo</label>
                  <select
                    id="motivo"
                    className="input input--plain"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                  >
                    {MOTIVOS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <TextArea
                  label="Mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  className={errores.mensaje ? 'input--invalid' : ''}
                  placeholder="Contame qué necesitás, en qué plazos y qué presupuesto manejas."
                  rows={6}
                />
                {errores.mensaje && <p className="lobby__error">{errores.mensaje}</p>}

                <div className="lobby__summary">
                  <span className="lobby__summary-item">
                    <span>Interés</span>
                    <strong>{asunto}</strong>
                  </span>
                  <span className="lobby__summary-item">
                    <span>Disponible</span>
                    <strong>Part-time remoto</strong>
                  </span>
                  <span className="lobby__summary-item">
                    <span>Respuesta</span>
                    <strong>24-48 h</strong>
                  </span>
                  <span className="lobby__summary-item">
                    <span>Completitud</span>
                    <strong>{progreso}/3</strong>
                  </span>
                </div>

                <div className="row" style={{ gap: '0.75rem' }}>
                  <GoldButton type="submit" size="lg">
                    ENVIAR MENSAJE
                  </GoldButton>
                  <GoldButton
                    variant="ghost"
                    onClick={() => {
                      setNombre('')
                      setEmail('')
                      setMensaje('')
                      setErrores({})
                    }}
                  >
                    LIMPIAR
                  </GoldButton>
                </div>

                <p className="muted" style={{ fontSize: '0.75rem' }}>
                  El mensaje se abre en tu cliente de correo; no se envía nada a ningún servidor.
                </p>
              </form>
            )}
          </div>

          <aside className="lobby__aside">
            <div className="panel panel--capped queue-card">
              <div className="queue-ring">
                <svg width="112" height="112" viewBox="0 0 112 112">
                  <circle cx="56" cy="56" r="50" fill="none" stroke="rgba(1,10,19,0.8)" strokeWidth="8" />
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(progreso / 3) * 314} 314`}
                  />
                </svg>
                <span className="queue-ring__value">
                  {progreso}/3
                  <small>progreso</small>
                </span>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Temporada BST</h3>
              <p className="muted" style={{ fontSize: '0.8125rem' }}>
                Escribí al menos 40 caracteres para completar el mensaje.
              </p>
            </div>

            <div className="panel panel--capped side-block">
              <h3>Contacto directo</h3>
              <a className="side-link" href={`mailto:${data.contacto.destinatario}`}>
                <span>{data.contacto.destinatario}</span>
                <Icon name="mail" size={14} />
              </a>
            </div>

            <div className="panel panel--capped side-block">
              <h3>Zona horaria</h3>
              <p className="muted" style={{ fontSize: '0.875rem' }}>
                UTC−3. Meetings entre 10:00 y 19:00.
              </p>
            </div>

            <div className="panel panel--capped side-block">
              <h3>Enlaces</h3>
              <div className="stack" style={{ gap: '0.5rem' }}>
                {data.enlaces.slice(0, 4).map((e) => (
                  <a
                    key={e.id}
                    className="side-link"
                    href={e.url}
                    target={e.url.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer noopener"
                  >
                    <span className="row" style={{ gap: '0.5rem' }}>
                      <Icon name={e.icono} size={16} />
                      {e.nombre}
                    </span>
                    <Icon name="external" size={14} />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
