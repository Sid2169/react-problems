

## 1. Recall Questions

1. **State as a Snapshot:** If you call a state setter like `setCount(count + 1)` three times in rapid succession within a single synchronous event handler, why does the state only increment by 1 instead of 3? What underlying property of React renders dictates this behavior?
2. **The Definition of Batching:** What is state batching in React, and what primary performance problem does it solve? How does batching prevent "half-finished" UI states from being displayed to the user?
3. **Updater Function Syntax:** What syntactic distinction tells React to append a *function* to the state update queue rather than replacing the value directly? How does React treat `setVal(v => v + 1)` differently from `setVal(5)` when constructing the queue?
4. **Execution Timing:** At what exact point during the browser event loop does React stop accumulating state updates in the queue and trigger the actual component re-render?
5. **Strict Mode Double-Execution:** Why does React execute your state updater functions twice during development when wrapped in `<React.StrictMode>`? What specific class of bugs is this double-execution designed to expose?

## 2. Conceptual Questions

1. **The Waiter Mental Model vs. Immediate Execution:** Imagine an alternate version of React where batching does not exist, and every call to a state setter immediately triggers a synchronous DOM re-render before moving to the next line of code. Describe the computational impact and visual artifacts that would occur if an event handler updated four distinct state variables (e.g., `setLoading`, `setData`, `setError`, `setTimestamp`).
2. **Interleaved Queue Resolution:** Explain the precise algorithmic rules React uses to resolve a queue that contains a mix of direct value replacements and updater functions. Why does placing a direct value replacement (like `setScore(100)`) at the end of an event handler effectively render all preceding updates in that handler useless?
3. **Automatic Batching Across Async Boundaries:** In React 18 and later, batching is "automatic." How did legacy versions of React (pre-18) handle multiple state updates located inside asynchronous callbacks (such as `setTimeout`, `fetch` promises, or native DOM event listeners)? How does automatic batching change the behavior of these async boundaries?

## 3. Code Reading & Prediction

For each of the following snippets, trace the execution of the event handler and predict the exact value of the state variable on the **next render**. Provide the step-by-step mathematical queue React constructs to justify your answer.

### Exercise 3.1: The Interleaved Queue Trace

JavaScript

```jsx
import { useState } from 'react';

export default function Scoreboard(){
  const [score, setScore] = useState(10);

  function handleCombo(){
    setScore(score + 5);
    setScore(s => s * 2);
    setScore(50);
    setScore(s => s - 10);
    setScore(s => s / 2);
  }

  return <button onClick={handleCombo}>Execute Combo ({score})</button>;
}
```

- **Task:** When the user clicks the button for the first time (when `score` is `10`), what exact value will `score` display on the screen after the render completes? Build the sequential table representing React's internal queue processing.

### Exercise 3.2: Asynchronous Snapshots vs. Updaters

JavaScript

```jsx
import { useState } from 'react';

export default function AsyncCounter(){
  const [count, setCount] = useState(0);

  function handleDelayedIncrement(){
    setCount(count + 1);

    setTimeout(() => {
      setCount(count + 5);
      setCount(c => c * 2);
    }, 1000);
  }

  return <button onClick={handleDelayedIncrement}>Count: {count}</button>;
}
```

- **Task:** Assume the user clicks the button **once**.
    1. What is the value of `count` immediately after the synchronous part of the click handler completes (before 1 second elapses)?
    2. What is the final value of `count` after the 1-second timer expires and the async callback runs to completion? Explain how the closure over `count` affects line 9 versus line 10.

### Exercise 3.3: Strict Mode Mutation Trap

JavaScript

```jsx
import { useState } from 'react';

export default function TagList(){
  const [tags, setTags] = useState(['react', 'js']);

  function addTag(){
    setTags(currentTags => {
      currentTags.push('vite');
      return currentTags;
    });
  }

  return <button onClick={addTag}>Tags: {tags.join(', ')}</button>;
}
```

- **Task:** This component is running inside `<React.StrictMode>` in a development environment. What visual output appears on the screen after the user clicks the button once? Why does mutating the array inside the updater function break React's rendering guarantees?

## 4. Debugging Exercises

