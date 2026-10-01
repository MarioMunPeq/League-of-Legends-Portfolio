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
}

export function TabStrip<T extends string>({ tabs, active, onChange, ariaLabel }: Props<T>) {
  const sound = useButtonSound('grid')
  return (
    <div className="tabs" role="tablist" aria-label={ariaLabel}>
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
