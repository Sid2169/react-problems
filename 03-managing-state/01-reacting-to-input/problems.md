

## 1. Recall Questions

1. **Declarative vs. Imperative:** What is the fundamental difference between imperative UI programming and declarative UI programming? When an interaction requires disabling a button and showing a loading spinner, how does the developer's instructions to the computer differ between the two paradigms?
2. **The 5-Step Methodology:** List the five steps recommended by React for implementing a UI component declaratively. Why is it crucial to complete the first two steps before writing any logic or wiring up event handlers?
3. **Human vs. Computer Inputs:** What distinguishes a "human input" from a "computer input" in the context of triggering state updates? Give two concrete examples of each. Why do human inputs almost always require an explicit event handler in your JSX?
4. **State Paradoxes:** What is a "state paradox" (or an "impossible state") in React? If a component uses two boolean state variables, `isTyping` and `isSubmitting`, how many total mathematical combinations of those booleans exist, and how many of them represent valid visual UI states?
5. **The Principle of Minimal State:** Why does React advocate for having as few "moving pieces" (state variables) as possible? What specific category of bugs arises when you store data in state that could otherwise be derived from existing state variables or props?

## 2. Conceptual Questions

1. **The Scaling Problem of Imperative UI:** Explain why imperative UI manipulation (using DOM methods like `element.disabled = true` or `element.style.display = 'none'`) scales exponentially in complexity as a UI grows. Why does adding a single new visual state to an imperative form require auditing every existing event handler?
2. **Finite State Machines in UI Design:** How does the computer science concept of a Finite State Machine (FSM) map onto React component design? Why is representing a component's status as a single string union (e.g., `'idle' | 'loading' | 'success' | 'error'`) architecturally superior to using individual boolean flags for each visual state?
3. **Derived State vs. Synchronized State:** Imagine you are building a search widget. You already have `const [query, setQuery] = useState('')` to track the text in the input field. A junior developer proposes adding `const [isEmpty, setIsEmpty] = useState(true)` and updating it inside the `onChange` handler whenever `e.target.value.length === 0`. Explain why this is an anti-pattern and how you would architect this without the second state variable.

## 3. Code Reading & Prediction

For each of the following snippets, analyze the state structure and event logic. Predict the visual output or identify the architectural flaws in how the state models the UI.

### Exercise 3.1: The Paradoxical State Machine

JavaScript

```jsx
import { useState } from 'react';

export default function CheckoutButton(){
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handlePurchase(){
    setIsLoading(true);
    try {
      await makePayment();
      setIsSuccess(true);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button disabled={isLoading} onClick={handlePurchase}>
        {isLoading ? 'Processing...' : 'Buy Now'}
      </button>
      {isSuccess && <p className="success">Payment successful!</p>}
      {isError && <p className="error">Payment failed. Please try again.</p>}
    </div>
  );
}
```

- **Task:**
    1. What happens if the user clicks "Buy Now", experiences a network failure (`makePayment` throws an error), and then clicks "Buy Now" a second time, which succeeds? What exact text elements will be rendered in the DOM after the second click?
    2. Explain why this bug occurred and how the current boolean structure allows for invalid UI states.

### Exercise 3.2: Identifying Redundant State

JavaScript

```jsx
import { useState } from 'react';

export default function PasswordValidator(){
  const [password, setPassword] = useState('');
  const [lengthError, setLengthError] = useState(true);
  const [hasNumber, setHasNumber] = useState(false);
  const [isValid, setIsValid] = useState(false);

  function handleChange(e){
    const val = e.target.value;
    setPassword(val);

    const isLongEnough = val.length >= 8;
    const containsNum = /\d/.test(val);

    setLengthError(!isLongEnough);
    setHasNumber(containsNum);
    setIsValid(isLongEnough && containsNum);
  }

  return (
    <div>
      <input type="password" value={password} onChange={handleChange} />
      {lengthError && <span>Must be at least 8 characters.</span>}
      {!hasNumber && <span>Must contain at least one number.</span>}
      <button disabled={!isValid}>Submit</button>
    </div>
  );
}
```

