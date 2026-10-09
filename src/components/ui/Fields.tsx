import { useId } from 'react'
import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { useButtonSound } from '../../hooks/useAudio'

const LENS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2.4'%3E%3Ccircle cx='10.5' cy='10.5' r='6.5'/%3E%3Cpath d='m20 20-5.2-5.2'/%3E%3C/svg%3E\")"

const LABEL = 'sr-only'

function SearchIcon() {
  return <span className="field__icon" style={{ maskImage: LENS, WebkitMaskImage: LENS }} />
}

type FieldProps = {
  label: string
  className?: string
}

export function SearchField({
  label,
  className = '',
  ...rest
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  const sound = useButtonSound('grid')
  return (
    <div className={`field ${className}`} {...sound}>
      <label className={LABEL} htmlFor={id}>
        {label}
      </label>
      <SearchIcon />
      <input id={id} type="search" className="input" autoComplete="off" {...rest} />
    </div>
  )
}

export function SelectField({
  label,
  className = '',
  children,
  ...rest
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <div className={`field ${className}`}>
      <label className={LABEL} htmlFor={id}>
        {label}
      </label>
      <select id={id} className="input input--plain" {...rest}>
        {children}
      </select>
    </div>
  )
}
