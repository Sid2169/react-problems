

### Phase 1: Recall & Foundational Knowledge (Low Cognitive Demand)

**1. The Naming Convention**

React enforces a strict naming convention for components and Hooks. What is the specific prefix required for custom Hooks, and what two practical benefits does this prefix provide to both the developer and the linter?

**2. State vs. Stateful Logic**

When you extract a `useState` call into a custom Hook and then call that Hook in three different components, how many independent state variables are created? Explain the difference between sharing *state* and sharing *stateful logic*.

### Phase 2: Conceptual Reasoning (Medium Cognitive Demand)

**3. The "Pure Function" Boundary**

Imagine you have a utility function that calculates the power-to-weight ratio for a dataset of motorcycles (e.g., Royal Enfield 650cc models). The function takes an array of objects and returns a sorted array. It does not use `useState`, `useEffect`, or any other built-in React Hook.

Should you name this function `usePowerToWeightRatio` or `calculatePowerToWeightRatio`? Justify your answer based on React's rendering rules and conditional logic.

**4. Reactivity Inside Custom Hooks**

Custom Hooks re-render alongside the component that calls them. If a component passes a dynamic prop (like a `searchQuery`) into a custom Hook, how does the custom Hook "know" to re-synchronize or re-fetch data? What React mechanism must be utilized inside the Hook to handle this incoming change?

### Phase 3: Code Reading & Prediction (Medium Cognitive Demand)

**5. Tracing Independent State**

Read the following implementation of a custom Hook used for tracking lifting metrics.

JavaScript

```jsx
function useRIRTracker(initialRIR){
  const [rir, setRir] = useState(initialRIR);

  function decrement(){
    setRir(prev => Math.max(0, prev - 1));
  }

  return [rir, decrement];
}

export default function WorkoutLogger(){
  const [squatRIR, dropSquatRIR] = useRIRTracker(3);
  const [benchRIR, dropBenchRIR] = useRIRTracker(2);

  return (
    <div>
      <button onClick={dropSquatRIR}>Squat RIR: {squatRIR}</button>
      <button onClick={dropBenchRIR}>Bench RIR: {benchRIR}</button>
    </div>
  );
}
```

**Task:** Predict exactly what happens to the UI and the underlying state if the user clicks the "Squat RIR" button twice. Does the `benchRIR` state change? Why or why not?

### Phase 4: Debugging (Medium-Hard Cognitive Demand)

**6. The Conditional Hook Trap**

The following custom Hook is designed to fetch technical specifications for a motorcycle model, but it contains a critical violation of React's rules. Identify the intentional mistake, explain why React will throw an error, and describe how to fix it.

JavaScript

```jsx
import { useState, useEffect } from 'react';

export function useMotorcycleSpecs(modelName){
  if (!modelName) {
    return null;
  }

  const [specs, setSpecs] = useState(null);

  useEffect(() => {
    fetch(`/api/specs/${modelName}`)
      .then(res => res.json())
      .then(data => setSpecs(data));
  }, [modelName]);

  return specs;
}
```

### Phase 5: Implementation (Hard Cognitive Demand)

**7. Persistent Browser Memory**

You are building a frontend-only Todo List and want the data to survive page refreshes. Write a custom Hook from scratch called `useLocalStorage` that manages this.

**Requirements:**

- It should accept a `key` (string) and an `initialValue`.
- It should return an array containing the current state and a setter function, exactly like `useState`.
- Upon initialization, it should check `localStorage` for the key. If data exists, use it; otherwise, use `initialValue`.
- Whenever the state updates, it must seamlessly write the new value to `localStorage`.

*Starter Code:*

JavaScript

```jsx
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue){
  // Your implementation here
}
```

### Phase 6: Modification & Adaptation (Hard Cognitive Demand)

**8. Extending the Network Tracker**

Take the `useOnlineStatus` hook provided in the lesson. Your task is to modify it so that instead of just returning a boolean, it returns an object containing both the current status and a timestamp of the *last time* the user disconnected.

**Requirements:**

- Return signature: `{ isOnline: boolean, lastOfflineAt: Date | null }`
- When the app mounts, `lastOfflineAt` should be `null`.
- Every time the `offline` event fires, update the timestamp.

*Starter Code:*

JavaScript

```jsx
import { useState, useEffect } from 'react';

export function useOnlineStatus(){
  const [isOnline, setIsOnline] = useState(true);
  // Add new state here

  useEffect(() => {
    function handleOnline(){ setIsOnline(true); }
    function handleOffline(){
      setIsOnline(false);
      // Update new state here
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Modify return statement
  return isOnline;
}
```

### Phase 7: Edge Cases & Boundary Conditions (Very Hard Cognitive Demand)

**9. Stale Closures and Event Handlers**

When passing an event handler (like `onReceiveMessage`) into a custom Hook, adding it to the `useEffect` dependency array can cause the Effect to re-run excessively if the parent component recreates the function on every render.

Explain how React's `useEffectEvent` solves this specific edge case. What would happen in a highly active chat room if `useEffectEvent` was *not* used, and the Effect had to re-connect to the server every time a parent state changed?

### Phase 8: Real-World Challenge (Mastery)

**10. The Live PDF Preview Engine**

You are building a web-based resume builder. You need a custom Hook that takes the user's raw resume data (an object) and simulates passing it to a PDF generation engine. Because the user is typing rapidly, you cannot generate a new PDF on every single keystroke.

Create a custom Hook called `usePDFPreview` that integrates debouncing and loading states.

**Requirements:**

1. **Inputs:** Accepts `resumeData` (object) and a `delay` (number, in milliseconds).
2. **Debounce Logic:** The Hook should wait for the user to stop typing for the duration of the `delay` before attempting to "generate" the PDF.
3. **Loading State:** While waiting for the debounce, or while generating, an `isGenerating` boolean should be `true`.
4. **Simulation:** Use a `setTimeout` inside an Effect to simulate a 1-second network call that generates a mock PDF URL string (e.g., `"blob:http://localhost:3000/mock-pdf-123"`).
5. **Outputs:** Return an object: `{ pdfUrl: string | null, isGenerating: boolean }`.

*Starter Code:*

JavaScript

```jsx
import { useState, useEffect } from 'react';

export function usePDFPreview(resumeData, delay){
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Implement debouncing and mock PDF generation logic here

  return { pdfUrl, isGenerating };
}
```

### Solutions

```
1. prefix - use, benefits - a. linter catches if a custom hook is not being declared with use prefix , b. if a function is planned to be a custom hook in future then use prefix helps linter to prevent usage of function in conditionals and loops sparing large refactoring in future

2. Three independent states are created. The difference between state and stateful logic is that each components hook relies on a different state even through the logic is shared .

3. It should be named calculatePowerToWeightRatio because if there is no intention of making this function into a custom hook in future then better not put 'use' prefix as would prevent contitional use of the function.

4. Because a hook call is part of the component body and when the component re renders due to change in some reactive value the hook call is re run as well hence it gets updated too.

5. the squalRIR drops to 1 and UI updates to sychronize the change

6. this function when called becomes a hook or not based on the value of the modelName, to avoid this always declare useState hook at the top of a function.
```