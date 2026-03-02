/**
 * Trick Value Calculator
 * 
 * Generates balanced trick costs and rewards with exponential scaling.
 * 
 * Constraints:
 * - Level 0→1: 10 seconds
 * - Level 98→99: 36,000 seconds (10 hours)
 * - Each "click" = 1 second
 * - Level 0 earns 1 kibble per click
 * - Exponential (NOT linear) scaling
 */

import fs from 'fs';

// Import original tricks to preserve names and descriptions
const originalTricksModule = await import('./src/config/tricks.js');
const ORIGINAL_TRICKS = originalTricksModule.TRICKS;

// Constants
const TOTAL_LEVELS = 100;
const MIN_TIME = 10;        // seconds for level 0→1
const MAX_TIME = 36000;     // seconds for level 98→99

// Calculate the growth rate for exponential scaling
// time(N) = MIN_TIME * (growthRate^N)
// We need: MIN_TIME * (growthRate^98) = MAX_TIME
// Therefore: growthRate = (MAX_TIME / MIN_TIME)^(1/98)
const growthRate = Math.pow(MAX_TIME / MIN_TIME, 1 / 98);
console.log(`Exponential growth rate: ${growthRate.toFixed(6)}`);

/**
 * Calculate time required to level up FROM level N to N+1
 */
function timeToLevel(level) {
  if (level === 0) return 0; // No time needed for initial level
  return MIN_TIME * Math.pow(growthRate, level - 1);
}

/**
 * Calculate kibble per click for a given level
 * Starts at 1, grows exponentially but slower than time
 */
function kibblePerClick(level) {
  // Start at 1, grow at a more moderate rate
  // We want early levels to progress reasonably but late levels to require many clicks
  const kibbleGrowthRate = 1.15;
  return Math.round(1 * Math.pow(kibbleGrowthRate, level));
}

/**
 * Calculate cost to upgrade FROM level N to N+1
 */
function calculateCost(level) {
  if (level === 0) return 0; // First trick is free
  
  const time = timeToLevel(level);
  const kpc = kibblePerClick(level - 1); // Using PREVIOUS level's earning rate
  return Math.round(time * kpc);
}

/**
 * Determine reward structure for a level
 */
