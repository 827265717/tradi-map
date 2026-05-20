# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build
npm run preview    # Preview production build locally

# Regenerate folklore.json from Excel source files
python3 scripts/convert_data.py
```

No test suite is configured.

## Architecture

**TradiMap** is a Vite + React + Leaflet single-page app that visualizes 5,000+ traditional Chinese folklore entries (sourced from Weibo) on an interactive geospatial map.

### Data pipeline

Excel files at `/Users/didi/Desktop/民俗分布/*.xlsx` → `scripts/convert_data.py` → `public/data/folklore.json`. The Python script maps Excel filenames to `type` values via `FILE_TYPE_MAP`, extracts geo-tagged records, and writes the JSON. The JSON is fetched at runtime in `src/data/index.js`.

### State and filtering

`App.jsx` owns all filter state and loads data once on mount. `filteredEntries` is derived via `useMemo` from the full dataset and the active filters. The filter pipeline is: keyword search → type filter → archetype filter → festival filter.

### Component roles

| Component | Role |
|-----------|------|
| `App.jsx` | Data loading, all filter state, layout |
| `MapView.jsx` | Leaflet map with `MarkerClusterGroup`; markers colored by type |
| `FilterPanel.jsx` | Left sidebar — keyword search, type pills, archetype pills, result count |
| `Timeline.jsx` | Bottom scrollable bar — entries grouped by year then traditional festival |
| `EvidencePanel.jsx` | Right sidebar — detail view for the selected entry |

### Key constants (`src/constants/taxonomy.js`)

- **TYPES** (5): `曲艺·戏曲`, `节庆·花会`, `工艺·作坊`, `信仰·仪式`, `游艺·队列`
- **ARCHETYPES** (3): Abstract groupings ("Beaded Loop", "Parade", "Immersive") that map onto subsets of the 5 types
- **FESTIVALS** (10): Traditional festivals mapped to calendar months; used by the Timeline to bucket entries
- **TYPE_COLORS**: Color encoding used consistently across the map markers and filter UI

### Data schema (`folklore.json` entries)

```js
{
  id, type, bio, locationName, address,
  lat, lng,
  publishedAt, year,
  retweets, comments, likes,
  text   // original Weibo post
}
```

### Deployment

Hosted on Vercel. `vercel.json` configures an SPA rewrite (all routes → `index.html`) and cache headers for images.
