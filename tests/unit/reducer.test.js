/**
 * Reducer Unit Tests
 * 
 * Tests for the pure reducer function to ensure
 * state transitions work correctly.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { reducer } from '../../src/core/reducer.js';
import { initialState } from '../../src/core/state.js';
import { clickTrick, reset } from '../../src/actions/actions.js';

describe('Reducer - Basic Functionality', () => {
  it('should return initial state when action is unknown', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const newState = reducer(initialState, unknownAction);
    
    expect(newState).toEqual(initialState);
  });

  it('should handle CLICK_TRICK action', () => {
    const newState = reducer(initialState, clickTrick());
    
    expect(newState.kibble).toBe(1);
    expect(newState.totalClicks).toBe(1);
  });

  it('should handle RESET action', () => {
    let state = initialState;
    state = reducer(state, clickTrick());
    state = reducer(state, clickTrick());
    state = reducer(state, reset());
    
    expect(state.kibble).toBe(0);
    expect(state.totalClicks).toBe(0);
  });

  it('should preserve version through actions', () => {
    const newState = reducer(initialState, clickTrick());
    
    expect(newState.version).toBe(initialState.version);
  });
});

describe('Reducer - Pure Function Properties', () => {
  it('should never mutate the input state', () => {
    const originalState = { ...initialState };
    const stateCopy = { ...initialState };
    
    const newState = reducer(stateCopy, clickTrick());
    
    expect(stateCopy).toEqual(originalState);
    expect(newState).not.toBe(stateCopy);
  });

  it('should be deterministic (same input = same output)', () => {
    let state1 = { ...initialState };
    let state2 = { ...initialState };
    
    const actions = [clickTrick(), clickTrick(), reset(), clickTrick()];
    
    actions.forEach(action => {
      state1 = reducer(state1, action);
      state2 = reducer(state2, action);
    });
    
    expect(state1).toEqual(state2);
  });

  it('should have no side effects', () => {
    const beforeConsoleLog = console.log;
    const beforeMath = Math.random;
    
    reducer(initialState, clickTrick());
    
    expect(console.log).toBe(beforeConsoleLog);
    expect(Math.random).toBe(beforeMath);
  });
});

describe('Reducer - Edge Cases', () => {
  it('should handle rapid successive clicks', () => {
    let state = initialState;
    
    for (let i = 0; i < 100; i++) {
      state = reducer(state, clickTrick());
    }
    
    expect(state.kibble).toBe(100);
    expect(state.totalClicks).toBe(100);
  });

  it('should handle reset when already at zero', () => {
    const newState = reducer(initialState, reset());
    
    expect(newState.kibble).toBe(0);
    expect(newState.totalClicks).toBe(0);
  });
});
