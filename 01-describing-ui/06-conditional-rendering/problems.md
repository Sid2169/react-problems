
## 1. Recall Questions

1. Name the three JavaScript constructs this lesson uses for conditional rendering, besides a plain `if`/`else` with an early `return`.
2. What must a component's function always do, even when there's nothing to render?
3. Fill in the two blanks (the ternary operator symbols): `isPacked ___ '✅' ___ '❌'`.
4. Which three values does React treat as a "hole" in the JSX tree, rendering nothing in their place?
5. Is `0` one of those "hole" values? What actually appears on screen if you write `{0 && <p>Hi</p>}`?
6. What's the one-line fix for the bug in the question above, assuming the `0` came from a variable named `count`?
7. Between `let` and `const`, which do you need for a variable you plan to conditionally reassign before returning JSX?
8. The lesson says returning `null` directly from a component like `Item` isn't common in practice. What's the recommended alternative?
9. In `{cond && <A />}`, what does the whole expression evaluate to when `cond` is `false`? What about when `cond` is `true`?

## 2. Conceptual Questions

1. You now have three tools for conditional rendering: `if`/`return`, `? :`, and `&&`. For each one, give a short scenario where it's clearly the right choice, and one where reaching for it would be awkward.
2. The lesson's DeepDive box claims these two versions of `Item` are **completely equivalent**, not just similar:
    
    ```jsx
    if (isPacked) {
      return <li className="item">{name} ✅</li>;
    }
    return <li className="item">{name}</li>;
    ```
    
    ```jsx
    return (
      <li className="item">
        {isPacked ? name + ' ✅' : name}
      </li>
    );
    ```
    
    Using the "blueprint, not instance" idea, explain *why* — what would have to be true about JSX for these to actually behave differently, and why isn't it?
    
3. A reviewer comments on your PR: *"I wouldn't use `&&` here — `unreadCount` isn't guaranteed to be a boolean."* What are they worried about, and would switching to `? :` alone fix it?
4. The lesson suggests reaching for a `let` variable + `if` "when the shortcuts get in the way of writing plain code." Name two concrete signals in a piece of JSX that would tell you it's time to make that switch.
5. Is `{cond && <A/>}` always interchangeable with `{cond ? <A/> : null}`? Think specifically about what happens when `cond` is `0`, not just when it's `true` or `false`.
6. Why extract a child component when nested conditional markup gets messy, instead of just adding more parentheses and indentation?

## 3. Code Reading & Prediction

Predict exactly what renders before checking your reasoning.

1. `function Item({ name, isPacked }) { return <li>{name} {isPacked && '✅'}</li>;
}
// rendered with name="Map", isPacked={false}`
2. `function Cart({ itemCount }) { return <div>{itemCount && <span>{itemCount} items</span>}</div>;
}
// rendered with itemCount={0}`
3. `function Greeting({ name }) { return <h1>{name ? `Hello, ${name}` : 'Hello, stranger'}</h1>;
}
// rendered with name={undefined}`
4. `function Status({ isOnline }) { let label = 'Offline'; if (isOnline) { label = 'Online'; } return <span>{label}</span>;
}
// rendered with isOnline={true}`
5. Three `<Row>`s render inside one `<ul>`; the middle one gets `isPacked={true}`.
    
    ```jsx
    function Row({ isPacked, name }) {
      if (isPacked) {
        return null;
      }
      return <li>{name}</li>;
    }
    ```
    
    How many `<li>` elements end up in the DOM?
    
6. `function Flag({ count }) { return <div>{count > 0 && count}</div>;
}
// rendered once with count={5}, once with count={0}`
    
    What renders each time — and why does `count > 0 && count` sidestep the problem that plain `count && count` would have?
    

## 4. Debugging Exercises

Each snippet has exactly one intentional bug.

1. `function NotificationBadge({ count }) { return ( <div> {count && <span className="badge">{count}</span>} </div> );
}`
    
    What shows up when `count` is `0`, and why?
    
2. `function Item({ name, isPacked }) { if (isPacked) { return <li>{name} ✅</li>; }
}`
    
    What happens when `isPacked` is `false`? Think about what the function body actually returns in that case.
    
3. `function Price({ amount, onSale }) { return ( <p> {onSale ? <del>{amount}</del> <strong>{amount * 0.8}</strong> : amount} </p> );
}`
    
    This doesn't compile. What's structurally missing from the "true" branch?
    
4. `function UserGreeting({ user }) { let greeting = 'Hello, guest'; if (user) { greeting = 'Hello, ' + user.name; } return <h1>greeting</h1>;
}`
    
    This renders the literal word "greeting" no matter what `user` is. Why?
    
5. `function TodoItem({ text, done }) { return ( <li> {done && <del>{text}</del>} {!done && text} </li> );
}
// called with done={0} — the API sends 0/1, not true/false`
    
    What actually shows up for an incomplete item, and why does the `!done` line make things worse instead of better?
    

