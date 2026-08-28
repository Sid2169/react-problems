# Your UI as a Tree

> **Reference:** [React Docs](https://react.dev/learn/your-ui-as-a-tree)

## 1. Recall Questions

1. What are the two types of trees React uses to understand application structure (Render Tree and Dependency Tree)?
2. What nodes form the top (root) of a React render tree?
3. What is a "leaf node" in a render tree?
4. How does the render tree change when a component conditionally renders different children?
5. What is module dependency tree in React applications?

## 2. Conceptual Questions

1. Explain why understanding the render tree helps in optimizing performance and state placement.
2. How do top-level component re-renders impact child nodes in the render tree?

## 3. Code Reading & Prediction

### Exercise 3.1: Identifying Render Tree Hierarchy

```jsx
function Header() { return <header><Logo /></header>; }
function Logo() { return <img></img>; }
function Main() { return <main><Article /></main>; }
function Article() { return <article><p>Text</p></article>; }

export default function Page() {
  return (
    <div>
      <Header />
      <Main />
    </div>
  );
}
```

- **Task:** Sketch out the parent-child relationships in the Render Tree starting from `Page`.

## 4. Debugging Exercises

### Exercise 4.1: Broken Tree Nesting

```jsx
// Buggy Code
export function AppTree() {
  return (
    <Sidebar>
      <SidebarItem />
    </Sidebar>
    <ContentArea />
  );
}
```

- **Task:** Fix the component so it returns a single valid root node.

## 5. Implementation Exercises

### Exercise 5.1: Three-Tier Tree Component

Write a component tree consisting of `App` -> `Dashboard` -> `StatWidget`.

## 6. Modification Exercises

### Exercise 6.1: Flattening Deep Component Nesting

Refactor deeply nested inline components into separate modular components.

## 7. Edge Case Questions

1. Does a conditional branch that returns `null` create a node in the active render tree?

## 8. Real-World Challenge: Layout Tree Architecture

Build a `LayoutTree` component with `Navbar`, `Sidebar`, `MainCanvas`, and `Footer`.

```jsx
export default function LayoutTree() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', padding: '16px' }}>
      <aside>Sidebar</aside>
      <main>Main Canvas</main>
    </div>
  );
}
```
