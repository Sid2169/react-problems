

## 1. Recall Questions

*Short answers, from memory.*

**R1.** Fill in the blank: React associates a piece of state with a component's __________ and __________ in the render tree — not with the component as a standalone object.

**R2.** True or false: if a component re-renders with completely different props, but its type and position in the tree stay the same, its state resets.

**R3.** A component is removed from the tree, and later a JSX tag of the exact same type is added back at the same position. Does it pick up where its old state left off, or does it start fresh?

**R4.** What is the purpose of the `key` prop?

**R5.** True or false: a `key` value must be unique across the entire application.

**R6.** When an element's `key` changes between renders, what three things happen to it?

**R7.** What specifically goes wrong if you define one component's function inside the body of another component?

**R8.** List the three techniques for preserving state that would otherwise be wiped out by unmounting.

**R9.** React determines identity from the JSX tree it actually receives on a given render. What two things does it explicitly *not* base that identity on?

**R10.** Fill in the blank: "State survives a re-render only if the tree's structure __________, top to bottom, between renders."

---

## 2. Conceptual Questions

*Explain your reasoning, not just the answer.*

**C1.** Two `<Counter />` elements are rendered side by side, both written from the same shared JSX variable. Explain why they end up as two fully independent state instances instead of sharing one.

**C2.** A component conditionally returns either `<div><Counter /></div>` or `<section><Counter /></section>` depending on a boolean, with `<Counter />` written identically in both branches. Explain what actually determines whether its state survives when the boolean flips — and what doesn't matter.

**C3.** A `<Counter />` is the second child of its parent on one render. A sibling above it is removed, so on the next render `<Counter />` becomes the *first* child — with no `key` anywhere in sight. Will its state persist? Explain in terms of how React assigns identity by default.

**C4.** Using the "swap `<section>` for `<div>`" example, explain why a completely unchanged child component can still lose its state, purely because of something that happened to its ancestor.

**C5.** Compare "render variants in different positions" with "assign different `key`s" as ways to force a reset. Describe one situation where only one of the two is practical, and explain why the other falls short there.

**C6.** A teammate says: "State lives inside the component, like a variable declared in its body." What's inaccurate about that framing? Restate it more precisely using the position-in-the-tree model.

**C7.** Why does defining a component function inside another component's body cause a reset on *every single re-render* — not just the first time it's defined?

**C8.** Explain why using an array index as `key` is usually harmless for a static list that never reorders or has items inserted or removed, but becomes a real bug the moment any of those things can happen.

---

## 3. Code Reading & Prediction

*Predict the behavior before running anything, and justify it in terms of type + position.*

**CR1.**

```jsx
function Scoreboard({ isPlayerA }) {
  return (
    <div>
      {isPlayerA ? <Counter person="Player A" /> : <Counter person="Player B" />}
    </div>
  );
}
```

The user clicks the counter a few times while `isPlayerA` is `true`, then a button flips `isPlayerA` to `false`. Does the displayed count reset to its initial value, or does it keep the accumulated count?

**CR2.**

```jsx
function Panel({ showNote }) {
  return (
    <div>
      {showNote && <Note />}
      <Counter />
    </div>
  );
}
```

`showNote` toggles from `false` to `true`. Before the toggle, `<Counter />` was the first child of `<div>`. After, `<Note />` is inserted above it, so `<Counter />` becomes the second child. Does `<Counter />`'s state persist across the toggle?

**CR3.**

```jsx
function EditForm({ record }) {
  return <Form key={record.id} initialValue={record.text} />;
}
```

The parent switches from `record = { id: 1, text: "Draft A" }` to `record = { id: 2, text: "Draft B" }`. What happens to any unsaved edits the user had typed for record 1? What would change about your answer if `key={record.id}` were deleted?

**CR4.**

```jsx
function Avatar({ src }) {
  return <img src={src} className="avatar" />;
}
```

`src` changes from `"/alice.png"` to `"/bob.png"`. QA reports that the old image stays visible for a beat while the new one loads, instead of a clean loading state. What single addition to this JSX would fix that, and why?

**CR5.**

```jsx
function App() {
  const [text, setText] = useState('');

  function InputBox() {
    return <input value={text} onChange={e => setText(e.target.value)} />;
  }

  return <InputBox />;
}
```

The user types "hi" into the input, one character at a time. Predict what happens after each keystroke, and explain why — even though `useState` itself is used correctly.

---

## 4. Debugging Exercises