- **Task:** Identify every state variable in this component that violates the principle of minimal state. List which variables should be removed from `useState` and write out the exact lines of code that should replace them using derivation.

### Exercise 3.3: Tracing Computer Inputs & Visual States

JavaScript

```jsx
import { useState, useEffect } from 'react';

export default function ProfileLoader({ userId }){
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);

  useEffect(() => {
    setStatus('loading');
    fetchProfile(userId)
      .then(profile => {
        setData(profile);
        setStatus('success');
      })
      .catch(() => {
        setStatus('error');
      });
  }, [userId]);

  if (status === 'loading') return <SkeletonLoader />;
  if (status === 'error') return <ErrorMessage retry={() => setStatus('loading')} />;
  return <ProfileCard user={data} />;
}
```

- **Task:**
    1. If the component is currently displaying an `<ErrorMessage/>` (because the initial fetch failed) and the user clicks the retry button passed to `ErrorMessage`, what visual state immediately renders?
    2. What is the subtle bug in the retry logic regarding the network request itself? Will clicking retry actually fetch the profile again? Why or why not?

## 4. Debugging Exercises

Identify all declarative violations, redundant state structures, and imperative DOM manipulations in the following snippets. Refactor the code to adhere to clean, declarative React principles.

### Exercise 4.1: The Out-of-Sync Form

A developer built a feedback submission form. However, under certain typing sequences, the submit button remains permanently disabled even when the input is valid, or the form displays an error message while submitting.

JavaScript

```jsx
// Buggy Starter Code
import { useState } from 'react';

export default function FeedbackForm(){
  const [text, setText] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  function handleInput(e){
    const val = e.target.value;
    setText(val);
    if (val.trim() === '') {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
      setErrorMessage(null);
    }
  }

  async function handleSubmit(e){
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendFeedback(text);
      setText('');
      setIsEmpty(true);
    } catch (err) {
      setErrorMessage('Failed to send feedback.');
    }
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={handleInput} disabled={isSubmitting} />
      <button disabled={isEmpty || isSubmitting}>Send</button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </form>
  );
}
```

- **Task:** Identify the redundant state variable and the structural flaw allowing simultaneous error and submission states. Refactor the component to use a single `status` union type (`'typing' | 'submitting' | 'success' | 'error'`) and derive any necessary boolean flags.

### Exercise 4.2: Imperative Relics in React

This component attempts to toggle an accordion panel and highlight the active header. The developer used React for the structure but reverted to imperative DOM manipulation for the visual transitions.

JavaScript

```jsx
// Buggy Starter Code
import { useState } from 'react';

export default function AccordionItem({ title, content }){
  const [isOpen, setIsOpen] = useState(false);

  function toggleAccordion(e){
    const nextState = !isOpen;
    setIsOpen(nextState);

    const panel = document.getElementById(`panel-${title}`);
    const header = e.currentTarget;

    if (nextState) {
      panel.style.display = 'block';
      header.classList.add('active-header');
    } else {
      panel.style.display = 'none';
      header.classList.remove('active-header');
    }
  }

  return (
    <div className="accordion-item">
      <button onClick={toggleAccordion} className="accordion-header">
        {title}
      </button>
      <div id={`panel-${title}`} className="accordion-panel" style={{ display: 'none' }}>
        {content}
      </div>
    </div>
  );
}
```

- **Task:** Explain why accessing DOM nodes via `document.getElementById` or `e.currentTarget.classList` inside React event handlers is dangerous and breaks declarative guarantees. Rewrite `AccordionItem` so that all visual changes (visibility and CSS classes) are driven purely by JSX styling rules and the `isOpen` state.

## 5. Implementation Exercises

Write the specified components from scratch. Focus on defining explicit visual states, eliminating redundant state variables, and deriving UI conditions cleanly.

