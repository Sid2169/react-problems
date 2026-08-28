# React Practice Workbench

A practice Workbench & problem collection built for mastering the concepts in the [React Learn](https://react.dev/learn) documentation through hands-on exercises and real-time live previewing.

The goal is simple: **read an article, solve unified exercises, and test your code live in the interactive workbench.**

---

## ⚡ Quick Start & Workbench Setup

### 1. Install Dependencies & Start Dev Server
```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🛠️ Practice Workflow Options

You can scaffold and solve any of the **31 React topics** using either of the following workflows:

### Option A: Automated CLI Scaffolder (Recommended) 🚀

Automatically parse `problems.md` and scaffold a tailored `Solution.jsx` template with extracted component definitions:

```bash
# Short syntax (category-topic)
npm run new 03-01

# Or by topic name keyword
npm run new js-in-jsx
```

- **Location created:** `./<category>/<topic>/Solution.jsx`
- **Auto-Discovery:** As soon as the file is created, the Workbench UI instantly detects it and lists all exported exercise components!

---

### Option B: 1-Click Workbench Template Copier 📋

1. Launch `npm run dev` and open `http://localhost:3000`.
2. Select any **⚪ Unsolved** topic from the sidebar.
3. Click **"Copy Starter Solution.jsx Template"** (or click **"Copy CLI Command"**).
4. Create a `Solution.jsx` file in that topic's directory and paste your solution code.

---

## 🎯 How Solution Files Work

Place a single file named **`Solution.jsx`** inside any topic folder. Export your solution components as named exports or a default export:

```jsx
// Example: ./01-describing-ui/01-first-component/Solution.jsx
import React, { useState } from 'react';

// Written / Conceptual Answers
export const answers = {
  recall: { q1: "JSX stands for JavaScript XML..." },
  conceptual: { q1: "Component composition allows..." }
};

// Exercise 5.1
export function CallToAction() {
  return (
    <section className="cta-banner">
      <h2>Ready to get started?</h2>
      <button>Join Now</button>
    </section>
  );
}

// Exercise 8: Real-World Challenge (Default Export)
export default function SaaSLandingPage() {
  return <div>...</div>;
}
```

### Live Output & Progress Tracking
- **🟢 Solved Badges**: Topics containing a `Solution.jsx` file are marked as solved with a green check badge.
- **Progress Tracker**: Header tracks overall completion progress (e.g. `1 / 31 Topics Solved (3%)`).
- **Component Switcher Pills**: Click through exported components to view their live renders instantly.

---

## 📚 Standardized 8-Part Problem Schema

Every single `problems.md` file across all 31 topics strictly adheres to the following unified structure:

1. `## 1. Recall Questions` — Definitions, core rules, and syntax facts
2. `## 2. Conceptual Questions` — Architectural reasoning and trade-offs
3. `## 3. Code Reading & Prediction` (`### Exercise 3.1: ...`) — Mental code tracing
4. `## 4. Debugging Exercises` (`### Exercise 4.1: ...`) — Identifying and fixing bugs
5. `## 5. Implementation Exercises` (`### Exercise 5.1: ...`) — Writing components from scratch
6. `## 6. Modification Exercises` (`### Exercise 6.1: ...`) — Refactoring existing code
7. `## 7. Edge Case Questions` — Boundary conditions and framework quirks
8. `## 8. Real-World Challenge: [Title]` — Comprehensive end-of-topic project

---

## 📂 Topics Covered (31 Total)

### 1. Describing the UI
* [01. Your First Component](./01-describing-ui/01-first-component)
* [02. Importing and Exporting Components](./01-describing-ui/02-importing-exporting)
* [03. Writing Markup with JSX](./01-describing-ui/03-jsx)
* [04. JavaScript in JSX with Curly Braces](./01-describing-ui/04-js-in-jsx)
* [05. Passing Props to a Component](./01-describing-ui/05-passing-props)
* [06. Conditional Rendering](./01-describing-ui/06-conditional-rendering)
* [07. Rendering Lists](./01-describing-ui/07-rendering-lists)
* [08. Keeping Components Pure](./01-describing-ui/08-keeping-components-pure)
* [09. Your UI as a Tree](./01-describing-ui/09-ui-as-a-tree)

### 2. Adding Interactivity
* [01. Responding to Events](./02-adding-interactivity/01-responding-to-events)
* [02. State: A Component's Memory](./02-adding-interactivity/02-component-memory)
* [03. Render and Commit](./02-adding-interactivity/03-render-and-commit)
* [04. State as a Snapshot](./02-adding-interactivity/04-state-as-a-snapshot)
* [05. Queueing a Series of State Updates](./02-adding-interactivity/05-queueing-state-updates)
* [06. Updating Objects in State](./02-adding-interactivity/06-updating-objects)
* [07. Updating Arrays in State](./02-adding-interactivity/07-updating-arrays)

### 3. Managing State
* [01. Reacting to Input with State](./03-managing-state/01-reacting-to-input)
* [02. Choosing the State Structure](./03-managing-state/02-structuring-state)
* [03. Sharing State Between Components](./03-managing-state/03-sharing-state)
* [04. Preserving and Resetting State](./03-managing-state/04-preserving-resetting-state)
* [05. Extracting State Logic into a Reducer](./03-managing-state/05-state-with-reducer)
* [06. Passing Data Deeply with Context](./03-managing-state/06-passing-data-with-context)
* [07. Scaling Up with Reducer and Context](./03-managing-state/07-reducer-and-context)

### 4. Escape Hatches
* [01. Referencing Values with Refs](./04-escape-hatches/01-referencing-values-with-refs)
* [02. Manipulating the DOM with Refs](./04-escape-hatches/02-manipulating-dom-with-refs)
* [03. Synchronizing with Effects](./04-escape-hatches/03-synchronizing-with-effects)
* [04. You Might Not Need an Effect](./04-escape-hatches/04-you-might-not-need-an-effect)
* [05. Lifecycle of Reactive Effects](./04-escape-hatches/05-effect-lifecycle)
* [06. Separating Events from Effects](./04-escape-hatches/06-separating-events-effects)
* [07. Removing Effect Dependencies](./04-escape-hatches/07-removing-effect-dependencies)
* [08. Reusing Logic with Custom Hooks](./04-escape-hatches/08-custom-hooks)

---

## 📖 Source

All concepts and topic ordering are based on the official [React Learn documentation](https://react.dev/learn).