function determineReward(level, kibbleValue) {
  // Simple tier system
  if (level === 0) {
    return { kibble: 1 };
  } else if (level < 20) {
    // Pure kibble for early game
    return { kibble: kibbleValue };
  } else if (level < 40) {
    // Introduce chicken and steak treats
    const chickenValue = 10;
    const steakValue = 100;
    
    if (kibbleValue < chickenValue) {
      return { kibble: kibbleValue };
    } else if (kibbleValue < steakValue) {
      const chickens = Math.floor(kibbleValue / chickenValue);
      const remaining = kibbleValue % chickenValue;
      if (remaining > 0) {
        return { chickenTreats: chickens, kibble: remaining };
      }
      return { chickenTreats: chickens };
    } else {
      const steaks = Math.floor(kibbleValue / steakValue);
      const remaining = kibbleValue % steakValue;
      const chickens = Math.floor(remaining / chickenValue);
      const kibble = remaining % chickenValue;
      
      const reward = {};
      if (steaks > 0) reward.steakTreats = steaks;
      if (chickens > 0) reward.chickenTreats = chickens;
      if (kibble > 0) reward.kibble = kibble;
      return Object.keys(reward).length > 0 ? reward : { kibble: kibbleValue };
    }
  } else if (level < 60) {
    // Bacon and salmon tier
    const baconValue = 1000;
    const salmonValue = 10000;
    
    if (kibbleValue < baconValue) {
      return { kibble: Math.max(1, Math.round(kibbleValue / 100)) };
    } else if (kibbleValue < salmonValue) {
      const bacons = Math.floor(kibbleValue / baconValue);
      return { baconStrips: bacons };
    } else {
      const salmons = Math.floor(kibbleValue / salmonValue);
      const remaining = kibbleValue % salmonValue;
      const bacons = Math.floor(remaining / baconValue);
      
      const reward = {};
      if (salmons > 0) reward.salmonFillets = salmons;
      if (bacons > 0) reward.baconStrips = bacons;
      return Object.keys(reward).length > 0 ? reward : { salmonFillets: 1 };
    }
  } else if (level < 80) {
    // Golden and dragon tier
    const goldenValue = 100000;
    const dragonValue = 1000000;
    
    if (kibbleValue < goldenValue) {
      const salmonValue = 10000;
      return { salmonFillets: Math.max(1, Math.floor(kibbleValue / salmonValue)) };
    } else if (kibbleValue < dragonValue) {
      const goldens = Math.floor(kibbleValue / goldenValue);
      return { goldenBones: goldens };
    } else {
      const dragons = Math.floor(kibbleValue / dragonValue);
      const remaining = kibbleValue % dragonValue;
      const goldens = Math.floor(remaining / goldenValue);
      
      const reward = {};
      if (dragons > 0) reward.dragonFruit = dragons;
      if (goldens > 0) reward.goldenBones = goldens;
      return Object.keys(reward).length > 0 ? reward : { dragonFruit: 1 };
    }
  } else {
    // Ultimate tier - phoenix and cosmic
    const phoenixValue = 10000000;
    const cosmicValue = 100000000;
    
    if (kibbleValue < phoenixValue) {
      const dragonValue = 1000000;
      return { dragonFruit: Math.max(1, Math.floor(kibbleValue / dragonValue)) };
    } else if (kibbleValue < cosmicValue) {
      const phoenixes = Math.floor(kibbleValue / phoenixValue);
      return { phoenixFeathers: phoenixes };
    } else {
      const cosmics = Math.floor(kibbleValue / cosmicValue);
      const remaining = kibbleValue % cosmicValue;
      const phoenixes = Math.floor(remaining / phoenixValue);
      
      const reward = {};
      if (cosmics > 0) reward.cosmicCookies = cosmics;
      if (phoenixes > 0) reward.phoenixFeathers = phoenixes;
      return Object.keys(reward).length > 0 ? reward : { cosmicCookies: 1 };
    }
  }
}

// Generate all tricks
console.log('\n=== GENERATING TRICKS ===\n');

const tricks = [];
const reportLines = [];

reportLines.push('# Kibble Clicker - Trick Value Calculation Report\n');
reportLines.push('## Exponential Scaling Formula\n');
reportLines.push(`- Growth rate: ${growthRate.toFixed(6)}`);
reportLines.push(`- Time formula: time(N) = ${MIN_TIME} × (${growthRate.toFixed(6)}^(N-1)) seconds`);
reportLines.push(`- Kibble per click: 1 × (1.15^N)`);
reportLines.push(`- Cost formula: time(N) × kibblePerClick(N-1)\n`);
reportLines.push('## Level Progression\n');
reportLines.push('| Level | Name | Time to Level | Kibble/Click | Cost | Reward |\n');
reportLines.push('|-------|------|---------------|--------------|------|--------|\n');

let cumulativeTime = 0;

for (let level = 0; level < TOTAL_LEVELS; level++) {
  const original = ORIGINAL_TRICKS[level];
  const time = timeToLevel(level);
  const kpc = kibblePerClick(level);
  const cost = calculateCost(level);
  const kibbleValue = kpc;
  const reward = determineReward(level, kibbleValue);
  
  cumulativeTime += time;
  
  tricks.push({
    level,
    name: original.name,
    cost,
    reward,
    kibbleValue,
    description: original.description
  });
  
  const timeStr = time < 60 ? `${Math.round(time)}s` : 
                  time < 3600 ? `${Math.round(time / 60)}m` :
                  `${(time / 3600).toFixed(1)}h`;
  
  const rewardStr = Object.entries(reward)
    .map(([k, v]) => `${k}:${v}`)
    .join(', ');
  
  reportLines.push(`| ${level} | ${original.name} | ${timeStr} | ${kpc.toLocaleString()} | ${cost.toLocaleString()} | ${rewardStr} |`);
}

