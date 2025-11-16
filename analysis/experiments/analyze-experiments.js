#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Base class for JSON file analyzers
 */
class BaseAnalyzer {
    constructor(filePath) {
        this.filePath = filePath;
        this.data = null;
        this.loadData();
    }

    loadData() {
        try {
            const content = fs.readFileSync(this.filePath, 'utf8');
            this.data = JSON.parse(content);
        } catch (error) {
            console.error(`Error loading ${this.filePath}:`, error.message);
            return false;
        }
        return true;
    }
}

/**
 * Analyzes baseline-metrics JSON files
 */
class BaselineMetricsAnalyzer extends BaseAnalyzer {
    getSummary() {
        if (!this.data) return null;

        const snapshots = this.data.snapshots || [];
        if (snapshots.length === 0) return null;

        const latest = snapshots[snapshots.length - 1];
        const first = snapshots[0];

        // Calculate averages for key metrics
        const avgMetrics = {};
        const metrics = ['alive_ratio', 'mean_chi', 'std_chi', 'roi', 'coverage', 'frontier_rate', 'heading_entropy', 'moved_ratio', 'find_rate'];

        metrics.forEach(metric => {
            const values = snapshots.map(s => s[metric]).filter(v => v !== undefined && v !== null);
            if (values.length > 0) {
                avgMetrics[metric] = values.reduce((sum, val) => sum + val, 0) / values.length;
            }
        });

        return {
            type: 'baseline-metrics',
            metadata: this.data.metadata,
            snapshotCount: snapshots.length,
            timeRange: {
                start: first.tick,
                end: latest.tick,
                duration: latest.tick - first.tick
            },
            finalState: {
                tick: latest.tick,
                alive_ratio: latest.alive_ratio,
                mean_chi: Math.round(latest.mean_chi * 100) / 100,
                std_chi: Math.round(latest.std_chi * 100) / 100,
                roi: Math.round(latest.roi * 100) / 100,
                coverage: Math.round(latest.coverage * 1000) / 1000,
                frontier_rate: Math.round(latest.frontier_rate * 100) / 100,
                heading_entropy: Math.round(latest.heading_entropy * 1000) / 1000
            },
            averages: Object.fromEntries(
                Object.entries(avgMetrics).map(([key, value]) => [key, Math.round(value * 100) / 100])
            )
        };
    }

    generateMarkdown(summary) {
        const md = [];

        md.push('## Baseline Metrics Analysis');
        md.push('');
        md.push(`**Export Time**: ${new Date(summary.metadata.exportedAt).toLocaleString()}`);
        md.push(`**Snapshots**: ${summary.snapshotCount}`);
        md.push(`**Time Range**: Ticks ${summary.timeRange.start} - ${summary.timeRange.end} (${summary.timeRange.duration} ticks)`);
        md.push('');

        md.push('### Final State');
        md.push(`- **Alive Ratio**: ${summary.finalState.alive_ratio}`);
        md.push(`- **Mean Chi**: ${summary.finalState.mean_chi}`);
        md.push(`- **Std Chi**: ${summary.finalState.std_chi}`);
        md.push(`- **ROI**: ${summary.finalState.roi}`);
        md.push(`- **Coverage**: ${summary.finalState.coverage}`);
        md.push(`- **Frontier Rate**: ${summary.finalState.frontier_rate}`);
        md.push(`- **Heading Entropy**: ${summary.finalState.heading_entropy}`);
        md.push('');

        md.push('### Average Metrics');
        Object.entries(summary.averages).forEach(([key, value]) => {
            md.push(`- **${key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}**: ${value}`);
        });
        md.push('');

        return md.join('\n');
    }
}

/**
 * Analyzes config-profile JSON files
 */
class ConfigProfileAnalyzer extends BaseAnalyzer {
    getSummary() {
        if (!this.data) return null;

        return {
            type: 'config-profile',
            name: this.data.name,
            description: this.data.description,
            snapshot: this.data.snapshot
        };
    }

