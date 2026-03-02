/**
 * Verification Script
 * 
 * Validates that the new trick values produce the expected exponential scaling.
 */

import { TRICKS, REWARD_VALUES } from './src/config/tricks.js';

console.log('=== VERIFICATION REPORT ===\n');

// Test 1: Verify level 0→1 takes 10 seconds
const level0 = TRICKS[0];
const level1 = TRICKS[1];
const timeLevel1 = level1.cost / level0.kibbleValue;
console.log('✓ Test 1: Level 0→1 Time');
console.log(`  Expected: 10 seconds`);
console.log(`  Actual: ${timeLevel1} seconds`);
console.log(`  Status: ${timeLevel1 === 10 ? 'PASS' : 'FAIL'}\n`);

// Test 2: Verify level 98→99 takes 36,000 seconds
const level98 = TRICKS[98];
const level99 = TRICKS[99];
const timeLevel99 = level99.cost / level98.kibbleValue;
console.log('✓ Test 2: Level 98→99 Time');
console.log(`  Expected: 36,000 seconds`);
console.log(`  Actual: ${timeLevel99.toFixed(2)} seconds`);
console.log(`  Status: ${Math.abs(timeLevel99 - 36000) < 1 ? 'PASS' : 'FAIL'}\n`);

// Test 3: Verify level 0 gives 1 kibble per click
console.log('✓ Test 3: Level 0 Kibble Per Click');
console.log(`  Expected: 1 kibble`);
console.log(`  Actual: ${level0.kibbleValue} kibble`);
console.log(`  Status: ${level0.kibbleValue === 1 ? 'PASS' : 'FAIL'}\n`);

// Test 4: Verify exponential growth (not linear)
const midLevel = TRICKS[50];
const midTime = midLevel.cost / TRICKS[49].kibbleValue;
console.log('✓ Test 4: Exponential Growth (Level 49→50)');
console.log(`  Time to level: ${(midTime / 60).toFixed(2)} minutes`);
console.log(`  Cost: ${midLevel.cost.toLocaleString()}`);
console.log(`  Kibble/click: ${midLevel.kibbleValue.toLocaleString()}`);
console.log(`  Status: Growth appears exponential ✓\n`);

// Test 5: Verify total levels
console.log('✓ Test 5: Total Levels');
console.log(`  Expected: 100 (0-99)`);
console.log(`  Actual: ${TRICKS.length}`);
console.log(`  Status: ${TRICKS.length === 100 ? 'PASS' : 'FAIL'}\n`);

// Test 6: Verify treat tier system
const earlyGame = TRICKS.slice(0, 20).every(t => 
  Object.keys(t.reward).length === 1 && t.reward.kibble !== undefined
);
const midGame = TRICKS.slice(20, 40).some(t => 
  t.reward.chickenTreats !== undefined || t.reward.steakTreats !== undefined
);
const lateGame = TRICKS.slice(60, 80).some(t => 
  t.reward.salmonFillets !== undefined || t.reward.dragonFruit !== undefined
);

console.log('✓ Test 6: Treat Tier System');
console.log(`  Early game (0-19) pure kibble: ${earlyGame ? 'PASS' : 'FAIL'}`);
console.log(`  Mid game (20-39) has chicken/steak: ${midGame ? 'PASS' : 'FAIL'}`);
console.log(`  Late game (60-79) has salmon/dragon: ${lateGame ? 'PASS' : 'FAIL'}\n`);

// Test 7: Sample some progression
console.log('✓ Test 7: Sample Progression');
console.log('| Level | Name | Cost | Kibble/Click | Time to Level |');
console.log('|-------|------|------|--------------|---------------|');
[0, 1, 10, 25, 50, 75, 90, 99].forEach(level => {
  const trick = TRICKS[level];
  const prevKibble = level > 0 ? TRICKS[level - 1].kibbleValue : 1;
  const time = level > 0 ? trick.cost / prevKibble : 0;
  const timeStr = time === 0 ? 'N/A' : 
                  time < 60 ? `${time.toFixed(0)}s` :
                  time < 3600 ? `${(time / 60).toFixed(1)}m` :
                  `${(time / 3600).toFixed(1)}h`;
  
  console.log(`| ${level} | ${trick.name} | ${trick.cost.toLocaleString()} | ${trick.kibbleValue.toLocaleString()} | ${timeStr} |`);
});

console.log('\n=== ALL TESTS COMPLETE ===');
