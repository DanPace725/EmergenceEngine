# Dashboard Redesign Plan

## Current State Analysis

### Existing Data Types

1. **Adaptive Heuristics** (`ah-analysis-results.json`)
   - Snapshots of parameter evolution
   - Baseline rewards over time
   - Training data statistics
   - Gradient analysis
   - Correlations

2. **Experiment Analysis** (`analysis-summary.json`)
   - Baseline metrics (alive_ratio, mean_chi, coverage, etc.)
   - Config profiles (optimized parameters)
   - Optimized configs (generation, fitness, convergence)
   - Essence states (world state, agents, resources)

3. **Experiment Comparisons** (`experiment-comparison.json`)
   - Side-by-side run comparisons
   - Metric ranges and differences
   - Best/worst performers

### Current Limitations

- Dashboard only shows adaptive heuristics data
- No support for experiment data or comparisons
- Charts are basic CSS-based (limited interactivity)
- No way to select which data to view
- No upload or file selection system
- Limited visual polish

## Proposed Solution: Multi-Step Implementation

### 🎯 Step 1: Unified Data Processor (Foundation)

**Goal**: Create a single system that can load and normalize all JSON types

**Tasks**:
- [ ] Create `DataTypeDetector` class to identify JSON structure
- [ ] Create `DataNormalizer` class to convert all types to common format
- [ ] Create `DataRegistry` to manage multiple loaded datasets
- [ ] Add support for all 3 data types
- [ ] Write tests for data detection and normalization

**Files to Create**:
- `analysis/lib/data-processor.js`
- `analysis/lib/data-detector.js`
- `analysis/lib/data-normalizer.js`

**Output**: Universal data loading system

---

### 🎯 Step 2: Enhanced Dashboard Generator

**Goal**: Extend generator to support all data types with better visuals

**Tasks**:
- [ ] Refactor dashboard generator to use new data processor
- [ ] Add Chart.js library for interactive charts
- [ ] Create chart templates for each data type
- [ ] Add data type selector/tabs in UI
- [ ] Improve responsive layout
- [ ] Add dark theme polish

**Files to Modify**:
- `analysis/dashboard-generator.js`

**Files to Create**:
- `analysis/lib/chart-builder.js`
- `analysis/templates/` (HTML/CSS templates)

**Output**: Beautiful, multi-data-type dashboard

---

### 🎯 Step 3: Client-Side Dashboard (Interactive)

**Goal**: Convert to browser-based dashboard that can load JSON dynamically

**Tasks**:
- [ ] Create single-page app structure
- [ ] Add file upload/selection UI
- [ ] Implement drag-and-drop for JSON files
- [ ] Add data caching in localStorage
- [ ] Create dataset manager (view/remove loaded data)
- [ ] Add real-time chart updates

**Files to Create**:
- `analysis/dashboard-app.html` (main SPA)
- `analysis/js/dashboard-app.js`
- `analysis/js/file-handler.js`
- `analysis/js/chart-manager.js`
- `analysis/css/dashboard.css`

**Output**: Interactive, upload-capable dashboard

---

### 🎯 Step 4: Comparison & Differential Views

**Goal**: Add side-by-side comparisons and diff visualizations

**Tasks**:
- [ ] Add comparison mode toggle
- [ ] Create side-by-side chart views
- [ ] Add differential charts (showing deltas)
- [ ] Implement metric highlighting (improvements/regressions)
- [ ] Add statistical significance indicators
- [ ] Create summary comparison cards

**Files to Create**:
- `analysis/js/comparison-engine.js`
- `analysis/templates/comparison-view.html`

**Output**: Powerful comparison tools

---

### 🎯 Step 5: Advanced Features (Polish)

**Goal**: Add professional features and UX improvements

**Tasks**:
- [ ] Add data export (CSV, JSON, images)
- [ ] Implement chart zoom/pan
- [ ] Add annotations to charts
- [ ] Create shareable dashboard URLs
- [ ] Add keyboard shortcuts
- [ ] Implement search/filter
- [ ] Add dark/light theme toggle
- [ ] Create dashboard presets/templates

**Output**: Production-ready dashboard

---

## Recommended Approach

### Phase 1: Foundation (Steps 1-2)
**Time**: 2-3 sessions
**Priority**: HIGH
**Goal**: Get all data types displaying in improved dashboard

### Phase 2: Interactivity (Step 3)
**Time**: 1-2 sessions
**Priority**: MEDIUM
**Goal**: Add upload system and dynamic loading

### Phase 3: Analysis (Step 4)
**Time**: 1-2 sessions
**Priority**: MEDIUM
**Goal**: Add comparison tools

### Phase 4: Polish (Step 5)
**Time**: 1-2 sessions
**Priority**: LOW
**Goal**: Professional features

---

## Technical Stack Recommendations

### Charting Library Options

1. **Chart.js** ✅ RECOMMENDED
   - Simple, beautiful defaults
   - Good performance
   - Extensive plugin ecosystem
   - Dark theme support

