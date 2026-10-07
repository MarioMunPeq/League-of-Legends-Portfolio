import { useButtonSound } from '../../hooks/useAudio'

export type TabItem<T extends string> = {
  id: T
  label: string
  badge?: string
}

type Props<T extends string> = {
  tabs: TabItem<T>[]
  active: T
  onChange: (id: T) => void
  ariaLabel: string
  /**
   * `loot` reproduce la tira de categorias del botin del cliente: serif de oro,
   * muy espaciada y con el separador bajo la activa. Sin variante, la tira
   * compacta que usan la ficha y la armeria.
   */
  variant?: 'default' | 'loot'
}

export function TabStrip<T extends string>({
  tabs,
  active,
  onChange,
  ariaLabel,
  variant = 'default',
}: Props<T>) {
  const sound = useButtonSound('grid')
  return (
    <div
      className={variant === 'loot' ? 'tabs tabs--loot' : 'tabs'}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === active}
          className="tab"
          onClick={() => {
            if (tab.id !== active) onChange(tab.id)
          }}
          {...sound}
        >
          {tab.label}
          {tab.badge && <span className="chip" style={{ marginLeft: '0.5rem' }}>{tab.badge}</span>}
        </button>
      ))}
    </div>
  )
}