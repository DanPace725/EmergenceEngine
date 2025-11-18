# Visual Guide: Dashboard Navigation

## Main Simulation Page

```
┌────────────────────────────────────────────────────────────────┐
│  Emergence Engine          🚀 Quick Start  📊 Analysis  📚 💬 │ ← Header
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                                                                │
│                    [Simulation Canvas]                         │
│                                                                │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  [K] Toggle  [Space] Pause  [R] Reset  [D] Analysis  [O] Cfg  │ ← Hotkeys
└────────────────────────────────────────────────────────────────┘
```

**To open dashboard:**
- Click "📊 Analysis" button in header, OR
- Press **D** key

---

## Analysis Dashboard Page

```
┌────────────────────────────────────────────────────────────────┐
│  [← Back to Simulation]         Analysis Dashboard            │ ← Navigation Bar (NEW!)
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  🧠 Adaptive Heuristics Analysis Dashboard                    │
│                                                                │
│  📊 Summary Statistics                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Total Runs│  │Avg Final │  │Best Final│  │Avg Peak  │     │
│  │    2     │  │   2.86   │  │   5.65   │  │   6.07   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                                │
│  📊 Run Comparison                                             │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Run ID   │ Snapshots │ Start │ Final │ Peak │ ... │   │
│  ├──────────┼───────────┼───────┼───────┼──────┼─────┤   │
│  │ 111520... │     5     │  2.30 │  5.65 │ 7.47 │ ... │   │
│  │ 111525   │     3     │  4.68 │  0.08 │ 4.68 │ ... │   │
│  └──────────┴───────────┴───────┴───────┴──────┴─────┘   │
│                                                                │
│  📈 Performance Timelines                                      │
│  [Charts showing reward evolution...]                          │
│                                                                │
│  🔧 Parameter Evolution                                        │
│  [Charts showing parameter changes...]                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**To return to simulation:**
- Click "← Back to Simulation" button, OR
- Use browser back button

---

## Navigation Flow Diagram

```
     ┌─────────────────────┐
     │   Main Simulation   │
     │                     │
     │  [📊 Analysis]      │
     │  or press 'D'       │
     └─────────┬───────────┘
               │
               │ Navigate
               ↓
     ┌─────────────────────┐
     │ Analysis Dashboard  │
     │                     │
     │ [← Back to Sim]     │
     └─────────┬───────────┘
               │
               │ Navigate
               ↓
     ┌─────────────────────┐
     │   Main Simulation   │
     └─────────────────────┘
```

---

## Header Comparison

### Main Page Header
```
┌────────────────────────────────────────────────────────────┐
│  Emergence Engine    🚀 Quick Start │ 📊 Analysis │ 📚 │ 💬│
│                                                            │
└────────────────────────────────────────────────────────────┘
                                      ↑
                                 Click here!
```

### Dashboard Header
```
┌────────────────────────────────────────────────────────────┐
│  [← Back to Simulation]         Analysis Dashboard        │
│   ↑                                                        │
└────────────────────────────────────────────────────────────┘
    Click here to return!
```

---

## Key Features

✅ **Single Window Navigation**
- No more multiple tabs or windows
- Clean, integrated experience

✅ **Browser History Works**
- Back/forward buttons work naturally
- Can bookmark dashboard URL

✅ **Keyboard Friendly**
- Press 'D' from main page to jump to dashboard
- ESC could return (future enhancement)

✅ **Consistent Styling**
- Dashboard matches main app aesthetic
- Same color scheme and fonts
- Professional fixed navigation bar

✅ **Single Server**
- Everything on port 3000
- Simpler development workflow
- Easier deployment

---

## Color Scheme

Both pages share a consistent dark theme:

- **Background**: Dark blue-black (#1a1a2e, #000)
- **Primary**: Bright green (#00ff88, #00ffaa)
- **Secondary**: Cyan (#00ccff)
- **Accents**: Orange (#ffaa00), Red (#ff5555)
- **Font**: Monospace (ui-mono, Consolas, Menlo)

This creates a terminal/sci-fi aesthetic that's consistent across the entire application.

---

## Before vs After

### Old Workflow
```
Terminal 1: npm start              (port 3000)
Terminal 2: npm run analyze:...:serve (port 3001)

Browser Tab 1: Simulation
Browser Tab 2: Dashboard (separate window)

❌ Need two servers
❌ Dashboard opens in new tab
❌ Manual tab switching
❌ Different ports
```

### New Workflow
```
Terminal: npm start                (port 3000)

Browser: Single window
  - Main page
  - Dashboard page (navigate to)

✅ One server
✅ Same window navigation
✅ Natural back button
✅ Single port
✅ Cleaner, simpler
```

---

## Testing Checklist

Try these to verify everything works:

1. ✅ Generate dashboard: `npm run analyze:dashboard`
2. ✅ Start server: `npm start`
3. ✅ Click "📊 Analysis" button
4. ✅ See dashboard with navigation bar
5. ✅ Click "← Back to Simulation"
6. ✅ Return to main page
7. ✅ Press 'D' key to return to dashboard
8. ✅ Use browser back button
9. ✅ Use browser forward button
10. ✅ Verify styles look good on both pages

---

**Enjoy your new integrated dashboard navigation! 🎉**

