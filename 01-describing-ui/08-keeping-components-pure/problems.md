

## 1. Recall Questions

1. **The Two Pillars of Purity:** In functional programming and computer science, what are the two core characteristics that define a pure function?

#### Answer:

1. No side effects, meaning no mutation of variables other than those local to the function
2. Same Inputs always produce same output
1. **Local vs. Global Mutation:** What is "local mutation," and why is it permissible inside a React component's render phase when mutating preexisting variables is strictly forbidden?

#### Answer

Local mutation is allowed as it does not create any side effects and any local variable is reset when the function is recalled.

1. **The Proper Home for Side Effects:** In a React application, where should side effects (like network requests, DOM manipulation, or triggering animations) primarily be executed? If no user action triggers the effect, what is the approved React escape hatch?

1. **Strict Mode Mechanics:** How does `<React.StrictMode>` actively help developers uncover impure components during development? Why does this mechanism not affect end users in production?

#### Answer

1. **Architectural Benefits:** List three major React capabilities or performance optimizations that rely directly on the assumption that components act as pure formulas.

## 2. Conceptual Questions

1. **The Sequential Rendering Fallacy:** Imagine a hypothetical version of React that guarantees components will always render strictly from top to bottom, never skipping a render, and never aborting a render halfway through. Would writing pure components still matter in this environment? Explain why or why not.
2. **The Prop Mutation Trap:** In JavaScript, objects and arrays passed as function arguments are passed by reference. If you receive a `user` object as a prop and modify `user.isOnline = true` directly inside your component, it might seem like a "local" change if no other component uses that prop. Why is this still a fatal violation of React's purity rules? What must you do instead?
3. **Array Mutation vs. Copying:** Categorize the following standard JavaScript array methods into two groups: **Mutating (Impure)** and **Non-Mutating (Pure)**. Explain how using a method from the wrong category during rendering causes bugs in React:
    
    `push`, `slice`, `map`, `sort`, `filter`, `reverse`, `concat`, `splice`.
    

## 3. Code Reading & Prediction

For each of the following snippets, predict the exact rendered output. Assume `<React.StrictMode>` is **enabled**. Explain the physiological mechanism behind why the output appears as it does.

### Exercise 3.1: The External Counter

JavaScript

```
let renderCount = 0;

export default function StatusBadge({ status }){
  renderCount++;
  return (
    <span className="badge">
      {status} (Render #{renderCount})
    </span>
  );
}
```

- **Task:** What will be displayed on the screen when this component is rendered for the very first time with `status="Active"`? What will happen if the parent re-renders once?

### Exercise 3.2: The Sorting Glitch

JavaScript

```
export default function Leaderboard({ scores }){
  const sortedScores = scores.sort((a, b) => b - a);

  return (
    <ul>
      {sortedScores.map((score, index) => (
        <li key={index}>#{index + 1}: {score} pts</li>
      ))}
    </ul>
  );
}
```

- **Task:** A parent component passes `scores={[10, 50, 30]}` to `Leaderboard` and also passes the exact same `scores` array to an analytical chart component rendered right below it. What bug will occur in the application, and which line of code is responsible?

### Exercise 3.3: The Local Array Build

JavaScript

```
export default function TagList({ tags }){
  const displayTags = [];

  for (let i = 0; i < tags.length; i++) {
    displayTags.push(<span key={i} className="tag">{tags[i]}</span>);
  }

  if (displayTags.length === 0) {
    displayTags.push(<span key="empty">No tags available</span>);
  }

  return <div className="tag-container">{displayTags}</div>;
}
```

- **Task:** Does calling `.push()` on `displayTags` violate React purity rules here? Predict the exact behavior of this component when passed `tags={["React", "JS"]}` vs `tags={[]}` under Strict Mode.

## 4. Debugging Exercises

Identify the purity violations in the following components and rewrite them so they are 100% pure formulas.

### Exercise 4.1: Direct DOM Manipulation

The developer wants to update the document's background color based on an alert level prop.

JavaScript

```
// Buggy Starter Code
export default function AlertBox({ level, message }){
  if (level === 'critical') {
    document.body.style.backgroundColor = 'red';
  } else {
    document.body.style.backgroundColor = 'white';
  }

  return (
    <div className={`alert alert-${level}`}>
      <strong>{level.toUpperCase()}:</strong> {message}
    </div>
  );
}
```

- **Task:** Identify why this is an impure side effect and rewrite the code to handle the visual change without breaking render purity.

### Exercise 4.2: In-Place Data Transformations

This component receives an array of user objects and needs to display active users sorted alphabetically by name.

JavaScript

