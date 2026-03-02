# 🐾 Kibble Clicker

A simple clicker game built with pure functional programming principles. Click the trick button to earn kibble!

## 🎯 Architecture

This project demonstrates a **pure functional architecture** inspired by Redux/Elm, making it incredibly testable and debuggable.

### Core Principles

1. **Single State Object** - All game data lives in one immutable state object
2. **Pure Reducer Function** - `(state, action) => newState` - deterministic and side-effect free
3. **Action Queue with Generator** - Actions are queued and processed sequentially
4. **State-Driven UI** - UI automatically reflects state changes

### File Structure

```
kibble-clicker/
├── index.html              # Entry point
├── styles.css              # Styling
├── src/
│   ├── core/
│   │   ├── state.js        # Initial state definition
│   │   ├── reducer.js      # Pure reducer function
│   │   └── actionQueue.js  # Generator-based action queue
│   ├── actions/
│   │   └── actions.js      # Action creators
│   ├── ui/
│   │   └── render.js       # UI rendering logic
│   └── main.js             # Application initialization
└── tests/
    └── reducer.test.html   # Browser-based tests
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies (for Vitest testing)
npm install
```

### Running the App

Since this app uses ES6 modules, you need to run it through a local server (not `file://` protocol).

```bash
# Start development server
npm run dev
```

Then open your browser to `http://localhost:8000`

### Running Tests

#### Vitest Unit Tests (Command Line)

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

#### Browser-Based Tests

Open these in your browser (with dev server running):
- **Legacy Tests**: `http://localhost:8000/tests/reducer.test.html`
- **Replay Suite**: `http://localhost:8000/tests/replay.html` 🎬

## 🎮 How to Play

1. Click the "DO A TRICK!" button to earn 1 kibble
2. Alternatively, press the **spacebar** for quick clicking
3. Watch your kibble count increase!
4. Reset your progress with the Reset button

## 🧪 Testing & Debugging

### Vitest Unit Tests

Professional test suite with Gherkin/BDD-style scenarios:

```javascript
// Example from tests/unit/reducer.gherkin.test.js
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
```

**Test Files:**
- `tests/unit/reducer.test.js` - Core reducer tests
- `tests/unit/reducer.gherkin.test.js` - BDD/Gherkin scenarios
- `tests/unit/actions.test.js` - Action creator tests

### Interactive Replay Suite 🎬

Visual debugging tool for stepping through action sequences:

**Features:**
- **Timeline View** - Visual representation of all actions
- **State Inspector** - View current state and diffs
- **Navigation Controls** - Step forward/back through actions
- **Auto-Play** - Automatic playback with speed control
- **Predefined Scenarios** - Common test sequences
- **Custom Actions** - Build your own test sequences

**Usage:**
1. Open `http://localhost:8000/tests/replay.html`
2. Select a scenario or build custom actions
3. Use controls to navigate through states
4. View state changes in real-time

**Keyboard Shortcuts:**
- `←` / `→` - Navigate actions
- `Home` / `End` - Go to start/end
- `Space` - Play/Pause

The pure functional architecture makes all this possible:

### Debug in Browser Console

```javascript
// View current state
app.getState()

// View state history (for debugging/replay)
app.getHistory()

// Manually dispatch actions
app.dispatch(actions.clickTrick())

// Check queue length
app.getQueueLength()
```

### Example Test Case

```javascript
// Test: Clicking trick 3 times gives 3 kibble
let state = initialState;
state = reducer(state, clickTrick());
state = reducer(state, clickTrick());
state = reducer(state, clickTrick());
assert(state.kibble === 3);
```

## 🎨 Features

### Game Features
- ✨ Beautiful gradient UI
- 🎯 Pure functional state management
- 🔄 Action queue with generator
- 📊 Real-time stats tracking
- ⌨️ Keyboard shortcuts (spacebar)
- 📱 Responsive design

### Testing & Development
- 🧪 Vitest unit tests with Gherkin/BDD scenarios
- 🎬 Interactive replay suite for visual debugging
- 📈 Code coverage reports
- 🐛 Full debugging capabilities
- ⏮️ Time-travel debugging through state history
- 🎯 Deterministic testing with action sequences

## 🔧 Key Benefits of This Architecture

1. **Testability** - Queue actions and verify state transitions deterministically
2. **Debugging** - Replay action sequences to reproduce bugs
3. **Time Travel** - Easy to implement undo/redo with state history
4. **Predictability** - Pure functions make behavior completely predictable
5. **Simplicity** - No external dependencies, just vanilla JavaScript

## 🚀 Future Enhancements

This architecture makes it trivial to add:
- More action types (buy upgrades, auto-clickers, etc.)
- Persistence (save/load state to localStorage)
- Achievements (derived from state)
- Time-based actions (passive income)
- State snapshots for save games

## 📝 License

GPL-3.0 License - See LICENSE file for details

## 🎓 Learning Points

This project demonstrates:
- Pure functional programming in JavaScript
- Generator functions for iterative processing
- Unidirectional data flow
- State management patterns
- ES6 modules
- Separation of concerns
- Testable architecture

Enjoy clicking! 🐾