2. **Plotly.js** (Alternative)
   - More features
   - Better for scientific visualizations
   - Larger bundle size

3. **D3.js** (Advanced)
   - Maximum flexibility
   - Steeper learning curve
   - Best for custom visualizations

### UI Framework Options

1. **Vanilla JS + Modern CSS** ✅ RECOMMENDED
   - No build step
   - Fast loading
   - Full control
   - Matches current setup

2. **Lit/Web Components** (Alternative)
   - Component-based
   - Small bundle
   - Good for complex UIs

### File Upload

- **Native File API** ✅
  - `<input type="file">`
  - Drag & drop events
  - FileReader API
  - No dependencies

---

## Visual Design Goals

### Layout Improvements

```
┌─────────────────────────────────────────────────────────────┐
│ [← Back]  Analysis Dashboard  [Upload] [Export] [Settings] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────┬─────────┬─────────┬─────────┐                 │
│ │ Adaptive│ Baseline│ Configs │ Compare │  <-- Tabs       │
│ └─────────┴─────────┴─────────┴─────────┘                 │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐ │
│ │                                                       │ │
│ │            Interactive Chart Area                    │ │
│ │          (Chart.js with zoom/pan)                    │ │
│ │                                                       │ │
│ └───────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────┐  ┌─────────────────┐                 │
│ │  Summary Stats  │  │  Key Insights   │                 │
│ │  - Run count    │  │  - Best run     │                 │
│ │  - Avg perf     │  │  - Trends       │                 │
│ └─────────────────┘  └─────────────────┘                 │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐ │
│ │              Detailed Data Table                      │ │
│ │         (Sortable, filterable)                        │ │
│ └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Color Scheme

- **Primary**: #00ff88 (bright green - current)
- **Secondary**: #00ccff (cyan - current)
- **Background**: #1a1a2e (dark blue - current)
- **Surface**: #16213e (lighter dark)
- **Success**: #00ff88
- **Warning**: #ffaa00
- **Error**: #ff5555
- **Text**: #e6f3ec

### Typography

- **Headings**: ui-mono, bold
- **Body**: ui-mono, regular
- **Data**: Monospace for numbers
- **Charts**: Sans-serif for labels

---

## Data Structure Proposal

### Unified Data Format

```javascript
{
  dataType: 'adaptive-heuristics' | 'baseline-metrics' | 'experiment-comparison',
  metadata: {
    source: 'file path or name',
    timestamp: 'ISO timestamp',
    runId: 'unique identifier',
    ...
  },
  timeSeries: [
    {
      timestamp: 'ISO or tick',
      metrics: {
        key: value,
        ...
      }
    }
  ],
  summary: {
    // Aggregated stats
  },
  raw: {
    // Original JSON for reference
  }
}
```

---

## Next Steps

### Immediate Actions

1. **Decide on approach**: 
   - Generate static dashboard (faster, simpler)
   - Build interactive SPA (more features, complexity)
   - Hybrid (static with optional upload)

2. **Choose charting library**:
   - Chart.js (recommended for simplicity)
   - Plotly (for advanced features)
   - Custom CSS (current approach, limited)

3. **Prioritize features**:
   - Must-have: All data types, better visuals
   - Should-have: Upload system, comparisons
   - Nice-to-have: Export, annotations, themes

### Questions to Consider

1. **Usage Pattern**: Will you primarily:
   - Generate dashboards from command line?
   - Upload JSON files interactively?
   - Both?

2. **Data Volume**: How many runs do you typically compare?
   - 2-5 (simple comparison)
   - 10+ (need filtering/search)
   - 50+ (need performance optimization)

3. **Sharing**: Do you need to:
   - Share dashboards with others?
   - Export charts as images?
   - Generate reports?

---

## Success Metrics

- ✅ Dashboard displays all 3 data types
- ✅ Charts are interactive (zoom, hover, etc.)
- ✅ Upload system works smoothly
- ✅ Comparisons are clear and useful
- ✅ UI is polished and professional
- ✅ Performance is good (< 1s load time)
- ✅ Mobile-responsive layout

---

## Timeline Estimate

**Conservative**: 6-8 sessions (1-2 weeks)
**Aggressive**: 3-4 sessions (3-4 days)
**Realistic**: 4-6 sessions (1 week)

Each "session" = 30-60 minutes of focused work.

---

## Let's Decide!

Which approach do you prefer?

**Option A: Enhanced Static Dashboard** (Faster)
- Generate HTML with Chart.js
- All data types supported
- Beautiful, interactive charts
- No upload system (generate from CLI)
- 2-3 sessions to complete

**Option B: Interactive SPA** (More Features)
- Browser-based app
- Upload any JSON file
- Dynamic chart generation
- Compare multiple datasets
- 4-5 sessions to complete

**Option C: Hybrid** (Balanced)
- Generate static dashboard with Chart.js
- Add optional upload feature
- Best of both worlds
- 3-4 sessions to complete

---

**My Recommendation**: Start with **Option A** (Enhanced Static Dashboard) for quick wins, then add upload later if needed.

