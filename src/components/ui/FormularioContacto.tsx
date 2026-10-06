import { useMemo, useState } from 'react'
import { GoldButton } from './GoldButton'
import { TextArea, TextField } from './Fields'
import { Icon } from './Icon'
import { useAudio } from '../../hooks/useAudio'
import type { PortfolioData } from '../../data/types'
import '../screens/screens.css'

const MOTIVOS = ['Contratar', 'Consultar', 'Colaborar', 'Charla', 'Otro']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Errores = Partial<Record<'nombre' | 'email' | 'mensaje', string>>

type Props = {
  contacto: PortfolioData['contacto']
}

/**
 * Formulario de contacto. No hay servidor: compone un mailto y abre el
 * cliente de correo del visitante, asi que la validacion es la unica defensa
 * real que hay que mantener.
 */
export function FormularioContacto({ contacto }: Props) {
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

    window.location.href = `mailto:${contacto.destinatario}?subject=${encodeURIComponent(
      `${contacto.asunto} — ${asunto}`,
    )}&body=${encodeURIComponent(cuerpo)}`
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="contacto__panel contacto__panel--listo">
        <Icon name="check" size={40} />
        <h3>Mensaje preparado</h3>
        <p className="muted">
          Se abrió tu programa de correo con el mensaje listo. Si no se abrió, escribí directo a{' '}
          <a href={`mailto:${contacto.destinatario}`}>{contacto.destinatario}</a>.
        </p>
        <GoldButton variant="ghost" onClick={() => setEnviado(false)}>
          ESCRIBIR OTRO
        </GoldButton>
      </div>
    )
  }

  return (
    <form className="contacto__panel" onSubmit={enviar} noValidate>
      <div className="contacto__filas">
        <div>
          <label className="contacto__label">Nombre</label>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={errores.nombre ? 'input--invalid' : ''}
            placeholder="Cómo te llamás"
            autoComplete="name"
          />
          {errores.nombre && <p className="contacto__error">{errores.nombre}</p>}
        </div>
        <div>
          <label className="contacto__label">Correo</label>
          <TextField
            label="Correo"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errores.email ? 'input--invalid' : ''}
            placeholder="vos@ejemplo.com"
            autoComplete="email"
          />
          {errores.email && <p className="contacto__error">{errores.email}</p>}
        </div>
      </div>

      <div>
        <label className="contacto__label" htmlFor="motivo">
          Motivo
        </label>
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

      <div>
        <label className="contacto__label" htmlFor="mensaje">
          Mensaje
        </label>
        <TextArea
          label="Mensaje"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className={errores.mensaje ? 'input--invalid' : ''}
          placeholder="Contame qué necesitás, en qué plazos y qué presupuesto manejas."
          rows={6}
        />
        {errores.mensaje && <p className="contacto__error">{errores.mensaje}</p>}
      </div>

      <div className="contacto__summary">
        <span>
          <span>Interés</span>
          <strong>{asunto}</strong>
        </span>
        <span>
          <span>Disponible</span>
          <strong>Part-time remoto</strong>
        </span>
        <span>
          <span>Respuesta</span>
          <strong>24-48 h</strong>
        </span>
        <span>
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
  )
}