# JavaScript in JSX with Curly Braces

> **Reference:** [React Docs](https://react.dev/learn/javascript-in-jsx-with-curly-braces)

## 1. Recall Questions

1. What syntax allows you to embed JavaScript expressions inside JSX tags?
2. What are the two main places inside JSX where you can use curly braces?
3. Can you pass a JavaScript statement (like `if` or `for`) directly inside `{}` in JSX? Why or why not?
4. What does `style={{ color: 'red' }}` mean syntactically — why are there double curly braces?
5. Which JavaScript values (like booleans or `null`) are ignored by React when rendered inside JSX `{}`?

## 2. Conceptual Questions

1. Explain the difference between passing a string literal `src="avatar.jpg"` versus a JavaScript variable `src={avatarUrl}` in JSX.
2. Why is object syntax inside double curly braces `{{ margin: '10px' }}` commonly used for inline styling in React components?

## 3. Code Reading & Prediction

### Exercise 3.1: The Expression Trace

```jsx
export default function UserGreeting() {
  const firstName = "Alex";
  const lastName = "Rivera";
  const unreadCount = 4;

  return (
    <div>
      <h1>Welcome back, {firstName + " " + lastName}!</h1>
      <p>You have {unreadCount * 2} pending notifications.</p>
    </div>
  );
}
```

- **Task:** Predict what heading text and paragraph text render to the screen.

### Exercise 3.2: The Style Object Trace

```jsx
export default function StatusBadge() {
  const isOnline = true;
  const badgeStyle = {
    color: isOnline ? 'green' : 'red',
    fontWeight: 'bold'
  };

  return <span style={badgeStyle}>{isOnline ? 'Active' : 'Offline'}</span>;
}
```

- **Task:** Trace the style properties applied to the `span` and predict the rendered text.

## 4. Debugging Exercises

### Exercise 4.1: The Curly Braces Attribute Trap

```jsx
// Buggy Code
export function ProfileCard() {
  const avatarUrl = "https://i.imgur.com/7vQD0fPs.jpg";
  const altText = "Gregorio Y. Zara";

  return (
    <div className="card">
      <img src="avatarUrl" alt="altText" />
      <h3>{altText}</h3>
    </div>
  );
}
```

- **Task:** Fix the `img` tag so `src` and `alt` attributes correctly evaluate the variables instead of static strings.

### Exercise 4.2: Inline Object Syntax Error

```jsx
// Buggy Code
export function HighlightBox() {
  return (
    <div style={ backgroundColor: 'purple', padding: '16px' }>
      <h2>Featured Section</h2>
    </div>
  );
}
```

- **Task:** Identify why `style={ backgroundColor: 'purple' }` throws a syntax error and fix it.

## 5. Implementation Exercises

### Exercise 5.1: Dynamic User Avatar

Write a component called `UserAvatar`.

- **Requirements:**
  - Define `const imageSize = 90;` and `const user = { name: 'Hedy Lamarr', imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg' };`
  - Render an `<img>` tag where `src`, `alt`, `width`, and `height` all evaluate dynamic properties from `user` and `imageSize`.

### Exercise 5.2: Product Price Display

Write a component called `ProductPrice`.

- **Requirements:**
  - Define `const basePrice = 100;` and `const discount = 0.2;`
  - Render a paragraph stating: `"Final Price: $" + (basePrice * (1 - discount))` evaluated directly inside JSX.

## 6. Modification Exercises

### Exercise 6.1: Refactoring Static Text to Dynamic Expressions

```jsx
// Static Monolithic Code
export function DateDisplay() {
  return (
    <footer className="footer">
      <p>Copyright 2026 - All rights reserved.</p>
    </footer>
  );
}
```

- **Task:** Refactor the year so it dynamically evaluates `new Date().getFullYear()` inside curly braces.

## 7. Edge Case Questions

1. What happens if you try to render an object directly inside JSX, e.g. `const user = { name: 'Ali' }; return <div>{user}</div>;`?
2. How does React handle rendering `undefined` or `null` inside JSX `{}`?

## 8. Real-World Challenge: Dynamic User Dashboard Header

Build a `DashboardHeader` component that dynamically constructs user profile information using JavaScript expressions in JSX.

```jsx
export default function DashboardHeader() {
  const currentUser = {
    name: "Dr. Sarah Chen",
    role: "Lead Architect",
    avatar: "https://i.imgur.com/7vQD0fPs.jpg",
    theme: {
      backgroundColor: "#1e293b",
      textColor: "#38bdf8"
    }
  };

  return (
    <header style={{ background: currentUser.theme.backgroundColor, padding: '20px', borderRadius: '8px' }}>
      <img src={currentUser.avatar} alt={currentUser.name} style={{ width: 60, height: 60, borderRadius: '50%' }} />
      <h1 style={{ color: currentUser.theme.textColor }}>{currentUser.name}</h1>
      <p style={{ color: '#94a3b8' }}>{currentUser.role.toUpperCase()}</p>
    </header>
  );
}
```
