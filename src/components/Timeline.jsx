import { useMemo } from 'react'
import './Timeline.css'

export default function Timeline({ allEntries, selectedMonth, onMonthSelect }) {
  const { monthKeys, monthCounts, maxCount } = useMemo(() => {
    const counts = {}
    allEntries.forEach(e => {
      if (e.publishedAt && e.publishedAt.length >= 7) {
        const key = e.publishedAt.slice(0, 7) // "YYYY-MM"
        counts[key] = (counts[key] || 0) + 1
      }
    })
    const keys = Object.keys(counts).sort()
    const max = keys.length > 0 ? Math.max(...keys.map(k => counts[k])) : 1
    return { monthKeys: keys, monthCounts: counts, maxCount: max }
  }, [allEntries])

  if (monthKeys.length === 0) {
    return (
      <div className="timeline">
        <div className="timeline-label">时间轴 Timeline <em>发布时间分布</em></div>
      </div>
    )
  }

  const logMax = Math.log(maxCount + 1)
  const barHeight = count => Math.max(4, Math.round((Math.log(count + 1) / logMax) * 46))

  return (
    <div className="timeline">
      <div className="timeline-label">
        时间轴 Timeline <em>发布时间分布</em>
      </div>
      <div className="timeline-track">
        {monthKeys.map((key, i) => {
          const [yearStr, monthStr] = key.split('-')
          const isFirstOfYear = i === 0 || monthKeys[i - 1].slice(0, 4) !== yearStr
          const count = monthCounts[key]
          const isActive = selectedMonth === key

          return (
            <button
              key={key}
              className={[
                'month-node',
                isActive ? 'month-active' : '',
                isFirstOfYear ? 'month-first-year' : '',
              ].join(' ')}
              onClick={() => onMonthSelect(key)}
              title={`${yearStr}年${parseInt(monthStr)}月：${count.toLocaleString()} 条记录`}
            >
              <span className="month-bar" style={{ height: barHeight(count) }} />
              <span className="month-num">{parseInt(monthStr)}</span>
              <span className="year-tag">{isFirstOfYear ? yearStr : ''}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
