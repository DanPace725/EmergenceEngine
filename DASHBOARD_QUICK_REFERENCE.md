# 📊 Enhanced Dashboard - Quick Reference

## 🚀 Quick Commands

```bash
# Generate enhanced dashboard
npm run dashboard

# Start dev server
npm start

# Both at once
npm run dashboard && npm start
```

## 🔑 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **D** | Open dashboard from main page |
| **ESC** | Close modals |
| Mouse Wheel | Zoom charts |

## 🌐 URLs

| Page | URL |
|------|-----|
| Main App | `http://localhost:3000/` |
| Enhanced Dashboard | `http://localhost:3000/analysis/enhanced-dashboard.html` |
| Old Dashboard | `http://localhost:3000/analysis/dashboard.html` |

## 📂 Important Files

| File | Purpose |
|------|---------|
| `analysis/enhanced-dashboard-generator.js` | Main generator script |
| `analysis/lib/data-processor.js` | Data processing library |
| `analysis/lib/chart-builder.js` | Chart creation utilities |
| `analysis/enhanced-dashboard.html` | Generated dashboard (auto-created) |

## 🎯 Current Datasets (5 Total)

### Adaptive Heuristics (2)
- `111520251643` - 5 snapshots
- `111525` - 3 snapshots

### Experiments (2)
- `C run` - Baseline + config
- `F run` - Baseline + config

### Comparisons (1)
- `C run vs F run` - Full comparison

## 📊 Dashboard Tabs

| Tab | Shows |
|-----|-------|
| **Overview** | All datasets summary |
| **Adaptive Heuristics** | Parameter evolution, rewards |
| **Baseline Metrics** | Performance over time |
| **Comparison** | Side-by-side run analysis |

## 🎨 Chart Interactions

- **Hover** over data points for details
- **Scroll** to zoom in/out
- **Click legend** to hide/show datasets
- **Drag** to pan (when zoomed)

## 🔄 Workflow

```
1. Run your simulation
   ↓
2. Collect analysis data
   ↓
3. Run: npm run dashboard
   ↓
4. Navigate from main app (click 📊 or press D)
   ↓
5. Explore your data!
```

## ⚡ Pro Tips

1. **Regenerate often** - Dashboard is static, regenerate after new data
2. **Use tabs** - Different views for different insights
3. **Zoom charts** - Get detailed views of interesting regions
4. **Compare runs** - Use comparison tab for side-by-side analysis
5. **Export charts** - Right-click chart → Save image

## 🆘 Quick Fixes

| Problem | Solution |
|---------|----------|
| Empty dashboard | Run `npm run dashboard` |
| Charts missing | Check Chart.js CDN in browser console |
| Old data showing | Regenerate dashboard |
| Can't navigate back | Click "← Back to Simulation" button |
| Page not found | Ensure dev server is running |

## 📈 Data Types Supported

✅ Adaptive Heuristics (ah-analysis-results.json)  
✅ Baseline Metrics (baseline-metrics-*.json)  
✅ Experiment Summaries (analysis-summary.json)  
✅ Experiment Comparisons (experiment-comparison.json)  
✅ Essence States (essence-state-*.json)  
✅ Config Profiles (config-profile-*.json)  
✅ Optimized Configs (optimized-config-*.json)  

## 🎯 One-Liners

```bash
# View current data structure
ls analysis/*/ah-analysis-results.json

# Count experiments
ls analysis/experiments/*/analysis-summary.json | wc -l

# Quick regenerate and view
npm run dashboard && open analysis/enhanced-dashboard.html

# Check what data will be included
node analysis/enhanced-dashboard-generator.js | grep "Found"
```

## 💡 Remember

- Dashboard is **static** - regenerate after new data
- All data types automatically detected
- Chart.js loaded from CDN (needs internet)
- Mobile responsive (works on phones/tablets)
- Back button returns to simulation

---

**Quick Start**: `npm run dashboard && npm start` then press **D**! 🚀

