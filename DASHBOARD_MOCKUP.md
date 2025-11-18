# Dashboard Redesign - Visual Mockup

## Current Dashboard vs. Proposed Dashboard

### Current Dashboard (Limited)

```
┌────────────────────────────────────────────────────────────┐
│ 🧠 Adaptive Heuristics Analysis Dashboard                 │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Total Runs: 2    Avg Final: 2.86    Best: 5.65          │
│                                                            │
│  Run Comparison Table                                      │
│  ┌────────────────────────────────────────────┐           │
│  │ ID    │ Snaps │ Start │ Final │ Peak │     │           │
│  │ 11152 │   5   │  2.30 │  5.65 │ 7.47 │     │           │
│  │ 11152 │   3   │  4.68 │  0.08 │ 4.68 │     │           │
│  └────────────────────────────────────────────┘           │
│                                                            │
│  Performance Timeline (Basic CSS dots)                     │
│  ▪ • ○ •   <-- Hard to read                              │
│                                                            │
│  Parameter Evolution (Basic CSS)                           │
│  ▪ ▪ • •   <-- Limited interactivity                     │
│                                                            │
└────────────────────────────────────────────────────────────┘

❌ Only shows adaptive heuristics data
❌ Basic CSS charts (no interaction)
❌ No upload capability
❌ No comparisons between data types
❌ Limited visual polish
```

---

### Proposed Dashboard (Enhanced)

```
┌────────────────────────────────────────────────────────────────────┐
│ [← Back to Sim]   Analysis Dashboard   [📤 Upload] [⚙️ Settings]  │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐        │
│  │ Overview │ Adaptive │ Baseline │ Configs  │ Compare  │  <Tabs │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘        │
│                                                                    │
│  📊 Performance Overview                          [Export Chart]  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │                                                              ││
│  │    8 ┤                    •  Chart.js Interactive           ││
│  │    6 ┤          •──•    •    - Hover for details            ││
│  │    4 ┤    •──•            •  - Zoom/pan                     ││
│  │    2 ┤  •                  • - Legend toggle                ││
│  │    0 └────────────────────────────────────────────────────  ││
│  │        T1   T2   T3   T4   T5                               ││
│  │                                                              ││
│  │    Legend: ━ Run 1 (hover: 5.65)  ━ Run 2 (hover: 0.08)   ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                    │
│  ┌────────────────────┐  ┌────────────────────┐                  │
│  │  📈 Summary Stats  │  │  💡 Key Insights   │                  │
│  │  ━━━━━━━━━━━━━━━━  │  │  ━━━━━━━━━━━━━━━━  │                  │
│  │  • Total Runs: 2   │  │  • Best: Run 1     │                  │
│  │  • Avg Final: 2.86 │  │  • +146% improve   │                  │
│  │  • Peak: 7.47      │  │  • Convergence: OK │                  │
│  │  • Timespan: 16m   │  │  • Stability: Low  │                  │
│  └────────────────────┘  └────────────────────┘                  │
│                                                                    │
│  🔍 Detailed Metrics                          [Filter] [Sort ↓]  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  Metric               │ Run 1  │ Run 2  │  Δ     │ Status  │ ││
│  │ ────────────────────────────────────────────────────────────│││
│  │  Final Reward         │  5.65  │  0.08  │ +5.57  │ ✓ Better│││
│  │  resourceAttraction   │  2.44  │  1.43  │ +1.01  │ ↑ Higher│││
│  │  moveSpeed            │  1.94  │  1.28  │ +0.66  │ ↑ Higher│││
│  │  exploreNoise         │  2.99  │  3.00  │ -0.01  │ ≈ Similar│││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                    │
│  [📥 Load More Data] [🗑️ Clear All] [📊 Export Report]          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

✅ All data types supported
✅ Interactive Chart.js visualizations
✅ Upload/import capability
✅ Side-by-side comparisons
✅ Professional UI polish
✅ Export functionality
```

---

## Tab Views

### Tab 1: Overview (Landing Page)

