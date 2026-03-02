/**
 * UI Rendering System
 * 
 * This module handles all DOM updates based on state changes.
 * The UI is a pure function of the state.
 */

import { getTrickByLevel, getNextTrick, isMaxLevel } from '../config/tricks.js';

/**
 * Format reward object into a readable string
 * @param {Object} reward - Reward object
 * @returns {string} Formatted reward string
 */
function formatReward(reward) {
  const parts = [];
  
  // Basic Treats
  if (reward.kibble) parts.push(`${reward.kibble} 🦴`);
  if (reward.chickenTreats) parts.push(`${reward.chickenTreats} 🍗`);
  if (reward.steakTreats) parts.push(`${reward.steakTreats} 🥩`);
  
  // Premium Treats
  if (reward.baconStrips) parts.push(`${reward.baconStrips} 🥓`);
  if (reward.salmonFillets) parts.push(`${reward.salmonFillets} 🐟`);
  if (reward.lambChops) parts.push(`${reward.lambChops} 🍖`);
  
  // Gourmet Treats
  if (reward.lobsterTails) parts.push(`${reward.lobsterTails} 🦞`);
  if (reward.wagyuBeef) parts.push(`${reward.wagyuBeef} 🥩✨`);
  if (reward.truffleTreats) parts.push(`${reward.truffleTreats} 🍄`);
  
  // Exotic Treats
  if (reward.goldenBones) parts.push(`${reward.goldenBones} 🦴✨`);
  if (reward.dragonFruit) parts.push(`${reward.dragonFruit} 🐉`);
  if (reward.unicornKibble) parts.push(`${reward.unicornKibble} 🦄`);
  
  // Legendary Treats
  if (reward.phoenixFeathers) parts.push(`${reward.phoenixFeathers} 🔥`);
  if (reward.cosmicCookies) parts.push(`${reward.cosmicCookies} ⭐`);
  if (reward.celestialChews) parts.push(`${reward.celestialChews} 🌙`);
  
  // Mythical Treats
  if (reward.quantumBiscuits) parts.push(`${reward.quantumBiscuits} ⚛️`);
  if (reward.infinityTreats) parts.push(`${reward.infinityTreats} ♾️`);
  if (reward.singularitySnacks) parts.push(`${reward.singularitySnacks} 🌌`);
  
  return parts.join(' + ') || '0 🦴';
}

/**
 * Render function - updates the DOM based on state
 * @param {Object} state - Current application state
 */
export function render(state) {
  // Update kibble count
  const kibbleCount = document.getElementById('kibble-count');
  if (kibbleCount) {
    kibbleCount.textContent = state.kibble;
  }

  // Update total clicks
  const totalClicks = document.getElementById('total-clicks');
  if (totalClicks) {
    totalClicks.textContent = state.totalClicks;
  }

  // Update total earned
  const totalEarned = document.getElementById('total-earned');
  if (totalEarned) {
    totalEarned.textContent = state.totalKibbleEarned;
  }

  // Update current trick display
  const currentTrick = getTrickByLevel(state.trickLevel);
  const currentTrickName = document.getElementById('current-trick-name');
  const currentTrickLevel = document.getElementById('current-trick-level');
  const currentTrickReward = document.getElementById('current-trick-reward');
  
  if (currentTrickName) {
    currentTrickName.textContent = currentTrick.name;
  }
  if (currentTrickLevel) {
    currentTrickLevel.textContent = state.trickLevel;
  }
  if (currentTrickReward) {
    currentTrickReward.textContent = formatReward(currentTrick.reward);
  }

  // Update training school
  const maxLevel = isMaxLevel(state.trickLevel);
  const nextTrickCard = document.querySelector('.next-trick-card');
  const maxLevelMessage = document.getElementById('max-level-message');
  
  if (maxLevel) {
    // Show max level message
    if (nextTrickCard) nextTrickCard.style.display = 'none';
    if (maxLevelMessage) maxLevelMessage.style.display = 'block';
  } else {
    // Show next trick card
    if (nextTrickCard) nextTrickCard.style.display = 'block';
    if (maxLevelMessage) maxLevelMessage.style.display = 'none';
    
    const nextTrick = getNextTrick(state.trickLevel);
    if (nextTrick) {
      const nextTrickName = document.getElementById('next-trick-name');
      const nextTrickDescription = document.getElementById('next-trick-description');
      const nextTrickReward = document.getElementById('next-trick-reward');
      const upgradeCost = document.getElementById('upgrade-cost');
      const upgradeButton = document.getElementById('upgrade-button');
      
      if (nextTrickName) {
        nextTrickName.textContent = nextTrick.name;
      }
      if (nextTrickDescription) {
        nextTrickDescription.textContent = nextTrick.description;
      }
      if (nextTrickReward) {
        nextTrickReward.textContent = formatReward(nextTrick.reward);
      }
      if (upgradeCost) {
        upgradeCost.textContent = nextTrick.cost;
      }
      
      // Enable/disable upgrade button based on affordability
      if (upgradeButton) {
        const canAfford = state.kibble >= nextTrick.cost;
        upgradeButton.disabled = !canAfford;
        upgradeButton.classList.toggle('disabled', !canAfford);
      }
    }
  }

  // Add animation when kibble increases
  if (kibbleCount) {
    kibbleCount.classList.add('updated');
    setTimeout(() => {
      kibbleCount.classList.remove('updated');
    }, 200);
  }
}

