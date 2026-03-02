/**
 * Replay Suite Controller
 * 
 * Interactive tool for stepping through action sequences
 * and visualizing state changes.
 */

import { initialState } from '../src/core/state.js';
import { reducer } from '../src/core/reducer.js';
import { clickTrick, reset } from '../src/actions/actions.js';

// Predefined test scenarios
const scenarios = {
  'single-click': [clickTrick()],
  'five-clicks': Array(5).fill(null).map(() => clickTrick()),
  'ten-clicks': Array(10).fill(null).map(() => clickTrick()),
  'click-and-reset': [
    ...Array(5).fill(null).map(() => clickTrick()),
    reset(),
    ...Array(3).fill(null).map(() => clickTrick())
  ],
  'complex': [
    clickTrick(),
    clickTrick(),
    clickTrick(),
    reset(),
    clickTrick(),
    clickTrick(),
    reset(),
    ...Array(5).fill(null).map(() => clickTrick())
  ],
  'stress-test': Array(50).fill(null).map(() => clickTrick())
};

class ReplayController {
  constructor() {
    this.snapshots = [];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.playbackSpeed = 1;
    this.playInterval = null;
    this.customActions = [];
    
    this.init();
  }

  init() {
    // Initialize with no scenario loaded
    this.loadScenario([]);
    this.bindEvents();
    this.render();
  }

  /**
   * Load a scenario and generate state snapshots
   */
  loadScenario(actions) {
    this.loadScenarioWithStartingState(actions, initialState);
  }

  /**
   * Load scenario with custom starting state (for bug reports)
   */
  loadScenarioWithStartingState(actions, startingState) {
    this.snapshots = [];
    this.currentIndex = 0;
    this.stopAutoPlay();

    // Create initial snapshot with custom starting state
    this.snapshots.push({
      index: 0,
      action: null,
      state: { ...startingState },
      previous: null
    });

    // Generate snapshots for each action
    let currentState = { ...startingState };
    actions.forEach((action, i) => {
      const previousState = { ...currentState };
      currentState = reducer(currentState, action);
      
      this.snapshots.push({
        index: i + 1,
        action: action,
        state: { ...currentState },
        previous: previousState
      });
    });

    this.render();
  }

  /**
   * Load bug report from JSON
   */
  loadBugReport(jsonString) {
    try {
      const bugReport = JSON.parse(jsonString);
      
      // Validate format
      if (!bugReport.startingState || !bugReport.actions) {
        throw new Error('Invalid bug report format. Missing startingState or actions.');
      }

      // Load the scenario with the starting state from bug report
      this.loadScenarioWithStartingState(bugReport.actions, bugReport.startingState);
      
      // Show success message with metadata
      const metadata = bugReport.metadata || {};
      alert(
        `✅ Bug report loaded successfully!\n\n` +
        `📅 Timestamp: ${bugReport.timestamp || 'Unknown'}\n` +
        `🎬 Actions: ${bugReport.actions.length}\n` +
        `📊 Total session actions: ${metadata.totalActionsInSession || 'Unknown'}\n` +
        `🎮 Game version: ${metadata.gameVersion || 'Unknown'}`
      );
      
      console.log('Bug Report Loaded:', bugReport);
      
    } catch (error) {
      alert('❌ Error loading bug report:\n\n' + error.message);
      console.error('Bug report load error:', error);
    }
  }

  /**
   * Navigate to specific snapshot index
   */
  goToIndex(index) {
    if (index >= 0 && index < this.snapshots.length) {
      this.currentIndex = index;
      this.render();
    }
  }

  /**
   * Navigation methods
   */
  goToFirst() {
    this.goToIndex(0);
  }

  goToLast() {
    this.goToIndex(this.snapshots.length - 1);
  }

  goToPrevious() {
    this.goToIndex(this.currentIndex - 1);
  }

  goToNext() {
    this.goToIndex(this.currentIndex + 1);
  }

