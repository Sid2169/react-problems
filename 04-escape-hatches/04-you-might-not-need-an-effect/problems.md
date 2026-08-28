## 1. Recall Questions

1. **The Primary Purpose of Effects:** In the React paradigm, what is the single intended purpose of an Effect, and what are two common scenarios where developers mistakenly use them?
2. **The Cascading Render:** What specifically happens in React's rendering pipeline when you update a state variable inside an Effect that was triggered by a prop change?
3. **Memoization Syntax:** What React Hook should be used to cache an expensive calculation during rendering, and what syntax rules govern its dependency array?
4. **Component Reset:** What component attribute can you pass from a parent to a child to instruct React to treat two instances as conceptually distinct components, automatically resetting all internal DOM and state without using an Effect?
5. **App Initialization:** Why is placing app-wide initialization logic (like checking an auth token) inside a root-level `useEffect` without guards problematic during development?

## 2. Conceptual Questions

1. **Render Pipeline vs. Effect Execution:** Explain why transforming data (such as filtering an array) inside an Effect is significantly less efficient than calculating it directly at the top level of a component function. Trace the exact sequence of React events in both scenarios.
2. **The "Why" Test:** How do you determine whether a piece of logic belongs in an event handler or an Effect? Apply this test to contrast sending an analytics event when a page loads versus sending a POST request when a user submits a form.
3. **Lifting State Up vs. Child Effects:** When a child component needs to notify a parent of a state change, why is calling a parent-provided callback inside the child's `useEffect` considered an anti-pattern? What are the two preferred architectural alternatives?
4. **The Fragility of Effect Chains:** Describe the maintenance and performance hazards of "chaining" Effects—where one Effect sets a state variable, which triggers another Effect to set another state variable. Why does this pattern make features like "time-travel" or history scrubbing difficult to implement?
5. **State as a Snapshot:** If you extract logic from an Effect into an event handler and execute `setRound(round + 1)`, why will inspecting `round` immediately on the next line evaluate to the old value? How should you structure calculations that depend on the next state value inside an event handler?

## 3. Code Reading & Prediction

#### Exercise 3.1: The Render Counter

Analyze the following code. How many times will the console log `"Rendering UserProfile"` when the component first mounts with `firstName = "Jane"` and `lastName = "Doe"`? Explain your reasoning.



```jsx
function UserProfile({ firstName, lastName }){
  console.log("Rendering UserProfile");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  return <h1>Welcome, {fullName}</h1>;
}
```

#### Exercise 3.2: The Execution Order

Predict the exact sequence of console logs when the user clicks the "Increment" button once. Assume the component is running in **Production mode**.



