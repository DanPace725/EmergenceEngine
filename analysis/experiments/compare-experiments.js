#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Experiment Comparison Script
 * Compares analysis-summary.json files across different experimental runs
 */
class ExperimentComparator {
    constructor() {
        this.runs = [];
    }

    loadRun(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            data.filePath = filePath;
            this.runs.push(data);
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error.message);
        }
    }

    generateComparison() {
        if (this.runs.length < 2) {
            console.error('Need at least 2 runs to compare');
            return null;
        }

        const comparison = {
            comparisonTimestamp: new Date().toISOString(),
            runsCompared: this.runs.length,
            runNames: this.runs.map(r => r.runFolder),
            comparisons: {}
        };

        // Compare each metric type
        const metricTypes = ['baseline-metrics', 'config-profile', 'optimized-config', 'essence-state'];

        for (const metricType of metricTypes) {
            comparison.comparisons[metricType] = this.compareMetricType(metricType);
        }

        return comparison;
    }

    compareMetricType(metricType) {
        const runsWithMetric = this.runs.filter(run =>
            run.summaries.some(s => s.type === metricType)
        );

        if (runsWithMetric.length === 0) {
            return { available: false, message: `No ${metricType} data available` };
        }

        const comparison = {
            available: true,
            runs: runsWithMetric.length,
            metrics: {}
        };

        // Extract metrics for each run
        const runMetrics = runsWithMetric.map(run => {
            const summary = run.summaries.find(s => s.type === metricType);
            return {
                runName: run.runFolder,
                metrics: this.extractMetrics(summary, metricType)
            };
        });

        // Compare each metric
        const allMetrics = new Set();
        runMetrics.forEach(run => {
            Object.keys(run.metrics).forEach(metric => allMetrics.add(metric));
        });

        for (const metric of allMetrics) {
            const values = runMetrics.map(run => ({
                run: run.runName,
                value: run.metrics[metric]
            })).filter(v => v.value !== undefined);

            if (values.length > 1) {
                comparison.metrics[metric] = {
                    values: values,
                    range: values.length > 1 ? Math.max(...values.map(v => v.value)) - Math.min(...values.map(v => v.value)) : 0,
                    min: Math.min(...values.map(v => v.value)),
                    max: Math.max(...values.map(v => v.value)),
                    sortedValues: values.sort((a, b) => a.run.localeCompare(b.run)) // Sort by run name for consistency
                };
            }
        }

        return comparison;
    }

    extractMetrics(summary, metricType) {
        const metrics = {};

        switch (metricType) {
            case 'baseline-metrics':
                if (summary.summary.finalState) {
                    metrics.final_mean_chi = summary.summary.finalState.mean_chi;
                    metrics.final_coverage = summary.summary.finalState.coverage;
                    metrics.final_frontier_rate = summary.summary.finalState.frontier_rate;
                    metrics.final_heading_entropy = summary.summary.finalState.heading_entropy;
                }
                if (summary.summary.averages) {
                    metrics.avg_mean_chi = summary.summary.averages.mean_chi;
                    metrics.avg_coverage = summary.summary.averages.coverage;
                    metrics.avg_find_rate = summary.summary.averages.find_rate;
                }
                break;

            case 'config-profile':
                // Extract all optimized parameters
                if (summary.summary.snapshot && summary.summary.snapshot.params) {
                    const params = summary.summary.snapshot.params;
                    Object.entries(params).forEach(([key, value]) => {
                        metrics[`param_${key}`] = value;
                    });
                }
                break;

            case 'optimized-config':
                metrics.generation = summary.summary.generation;
                metrics.best_fitness = summary.summary.bestFitness;
                metrics.convergence = summary.summary.convergence;
                metrics.objective = summary.summary.objective;
                break;

            case 'essence-state':
                const essenceData = summary.summary;
                if (essenceData.world) {
                    metrics.total_births = essenceData.world.totalBirths;
                    metrics.next_agent_id = essenceData.world.nextAgentId;
                    metrics.resources_collected = essenceData.world.collected;
                    metrics.carrying_capacity = essenceData.world.carryingCapacity;
                    metrics.resource_pressure = essenceData.world.resourcePressure;
                    // Calculate deaths as total agents ever created minus current alive agents
                    if (essenceData.agents) {
                        metrics.total_agents_ever_created = essenceData.world.nextAgentId - 1;
                        metrics.deaths = (essenceData.world.nextAgentId - 1) - essenceData.agents.alive;
                    }
                }
                if (essenceData.agents) {
                    metrics.agent_count = essenceData.agents.alive;
                    metrics.total_agents_ever = essenceData.agents.total;
                    metrics.max_generation = essenceData.agents.generations;
                    metrics.avg_chi = essenceData.agents.averageChi;
                    metrics.min_chi = essenceData.agents.minChi;
                    metrics.max_chi = essenceData.agents.maxChi;
                    metrics.chi_range = essenceData.agents.maxChi - essenceData.agents.minChi;
                }
                // Extract lineage statistics
                if (essenceData.bundles) {
                    const lineageStats = this.analyzeLineage(essenceData.bundles);
                    Object.assign(metrics, lineageStats);
                }
                break;
        }

        return metrics;
    }

    analyzeLineage(bundles) {
        const stats = {
            total_lineages: 0,
            avg_lineage_length: 0,
            max_lineage_depth: 0,
            orphan_agents: 0
        };

        // Build lineage tree
        const lineageMap = new Map();
        const rootAgents = [];

        bundles.forEach(agent => {
            lineageMap.set(agent.id, {
                ...agent,
                children: []
            });
        });

        bundles.forEach(agent => {
            if (agent.parentId === null) {
                rootAgents.push(agent.id);
            } else if (lineageMap.has(agent.parentId)) {
                lineageMap.get(agent.parentId).children.push(agent.id);
            } else {
                stats.orphan_agents++;
            }
        });

        // Calculate lineage depths
        function getLineageDepth(agentId, visited = new Set()) {
            if (visited.has(agentId)) return 0; // Prevent cycles
            visited.add(agentId);

            const agent = lineageMap.get(agentId);
            if (!agent || agent.children.length === 0) return 1;

            return 1 + Math.max(...agent.children.map(childId => getLineageDepth(childId, visited)));
        }

        const lineageDepths = rootAgents.map(rootId => getLineageDepth(rootId));

        stats.total_lineages = rootAgents.length;
        stats.max_lineage_depth = lineageDepths.length > 0 ? Math.max(...lineageDepths) : 0;
        stats.avg_lineage_length = lineageDepths.length > 0 ? lineageDepths.reduce((sum, depth) => sum + depth, 0) / lineageDepths.length : 0;

        return stats;
    }


    generateMarkdown(comparison) {
        const md = [];

        md.push('# Experiment Comparison Report');
        md.push('');
        md.push(`**Generated**: ${new Date(comparison.comparisonTimestamp).toLocaleString()}`);
        md.push(`**Runs Compared**: ${comparison.runsCompared}`);
        md.push(`**Run Names**: ${comparison.runNames.join(', ')}`);
        md.push('');

        for (const [metricType, typeComparison] of Object.entries(comparison.comparisons)) {
            md.push(`## ${this.formatMetricTypeName(metricType)}`);
            md.push('');

            if (!typeComparison.available) {
                md.push(`*${typeComparison.message}*`);
                md.push('');
                continue;
            }

            md.push(`**Runs with data**: ${typeComparison.runs}`);
            md.push('');

            // Sort metrics by range (most variable first)
            const sortedMetrics = Object.entries(typeComparison.metrics)
                .sort(([, a], [, b]) => b.range - a.range);

            for (const [metricName, metricData] of sortedMetrics) {
                md.push(`### ${this.formatMetricName(metricName)}`);
                md.push('');

                // Values table
                md.push('| Run | Value |');
                md.push('|-----|-------|');

                metricData.sortedValues.forEach((item) => {
                    const value = typeof item.value === 'number' ? item.value.toFixed(3) : item.value;
                    md.push(`| ${item.run} | ${value} |`);
                });

                md.push('');
                const range = metricData.range.toFixed(3);
                const min = metricData.min.toFixed(3);
                const max = metricData.max.toFixed(3);
                md.push(`**Range**: ${range} | **Min**: ${min} | **Max**: ${max}`);
                md.push('');
            }
        }

        return md.join('\n');
    }

    formatMetricTypeName(type) {
        const names = {
            'baseline-metrics': 'Baseline Performance Metrics',
            'config-profile': 'Optimized Parameters',
            'optimized-config': 'Optimization Results',
            'essence-state': 'Final Simulation State'
        };
        return names[type] || type;
    }

    formatMetricName(metric) {
        // Handle parameter metrics
        if (metric.startsWith('param_')) {
            const paramName = metric.replace('param_', '');
            return `Param: ${paramName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`;
        }

        const names = {
            // Baseline metrics
            'final_mean_chi': 'Final Mean Chi Energy',
            'final_coverage': 'Final Coverage',
            'final_frontier_rate': 'Final Frontier Rate',
            'final_heading_entropy': 'Final Heading Entropy',
            'avg_mean_chi': 'Average Mean Chi Energy',
            'avg_coverage': 'Average Coverage',
            'avg_find_rate': 'Average Find Rate',

            // Optimization metrics
            'generation': 'Optimization Generation',
            'best_fitness': 'Best Fitness Score',
            'convergence': 'Convergence Percentage',
            'objective': 'Optimization Objective',

            // Agent metrics
            'agent_count': 'Final Agent Count',
            'total_agents_ever': 'Total Agents Ever in Simulation',
            'total_agents_ever_created': 'Total Agents Ever Created',
            'max_generation': 'Maximum Agent Generation',
            'avg_chi': 'Average Agent Chi',
            'min_chi': 'Minimum Agent Chi',
            'max_chi': 'Maximum Agent Chi',
            'chi_range': 'Agent Chi Range',

            // World metrics
            'total_births': 'Total Agent Births',
            'deaths': 'Total Agent Deaths',
            'next_agent_id': 'Next Agent ID',
            'resources_collected': 'Total Resources Collected',
            'carrying_capacity': 'Carrying Capacity',
            'resource_pressure': 'Resource Pressure',

            // Lineage metrics
            'total_lineages': 'Total Lineages',
            'avg_lineage_length': 'Average Lineage Length',
            'max_lineage_depth': 'Maximum Lineage Depth',
            'orphan_agents': 'Orphan Agents'
        };
        return names[metric] || metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
}

