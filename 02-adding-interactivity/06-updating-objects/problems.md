# Updating Objects in State

> **Reference:** [React Docs](https://react.dev/learn/updating-objects-in-state)

## 1. Recall Questions

1. Should you mutate objects stored in React state directly? Why or why not?
2. What syntax do you use to copy properties from an existing object while updating specific fields?
3. How do you update a nested object stored in state without mutating it?
4. What is object mutation and why does React rely on shallow reference comparisons (`Object.is`)?
5. How can libraries like Immer simplify nested object updates?

## 2. Conceptual Questions

1. Explain why `person.name = 'Alex'` does not trigger a component re-render.

## 3. Code Reading & Prediction

### Exercise 3.1: The Mutation Trace

```jsx
export default function Form() {
  const [person, setPerson] = useState({ name: 'Barbara', age: 40 });

  function handleAge() {
    person.age = 41;
    setPerson(person);
  }

  return <button onClick={handleAge}>{person.name}: {person.age}</button>;
}
```

- **Task:** Explain why clicking the button fails to update the display on screen.

## 4. Debugging Exercises

### Exercise 4.1: Direct Object Mutation Fix

```jsx
// Buggy Code
export function PositionTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function moveRight() {
    position.x = position.x + 10;
    setPosition(position);
  }

  return <button onClick={moveRight}>X: {position.x}</button>;
}
```

- **Task:** Fix `moveRight` to use spread syntax: `setPosition({ ...position, x: position.x + 10 })`.

## 5. Implementation Exercises

### Exercise 5.1: Form State Update

Write a component `UserForm` holding a `user` object (`{ firstName, lastName, email }`) in state with input handlers updating state immutably.

## 6. Modification Exercises

### Exercise 6.1: Nested Object Update

Refactor nested object state update (`{ name, address: { city, zip } }`).

```jsx
export function AddressForm() {
  const [person, setPerson] = useState({
    name: 'Jane',
    address: { city: 'Deoghar', zip: '814112' }
  });

  function updateCity(newCity) {
    setPerson({
      ...person,
      address: {
        ...person.address,
        city: newCity
      }
    });
  }

  return <button onClick={() => updateCity('Ranchi')}>{person.address.city}</button>;
}
```

## 7. Edge Case Questions

1. Why must you create a new object reference when updating state in React?

## 8. Real-World Challenge: Interactive Profile Editor

Build a `ProfileEditor` component with nested object state for user preferences and profile info.

```jsx
export default function ProfileEditor() {
  const [user, setUser] = useState({
    name: 'Siddhartha',
    settings: { theme: 'dark', notifications: true }
  });

  return (
    <div style={{ padding: '20px', background: '#1e293b', color: '#fff', borderRadius: '8px' }}>
      <h2>Profile: {user.name}</h2>
      <p>Theme: {user.settings.theme}</p>
      <button onClick={() => setUser({
        ...user,
        settings: { ...user.settings, theme: user.settings.theme === 'dark' ? 'light' : 'dark' }
      })}>Toggle Theme</button>
    </div>
  );
}
```
