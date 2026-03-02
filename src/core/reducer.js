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
      
      // Calculate kibble earned from all reward types
      let kibbleEarned = 0;
      for (const [type, amount] of Object.entries(reward)) {
        kibbleEarned += (REWARD_VALUES[type] || 0) * amount;
      }
      
      return {
        ...state,
        kibble: state.kibble + kibbleEarned,
        totalClicks: state.totalClicks + 1,
        totalKibbleEarned: state.totalKibbleEarned + kibbleEarned
      };
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
      
      // Check if player can afford the upgrade
      if (state.kibble < nextTrick.cost) {
        return state;
      }
      
      // Purchase the upgrade
      return {
        ...state,
        kibble: state.kibble - nextTrick.cost,
        trickLevel: state.trickLevel + 1
      };
    }
    
    case 'RESET':
      return {
        ...state,
        kibble: 0,
        totalClicks: 0,
        trickLevel: 0,
        totalKibbleEarned: 0
      };
    
    default:
      return state;
  }
}