  /**
   * Auto-play functionality
   */
  toggleAutoPlay() {
    if (this.isPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  startAutoPlay() {
    if (this.currentIndex >= this.snapshots.length - 1) {
      this.currentIndex = 0;
    }
    
    this.isPlaying = true;
    const playBtn = document.getElementById('btn-play');
    playBtn.textContent = '⏸️ Pause';
    playBtn.classList.add('playing');

    const delay = 1000 / this.playbackSpeed;
    this.playInterval = setInterval(() => {
      if (this.currentIndex < this.snapshots.length - 1) {
        this.goToNext();
      } else {
        this.stopAutoPlay();
      }
    }, delay);
  }

  stopAutoPlay() {
    this.isPlaying = false;
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
    
    const playBtn = document.getElementById('btn-play');
    playBtn.textContent = '▶️ Play';
    playBtn.classList.remove('playing');
  }

  /**
   * Calculate diff between two states
   */
  getDiff(prevState, currentState) {
    const diff = {};
    for (const key in currentState) {
      if (prevState[key] !== currentState[key]) {
        diff[key] = {
          from: prevState[key],
          to: currentState[key]
        };
      }
    }
    return diff;
  }

  /**
   * Render all UI components
   */
  render() {
    const snapshot = this.snapshots[this.currentIndex];
    if (!snapshot) return;

    this.renderGamePreview(snapshot.state);
    this.renderStateInspector(snapshot);
    this.renderTimeline();
    this.renderActionList();
    this.updateControls();
  }

  /**
   * Render game state preview
   */
  renderGamePreview(state) {
    const kibbleEl = document.getElementById('preview-kibble');
    const clicksEl = document.getElementById('preview-clicks');

    // Add animation class
    kibbleEl.classList.add('changed');
    setTimeout(() => kibbleEl.classList.remove('changed'), 300);

    kibbleEl.textContent = state.kibble;
    clicksEl.textContent = state.totalClicks;
  }

  /**
   * Render state inspector
   */
  renderStateInspector(snapshot) {
    document.getElementById('current-index').textContent = this.currentIndex;
    document.getElementById('total-actions').textContent = this.snapshots.length - 1;
    
    document.getElementById('state-display').textContent = 
      JSON.stringify(snapshot.state, null, 2);

    // Show diff if not at initial state
    const diffContainer = document.getElementById('state-diff-container');
    if (this.currentIndex > 0 && snapshot.previous) {
      const diff = this.getDiff(snapshot.previous, snapshot.state);
      const diffText = Object.entries(diff)
        .map(([key, change]) => `${key}: ${change.from} → ${change.to}`)
        .join('\n');
      
      document.getElementById('state-diff').textContent = diffText;
      diffContainer.style.display = 'block';
    } else {
      diffContainer.style.display = 'none';
    }
  }

  /**
   * Render timeline
   */
  renderTimeline() {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';

    this.snapshots.forEach((snapshot, index) => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      
      if (index === this.currentIndex) {
        item.classList.add('current');
      } else if (index < this.currentIndex) {
        item.classList.add('past');
      } else {
        item.classList.add('future');
      }

      const indexEl = document.createElement('div');
      indexEl.className = 'timeline-item-index';
      indexEl.textContent = index;

      const actionEl = document.createElement('div');
      actionEl.className = 'timeline-item-action';
      actionEl.textContent = snapshot.action ? snapshot.action.type : 'INIT';

      const valueEl = document.createElement('div');
      valueEl.className = 'timeline-item-value';
      valueEl.textContent = `K: ${snapshot.state.kibble}`;

      item.appendChild(indexEl);
      item.appendChild(actionEl);
      item.appendChild(valueEl);

      item.addEventListener('click', () => this.goToIndex(index));

      timeline.appendChild(item);
    });
  }

  /**
   * Render action list
   */
  renderActionList() {
    const actionList = document.getElementById('action-list');
    actionList.innerHTML = '';

    this.snapshots.forEach((snapshot, index) => {
      const item = document.createElement('div');
      item.className = 'action-item';
      
      if (index === this.currentIndex) {
        item.classList.add('current');
      } else if (index < this.currentIndex) {
        item.classList.add('past');
      } else {
        item.classList.add('future');
      }

      const mainDiv = document.createElement('div');
      mainDiv.className = 'action-item-main';

      const indexDiv = document.createElement('div');
      indexDiv.className = 'action-item-index';
      indexDiv.textContent = index;

      const typeDiv = document.createElement('div');
      typeDiv.className = 'action-item-type';
      typeDiv.textContent = snapshot.action ? snapshot.action.type : 'INITIAL_STATE';

      const resultDiv = document.createElement('div');
      resultDiv.className = 'action-item-result';
      resultDiv.textContent = `Kibble: ${snapshot.state.kibble}, Clicks: ${snapshot.state.totalClicks}`;

      mainDiv.appendChild(indexDiv);
      mainDiv.appendChild(typeDiv);
      item.appendChild(mainDiv);
      item.appendChild(resultDiv);

      item.addEventListener('click', () => this.goToIndex(index));

      actionList.appendChild(item);
    });
  }

  /**
   * Update control button states
   */
  updateControls() {
    document.getElementById('btn-first').disabled = this.currentIndex === 0;
    document.getElementById('btn-prev').disabled = this.currentIndex === 0;
    document.getElementById('btn-next').disabled = this.currentIndex >= this.snapshots.length - 1;
    document.getElementById('btn-last').disabled = this.currentIndex >= this.snapshots.length - 1;
    document.getElementById('btn-play').disabled = this.snapshots.length <= 1;
  }

  /**
   * Custom action methods
   */
  addCustomAction(action) {
    this.customActions.push(action);
    this.renderCustomActions();
  }

  clearCustomActions() {
    this.customActions = [];
    this.renderCustomActions();
  }

  runCustomActions() {
    if (this.customActions.length > 0) {
      this.loadScenario(this.customActions);
      
      // Remove active class from scenario buttons
      document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.remove('active');
      });
    }
  }

  renderCustomActions() {
    const display = document.getElementById('custom-actions-display');
    if (this.customActions.length === 0) {
      display.textContent = 'No actions added yet';
    } else {
      display.textContent = this.customActions
        .map((action, i) => `${i + 1}. ${action.type}`)
        .join('\n');
    }
  }

  /**
   * Bind all event handlers
   */
  bindEvents() {
    // Scenario buttons
    document.querySelectorAll('.scenario-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scenario = e.target.dataset.scenario;
        this.loadScenario(scenarios[scenario]);
        
        // Update active state
        document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
      });
    });

    // Control buttons
    document.getElementById('btn-first').addEventListener('click', () => this.goToFirst());
    document.getElementById('btn-prev').addEventListener('click', () => this.goToPrevious());
    document.getElementById('btn-play').addEventListener('click', () => this.toggleAutoPlay());
    document.getElementById('btn-next').addEventListener('click', () => this.goToNext());
    document.getElementById('btn-last').addEventListener('click', () => this.goToLast());

    // Speed slider
    const speedSlider = document.getElementById('speed-slider');
    const speedLabel = document.getElementById('speed-label');
    speedSlider.addEventListener('input', (e) => {
      this.playbackSpeed = parseFloat(e.target.value);
      speedLabel.textContent = `${this.playbackSpeed}x`;
      
      // Restart auto-play if currently playing
      if (this.isPlaying) {
        this.stopAutoPlay();
        this.startAutoPlay();
      }
    });

    // Custom action buttons
    document.getElementById('add-click').addEventListener('click', () => {
      this.addCustomAction(clickTrick());
    });

    document.getElementById('add-reset').addEventListener('click', () => {
      this.addCustomAction(reset());
    });

    document.getElementById('clear-custom').addEventListener('click', () => {
      this.clearCustomActions();
    });

    document.getElementById('run-custom').addEventListener('click', () => {
      this.runCustomActions();
    });

    // Import bug report
    const importBtn = document.getElementById('import-bug-report');
    const jsonTextarea = document.getElementById('bug-report-json');
    
    if (importBtn && jsonTextarea) {
      importBtn.addEventListener('click', () => {
        const json = jsonTextarea.value.trim();
        if (json) {
          this.loadBugReport(json);
          jsonTextarea.value = ''; // Clear after import
        } else {
          alert('Please paste a bug report JSON first.');
        }
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Prevent shortcuts if typing in input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.goToNext();
          break;
        case 'Home':
          e.preventDefault();
          this.goToFirst();
          break;
        case 'End':
          e.preventDefault();
          this.goToLast();
          break;
        case ' ':
          e.preventDefault();
          this.toggleAutoPlay();
          break;
      }
    });
  }
}

// Initialize replay controller
const replayController = new ReplayController();

// Expose for debugging
window.replayController = replayController;

console.log('🎬 Replay Suite initialized!');
console.log('💡 Keyboard shortcuts:');
console.log('   ← / → : Navigate actions');
console.log('   Home / End : Go to start/end');
console.log('   Space : Play/Pause');