*Each snippet has at least one intentional bug tied to the concepts above. Identify it (or them) and describe or write a fix.*

**D1.**

```jsx
function ChatApp() {
  const [message, setMessage] = useState('');

  function MessageBox() {
    return (
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    );
  }

  return (
    <div className="chat-app">
      <MessageBox />
    </div>
  );
}
```

**Symptom:** every keystroke causes the textarea to lose focus, so the user has to keep clicking back in to keep typing.

**D2.**

```jsx
function ShoppingList({ items, onRemove }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {item.name}
          <input type="checkbox" />
          <button onClick={() => onRemove(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}
```

**Symptom:** the user checks the box next to "Bananas," then removes "Apples" (listed above it). After the removal, the checkmark has jumped to a different item instead of staying on "Bananas."

**D3.**

```jsx
function ProfileEditor({ user }) {
  return <Form initialName={user.name} initialBio={user.bio} />;
}
```

**Symptom:** the app has a sidebar of users. Clicking from Alice's profile to Bob's profile leaves the form showing a confusing mix of Alice's half-typed edits and Bob's data, instead of a clean form for Bob. (Assume `Form` is an uncontrolled component that only reads its `initial*` props once, on mount.)

**D4.**

```jsx
function SearchResults({ results }) {
  return (
    <ul>
      {results.map(result => (
        <ResultCard key={Math.random()} result={result} />
      ))}
    </ul>
  );
}
```

**Symptom:** each `ResultCard` has its own "expand details" toggle. Every time the user types a character in the search box above (causing `SearchResults` to re-render with the *same* `results` array), every expanded card snaps back to collapsed — even though none of the underlying result data changed.

**D5.**

```jsx
function ReviewPanel({ isUrgent }) {
  const Wrapper = isUrgent ? 'section' : 'div';
  return (
    <Wrapper className={isUrgent ? 'urgent' : 'normal'}>
      <CommentBox />
    </Wrapper>
  );
}
```

**Symptom:** `CommentBox` keeps its own local draft state. Whenever a review flips between urgent and not-urgent (e.g., an SLA timer expires), any comment the user was mid-typing disappears — even though `CommentBox` itself never changed.

---

## 5. Implementation Exercises

*Write these from scratch, using the given starter as your only scaffolding.*

**I1.** Write a `<Scoreboard>` component that renders two `<PlayerCounter name="..." />` components side by side — one for "Player A," one for "Player B" — each with its own independent click-to-increment count. Clicking Player A's counter must never affect Player B's, and vice versa.

```jsx
function PlayerCounter({ name }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{name}: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

function Scoreboard() {
  // your code here
}
```

**I2.** Write `<EditableRecordForm records={records} activeId={activeId} />`, where `records` is an array of `{ id, text }` objects and `activeId` is the id currently being edited. The rendered form must reset to a clean local state every time `activeId` switches to a different record — even mid-edit, with unsaved text in the field.

```jsx
function Form({ initialText }) {
  const [text, setText] = useState(initialText);
  return <textarea value={text} onChange={e => setText(e.target.value)} />;
}

function EditableRecordForm({ records, activeId }) {
  // your code here — find the active record and render a Form for it
}
```

**I3.** Write `<ImageViewer src={url} />` so that it shows a `<Spinner />` in place of the image for exactly one render whenever `src` changes, rather than leaving the previous image on screen while the new one loads.

```jsx
function Photo({ src }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <Spinner />}
      <img
        src={src}
        onLoad={() => setLoaded(true)}
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </>
  );
}

function ImageViewer({ src }) {
  // your code here
}
```

---

## 6. Modification Exercises

*Extend or refactor the given working code to meet a new requirement.*

**M1.** The `<Tabs>` component below swaps between a Profile panel and a Settings panel using conditional rendering at the same JSX position. Right now, typing into the Settings input and then switching to Profile and back wipes whatever was typed. **Modify it** so switching tabs never loses either panel's in-progress input.

```jsx
function Tabs({ activeTab }) {
  return (
    <div>
      {activeTab === 'profile' ? <ProfilePanel /> : <SettingsPanel />}
    </div>
  );
}
```

**M2.** The `<UserList>` below correctly keys each row by a stable id. **Extend it** with a "Sort A–Z" button that re-sorts `users` alphabetically by name. Each `<UserRow>` has its own local "show details" toggle — after adding sorting, note (in a comment) why that per-row state will or won't survive a re-sort, and which part of the existing code makes that true.

