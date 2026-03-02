/**
 * Action Queue with Generator
 * 
 * This implements an action queue system using a generator function.
 * Actions are queued and processed one at a time in sequence.
 * This ensures deterministic state updates and makes debugging easier.
 */

/**
 * Generator function for processing queued actions
 * This creates an infinite iterator that yields actions from the queue
 * 
 * @param {Array} queue - Reference to the action queue
 * @yields {Object|null} Next action or null if queue is empty
 */
function* actionProcessor(queue) {
  while (true) {
    if (queue.length > 0) {
      yield queue.shift();
    } else {
      yield null;
    }
  }
}

/**
 * ActionQueue Class
 * 
 * Manages the action queue and state updates.
 * Uses requestAnimationFrame for smooth processing.
 */
export class ActionQueue {
  constructor(reducer, initialState, renderCallback) {
    this.queue = [];
    this.reducer = reducer;
    this.state = initialState;
    this.renderCallback = renderCallback;
    this.processor = actionProcessor(this.queue);
    this.history = [initialState]; // For debugging/time travel
    this.recentActions = []; // Last 50 actions for bug reports
    this.maxRecentActions = 50;
    this.startingStateForRecent = { ...initialState }; // State before first recent action
    this.processLoop();
  }

  /**
   * Dispatch an action to the queue
   * @param {Object} action - Action object
   */
  dispatch(action) {
    this.queue.push(action);
    
    // Keep only last 50 actions for bug reports
    if (this.recentActions.length >= this.maxRecentActions) {
      // Remove the oldest action
      const removedAction = this.recentActions.shift();
      
      // Update starting state by applying the removed action
      // This makes startingState the state RIGHT BEFORE the new first action
      this.startingStateForRecent = this.reducer(
        this.startingStateForRecent, 
        removedAction
      );
    }
    
    // Add new action to the buffer
    this.recentActions.push({ ...action });
  }

  /**
   * Main processing loop
   * Uses requestAnimationFrame for efficient processing
   */
  processLoop() {
    requestAnimationFrame(() => {
      const action = this.processor.next().value;
      
      if (action !== null) {
        // Process the action through the reducer
        const newState = this.reducer(this.state, action);
        
        // Update state
        this.state = newState;
        
        // Store in history for debugging
        this.history.push(newState);
        
        // Trigger UI update
        this.renderCallback(this.state);
        
        // Log action for debugging
        console.log('Action:', action.type, '| State:', this.state);
      }
      
      // Continue the loop
      this.processLoop();
    });
  }

  /**
   * Get current state (for external access)
   * @returns {Object} Current state
   */
  getState() {
    return this.state;
  }

  /**
   * Get action history (for debugging)
   * @returns {Array} State history
   */
  getHistory() {
    return this.history;
  }

  /**
   * Get queue length (for debugging)
   * @returns {number} Number of pending actions
   */
  getQueueLength() {
    return this.queue.length;
  }

  /**
   * Generate bug report with last 50 actions
   * @returns {Object} Bug report object with starting state and actions
   */
  generateBugReport() {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      startingState: this.startingStateForRecent,
      actions: this.recentActions.map(action => ({ ...action })),
      currentState: this.getState(),
      metadata: {
        totalActionsInSession: this.history.length - 1,
        actionsInReport: this.recentActions.length,
        gameVersion: this.state.version || 'unknown'
      }
    };
  }
}
