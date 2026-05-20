import { TYPE_COLORS } from '../constants/taxonomy'
import './EvidencePanel.css'

export default function EvidencePanel({ entry, onClose }) {
  if (!entry) {
    return (
      <aside className="evidence-panel evidence-empty">
        <div className="evidence-placeholder">
          <div className="placeholder-icon">◉</div>
          <p>选择地图上的标记<br />查看民俗详情</p>
          <p className="placeholder-hint">微博正文 / 地点 / 互动数据</p>
        </div>
      </aside>
    )
  }

  const color = TYPE_COLORS[entry.type] || '#888'
  const formattedDate = entry.publishedAt ? entry.publishedAt.slice(0, 16) : ''

  return (
    <aside className="evidence-panel">
      <div className="evidence-header">
        <span className="evidence-label">记录点</span>
        <button className="close-btn" onClick={onClose} title="关闭">×</button>
      </div>

      <div className="evidence-body">
        {/* Title + type */}
        <div className="entry-title-row">
          <h2 className="entry-title">{entry.locationName || '未知地点'}</h2>
          <span className="type-badge" style={{ background: color }}>
            {entry.type}
          </span>
        </div>

        {/* Meta */}
        <div className="entry-meta">
          {entry.address && (
            <div className="meta-row">
              <span className="meta-icon">📍</span>
              <span>{entry.address}</span>
            </div>
          )}
          {formattedDate && (
            <div className="meta-row">
              <span className="meta-icon">🕐</span>
              <span>{formattedDate}</span>
            </div>
          )}
        </div>

      </div>
    </aside>
  )
}
