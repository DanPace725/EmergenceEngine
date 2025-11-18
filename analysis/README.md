# 📊 Analysis Dashboard System

## Overview

This directory contains the analysis and visualization system for the Emergence Engine. The enhanced dashboard provides beautiful, interactive visualizations of your simulation data.

## 🚀 Quick Start

```bash
# Generate the dashboard
npm run dashboard

# Start development server  
npm start

# Navigate to dashboard (click 📊 button or press D)
```

## 📁 Directory Structure

```
analysis/
├── lib/                              # Core libraries
│   ├── data-processor.js            # Unified data processing
│   └── chart-builder.js             # Chart.js utilities
│
├── enhanced-dashboard-generator.js   # Main generator
├── enhanced-dashboard.html          # Generated dashboard
│
├── dashboard-generator.js           # Legacy generator
├── dashboard.html                   # Legacy dashboard
│
├── 111520251643/                    # Adaptive heuristics data
│   └── ah-analysis-results.json
│
├── 111525/                          # Adaptive heuristics data
│   └── ah-analysis-results.json
│
├── experiments/                     # Experiment data
│   ├── Ex01-111525/
│   │   ├── C run/
│   │   │   ├── analysis-summary.json
│   │   │   ├── baseline-metrics-*.json
│   │   │   ├── config-profile-*.json
│   │   │   ├── essence-state-*.json
│   │   │   └── optimized-config-*.json
│   │   └── F run/
│   │       └── [same structure]
│   └── experiment-comparison.json
│
└── README.md                        # This file
```

## 🎨 Dashboard Features

### Multi-Data-Type Support
- **Adaptive Heuristics**: Parameter evolution, reward progression
- **Baseline Metrics**: Performance tracking over time
- **Experiment Comparisons**: Side-by-side analysis
- **Essence States**: World and agent snapshots
- **Config Profiles**: Optimized parameters

### Interactive Charts
- **Chart.js Integration**: Professional, interactive visualizations
- **Hover Tooltips**: Detailed information on demand
- **Zoom & Pan**: Explore data at any scale
- **Legend Toggle**: Show/hide datasets

### Modern UI
- **Tabbed Interface**: Organized views for different data types
- **Dark Theme**: Matches main application aesthetic
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Professional transitions

## 📊 Data Types

### Adaptive Heuristics
Files: `ah-analysis-results.json`

Contains:
- Snapshots of parameter evolution
- Baseline reward progression
- Training data statistics
- Gradient analysis
- Parameter correlations

### Baseline Metrics
Files: `baseline-metrics-*.json`

Contains:
- Agent performance over time
- Chi energy tracking
- Coverage and ROI metrics
- Heading entropy
- Find rates

### Experiment Summaries
Files: `analysis-summary.json`

Contains:
- Combined analysis of multiple file types
- Essence state snapshots
- Config profiles
- Optimized parameters

### Experiment Comparisons
Files: `experiment-comparison.json`

Contains:
- Side-by-side run comparisons
- Metric differences
- Statistical analysis
- Performance rankings

## 🔧 How It Works

### 1. Data Scanning
The generator automatically scans for:
- Adaptive heuristics folders with `ah-analysis-results.json`
- Experiment folders with `analysis-summary.json`
- Comparison files `experiment-comparison.json`

### 2. Data Processing
Each file is:
- Detected by type
- Normalized to common format
- Processed for visualization
- Converted to Chart.js format

### 3. Dashboard Generation
The system generates:
- HTML with embedded data
- Chart.js visualizations
- Tabbed interface
- Navigation controls

### 4. Viewing
Access via:
- Click "📊 Analysis" button on main page
- Press 'D' key from main page
- Direct URL: `/analysis/enhanced-dashboard.html`

## 🛠️ Commands

```bash
# Generate enhanced dashboard (recommended)
npm run dashboard
node analysis/enhanced-dashboard-generator.js

# Generate legacy dashboard
npm run analyze:dashboard
node analysis/dashboard-generator.js

# Start dev server
npm start

# Generate and serve
npm run dashboard && npm start
```

## 📚 Documentation

- **ENHANCED_DASHBOARD_COMPLETE.md** - Full implementation details
- **DASHBOARD_QUICK_REFERENCE.md** - Quick command reference
- **DASHBOARD_NAVIGATION.md** - Navigation system guide
- **DASHBOARD_REDESIGN_PLAN.md** - Design decisions and architecture
- **DASHBOARD_MOCKUP.md** - Visual design mockups

## 🎯 Supported Workflows

### Workflow 1: Single Analysis
```bash
1. Run simulation
2. Generate analysis data
3. npm run dashboard
4. View results
```

### Workflow 2: Experiment Comparison
```bash
1. Run multiple experiments
2. Use experiments/compare-experiments.js
3. npm run dashboard
4. View comparisons
```

### Workflow 3: Continuous Monitoring
```bash
1. Run simulation with periodic snapshots
2. Periodically regenerate dashboard
3. Track progress in real-time
```

## 🔍 Advanced Usage

### Custom Data Processing

```javascript
import { UnifiedDataProcessor } from './lib/data-processor.js';

const data = JSON.parse(fs.readFileSync('your-data.json'));
const processed = UnifiedDataProcessor.process(data);
```

### Custom Charts

```javascript
import { ChartBuilder } from './lib/chart-builder.js';

const chartConfig = ChartBuilder.buildLineChart(data, {
  // Custom options
});
```

### Custom Generators

See `enhanced-dashboard-generator.js` for reference implementation.

## 🐛 Troubleshooting

### Dashboard is Empty
**Cause**: No data generated  
**Fix**: Run your analysis scripts first

### Charts Don't Render
**Cause**: Chart.js CDN not loading  
**Fix**: Check internet connection, browser console

### Old Data Showing
**Cause**: Dashboard not regenerated  
**Fix**: Run `npm run dashboard` again

### Navigation Doesn't Work
**Cause**: Dev server not running  
**Fix**: Run `npm start`

## 🚧 Development

### Adding New Data Types

1. Add detection logic in `lib/data-processor.js` → `DataTypeDetector.detect()`
2. Add normalization method in `DataNormalizer`
3. Update scanner in `enhanced-dashboard-generator.js` → `scanAllData()`
4. Add tab generation in `generateTabContent()`

### Modifying Charts

1. Update chart configuration in `lib/chart-builder.js`
2. Modify chart data in normalization methods
3. Regenerate dashboard

### Styling Changes

1. Modify `generateCSS()` in enhanced-dashboard-generator.js
2. Regenerate dashboard
3. Refresh browser

## 📈 Performance

- Dashboard generation: < 1 second for 5 datasets
- Page load: < 1 second
- Chart rendering: Instant
- Memory usage: Minimal
- File size: ~50KB HTML

## 🔐 Security

- No server-side processing
- Static HTML generation
- CDN resources over HTTPS
- No data persistence
- No external APIs

## 🤝 Contributing

When adding analysis data:
1. Follow existing JSON structure conventions
2. Add metadata fields for tracking
3. Include timestamps
4. Document new data types

## 📝 License

Same as parent project (see root LICENSE file)

## 🎓 Learning Resources

- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Vite Build Tool](https://vitejs.dev/)

---

**Status**: ✅ Production Ready  
**Version**: 2.0 (Enhanced)  
**Last Updated**: 2025-11-16  
**Datasets**: 5 loaded (2 adaptive, 2 experiments, 1 comparison)  

For questions or issues, see the documentation files listed above.