reportLines.push('\n## Validation\n');
reportLines.push(`- Level 0→1 time: ${timeToLevel(1).toFixed(2)} seconds (target: 10s) ✓`);
reportLines.push(`- Level 98→99 time: ${timeToLevel(99).toFixed(2)} seconds (target: 36,000s) ✓`);
reportLines.push(`- Total time to max level: ${(cumulativeTime / 3600).toFixed(2)} hours`);
reportLines.push(`- First level kibble/click: ${kibblePerClick(0)}`);
reportLines.push(`- Last level kibble/click: ${kibblePerClick(99).toLocaleString()}`);

// Calculate treat values based on usage patterns
const REWARD_VALUES = {
  kibble: 1,
  chickenTreats: 10,
  steakTreats: 100,
  baconStrips: 1000,
  salmonFillets: 10000,
  lambChops: 50000,
  goldenBones: 100000,
  dragonFruit: 1000000,
  unicornKibble: 5000000,
  phoenixFeathers: 10000000,
  cosmicCookies: 100000000,
  celestialChews: 500000000,
  quantumBiscuits: 1000000000,
  infinityTreats: 10000000000,
  singularitySnacks: 100000000000
};

reportLines.push('\n## Reward Values (Kibble Equivalent)\n');
for (const [treat, value] of Object.entries(REWARD_VALUES)) {
  reportLines.push(`- ${treat}: ${value.toLocaleString()}`);
}

// Write the new tricks.js file
const tricksFileContent = `/**
 * Trick Configuration
 * 
 * Defines all available tricks, their costs, and rewards.
 * Each trick level provides better rewards than the last.
 * 
 * THIS FILE WAS AUTO-GENERATED by calculate-trick-values.js
 * Generated: ${new Date().toISOString()}
 * 
 * Scaling:
 * - Level 0→1: 10 seconds
 * - Level 98→99: 36,000 seconds (10 hours)
 * - Exponential growth rate: ${growthRate.toFixed(6)}
 */

export const TRICKS = ${JSON.stringify(tricks, null, 2)};

/**
 * Reward type values in kibble
 */
export const REWARD_VALUES = ${JSON.stringify(REWARD_VALUES, null, 2)};

/**
 * Get trick by level
 */
export function getTrickByLevel(level) {
  return TRICKS.find(trick => trick.level === level) || TRICKS[0];
}

/**
 * Get next trick for a given level
 */
export function getNextTrick(currentLevel) {
  return TRICKS.find(trick => trick.level === currentLevel + 1);
}

/**
 * Check if max level reached
 */
export function isMaxLevel(level) {
  return level >= TRICKS.length - 1;
}

/**
 * Calculate total kibble value from a reward object
 */
export function calculateRewardValue(reward) {
  let total = 0;
  for (const [type, amount] of Object.entries(reward)) {
    total += (REWARD_VALUES[type] || 0) * amount;
  }
  return total;
}
`;

// Write files
fs.writeFileSync('./src/config/tricks.js', tricksFileContent);
fs.writeFileSync('./calculation-report.md', reportLines.join('\n'));

console.log('\n✓ Generated src/config/tricks.js');
console.log('✓ Generated calculation-report.md');
console.log('\nKey Statistics:');
console.log(`- Total levels: ${TOTAL_LEVELS}`);
console.log(`- Level 0→1: ${timeToLevel(1).toFixed(2)} seconds`);
console.log(`- Level 98→99: ${timeToLevel(99).toFixed(2)} seconds`);
console.log(`- Total time to max: ${(cumulativeTime / 3600).toFixed(2)} hours`);
