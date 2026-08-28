# React Problems

A collection of practice problem sets based on the concepts covered in each article of the [React Learn](https://react.dev/learn) documentation.

The goal is simple: **read an article, then practice the concepts through problems to strengthen understanding and recall.**

---

## ⚡ Quick Start & Workbench Setup

This repository includes an **Interactive React Workbench** powered by Vite with **zero-config auto-discovery**.

### 1. Install Dependencies & Start Dev Server
```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. How to Solve Problems

1. Pick a problem set from the list below and open its `problems.md` (e.g. `./01-describing-ui/01-first-component/problems.md`).
2. Create a **single solution file** named `Solution.jsx` in the **same directory** beside `problems.md`.
3. Export your solution components as named or default exports:

```jsx
// 01-describing-ui/01-first-component/Solution.jsx
import React from 'react';

// Exercise 5.1
export function CallToAction() {
  return (
    <section className="cta-banner">
      <h2>Ready to get started?</h2>
      <button>Join Now</button>
    </section>
  );
}

// Exercise 5.2
export function LandingPage() {
  return <div>...</div>;
}

// Exercise 8 (Main Challenge)
export default function SaaSLandingPage() {
  return <div>...</div>;
}
```

### 3. View Live Output
Switch to your browser (`http://localhost:3000`). The Workbench automatically discovers any `Solution.jsx` file in your project:
- **Sidebar**: Navigate through topics categorized by section.
- **Export Tabs**: Click any exported exercise component (`CallToAction`, `LandingPage`, `SaaSLandingPage`) to interact with it live on screen.
- **Hot Reloading**: Any code edits in `Solution.jsx` reload instantly.

---

## Problem Sets

### Describing the UI

* [Your First Component](./01-describing-ui/01-first-component)
* [Importing and Exporting Components](./01-describing-ui/02-importing-exporting)
* [Writing Markup with JSX](./01-describing-ui/03-jsx)
* [JavaScript in JSX with Curly Braces](./01-describing-ui/04-js-in-jsx)
* [Passing Props to a Component](./01-describing-ui/05-passing-props)
* [Conditional Rendering](./01-describing-ui/06-conditional-rendering)
* [Rendering Lists](./01-describing-ui/07-rendering-lists)
* [Keeping Components Pure](./01-describing-ui/08-keeping-components-pure)
* [Your UI as a Tree](./01-describing-ui/09-ui-as-a-tree)

### Adding Interactivity

* [Responding to Events](./02-adding-interactivity/01-responding-to-events)
* [State: A Component's Memory](./02-adding-interactivity/02-component-memory)
* [Render and Commit](./02-adding-interactivity/03-render-and-commit)
* [State as a Snapshot](./02-adding-interactivity/04-state-as-a-snapshot)
* [Queueing a Series of State Updates](./02-adding-interactivity/05-queueing-state-updates)
* [Updating Objects in State](./02-adding-interactivity/06-updating-objects)
* [Updating Arrays in State](./02-adding-interactivity/07-updating-arrays)

### Managing State

* [Reacting to Input with State](./03-managing-state/01-reacting-to-input)
* [Choosing the State Structure](./03-managing-state/02-structuring-state)
* [Sharing State Between Components](./03-managing-state/03-sharing-state)
* [Preserving and Resetting State](./03-managing-state/04-preserving-resetting-state)
* [Extracting State Logic into a Reducer](./03-managing-state/05-state-with-reducer)
* [Passing Data Deeply with Context](./03-managing-state/06-passing-data-with-context)
* [Scaling Up with Reducer and Context](./03-managing-state/07-reducer-and-context)

### Escape Hatches

* [Referencing Values with Refs](./04-escape-hatches/01-referencing-values-with-refs)
* [Manipulating the DOM with Refs](./04-escape-hatches/02-manipulating-dom-with-refs)
* [Synchronizing with Effects](./04-escape-hatches/03-synchronizing-with-effects)
* [You Might Not Need an Effect](./04-escape-hatches/04-you-might-not-need-an-effect)
* [Lifecycle of Reactive Effects](./04-escape-hatches/05-effect-lifecycle)
* [Separating Events from Effects](./04-escape-hatches/06-separating-events-effects)
* [Removing Effect Dependencies](./04-escape-hatches/07-removing-effect-dependencies)
* [Reusing Logic with Custom Hooks](./04-escape-hatches/08-custom-hooks)

## Source

All concepts and topic ordering are based on the official [React Learn documentation](https://react.dev/learn).
