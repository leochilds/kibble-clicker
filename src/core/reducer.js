/**
 * Pure Reducer Function
 * 
 * This is the heart of our functional architecture.
 * Takes current state and an action, returns new state.
 * 
 * Rules:
 * - Must be a pure function (no side effects)
 * - Must not mutate the input state
 * - Same input always produces same output
 * 
 * @param {Object} state - Current state
 * @param {Object} action - Action object with type and optional payload
 * @returns {Object} New state
 */

import { getTrickByLevel, getNextTrick, isMaxLevel, REWARD_VALUES } from '../config/tricks.js';

export function reducer(state, action) {
  switch (action.type) {
    case 'CLICK_TRICK': {
      // Get current trick and its reward
      const currentTrick = getTrickByLevel(state.trickLevel);
      const reward = currentTrick.reward;
      
      // Add each treat type to inventory
      const newState = { ...state, totalClicks: state.totalClicks + 1 };
      
      // Calculate total kibble value earned for stats
      let kibbleValueEarned = 0;
      
      for (const [type, amount] of Object.entries(reward)) {
        // Add treats to inventory
        if (newState.hasOwnProperty(type)) {
          newState[type] = (state[type] || 0) + amount;
        }
        // Track total value for stats
        kibbleValueEarned += (REWARD_VALUES[type] || 0) * amount;
      }
      
      newState.totalKibbleEarned += kibbleValueEarned;
      
      return newState;
    }
    
    case 'PURCHASE_UPGRADE': {
      // Check if already at max level
      if (isMaxLevel(state.trickLevel)) {
        return state;
      }
      
      // Get next trick and its cost
      const nextTrick = getNextTrick(state.trickLevel);
      if (!nextTrick) {
        return state;
      }
      
      // Calculate total inventory value
      let totalValue = 0;
      const treatTypes = Object.keys(REWARD_VALUES);
      for (const type of treatTypes) {
        totalValue += (state[type] || 0) * REWARD_VALUES[type];
      }
      
      // Check if player can afford the upgrade
      if (totalValue < nextTrick.cost) {
        return state;
      }
      
      // Deduct cost from inventory (starting with highest-value treats)
      const newState = { ...state, trickLevel: state.trickLevel + 1 };
      let remaining = nextTrick.cost;
      
      // Sort treat types by value (descending)
      const sortedTypes = treatTypes.sort((a, b) => REWARD_VALUES[b] - REWARD_VALUES[a]);
      
      for (const type of sortedTypes) {
        const treatValue = REWARD_VALUES[type];
        const available = state[type] || 0;
        const treatsToDeduct = Math.min(available, Math.floor(remaining / treatValue));
        
        if (treatsToDeduct > 0) {
          newState[type] = available - treatsToDeduct;
          remaining -= treatsToDeduct * treatValue;
        }
        
        if (remaining <= 0) break;
      }
      
      return newState;
    }
    
    case 'RESET':
      return {
        ...state,
        // Reset all treat types
        kibble: 0,
        chickenTreats: 0,
        steakTreats: 0,
        baconStrips: 0,
        salmonFillets: 0,
        lambChops: 0,
        lobsterTails: 0,
        wagyuBeef: 0,
        truffleTreats: 0,
        goldenBones: 0,
        dragonFruit: 0,
        unicornKibble: 0,
        phoenixFeathers: 0,
        cosmicCookies: 0,
        celestialChews: 0,
        quantumBiscuits: 0,
        infinityTreats: 0,
        singularitySnacks: 0,
        // Reset game stats
        totalClicks: 0,
        trickLevel: 0,
        totalKibbleEarned: 0
      };
    
    default:
      return state;
  }
}