    generateMarkdown(summary) {
        const md = [];

        md.push('## Config Profile');
        md.push('');
        md.push(`**Name**: ${summary.name}`);
        md.push(`**Description**: ${summary.description}`);
        md.push('');

        md.push('### Optimized Parameters');
        const params = summary.snapshot.params;
        Object.entries(params).forEach(([key, value]) => {
            md.push(`- **${key}**: ${Math.round(value * 10000) / 10000}`);
        });
        md.push('');

        return md.join('\n');
    }
}

/**
 * Analyzes optimized-config JSON files
 */
class OptimizedConfigAnalyzer extends BaseAnalyzer {
    getSummary() {
        if (!this.data) return null;

        return {
            type: 'optimized-config',
            metadata: this.data.metadata,
            generation: this.data.metadata.generation,
            bestFitness: this.data.metadata.bestFitness,
            objective: this.data.metadata.objective,
            convergence: Math.round(this.data.metadata.convergence * 1000) / 1000
        };
    }

    generateMarkdown(summary) {
        const md = [];

        md.push('## Optimized Config Analysis');
        md.push('');
        md.push(`**Generation**: ${summary.generation}`);
        md.push(`**Best Fitness**: ${summary.bestFitness}`);
        md.push(`**Objective**: ${summary.objective}`);
        md.push(`**Convergence**: ${(summary.convergence * 100).toFixed(1)}%`);
        md.push('');

        return md.join('\n');
    }
}

/**
 * Analyzes essence-state JSON files and creates summaries
 */
class EssenceStateAnalyzer extends BaseAnalyzer {

    getSummary() {
        if (!this.data) return null;

        const world = this.data.world || {};
        const bundles = this.data.bundles || [];
        const resources = this.data.resources || [];

        // Count resources by status
        const resourceStats = {
            total: resources.length,
            depleted: resources.filter(r => r.depleted).length,
            averageVitality: resources.reduce((sum, r) => sum + r.vitality, 0) / resources.length,
            minVitality: Math.min(...resources.map(r => r.vitality)),
            maxVitality: Math.max(...resources.map(r => r.vitality))
        };

        // Agent statistics
        const aliveAgents = bundles.filter(b => b.alive);
        const agentStats = {
            total: bundles.length,
            alive: aliveAgents.length,
            generations: aliveAgents.length > 0 ? Math.max(...aliveAgents.map(a => a.generation)) : 0,
            averageChi: aliveAgents.length > 0 ? aliveAgents.reduce((sum, a) => sum + a.chi, 0) / aliveAgents.length : 0,
            minChi: aliveAgents.length > 0 ? Math.min(...aliveAgents.map(a => a.chi)) : 0,
            maxChi: aliveAgents.length > 0 ? Math.max(...aliveAgents.map(a => a.chi)) : 0
        };

        return {
            type: 'essence-state',
            metadata: this.data.metadata,
            world: {
                nextAgentId: world.nextAgentId,
                totalBirths: world.totalBirths,
                collected: world.collected,
                carryingCapacity: world.carryingCapacity,
                resourcePressure: world.resourcePressure
            },
            agents: agentStats,
            resources: resourceStats,
            bundles: aliveAgents.map(agent => ({
                id: agent.id,
                generation: agent.generation,
                chi: Math.round(agent.chi * 100) / 100,
                position: {
                    x: Math.round(agent.x * 100) / 100,
                    y: Math.round(agent.y * 100) / 100
                },
                velocity: {
                    x: Math.round(agent.vx * 100) / 100,
                    y: Math.round(agent.vy * 100) / 100
                },
                heading: Math.round(agent.heading * 100) / 100,
                parentId: agent.parentId,
                lastMitosisTick: agent.lastMitosisTick
            }))
        };
    }