```jsx
function Counter(){
  const [count, setCount] = useState(0);
  const double = count * 2;

  console.log(`Render: count is ${count}, double is ${double}`);

  useEffect(() => {
    console.log(`Effect: count is ${count}`);
  }, [count]);

  function handleClick(){
    console.log("Handler: before set");
    setCount(c => c + 1);
    console.log("Handler: after set");
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

#### Exercise 3.3: Strict Mode Initialization

Predict what will happen in the network tab when this component mounts in a modern React development environment with Strict Mode enabled. What logic flaw does this reveal?



```jsx
function App(){
  useEffect(() => {
    fetch('/api/track-app-open', { method: 'POST' });
  }, []);

  return <Dashboard />;
}
```

## 4. Debugging Exercises

#### Exercise 4.1: The Redundant State Loop

This component attempts to display a list of active users. Identify the performance and structural flaws in this approach and rewrite the component to eliminate the unnecessary Effect and state.



```jsx
function ActiveUsersList({ users }){
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const filtered = users.filter(u => u.isActive);
    setActiveUsers(filtered);
  }, [users]);

  return (
    <ul>
      {activeUsers.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

#### Exercise 4.2: The Persistent Toast Bug

A developer complains that when a user refreshes the page on an item that is already in their shopping cart, the "Added to cart!" notification pops up automatically. Identify why this happens and fix the code so the notification only shows when the user actually performs the action.



```jsx
function ProductCard({ product, addToCart }){
  useEffect(() => {
    if (product.isInCart) {
      showToast(`Added ${product.name} to your cart!`);
    }
  }, [product]);

  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  );
}
```

#### Exercise 4.3: Inverted Data Flow

This setup creates a confusing data flow where the child dictates state to the parent via an Effect. Refactor both components so that data flows predictably from parent to child without using Effects.



```jsx
function ParentDashboard(){
  const [userSettings, setUserSettings] = useState(null);
  return (
    <div>
      <SettingsLoader onSettingsLoaded={setUserSettings} />
      {userSettings && <SettingsView settings={userSettings} />}
    </div>
  );
}

function SettingsLoader({ onSettingsLoaded }){
  const settings = useFetchSettings(); // Custom hook fetching data

  useEffect(() => {
    if (settings) {
      onSettingsLoaded(settings);
    }
  }, [settings, onSettingsLoaded]);

  return null;
}
```

## 5. Implementation Exercises

#### Exercise 5.1: Pure Derivation with Caching

Write a `MetricsDashboard` component that takes an array of transaction objects (`{ id, amount, date, category }`) and a `selectedCategory` string as props.

- Calculate the `totalSpend` and `averageTransaction` for the selected category directly during rendering.
- Assume the transaction array could contain 50,000 items. Implement proper caching so the filtering and math do not re-run if a parent component forces a re-render without changing the transactions or category.
- Do **not** use `useState` or `useEffect`.

#### Exercise 5.2: State Reset via Key Architecture

Create an application interface consisting of two components: `Workspace` and `ProjectEditor`.

- `Workspace` maintains a list of projects and a `selectedProjectId` state. It renders buttons to switch between projects and renders the `ProjectEditor` for the selected project.
- `ProjectEditor` maintains complex internal state: a `notes` text input state and a `isEditing` boolean state.
- Implement the connection between these components so that whenever the user switches to a different project in `Workspace`, the `notes` and `isEditing` state in `ProjectEditor` are completely wiped clean and reset to defaults **without using an Effect or writing reset logic inside `ProjectEditor`**.

#### Exercise 5.3: The Module-Level Singleton Init

Write an application initialization sequence that executes a `loadAnalyticsScript()` and `validateUserSession()` function exactly **once** per application load. Your solution must:

- Be resilient to React Strict Mode remounting the root component.
- Avoid running twice even if the root component is destroyed and recreated.
- Demonstrate both the top-level variable tracking approach and the module-level conditional approach.

## 6. Modification Exercises

#### Exercise 6.1: Decoupling Chained Effects

Refactor the following multi-step form logic to entirely remove the `useEffect` chain. Calculate next states synchronously inside the event handler, ensuring you correctly handle derived values without falling victim to stale state snapshots.



```jsx
function OnboardingWizard(){
  const [step, setStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (step > 3) {
      setIsCompleted(true);
    }
  }, [step]);

  useEffect(() => {
    if (isCompleted) {
      submitFinalProfile({ role: userRole });
    }
  }, [isCompleted, userRole]);

  function handleNext(selectedRole){
    if (step === 1) {
      setUserRole(selectedRole);
    }
    setStep(s => s + 1);
  }

  return <WizardUI step={step} onNext={handleNext} />;
}
```

#### Exercise 6.2: From Object Selection to ID Derivation

Refactor the following code. Currently, it attempts to sync the selected object when the underlying list changes via an Effect. Modify the state structure to store an ID instead of the object, eliminating the need for the Effect and the `prevItems` tracking pattern entirely.



```jsx
function DataGrid({ rows }){
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (selectedRow) {
      const updatedRow = rows.find(r => r.id === selectedRow.id);
      setSelectedRow(updatedRow || null);
    }
  }, [rows, selectedRow]);

  return (
    <div>
      <Grid items={rows} onSelect={setSelectedRow} />
      <DetailView item={selectedRow} />
    </div>
  );
}
```

#### Exercise 6.3: Shared Handler Extraction

In this component, an Effect is being used to trigger a save operation whenever `isDirty` becomes true. Refactor the component to remove the Effect by extracting the shared saving logic into a helper function called directly from the interaction handlers.



```jsx
function DocumentEditor({ docId, initialContent }){
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isDirty) {
      autoSaveDocument(docId, content);
      setIsDirty(false);
    }
  }, [isDirty, docId, content]);

  function handleTextChange(e){
    setContent(e.target.value);
    setIsDirty(true);
  }

  function handlePaste(pasteData){
    setContent(prev => prev + pasteData);
    setIsDirty(true);
  }

  return <textarea value={content} onChange={handleTextChange} onPaste={handlePaste} />;
}
```

## 7. Edge Case Questions

1. **During-Render State Updates:** The lesson shows that you can adjust state during rendering using the pattern `if (items !== prevItems) { setPrevItems(items); }`. What happens if you attempt to call a setter function for a *different* component's state during the render phase? Why does React enforce this boundary?
2. **Infinite Loop Conditionals:** When adjusting state during rendering (to avoid an Effect), what critical condition must always wrap the state-setting call, and what exact runtime error or behavior occurs if you omit it?
3. **The Dropdown Dependency Exception:** The lesson states: *"Imagine a form with multiple dropdowns where the options of the next dropdown depend on the selected value of the previous dropdown. Then, a chain of Effects is appropriate because you are synchronizing with network."* Why is an Effect chain acceptable here, whereas it is an anti-pattern for pure client-side state adjustments? What distinguishes this edge case?

## 8. Real-World Challenge: s

#### Challenge 8.1: The High-Performance Data Explorer

You are tasked with building a `ProductExplorer` component for an e-commerce enterprise.

- **Input Props:** `inventory` (an array of 10,000 product objects), `category` (string), and `onProductSelect` (function).
- **Requirements:**
    1. Filter the inventory by the selected `category` and sort them by price. This calculation takes ~15ms and must be memoized so it does not run when unrelated state changes.
    2. Users can type into a local `searchQuery` input to further filter the visible items.
    3. Maintain a `selectedProductId` state. If the parent changes the `category` prop, any currently selected product must be cleanly deselected without triggering a cascading re-render through an Effect.
    4. When a user clicks "Immediate Buy" on a item, send a POST request to `/api/checkout` and fire a Google Analytics tracking event. Neither of these network calls should ever execute simply because the component re-rendered or mounted.
- **Task:** Build the complete, production-ready component architecture meeting all specifications without using a single `useEffect`.



```jsx
// Starter Code
export default function ProductExplorer({ inventory, category, onProductSelect }){
  // Implement robust, Effect-free architecture here
}
```

#### Challenge 8.2: The Interactive Audio Player with Session History

Design a `PlaylistPlayer` component that manages playback state and synchronizes with an external browser API while keeping React state pure.

- **Requirements:**
    1. The component receives `playlist` (array of track objects) and `currentTrackIndex` as props from the parent.
    2. Maintain local state for `isPlaying` (boolean) and `userRating` (number 1-5 for the active track).
    3. When `currentTrackIndex` changes via parent navigation, the `userRating` must automatically reset to `0` without an Effect and without using the `key` prop on the root container (assume the root container has expensive media elements that must not unmount).
    4. When the user clicks the "Next Track" button, update the parent's index, log the skip to a remote backend, and trigger an internal UI toast.
    5. **The Only Effect:** Use exactly one `useEffect` to handle the actual synchronization with the HTML5 `<audio>` element (e.g., calling `audioRef.current.play()` or `pause()` when `isPlaying` or the track changes). Ensure this Effect contains zero state-setting logic.
- **Task:** Write the component, strictly separating user events, state derivations, during-render adjustments, and external synchronization into their rightful places.



```jsx
// Starter Code
export default function PlaylistPlayer({ playlist, currentTrackIndex, onIndexChange }){
  const audioRef = useRef(null);
  const currentTrack = playlist[currentTrackIndex];

  // Implement the multi-tiered logic here
}
```

When you are ready to check your answers or want a comprehensive code review on any specific exercise, provide your solutions and I will evaluate them.