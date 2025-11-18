/**
 * Unified Data Processor
 * Handles all analysis JSON types and normalizes them for visualization
 */

/**
 * Detects the type of analysis data from JSON structure
 */
export class DataTypeDetector {
  static detect(data) {
    // Adaptive Heuristics
    if (data.snapshots && data.snapshots[0]?.keyMultipliers) {
      return 'adaptive-heuristics';
    }
    
    // Experiment Comparison
    if (data.comparisons && data.runNames) {
      return 'experiment-comparison';
    }
    
    // Analysis Summary (from experiments folder)
    if (data.runFolder && data.summaries) {
      return 'analysis-summary';
    }
    
    // Baseline Metrics
    if (data.metadata?.type === 'baseline' && data.snapshots) {
      return 'baseline-metrics';
    }
    
    // Essence State
    if (data.world && data.bundles && data.resources) {
      return 'essence-state';
    }
    
    // Config Profile
    if (data.snapshot?.params && data.name) {
      return 'config-profile';
    }
    
    // Optimized Config
    if (data.metadata?.generation && data.metadata?.bestFitness) {
      return 'optimized-config';
    }
    
    return 'unknown';
  }
}

/**
 * Normalizes different data types into a common format for visualization
 */
export class DataNormalizer {
  
  /**
   * Normalize adaptive heuristics data
   */
  static normalizeAdaptiveHeuristics(data) {
    const snapshots = data.snapshots || [];
    
    return {
      type: 'adaptive-heuristics',
      metadata: {
        timestamp: data.timestamp,
        snapshotCount: snapshots.length
      },
      timeSeries: snapshots.map((snap, idx) => ({
        index: idx + 1,
        timestamp: snap.timestamp,
        baselineReward: snap.baselineReward,
        rewardStats: snap.rewardStats,
        parameters: snap.keyMultipliers,
        trainingDataCount: snap.trainingDataCount
      })),
      summary: {
        totalSnapshots: snapshots.length,
        firstReward: snapshots[0]?.baselineReward || 0,
        lastReward: snapshots[snapshots.length - 1]?.baselineReward || 0,
        peakReward: Math.max(...snapshots.map(s => s.baselineReward)),
        minReward: Math.min(...snapshots.map(s => s.baselineReward)),
        improvement: snapshots.length > 1 
          ? snapshots[snapshots.length - 1].baselineReward - snapshots[0].baselineReward 
          : 0,
        correlations: data.correlations || {}
      },
      charts: {
        rewardEvolution: this.prepareRewardEvolutionChart(snapshots),
        parameterEvolution: this.prepareParameterEvolutionChart(snapshots),
        correlations: this.prepareCorrelationChart(data.correlations || {})
      }
    };
  }
  
  /**
   * Normalize baseline metrics data
   */
  static normalizeBaselineMetrics(data) {
    const snapshots = data.snapshots || [];
    
    return {
      type: 'baseline-metrics',
      metadata: data.metadata || {},
      timeSeries: snapshots.map(snap => ({
        tick: snap.tick,
        aliveRatio: snap.alive_ratio,
        meanChi: snap.mean_chi,
        stdChi: snap.std_chi,
        roi: snap.roi,
        coverage: snap.coverage,
        frontierRate: snap.frontier_rate,
        headingEntropy: snap.heading_entropy,
        movedRatio: snap.moved_ratio,
        findRate: snap.find_rate
      })),
      summary: {
        snapshotCount: snapshots.length,
        duration: snapshots.length > 0 
          ? snapshots[snapshots.length - 1].tick - snapshots[0].tick 
          : 0,
        finalState: snapshots[snapshots.length - 1] || {},
        averages: this.calculateAverages(snapshots)
      },
      charts: {
        chiEvolution: this.prepareMetricChart(snapshots, 'mean_chi', 'Mean Chi'),
        coverageEvolution: this.prepareMetricChart(snapshots, 'coverage', 'Coverage'),
        roiEvolution: this.prepareMetricChart(snapshots, 'roi', 'ROI')
      }
    };
  }
  
