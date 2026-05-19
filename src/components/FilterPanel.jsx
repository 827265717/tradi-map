import { TYPES, TYPE_COLORS, ARCHETYPES } from '../constants/taxonomy'
import './FilterPanel.css'

export default function FilterPanel({ filters, onChange, totalCount, filteredCount }) {
  const toggleType = value => {
    const arr = filters.types
    onChange({
      ...filters,
      types: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
    })
  }

  const toggleArchetype = value => {
    const arr = filters.archetypes
    onChange({
      ...filters,
      archetypes: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
    })
  }

  const hasActive = filters.keyword || filters.types.length || filters.archetypes.length || filters.selectedFestival != null

  const clearAll = () => onChange({ keyword: '', types: [], archetypes: [], selectedFestival: null })

  return (
    <aside className="filter-panel">
      <div className="filter-header">
        <span className="filter-title">筛选 <em>Filters</em></span>
        {hasActive && (
          <button className="clear-btn" onClick={clearAll}>清除</button>
        )}
      </div>

      <div className="filter-count">
        显示 <strong>{filteredCount.toLocaleString()}</strong> / {totalCount.toLocaleString()} 条记录
      </div>

      <input
        className="keyword-input"
        placeholder="关键词 / Keyword"
        value={filters.keyword}
        onChange={e => onChange({ ...filters, keyword: e.target.value })}
      />

      <div className="filter-section">
        <div className="filter-label">类型 / Type</div>
        {TYPES.map(t => (
          <button
            key={t}
            className={`chip ${filters.types.includes(t) ? 'chip-active' : ''}`}
            style={{ '--chip-color': TYPE_COLORS[t] }}
            onClick={() => toggleType(t)}
          >
            <span className="chip-dot" />
            {t}
          </button>
        ))}
      </div>

      <div className="filter-section">
        <div className="filter-label">母型 / Archetype</div>
        {ARCHETYPES.map(a => (
          <button
            key={a}
            className={`chip chip-plain ${filters.archetypes.includes(a) ? 'chip-plain-active' : ''}`}
            onClick={() => toggleArchetype(a)}
          >
            {a}
          </button>
        ))}
      </div>
    </aside>
  )
}