    generateMarkdown(summary) {
        const md = [];

        md.push('# Essence State Analysis');
        md.push('');
        md.push(`**Export Time**: ${new Date(summary.metadata.exportedAt).toLocaleString()}`);
        md.push(`**File**: ${path.basename(this.filePath)}`);
        md.push('');

        md.push('## World Statistics');
        md.push(`- **Agent Population**: ${summary.agents.alive} active agents`);
        md.push(`- **Total Births**: ${summary.world.totalBirths} agents created historically`);
        md.push(`- **Next Agent ID**: ${summary.world.nextAgentId}`);
        md.push(`- **Resources Collected**: ${summary.world.collected} total`);
        md.push(`- **Carrying Capacity**: ${summary.world.carryingCapacity} agents`);
        md.push(`- **Resource Pressure**: ${summary.world.resourcePressure}`);
        md.push('');

        md.push('## Agent Statistics');
        md.push(`- **Total Agents**: ${summary.agents.total}`);
        md.push(`- **Alive Agents**: ${summary.agents.alive}`);
        md.push(`- **Max Generation**: ${summary.agents.generations}`);
        md.push(`- **Average Chi**: ${summary.agents.averageChi.toFixed(2)}`);
        md.push(`- **Chi Range**: ${summary.agents.minChi.toFixed(2)} - ${summary.agents.maxChi.toFixed(2)}`);
        md.push('');

        md.push('## Resource Statistics');
        md.push(`- **Total Resources**: ${summary.resources.total}`);
        md.push(`- **Depleted Resources**: ${summary.resources.depleted}`);
        md.push(`- **Average Vitality**: ${summary.resources.averageVitality.toFixed(3)}`);
        md.push(`- **Vitality Range**: ${summary.resources.minVitality.toFixed(3)} - ${summary.resources.maxVitality.toFixed(3)}`);
        md.push('');

        if (summary.bundles.length > 0) {
            md.push('## Active Agents Details');
            md.push('');

            summary.bundles.forEach((agent, index) => {
                md.push(`### Agent ${agent.id} (Generation ${agent.generation})`);
                md.push(`- **Position**: (${agent.position.x}, ${agent.position.y})`);
                md.push(`- **Velocity**: (${agent.velocity.x}, ${agent.velocity.y})`);
                md.push(`- **Heading**: ${agent.heading} radians`);
                md.push(`- **Chi Energy**: ${agent.chi} units`);
                md.push(`- **Parent**: Agent ${agent.parentId}`);
                md.push(`- **Last Mitosis**: Tick ${agent.lastMitosisTick}`);
                md.push('');
            });
        }

        md.push('## Key Observations');
        md.push('');

        if (summary.agents.alive === 0) {
            md.push('- **Population Extinction**: No active agents remain');
        } else if (summary.agents.alive === 1) {
            md.push('- **Population Collapse**: Single survivor remains');
        } else if (summary.agents.alive > summary.world.carryingCapacity * 0.8) {
            md.push('- **Population Pressure**: Approaching carrying capacity');
        } else {
            md.push('- **Population Growth**: Active reproduction occurring');
        }

        if (summary.resources.depleted > 0) {
            md.push(`- **Resource Competition**: ${summary.resources.depleted} resources depleted`);
        }

        if (summary.agents.generations >= 5) {
            md.push('- **Evolutionary Progress**: Advanced generations present');
        }

        return md.join('\n');
    }
}

/**
 * Main analysis function
 */