  /**
   * Normalize analysis summary (from experiments)
   */
  static normalizeAnalysisSummary(data) {
    const summaries = data.summaries || [];
    
    // Extract different data types if available
    const baselineMetric = summaries.find(s => s.type === 'baseline-metrics');
    const essenceState = summaries.find(s => s.type === 'essence-state');
    const configProfile = summaries.find(s => s.type === 'config-profile');
    const optimizedConfig = summaries.find(s => s.type === 'optimized-config');
    
    return {
      type: 'analysis-summary',
      metadata: {
        runFolder: data.runFolder,
        analysisTimestamp: data.analysisTimestamp,
        filesAnalyzed: data.filesAnalyzed
      },
      components: {
        baselineMetrics: baselineMetric ? this.normalizeBaselineSummary(baselineMetric.summary) : null,
        essenceState: essenceState ? this.normalizeEssenceState(essenceState.summary) : null,
        configProfile: configProfile ? configProfile.summary : null,
        optimizedConfig: optimizedConfig ? optimizedConfig.summary : null
      },
      summary: {
        hasBaseline: !!baselineMetric,
        hasEssence: !!essenceState,
        hasConfig: !!configProfile,
        hasOptimized: !!optimizedConfig,
        runName: data.runFolder
      }
    };
  }
  
  /**
   * Normalize baseline summary (from analysis-summary, without full snapshots)
   */
  static normalizeBaselineSummary(data) {
    return {
      type: 'baseline-summary',
      metadata: data.metadata || {},
      summary: {
        snapshotCount: data.snapshotCount || 0,
        duration: data.timeRange?.duration || 0,
        finalState: data.finalState || {},
        averages: data.averages || {}
      },
      // Create a simple chart with just final and average values
      charts: {
        summaryComparison: this.prepareSummaryComparisonChart(data)
      }
    };
  }
  
  /**
   * Prepare summary comparison chart (for data without full time series)
   */
  static prepareSummaryComparisonChart(data) {
    const finalState = data.finalState || {};
    const averages = data.averages || {};
    
    // Create a comparison of final vs average for key metrics
    const metrics = ['mean_chi', 'coverage', 'roi', 'frontier_rate', 'heading_entropy'];
    const labels = metrics.map(m => m.replace('_', ' ').toUpperCase());
    
    return {
      labels,
      datasets: [
        {
          label: 'Final State',
          data: metrics.map(m => finalState[m] || 0),
          backgroundColor: 'rgba(0, 255, 136, 0.6)',
          borderColor: '#00ff88',
          borderWidth: 2
        },
        {
          label: 'Average',
          data: metrics.map(m => averages[m] || 0),
          backgroundColor: 'rgba(0, 204, 255, 0.6)',
          borderColor: '#00ccff',
          borderWidth: 2
        }
      ]
    };
  }
  
  /**
   * Normalize essence state data
   */
  static normalizeEssenceState(data) {
    return {
      type: 'essence-state',
      metadata: data.metadata || {},
      world: data.world || {},
      agents: data.agents || {},
      resources: data.resources || {},
      bundles: data.bundles || [],
      summary: {
        populationHealth: this.calculatePopulationHealth(data.agents),
        resourceHealth: this.calculateResourceHealth(data.resources),
        generationalProgress: data.agents?.generations || 0
      }
    };
  }
  
  /**
   * Normalize experiment comparison data
   */
  static normalizeExperimentComparison(data) {
    return {
      type: 'experiment-comparison',
      metadata: {
        comparisonTimestamp: data.comparisonTimestamp,
        runsCompared: data.runsCompared,
        runNames: data.runNames || []
      },
      comparisons: data.comparisons || {},
      summary: {
        totalComparisons: Object.keys(data.comparisons || {}).length,
        availableMetrics: Object.keys(data.comparisons || {}).filter(
          key => data.comparisons[key].available
        )
      },
      charts: {
        metricComparisons: this.prepareComparisonCharts(data.comparisons || {})
      }
    };
  }
  
  // Helper methods for chart preparation
  
  static prepareRewardEvolutionChart(snapshots) {
    return {
      labels: snapshots.map((_, idx) => `S${idx + 1}`),
      datasets: [{
        label: 'Baseline Reward',
        data: snapshots.map(s => s.baselineReward),
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        tension: 0.4
      }]
    };
  }
  
  static prepareParameterEvolutionChart(snapshots) {
    const parameters = Object.keys(snapshots[0]?.keyMultipliers || {});
    const colors = ['#00ff88', '#00ccff', '#ffaa00', '#ff5555', '#ff00ff', '#88ff00', '#ff8800'];
    
    return {
      labels: snapshots.map((_, idx) => `S${idx + 1}`),
      datasets: parameters.map((param, idx) => ({
        label: param,
        data: snapshots.map(s => s.keyMultipliers[param]),
        borderColor: colors[idx % colors.length],
        backgroundColor: 'transparent',
        tension: 0.4
      }))
    };
  }
  
