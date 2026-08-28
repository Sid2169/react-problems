
## 1. Recall Questions

*These exercises test your immediate recall of syntax, rules, and vocabulary.*

### Problem 1: Reducer Anatomy

Define the exact function signature of a standard React reducer. What two arguments must it accept, and what must it return to React?

### Problem 2: Hook Return Values

When you invoke `const [state, dispatch] = useReducer(reducer, initialState);`, what exact role does the second item (`dispatch`) serve, and what do you pass into it?

### Problem 3: The Rules of Purity

A reducer function must be **pure** because React may execute it multiple times during rendering. List three specific side effects or operations that are strictly banned inside a reducer function.

### Problem 4: Scope & Placement

Why is it considered best practice to declare your reducer function outside of the React component file or outside the component function body?

## 2. Conceptual Questions

*These questions require reasoning about state design and weighing architectural trade-offs.*

### Problem 5: Decision Matrix

Complete the following mental comparison table in your own words, then state the primary warning sign that indicates a component should be migrated from `useState` to `useReducer`:

| **Metric** | **useState** | **useReducer** |
| --- | --- | --- |
| **Upfront Code Volume** |  |  |
| **Debugging Complexity** |  |  |
| **Unit Testing Ease** |  |  |

### Problem 6: Action Granularity

Imagine a user clicks a "Reset Form" button on a profile page containing five text input fields.

1. Compare dispatching five separate actions (`{ type: 'set_first_name' }`, `{ type: 'set_last_name' }`, etc.) versus dispatching a single action (`{ type: 'reset_form' }`).
2. Why does React philosophy strongly favor the single-action approach? How does this impact your debugging logs?

### Problem 7: The Immer Paradigm

How does `useImmerReducer` fundamentally change the rules regarding immutability inside a reducer? Explain what the `draft` parameter represents and why a `return` statement is often omitted when using Immer.

## 3. Code Reading & Prediction

*Trace code execution mentally without running it in a browser.*

### Problem 8: State Evolution Tracing

Review the reducer and action sequence below. What will be the exact structure and values of `finalState` after all four actions are processed?

JavaScript

```jsx
const initialState = { count: 0, step: 1, history: [] };

function counterReducer(state, action){
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + state.step,
        history: [...state.history, '+']
      };
    case 'set_step':
      return { ...state, step: action.payload };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

// Action Sequence:
// 1. dispatch({ type: 'increment' })
// 2. dispatch({ type: 'set_step', payload: 5 })
// 3. dispatch({ type: 'increment' })
// 4. dispatch({ type: 'increment' })
```

### Problem 9: Identifying Fall-Through Bugs

Analyze the following switch-based reducer. If `dispatch({ type: 'add_tag', tag: 'urgent' })` is called when `state` is `['work']`, what exact array is returned, and what critical error occurred in the syntax?

JavaScript

```jsx
function tagsReducer(state, action){
  switch (action.type) {
    case 'add_tag':
      return [...state, action.tag];
    case 'remove_last':
      state.slice(0, -1);
    case 'clear':
      return [];
    default:
      throw Error('Unknown action: ' + action.type);
  }
}
```

## 4. Debugging Exercises

*Identify and repair intentional violations of React rules.*

### Problem 10: The Impure Reducer

The reducer below attempts to add a new user to a list. Identify two distinct violations of React principles in this code and rewrite the reducer to be completely pure.

JavaScript

```jsx
let userCount = 0;

function userReducer(users, action){
  switch (action.type) {
    case 'add_user': {
      userCount++;
      const newUser = {
        id: Math.random(),
        name: action.name,
        createdAt: new Date().toLocaleTimeString(),
        order: userCount
      };
      users.push(newUser);
      return users;
    }
    default:
      return users;
  }
}
```

### Problem 11: The Silent UI Failure

A developer built this task-toggling reducer using standard `useReducer` (without Immer). When the user clicks a checkbox, the action dispatches correctly without throwing an error, but the UI fails to re-render. Identify the bug and explain the JavaScript/React mechanics causing it.

JavaScript

```jsx
function todoReducer(todos, action){
  switch (action.type) {
    case 'toggle_todo': {
      const targetTodo = todos.find(t => t.id === action.id);
      if (targetTodo) {
        targetTodo.done = !targetTodo.done;
      }
      return todos;
    }
    default:
      return todos;
  }
}
```

