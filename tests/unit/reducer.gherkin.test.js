/**
 * Reducer BDD/Gherkin-Style Tests
 * 
 * Behavior-driven tests using Given-When-Then format
 * for readable, scenario-based testing.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { reducer } from '../../src/core/reducer.js';
import { initialState } from '../../src/core/state.js';
import { clickTrick, reset } from '../../src/actions/actions.js';

describe('Feature: Earning kibble by doing tricks', () => {
  let state;

  beforeEach(() => {
    state = { ...initialState };
  });

  it('Scenario: User clicks trick button once', () => {
    // Given kibble is 0
    expect(state.kibble).toBe(0);
    expect(state.totalClicks).toBe(0);
    
    // When user clicks the trick button
    state = reducer(state, clickTrick());
    
    // Then kibble changes to 1
    expect(state.kibble).toBe(1);
    expect(state.totalClicks).toBe(1);
  });

  it('Scenario: User clicks trick button 5 times', () => {
    // Given kibble is 0
    expect(state.kibble).toBe(0);
    
    // When user clicks the trick button 5 times
    for (let i = 0; i < 5; i++) {
      state = reducer(state, clickTrick());
    }
    
    // Then kibble is 5 and total clicks is 5
    expect(state.kibble).toBe(5);
    expect(state.totalClicks).toBe(5);
  });

  it('Scenario: User earns kibble then resets', () => {
    // Given user has earned 10 kibble
    for (let i = 0; i < 10; i++) {
      state = reducer(state, clickTrick());
    }
    expect(state.kibble).toBe(10);
    expect(state.totalClicks).toBe(10);
    
    // When user resets the game
    state = reducer(state, reset());
    
    // Then kibble is 0 and clicks are 0
    expect(state.kibble).toBe(0);
    expect(state.totalClicks).toBe(0);
  });

  it('Scenario: User continues clicking after reset', () => {
    // Given user has earned and reset kibble
    for (let i = 0; i < 5; i++) {
      state = reducer(state, clickTrick());
    }
    state = reducer(state, reset());
    expect(state.kibble).toBe(0);
    
    // When user clicks 3 more times
    for (let i = 0; i < 3; i++) {
      state = reducer(state, clickTrick());
    }
    
    // Then kibble is 3
    expect(state.kibble).toBe(3);
    expect(state.totalClicks).toBe(3);
  });

  it('Scenario: User rapidly clicks many times', () => {
    // Given the game is at initial state
    expect(state.kibble).toBe(0);
    
    // When user rapidly clicks 50 times
    for (let i = 0; i < 50; i++) {
      state = reducer(state, clickTrick());
    }
    
    // Then kibble is 50
    expect(state.kibble).toBe(50);
    expect(state.totalClicks).toBe(50);
  });
});

describe('Feature: Pure functional reducer guarantees', () => {
  it('Scenario: Reducer never mutates state', () => {
    // Given an initial state
    const originalState = { ...initialState };
    const stateSnapshot = JSON.stringify(originalState);
    
    // When an action is applied
    const newState = reducer(originalState, clickTrick());
    
    // Then original state is unchanged
    expect(JSON.stringify(originalState)).toBe(stateSnapshot);
    expect(newState).not.toBe(originalState);
    expect(newState.kibble).not.toBe(originalState.kibble);
  });

  it('Scenario: Same actions produce same results (determinism)', () => {
    // Given two identical starting states
    let state1 = { ...initialState };
    let state2 = { ...initialState };
    
    // When both execute the same sequence of actions
    const actionSequence = [
      clickTrick(),
      clickTrick(),
      clickTrick(),
      reset(),
      clickTrick()
    ];
    
    actionSequence.forEach(action => {
      state1 = reducer(state1, action);
    });
    
    actionSequence.forEach(action => {
      state2 = reducer(state2, action);
    });
    
    // Then both states are identical
    expect(state1).toEqual(state2);
  });

  it('Scenario: Action order matters (non-commutative)', () => {
    // Given initial state
    let stateA = { ...initialState };
    let stateB = { ...initialState };
    
    // When actions are applied in different orders
    // Sequence A: click, click, reset
    stateA = reducer(stateA, clickTrick());
    stateA = reducer(stateA, clickTrick());
    stateA = reducer(stateA, reset());
    
    // Sequence B: click, reset, click
    stateB = reducer(stateB, clickTrick());
    stateB = reducer(stateB, reset());
    stateB = reducer(stateB, clickTrick());
    
    // Then results differ
    expect(stateA.kibble).toBe(0);
    expect(stateB.kibble).toBe(1);
  });
});

describe('Feature: Game state consistency', () => {
  it('Scenario: Kibble and clicks stay synchronized', () => {
    // Given initial state
    let state = { ...initialState };
    
    // When user performs various actions
    state = reducer(state, clickTrick());
    expect(state.kibble).toBe(state.totalClicks);
    
    state = reducer(state, clickTrick());
    expect(state.kibble).toBe(state.totalClicks);
    
    state = reducer(state, clickTrick());
    expect(state.kibble).toBe(state.totalClicks);
    
    // Then kibble always equals total clicks (for now)
    expect(state.kibble).toBe(state.totalClicks);
  });

  it('Scenario: Reset clears all progress', () => {
    // Given user has made significant progress
    let state = { ...initialState };
    for (let i = 0; i < 100; i++) {
      state = reducer(state, clickTrick());
    }
    expect(state.kibble).toBe(100);
    
    // When user resets
    state = reducer(state, reset());
    
    // Then all counters return to zero
    expect(state.kibble).toBe(0);
    expect(state.totalClicks).toBe(0);
  });
});
