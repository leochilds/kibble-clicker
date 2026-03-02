/**
 * Action Creator Tests
 * 
 * Tests for action creator functions to ensure
 * they produce correct action objects.
 */

import { describe, it, expect } from 'vitest';
import { clickTrick, reset, CLICK_TRICK, RESET } from '../../src/actions/actions.js';

describe('Action Creators', () => {
  describe('clickTrick', () => {
    it('should create a CLICK_TRICK action', () => {
      const action = clickTrick();
      
      expect(action).toEqual({
        type: CLICK_TRICK
      });
    });

    it('should have correct type constant', () => {
      expect(CLICK_TRICK).toBe('CLICK_TRICK');
    });
  });

  describe('reset', () => {
    it('should create a RESET action', () => {
      const action = reset();
      
      expect(action).toEqual({
        type: RESET
      });
    });

    it('should have correct type constant', () => {
      expect(RESET).toBe('RESET');
    });
  });

  describe('Action immutability', () => {
    it('should create new action objects each time', () => {
      const action1 = clickTrick();
      const action2 = clickTrick();
      
      expect(action1).toEqual(action2);
      expect(action1).not.toBe(action2);
    });
  });
});
