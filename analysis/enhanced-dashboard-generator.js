import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UnifiedDataProcessor } from './lib/data-processor.js';
import { ChartBuilder } from './lib/chart-builder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EnhancedDashboardGenerator {
  constructor() {
    this.datasets = [];
    this.processedData = [];
  }

  /**
   * Scan for all analysis data in the analysis directory
   */
  scanAllData() {
    console.log('🔍 Scanning for analysis data...');
    
    // Scan for adaptive heuristics
    this.scanAdaptiveHeuristics();
    
    // Scan for experiment data
    this.scanExperiments();
    
    console.log(`✅ Found ${this.datasets.length} datasets`);
  }

  /**
   * Scan for adaptive heuristics folders
   */
  scanAdaptiveHeuristics() {
    const items = fs.readdirSync(__dirname);
    const folders = items.filter(item => {
      const itemPath = path.join(__dirname, item);
      const isDir = fs.statSync(itemPath).isDirectory();
      const hasResults = isDir && fs.existsSync(path.join(itemPath, 'ah-analysis-results.json'));
      return hasResults;
    });

    folders.forEach(folder => {
      const filePath = path.join(__dirname, folder, 'ah-analysis-results.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      this.datasets.push({
        type: 'adaptive-heuristics',
        name: folder,
        path: filePath,
        data
      });
      console.log(`  📊 Adaptive Heuristics: ${folder}`);
    });
  }

  /**
   * Scan for experiment analysis data
   */
  scanExperiments() {
    const experimentsDir = path.join(__dirname, 'experiments');
    if (!fs.existsSync(experimentsDir)) return;

    const findAnalysisSummaries = (dir) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          findAnalysisSummaries(fullPath);
        } else if (item === 'analysis-summary.json') {
          // Skip the comparison file in root experiments dir
          const parentDir = path.basename(path.dirname(fullPath));
          if (parentDir !== 'experiments') {
            const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            this.datasets.push({
              type: 'analysis-summary',
              name: data.runFolder || parentDir,
              path: fullPath,
              data
            });
            console.log(`  🧪 Experiment: ${data.runFolder || parentDir}`);
          }
        } else if (item === 'experiment-comparison.json') {
          const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
          this.datasets.push({
            type: 'experiment-comparison',
            name: 'Experiment Comparison',
            path: fullPath,
            data
          });
          console.log(`  🔬 Comparison data found`);
        }
      });
    };

    findAnalysisSummaries(experimentsDir);
  }

  /**
   * Process all datasets using unified processor
   */
  processData() {
    console.log('⚙️  Processing data...');
    
    this.processedData = this.datasets.map(dataset => {
      try {
        const normalized = UnifiedDataProcessor.process(dataset.data);
        return {
          ...dataset,
          normalized
        };
      } catch (error) {
        console.error(`Error processing ${dataset.name}:`, error.message);
        return null;
      }
    }).filter(Boolean);
    
    console.log(`✅ Processed ${this.processedData.length} datasets`);
  }

  /**
   * Generate the complete dashboard HTML
   */
  generateDashboard() {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enhanced Analysis Dashboard</title>
  
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@2.0.1/dist/chartjs-plugin-zoom.min.js"></script>
  
  <style>
    ${this.generateCSS()}
  </style>
</head>
<body>
  ${this.generateNavBar()}
  
  <div class="content-wrapper">
    ${this.generateTabs()}
    ${this.generateTabContent()}
  </div>

  <script>
    ${this.generateJavaScript()}
  </script>
</body>
</html>`;

    return html;
  }

  /**
   * Generate CSS styles
   */
  generateCSS() {
    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #1a1a2e;
        color: #e6f3ec;
        padding: 0;
        min-height: 100vh;
      }
      
      /* Navigation Bar */
      .nav-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        border-bottom: 1px solid rgba(0, 255, 136, 0.3);
        padding: 15px 30px;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        backdrop-filter: blur(8px);
      }
      
      .nav-left {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      
      .nav-button {
        background: rgba(0, 255, 136, 0.15);
        color: #00ff88;
        border: 1px solid rgba(0, 255, 136, 0.4);
        border-radius: 6px;
        padding: 10px 18px;
        font-family: ui-mono, monospace;
        font-size: 13px;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s;
      }
      
      .nav-button:hover {
        background: rgba(0, 255, 136, 0.25);
        border-color: rgba(0, 255, 136, 0.6);
        transform: translateY(-1px);
      }
      
      .nav-title {
        color: #00ff88;
        font-family: ui-mono, monospace;
        font-size: 18px;
        font-weight: bold;
      }
      
      .content-wrapper {
        margin-top: 80px;
        padding: 30px;
        max-width: 1600px;
        margin-left: auto;
        margin-right: auto;
      }
      
      /* Tabs */
      .tabs {
        display: flex;
        gap: 5px;
        margin-bottom: 30px;
        border-bottom: 2px solid rgba(0, 255, 136, 0.2);
      }
      
      .tab {
        background: transparent;
        color: #888;
        border: none;
        padding: 15px 25px;
        font-family: ui-mono, monospace;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;
        border-bottom: 3px solid transparent;
      }
      
      .tab:hover {
        color: #00ff88;
        background: rgba(0, 255, 136, 0.05);
      }
      
      .tab.active {
        color: #00ff88;
        border-bottom-color: #00ff88;
        background: rgba(0, 255, 136, 0.1);
      }
      
      .tab-content {
        display: none;
      }
      
      .tab-content.active {
        display: block;
        animation: fadeIn 0.3s;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      /* Summary Cards */
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .stat-card {
        background: #16213e;
        border: 1px solid rgba(0, 255, 136, 0.2);
        border-radius: 8px;
        padding: 20px;
        transition: all 0.3s;
      }
      
      .stat-card:hover {
        border-color: rgba(0, 255, 136, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 255, 136, 0.1);
      }
      
      .stat-label {
        color: #888;
        font-size: 13px;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .stat-value {
        color: #00ff88;
        font-size: 32px;
        font-weight: bold;
        font-family: ui-mono, monospace;
      }
      
      .stat-trend {
        margin-top: 8px;
        font-size: 14px;
      }
      
      .trend-up { color: #00ff88; }
      .trend-down { color: #ff5555; }
      .trend-neutral { color: #ffaa00; }
      
      /* Charts */
      .chart-container {
        background: #16213e;
        border: 1px solid rgba(0, 255, 136, 0.2);
        border-radius: 8px;
        padding: 25px;
        margin-bottom: 30px;
      }
      
      .chart-title {
        color: #00ccff;
        font-size: 18px;
        margin-bottom: 20px;
        font-family: ui-mono, monospace;
      }
      
      /* Tables */
      .comparison-table {
        width: 100%;
        border-collapse: collapse;
        background: #16213e;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .comparison-table th {
        background: #0f3460;
        color: #00ff88;
        padding: 15px;
        text-align: left;
        font-weight: bold;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .comparison-table td {
        padding: 12px 15px;
        border-bottom: 1px solid rgba(0, 255, 136, 0.1);
        color: #e6f3ec;
      }
      
      .comparison-table tr:hover {
        background: rgba(0, 255, 136, 0.05);
      }
      
      /* Sections */
      .section {
        margin-bottom: 40px;
      }
      
      .section-title {
        color: #00ccff;
        font-size: 24px;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid rgba(0, 204, 255, 0.3);
      }
      
      /* Empty State */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #888;
      }
      
      .empty-state-icon {
        font-size: 64px;
        margin-bottom: 20px;
        opacity: 0.5;
      }
      
      .empty-state-text {
        font-size: 18px;
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .content-wrapper {
          padding: 20px;
        }
        
        .summary-grid {
          grid-template-columns: 1fr;
        }
        
        .tabs {
          overflow-x: auto;
        }
      }
    `;
  }

  /**
   * Generate navigation bar HTML
   */
  generateNavBar() {
    return `
      <div class="nav-bar">
        <div class="nav-left">
          <a href="/" class="nav-button">
            <span>←</span>
            <span>Back to Simulation</span>
          </a>
          <span class="nav-title">📊 Enhanced Analysis Dashboard</span>
        </div>
        <div class="nav-right">
          <span style="color: #888; font-size: 12px;">
            ${this.processedData.length} datasets loaded
          </span>
        </div>
      </div>
    `;
  }

  /**
   * Generate tabs HTML
   */
  generateTabs() {
    const hasAdaptive = this.processedData.some(d => d.normalized.type === 'adaptive-heuristics');
    const hasBaseline = this.processedData.some(d => 
      d.normalized.type === 'baseline-metrics' || 
      (d.normalized.type === 'analysis-summary' && d.normalized.components.baselineMetrics)
    );
    const hasComparison = this.processedData.some(d => d.normalized.type === 'experiment-comparison');

    return `
      <div class="tabs">
        <button class="tab active" onclick="showTab('overview')">📊 Overview</button>
        ${hasAdaptive ? '<button class="tab" onclick="showTab(\'adaptive\')">🧠 Adaptive Heuristics</button>' : ''}
        ${hasBaseline ? '<button class="tab" onclick="showTab(\'baseline\')">📈 Baseline Metrics</button>' : ''}
        ${hasComparison ? '<button class="tab" onclick="showTab(\'comparison\')">🔬 Comparisons</button>' : ''}
      </div>
    `;
  }

  /**
   * Generate tab content HTML
   */
  generateTabContent() {
    return `
      <div id="overview-tab" class="tab-content active">
        ${this.generateOverviewTab()}
      </div>
      
      <div id="adaptive-tab" class="tab-content">
        ${this.generateAdaptiveTab()}
      </div>
      
      <div id="baseline-tab" class="tab-content">
        ${this.generateBaselineTab()}
      </div>
      
      <div id="comparison-tab" class="tab-content">
        ${this.generateComparisonTab()}
      </div>
    `;
  }

  /**
   * Generate overview tab content
   */
  generateOverviewTab() {
    const adaptiveCount = this.processedData.filter(d => d.normalized.type === 'adaptive-heuristics').length;
    const baselineCount = this.processedData.filter(d => 
      d.normalized.type === 'baseline-metrics' || d.normalized.type === 'analysis-summary'
    ).length;
    const comparisonCount = this.processedData.filter(d => d.normalized.type === 'experiment-comparison').length;

    return `
      <div class="section">
        <h2 class="section-title">Dashboard Overview</h2>
        
        <div class="summary-grid">
          <div class="stat-card">
            <div class="stat-label">Total Datasets</div>
            <div class="stat-value">${this.processedData.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Adaptive Heuristics</div>
            <div class="stat-value">${adaptiveCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Baseline Experiments</div>
            <div class="stat-value">${baselineCount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Comparisons</div>
            <div class="stat-value">${comparisonCount}</div>
          </div>
        </div>
        
        <div class="section">
          <h3 style="color: #00ff88; margin-bottom: 15px;">Loaded Datasets</h3>
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${this.processedData.map(d => `
                <tr>
                  <td><strong>${d.name}</strong></td>
                  <td>${this.formatDataType(d.normalized.type)}</td>
                  <td>${this.getDatasetDetails(d)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /**
   * Generate adaptive heuristics tab
   */
  generateAdaptiveTab() {
    const adaptiveData = this.processedData.filter(d => d.normalized.type === 'adaptive-heuristics');
    
    if (adaptiveData.length === 0) {
      return this.generateEmptyState('No adaptive heuristics data available');
    }

    let html = '';
    
    adaptiveData.forEach((dataset, idx) => {
      const data = dataset.normalized;
      // Store chart ID on dataset for later use in JS generation
      dataset._chartId = `adaptive-reward-${dataset.name.replace(/\s+/g, '-')}`;
      const chartId = dataset._chartId;
      
      html += `
        <div class="section">
          <h2 class="section-title">${dataset.name}</h2>
          
          <div class="summary-grid">
            ${ChartBuilder.generateStatCard('Total Snapshots', data.summary.totalSnapshots)}
            ${ChartBuilder.generateStatCard('Final Reward', data.summary.lastReward.toFixed(3))}
            ${ChartBuilder.generateStatCard('Peak Reward', data.summary.peakReward.toFixed(3))}
            ${ChartBuilder.generateStatCard('Improvement', 
              (data.summary.improvement > 0 ? '+' : '') + data.summary.improvement.toFixed(3),
              data.summary.improvement > 0 ? 'up' : data.summary.improvement < 0 ? 'down' : 'neutral'
            )}
          </div>
          
          ${ChartBuilder.generateChartHTML(chartId, '📈 Reward Evolution', '400px')}
        </div>
      `;
    });
    
    return html;
  }

  /**
   * Generate baseline metrics tab
   */
  generateBaselineTab() {
    const baselineData = this.processedData.filter(d => 
      d.normalized.type === 'baseline-metrics' || 
      (d.normalized.type === 'analysis-summary' && d.normalized.components.baselineMetrics)
    );
    
    if (baselineData.length === 0) {
      return this.generateEmptyState('No baseline metrics data available');
    }

    let html = '';
    
    baselineData.forEach((dataset, idx) => {
      const data = dataset.normalized.type === 'baseline-metrics' 
        ? dataset.normalized 
        : dataset.normalized.components.baselineMetrics;
      
      if (!data) return;
      
      // Store chart ID on dataset for later use in JS generation
      dataset._chartId = `baseline-chart-${dataset.name.replace(/\s+/g, '-')}`;
      const chartId = dataset._chartId;
      const runName = dataset.normalized.type === 'analysis-summary' 
        ? dataset.normalized.summary.runName 
        : dataset.name;
      
      // Get summary data
      const finalState = data.summary.finalState || {};
      const averages = data.summary.averages || {};
      
      html += `
        <div class="section">
          <h2 class="section-title">${runName}</h2>
          
          <div class="summary-grid">
            ${ChartBuilder.generateStatCard('Snapshots', data.summary.snapshotCount)}
            ${ChartBuilder.generateStatCard('Duration', `${data.summary.duration} ticks`)}
            ${ChartBuilder.generateStatCard('Final Mean Chi', finalState.mean_chi?.toFixed(2) || 'N/A')}
            ${ChartBuilder.generateStatCard('Avg Mean Chi', averages.mean_chi?.toFixed(2) || 'N/A')}
            ${ChartBuilder.generateStatCard('Final Coverage', finalState.coverage?.toFixed(3) || 'N/A')}
            ${ChartBuilder.generateStatCard('Avg Coverage', averages.coverage?.toFixed(3) || 'N/A')}
            ${ChartBuilder.generateStatCard('Final ROI', finalState.roi?.toFixed(2) || 'N/A')}
            ${ChartBuilder.generateStatCard('Avg ROI', averages.roi?.toFixed(2) || 'N/A')}
          </div>
          
          ${ChartBuilder.generateChartHTML(chartId, '📊 Metrics Comparison: Final vs Average', '400px')}
          
          <div style="margin-top: 30px;">
            <h3 style="color: #00ccff; margin-bottom: 15px;">Detailed Metrics</h3>
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Final Value</th>
                  <th>Average Value</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                ${this.generateMetricRows(finalState, averages)}
              </tbody>
            </table>
          </div>
        </div>
      `;
    });
    
    return html;
  }
  
  /**
   * Generate metric comparison rows
   */
  generateMetricRows(finalState, averages) {
    const metrics = [
      { key: 'mean_chi', label: 'Mean Chi' },
      { key: 'std_chi', label: 'Std Chi' },
      { key: 'coverage', label: 'Coverage' },
      { key: 'roi', label: 'ROI' },
      { key: 'frontier_rate', label: 'Frontier Rate' },
      { key: 'heading_entropy', label: 'Heading Entropy' },
      { key: 'alive_ratio', label: 'Alive Ratio' }
    ];
    
    return metrics.map(metric => {
      const finalVal = finalState[metric.key] || 0;
      const avgVal = averages[metric.key] || 0;
      const diff = finalVal - avgVal;
      const diffStr = diff >= 0 ? `+${diff.toFixed(3)}` : diff.toFixed(3);
      const diffClass = diff > 0 ? 'trend-up' : diff < 0 ? 'trend-down' : 'trend-neutral';
      
      return `
        <tr>
          <td><strong>${metric.label}</strong></td>
          <td>${finalVal.toFixed(3)}</td>
          <td>${avgVal.toFixed(3)}</td>
          <td class="${diffClass}">${diffStr}</td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Generate comparison tab
   */
  generateComparisonTab() {
    const comparisonData = this.processedData.filter(d => d.normalized.type === 'experiment-comparison');
    
    if (comparisonData.length === 0) {
      return this.generateEmptyState('No comparison data available');
    }

    let html = '';
    
    comparisonData.forEach(dataset => {
      const data = dataset.normalized;
      const comparisons = dataset.data.comparisons || {};
      
      html += `
        <div class="section">
          <h2 class="section-title">Experiment Comparison</h2>
          
          <div class="summary-grid">
            ${ChartBuilder.generateStatCard('Runs Compared', data.metadata.runsCompared)}
            ${ChartBuilder.generateStatCard('Run Names', data.metadata.runNames.join(' vs '))}
            ${ChartBuilder.generateStatCard('Metric Types', data.summary.availableMetrics.length)}
          </div>
          
          ${this.generateComparisonMetrics(comparisons, data.metadata.runNames)}
        </div>
      `;
    });
    
    return html;
  }
  
  /**
   * Generate detailed comparison metrics
   */
  generateComparisonMetrics(comparisons, runNames) {
    let html = '';
    
    // Process each metric type
    for (const [metricType, typeData] of Object.entries(comparisons)) {
      if (!typeData.available) continue;
      
      const metricName = this.formatMetricTypeName(metricType);
      html += `
        <div style="margin-top: 40px;">
          <h3 style="color: #00ccff; margin-bottom: 20px;">${metricName}</h3>
      `;
      
      // Get metrics sorted by range (most different first)
      const metrics = Object.entries(typeData.metrics || {})
        .sort(([, a], [, b]) => b.range - a.range)
        .slice(0, 10); // Top 10 most variable metrics
      
      if (metrics.length > 0) {
        html += `
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Metric</th>
                ${runNames.map(name => `<th>${name}</th>`).join('')}
                <th>Difference</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
        `;
        
        metrics.forEach(([metricName, metricData]) => {
          const values = metricData.sortedValues || [];
          const diff = metricData.range;
          
          // Filter out non-numeric values
          const numericValues = values.filter(v => typeof v.value === 'number');
          if (numericValues.length === 0) return;
          
          const winner = numericValues.reduce((max, v) => v.value > max.value ? v : max, numericValues[0]);
          
          html += `
            <tr>
              <td><strong>${this.formatMetricLabel(metricName)}</strong></td>
              ${numericValues.map(v => {
                const isWinner = v.run === winner.run;
                const className = isWinner ? 'trend-up' : '';
                return `<td class="${className}">${v.value.toFixed(3)}${isWinner ? ' ✓' : ''}</td>`;
              }).join('')}
              <td>${typeof diff === 'number' ? diff.toFixed(3) : 'N/A'}</td>
              <td style="color: #00ff88;">${winner.run}</td>
            </tr>
          `;
        });
        
        html += `
            </tbody>
          </table>
        `;
      }
      
      html += `</div>`;
    }
    
    if (html === '') {
      html = '<div style="color: #888; margin-top: 30px;">No detailed metrics available</div>';
    }
    
    return html;
  }
  
  /**
   * Format metric type name
   */
  formatMetricTypeName(type) {
    const names = {
      'baseline-metrics': '📈 Baseline Performance Metrics',
      'config-profile': '⚙️ Optimized Parameters',
      'optimized-config': '🎯 Optimization Results',
      'essence-state': '🌟 Final Simulation State'
    };
    return names[type] || type.replace(/-/g, ' ').toUpperCase();
  }
  
  /**
   * Format metric label
   */
  formatMetricLabel(metric) {
    // Remove param_ prefix if present
    if (metric.startsWith('param_')) {
      metric = metric.replace('param_', '');
    }
    
    // Replace underscores and capitalize
    return metric
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  /**
   * Generate empty state
   */
  generateEmptyState(message) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <div class="empty-state-text">${message}</div>
      </div>
    `;
  }

  /**
   * Generate JavaScript code
   */
  generateJavaScript() {
    let js = `
      // Tab switching
      function showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
          tab.classList.remove('active');
        });
        document.querySelectorAll('.tab').forEach(tab => {
          tab.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(tabName + '-tab').classList.add('active');
        event.target.classList.add('active');
      }
      
      // Initialize charts
      window.addEventListener('DOMContentLoaded', function() {
    `;

    // Generate chart initialization code for each dataset
    this.processedData.forEach((dataset, idx) => {
      // Use stored chart ID if available
      if (dataset.normalized.type === 'adaptive-heuristics' && dataset._chartId) {
        const chartConfig = ChartBuilder.buildLineChart(dataset.normalized.charts.rewardEvolution);
        js += ChartBuilder.generateChartInitCode(dataset._chartId, chartConfig);
      }
      
      if ((dataset.normalized.type === 'baseline-metrics' || 
          (dataset.normalized.type === 'analysis-summary' && dataset.normalized.components.baselineMetrics)) 
          && dataset._chartId) {
        const data = dataset.normalized.type === 'baseline-metrics' 
          ? dataset.normalized 
          : dataset.normalized.components.baselineMetrics;
        
        // Use appropriate chart type based on data availability
        if (data.type === 'baseline-summary') {
          // Bar chart for summary comparison
          const chartConfig = ChartBuilder.buildBarChart(data.charts.summaryComparison);
          js += ChartBuilder.generateChartInitCode(dataset._chartId, chartConfig);
        } else if (data.charts.chiEvolution) {
          // Line chart for full time series
          const chartConfig = ChartBuilder.buildLineChart(data.charts.chiEvolution);
          js += ChartBuilder.generateChartInitCode(dataset._chartId, chartConfig);
        }
      }
    });

    js += `
      });
    `;

    return js;
  }

  /**
   * Helper methods
   */
  formatDataType(type) {
    const types = {
      'adaptive-heuristics': '🧠 Adaptive Heuristics',
      'baseline-metrics': '📈 Baseline Metrics',
      'analysis-summary': '🧪 Experiment Summary',
      'experiment-comparison': '🔬 Comparison',
      'essence-state': '🌟 Essence State'
    };
    return types[type] || type;
  }

  getDatasetDetails(dataset) {
    const data = dataset.normalized;
    
    switch (data.type) {
      case 'adaptive-heuristics':
        return `${data.summary.totalSnapshots} snapshots`;
      case 'baseline-metrics':
        return `${data.summary.snapshotCount} snapshots, ${data.summary.duration} ticks`;
      case 'analysis-summary':
        return `${dataset.data.filesAnalyzed} files analyzed`;
      case 'experiment-comparison':
        return `${data.metadata.runsCompared} runs compared`;
      default:
        return '-';
    }
  }

  /**
   * Save dashboard to file
   */
  saveDashboard(filename = 'enhanced-dashboard.html') {
    const html = this.generateDashboard();
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`✅ Dashboard saved to: ${filePath}`);
  }

  /**
   * Main generation method
   */
  generate() {
    console.log('🚀 Enhanced Dashboard Generation Started\n');
    
    this.scanAllData();
    this.processData();
    this.saveDashboard();
    
    console.log('\n✨ Dashboard generation complete!');
    console.log('📂 Open enhanced-dashboard.html in your browser');
  }
}

// CLI execution
const scriptPath = process.argv[1]?.replace(/\\/g, '/');
const modulePath = fileURLToPath(import.meta.url).replace(/\\/g, '/');
if (scriptPath && modulePath && scriptPath.endsWith(modulePath.split('/').pop())) {
  const generator = new EnhancedDashboardGenerator();
  generator.generate();
}

export default EnhancedDashboardGenerator;