/**
 * Find all analysis-summary.json files
 */
function findAnalysisSummaryFiles(baseDir) {
    const files = [];

    function traverse(dir) {
        try {
            const items = fs.readdirSync(dir);

            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    traverse(fullPath);
                } else if (item === 'analysis-summary.json') {
                    // Only get the run-specific analysis-summary.json files (not the comparison one)
                    const dirName = path.basename(path.dirname(fullPath));
                    if (dirName !== 'experiments') { // Skip the comparison file in the root experiments dir
                        files.push(fullPath);
                    }
                }
            }
        } catch (error) {
            // Skip directories we can't read
        }
    }

    traverse(baseDir);
    return files;
}

// Main execution
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
    const baseDir = process.argv[2] || __dirname;

    if (!fs.existsSync(baseDir)) {
        console.error(`Directory not found: ${baseDir}`);
        process.exit(1);
    }

    console.log('Finding analysis summary files...');
    const summaryFiles = findAnalysisSummaryFiles(baseDir);

    if (summaryFiles.length < 2) {
        console.error(`Found ${summaryFiles.length} analysis summary files. Need at least 2 to compare.`);
        process.exit(1);
    }

    console.log(`Found ${summaryFiles.length} analysis summary files:`);
    summaryFiles.forEach(file => console.log(`  - ${path.basename(file)}`));

    const comparator = new ExperimentComparator();

    for (const file of summaryFiles) {
        console.log(`Loading ${path.basename(file)}...`);
        comparator.loadRun(file);
    }

    console.log('Generating comparison...');
    const comparison = comparator.generateComparison();

    if (!comparison) {
        console.error('Failed to generate comparison');
        process.exit(1);
    }

    // Write JSON comparison
    const jsonPath = path.join(baseDir, 'experiment-comparison.json');
    fs.writeFileSync(jsonPath, JSON.stringify(comparison, null, 2));
    console.log(`Created ${jsonPath}`);

    // Write Markdown comparison
    const markdown = comparator.generateMarkdown(comparison);
    const mdPath = path.join(baseDir, 'experiment-comparison.md');
    fs.writeFileSync(mdPath, markdown);
    console.log(`Created ${mdPath}`);

    console.log('Comparison complete!');
}

export { ExperimentComparator };
