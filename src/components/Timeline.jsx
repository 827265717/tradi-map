import { useMemo } from 'react'
import './Timeline.css'

export default function Timeline({ allEntries, selectedYear, onYearSelect }) {
  const { years, yearCounts, maxCount } = useMemo(() => {
    const counts = {}
    allEntries.forEach(e => {
      if (e.year) counts[e.year] = (counts[e.year] || 0) + 1
    })
    const years = Object.keys(counts).map(Number).sort((a, b) => a - b)
    const maxCount = years.length > 0 ? Math.max(...years.map(y => counts[y])) : 1
    return { years, yearCounts: counts, maxCount }
  }, [allEntries])

  if (years.length === 0) {
    return (
      <div className="timeline">
        <div className="timeline-label">时间轴 Timeline <em>发布时间分布</em></div>
      </div>
    )
  }

  const logMax = Math.log(maxCount + 1)
  const barHeight = count => Math.max(6, Math.round((Math.log(count + 1) / logMax) * 46))

  return (
    <div className="timeline">
      <div className="timeline-label">
        时间轴 Timeline <em>发布时间分布</em>
      </div>
      <div className="timeline-track">
        {years.map(year => {
          const count = yearCounts[year] || 0
          const isActive = selectedYear === year
          return (
            <button
              key={year}
              className={`year-node ${isActive ? 'year-active' : ''}`}
              onClick={() => onYearSelect(year)}
              title={`${year}年：${count.toLocaleString()} 条记录`}
            >
              <span className="year-bar" style={{ height: barHeight(count) }} />
              <span className="year-label">{year}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
