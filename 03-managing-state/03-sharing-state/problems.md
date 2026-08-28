# Sharing State Between Components

> **Reference:** [React Docs](https://react.dev/learn/sharing-state-between-components)

## 1. Recall Questions

1. What does "lifting state up" mean in React?
2. When two components need to coordinate state updates, where should their shared state live?
3. What is a "controlled component" versus an "uncontrolled component"?
4. How do child components communicate user actions back up to a parent component holding shared state?
5. Why is single source of truth important for shared UI features like accordion panels or tab sets?

## 2. Conceptual Questions

1. Explain the data flow when a parent component manages active tab state and passes `isActive` and `onSelect` down to children.

## 3. Code Reading & Prediction

### Exercise 3.1: Controlled Panel Trace

```jsx
function Panel({ title, isActive, onShow }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? <p>Panel content...</p> : <button onClick={onShow}>Show</button>}
    </section>
  );
}

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <Panel title="About" isActive={activeIndex === 0} onShow={() => setActiveIndex(0)} />
      <Panel title="Photos" isActive={activeIndex === 1} onShow={() => setActiveIndex(1)} />
    </div>
  );
}
```

- **Task:** Trace which panel is expanded on load, and what happens when the second panel's "Show" button is clicked.

## 4. Debugging Exercises

### Exercise 4.1: Uncoordinated Independent State

```jsx
// Buggy Code: Each panel manages its own state independently
function IndependentPanel({ title }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <div>
      <h3>{title}</h3>
      <button onClick={() => setIsActive(!isActive)}>Toggle</button>
      {isActive && <p>Content</p>}
    </div>
  );
}
```

- **Task:** Refactor so only one panel can be active at a time by lifting `activeIndex` up to a parent `Accordion` component.

## 5. Implementation Exercises

### Exercise 5.1: Synchronized Input Fields

Write a parent component `SyncedInputs` with two text inputs that display identical values in real-time by sharing state.

## 6. Modification Exercises

### Exercise 6.1: Lifting Search State Up

Refactor a `SearchBar` and `ProductTable` component so `searchQuery` lives in `FilterableProductTable`.

## 7. Edge Case Questions

1. What happens if a child component tries to modify a prop passed from a parent directly?

## 8. Real-World Challenge: Multi-Tab Dashboard Container

Build a `TabbedDashboard` component that coordinates active tabs and content panels using shared state.

```jsx
function TabButton({ label, isActive, onClick }) {
  return (
    <button onClick={onClick} style={{ background: isActive ? '#6366f1' : '#e2e8f0', color: isActive ? '#fff' : '#000', padding: '8px 16px', margin: '4px' }}>
      {label}
    </button>
  );
}

export default function TabbedDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
      <div>
        <TabButton label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton label="Analytics" isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
      </div>
      <div style={{ marginTop: '16px' }}>
        {activeTab === 'overview' && <p>Overview Metrics Here</p>}
        {activeTab === 'analytics' && <p>Detailed Analytics Charts Here</p>}
      </div>
    </div>
  );
}
```