```
┌─────────────────────────────────────────────────┐
│ [Overview] Adaptive Baseline Configs Compare   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Welcome to Analysis Dashboard!                │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ 2 Datasets      │  │ 3 Data Types    │     │
│  │ Loaded          │  │ Available       │     │
│  └─────────────────┘  └─────────────────┘     │
│                                                 │
│  Quick Actions:                                │
│  • Upload new data                             │
│  • View adaptive heuristics                    │
│  • Compare experiments                         │
│  • Export reports                              │
│                                                 │
│  Recent Activity:                              │
│  ✓ Loaded run 111525 (5 snapshots)            │
│  ✓ Loaded run 111520 (3 snapshots)            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tab 2: Adaptive Heuristics

```
┌─────────────────────────────────────────────────┐
│ Overview [Adaptive] Baseline Configs Compare   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Parameter Evolution Over Time                 │
│  ┌───────────────────────────────────────────┐ │
│  │ Select Parameter: [▼ resourceAttraction]  │ │
│  │                                           │ │
│  │    2.5 ┤            •──────•              │ │
│  │    2.0 ┤      •──•                        │ │
│  │    1.5 ┤  •                               │ │
│  │    1.0 ┤                                  │ │
│  │        └────────────────────────────────  │ │
│  │         S1   S2   S3   S4   S5           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Correlation Analysis                          │
│  High correlation: resourceAttraction (+0.85) │
│  Low correlation: exploreNoise (-0.12)        │
│                                                 │
│  Training Progress                             │
│  [Chart showing gradients over time]          │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tab 3: Baseline Metrics

```
┌─────────────────────────────────────────────────┐
│ Overview Adaptive [Baseline] Configs Compare   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Performance Metrics                           │
│  ┌───────────────────────────────────────────┐ │
│  │ Metric: [▼ Mean Chi]                      │ │
│  │                                           │ │
│  │   200 ┤  Run F                            │ │
│  │   150 ┤     ••••                          │ │
│  │   100 ┤ ••••     Run C                    │ │
│  │    50 ┤          ••••                     │ │
│  │     0 └────────────────────────────────   │ │
│  │        T1   T2   T3   T4   T5            │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Run Statistics                                │
│  ┌──────────┬─────────┬─────────┐            │
│  │          │ Run C   │ Run F   │            │
│  │ Alive    │ 1.0     │ 1.0     │            │
│  │ Mean Chi │ 85.31   │ 155.36  │            │
│  │ Coverage │ 0.164   │ 0.177   │            │
│  │ ROI      │ 15      │ 12      │            │
│  └──────────┴─────────┴─────────┘            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tab 4: Config Profiles

```
┌─────────────────────────────────────────────────┐
│ Overview Adaptive Baseline [Configs] Compare   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Optimized Parameters                          │
│                                                 │
│  Generation: 5                                 │
│  Best Fitness: 0.892                           │
│  Convergence: 87.3%                            │
│                                                 │
│  Parameter Heatmap                             │
│  ┌───────────────────────────────────────────┐ │
│  │ moveSpeed    ████████░░  0.85             │ │
│  │ turnRate     ███████░░░  0.72             │ │
│  │ senseRange   ██████████  0.95             │ │
│  │ frustration  █████░░░░░  0.51             │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Optimization History                          │
│  [Chart showing fitness over generations]     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tab 5: Compare View

```
┌─────────────────────────────────────────────────┐
│ Overview Adaptive Baseline Configs [Compare]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Select Runs to Compare:                       │
│  [✓] Run C (111525)  [✓] Run F (111525)       │
│  [ ] Run 111520      [ ] Run 1115252003        │
│                                                 │
│  Side-by-Side Comparison                       │
│  ┌────────────────┬────────────────┐           │
│  │   Run C        │   Run F        │           │
│  │ ┌────────────┐ │ ┌────────────┐ │           │
│  │ │ Chi: 85.31 │ │ │ Chi: 155.36│ │           │
│  │ │     ▂▃▅▆   │ │ │     ▅▇█▇   │ │           │
│  │ └────────────┘ │ └────────────┘ │           │
│  └────────────────┴────────────────┘           │
│                                                 │
│  Differential Analysis                         │
│  ┌───────────────────────────────────────────┐ │
│  │  ▲ Mean Chi:      +82% (Run F better)    │ │
│  │  ▲ Coverage:      +7.9% (Run F better)   │ │
│  │  ▼ ROI:           -20% (Run C better)    │ │
│  │  ≈ Alive Ratio:   No change (both 1.0)   │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Winner: Run F (4 of 6 metrics better)        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Upload Modal

```
┌─────────────────────────────────────────────────┐
│  Upload Analysis Data                     [×]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │                                         │   │
│  │     📁 Drag & Drop JSON Files Here     │   │
│  │                                         │   │
│  │         or click to browse              │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Supported file types:                         │
│  ✓ adaptive-heuristics-*.json                 │
│  ✓ baseline-metrics-*.json                    │
│  ✓ analysis-summary.json                      │
│  ✓ experiment-comparison.json                 │
│  ✓ essence-state-*.json                       │
│                                                 │
│  Recently Uploaded:                            │
│  • ah-analysis-results.json (2.3 KB)          │
│  • baseline-metrics-2025-11-16.json (5.1 KB)  │
│                                                 │
│  [Upload] [Cancel]                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Chart Interactions

