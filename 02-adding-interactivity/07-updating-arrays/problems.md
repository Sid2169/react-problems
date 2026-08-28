# Updating Arrays in State

> **Reference:** [React Docs](https://react.dev/learn/updating-arrays-in-state)

## 1. Recall Questions

1. Which array methods mutate an array directly (`push`, `pop`, `splice`, `sort`) and should be avoided in state updates?
2. Which array methods return a new array (`concat`, `[...arr]`, `filter`, `map`, `slice`) and are safe for state updates?
3. How do you append an item to an array in state using spread syntax?
4. How do you remove an item from an array in state using `.filter()`?
5. How do you update an item in an array in state using `.map()`?

## 2. Conceptual Questions

1. Why is array mutation in state problematic for React's change detection and re-rendering logic?

## 3. Code Reading & Prediction

### Exercise 3.1: The Array Push Bug

```jsx
export default function TodoApp() {
  const [todos, setTodos] = useState(['Buy milk']);

  function addTodo() {
    todos.push('Walk dog'); // Mutation!
    setTodos(todos);
  }

  return <button onClick={addTodo}>Todos: {todos.length}</button>;
}
```

- **Task:** Explain why `todos.push` does not trigger a re-render.

## 4. Debugging Exercises

### Exercise 4.1: Fixing Array Mutation

```jsx
// Buggy Code
export function ItemList() {
  const [items, setItems] = useState([1, 2, 3]);

  function removeItem(index) {
    items.splice(index, 1); // Bug!
    setItems(items);
  }

  return <button onClick={() => removeItem(0)}>Remove First</button>;
}
```

- **Task:** Fix `removeItem` using `.filter((_, i) => i !== index)`.

## 5. Implementation Exercises

### Exercise 5.1: Shopping List Item Adder

Write a `ShoppingList` component that appends new items immutably with `setItems([...items, newItem])`.

## 6. Modification Exercises

### Exercise 6.1: Updating List Items Immutably

```jsx
export function ToggleTodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Task 1', done: false },
    { id: 2, text: 'Task 2', done: false }
  ]);

  function toggleDone(id) {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  }

  return <button onClick={() => toggleDone(1)}>Toggle Task 1</button>;
}
```

## 7. Edge Case Questions

1. How do you insert an item at a specific index in an array without mutating it?

## 8. Real-World Challenge: Immutable Task Board Manager

Build a `TaskManager` component that supports adding, removing, and toggling tasks immutably.

```jsx
export default function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Setup Vite', status: 'done' },
    { id: 2, name: 'Build Workbench', status: 'in-progress' }
  ]);

  function addTask(name) {
    setTasks([...tasks, { id: Date.now(), name, status: 'todo' }]);
  }

  function removeTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  return (
    <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
      <h2>Tasks ({tasks.length})</h2>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            {t.name} - <strong>{t.status}</strong>
            <button onClick={() => removeTask(t.id)} style={{ marginLeft: '10px' }}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => addTask('New Task')}>Add Task</button>
    </div>
  );
}
```