## 5. Implementation Exercises

*Write clean, idiomatic reducer code from scratch.*

### Problem 12: Refactoring `useState` to `useReducer`

Convert the following shopping cart component from three `useState` calls into a single `useReducer` architecture. Define the initial state object, the `cartReducer` function, and replace the handlers inside the component.

JavaScript

```jsx
import { useState } from 'react';

export default function ShoppingCart(){
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  function handleAddItem(product){
    setItems([...items, { ...product, qty: 1 }]);
  }

  function handleApplyCoupon(code){
    setCoupon(code);
  }

  function handleStartCheckout(){
    setIsCheckingOut(true);
  }

  return (/* UI JSX omitted */);
}
```

### Problem 13: Building a Navigation History Stack

Write a reducer function named `historyReducer` that manages a browser-like tab navigation stack.

- **Initial State:** `{ past: [], current: 'home', future: [] }`
- **Action 1 (`visit_page`):** Takes a `url` payload. Moves `current` to `past`, sets `current` to `url`, and clears `future`.
- **Action 2 (`go_back`):** Moves `current` to `future`, sets `current` to the last item in `past`, and removes that item from `past`. If `past` is empty, do nothing.

## 6. Modification Exercises

*Adapt and scale existing state logic.*

### Problem 14: Extending to Undo/Redo

Take the basic counter reducer below and refactor its state shape and logic so that it supports two new actions: `'undo'` and `'redo'`.

JavaScript

```jsx
// Starter Reducer:
function simpleReducer(state, action){
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    default: return state;
  }
}
```

### Problem 15: Migrating to Immer

The following reducer manages a deeply nested data structure using standard immutable spread syntax. Refactor this entire function to use `useImmerReducer`, mutating the `draft` directly to achieve maximum readability.

JavaScript

```jsx
function companyReducer(state, action){
  switch (action.type) {
    case 'update_employee_title': {
      return {
        ...state,
        departments: state.departments.map(dept => {
          if (dept.id !== action.deptId) return dept;
          return {
            ...dept,
            employees: dept.employees.map(emp => {
              if (emp.id !== action.empId) return emp;
              return { ...emp, title: action.newTitle };
            })
          };
        })
      };
    }
    default:
      return state;
  }
}
```

## 7. Edge Case Questions

*Test boundary conditions and framework quirks.*

### Problem 16: Strict Mode Double-Execution

When running React in development with `<React.StrictMode>`, React deliberately executes your reducer functions **twice** for every single dispatched action.

1. Why does React design enforce this double-execution behavior?
2. If your reducer incorrectly contains an array mutation like `state.items.push(action.item)`, how will this Strict Mode behavior immediately manifest in your UI?

### Problem 17: Handling Unknown Actions

In production, an unhandled action type passed to a reducer can cause subtle bugs or silent failures. Write the gold-standard `default` case implementation for a TypeScript or JavaScript switch-based reducer that catches unknown action types during development without crashing the production app silently.

## 8. Real-World Challenge: State With Reducer

*Synthesize all concepts into a complex, production-grade problem.*

### Problem 18: Multi-Step Checkout Form Engine

Architect the complete state management engine for a multi-step e-commerce checkout wizard using `useReducer`.

**Requirements:**

1. **State Shape:** Must track:
    - `step` (1: Shipping, 2: Payment, 3: Review)
    - `formData` (nested object for shipping address and credit card details)
    - `errors` (object mapping field names to error strings)
    - `status` (`'idle'`, `'submitting'`, `'success'`, `'error'`)
2. **Action Requirements:**
    - `'update_field'`: Updates a specific form field and automatically removes any existing validation error for that field.
    - `'next_step'`: Advances step by 1, but only if no validation errors exist.
    - `'prev_step'`: Decrements step by 1.
    - `'submit_request'`: Sets status to `'submitting'`.
    - `'submit_success'`: Sets status to `'success'` and clears form data.
    - `'submit_failure'`: Sets status to `'error'` and populates an API error message.
3. **Deliverables:** Write the complete `initialState` object and the `checkoutReducer` function handling all six actions safely and immutably. Use either standard syntax or Immer.