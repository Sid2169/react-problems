

## 1. Recall Questions

1. What does calling a state setter function (like `setIsSent(true)`) actually do — does it change the variable immediately, or something else?
2. Fill in the blank: "Rendering" means React is calling your component, which is a ______.
3. True or False: state variables behave like regular JavaScript variables that get overwritten in place the moment you call their setter.
4. Where does React actually store state, according to the "shelf" metaphor — inside your component function, or outside it?
5. In `const [number, setNumber] = useState(0);`, what would happen if you tried to write `number = number + 1;` directly in your component, instead of calling `setNumber`?
6. If you call `setNumber(number + 1)` three times in a row inside the same click handler, how many times does `number` actually increase by the time the next render happens?
7. What technique does the lesson use to help you reason about what a render's event handler will actually do — replacing state variable names with what?
8. True or False: a state variable's value can change partway through a single render's event handler, if enough time passes before that handler finishes running.
9. What determines which value of `number` a `setTimeout` callback sees when it eventually fires — the state at the moment the timeout was scheduled, or the state at the moment the timeout fires?

## 2. Conceptual Questions

1. The lesson says state "lives... as if on a shelf," outside your component. Contrast this with a plain local variable like `let count = 0;` declared inside the component function. Why does `count` reset to `0` every render, while state declared with `useState` doesn't?
2. This lesson never uses the word "closure," but the entire "snapshot" behavior is really JavaScript closures at work. Using what you already know about closures, explain why each render's event handler keeps referring to its own value of `number`, even after React has moved on to a new render with a new value.
3. Someone new to React says: *"If clicking a button changes what's on the screen, doesn't that mean my state updated instantly, during the click?"* Correct their mental model using the "snapshot" framing from this lesson.
4. Compare the `+3` button example to the delayed `setTimeout` alert example. What's the common underlying reason both of them "surprise" people who haven't internalized the snapshot model?
5. The Recap says event handlers created in the past "have the state values from the render in which they were created." What does "created in the past" actually mean here — created when, exactly, relative to re-renders?
6. The lesson argues the snapshot behavior makes event handlers "less prone to timing mistakes," using the Alice/Bob example as evidence. What kind of bug would you expect in a hypothetical framework where state changes were reflected instantly and retroactively inside already-running event handlers?

## 3. Code Reading & Prediction

Predict exactly what happens — displayed value, console output, or alert text — before checking your reasoning.

1. `function Counter() { const [count, setCount] = useState(0); return ( <button onClick={() => { setCount(count + 1); setCount(count + 1); }}>{count}</button> );
}
// starting at count = 0, predict the displayed number after ONE click`
2. `function Toggle() { const [on, setOn] = useState(false); return ( <button onClick={() => { setOn(!on); console.log(on); }}>{on ? 'ON' : 'OFF'}</button> );
}
// button currently reads OFF (on = false). What does console.log print when clicked?`
3. `function Names() { const [name, setName] = useState('Alice'); function handleClick() { setName('Bob'); alert(name); } return <button onClick={handleClick}>{name}</button>;
}
// name is currently 'Alice'. What does the alert say?`
4. `function Renders() { const [n, setN] = useState(0); console.log('rendering with n =', n); return ( <button onClick={() => setN(n + 1)}>{n}</button> );
}
// clicked twice in a row`
    
    How many times does `"rendering with n = ..."` print in total (including the initial mount), and what values print, in order?
    
