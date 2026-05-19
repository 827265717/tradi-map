import { useState } from 'react'
import { TYPE_COLORS } from '../constants/taxonomy'
import './EvidencePanel.css'

export default function EvidencePanel({ entry, onClose }) {
  const [bioExpanded, setBioExpanded] = useState(false)

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
        <span className="evidence-label">微博记录</span>
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

        {/* Interaction counts */}
        <div className="interaction-row">
          <span className="interact-item">
            <span className="interact-icon">🔁</span>
            <span className="interact-num">{entry.retweets ?? 0}</span>
            <span className="interact-label">转发</span>
          </span>
          <span className="interact-divider" />
          <span className="interact-item">
            <span className="interact-icon">💬</span>
            <span className="interact-num">{entry.comments ?? 0}</span>
            <span className="interact-label">评论</span>
          </span>
          <span className="interact-divider" />
          <span className="interact-item">
            <span className="interact-icon">❤️</span>
            <span className="interact-num">{entry.likes ?? 0}</span>
            <span className="interact-label">点赞</span>
          </span>
        </div>

        {/* Bio (collapsible) */}
        {entry.bio && (
          <div className="bio-section">
            <button className="bio-toggle" onClick={() => setBioExpanded(e => !e)}>
              简介 {bioExpanded ? '▲' : '▼'}
            </button>
            {bioExpanded && <p className="bio-text">{entry.bio}</p>}
          </div>
        )}

        {/* Weibo text */}
        {entry.text && (
          <div className="weibo-section">
            <div className="weibo-label">微博正文</div>
            <p className="weibo-text">{entry.text}</p>
          </div>
        )}
      </div>
    </aside>
  )
}
