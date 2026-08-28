# Render and Commit

> **Reference:** [React Docs](https://react.dev/learn/render-and-commit)

## 1. Recall Questions

1. What are the three steps in React's component render process (Triggering, Rendering, Committing)?
2. What triggers an initial render versus a re-render?
3. What does "rendering" mean in React (calling your component functions)?
4. Does React modify the DOM during the rendering phase or the committing phase?
5. What happens during browser paint after React commits DOM updates?

## 2. Conceptual Questions

1. Explain the analogy of a restaurant (Triggering order -> Chef preparing dish -> Delivering to table).

## 3. Code Reading & Prediction

### Exercise 3.1: Execution Phase Trace

```jsx
export default function RenderLogger() {
  console.log("Rendering Component Body");
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

- **Task:** How many times is `"Rendering Component Body"` printed when the user clicks the button twice?

## 4. Debugging Exercises

### Exercise 4.1: Side Effects During Render

```jsx
// Buggy Code
let renderCount = 0;

export function BadLogger() {
  renderCount++; // Side effect in render phase!

  return <div>Render count: {renderCount}</div>;
}
```

- **Task:** Explain why mutating variables outside during render phase causes bugs in React Strict Mode.

## 5. Implementation Exercises

### Exercise 5.1: Pure Render Component

Write a component called `ClockTime` that accepts `time` prop and renders pure JSX without side effects.

## 6. Modification Exercises

### Exercise 6.1: Moving Effects out of Render

Refactor code to avoid side-effects during render phase.

## 7. Edge Case Questions

1. What does React do if a re-render produces the exact same DOM node structure as before?

## 8. Real-World Challenge: Render Process Visualizer

Build a `RenderVisualizer` component that displays render state updates cleanly.

```jsx
export default function RenderVisualizer() {
  const [step, setStep] = useState('Idle');

  return (
    <div>
      <h3>Current Step: {step}</h3>
      <button onClick={() => setStep('Triggered')}>Trigger</button>
      <button onClick={() => setStep('Rendered')}>Render</button>
      <button onClick={() => setStep('Committed')}>Commit</button>
    </div>
  );
}
```
