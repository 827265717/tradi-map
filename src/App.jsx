import { useState, useMemo, useEffect } from 'react'
import { loadFolkloreData } from './data'
import { FESTIVAL_MONTHS, FESTIVALS, ARCHETYPE_TYPES } from './constants/taxonomy'
import FilterPanel from './components/FilterPanel'
import MapView from './components/MapView'
import EvidencePanel from './components/EvidencePanel'
import Timeline from './components/Timeline'
import './App.css'

const DEFAULT_FILTERS = { keyword: '', types: [], archetypes: [], selectedFestival: null }

export default function App() {
  const [allData, setAllData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  useEffect(() => {
    loadFolkloreData()
      .then(data => setAllData(data))
      .catch(err => console.error('数据加载失败:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredEntries = useMemo(() => {
    return allData.filter(entry => {
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase()
        const searchable = `${entry.locationName} ${entry.address} ${entry.text}`.toLowerCase()
        if (!searchable.includes(kw)) return false
      }
      if (filters.types.length && !filters.types.includes(entry.type)) return false
      if (filters.archetypes.length) {
        const allowed = new Set(filters.archetypes.flatMap(a => ARCHETYPE_TYPES[a] || []))
        if (!allowed.has(entry.type)) return false
      }
      if (filters.selectedFestival != null) {
        const dashIdx = filters.selectedFestival.indexOf('-')
        const fYear = filters.selectedFestival.slice(0, dashIdx)
        const fName = filters.selectedFestival.slice(dashIdx + 1)
        if (entry.publishedAt?.slice(0, 4) !== fYear) return false
        const month = parseInt(entry.publishedAt?.slice(5, 7))
        if (!FESTIVAL_MONTHS[fName]?.includes(month)) return false
      }
      return true
    })
  }, [allData, filters])

  const handleFestivalSelect = key => {
    setFilters(prev => ({
      ...prev,
      selectedFestival: prev.selectedFestival === key ? null : key,
    }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <h1 className="header-title">民俗地图</h1>
          <span className="header-en">TradiMap</span>
        </div>
        <span className="header-sub">中国传统民俗文化地理分布图谱</span>
      </header>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <span className="loading-text">数据加载中…</span>
        </div>
      )}

      <div className="app-body">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          totalCount={allData.length}
          filteredCount={filteredEntries.length}
        />

        <div className="map-column">
          <MapView
            entries={filteredEntries}
            selectedEntry={selectedEntry}
            onSelect={setSelectedEntry}
            onDeselect={() => setSelectedEntry(null)}
          />
          <Timeline
            allEntries={allData}
            selectedFestival={filters.selectedFestival}
            onFestivalSelect={handleFestivalSelect}
          />
        </div>

        <EvidencePanel
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      </div>
      <footer className="app-footer">声明：数据来源模拟数据库，请勿商用。</footer>
    </div>
  )
}
