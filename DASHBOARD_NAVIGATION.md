# Analysis Dashboard Navigation

## Overview

The Emergence Engine now includes an integrated analysis dashboard that you can navigate to and from the main simulation page.

## Setup and Usage

### 1. Generate the Dashboard

Before you can access the dashboard, you need to generate it from your analysis data:

```bash
npm run analyze:dashboard
```

This command will:
- Scan the `analysis/` directory for folders containing `ah-analysis-results.json` files
- Compile all analysis data into a comprehensive dashboard
- Generate `analysis/dashboard.html`

### 2. Start the Development Server

Start the Vite development server:

```bash
npm start
```

This will serve both the main simulation (index.html) and the analysis dashboard on port 3000.

### 3. Navigate to the Dashboard

You have two ways to access the dashboard:

#### Option A: Click the Analysis Button
- Look for the **📊 Analysis** button in the top-right corner of the main page
- Click it to navigate to the dashboard

#### Option B: Use the Keyboard Shortcut
- Press **D** key while on the main simulation page
- This will navigate you to the dashboard

### 4. Return to the Main Simulation

From the dashboard page:
- Click the **← Back to Simulation** button in the top-left corner
- This will take you back to the main simulation page

## Important Notes

- **Generate First**: Always run `npm run analyze:dashboard` before trying to access the dashboard
- **Data Updates**: If you want to see updated analysis, regenerate the dashboard with the command above
- **Single Server**: Unlike the previous setup, you no longer need to run a separate server on port 3001
- **Browser History**: You can use your browser's back/forward buttons to navigate between pages

## Analysis Data Structure

The dashboard looks for analysis data in the following structure:

```
analysis/
├── 111520251643/
│   └── ah-analysis-results.json
├── 111525/
│   └── ah-analysis-results.json
├── dashboard-generator.js
└── dashboard.html (generated)
```

## Dashboard Features

The analysis dashboard displays:
- **Summary Statistics**: Total runs, average rewards, peak performance
- **Run Comparison Table**: Detailed comparison of all analysis runs
- **Performance Timelines**: Visual charts showing reward evolution over time
- **Parameter Evolution**: Charts showing how key parameters changed during training

## Troubleshooting

### Dashboard shows "404 Not Found"
- Make sure you've run `npm run analyze:dashboard` first
- Check that `analysis/dashboard.html` exists

### Dashboard is empty or shows old data
- Regenerate the dashboard: `npm run analyze:dashboard`
- Refresh your browser after regenerating

### Navigation doesn't work
- Ensure you're running the dev server with `npm start`
- Check that you're accessing the site through `localhost:3000`

## Development Workflow

Typical workflow when analyzing runs:

1. Run your simulation and collect analysis data
2. Generate the dashboard: `npm run analyze:dashboard`
3. Start the dev server: `npm start` (if not already running)
4. Navigate to the dashboard using the button or **D** key
5. Review your analysis
6. Return to the simulation using the back button
7. Make adjustments and repeat

## Previous Setup (Deprecated)

The old setup required running two separate servers:
- `npm start` on port 3000 for the main simulation
- `npm run analyze:dashboard:serve` on port 3001 for the dashboard

This has been simplified to a single server setup with proper page navigation.

