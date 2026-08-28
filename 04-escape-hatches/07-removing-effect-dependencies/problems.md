### Level 1: Recall Questions

**Objective:** Test foundational knowledge of syntax, linting rules, and React Effect mechanics.

1. What is the fundamental meaning of an empty dependency array `[]` in a `useEffect` hook?
2. Why does the React documentation strongly advise against using `// eslint-disable-next-line react-hooks/exhaustive-deps`?
3. True or False: You can selectively choose which reactive values to omit from the dependency array if you don't want the Effect to re-run when those specific values change.
4. According to the lesson, what is the correct workflow for changing an Effect's dependencies? (Hint: Do you change the array first, or the code first?)

### Level 2: Conceptual Questions

**Objective:** Explain and reason about Effect behavior and React's synchronization model.

1. Explain the difference between an Effect and an Event Handler. Why is it an anti-pattern to place form submission logic (like a POST request triggered by a button click) inside a `useEffect` that listens to a `submitted` state?
2. If a component reads both a `userId` (to fetch user data) and a `theme` (to style a toast notification) inside a data-fetching Effect, what bug is introduced when the user toggles the application from light mode to dark mode? How does `useEffectEvent` solve this?
3. Why is it problematic to have a single `useEffect` block synchronize two unrelated processes (e.g., fetching a list of Royal Enfield motorcycle models based on a `brand` prop, and fetching specific engine specs based on a `selectedModel` state)?

### Level 3: Code Reading & Prediction

**Objective:** Trace execution flow and predict output or bugs in existing code.

1. **The Stale Closure:** Predict what happens when this timer mounts. What will the `currentRIR` (Reps In Reserve) value log to the console after 3 seconds?

JavaScript

```jsx
function RestTimer(){
  const [currentRIR, setCurrentRIR] = useState(3);

  useEffect(() => {
    const timerId = setInterval(() => {
      console.log("Current RIR:", currentRIR);
      setCurrentRIR(currentRIR - 1);
    }, 1000);
    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Timer running...</div>;
}
```

### Level 4: Debugging Exercises

**Objective:** Identify and fix intentional mistakes involving reactive values and infinite loops.

1. **The Object Loop:** The following component causes an infinite loop of API requests and crashes the browser. Identify the bug and rewrite the component so it fetches the data safely without suppressing the linter.

JavaScript

```jsx
function MotorcycleSpecViewer({ modelId }){
  const [specs, setSpecs] = useState(null);

  const fetchOptions = {
    method: 'GET',
    url: `https://api.motorcycles.com/specs/${modelId}`,
  };

  useEffect(() => {
    let ignore = false;
    fetch(fetchOptions.url)
      .then(res => res.json())
      .then(data => {
        if (!ignore) setSpecs(data);
      });
    return () => { ignore = true; };
  }, [fetchOptions]);

  return <div>{specs ? specs.engine : 'Loading...'}</div>;
}
```

### Level 5: Implementation Exercises

**Objective:** Write code from scratch applying dependency management rules.

1. **The Updater Function:** Write a `HypertrophyLog` component. It should maintain an array of `loggedSets` in state. It receives a `socket` connection prop.
    - When a `new-set` event fires from the socket, append the new set to the state.
    - **Constraint:** The socket must *not* disconnect and reconnect every time a new set is added. You must not include `loggedSets` in the dependency array.

### Level 6: Modification Exercises

**Objective:** Refactor existing code to adhere to best practices for separating reactive and non-reactive logic.

1. **Extracting Non-Reactive Logic:** The component below re-generates a PDF preview every time the `theme` changes, which is computationally expensive. Refactor the code using `useEffectEvent` so that the `generatePdf` function always has the latest `theme` for the notification, but changing the `theme` does not trigger the PDF generation effect.

JavaScript

```jsx
import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { generatePdf, showNotification } from './resumeUtils';

function ResumePreview({ resumeData }){
  const theme = useContext(ThemeContext);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const url = generatePdf(resumeData);
    setPdfUrl(url);
    showNotification('PDF Preview Updated', theme);
  }, [resumeData, theme]);

  return <iframe src={pdfUrl} />;
}
```

### Level 7: Edge Case Questions

**Objective:** Test boundary conditions and uncommon rendering scenarios.

1. A parent component renders a child component and passes an inline arrow function as a prop: `<Child onUpdate="{()"> console.log('Updated!')} />`. Inside the `Child` component, `onUpdate` is used inside a `useEffect` and is therefore added to the dependency array.
    - What happens to the `Child`'s effect every time the parent component re-renders?
    - Name two distinct React features/hooks (one from the parent's side, one from the child's side) that could prevent this unnecessary re-synchronization.

### Level 8: Real-World Challenge

**Objective:** Combine multiple concepts into a complex, practical application architecture.

1. **The Live 1RM Dashboard:** You are building a dashboard that displays live 1-Rep Max calculations coming from a Bluetooth-connected barbell velocity tracker.
    - You receive a `barbellId` prop.
    - You have a state variable `maxes` holding an array of calculated lifts.
    - You have a `unit` prop (either "kg" or "lbs").
    - **Task:** Create the `useEffect` logic that connects to `TrackerAPI.subscribe(barbellId)`.
    - When the API emits a `lift-completed` event, add the new lift to the `maxes` state.
    - After adding the lift, trigger a local function `playSuccessChime(unit)` which plays a sound based on the current unit setting.
    - **Constraints:**
        - The component must strictly follow the linting rules (no `eslint-disable`).
        - Receiving a new lift must *not* cause the tracker to unsubscribe/resubscribe.
        - Toggling the `unit` (e.g., from "kg" to "lbs") must *not* cause the tracker to unsubscribe/resubscribe.
        - Provide only the JavaScript logic for the hooks and state declarations; omit the JSX return.