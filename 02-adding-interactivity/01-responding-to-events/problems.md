# Responding to Events

> **Reference:** [React Docs](https://react.dev/learn/responding-to-events)

## 1. Recall Questions

1. How do you pass an event handler function to a JSX element?
2. What is the difference between passing a function `onClick={handleClick}` versus calling it `onClick={handleClick()}`?
3. How do event handler functions access event properties like `e.target`?
4. What method stops an event from bubbling up to parent handlers?
5. What method prevents the browser's default behavior (e.g. form submission refresh)?

## 2. Conceptual Questions

1. Explain event propagation (bubbling) in React and how child handlers interact with parent handlers.

## 3. Code Reading & Prediction

### Exercise 3.1: The Invocation Trap

```jsx
export default function AlertButton() {
  function handleClick() {
    alert('Button clicked!');
  }
  return <button onClick={handleClick()}>Click Me</button>;
}
```

- **Task:** Predict what happens when this component renders. Does the alert trigger on render or on click?

## 4. Debugging Exercises

### Exercise 4.1: Form Submit Page Refresh

```jsx
// Buggy Code
export function SignupForm() {
  function handleSubmit(e) {
    alert('Submitted!');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

- **Task:** Fix `handleSubmit` so the page does not reload upon form submission.

## 5. Implementation Exercises

### Exercise 5.1: The Custom Play Button

Write a component called `PlayButton`.

- **Requirements:**
  - Accept a prop `movieName`.
  - On click, trigger an alert reading `"Playing " + movieName`.

## 6. Modification Exercises

### Exercise 6.1: Stopping Event Propagation

Refactor nested clickable divs so clicking the inner button does not trigger the container's alert.

```jsx
export function Toolbar() {
  return (
    <div onClick={() => alert('Toolbar clicked!')} style={{ padding: '20px', background: '#e2e8f0' }}>
      <button onClick={(e) => { e.stopPropagation(); alert('Button clicked!'); }}>
        Click Inside
      </button>
    </div>
  );
}
```

## 7. Edge Case Questions

1. Do event handlers run during rendering or in response to user actions?

## 8. Real-World Challenge: Interactive Toolbar Component

Build an interactive `Toolbar` component with custom button handlers.

```jsx
function Button({ onClick, children }) {
  return <button onClick={onClick} style={{ margin: '4px', padding: '8px 16px' }}>{children}</button>;
}

export default function Toolbar() {
  return (
    <div>
      <Button onClick={() => alert('Downloading...')}>Download</Button>
      <Button onClick={() => alert('Sharing...')}>Share</Button>
    </div>
  );
}
```