### Exercise 5.1: The Two-Factor Authentication (2FA) Gate

Write a component named `TwoFactorAuth` that lets a user enter a 6-digit verification code.

- **Requirements:**
    - The UI must model exactly five visual states:
        1. **Empty:** The input is empty; the "Verify" button is disabled.
        2. **Typing:** The user has entered 1–5 digits; the "Verify" button is disabled.
        3. **Ready:** The user has entered exactly 6 digits; the "Verify" button is enabled.
        4. **Verifying:** The user clicked "Verify"; input and button are disabled, and a message reads "Verifying code...".
        5. **Error:** The network request rejected the code; the UI returns to the *Ready* visual state, but displays an inline error message above the button: *"Invalid code. Please try again."*
    - **Architectural Constraint:** You are forbidden from using boolean state variables like `isVerifying`, `isReady`, or `isError`. You must use a single `status` state variable alongside the `code` input string.
    - Assume an async function `verifyCode(string)` exists that returns a Promise.

### Exercise 5.2: State Normalizer / Visual Validator

To demonstrate your mastery of preventing impossible states, write a pure JavaScript function called `getFormVisualState` that acts as a declarative state machine selector for a complex payment form.

- **Requirements:**
    - The function accepts an object containing three raw state variables: `{ cardNumber: string, isSubmitting: boolean, serverError: string | null }`.
    - The function must return an object with three boolean properties consumed by the JSX: `{ isButtonDisabled: boolean, showSpinner: boolean, errorMessage: string | null }`.
    - **Rules to enforce mathematically:**
        - `showSpinner` is true *only* if `isSubmitting` is true.
        - `isButtonDisabled` must be true if `isSubmitting` is true OR if `cardNumber` stripped of whitespace is not exactly 16 digits long.
        - `errorMessage` should return the `serverError` *unless* `isSubmitting` is currently true (never show an error message while a new submission is actively processing, even if the old error string hasn't been cleared from memory).

## 6. Modification Exercises

### Exercise 6.1: Collapsing a Boolean Explosion

The following component was written by a developer who added a new boolean state variable every time a new feature was requested. It is currently prone to paradoxes and bug regressions.

JavaScript

```jsx
// Legacy Code
import { useState } from 'react';

export default function DataExporter(){
  const [isIdle, setIsIdle] = useState(true);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function startExport(){
    setIsIdle(false);
    setIsPreparing(true);
    setHasError(false);
    try {
      await prepareData();
      setIsPreparing(false);
      setIsDownloading(true);
      await downloadFile();
      setIsDownloading(false);
      setIsCompleted(true);
    } catch (err) {
      setIsPreparing(false);
      setIsDownloading(false);
      setHasError(true);
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="exporter">
      {isIdle && <button onClick={startExport}>Export Data</button>}
      {isPreparing && <p>Packaging files for export...</p>}
      {isDownloading && <p>Downloading bundle...</p>}
      {isCompleted && <p className="success">Export complete!</p>}
      {hasError && <p className="error">Error: {errorMsg}</p>}
    </div>
  );
}
```

- **Task:** Refactor `DataExporter` to use exactly **two** state variables: one string representing the discrete step of the export process, and one to hold the error message if a failure occurs. Ensure the JSX conditional rendering is updated to read cleanly from your new state structure.

### Exercise 6.2: Migrating an Imperative Modal Wizard

Here is an imperative script written for a multi-step onboarding modal. It directly manipulates the DOM to hide and show steps.

JavaScript

```jsx
// Legacy Imperative Script
let currentStep = 1;
const step1El = document.getElementById('step-1');
const step2El = document.getElementById('step-2');
const step3El = document.getElementById('step-3');
const nextBtn = document.getElementById('next-btn');
const backBtn = document.getElementById('back-btn');

function updateModalUI(){
  step1El.style.display = currentStep === 1 ? 'block' : 'none';
  step2El.style.display = currentStep === 2 ? 'block' : 'none';
  step3El.style.display = currentStep === 3 ? 'block' : 'none';

  backBtn.disabled = currentStep === 1;
  nextBtn.textContent = currentStep === 3 ? 'Finish' : 'Next';
}

nextBtn.addEventListener('click', () => {
  if (currentStep < 3) {
    currentStep++;
    updateModalUI();
  } else {
    submitOnboarding();
  }
});

backBtn.addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep--;
    updateModalUI();
  }
});
```

- **Task:** Convert this imperative logic into a single declarative React component named `OnboardingWizard`. Model the visual steps using state, derive the button disabled states and text dynamically, and eliminate all direct DOM queries and manual display toggling.

## 7. Edge Case Questions

1. **Out-of-Order Network Responses (Race Conditions):** Imagine a search component where typing in an input triggers an asynchronous computer input: a network request to fetch auto-complete suggestions. The developer models state cleanly with `const [suggestions, setSuggestions] = useState([])`.
    - If a user types "Re" (triggering Request A, which takes 800ms over a slow connection) and rapidly types "React" (triggering Request B, which takes 100ms over a fast connection), what visual bug occurs when Request A resolves after Request B?
    - How does declarative state modeling need to be supplemented (via cleanup functions or query identifiers) to handle competing computer inputs?
2. **State Updates on Unmounted Components:** A component enters the `'submitting'` state and initiates a 3-second network request. Before the request resolves, the user clicks a navigation link, causing the form component to unmount from the DOM.
    - When the network Promise finally resolves and calls `setStatus('success')`, what happens internally in React?
    - How should you structure your asynchronous event handlers or computer input effects to safely handle transitions when the underlying UI visual state no longer exists?

## 8. Real-World Challenge: The Multi-Step Flight Reservation Engine

You are architecting the ticket configuration and checkout widget for an airline booking platform. The component must handle seat selection, passenger details, dynamic pricing computation, and ticketing submission in a single, resilient UI interface.

### Architectural Requirements:

1. **The Visual State Machine:** The component (`FlightBookingEngine`) must cleanly transition through four distinct visual phases:
    - `'selection'`: The user selects a seat class (`'economy'`, `'business'`, or `'first'`) and chooses whether to add checked baggage (boolean).
    - `'passenger'`: The user inputs their full name and passport number.
    - `'submitting'`: The user initiated the booking; the entire interface locks, and a ticketing progress indicator appears.
    - `'confirmed'`: The booking succeeded; the configuration forms disappear, replaced by a boarding pass summary showing the final calculated price and passenger details.
2. **Dynamic Pricing Rules (Derivation Enforcement):**
    - Base prices: Economy = $300, Business = $800, First Class = $1500.
    - Checked baggage adds a flat $50 fee, but is **free** (included automatically at $0) if Business or First Class is selected.
    - **Strict Constraint:** You are strictly forbidden from storing `totalPrice` or `baggageFee` in a `useState` variable. All pricing must be derived mathematically during the render based on the current selections.
3. **Validation & Navigation Rules:**
    - In the `'passenger'` state, the "Complete Reservation" button must be disabled unless both the full name is at least 3 characters long and the passport number is exactly 9 alphanumeric characters.
    - A "Back" button must allow the user to return from `'passenger'` to `'selection'` without losing their seat class or baggage selections.
    - If the ticketing network request fails during `'submitting'`, the UI must transition back to the `'passenger'` state, preserve all user input, and display an inline error alert: *"Ticketing system offline. Please try again."*

### Your Mission:

Write the complete, production-ready code for `FlightBookingEngine`.

- Define the absolute minimum number of state variables required to represent all interactive data and visual transitions.
- Ensure no impossible state combinations can exist (e.g., showing a ticketing error while in the `'selection'` state, or charging for baggage on a Business class seat).
- Write clean, self-documenting rendering blocks for each state of the FSM.