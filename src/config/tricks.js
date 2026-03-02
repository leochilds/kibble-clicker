/**
 * Trick Configuration
 * 
 * Defines all available tricks, their costs, and rewards.
 * Each trick level provides better rewards than the last.
 */

export const TRICKS = [
  {
    level: 0,
    name: 'Sit',
    cost: 0,
    reward: { kibble: 1 },
    kibbleValue: 1,
    description: 'The most basic trick - but every journey starts here!'
  },
  {
    level: 1,
    name: 'Shake Paw',
    cost: 10,
    reward: { kibble: 2 },
    kibbleValue: 2,
    description: 'A friendly greeting earns you double kibble.'
  },
  {
    level: 2,
    name: 'Roll Over',
    cost: 25,
    reward: { kibble: 3 },
    kibbleValue: 3,
    description: 'A classic crowd-pleaser!'
  },
  {
    level: 3,
    name: 'Play Dead',
    cost: 50,
    reward: { kibble: 5 },
    kibbleValue: 5,
    description: 'Dramatic performance pays off.'
  },
  {
    level: 4,
    name: 'High Five',
    cost: 100,
    reward: { chickenTreats: 1 },
    kibbleValue: 10,
    description: 'So impressive you earn a Chicken Treat!'
  },
  {
    level: 5,
    name: 'Spin Around',
    cost: 200,
    reward: { chickenTreats: 1, kibble: 5 },
    kibbleValue: 15,
    description: 'A dizzying display of skill.'
  },
  {
    level: 6,
    name: 'Fetch Newspaper',
    cost: 400,
    reward: { chickenTreats: 2 },
    kibbleValue: 20,
    description: 'Useful AND adorable!'
  },
  {
    level: 7,
    name: 'Dance Routine',
    cost: 800,
    reward: { steakTreats: 1 },
    kibbleValue: 50,
    description: 'Your moves earn you a premium Steak Treat!'
  },
  {
    level: 8,
    name: 'Backflip',
    cost: 1500,
    reward: { steakTreats: 1, chickenTreats: 1 },
    kibbleValue: 60,
    description: 'The ultimate trick - a spectacular acrobatic feat!'
  }
];

/**
 * Reward type values in kibble
 */
export const REWARD_VALUES = {
  kibble: 1,
  chickenTreats: 10,
  steakTreats: 50
};

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
