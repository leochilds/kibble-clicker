/**
 * UI Rendering System
 * 
 * This module handles all DOM updates based on state changes.
 * The UI is a pure function of the state.
 */

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
