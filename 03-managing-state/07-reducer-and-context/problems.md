---

## 1. Recall Questions

- **Problem 1.1:** In a deep React component tree, what specific operational issue does combining a reducer with Context solve that a reducer alone cannot?
- **Problem 1.2:** Review the lesson's standard architectural step for initializing contexts:JavaScript
    
    ```jsx
    export const TasksContext = createContext(null);
    export const TasksDispatchContext = createContext(null);
    ```
    
    Why is `null` explicitly chosen as the default argument here rather than passing the `initialTasks` array or the `tasksReducer` function directly?
    
- **Problem 1.3:** What syntactic convention defines a JavaScript function as a "Custom Hook" in React, and what unique structural capability does this convention grant that function?
- **Problem 1.4:** When consolidating state wiring into a single module, what special prop must the wrapper provider component (e.g., `TasksProvider`) accept and render, and why?

## 2. Conceptual Questions

- **Problem 2.1:** The lesson advises splitting state and dispatch into two separate contexts (`TasksContext` and `TasksDispatchContext`) instead of binding them into a single object wrapper like `createContext({ tasks, dispatch })`.
    - Explain the performance and re-render implications of this choice on components that *only* dispatch actions (like an `AddTask` input field) when the underlying state updates.
- **Problem 2.2:** When you refactor a component tree to use the single-file context/reducer wiring pattern (moving the state definition and reducer function into `TasksContext.js`), where does the application state *structurally* live during runtime execution? Has its ownership changed?
- **Problem 2.3:** Consider the following architecture diagram representing data flow:

```
[ TaskApp (Hosts TasksProvider) ]
              │
      ┌───────┴───────┐
 [ AddTask ]     [ TaskList ]
                      │
                  [ Task ]
```

Describe how removing prop-drilling impacts component testability. What are the advantages and drawbacks when trying to unit-test `Task` in isolation now that it consumes data via Context rather than direct props?

## 3. Code Reading & Prediction Exercises

### Problem 3.1: The Evaluation Trail

Study the code snippet below and predict what prints to the console or renders on screen when the user clicks the "Verify State" button immediately after mounting.

JavaScript

```jsx
import { createContext, useContext, useReducer } from 'react';

const CounterContext = createContext(null);

function counterReducer(state, action){
  switch (action.type) {
    case 'increment': return state + 1;
    default: return state;
  }
}

export function CounterProvider({ children }){
  const [count, dispatch] = useReducer(counterReducer, 0);
  return (
    <CounterContext value={count}>
      {children}
    </CounterContext>
  );
}

export default function DeepChildComponent(){
  const count = useContext(CounterContext);

  return (
    <button onClick={() => console.log("Current Count:", count)}>
      Verify State
    </button>
  );
}

// In App.js:
// <CounterProvider>
//   <DeepChildComponent />
// </CounterProvider>
```

### Problem 3.2: Missing Hooks Flow

Look closely at this variation of the lesson's `AddTask` component. Assume that `TasksDispatchContext` is properly configured in a parent module. Predict the exact application behavior and state outcome when a user enters text into the input field and presses the "Add" button.

JavaScript

```jsx
import { useState, useContext } from 'react';
import { TasksDispatchContext } from './TasksContext.js';

export default function BrokenAddTask(){
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);

  function handleAction(){
    setText('');
    dispatch({
      type: 'added',
      id: Math.random(),
      text: text
    });
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAction}>Add</button>
    </>
  );
}
```

## 4. Debugging Exercises

### Problem 4.1: The Ghost Mutations

The following reducer and provider implementation compiles without immediate syntax crashes, but users report that clicking the "complete" toggle checkbox updates the console logs but fails to cause visual changes or re-renders across other consumer components. Identify the deliberate mutation bug, explain why it bypasses React's render loops, and provide the fixed code block.

JavaScript

```jsx
// src/SettingsContext.js
import { createContext, useReducer } from 'react';

export const SettingsContext = createContext(null);

function settingsReducer(settings, action){
  switch (action.type) {
    case 'toggle_dark_mode': {
      // Intentional Bug Here
      settings.darkMode = !settings.darkMode;
      return settings;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export function SettingsProvider({ children }){
  const [settings, dispatch] = useReducer(settingsReducer, { darkMode: false });
  return (
    <SettingsContext value={settings}>
      {children}
    </SettingsContext>
  );
}
```

### Problem 4.2: The Disappearing Subtree

A developer attempts to create a custom provider to wrap a notification tracking system. When they mount this component inside their layout, the entire screen goes blank below the header banner. Pinpoint the structural component configuration error and rewrite the corrected component.

JavaScript

```jsx
// src/NotificationContext.js
import { createContext, useReducer } from 'react';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }){
  const [alerts, dispatch] = useReducer((state, action) => state, []);

  return (
    <NotificationContext value={alerts}>
      <div className="alert-banner-wrapper">
        {/* Alerts render here */}
      </div>
    </NotificationContext>
  );
}
```

## 5. Implementation Exercises

### Problem 5.1: The E-Commerce Cart Manager from Scratch

Implement a completely modular, self-contained single-file state framework titled `CartContext.js` designed to power a digital checkout display screen.

