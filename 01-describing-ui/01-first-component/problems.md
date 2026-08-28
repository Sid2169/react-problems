> **Reference:** [Personal Notes](https://ruby-theater-554.notion.site/Your-First-component-39a7aba3701f809bbd5dcfde474bb66f?pvs=25) · [React Docs](https://react.dev/learn/your-first-component) · [Problem-Set-Notion-Page](https://ruby-theater-554.notion.site/React-Your-First-Component-Problem-Set-39b7aba3701f80308e26cca20068dc2c?pvs=25)


## 1. Recall Questions

1. **The Core Definition:** What is a React component at the JavaScript language level, and what are the two mandatory rules that distinguish it from a standard JavaScript utility function?
2. **The Casing Rule:** Why must React component names always begin with a capital letter? How does the React compiler interpret `<navBar />` versus `<NavBar/>` during execution?
3. **Automatic Semicolon Insertion (ASI):** Why does placing an opening JSX tag on the line immediately *after* a `return` keyword cause a component to render nothing or throw an error? What specific syntactic structure prevents this?
4. **Module Exporting:** What is the functional difference between `export default function MyComponent()` and `export function MyComponent()` when sharing components across files?
5. **Root vs. Child Components:** What role does a "root component" play in a React application, and how does component composition allow a single child component to be used across multiple pages?

## 2. Conceptual Questions

1. **Composition vs. Monolithic HTML:** In traditional web development, UI elements like sidebars and modals are written as raw HTML documents sprinkled with JavaScript. Explain how React's component-based model changes the maintainability and scalability of an application as the codebase grows to thousands of lines.
2. **The Nested Definition Trap:** A junior developer decides to define a helper component called `<UserAvatar>` directly inside the body of a `<UserProfile>` component so that they can easily share variables. Why is defining a component inside another component considered a severe architectural anti-pattern? Describe the impact on React's rendering pipeline and state management.
3. **Framework Integration:** When using standard client-side React (e.g., importing React into an empty HTML file), React "takes over" an empty DOM node using JavaScript. How does a modern full-stack framework (like Next.js or Remix) change how root components are initially delivered to the browser?

## 3. Code Reading & Prediction

For each of the following snippets, trace the code and predict the exact visual output or runtime behavior. Explain the underlying mechanics driving the result.

### Exercise 3.1: The Mixed Casing Trace



```jsx
function badge(){
  return <span className="badge">Active</span>;
}

export default function UserCard(){
  return (
    <div className="card">
      <h1>User Profile</h1>
      <badge />
      <badge />
    </div>
  );
}
```

- **Task:** What will the browser actually render to the DOM when `<UserCard/>` is mounted? Why does the word "Active" fail to appear on the screen?

### Exercise 3.2: The Semicolon Trap



```jsx
export default function HeroBanner(){
  return
    <header className="hero">
      <h1>Welcome to our Platform</h1>
      <p>Build things faster.</p>
    </header>;
}
```

- **Task:** Predict what this component returns when executed by React. Explain how JavaScript's parsing engine handles line breaks after the `return` keyword.

### Exercise 3.3: Component Hierarchy & DOM Output



```jsx
function Author(){
  return <p>By: Jane Doe</p>;
}

function ArticleBody(){
  return <article><p>React makes UI development modular.</p></article>;
}

export default function Post(){
  return (
    <section>
      <h1>Understanding Components</h1>
      <Author />
      <ArticleBody />
      <Author />
    </section>
  );
}
```

- **Task:** Write out the exact, final HTML DOM structure that the browser sees after React finishes rendering `<Post/>`.

## 4. Debugging Exercises

Identify all syntax, naming, and architectural errors in the following snippets. Rewrite the code so it executes cleanly and adheres to React best practices.

### Exercise 4.1: Broken Syntax & Exporting

A developer wrote the following file to display a product badge, but the application crashes with compilation errors.



```jsx
// Buggy Starter Code
function productBadge(){
  return
    <div class="product-badge">
      <span>New Arrival</span>
    <div>
}

function ProductPage() {
  return (
    <main>
      <productBadge />
    </main>
  )
}
```

- **Task:** Identify at least **four distinct errors** in this code (spanning naming, JSX syntax, HTML attributes, and module exporting). Rewrite the complete file to fix them.

### Exercise 4.2: The Nested Component Bug

This component attempts to organize a sidebar by grouping its links into a localized sub-component, but it violates React's structural rules.



```jsx
// Buggy Starter Code
export default function Sidebar(){

  function SidebarLink(){
    return <li><a href="#dashboard">Dashboard</a></li>;
  }

  return (
    <aside className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <SidebarLink />
        <SidebarLink />
        <SidebarLink />
      </ul>
    </aside>
  );
}
```

- **Task:** Explain why the placement of `SidebarLink` is problematic. Refactor the file so the component hierarchy is structurally sound while preserving the visual output.

## 5. Implementation Exercises

Write the specified React components from scratch. Keep your code clean, modular, and strictly focused on structural encapsulation.

### Exercise 5.1: The Atomic Component

Write a standalone React component called `CallToAction`.

- **Requirements:**
    - Must be the default export of the module.
    - Must return an `<section>` wrapper with a CSS class of `"cta-banner"`.
    - Inside the section, render an `<h2>` heading reading `"Ready to get started?"` and a `<button>` reading `"Join Now"`.
    - Ensure all JSX return formatting adheres to multi-line safety rules.

### Exercise 5.2: Composing a Page Layout

Write three distinct components from scratch: `Header`, `Footer`, and `LandingPage`.

- **Requirements:**
    - `Header` should return a `<header>` element containing an `<h1>` with your app's name.
    - `Footer` should return a `<footer>` element containing copyright text.
    - `LandingPage` must be the default export. It should assemble the layout by rendering `Header`, a `<main>` tag containing a simple welcome paragraph, and `Footer`.
    - All components must reside at the top level of the file hierarchy.

## 6. Modification Exercises

### Exercise 6.1: Extracting Reusable UI from Monolithic JSX

The following component contains repetitive, hardcoded markup. Refactor it by extracting the repetitive UI into a reusable child component called `FeatureCard`.



```jsx
// Legacy Monolithic Code
export default function FeatureGrid(){
  return (
    <section className="features">
      <h1>Why Choose Us</h1>
      <div className="grid">
        <div className="card">
          <h3>Fast Performance</h3>
          <p>Optimized for speed and responsiveness.</p>
        </div>
        <div className="card">
          <h3>Secure by Default</h3>
          <p>Enterprise-grade security built right in.</p>
        </div>
        <div className="card">
          <h3>24/7 Support</h3>
          <p>Our team is here to help you anytime.</p>
        </div>
      </div>
    </section>
  );
}
```

- **Task:** Create the `FeatureCard` component (returning hardcoded placeholder text is fine for this exercise since we have not covered props yet) and use it three times inside `FeatureGrid` to clean up the markup structure.

### Exercise 6.2: Flattening Deeply Nested Code

A developer coming from object-oriented programming attempted to encapsulate internal UI pieces inside a parent "class-like" structure.



```jsx
// Legacy Nested Code
export default function OrderSummary(){

  function HeaderSection(){
    return <h2>Your Order Details</h2>;
  }

  function ItemList(){
    function Item(){
      return <li>Mechanical Keyboard - $120</li>;
    }

    return (
      <ul>
        <Item />
        <Item />
      </ul>
    );
  }

  return (
    <div className="summary-box">
      <HeaderSection />
      <ItemList />
    </div>
  );
}
```

- **Task:** Refactor this module so that zero components are defined inside other components. Organize all declarations cleanly at the root level of the file.

## 7. Edge Case Questions

1. **The Empty Return Boundary:** A conditional component might occasionally need to render nothing at all.
    - What happens if a React component function executes `return null;`?
    - How does React's rendering engine handle `return undefined;` or a function with no explicit return statement? Why is there a difference?
2. **The Sibling Return Constraint:** Consider a component that attempts to return two sibling elements directly
    
    ```jsx
    function TitleGroup(){
      return (
        <h1>Primary Title</h1>
        <h2>Sub-heading text</h2>
      );
    }
    ```
    
    - Explain why the JavaScript parser immediately throws a syntax error when encountering two un-wrapped sibling tags inside a return statement. How does how JSX compiles down to regular JavaScript functions explain this limitation?

## 8. Real-World Challenge: The Marketing Landing Page Assembly

You have been tasked with building the architectural skeleton of a SaaS product landing page. The design team has handed you a mockup that needs to be broken down into clean, highly modular, and reusable components.

### Architectural Requirements:

1. **No Monolithic Blocks:** The main exported component must be called `SaaSLandingPage`. It should contain almost no raw HTML tags itself; instead, it should act purely as an orchestrator that renders custom child components.
2. **Required Component Hierarchy:**
    - **`NavigationBar`**: Contains a brand name and three static navigation links (e.g., Features, Pricing, Contact).
    - **`HeroSection`**: Contains a bold headline, a descriptive sub-headline, and two call-to-action buttons (e.g., "Get Started" and "Live Demo").
    - **`SocialProof`**: Renders a heading saying `"Trusted by industry leaders"` followed by three visual placeholders representing client company logos. You must extract the individual logo rendering into a sub-component called `CompanyLogo` and instantiate it three times inside `SocialProof`.
    - **`FooterSection`**: Contains basic copyright text and a static link to terms of service.
3. **Strict Structural Hygiene:**
    - Every single component must be defined at the top level of the file.
    - Proper JSX attribute casing and closing tags must be used throughout.
    - Multi-line return statements must be safely wrapped in parentheses.

### Your Mission:

Write the complete, functional code for the landing page assembly. Focus strictly on component separation, clean JSX structure, correct casing, and proper exporting. Build the entire structure cleanly without using props or state—rely purely on the architectural mechanics taught in this lesson.