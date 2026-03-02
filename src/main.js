/**
 * Main Application Entry Point
 * 
 * This initializes the entire application:
 * 1. Creates the action queue with reducer and initial state
 * 2. Performs initial render
 * 3. Binds event handlers
 * 4. Exposes app to window for debugging
 */

import { initialState } from './core/state.js';
import { reducer } from './core/reducer.js';
import { ActionQueue } from './core/actionQueue.js';
import { render, bindEvents } from './ui/render.js';
import * as actions from './actions/actions.js';

/**
 * Initialize the application
 */
function init() {
  console.log('🐾 Kibble Clicker - Starting up...');
  console.log('Initial State:', initialState);

  // Create the action queue (this is our "store")
  const app = new ActionQueue(reducer, initialState, render);

  // Perform initial render
  render(app.getState());

  // Bind UI events to dispatch actions
  bindEvents(app.dispatch.bind(app), actions);

  // Expose app globally for debugging
  window.app = app;
  window.actions = actions;

  console.log('✅ App initialized!');
  console.log('💡 Tip: Try these in console:');
  console.log('   app.getState() - View current state');
  console.log('   app.getHistory() - View state history');
  console.log('   app.dispatch(actions.clickTrick()) - Dispatch action');
  console.log('   app.getQueueLength() - View pending actions');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
