import { useState, useMemo, useEffect } from 'react'
import { loadFolkloreData } from './data'
import FilterPanel from './components/FilterPanel'
import MapView from './components/MapView'
import EvidencePanel from './components/EvidencePanel'
import Timeline from './components/Timeline'
import './App.css'

const DEFAULT_FILTERS = { keyword: '', types: [], selectedMonth: null }

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
      if (filters.selectedMonth != null && entry.publishedAt?.slice(0, 7) !== filters.selectedMonth) return false
      return true
    })
  }, [allData, filters])

  const handleMonthSelect = key => {
    setFilters(prev => ({
      ...prev,
      selectedMonth: prev.selectedMonth === key ? null : key,
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
            selectedMonth={filters.selectedMonth}
            onMonthSelect={handleMonthSelect}
          />
        </div>

        <EvidencePanel
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      </div>
    </div>
  )
}