- **Requirements:**
    1. Create two separate internal contexts for state data and action dispatch loops.
    2. Build an encapsulated `CartProvider` component that uses `useReducer` to track the state data.
    3. The state structure must be an array of objects: `[ { id: 1, name: 'Book', quantity: 2 } ]`.
    4. Support three core action profiles inside the reducer: `'item_added'`, `'item_removed'`, and `'cart_cleared'`.
    5. Export two clean custom hooks: `useCart()` and `useCartDispatch()`.
    6. Ensure that items adding an existing `id` increment the target item's `quantity` rather than inserting a duplicate object.

JavaScript

```jsx
// Starter Code Structure to build out:
import { createContext, useContext, useReducer } from 'react';

// 1. Initialize Contexts

// 2. Reducer Engine

// 3. Provider Component

// 4. Custom Hooks Exporters
```

## 6. Modification Exercises

### Problem 6.1: Integrating Dynamic Filters

Take the baseline encapsulated state management module provided below and modify it so it can store, manage, and toggle an active UI filtering mode (`'all'`, `'completed'`, or `'active'`).

- **Tasks:**
    1. Update `initialAppState` to handle an object state layout containing both the list array and a dynamic status flag.
    2. Extend the switch matching blocks inside `appReducer` to process a new action type profile: `'filter_changed'`.
    3. Update the item array operations so that adding or deleting tasks properly preserves immutable update standards inside this multi-tiered object layer.

JavaScript

```jsx
// Starter Code - Modify this structure
import { createContext, useContext, useReducer } from 'react';

const AppStateContext = createContext(null);
const AppDispatchContext = createContext(null);

const initialAppState = {
  items: [
    { id: 0, text: 'Collect logs', done: true },
    { id: 1, text: 'Build campfire', done: false }
  ]
  // TODO: Add filter criteria state key here
};

function appReducer(state, action){
  switch (action.type) {
    case 'item_added': {
      return {
        ...state,
        items: [...state.items, { id: action.id, text: action.text, done: false }]
      };
    }
    // TODO: Add 'filter_changed' mapping case
    default:
      throw Error('Unknown action: ' + action.type);
  }
}

export function AppStateProvider({ children }){
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  return (
    <AppStateContext value={state}>
      <AppDispatchContext value={dispatch}>
        {children}
      </AppDispatchContext>
    </AppStateContext>
  );
}
```

## 7. Edge Case Questions

- **Problem 7.1:** Consider a standard production error where a junior engineer mounts a component that executes a custom hook call like `const dispatch = useTasksDispatch();` entirely *outside* or *above* the parent container boundaries of the `<TasksProvider>` markup layout.
    - What concrete JavaScript value returns by default from `useContext` under this condition?
    - Refactor the standard hook implementation below to gracefully implement defensive programming patterns, explicitly throwing a descriptive developer error when out-of-bounds context execution occurs.

JavaScript

```jsx
export function useTasksDispatch(){
  const context = useContext(TasksDispatchContext);
  // Implement a defensive boundary check here
  return context;
}
```

- **Problem 7.2:** Imagine an intense, high-frequency user environment where a deep child view dispatches a valid action type (e.g., `dispatch({ type: 'changed', task: updatedTask })`), but the current state array matches the incoming modifications identically.
    - Does React compute a deep comparative analysis on object keys by default within `useReducer` structures to skip re-renders?
    - Based on how JavaScript handles array memory reference identities across copy spreads like `return [...tasks]`, trace whether sibling components consuming `useTasks()` execute render phases anyway.

## 8. Real-World Challenges

### The Enterprise Project Management Dashboard Board Architecture

You are tasked with engineering the state architecture for a multi-user Kanban project tracking workspace application. The layout features structural data groups across fluid tracking columns.

```
┌────────────────────────────────────────────────────────┐
│               [ Board Overview Header ]                │
├───────────────────┬───────────────────┬────────────────┤
│    [ To Do ]      │   [ In Progress ] │   [ Done ]     │
│  - Task Alpha     │  - Task Gamma     │  - Task Delta  │
│  - Task Beta      │                   │                │
└───────────────────┴───────────────────┴────────────────┘
```

#### Core Specifications:

1. **State Schema Modeling:** The central state object must safely structure tracking values for metadata tags, task tracking rows, and tracking state categories:JavaScript
    
    ```jsx
    const initialBoardState = {
      workspaceName: "Kyoto Operations",
      lastUpdatedBy: "System",
      columns: {
        todo: [
          { id: "t1", title: "Audit tea house inventory", complexity: "Medium" }
        ],
        inProgress: [],
        done: []
      }
    };
    ```
    
2. **State Transformation Requirements:** Write a comprehensive `boardReducer` module managing four core high-friction state transaction behaviors safely:
    - `'task_created'`: Appends a fresh element item into a specific, named workflow category key.
    - `'task_moved'`: Atomically moves a target item index *from* a source column dictionary collection *into* a destination collection path key.
    - `'workspace_renamed'`: Mutates global board top-level text attributes cleanly.
3. **Encapsulation Layout:** Bundle this engine safely into a single module file containing dynamic provider boundaries and robust custom consumer hooks that guard against out-of-bounds wrapper system consumption faults. Minimize components from needing to know how columns are organized internally.