## 5. Implementation Exercises

No solutions below — write and actually run these.

1. Write a `Badge` component that renders nothing when `count` is `0`, and `<span>{count} new</span>` otherwise. Use whichever operator is actually safe here — not the one from Debugging Q1.
    
    ```jsx
    function Badge({ count }) {
      // your code here
    }
    ```
    
2. Write an `AuthButton`: a single `if`/`return` pair returning `<button>Log out</button>` when `isLoggedIn` is `true`, and `<button>Log in</button>` otherwise.
    
    ```jsx
    function AuthButton({ isLoggedIn }) {
      // your code here
    }
    ```
    
3. Rewrite the previous exercise (the `AuthButton`) as one ternary expression instead of `if`/`return`.
4. Write a `StatusDot` for a `status` prop that's one of `'online'`, `'away'`, `'offline'`, rendering a `<span>` with different text for each. Use the `let` + `if`/`else if` style — not nested ternaries.
    
    ```jsx
    function StatusDot({ status }) {
      // your code here
    }
    ```
    

## 6. Modification Exercises

1. Product just added a fourth status, `'busy'`, to your `StatusDot` from Implementation Q4 — and says more are coming. Refactor the `if`/`else if` chain into an object lookup (the same move the lesson uses to turn the `Drink` example into a `drinks[name]` object), with a one-line comment on why the object scales better here.
2. Refactor this nested ternary into a `let` variable with `if` statements, so the discount logic doesn't require mentally unpacking nested `? :`:
    
    ```jsx
    function Price({ amount, onSale, isMember }) {
      return (
        <p>
          {onSale
            ? (isMember ? amount * 0.7 : amount * 0.8)
            : (isMember ? amount * 0.9 : amount)}
        </p>
      );
    }
    ```
    
3. This component currently renders nothing when the cart is empty:
    
    ```jsx
    function Cart({ items }) {
      return (
        <div>
          {items.length > 0 && <p>{items.length} items in cart</p>}
        </div>
      );
    }
    ```
    
    Change it so an empty cart shows `<p>Your cart is empty</p>` instead — with the smallest possible edit to the existing expression (you shouldn't need `if`/`return` here).
    

## 7. Edge Case Questions

1. `isPacked` is `undefined` because the prop was never passed. Walk through what each of these actually does: `if (isPacked) {...}`, `isPacked ? 'a' : 'b'`, and `isPacked && 'a'`.
2. `user.nickname` is `""` — an empty string set on purpose, not a missing value — in `{user.nickname && <span>{user.nickname}</span>}`. What renders? Is `""` a "hole" the way `null`/`undefined`/`false` are, or something else?
3. `count` is `NaN` (say, from a failed `parseInt`) in `{count && <Badge/>}`. What renders? Why might this be a worse bug to ship than the `count === 0` case?
4. Both branches of a ternary currently return identical JSX — `cond ? <li>{name}</li> : <li>{name}</li>` — because you haven't added the differing styling yet. Code smell to fix immediately, or reasonable mid-refactor? What would you check before deciding?
5. A validation library hands you an `error` prop that could be `undefined`, `null`, or `''` depending on which validator last touched the field. Which of those three actually stop `{error && <p className="error">{error}</p>}` from rendering, and which don't?
6. Twenty `<Item>`s are rendered in a list; five have `isPacked={true}` and return `null`. If you add `console.log(name)` at the top of `Item`, does it fire for those five? What does your answer say about the difference between "a component renders nothing" and "a component is never called"?

## 8. Real-World Challenge

Build a `TaskList` for a small todo app. It takes one prop, `tasks`:

```jsx
{ id: string, title: string, completed: boolean, priority: number }[]
```

```jsx
function TaskList({ tasks }) {
  // your code here
}
```

Requirements — deliberately mixing everything above:

- If `tasks` is empty, render just `<p>No tasks yet — add one to get started.</p>` and stop there.
- Otherwise render a `<ul>` of `<li>`s. For each task:
    - Wrap the title in `<del>` when `completed` is `true` — pick `? :` or `&&` and leave a one-line comment on why.
    - Show `(Priority: N)` in italics, but only when `priority > 0` — the falsy-`0` fix from earlier, for real this time.
    - Show a `⭐` right after the title only when `priority >= 5` **and** the task isn't completed — two conditions at once. Chained `&&`s or a `let`/`if` block? Your call.
- Above the `<ul>`, show `"X of Y tasks completed"`. Decide for yourself whether this line needs conditional rendering at all, or whether it's just a plain expression that's always shown — getting that distinction right is the actual test.

**Optional stretch:** once it works, deliberately reintroduce the `count && <Something/>` bug into your own completed-count line, watch it break, then fix it. Reading about that bug and watching it happen in code you wrote are two different levels of knowing it.

---

*No solutions included on purpose — this is built for retrieval practice. Ask anytime for an answer key or a walkthrough of any section once you've had a real attempt.*