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

export function reducer(state, action) {
  switch (action.type) {
    case 'CLICK_TRICK':
      return {
        ...state,
        kibble: state.kibble + 1,
        totalClicks: state.totalClicks + 1
      };
    
    case 'RESET':
      return {
        ...state,
        kibble: 0,
        totalClicks: 0
      };
    
    default:
      return state;
  }
}