Identify all syntax, logic, and state-queue violations in the following snippets. Rewrite the code to function correctly and adhere to modern React best practices.

### Exercise 4.1: The Broken Cart Multiplier

A developer wrote an "Add 3 to Cart" button for an e-commerce site. When clicked, it should check inventory and increment the cart count by 3, but it currently only adds 1 item and occasionally displays negative stock.

JavaScript

```jsx
// Buggy Starter Code
import { useState } from 'react';

export default function ProductCard({ initialStock = 10 }){
  const [inCart, setInCart] = useState(0);
  const [stock, setStock] = useState(initialStock);

  function handleAddThree(){
    if (stock > 0) {
      setInCart(inCart + 1);
      setStock(stock - 1);
    }
    if (stock > 0) {
      setInCart(inCart + 1);
      setStock(stock - 1);
    }
    if (stock > 0) {
      setInCart(inCart + 1);
      setStock(stock - 1);
    }
  }

  return (
    <div>
      <p>Cart: {inCart} | Stock: {stock}</p>
      <button onClick={handleAddThree}>Add 3 to Cart</button>
    </div>
  );
}
```

- **Task:** Identify the two distinct flaws in how state snapshots and inventory conditionals are evaluated during rapid sequential updates. Refactor `handleAddThree` so that it safely evaluates stock levels and increments the cart using correct queue mechanics.

### Exercise 4.2: The Impure Object Updater

This component attempts to update a nested user profile by incrementing their login count and updating their last active timestamp. It fails to trigger re-renders reliably and behaves erratically in development.

JavaScript

```jsx
// Buggy Starter Code
import { useState } from 'react';

export default function UserStats(){
  const [user, setUser] = useState({
    name: "Ada Lovelace",
    stats: { logins: 5, level: 2 }
  });

  function recordLogin(){
    setUser(prevUser => {
      prevUser.stats.logins = prevUser.stats.logins + 1;
      if (prevUser.stats.logins > 10) {
        prevUser.stats.level = 3;
      }
      return prevUser;
    });
  }

  return (
    <button onClick={recordLogin}>
      Logins: {user.stats.logins} (Level {user.stats.level})
    </button>
  );
}
```

- **Task:** Identify the mutation bug inside the updater function. Rewrite `recordLogin` to perform a strictly pure, immutable state transformation across the nested object structure.

## 5. Implementation Exercises

Write the specified components and utilities from scratch. Focus on clean syntax, pure functions, and precise exploitation of React's state queue.

### Exercise 5.1: The Multi-Step Calculator Engine

Write a component named `MacroCalculator` that tracks a single numerical state called `value` (initialized to `1`).

- **Requirements:**
    - Render three buttons: `"Double & Add 10"`, `"Halve & Subtract 5"`, and `"Reset"`.
    - The `"Double & Add 10"` button must use **two distinct updater functions** queued sequentially in the same click handler: one that doubles the current value, and immediately after, one that adds 10 to the result of the doubling.
    - The `"Halve & Subtract 5"` button must queue two updater functions: one that divides the value by 2, and one that subtracts 5 from the result.
    - Ensure no direct value replacements are used for mathematical operations.

### Exercise 5.2: Implementing React's Queue Reducer

To prove your mastery of internal state mechanics, write a pure JavaScript utility function called `resolveStateQueue` that simulates how React processes state updates during a render.

- **Requirements:**
    - The function must accept two arguments: `initialState` (any type) and `queue` (an array containing a mix of direct values and updater functions).
    - Iterate through the queue sequentially. If an item is a function, invoke it passing the current accumulated state as an argument. If an item is a direct value, replace the accumulated state with that value.
    - Return the final calculated state.
    - Your implementation must handle edge cases where an updater function returns `0`, `false`, or `''` (falsy but valid state values) without breaking.

## 6. Modification Exercises

### Exercise 6.1: Migrating Stale Loops to Updaters

The following component attempts to process an array of incoming transactions by looping through them and applying them to a bank balance. Because of state snapshot capture, only the final transaction in the array is actually applied.

JavaScript