/**
 * Bind event handlers to dispatch actions
 * @param {Function} dispatch - Dispatch function from ActionQueue
 * @param {Object} actions - Action creators
 */
export function bindEvents(dispatch, actions) {
  // Trick button click
  const trickButton = document.getElementById('trick-button');
  if (trickButton) {
    trickButton.addEventListener('click', () => {
      dispatch(actions.clickTrick());
      
      // Add button animation
      trickButton.classList.add('clicked');
      setTimeout(() => {
        trickButton.classList.remove('clicked');
      }, 100);
    });
  }

  // Upgrade button click
  const upgradeButton = document.getElementById('upgrade-button');
  if (upgradeButton) {
    upgradeButton.addEventListener('click', () => {
      dispatch(actions.purchaseUpgrade());
      
      // Add button animation
      upgradeButton.classList.add('clicked');
      setTimeout(() => {
        upgradeButton.classList.remove('clicked');
      }, 100);
    });
  }

  // Reset button
  const resetButton = document.getElementById('reset-button');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset your progress?')) {
        dispatch(actions.reset());
      }
    });
  }

  // Keyboard shortcut (spacebar to click)
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      dispatch(actions.clickTrick());
    }
  });

  // Bug Report button
  const bugReportButton = document.getElementById('bug-report-button');
  if (bugReportButton) {
    bugReportButton.addEventListener('click', () => {
      const bugReport = window.app.generateBugReport();
      const json = JSON.stringify(bugReport, null, 2);
      
      // Try to copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).then(() => {
          showBugReportModal(json, true);
        }).catch(() => {
          showBugReportModal(json, false);
        });
      } else {
        showBugReportModal(json, false);
      }
    });
  }
}

/**
 * Show bug report modal
 * @param {string} json - Bug report JSON
 * @param {boolean} copied - Whether it was copied to clipboard
 */
function showBugReportModal(json, copied) {
  // Remove existing modal if any
  const existingModal = document.querySelector('.bug-report-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'bug-report-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <h2>🐛 Bug Report Generated</h2>
      <p class="modal-message">${copied ? '✅ Copied to clipboard!' : 'Copy the JSON below:'}</p>
      <textarea class="bug-report-json" readonly>${json}</textarea>
      <div class="modal-buttons">
        <button class="modal-btn primary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
        <button class="modal-btn copy-btn">📋 Copy Again</button>
      </div>
      <p class="modal-help">Paste this JSON when reporting a bug to help reproduce the issue.</p>
    </div>
  `;
  
  document.body.appendChild(modal);

  // Copy button functionality
  const copyBtn = modal.querySelector('.copy-btn');
  const textarea = modal.querySelector('textarea');
  copyBtn.addEventListener('click', () => {
    textarea.select();
    document.execCommand('copy');
    copyBtn.textContent = '✓ Copied!';
    setTimeout(() => {
      copyBtn.textContent = '📋 Copy Again';
    }, 2000);
  });

  // Close on overlay click
  modal.querySelector('.modal-overlay').addEventListener('click', () => {
    modal.remove();
  });
}
