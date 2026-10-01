import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useButtonSound } from '../../hooks/useAudio'

type Variant = 'gold' | 'ghost' | 'play'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: 'md' | 'lg' | 'sm'
  block?: boolean
  pill?: boolean
  children: ReactNode
}

const VARIANTS: Record<Variant, string> = {
  gold: 'btn btn--gold',
  ghost: 'btn btn--ghost',
  play: 'btn btn--play',
}

export function GoldButton({
  variant = 'gold',
  size = 'md',
  block,
  pill,
  className = '',
  children,
  ...rest
}: Props) {
  const sound = useButtonSound(variant === 'ghost' ? 'grid' : 'gold')
  const classes = [
    VARIANTS[variant],
    size === 'lg' && 'btn--lg',
    size === 'sm' && 'btn--pill',
    block && 'btn--block',
    pill && 'btn--pill',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} {...sound} {...rest}>
      {children}
    </button>
  )
}
