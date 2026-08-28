
## 1. Recall Questions

*These exercises test your immediate recall of syntax, framework mechanics, and core vocabulary.*

### Problem 1: Context Initialization

Write the exact line of code required to create a context named `ThemeContext` with a default value of `'light'`. Which React module must you import to accomplish this?

### Problem 2: The Consumer Hook

When a component needs to read data from a parent context, which hook do you use, what single argument does it accept, and what exactly does it return?

### Problem 3: The Provider Syntax

In modern React, how do you wrap a JSX component tree to supply a dynamically changing value (`currentTheme`) to `ThemeContext`? Provide the exact JSX wrapper syntax.

### Problem 4: Default Value Mechanics

Under what exact runtime circumstance will a component calling `useContext(MyContext)` receive the default value that was passed into `createContext()`?

## 2. Conceptual Questions

*These questions require architectural reasoning, component design trade-offs, and structural analysis.*

### Problem 5: Defining "Prop Drilling"

In your own words, explain the architectural anti-pattern known as "prop drilling." Why does this pattern increase maintenance friction and degrade component reusability as an application scales?

### Problem 6: The Two Alternatives

Context is a powerful tool, but it should rarely be your first architectural choice. Before introducing Context to avoid passing props through intermediate components, what **two structural refactoring strategies** should you attempt first? Explain how each strategy works.

### Problem 7: Context Isolation & Overriding

Consider an application that uses two separate contexts: `AuthContext` and `ThemeContext`.

1. If a child component is wrapped in a new `ThemeContext` provider that overrides the theme, does this affect the value it reads from `AuthContext`?
2. Why does React handle multiple distinct contexts this way compared to single-tree state models?

## 8. Real-World Challenge: Code Reading & Prediction

*Trace component tree execution and state flow mentally without running the code.*

### Problem 8: Tracing Shadowed Providers

Review the nested provider tree below. What exact string will be rendered inside the `<h1>` tag of each of the four `Label` components (`LabelA`, `LabelB`, `LabelC`, and `LabelD`)?

JavaScript

```jsx
import { createContext, useContext } from 'react';

const ColorContext = createContext('grey');

function Label({ name }){
  const color = useContext(ColorContext);
  return <h1>{name}: {color}</h1>;
}

export default function App(){
  return (
    <ColorContext value="blue">
      <Label name="LabelA" />
      <ColorContext value="green">
        <Label name="LabelB" />
        <ColorContext value="red">
          <Label name="LabelC" />
        </ColorContext>
        <Label name="LabelD" />
      </ColorContext>
    </ColorContext>
  );
}
```

### Problem 9: The Unprovided Consumer

Analyze the code snippet below. When `<UserProfile/>` renders on the screen, what exact text will be displayed inside the paragraph tag? Explain why this specific output occurs instead of a runtime error.

JavaScript

```jsx
import { createContext, useContext } from 'react';

const UserContext = createContext({ name: 'Guest', role: 'Anonymous' });

function UserProfile(){
  const user = useContext(UserContext);
  return <p>Logged in as: {user.name} ({user.role})</p>;
}

export default function Dashboard(){
  const currentUser = { name: 'Alice', role: 'Admin' };

  return (
    <main className="dashboard-layout">
      {/* Note: UserContext is NOT provided here */}
      <UserProfile />
    </main>
  );
}
```

## 4. Debugging Exercises

*Identify and repair intentional violations of React rules and context mechanics.*

### Problem 10: The Static Default Trap

A developer implemented a theme toggle feature, but clicking the "Toggle Theme" button fails to update the background color of the `<MainContent/>` component. Identify the architectural flaw in how the context is being provided and write the corrected `App` component.

JavaScript

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function MainContent(){
  const theme = useContext(ThemeContext);
  return <div className={`bg-${theme}`}>Content goes here</div>;
}