### Hover Tooltip

```
    │                  ┌──────────────────┐
    │              •   │ Run 111525       │
    ├──────────────────│ Snapshot 3       │
    │          •       │ Reward: 5.15     │
    │      •           │ Time: 16:42      │
    │  •               └──────────────────┘
    ├──────────────────────────────────────
```

### Zoom Controls

```
┌────────────────────────────────────┐
│  [🔍+] [🔍-] [⟲ Reset]  [📷 Save] │
└────────────────────────────────────┘
```

### Legend Interaction

```
Legend: [Click to toggle]
  ■ Run 1 (visible)
  □ Run 2 (hidden - clicked)
  ■ Run 3 (visible)
```

---

## Export Options

```
┌─────────────────────────────────────┐
│  Export Dashboard              [×]  │
├─────────────────────────────────────┤
│                                     │
│  Format:                            │
│  ( ) PNG Image                      │
│  ( ) PDF Report                     │
│  (•) JSON Data                      │
│  ( ) CSV Spreadsheet                │
│                                     │
│  Include:                           │
│  [✓] Charts                         │
│  [✓] Summary Statistics             │
│  [✓] Detailed Metrics               │
│  [ ] Raw Data                       │
│                                     │
│  [Export] [Cancel]                  │
│                                     │
└─────────────────────────────────────┘
```

---

## Mobile Responsive

```
┌─────────────────────┐
│  ≡  Analysis        │ ← Hamburger menu
├─────────────────────┤
│                     │
│  [Upload]           │
│                     │
│  Overview ▼         │ ← Dropdown
│                     │
│  ┌───────────────┐  │
│  │               │  │ ← Stacked
│  │    Chart      │  │   charts
│  │               │  │
│  └───────────────┘  │
│                     │
│  ┌───────────────┐  │
│  │  Summary      │  │
│  │  Stats        │  │
│  └───────────────┘  │
│                     │
│  [View More]        │
│                     │
└─────────────────────┘
```

---

## Key Improvements Summary

### Visual Enhancements
✅ **Chart.js integration** - Interactive, beautiful charts
✅ **Responsive layout** - Works on all screen sizes
✅ **Color-coded metrics** - Green (good), red (bad), yellow (neutral)
✅ **Professional typography** - Consistent, readable fonts
✅ **Smooth animations** - Polished transitions

### Functionality Enhancements
✅ **Multi-data-type support** - All JSON formats
✅ **Upload system** - Drag-and-drop or browse
✅ **Comparison tools** - Side-by-side analysis
✅ **Export capabilities** - Multiple formats
✅ **Filter & search** - Find what you need

### UX Enhancements
✅ **Intuitive navigation** - Tab-based interface
✅ **Hover tooltips** - Contextual information
✅ **Keyboard shortcuts** - Power user features
✅ **Loading states** - Progress indicators
✅ **Error handling** - Helpful error messages

---

## What do you think?

This is the vision for the enhanced dashboard. We can build this in phases:

1. **Phase 1**: Enhanced static dashboard with Chart.js (2-3 sessions)
2. **Phase 2**: Add upload capability (1-2 sessions)
3. **Phase 3**: Comparison tools (1-2 sessions)
4. **Phase 4**: Polish & export (1 session)

Ready to start? Let me know which phase you'd like to begin with!

