import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AnalysisDashboardGenerator {
  constructor() {
    this.analysisFolders = [];
    this.analysisData = [];
  }

  /**
   * Scan analysis directory for folders containing AH analysis results
   */
  scanAnalysisFolders() {
    const items = fs.readdirSync(__dirname);

    this.analysisFolders = items.filter(item => {
      const itemPath = path.join(__dirname, item);
      return fs.statSync(itemPath).isDirectory() &&
             fs.existsSync(path.join(itemPath, 'ah-analysis-results.json'));
    }).sort();

    console.log(`Found ${this.analysisFolders.length} analysis folders: ${this.analysisFolders.join(', ')}`);
  }

  /**
   * Load analysis data from all folders
   */
  loadAnalysisData() {
    this.analysisData = this.analysisFolders.map(folder => {
      const resultsPath = path.join(__dirname, folder, 'ah-analysis-results.json');
      const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

      // Add folder name for reference
      data.folder = folder;
      data.runId = folder;

      return data;
    });

    console.log(`Loaded analysis data for ${this.analysisData.length} runs`);
  }

  /**
   * Calculate summary statistics across all runs
   */
  calculateSummaryStats() {
    const runs = this.analysisData;
    const totalRuns = runs.length;

    // Find best and worst performing runs
    const runPerformances = runs.map(run => ({
      folder: run.folder,
      finalReward: run.snapshots[run.snapshots.length - 1].baselineReward,
      peakReward: Math.max(...run.snapshots.map(s => s.baselineReward)),
      improvement: run.snapshots.length > 1 ?
        run.snapshots[run.snapshots.length - 1].baselineReward - run.snapshots[0].baselineReward : 0
    }));

    const bestRun = runPerformances.reduce((best, current) =>
      current.finalReward > best.finalReward ? current : best);

    const worstRun = runPerformances.reduce((worst, current) =>
      current.finalReward < worst.finalReward ? current : worst);

    const avgFinalReward = runPerformances.reduce((sum, run) => sum + run.finalReward, 0) / totalRuns;
    const avgPeakReward = runPerformances.reduce((sum, run) => sum + run.peakReward, 0) / totalRuns;

    return {
      totalRuns,
      bestRun,
      worstRun,
      avgFinalReward,
      avgPeakReward,
      runPerformances
    };
  }

  /**
   * Generate HTML for performance timeline charts
   */
  generatePerformanceCharts() {
    let html = '<h2>📈 Performance Timelines</h2>';

    this.analysisData.forEach(run => {
      const snapshots = run.snapshots;
      const times = snapshots.map((s, i) => i + 1);
      const rewards = snapshots.map(s => s.baselineReward);

      // Normalize rewards for charting (0-100 scale)
      const minReward = Math.min(...rewards);
      const maxReward = Math.max(...rewards);
      const range = maxReward - minReward;
      const normalizedRewards = rewards.map(r => range > 0 ? ((r - minReward) / range) * 100 : 50);

      html += `
        <div class="chart-container">
          <h3>Run ${run.folder}</h3>
          <div class="timeline-chart">
            ${times.map((time, i) => `
              <div class="timeline-point" style="left: ${(time-1) / (times.length-1) * 100}%; top: ${100 - normalizedRewards[i]}%">
                <div class="point-label">T${time}: ${rewards[i].toFixed(2)}</div>
              </div>
            `).join('')}
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="legend-color" style="background: #00ffaa;"></span>
              Baseline Reward: ${rewards[rewards.length-1].toFixed(2)}
            </div>
            <div class="legend-item">
              <span class="legend-color" style="background: #00ccff;"></span>
              Peak: ${maxReward.toFixed(2)}
            </div>
          </div>
        </div>`;
    });

    return html;
  }

  /**
   * Generate HTML for parameter evolution charts
   */
  generateParameterCharts() {
    const keyParams = ['resourceAttractionStrength', 'moveSpeedPxPerSec', 'exploreNoiseBase', 'turnRateGain'];

    let html = '<h2>🔧 Parameter Evolution</h2>';

    keyParams.forEach(param => {
      html += `
        <div class="chart-container">
          <h3>${param}</h3>
          <div class="param-chart">`;

      this.analysisData.forEach((run, runIndex) => {
        const values = run.snapshots.map(s => s.keyMultipliers[param]);
        const times = run.snapshots.map((s, i) => i + 1);

        // Normalize values for charting
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const range = maxVal - minVal;
        const normalizedValues = values.map(v => range > 0 ? ((v - minVal) / range) * 80 + 10 : 50);

        const colors = ['#00ffaa', '#00ccff', '#ffaa00', '#ff5555'];

        html += `
          <div class="param-line" style="border-color: ${colors[runIndex % colors.length]};">
            ${times.map((time, i) => `
              <div class="param-point" style="left: ${(time-1) / (times.length-1) * 100}%; bottom: ${normalizedValues[i]}%">
                <div class="point-tooltip">${param}: ${values[i].toFixed(3)}</div>
              </div>
            `).join('')}
          </div>`;
      });

      html += `
          <div class="chart-legend">
            ${this.analysisData.map((run, i) => `
              <div class="legend-item">
                <span class="legend-color" style="background: ${['#00ffaa', '#00ccff', '#ffaa00', '#ff5555'][i % 4]};"></span>
                Run ${run.folder}
              </div>
            `).join('')}
          </div>
        </div>
        </div>`;
    });

    return html;
  }

  /**
   * Generate HTML for run comparison table
   */
  generateComparisonTable() {
    const summaryStats = this.calculateSummaryStats();

    let html = `
      <h2>📊 Run Comparison</h2>
      <table>
        <tr>
          <th>Run ID</th>
          <th>Snapshots</th>
          <th>Start Reward</th>
          <th>Final Reward</th>
          <th>Peak Reward</th>
          <th>Improvement</th>
          <th>Duration</th>
        </tr>`;

    summaryStats.runPerformances.forEach(run => {
      const runData = this.analysisData.find(d => d.folder === run.folder);
      const duration = runData.snapshots.length > 1 ?
        new Date(runData.snapshots[runData.snapshots.length - 1].timestamp) -
        new Date(runData.snapshots[0].timestamp) : 0;

      const durationMinutes = Math.round(duration / (1000 * 60));

      html += `
        <tr>
          <td>${run.folder}</td>
          <td>${runData.snapshots.length}</td>
          <td>${runData.snapshots[0].baselineReward.toFixed(2)}</td>
          <td class="${run.finalReward > summaryStats.avgFinalReward ? 'good' : run.finalReward < summaryStats.avgFinalReward ? 'bad' : ''}">${run.finalReward.toFixed(2)}</td>
          <td>${run.peakReward.toFixed(2)}</td>
          <td class="${run.improvement > 0 ? 'good' : 'bad'}">${run.improvement > 0 ? '+' : ''}${run.improvement.toFixed(2)}</td>
          <td>${durationMinutes} min</td>
        </tr>`;
    });

    html += '</table>';
    return html;
  }

  /**
   * Generate the complete HTML dashboard
   */
  generateDashboard() {
    const summaryStats = this.calculateSummaryStats();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Adaptive Heuristics Analysis Dashboard</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #1a1a2e;
      color: #eee;
      padding: 20px;
      max-width: 1600px;
      margin: 0 auto;
    }
    /* Navigation bar */
    .nav-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.95);
      border-bottom: 1px solid rgba(0, 255, 136, 0.3);
      padding: 10px 20px;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 15px;
      backdrop-filter: blur(4px);
    }
    .nav-button {
      background: rgba(0, 255, 136, 0.15);
      color: #00ff88;
      border: 1px solid rgba(0, 255, 136, 0.4);
      border-radius: 4px;
      padding: 8px 16px;
      font-family: ui-mono, monospace;
      font-size: 12px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .nav-button:hover {
      background: rgba(0, 255, 136, 0.25);
      border-color: rgba(0, 255, 136, 0.6);
    }
    .nav-title {
      color: #00ff88;
      font-family: ui-mono, monospace;
      font-size: 14px;
      margin-left: auto;
      opacity: 0.7;
    }
    .content-wrapper {
      margin-top: 60px;
    }
    h1 { color: #00ffaa; text-align: center; }
    h2 { color: #00ccff; border-bottom: 2px solid #00ccff; padding-bottom: 10px; }
    h3 { color: #00ffaa; margin-top: 30px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: #16213e;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    th {
      background: #0f3460;
      padding: 12px;
      text-align: left;
      color: #00ffaa;
      font-weight: bold;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #2a2a4e;
    }
    tr:hover { background: #1f2b4e; }
    .good { color: #00ff88; font-weight: bold; }
    .warn { color: #ffaa00; font-weight: bold; }
    .bad { color: #ff5555; font-weight: bold; }
    .metric { font-size: 0.9em; color: #aaa; }
    .chart-container {
      background: #16213e;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      position: relative;
    }
    .stat-box {
      display: inline-block;
      background: #16213e;
      padding: 15px 25px;
      margin: 10px;
      border-radius: 8px;
      border: 2px solid #0f3460;
      min-width: 150px;
    }
    .stat-label { color: #888; font-size: 0.9em; }
    .stat-value { color: #00ffaa; font-size: 1.5em; font-weight: bold; }

    /* Timeline chart styles */
    .timeline-chart {
      position: relative;
      height: 200px;
      background: #0f3460;
      border-radius: 4px;
      margin: 20px 0;
    }
    .timeline-point {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #00ffaa;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    .timeline-point:hover .point-label {
      display: block;
    }
    .point-label {
      display: none;
      position: absolute;
      background: #000;
      color: #fff;
      padding: 5px;
      border-radius: 3px;
      font-size: 0.8em;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
    }

    /* Parameter chart styles */
    .param-chart {
      position: relative;
      height: 150px;
      background: #0f3460;
      border-radius: 4px;
      margin: 20px 0;
    }
    .param-line {
      position: absolute;
      width: 100%;
      height: 2px;
      border-top: 2px solid;
    }
    .param-point {
      position: absolute;
      width: 6px;
      height: 6px;
      background: currentColor;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    .param-point:hover .point-tooltip {
      display: block;
    }
    .point-tooltip {
      display: none;
      position: absolute;
      background: #000;
      color: #fff;
      padding: 3px 6px;
      border-radius: 3px;
      font-size: 0.7em;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
    }

    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 10px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.9em;
    }
    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div class="nav-bar">
    <a href="/" class="nav-button">
      <span>←</span>
      <span>Back to Simulation</span>
    </a>
    <span class="nav-title">Analysis Dashboard</span>
  </div>
  
  <div class="content-wrapper">
    <h1>🧠 Adaptive Heuristics Analysis Dashboard</h1>
    <p style="text-align: center; color: #888;">Generated: ${new Date().toLocaleString()}</p>

    <h2>📊 Summary Statistics</h2>
  <div style="text-align: center;">
    <div class="stat-box">
      <div class="stat-label">Total Runs</div>
      <div class="stat-value">${summaryStats.totalRuns}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Avg Final Reward</div>
      <div class="stat-value">${summaryStats.avgFinalReward.toFixed(2)}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Best Final Reward</div>
      <div class="stat-value">${summaryStats.bestRun.finalReward.toFixed(2)}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Avg Peak Reward</div>
      <div class="stat-value">${summaryStats.avgPeakReward.toFixed(2)}</div>
    </div>
  </div>

  ${this.generateComparisonTable()}

  ${this.generatePerformanceCharts()}

  ${this.generateParameterCharts()}

  </div>
</body>
</html>`;

    return html;
  }

  /**
   * Save the dashboard to a file
   */
  saveDashboard(filename = 'dashboard.html') {
    const dashboardPath = path.join(__dirname, filename);
    const html = this.generateDashboard();

    fs.writeFileSync(dashboardPath, html, 'utf8');
    console.log(`Dashboard saved to: ${dashboardPath}`);
  }

  /**
   * Main execution method
   */
  generate() {
    console.log('🔍 Scanning for analysis folders...');
    this.scanAnalysisFolders();

    if (this.analysisFolders.length === 0) {
      console.log('❌ No analysis folders found. Run analysis first.');
      return;
    }

    console.log('📊 Loading analysis data...');
    this.loadAnalysisData();

    console.log('📈 Generating dashboard...');
    this.saveDashboard();

    console.log('✅ Dashboard generation complete!');
  }
}

// Export for external use
export default AnalysisDashboardGenerator;

// CLI execution
// Note: Windows paths need special handling
const scriptPath = process.argv[1]?.replace(/\\/g, '/');
const modulePath = fileURLToPath(import.meta.url).replace(/\\/g, '/');
if (scriptPath && modulePath && scriptPath.endsWith(modulePath.split('/').pop())) {
  const generator = new AnalysisDashboardGenerator();
  generator.generate();
}
