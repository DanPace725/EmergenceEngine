# Experiment Analysis Summary

**Run Folder**: C run
**Analysis Timestamp**: 11/15/2025, 10:12:35 PM
**Files Analyzed**: 4

## Baseline Metrics Analysis

**Export Time**: 11/15/2025, 9:22:09 PM
**Snapshots**: 40
**Time Range**: Ticks 390 - 1560 (1170 ticks)

### Final State
- **Alive Ratio**: 1
- **Mean Chi**: 85.31
- **Std Chi**: 11.84
- **ROI**: 16.16
- **Coverage**: 0.164
- **Frontier Rate**: 3.4
- **Heading Entropy**: 0.612

### Average Metrics
- **Alive Ratio**: 1
- **Mean Chi**: 62.82
- **Std Chi**: 6.35
- **Roi**: 22.63
- **Coverage**: 0.1
- **Frontier Rate**: 3.44
- **Heading Entropy**: 0.59
- **Moved Ratio**: 3
- **Find Rate**: 45

## Config Profile

**Name**: Optimized C (gen5)
**Description**: Auto-optimized config targeting C objective. Fitness: 0.000, Convergence: 82.5%

### Optimized Parameters
- **baseDecayPerSecond**: 0.1733
- **moveSpeedPxPerSec**: 129.8366
- **moveCostPerSecond**: 0.4436
- **sensing.radius**: 103.1206
- **sensing.costPerSecond**: 0.0821
- **sensing.radiusRangeFactor**: 1.5533
- **trail.emitPerSecond**: 1.0014
- **trail.decayPerSecond**: 0.0504
- **trail.attractionGain**: 0.0988
- **trail.costPerSecond**: 0.0059
- **frustration.riseRate**: 0.1107
- **frustration.fallRate**: 0.1971
- **frustration.noiseGain**: 1.8274
- **frustration.hungerAmplify**: 0.6385
- **link.formCost**: 1.7954
- **link.maintPerSec**: 0.011
- **link.decayPerSec**: 0.0205
- **link.strengthenPerUse**: 0.0663
- **link.guidanceGain**: 0.6587

# Essence State Analysis

**Export Time**: 11/15/2025, 9:30:27 PM
**File**: essence-state-2025-11-16T05-30-27.json

## World Statistics
- **Agent Population**: 9 active agents
- **Total Births**: 8 agents created historically
- **Next Agent ID**: 12
- **Resources Collected**: 535 total
- **Carrying Capacity**: 58 agents
- **Resource Pressure**: 0

## Agent Statistics
- **Total Agents**: 9
- **Alive Agents**: 9
- **Max Generation**: 2
- **Average Chi**: 62.18
- **Chi Range**: 12.71 - 93.38

## Resource Statistics
- **Total Resources**: 49
- **Depleted Resources**: 0
- **Average Vitality**: 0.994
- **Vitality Range**: 0.961 - 1.000

## Active Agents Details

### Agent 1 (Generation 0)
- **Position**: (1789.57, 212.42)
- **Velocity**: (10.83, 140)
- **Heading**: 1.54 radians
- **Chi Energy**: 48.49 units
- **Parent**: Agent null
- **Last Mitosis**: Tick 9885

### Agent 2 (Generation 0)
- **Position**: (136.09, 701.42)
- **Velocity**: (75.33, 109.49)
- **Heading**: 0.81 radians
- **Chi Energy**: 89.38 units
- **Parent**: Agent null
- **Last Mitosis**: Tick 7720

### Agent 3 (Generation 0)
- **Position**: (1598.17, 646.97)
- **Velocity**: (121.36, 42.19)
- **Heading**: 0.6 radians
- **Chi Energy**: 89.91 units
- **Parent**: Agent null
- **Last Mitosis**: Tick 8538

### Agent 4 (Generation 1)
- **Position**: (1400.88, 201.22)
- **Velocity**: (108.65, 97.71)
- **Heading**: 0.9 radians
- **Chi Energy**: 37.03 units
- **Parent**: Agent 2
- **Last Mitosis**: Tick 3216

### Agent 5 (Generation 1)
- **Position**: (671.32, 594.41)
- **Velocity**: (-31.23, -121.59)
- **Heading**: -2.4 radians
- **Chi Energy**: 83.02 units
- **Parent**: Agent 1
- **Last Mitosis**: Tick 6320

### Agent 6 (Generation 1)
- **Position**: (286.79, 171.32)
- **Velocity**: (105.01, -80.38)
- **Heading**: -0.64 radians
- **Chi Energy**: 93.38 units
- **Parent**: Agent 2
- **Last Mitosis**: Tick 6341

### Agent 8 (Generation 1)
- **Position**: (416.68, 145.06)
- **Velocity**: (-44.09, -123.11)
- **Heading**: -1.94 radians
- **Chi Energy**: 84.27 units
- **Parent**: Agent 2
- **Last Mitosis**: Tick 9303

### Agent 10 (Generation 2)
- **Position**: (415.27, 185.03)
- **Velocity**: (7.58, -138.98)
- **Heading**: -1.38 radians
- **Chi Energy**: 21.42 units
- **Parent**: Agent 8
- **Last Mitosis**: Tick 9303

### Agent 11 (Generation 1)
- **Position**: (1819.16, 185.51)
- **Velocity**: (-102.5, 79.43)
- **Heading**: 2.53 radians
- **Chi Energy**: 12.71 units
- **Parent**: Agent 1
- **Last Mitosis**: Tick 9885

## Key Observations

- **Population Growth**: Active reproduction occurring
## Optimized Config Analysis

**Generation**: 5
**Best Fitness**: 0
**Objective**: C
**Convergence**: 82.5%
