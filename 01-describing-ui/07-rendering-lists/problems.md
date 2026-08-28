# Rendering Lists

> **Reference:** [React Docs](https://react.dev/learn/rendering-lists)

## 1. Recall Questions

1. What JavaScript array method is primarily used in React to transform an array of data into an array of JSX elements?
2. What special string attribute must be provided to each item when rendering a list in React?
3. Why are array index keys (`key={index}`) discouraged when list items can be reordered, inserted, or deleted?
4. What array method would you use to render only a subset of items (e.g. filtering active users)?
5. Where must the `key` attribute be placed when returning list elements from a `.map()` callback?

## 2. Conceptual Questions

1. Explain how React uses `key` attributes during re-renders to determine which DOM nodes to reuse or recreate.
2. Why is using `Math.random()` as a `key` considered a critical anti-pattern in React?

## 3. Code Reading & Prediction

### Exercise 3.1: The List Mapping Trace

```jsx
export default function GroceryList() {
  const items = ['Apples', 'Bananas', 'Cherries'];
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.toUpperCase()}</li>
      ))}
    </ul>
  );
}
```

- **Task:** Write out the exact HTML list items rendered by this component.

## 4. Debugging Exercises

### Exercise 4.1: Missing Key Warning

```jsx
// Buggy Code
export function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

- **Task:** Add proper unique `key` attributes using `user.id`.

## 5. Implementation Exercises

### Exercise 5.1: The Filtered People List

Write a component called `ChemistList`.

- **Requirements:**
  - Define an array of people objects with `id`, `name`, and `profession`.
  - Filter the array to get only chemists (`profession === 'chemist'`).
  - Render an `<ul>` list mapping each chemist to an `<li>` with their `name`.

## 6. Modification Exercises

### Exercise 6.1: Extracting List Items into Components

```jsx
// Monolithic List
export function RecipeList({ recipes }) {
  return (
    <div>
      {recipes.map(recipe => (
        <div key={recipe.id} className="recipe-card">
          <h2>{recipe.name}</h2>
          <p>{recipe.ingredients.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
```

- **Task:** Extract the inner card into a `RecipeCard` component and pass `recipe` as a prop.

## 7. Edge Case Questions

1. What happens if two items in a mapped list share the exact same `key` value?

## 8. Real-World Challenge: Interactive Shopping Cart List

Build a `ShoppingCart` component that renders a list of items with price calculations.

```jsx
export default function ShoppingCart() {
  const cartItems = [
    { id: 'p1', name: 'Wireless Mouse', price: 29.99, quantity: 2 },
    { id: 'p2', name: 'Mechanical Keyboard', price: 89.99, quantity: 1 },
    { id: 'p3', name: 'USB-C Cable', price: 12.99, quantity: 3 }
  ];

  return (
    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
      <h2>Shopping Cart</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cartItems.map(item => (
          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
            <span>{item.name} (x{item.quantity})</span>
            <strong>${(item.price * item.quantity).toFixed(2)}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
```