```
// Buggy Starter Code
export default function ActiveUserList({ users }){
  // Remove inactive users
  for (let i = users.length - 1; i >= 0; i--) {
    if (!users[i].isActive) {
      users.splice(i, 1);
    }
  }

  // Sort alphabetically
  users.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

- **Task:** Identify every mutation occurring in this render phase. Rewrite the component using pure JavaScript array operations so the original `users` prop is left untouched.

## 5. Implementation Exercises

Write the specified React components from scratch. Ensure they strictly follow the rules of purity.

### Exercise 5.1: Pure Pagination Slice

Write a component called `PaginatedGrid` that takes three props: `items` (an array of data objects), `currentPage` (a 1-based number), and `pageSize` (number of items per page).

- **Requirements:**
    - Calculate the exact subset of items to display for the current page.
    - You must not mutate the `items` prop.
    - If the `currentPage` exceeds the available data, safely render a message saying "Page out of bounds."
    - Keep the logic entirely within the render calculation.

### Exercise 5.2: Local Mutation Aggregator

Write a component called `InvoiceSummary` that accepts an `items` prop (array of objects containing `name`, `price`, and `taxRate`).

- **Requirements:**
    - Use **local mutation** (e.g., initializing local variables to `0` and accumulating values via a `for` loop inside the render body) to calculate the `subtotal`, `totalTax`, and `grandTotal`.
    - Return a clean JSX structure displaying the three calculated values.
    - Do not use `useMemo`, `useEffect`, or `useState`—express the accumulation purely as a local render calculation.

## 6. Modification Exercises

### Exercise 6.1: Refactoring Impure Cache Logic

A junior developer attempted to optimize a heavy calculation by creating an external cache variable. Because of how React renders, this cache causes UI stale-state bugs and violates purity.

JavaScript

```
// Legacy Impure Code
let lastInput = null;
let cachedResult = null;

export default function HeavyReport({ data, filterQuery }){
  if (data !== lastInput) {
    // Simulate expensive processing
    cachedResult = data.filter(item => item.type === filterQuery);
    lastInput = data;
  }

  return (
    <div className="report">
      <p>Showing {cachedResult.length} records</p>
      {/* List rendering omitted */}
    </div>
  );
}
```

- **Task:** Refactor this component to remove all external variables. Make it a pure formula while retaining the calculation logic inside the component scope. *(Note: Do not worry about caching/memoization hooks for this exercise—focus strictly on restoring architectural purity).*

### Exercise 6.2: Removing Parent State Mutations

This child component attempts to notify a parent of a selection by directly modifying a property on a shared object passed down via props.

JavaScript

```
// Legacy Impure Code
export default function OptionCard({ option, isSelected }){
  const handleSelect = () => {
    // VIOLATION: Mutating a prop object directly
    option.selected = true;
    option.lastModified = Date.now();
  };

  return (
    <div className={`card ${isSelected ? 'selected' : ''}`} onClick={handleSelect}>
      <h3>{option.title}</h3>
      <p>{option.description}</p>
    </div>
  );
}
```

- **Task:** Modify the component's API and implementation so that it communicates user intent upward without ever mutating the `option` object directly.

## 7. Edge Case Questions

1. **The Impure Calculation Traps (`Math.random` and `Date.now`):** A developer writes `<span className="id">ID: {Math.random()}</span>` directly inside their JSX to generate a unique key for a rendered UI element.
    - What fundamental rule of purity does `Math.random()` or `new Date()` violate when called directly during rendering?
    - Describe the visual or structural glitch this will cause when Strict Mode is active, or when concurrent rendering features pause and resume the component.
    - How should unique IDs or timestamps be handled if a component requires them?
2. **The Default Prop Reference Trap:** Consider the following component signature:JavaScript
    
    ```
    export default function Feed({ posts = [] }){
      posts.push({ id: 'promo', title: 'Sponsored Post' });
      // ...renders posts
    }
    ```
    
    - If the parent renders `<Feed/>` without passing a `posts` prop, JavaScript assigns the default empty array `[]`. Why does mutating this default array via `.push()` still violate React's purity rules, even though it appears to be an array created inline?
    - How should you rewrite this code to safely append the promotional post without mutating any references?

## 8. Real-World Challenge: The E-Commerce Cart Audit

You have been hired to fix a critical bug in an e-commerce checkout flow. Customers report that item quantities change randomly, promotional discounts double-apply when switching browser tabs, and cart totals occasionally display NaN.

Below is the production code for the checkout summary. It is riddled with subtle and severe purity violations.

JavaScript

```
// THE BROKEN PRODUCTION CODE
let totalCartViews = 0;
let appliedDiscount = 0;

export default function CheckoutSummary({ cartItems, user, promoCode }){
  // Track analytics
  totalCartViews++;

  // Apply promotional codes directly to items
  if (promoCode === 'HALF_OFF') {
    appliedDiscount = 0.5;
    for (let item of cartItems) {
      item.price = item.price * appliedDiscount;
    }
  }

  // Sort items by price descending for display
  cartItems.sort((a, b) => b.price - a.price);

  // Flag low stock items directly on the object
  cartItems.forEach(item => {
    if (item.stock < 3) {
      item.lowStockWarning = true;
    }
  });

  // Calculate total
  let finalTotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    finalTotal += cartItems[i].price * cartItems[i].quantity;
  }

  return (
    <div className="checkout-box">
      <h2>Summary (Viewed {totalCartViews} times)</h2>
      <p>User: {user.name} | Discount: {appliedDiscount * 100}%</p>

      <ul>
        {cartItems.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price.toFixed(2)} x {item.quantity}
            {item.lowStockWarning && <span className="warn"> (Only {item.stock} left!)</span>}
          </li>
        ))}
      </ul>

      <h3>Total: ${finalTotal.toFixed(2)}</h3>
    </div>
  );
}
```

### Your Mission:

1. **The Audit:** Write a bulleted list identifying every single purity violation in the code above. For each violation, explain *why* it is dangerous and what specific unpredictable bug it causes in React.
2. **The Architecture Plan:** Explain how you will restructure the data flow so that the analytics, promotional price calculations, sorting, and low-stock flagging happen safely without mutating props or relying on external state.
3. **The Rewrite:** Provide the complete, refactored `CheckoutSummary` component code. Your solution must be a **100% pure formula** that renders identical JSX given identical props, leaves all incoming data structures entirely untouched, and generates zero side effects during the render phase.