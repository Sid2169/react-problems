# State: A Component's Memory

> **Reference:** [React Docs](https://react.dev/learn/state-a-components-memory)

## 1. Recall Questions

1. Why don't local variables persist between component re-renders?
2. What React Hook is used to add state to a functional component?
3. What two elements does the `useState` hook return in an array?
4. Can hooks like `useState` be called inside loops, conditions, or nested functions? Why or why not?
5. How does state isolation work when rendering multiple instances of the same component?

## 2. Conceptual Questions

1. Explain why state is local to a specific component instance on the screen.

## 3. Code Reading & Prediction

### Exercise 3.1: The Local Variable Trap

```jsx
export default function Counter() {
  let count = 0;

  function handleClick() {
    count = count + 1;
    console.log("Count is now:", count);
  }

  return <button onClick={handleClick}>Clicked {count} times</button>;
}
```

- **Task:** Explain why clicking the button updates `console.log` but does not update the text on the screen.

## 4. Debugging Exercises

### Exercise 4.1: Direct State Mutation

```jsx
// Buggy Code
export function LightSwitch() {
  let [isOn, setIsOn] = useState(false);

  function toggle() {
    isOn = !isOn;
  }

  return <button onClick={toggle}>{isOn ? 'ON' : 'OFF'}</button>;
}
```

- **Task:** Fix `toggle` to call the setter function `setIsOn(!isOn)` instead of reassigning `isOn`.

## 5. Implementation Exercises

### Exercise 5.1: The Counter Component

Write a component called `SimpleCounter`.

- **Requirements:**
  - Initialize state `count` at `0`.
  - Provide "Increment", "Decrement", and "Reset" buttons.

## 6. Modification Exercises

### Exercise 6.1: Adding Toggle State

```jsx
export function ExpandableText() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Show Less' : 'Show More'}
      </button>
      {isExpanded && <p>Here is the detailed content...</p>}
    </div>
  );
}
```

## 7. Edge Case Questions

1. What happens if you call `useState` conditionally?

## 8. Real-World Challenge: Interactive Gallery Component

Build an interactive image gallery component with "Next" and "Previous" buttons and expand details toggle.

```jsx
export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const images = [
    { name: 'Moai', description: 'Statues on Easter Island' },
    { name: 'Terracotta Army', description: 'Sculptures depicting the armies of Qin Shi Huang' }
  ];

  return (
    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
      <button onClick={() => setIndex((index + 1) % images.length)}>Next</button>
      <h2>{images[index].name}</h2>
      <button onClick={() => setShowMore(!showMore)}>{showMore ? 'Hide' : 'Show'} Details</button>
      {showMore && <p>{images[index].description}</p>}
    </div>
  );
}
```