function analyzeExperiments(baseDir) {
    console.log('Starting experiment analysis...');

    // Find all run folders (containing JSON files)
    const runFolders = findRunFolders(baseDir);

    console.log(`Found ${runFolders.length} run folders to analyze`);

    for (const runFolder of runFolders) {
        console.log(`\nAnalyzing ${runFolder}...`);

        const jsonFiles = findJsonFiles(runFolder);

        if (jsonFiles.length === 0) {
            console.log(`  No JSON files found in ${runFolder}`);
            continue;
        }

        console.log(`  Found ${jsonFiles.length} JSON file(s)`);

        // Analyze each JSON file
        const summaries = [];
        for (const file of jsonFiles) {
            const fileName = path.basename(file);
            const AnalyzerClass = getAnalyzerForFile(file);

            if (!AnalyzerClass) {
                console.log(`  Skipping unknown file type: ${fileName}`);
                continue;
            }

            console.log(`  Analyzing ${fileName}...`);

            const analyzer = new AnalyzerClass(file);
            const summary = analyzer.getSummary();

            if (summary) {
                summaries.push({
                    file: fileName,
                    type: summary.type,
                    summary: summary
                });
            }
        }

        if (summaries.length === 0) {
            console.log(`  No valid summaries generated for ${runFolder}`);
            continue;
        }

        // Generate combined summary
        const combinedSummary = {
            runFolder: path.basename(runFolder),
            analysisTimestamp: new Date().toISOString(),
            filesAnalyzed: summaries.length,
            summaries: summaries
        };

        // Write JSON summary
        const jsonPath = path.join(runFolder, 'analysis-summary.json');
        fs.writeFileSync(jsonPath, JSON.stringify(combinedSummary, null, 2));
        console.log(`  Created ${jsonPath}`);

        // Write Markdown summary
        const markdownSections = ['# Experiment Analysis Summary', '', `**Run Folder**: ${path.basename(runFolder)}`, `**Analysis Timestamp**: ${new Date().toLocaleString()}`, `**Files Analyzed**: ${summaries.length}`, ''];

        // Generate markdown for each file type
        const fileTypes = [...new Set(summaries.map(s => s.type))];

        for (const fileType of fileTypes) {
            const typeSummaries = summaries.filter(s => s.type === fileType);
            const latestSummary = typeSummaries[typeSummaries.length - 1]; // Use the latest file of this type

            const AnalyzerClass = getAnalyzerForFile(path.join(runFolder, latestSummary.file));
            if (AnalyzerClass) {
                const analyzer = new AnalyzerClass(path.join(runFolder, latestSummary.file));
                const sectionMarkdown = analyzer.generateMarkdown(latestSummary.summary);
                markdownSections.push(sectionMarkdown);
            }
        }

        const markdown = markdownSections.join('\n');

        const mdPath = path.join(runFolder, 'analysis-summary.md');
        fs.writeFileSync(mdPath, markdown);
        console.log(`  Created ${mdPath}`);
    }

    console.log('\nAnalysis complete!');
}

/**
 * Find all run folders containing JSON files
 */
function findRunFolders(baseDir) {
    const runFolders = [];

    function traverse(dir) {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // Check if this directory contains JSON files
                const jsonFiles = findJsonFiles(fullPath);
                if (jsonFiles.length > 0) {
                    runFolders.push(fullPath);
                } else {
                    // Recurse into subdirectories
                    traverse(fullPath);
                }
            }
        }
    }

    traverse(baseDir);
    return runFolders;
}

/**
 * Find all relevant JSON files in a directory
 */
function findJsonFiles(dir) {
    try {
        const files = fs.readdirSync(dir);
        return files
            .filter(file => file.endsWith('.json'))
            .map(file => path.join(dir, file))
            .sort(); // Sort to process in chronological order
    } catch (error) {
        return [];
    }
}

/**
 * Get the appropriate analyzer class for a file based on its name
 */
function getAnalyzerForFile(filePath) {
    const fileName = path.basename(filePath);

    if (fileName.startsWith('baseline-metrics-')) {
        return BaselineMetricsAnalyzer;
    } else if (fileName.startsWith('config-profile-')) {
        return ConfigProfileAnalyzer;
    } else if (fileName.startsWith('optimized-config-')) {
        return OptimizedConfigAnalyzer;
    } else if (fileName.startsWith('essence-state-')) {
        return EssenceStateAnalyzer;
    }

    return null; // Unknown file type
}

// Main execution
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
    const baseDir = process.argv[2] || __dirname;

    if (!fs.existsSync(baseDir)) {
        console.error(`Directory not found: ${baseDir}`);
        process.exit(1);
    }

    analyzeExperiments(baseDir);
}

export { EssenceStateAnalyzer, analyzeExperiments };