5. Two state variables at once:
    
    ```jsx
    function Pair() {
      const [a, setA] = useState(1);
      const [b, setB] = useState(10);
      return (
        <button onClick={() => {
          setA(a + b);
          setB(a + b);
        }}>Go</button>
      );
    }
    // a = 1, b = 10 at the moment of the click
    ```
    
    What are `a` and `b` after the next render? (This one is testing whether both calls read from the *same* snapshot, or whether the second call somehow sees the first call's result.)
    
6. Trickiest one — two clicks, two overlapping timers:
    
    ```jsx
    function DelayedLog() {
      const [step, setStep] = useState(1);
      return (
        <button onClick={() => {
          setStep(step + 1);
          setTimeout(() => console.log(step), 2000);
        }}>Next</button>
      );
    }
    // clicked once at t=0 (step is 1), clicked again at t=500ms (step is now 2)
    // both clicks happen well before either 2-second timer fires
    ```
    
    What does each `console.log` print, and in what order do they resolve?
    

## 4. Debugging Exercises

Each snippet has exactly one intentional bug.

---

1. The developer named this `bumpByFive`, expecting each click to add 5. What does it actually add, and why?

```jsx
function Stepper() {
  const [value, setValue] = useState(0);

  function bumpByFive() {
    setValue(value + 1);
    setValue(value + 1);
    setValue(value + 1);
    setValue(value + 1);
    setValue(value + 1);
  }

  return (
    <button onClick={bumpByFive}>
      {value}
    </button>
  );
}
```

---

1. A teammate calls `handleWin()` twice inside `handleBonusRound`, assuming this stacks two separate `+10`s into `+20`. Will it?

```jsx
function Score() {
  const [points, setPoints] = useState(0);

  function handleWin() {
    setPoints(points + 10);
  }

  function handleBonusRound() {
    handleWin();
    handleWin();
  }

  return (
    <button onClick={handleBonusRound}>
      Bonus round (+20?)
    </button>
  );
}
```

---

1. A user clicks quickly three times, ending at quantity 4, then the first alert fires. What quantity does it report, and why does the developer's assumption that it'll say "4" fail?

```jsx
function Cart({ price }) {
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {
    setQuantity(quantity + 1);

    setTimeout(() => {
      alert(
        `Added, new quantity: ${quantity}, total: $${quantity * price}`
      );
    }, 3000);
  }

  return (
    <button onClick={handleAddToCart}>
      Add one more
    </button>
  );
}
```

---

1. A user types "sid", clicks Submit, then — before the 5 seconds are up — changes the input to "siddhartha". What does the console print? Is this actually a bug, or the framework working as designed? Justify your answer.

```jsx
function ProfileForm() {
  const [username, setUsername] = useState('');

  function handleSubmit() {
    setTimeout(() => {
      console.log('Submitting for user:', username);
    }, 5000);
  }

  return (
    <>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <button onClick={handleSubmit}>
        Submit (delayed)
      </button>
    </>
  );
}
```

---

1. The developer swapped real state for a plain `let` variable, plus a "force a re-render" trick (`forceRender` triggers a genuine re-render every click, since `Date.now()` is always a new value). Does `count` actually accumulate across clicks the way they expect? Why or why not?

```jsx
function Counter() {
  let count = 0;
  const [, forceRender] = useState(0);

  return (
    <button
      onClick={() => {
        count = count + 1;
        forceRender(Date.now());
      }}
    >
      {count}
    </button>
  );
}
```

---

## 5. Implementation Exercises

No solutions below — write and actually run these.

1. Write a `LikeButton` with a `likes` state variable starting at `0`. Its click handler should call the setter *twice* in a row using `likes + 1` (not an updater function — this lesson hasn't covered those yet). Before running it, write a one-line comment predicting how much `likes` will actually increase per click.
    
    ```jsx
    function LikeButton() {
      // your code here
    }
    ```
    
2. Write a `VoteCounter` with `yes` and `no` state variables, both starting at `0`. A single "Vote Yes" click should call the `yes` setter three separate times (still no updater functions) and leave `no` untouched. Predict in a comment what `yes` will be after one click, then verify.
    
    ```jsx
    function VoteCounter() {
      // your code here
    }
    ```
    
3. Write a `Countdown` with a `secondsLeft` state variable starting at `10`. Add a button that, when clicked, immediately `alert`s the current `secondsLeft`, and separately schedules a second `alert` 3 seconds later, also reporting `secondsLeft`. Don't worry about actually decrementing the countdown — the point is to observe both alerts reporting the same number regardless of what happens afterward.
    
    ```jsx
    function Countdown() {
      // your code here
    }
    ```
    
4. Write a `NameTag` with a `name` state variable and a text `input` bound to it. Add a "Greet" button whose click handler captures the current `name` into a `setTimeout`delayed `alert`, 4 seconds later. Verify by typing a new name before the alert fires that it still reflects the name at click time, not at alert time.
    
    ```jsx
    function NameTag() {
      // your code here
    }
    ```
    

## 6. Modification Exercises

1. Take your `LikeButton` from Implementation Q1. It currently calls the setter twice per click but only actually increases `likes` by 1, due to the snapshot behavior. Without introducing an updater function (still out of scope for this lesson), change the component so a single click reliably increases `likes` by 2. Think about what actually has to change here — it's not about calling the setter more cleverly, it's about how many times you need to call it at all.
2. This component logs a stale value:
    
    ```jsx
    function Watcher({ label }) {
      const [count, setCount] = useState(0);
      function handleClick() {
        setCount(count + 1);
        setTimeout(() => {
          console.log(`${label}: count is ${count}`);
        }, 2000);
      }
      return <button onClick={handleClick}>{label}: {count}</button>;
    }
    ```
    
    Modify *only* the `console.log` line (not the `setCount` call, and still no updater functions) so it reports the number the button will actually display right after this click — using something you already have in scope inside `handleClick`.
    
3. Extend the traffic light example from this lesson's own Challenge (the `walk` boolean, alerting what's next) so it also tracks a `changeCount` state variable that increments every time the light changes, and alerts something like `"Stop is next (change #4)"` using both pieces of state. Make sure your reasoning about the snapshot behavior applies correctly to *both* state variables, not just `walk`.

## 7. Edge Case Questions

1. A render's event handler calls `setNumber(number + 1)`, but the click handler itself is never actually invoked (say, the button is disabled). Does anything about `number` change?
2. A component re-renders for a reason unrelated to the state variable in question — say, a parent re-renders it and passes new props. Does that state variable still hold whatever value it had before, or does it reset? Why?
3. Per the Recap, "every render has its own event handlers." So what actually happens to the *old* event handler function from the previous render once a new render has occurred — does it linger anywhere, or is it simply gone?
4. Two different `setTimeout`s get scheduled in two different renders — say render A schedules one for 5 seconds, then a click causes render B to schedule another for 5 seconds, 1 second later. Do they read from the same "shelf" value when they eventually fire, or from render A's and render B's own separate snapshots respectively?
5. You call the same setter twice in a row with two *different* computed values — `setNumber(number + 1); setNumber(number + 10);` — instead of the same value twice. Does the second call "win"? Is that the same underlying mechanism as the `+3` button collapsing to `+1`, or something different?
6. Suppose a component has no state at all — just a `let` local variable computed and reassigned directly in the render body (not inside any event handler). Does the "snapshot" idea from this lesson apply to that variable too, in any sense, or does it not really come up at all here?

## 8. Real-World Challenge: The State As A Snapshot Challenge

Build a `FeedbackForm` that combines everything above:

```jsx
function FeedbackForm() {
  // your code here
}
```

- Two state variables: `rating` (a number 1–5, starting at `0` meaning "not yet rated") and `comment` (a string, starting empty).
- A row of 5 star buttons; clicking star `n` calls `setRating(n)`.
- A `<textarea>` bound to `comment`.
- A "Submit" button whose click handler:
    - Sets a third state variable, `submitted`, to `true` (you don't need to actually disable the DOM elements — just track it).
    - Schedules a `setTimeout` for 4 seconds that logs ``Submitted: rating=${rating}, comment="${comment}"`` to the console.
- Requirement to satisfy on purpose: if the user changes `rating` or edits `comment` *after* clicking Submit but *before* the 4 seconds elapse, the logged message must still reflect what was on the form at the moment Submit was clicked — not whatever's there 4 seconds later.
- Add a one-line code comment right above the `setTimeout` call explaining, in your own words, why this requirement is satisfied automatically rather than something you had to work to enforce.

**Optional stretch:** add a `submitCount` state variable meant to track how many times Submit has been pressed. Now deliberately call your submission logic twice in a row from a single click (like the `handleBonusRound` example) using two direct `setSubmitCount(submitCount + 1)` calls. Observe that it doesn't go up by 2, then explain why in one sentence, tying it back to the "shelf" metaphor.

---

*No solutions included on purpose — this is built for retrieval practice. Ask anytime for an answer key or a walkthrough of any section once you've had a real attempt.*