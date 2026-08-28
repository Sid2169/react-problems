# Passing Props to a Component

> **Reference:** [React Docs](https://react.dev/learn/passing-props-to-a-component)

## 1. Recall Questions

1. What are props in React, and how are they passed to child components?
2. How do you destructure props inside a component function signature?
3. How do you specify a default value for a prop?
4. What special prop is used to pass JSX content between an opening and closing component tag (`<Card><p>Hello</p></Card>`)?
5. True or False: A component can modify its own props directly.

## 2. Conceptual Questions

1. Explain the difference between state and props in React.
2. Why are props considered immutable in React's component architecture?

## 3. Code Reading & Prediction

### Exercise 3.1: The Prop Destructuring Trace

```jsx
function Avatar({ person, size = 100 }) {
  return (
    <img
      src={person.imageUrl}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  const user = { name: 'Lin Yutang', imageUrl: 'https://i.imgur.com/1bX5QH6s.jpg' };
  return <Avatar person={user} />;
}
```

- **Task:** What width and height dimensions will `Avatar` be rendered with? Why?

## 4. Debugging Exercises

### Exercise 4.1: Missing Curly Braces Destructuring

```jsx
// Buggy Code
function Greeting(name, title) {
  return <h1>Hello, {title} {name}!</h1>;
}

export default function App() {
  return <Greeting name="Alice" title="Dr." />;
}
```

- **Task:** Fix the signature of `Greeting` so `name` and `title` correctly extract props.

## 5. Implementation Exercises

### Exercise 5.1: The Custom Button

Write a component called `CustomButton`.

- **Requirements:**
  - Accept `text` and `color` props (with `color` defaulting to `'blue'`).
  - Return a `<button>` with inline background color set to the `color` prop and displaying `text`.

### Exercise 5.2: The Wrapper Card

Write a component called `CardWrapper`.

- **Requirements:**
  - Accept a `children` prop.
  - Wrap `children` inside a `<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>`.

## 6. Modification Exercises

### Exercise 6.1: Spreading Props Refactor

```jsx
// Legacy Code
function ProfileCard({ name, role, email, avatar }) {
  return (
    <div className="card">
      <Avatar name={name} role={role} email={email} avatar={avatar} />
    </div>
  );
}
```

- **Task:** Refactor `ProfileCard` to pass all props down using JSX spread syntax `{...props}`.

## 7. Edge Case Questions

1. What happens if you pass a boolean prop like `<Button isActive />` without specifying `= {true}`?

## 8. Real-World Challenge: Modular Product Card System

Build a `ProductCard` component that accepts `product` (object), `isFeatured` (boolean), and `children` (custom action buttons).

```jsx
function Badge({ text }) {
  return <span style={{ background: '#f59e0b', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>{text}</span>;
}

export default function ProductCard({ product, isFeatured = false, children }) {
  return (
    <article style={{ border: isFeatured ? '2px solid #6366f1' : '1px solid #e2e8f0', padding: '16px', borderRadius: '8px' }}>
      {isFeatured && <Badge text="Featured" />}
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <div>{children}</div>
    </article>
  );
}
```