  static prepareCorrelationChart(correlations) {
    const entries = Object.entries(correlations).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
    
    return {
      labels: entries.map(([param]) => param),
      datasets: [{
        label: 'Correlation',
        data: entries.map(([, corr]) => corr),
        backgroundColor: entries.map(([, corr]) => 
          corr > 0 ? 'rgba(0, 255, 136, 0.6)' : 'rgba(255, 85, 85, 0.6)'
        ),
        borderColor: entries.map(([, corr]) => 
          corr > 0 ? '#00ff88' : '#ff5555'
        ),
        borderWidth: 2
      }]
    };
  }
  
  static prepareMetricChart(snapshots, metricKey, label) {
    return {
      labels: snapshots.map(s => `T${s.tick || 0}`),
      datasets: [{
        label,
        data: snapshots.map(s => s[metricKey]),
        borderColor: '#00ccff',
        backgroundColor: 'rgba(0, 204, 255, 0.1)',
        tension: 0.4
      }]
    };
  }
  
  static prepareComparisonCharts(comparisons) {
    const charts = {};
    
    for (const [metricType, typeData] of Object.entries(comparisons)) {
      if (!typeData.available) continue;
      
      charts[metricType] = {};
      for (const [metricName, metricData] of Object.entries(typeData.metrics || {})) {
        charts[metricType][metricName] = {
          labels: metricData.sortedValues.map(v => v.run),
          datasets: [{
            label: metricName,
            data: metricData.sortedValues.map(v => v.value),
            backgroundColor: 'rgba(0, 255, 136, 0.6)',
            borderColor: '#00ff88',
            borderWidth: 2
          }]
        };
      }
    }
    
    return charts;
  }
  
  static calculateAverages(snapshots) {
    if (snapshots.length === 0) return {};
    
    const metrics = ['alive_ratio', 'mean_chi', 'std_chi', 'roi', 'coverage', 
                     'frontier_rate', 'heading_entropy', 'moved_ratio', 'find_rate'];
    const averages = {};
    
    metrics.forEach(metric => {
      const values = snapshots.map(s => s[metric]).filter(v => v !== undefined && v !== null);
      if (values.length > 0) {
        averages[metric] = values.reduce((sum, val) => sum + val, 0) / values.length;
      }
    });
    
    return averages;
  }
  
  static calculatePopulationHealth(agents) {
    if (!agents) return 'unknown';
    
    const aliveCount = agents.alive || 0;
    const totalCount = agents.total || 0;
    const ratio = totalCount > 0 ? aliveCount / totalCount : 0;
    
    if (ratio === 0) return 'extinct';
    if (ratio < 0.3) return 'critical';
    if (ratio < 0.7) return 'declining';
    return 'healthy';
  }
  
  static calculateResourceHealth(resources) {
    if (!resources) return 'unknown';
    
    const total = resources.total || 0;
    const depleted = resources.depleted || 0;
    const ratio = total > 0 ? (total - depleted) / total : 0;
    
    if (ratio < 0.3) return 'scarce';
    if (ratio < 0.7) return 'moderate';
    return 'abundant';
  }
}

/**
 * Main processor that handles any JSON type
 */
export class UnifiedDataProcessor {
  
  /**
   * Process any analysis JSON file
   */
  static process(data) {
    const type = DataTypeDetector.detect(data);
    
    switch (type) {
      case 'adaptive-heuristics':
        return DataNormalizer.normalizeAdaptiveHeuristics(data);
      
      case 'baseline-metrics':
        return DataNormalizer.normalizeBaselineMetrics(data);
      
      case 'analysis-summary':
        return DataNormalizer.normalizeAnalysisSummary(data);
      
      case 'essence-state':
        return DataNormalizer.normalizeEssenceState(data);
      
      case 'experiment-comparison':
        return DataNormalizer.normalizeExperimentComparison(data);
      
      default:
        throw new Error(`Unknown data type: ${type}`);
    }
  }
  
  /**
   * Process multiple files and combine them
   */
  static processMultiple(dataArray) {
    return dataArray.map(data => this.process(data));
  }
}