```jsx
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <UserRow key={user.id} user={user} />
      ))}
    </ul>
  );
}
```

**M3.** The `<Wizard>` below moves through three steps, each with its own local input state defined inside the step component. By the time the user reaches Step 3, whatever they entered in Steps 1 and 2 is already gone — because each step component is unmounted the moment the wizard advances. **Modify the code** so all three steps' data survives to a final submit, without necessarily keeping all three step components mounted at once.

```jsx
function Step1() {
  const [name, setName] = useState('');
  return <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />;
}
function Step2() {
  const [email, setEmail] = useState('');
  return <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />;
}
function Step3({ onSubmit }) {
  return <button onClick={onSubmit}>Submit</button>;
}

function Wizard() {
  const [step, setStep] = useState(1);
  return (
    <div>
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 onSubmit={() => console.log('submitted')} />}
      <button onClick={() => setStep(step + 1)}>Next</button>
    </div>
  );
}
```

---

## 7. Edge Case Questions

*Boundary conditions and uncommon scenarios — these are where "I get the general idea" gets stress-tested.*

**E1.** Two sibling elements in the same list are accidentally given the identical `key` value. What does React do, and why is this a problem even if it doesn't throw a hard error?

**E2.** You change a component's `key`, but its type, position, and every other prop stay exactly the same. Does its rendered output change? Does its internal state change? Explain the distinction.

**E3.** Given:

```jsx
function PlayerCard({ playerId }) {
  return (
    <div>
      <Counter />
    </div>
  );
}
// rendered as <PlayerCard key={playerId} playerId={playerId} />
```

When `playerId` changes, does lifting `<Counter />`'s state up into `<PlayerCard>` actually preserve it? Why or why not?

**E4.** A list has no explicit `key` prop at all. After an item is deleted from the middle, every item below it shifts up by one index position. Can state still misattach to the wrong item, even though no one wrote `key={index}`? Explain.

**E5.** A component renders `null` on one pass and `<Counter />` (same type, same position) on the next — e.g. `{showCounter ? <Counter /> : null}` flipping from `false` to `true`. Is that treated as "the same component continuing" or "a component being freshly added"? What happens to its state, compared to a `<Counter />` that had been continuously rendered the whole time?

**E6.** Can two elements of completely different types ever end up sharing one state instance by occupying the same position across renders? Explain your answer in terms of the identity model.

---

## 8. Real-World Challenge: The Preserving Resetting State Challenge

*Combine multiple techniques into one realistic feature. Before coding, name which technique from this set addresses each requirement.*

**RW1. Turn-Based Scoreboard***Concepts combined: forcing a reset with `key` vs. lifting state up.*

Build `<TurnBasedScoreboard>` for a two-player game. Only one `<PlayerPanel>` (name, score, "+1" button) is ever rendered at a time, in a single JSX slot, toggled by a "Next Turn" button between Player A and Player B. Requirement: each player's score must be remembered correctly across turns — Player A's score must NOT reset just because it became Player B's turn and then became Player A's turn again.

Before writing code: if you give the single `<PlayerPanel>` a `key={currentPlayer}` to keep the two players visually distinct, does that alone satisfy the persistence requirement? Explain why or why not — then implement an approach that actually meets it.

```jsx
function PlayerPanel({ name, score, onScore }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Score: {score}</p>
      <button onClick={onScore}>+1</button>
    </div>
  );
}

function TurnBasedScoreboard() {
  // your code here
}
```

**RW2. Support Ticket Workspace***Concepts combined: stable keys in a reorderable list, `key`-forced form resets, and preserving state across a tab switch.*

Build `<TicketWorkspace tickets={tickets} />`, where each ticket is `{ id, subject, notes }`, meeting all three requirements at once:

1. A ticket list on the left, where clicking a ticket opens it on the right. The list can be re-sorted (e.g., by date or subject) without any per-row UI state (such as a "starred" toggle) jumping to the wrong ticket.
2. An editor on the right showing the selected ticket's notes in a text field, which resets cleanly to that ticket's saved notes — discarding any unsaved edits from the previously open ticket — whenever a different ticket is selected.
3. A "Notes" / "Activity" tab switcher *within* the open ticket's editor, where switching tabs and back never loses whatever the user was mid-typing in the Notes field.

Identify which technique addresses each requirement before you start coding, then implement the component.

---

*Want an answer key, worked explanations, or a harder variant of any section? Just ask.*