```jsx
// Legacy Code
import { useState } from 'react';

const pendingTransactions = [
  { id: 1, amount: 150, type: 'deposit' },
  { id: 2, amount: 45, type: 'withdrawal' },
  { id: 3, amount: 300, type: 'deposit' },
  { id: 4, amount: 20, type: 'withdrawal' }
];

export default function BankAccount(){
  const [balance, setBalance] = useState(1000);
  const [historyCount, setHistoryCount] = useState(0);

  function processAllTransactions(){
    for (let tx of pendingTransactions) {
      if (tx.type === 'deposit') {
        setBalance(balance + tx.amount);
      } else {
        setBalance(balance - tx.amount);
      }
      setHistoryCount(historyCount + 1);
    }
  }

  return (
    <div>
      <h3>Balance: ${balance}</h3>
      <p>Transactions Processed: {historyCount}</p>
      <button onClick={processAllTransactions}>Process Batch</button>
    </div>
  );
}
```

- **Task:** Refactor the `processAllTransactions` function so that it correctly processes every transaction in the array in a single synchronous click event, updating both `balance` and `historyCount` accurately without removing the `for` loop structure.

### Exercise 6.2: Flattening Conditional Queue Chains

Here is a complex event handler that mixes synchronous checks, state setting, and conditional replacements. It produces buggy, hard-to-trace results.

JavaScript

```jsx
// Legacy Code
function handleLevelUp(){
  setXp(xp + 500);

  if (xp + 500 >= 1000) {
    setLevel(level + 1);
    setXp(0);
    setStats(s => ({ ...s, points: s.points + 5 }));
  }
}
```

- **Task:** The architectural flaw here is relying on the stale `xp` and `level` snapshot variables inside the `if` condition while simultaneously queueing updates. Refactor this logic by lifting the evaluation inside pure updater functions or deriving the next state cleanly before dispatching the queue, ensuring the component updates reliably regardless of how rapidly `handleLevelUp` is triggered.

## 7. Edge Case Questions

1. **The Undefined Return Trap:** What happens to a state variable if an updater function inadvertently omits the `return` keyword (e.g., `setCount(c => { c + 1; })`)? Describe the exact value stored in React's state queue and what renders on the screen.
2. **Same-Value Bailout Inside a Queue:** Assume a component has `const [status, setStatus] = useState('idle')`. In an event handler, you call `setStatus('loading')`, followed by `setStatus('idle')`.
    - How does React's reconciliation engine handle a state queue where the final computed value is strictly equal (`===`) to the initial snapshot value before the event occurred?
    - Does a re-render occur? Why or why not?

## 8. Real-World Challenge: The Turn-Based Battle Engine

You are building the combat calculation engine for a web-based, turn-based RPG. When a player selects "Execute Combo Attack," the game must calculate and apply a series of offensive and defensive moves in a single, transactional batch.

### Architectural Requirements:

1. **State Structure:** The parent component (`BattleArena`) must manage state for two entities: `player` and `enemy`. Each entity object contains: `hp` (number), `shield` (number), and `status` (`'normal' | 'defending' | 'powered_up'`).
2. **The Combo Queue:** Create an event handler called `executeCombo` that triggers when an action button is clicked. This handler must execute a 3-step combo using state updater queues:
    - **Step 1 (Buff):** If the player's status is `'normal'`, change their status to `'powered_up'` and add `15` to their `shield`.
    - **Step 2 (Strike):** Calculate damage against the enemy. Base damage is `30`. If the player is `'powered_up'`, damage increases by `20`. The damage must first deplete the enemy's `shield`. Any remaining damage reduces the enemy's `hp`. (Ensure `hp` and `shield` never drop below zero).
    - **Step 3 (Recoil/Reset):** The player takes `5` recoil damage directly to their `hp` (ignoring shield), and their status resets to `'normal'`.
3. **Execution Constraints:**
    - All three steps must be evaluated as a sequential series of updater functions triggered by a single click.
    - You cannot use asynchronous delays (`setTimeout`) between the steps—they must be batched into a single render pass so the UI immediately reflects the final aftermath of the combo.
    - Zero mutations are permitted. All state updates must return freshly allocated objects.

### Your Mission:

Write the complete, functional code for `BattleArena`. Focus strictly on designing clean, pure updater functions that accurately transform complex object state across a sequential execution queue without losing data or relying on stale renders.