export default function App(){
  const [theme, setTheme] = useState('light');

  return (
    // BUG: The context provider is improperly configured
    <ThemeContext defaultValue={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      <MainContent />
    </ThemeContext>
  );
}
```

### Problem 11: The Conditional Consumer

The following component attempts to optimize performance by only reading from `SettingsContext` when the user is actively viewing the advanced settings panel. Why will this code trigger a fatal React runtime crash, and how should it be refactored to conform to framework laws?

JavaScript

```jsx
import { useContext } from 'react';
import { SettingsContext } from './SettingsContext';

export default function SettingsPanel({ isAdvancedMode }){
  if (!isAdvancedMode) {
    return <div>Basic settings only.</div>;
  }

  // BUG: Conditional context execution
  const settings = useContext(SettingsContext);

  return (
    <div>
      <p>API Endpoint: {settings.apiUrl}</p>
      <p>Timeout: {settings.timeout}ms</p>
    </div>
  );
}
```

## 5. Implementation Exercises

*Write clean, idiomatic Context code without starter templates.*

### Problem 12: Audio Player Context Engine

Implement a complete context module and provider component for an audio player. Your code must include:

1. An `AudioContext` created with a sensible default value.
2. An `AudioProvider` component that manages two pieces of state via `useState`: `currentTrack` (string or null) and `isPlaying` (boolean).
3. The provider must expose `currentTrack`, `isPlaying`, a `playTrack(trackName)` function, and a `pauseTrack()` function to its children.
4. Write a simple `<PlayButton track="Song 1"/>` consumer component that uses this context to toggle playback.

### Problem 13: Minimalist i18n Localization Provider

Build a lightweight internationalization (i18n) system using Context.

- Create a `LocaleContext` that provides the current language code (e.g., `'en'` or `'es'`) and a translation helper function `t(key)`.
- The provider component should accept `children`, a `lang` prop, and a `translations` dictionary object.
- If a translation key is missing in the current language dictionary, the `t(key)` function should gracefully fall back to returning the raw key string.

## 6. Modification Exercises

*Adapt, scale, and clean up existing state architectures.*

### Problem 14: Flattening the Prop Drill

The following component tree passes user authentication data and a logout handler through four layers of layout components that do not use the data themselves. Refactor this entire code block to use a newly created `AuthContext`, entirely removing `user` and `onLogout` from `<DashboardLayout>`, `<Sidebar>`, and `<Header>`.

JavaScript

```jsx
export default function App(){
  const [user, setUser] = useState({ name: 'Jordan', permissions: ['read', 'write'] });
  const handleLogout = () => setUser(null);

  return <DashboardLayout user={user} onLogout={handleLogout} />;
}

function DashboardLayout({ user, onLogout }){
  return (
    <div className="layout">
      <Sidebar user={user} />
      <main>
        <Header user={user} onLogout={onLogout} />
        <Content />
      </main>
    </div>
  );
}

function Sidebar({ user }){
  return <nav>Welcome, {user ? user.name : 'Guest'}</nav>;
}

function Header({ user, onLogout }){
  return (
    <header>
      {user && <button onClick={onLogout}>Logout</button>}
    </header>
  );
}
```

### Problem 15: Extending Static Context to Dynamic Accumulation

Below is a static navigation breadcrumb system where a parent provides a fixed section name. Modify `SectionContext` and the `Section` component so that nested `<Section>` components **append** their name to the existing breadcrumb trail rather than replacing it entirely (e.g., a Section named "Products" inside a Section named "Home" should provide `"Home > Products"` to its children).

JavaScript

```jsx
import { createContext, useContext } from 'react';

const BreadcrumbContext = createContext('');

export function Section({ name, children }){
  // TASK: Read the existing breadcrumb from context, append `name`,
  // and provide the combined string to children.
  return (
    <BreadcrumbContext value={name}>
      <section className="border p-4 my-2">
        {children}
      </section>
    </BreadcrumbContext>
  );
}

export function BreadcrumbTrail(){
  const trail = useContext(BreadcrumbContext);
  return <div className="text-sm font-mono text-gray-500">Path: {trail || 'Root'}</div>;
}
```

## 7. Edge Case Questions

*Test boundary conditions, framework limits, and performance implications.*

### Problem 16: The Inline Object Identity Render Trap

Analyze the performance implication of the code below in a large, deeply nested application. Why will every render of `<App/>` force every single consumer of `UserContext` to re-render, even if the actual strings inside `user` and `role` have not changed? How do you refactor `<App/>` using standard React hooks to prevent these redundant re-renders?

JavaScript

```jsx
export default function App(){
  const [user, setUser] = useState('Alice');
  const [role, setRole] = useState('Admin');
  const [count, setCount] = useState(0); // Unrelated state

  return (
    // Performance Trap: Inline object creation on every render
    <UserContext value={{ user, role, setUser, setRole }}>
      <button onClick={() => setCount(c => c + 1)}>Increment Unrelated Counter: {count}</button>
      <DeeplyNestedUserTree />
    </UserContext>
  );
}
```

### Problem 17: Context vs. Component state Re-render Boundaries

If a component consumes two distinct contexts (`<ThemeContext>` and `<LanguageContext>`), and a state change occurs at the root level that updates the `value` of `ThemeContext` while leaving `LanguageContext` identical:

1. Does the consuming component re-render?
2. Is there any native way in standard React (without external libraries or splitting components) to instruct `useContext(ThemeContext)` to only trigger a re-render if a *specific property* (like `theme.mode`) changes inside a complex object context?

## 8. Real-World Challenge: Passing Data With Context

*Synthesize all concepts into a comprehensive, production-grade architectural problem.*

### Problem 18: Multi-Tenant Workspace & Role-Based Access Engine

Architect a multi-context dashboard shell for a project management SaaS application. You must implement two distinct, communicating context systems that govern UI layout and user capabilities across the entire app.

**Requirements:**

1. **`WorkspaceContext`:**
    - Manages the active workspace object: `{ id: string, name: string, plan: 'free' | 'pro' }`.
    - Manages a list of available workspaces.
    - Exposes a `switchWorkspace(workspaceId)` method.
2. **`PermissionsContext`:**
    - Must consume `WorkspaceContext` internally or work in tandem with it to derive user capabilities based on the active workspace plan.
    - Exposes a boolean helper function: `can(action: 'create_project' | 'invite_user' | 'export_data')`.
    - *Rules:* `'free'` plan workspaces can only `'create_project'`. `'pro'` plan workspaces can perform all three actions.
3. **Deliverables:**
    - Write the Context declarations and custom provider components (`WorkspaceProvider` and `PermissionsProvider`).
    - Create a custom hook `usePermissions()` that encapsulates consuming the permission logic cleanly.
    - Implement a functional `<ExportReportButton/>` consumer component that renders an active button if the user has the `'export_data'` permission, or a disabled button with an upgrade tooltip if they do not. Use the minimal starter structure below.

JavaScript

```jsx
import { createContext, useContext, useState } from 'react';

// 1. Declare Contexts here

// 2. Implement WorkspaceProvider here
export function WorkspaceProvider({ children }){
  // Minimal starter state:
  const [workspaces] = useState([
    { id: 'ws_1', name: 'Personal', plan: 'free' },
    { id: 'ws_2', name: 'Acme Corp', plan: 'pro' }
  ]);
  const [activeId, setActiveId] = useState('ws_1');

  // Your implementation...
}

// 3. Implement PermissionsProvider and usePermissions hook here

// 4. Implement ExportReportButton here
export function ExportReportButton(){
  // Your implementation...
}
```