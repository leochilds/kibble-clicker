/**
 * Action Types and Action Creators
 * 
 * Action types are constants to avoid typos.
 * Action creators are functions that return action objects.
 */

// Action Types
export const CLICK_TRICK = 'CLICK_TRICK';
export const RESET = 'RESET';
export const PURCHASE_UPGRADE = 'PURCHASE_UPGRADE';

// Action Creators
export const clickTrick = () => ({
  type: CLICK_TRICK
});

export const reset = () => ({
  type: RESET
});

export const purchaseUpgrade = () => ({
  type: PURCHASE_UPGRADE
});
