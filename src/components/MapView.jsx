import { useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import { TYPE_COLORS } from '../constants/taxonomy'
import './MapView.css'

const CHINA_CENTER = [35.8617, 104.1954]
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

function createPin(type, isSelected) {
  const color = TYPE_COLORS[type] || '#888'
  const w = isSelected ? 34 : 26
  const h = isSelected ? 44 : 34
  const shadow = isSelected
    ? '<filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.35)"/></filter>'
    : ''
  const filterAttr = isSelected ? 'filter="url(#sh)"' : ''
  const svg = `<svg width="${w}" height="${h}" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">
    <defs>${shadow}</defs>
    <path d="M13 0C5.8 0 0 5.8 0 13c0 3.3 1.2 6.3 3.2 8.6L13 34l9.8-12.4C24.8 19.3 26 16.3 26 13 26 5.8 20.2 0 13 0z" fill="${color}" ${filterAttr}/>
    <circle cx="13" cy="13" r="5.5" fill="white" opacity="0.92"/>
  </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h],
  })
}

function MapEventHandler({ markerClickedRef, onDeselect }) {
  useMapEvents({
    click: () => {
      if (markerClickedRef.current) {
        markerClickedRef.current = false
        return
      }
      onDeselect()
    },
  })
  return null
}

export default function MapView({ entries, selectedEntry, onSelect, onDeselect }) {
  const markerClickedRef = useRef(false)

  return (
    <div className="map-view">
      <MapContainer
        center={CHINA_CENTER}
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
        <MapEventHandler markerClickedRef={markerClickedRef} onDeselect={onDeselect} />
        <MarkerClusterGroup chunkedLoading>
          {entries.map(entry => (
            <Marker
              key={entry.id}
              position={[entry.lat, entry.lng]}
              icon={createPin(entry.type, selectedEntry?.id === entry.id)}
              eventHandlers={{
                click: () => {
                  markerClickedRef.current = true
                  onSelect(entry)
                },
              }}
            />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <div className="map-legend">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <span key={type} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            {type}
          </span>
        ))}
      </div>
    </div>
  )
}
