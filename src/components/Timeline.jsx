import { useMemo } from 'react'
import { FESTIVALS, FESTIVAL_MONTHS } from '../constants/taxonomy'
import './Timeline.css'

const NODE_WIDTH = 52 // must match .festival-node width in CSS

export default function Timeline({ allEntries, selectedFestival, onFestivalSelect }) {
  const { nodes, years } = useMemo(() => {
    const counts = {}
    allEntries.forEach(e => {
      if (!e.publishedAt || e.publishedAt.length < 7) return
      const year = e.publishedAt.slice(0, 4)
      const month = parseInt(e.publishedAt.slice(5, 7))
      for (const festival of FESTIVALS) {
        if (FESTIVAL_MONTHS[festival].includes(month)) {
          const key = `${year}-${festival}`
          counts[key] = (counts[key] || 0) + 1
          break
        }
      }
    })
    const yearSet = new Set()
    allEntries.forEach(e => {
      if (e.publishedAt?.length >= 4) yearSet.add(e.publishedAt.slice(0, 4))
    })
    const sortedYears = [...yearSet].sort()
    const nodeList = sortedYears.flatMap(year =>
      FESTIVALS.map(festival => ({
        key: `${year}-${festival}`,
        year,
        festival,
        count: counts[`${year}-${festival}`] || 0,
      }))
    )
    return { nodes: nodeList, years: sortedYears }
  }, [allEntries])

  if (nodes.length === 0) {
    return (
      <div className="timeline">
        <div className="timeline-label">时间轴 Timeline <em>沿革 / 年节 / 嬗值</em></div>
      </div>
    )
  }

  return (
    <div className="timeline">
      <div className="timeline-label">
        时间轴 Timeline <em>沿革 / 年节 / 嬗值</em>
      </div>
      <div className="timeline-scroll">
        <div className="festival-track">
          {nodes.map(node => (
            <button
              key={node.key}
              className={`festival-node${selectedFestival === node.key ? ' festival-active' : ''}`}
              onClick={() => onFestivalSelect(node.key)}
              title={`${node.year}年${node.festival}：${node.count.toLocaleString()} 条记录`}
            >
              <span className="festival-name">
                {node.festival}
                {node.count > 0 && (
                  <span className="festival-badge">{node.count > 99 ? '99+' : node.count}</span>
                )}
              </span>
              <span className="festival-dot" />
            </button>
          ))}
        </div>
        <div className="year-ruler">
          {years.map((year, i) => (
            <span
              key={year}
              className="year-tick"
              style={{ left: i * 10 * NODE_WIDTH }}
            >
              | {year}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
