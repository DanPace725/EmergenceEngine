# Experiment Analysis Summary

**Run Folder**: F run
**Analysis Timestamp**: 11/15/2025, 10:12:36 PM
**Files Analyzed**: 4

## Baseline Metrics Analysis

**Export Time**: 11/15/2025, 9:05:08 PM
**Snapshots**: 40
**Time Range**: Ticks 630 - 1800 (1170 ticks)

### Final State
- **Alive Ratio**: 1
- **Mean Chi**: 155.36
- **Std Chi**: 46.17
- **ROI**: 12
- **Coverage**: 0.177
- **Frontier Rate**: 3.43
- **Heading Entropy**: 0.473

### Average Metrics
- **Alive Ratio**: 1
- **Mean Chi**: 140.91
- **Std Chi**: 35.06
- **Roi**: 17.65
- **Coverage**: 0.12
- **Frontier Rate**: 3.21
- **Heading Entropy**: 0.52
- **Moved Ratio**: 3
- **Find Rate**: 41.67

## Config Profile

**Name**: Optimized F (gen5)
**Description**: Auto-optimized config targeting F objective. Fitness: 0.000, Convergence: 86.6%

### Optimized Parameters
- **baseDecayPerSecond**: 0.131
- **moveSpeedPxPerSec**: 148.1837
- **moveCostPerSecond**: 0.5079
- **sensing.radius**: 80.9048
- **sensing.costPerSecond**: 0.0676
- **sensing.radiusRangeFactor**: 3
- **trail.emitPerSecond**: 0.9279
- **trail.decayPerSecond**: 0.108
- **trail.attractionGain**: 0.1305
- **trail.costPerSecond**: 0.0279
- **frustration.riseRate**: 0.0667
- **frustration.fallRate**: 0.1755
- **frustration.noiseGain**: 1.3005
- **frustration.hungerAmplify**: 0.5512
- **link.formCost**: 0.6961
- **link.maintPerSec**: 0.015
- **link.decayPerSec**: 0.0203
- **link.strengthenPerUse**: 0.0539
- **link.guidanceGain**: 0.5349

# Essence State Analysis

**Export Time**: 11/15/2025, 9:15:46 PM
**File**: essence-state-2025-11-16T05-15-46.json

## World Statistics
- **Agent Population**: 6 active agents
- **Total Births**: 6 agents created historically
- **Next Agent ID**: 10
- **Resources Collected**: 402 total
- **Carrying Capacity**: 60 agents
- **Resource Pressure**: 0

## Agent Statistics
- **Total Agents**: 6
- **Alive Agents**: 6
- **Max Generation**: 2
- **Average Chi**: 78.97
- **Chi Range**: 29.95 - 95.61

## Resource Statistics
- **Total Resources**: 50
- **Depleted Resources**: 0
- **Average Vitality**: 0.997
- **Vitality Range**: 0.964 - 1.000

## Active Agents Details

### Agent 1 (Generation 0)
- **Position**: (351.09, 458.26)
- **Velocity**: (29.32, 141.74)
- **Heading**: 0.94 radians
- **Chi Energy**: 95.07 units
- **Parent**: Agent null
- **Last Mitosis**: Tick 8228

### Agent 3 (Generation 0)
- **Position**: (697.44, 644.91)
- **Velocity**: (-120.99, 98.98)
- **Heading**: 2.6 radians
- **Chi Energy**: 89.24 units
- **Parent**: Agent null
- **Last Mitosis**: Tick 7182

### Agent 6 (Generation 1)
- **Position**: (1440.6, 693.78)
- **Velocity**: (138.82, -60)
- **Heading**: -0.5 radians
- **Chi Energy**: 92.42 units
- **Parent**: Agent 1
- **Last Mitosis**: Tick 8658

### Agent 7 (Generation 1)
- **Position**: (1470.76, 212.09)
- **Velocity**: (10.77, 146.91)
- **Heading**: 1.27 radians
- **Chi Energy**: 95.61 units
- **Parent**: Agent 3
- **Last Mitosis**: Tick 7182

### Agent 8 (Generation 1)
- **Position**: (1401.7, 707.36)
- **Velocity**: (150.51, 53.38)
- **Heading**: 0.34 radians
- **Chi Energy**: 71.54 units
- **Parent**: Agent 1
- **Last Mitosis**: Tick 8228

### Agent 9 (Generation 2)
- **Position**: (449.34, 74.09)
- **Velocity**: (-21.79, -149.66)
- **Heading**: -1.76 radians
- **Chi Energy**: 29.95 units
- **Parent**: Agent 6
- **Last Mitosis**: Tick 8658

## Key Observations

- **Population Growth**: Active reproduction occurring
## Optimized Config Analysis

**Generation**: 5
**Best Fitness**: 0
**Objective**: F
**Convergence**: 86.6%
