
## 1. Recall Questions

*Test your knowledge of core definitions, syntax, and key facts.*

1. **JSX Definition:** What is JSX, and what does it compile into under the hood?
2. **Rule of One:** What is the primary rule regarding the number of elements a React component can return, and what specific JSX syntax allows you to bypass adding unnecessary elements to the DOM?
3. **Closing Tags:** How does JSX differ from standard HTML when handling tags like `<img>`, `<br>`, or `<input>`?
4. **Attribute Syntax:** What naming convention must be applied to most HTML and SVG attributes when writing JSX? Name the two specific HTML attribute prefixes that are explicitly exempt from this rule.

## 2. Conceptual Questions

*Explain, compare, and reason about the underlying architecture of React.*

5. **The "Why" of JSX:** Historically, web developers were taught to separate HTML, CSS, and JavaScript into completely separate files (Separation of Concerns). Why does React intentionally break this historical rule by mixing markup and logic together inside components?
6. **The Wrapper Explanation:** Explain the underlying JavaScript limitation that forces JSX to require a single root element (or Fragment). Why can't you just return three sibling `<div>` tags side-by-side?

## 3. Code Reading & Prediction

*Trace code and predict what React will do.*

7. **Predict the Error:** Look at the following JSX snippet. Will it render successfully? If not, what specific error will React throw and why?
```jsx
export default function HeroSection() {
  return (
    <h1>Welcome to our App</h1>
    <p>The best place to manage your tasks.</p>
  )
}

```


8. **Identify the Console Warnings:** A teammate wrote the following component. While it might render, React will complain in the browser console. Identify the **two** issues that violate JSX rules.
```jsx
export default function UserInput() {
  return (
    <div class="input-container">
      <label>Enter Username:</label>
      <input type="text" data-testid="username-input" tabindex="1">
    </div>
  );
}

```



## 4. Debugging Exercises

*Find and fix the intentional mistakes in the provided code.*

9. **The Broken Form:** The following component is entirely broken and will not compile. Identify and fix **four** distinct JSX syntax errors to make it run.
```jsx
export default function ContactForm() {
  return (
    <form class="contact-form">
      <h2>Contact Us</h2>
      <p>We'd love to hear from you!
      <br>
      <label>Email Address</label>
      <input type="email" stroke-width="2">
      <button>Submit</button>
    </form>
  );
}

```



## 5. Implementation Exercises

*Write code from scratch based on specific constraints.*

10. **Build a Navigation Bar:** Create a valid React component named `NavBar` from scratch. It must:
* Return a single root element without adding any extra `<div>` tags to the DOM.
* Contain an `<nav>` element with a class name of `main-navigation`.
* Contain a self-closing logo image.
* Contain an unordered list with two list items.



## 6. Modification Exercises

*Adapt existing non-React code into React components.*

11. **Refactor HTML to JSX:** You have been given the raw HTML snippet below. Refactor it into a valid JSX React component named `FeatureCard`.
*Raw HTML:*
~~~html
<div class="card" tabindex="0">
  <svg stroke-width="1.5" viewBox="0 0 24 24">...</svg>
  <h3>Fast Performance</h3>
  <hr>
  <p>Our app loads in < 1 second.</p>
</div>
~~~


*Starter Code:*
```jsx
export default function FeatureCard() {
  return (
    <>{/* Add your refactored JSX here */}</>
  );
}

```



## 7. Edge Case Questions

*Test boundary conditions and uncommon scenarios.*

12. **SVG Attribute Translation:** SVGs often contain dozens of attributes that utilize dashes and specific casing. If you were to copy the following SVG tag into a React component:
`<svg viewBox="0 0 100 100" fill-rule="evenodd" aria-hidden="true"></svg>`
How exactly must `viewBox`, `fill-rule`, and `aria-hidden` be written in JSX to avoid console errors? State the rule that applies to each.

## 8. Real-World Challenge: Jsx

*Combine multiple concepts into a practical problem.*

13. **The Dashboard Widget:** As a frontend developer, a designer hands you an HTML mockup for a user dashboard widget. Convert this exact structure into a functional React component named `DashboardWidget`. You must ensure 100% JSX compliance (single root, closed tags, camelCase) while keeping the exact visual hierarchy.
*HTML Mockup to Convert:*
~~~html
<!-- Dashboard Widget -->
<section class="widget-container">
  <header class="widget-header">
    <h2 class="widget-title">Activity Feed</h2>
    <button class="refresh-btn" onclick="refreshFeed()">
      <img src="refresh-icon.svg" alt="Refresh">
    </button>
  </header>

  <ul class="activity-list" data-list-type="recent">
    <li>User <b>Jane</b> logged in at 10:00 AM
    <li>User <b>John</b> uploaded a file
      <br>
      <img src="file-preview.jpg" class="thumbnail">
    </li>
  </ul>
</section>
~~~


*Starter Code:*
```jsx
export default function DashboardWidget() {
  return (
    <>{/* Implement the JSX translation here */}</>
  );
}

```



---

Which section would you like to tackle first, or would you like me to grade your answers for any specific questions?