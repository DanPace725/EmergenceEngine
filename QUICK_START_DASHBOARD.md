# Quick Start: Analysis Dashboard Navigation

## TL;DR

Your analysis dashboard can now be accessed as a page you can navigate to and from!

## Quick Test (3 steps)

1. **Generate the dashboard:**
   ```bash
   npm run analyze:dashboard
   ```

2. **Start the dev server:**
   ```bash
   npm start
   ```

3. **Navigate:**
   - Click the **📊 Analysis** button (top-right), OR press **D** key
   - On the dashboard, click **← Back to Simulation** to return

## What Changed?

### Before ❌
- Dashboard opened in a **new tab/window**
- Needed **two separate servers** (ports 3000 and 3001)
- Had to manually switch between tabs
- Used `npm run analyze:dashboard:serve`

### After ✅
- Dashboard opens in the **same window**
- Uses **single server** on port 3000
- **Back button** returns to simulation
- Use standard `npm start` + `npm run analyze:dashboard`

## Navigation Methods

### Go to Dashboard:
1. Click "📊 Analysis" button (top-right corner)
2. Press **D** key
3. Navigate to `/analysis/dashboard.html` in browser

### Return to Main Page:
1. Click "← Back to Simulation" button (top-left on dashboard)
2. Use browser back button
3. Navigate to `/` in browser

## File Locations

- **Main app**: `http://localhost:3000/`
- **Dashboard**: `http://localhost:3000/analysis/dashboard.html`
- **Generated from**: `analysis/dashboard-generator.js`

## Troubleshooting

**Dashboard shows 404:**
- Run `npm run analyze:dashboard` first
- Check that `analysis/dashboard.html` exists

**Dashboard is empty or shows old data:**
- Regenerate: `npm run analyze:dashboard`
- Refresh browser

**Navigation doesn't work:**
- Make sure dev server is running: `npm start`
- Check you're on port 3000 (not 3001)

## Full Documentation

- **User Guide**: See `DASHBOARD_NAVIGATION.md`
- **Technical Details**: See `IMPLEMENTATION_SUMMARY.md`

---

**Pro Tip:** You can use your browser's back/forward buttons to navigate between the simulation and dashboard naturally!

