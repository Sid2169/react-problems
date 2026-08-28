

## 1. Recall Questions

1. Name the five principles this lesson gives for structuring state well.
2. According to the lesson, when should you merge two separate state variables into one object instead of keeping them apart?
3. Fill in the blank: you should not put information into state if it can be ______ from props or existing state during rendering.
4. What's the problem with storing `isSending` and `isSent` as two separate boolean state variables?
5. What single state variable replaces `isSending`/`isSent` in the corrected version of the feedback form example?
6. True or False: `useState(initialColor)` will update the `color` state variable every time the parent passes a new `initialColor` prop.
7. In the "selection" pattern (menu, mail client), what should actually live in state — the selected object itself, or its ID?
8. What does it mean to "flatten" or "normalize" state, per the travel-plan example?
9. Per the DeepDive box, what naming convention signals that a prop is intentionally read only once, on the first render?

## 2. Conceptual Questions

1. The lesson compares avoiding redundant and duplicate state to database "normalization." Explain the analogy in your own words — what does a state variable duplicating data have in common with a denormalized database table?
2. "Avoid contradictions" and "avoid duplication" sound similar at first glance. Using the `isSending`/`isSent` example and the `selectedItem`/`items` example, explain how these are actually two distinct problems.
3. The lesson says mirroring a prop into state "only makes sense when you want to ignore all updates for a specific prop." Give a realistic scenario where you'd genuinely want that.
4. Why does storing `selectedId` instead of `selectedItem` fix the duplication problem, when both approaches let you display the exact same information on screen?
5. The Einstein paraphrase says to make state "as simple as it can be — but no simpler." What would "too simple" — over-reducing state — actually look like? Give an example of removing something from state that shouldn't have been removed.
6. Compare "redundant state" (Principle 3) and "deeply nested state" (Principle 5). Which one is about calculating something you don't need to store at all, and which is about the shape of something you do genuinely need to store?

## 3. Code Reading & Prediction

Spot which of the five principles is being violated before checking your reasoning.

**1.**

```jsx
function Rectangle() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(50);
  const [area, setArea] = useState(5000);

  function handleWidthChange(newWidth) {
    setWidth(newWidth);
    setArea(newWidth * height);
  }
}
```

Which state variable is redundant here, and what's the risk of keeping it?

**2.**

```jsx
function Profile({ userId }) {
  const [id, setId] = useState(userId);
  // parent later re-renders Profile with a different userId
}
```

Does `id` update to the new `userId`, or keep the original value? Why?

**3.**

```jsx
function Toggle() {
  const [isOn, setIsOn] = useState(false);
  const [isOff, setIsOff] = useState(true);

  function flip() {
    setIsOn(!isOn);
    setIsOff(!isOff);
  }

  function reset() {
    setIsOn(false);
    // isOff not updated here — teammate forgot
  }
}
```

After calling `reset()`, what combination of `isOn`/`isOff` becomes possible that shouldn't be?

**4.**

```jsx
function Cart() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Pen', qty: 2 },
    { id: 2, name: 'Notebook', qty: 1 },
  ]);
  const [totalItems, setTotalItems] = useState(3);
}
```

If `setProducts` removes the Pen entry, but nobody remembers to also update `totalItems`, what's now true about this component's state that shouldn't be possible?

**5.**

```jsx
const [user, setUser] = useState({
  name: 'Sid',
  address: { city: 'Deoghar', pincode: '814112' }
});

function updateCity(newCity) {
  user.address.city = newCity;
  setUser(user);
}
```

Will this actually trigger a visible update on screen? Think about what React compares, not just whether the underlying object technically changed somewhere in memory.

**6.** Hardest — trace a full duplication bug:

```jsx
function Board() {
  const [cards, setCards] = useState([
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Walk dog', done: false },
  ]);
  const [activeCard, setActiveCard] = useState(cards[0]);

  function toggleDone(id) {
    setCards(cards.map(c =>
      c.id === id ? { ...c, done: !c.done } : c
    ));
  }
}
```

You click to toggle card 1 ("Buy milk") done. Does `activeCard` reflect `done: true` afterward? Walk through why or why not, referencing what `activeCard` actually points to in memory.

## 4. Debugging Exercises

Each snippet has exactly one intentional bug, each tied to one of the five principles.

**1.**

```jsx
function DraggableBox() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  function handleDrag(newX, newY) {
    setX(newX);
    // developer forgot the y update here
  }
}
```

What did the developer forget, and how would grouping `x`/`y` into one `position` state object have made this specific class of mistake harder to write in the first place?

**2.**

```jsx
function UploadButton() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleUpload(file) {
    setIsUploading(true);
    try {
      await upload(file);
      setIsDone(true);
    } catch {
      setHasError(true);
    }
  }
}
```

After a failed upload, which two state variables end up `true` at the same time — and why does having three independent booleans make this easy to get wrong, compared to a single `status` field?

**3.**

```jsx
function ShoppingCart({ items }) {
  const [itemCount, setItemCount] = useState(items.length);

  function handleRemove(id) {
    const next = items.filter(i => i.id !== id);
    // assume `items` itself is updated correctly elsewhere
    setItemCount(next.length);
  }
}
```

Spot the redundant state — what should `itemCount` be replaced with, and why does the current version risk going out of sync even though `handleRemove` looks correct?

**4.**

```jsx
function Playlist({ songs }) {
  const [nowPlaying, setNowPlaying] = useState(songs[0]);

  function renameSong(id, newTitle) {
    // assume this correctly updates the songs state elsewhere
  }
}
```

If you rename the song that's currently playing, does `nowPlaying.title` reflect the new name afterward? Why or why not, and what should be stored in `nowPlaying`'s place to fix it for good?

**5.**

```jsx
function Avatar({ userId, initialUsername }) {
  const [username, setUsername] = useState(initialUsername);
}
```

The `initial` prefix is the real convention from this lesson — but is it being used *correctly* here, or is it just a naming trick papering over a mirrored-prop bug? What additional fact about this component's intended behavior would settle it either way?

## 5. Implementation Exercises

No solutions below — write and actually run these.

**1.** Write a `ColorPicker` using a single `color` state object holding `{ hue, saturation }`, both with sensible defaults, updated together through one `setColor` call whenever either value changes.

```jsx
function ColorPicker() {
  // your code here
  [color, setColor] = useState({}) //{ hue, saturation}
  
  function handleChangeColor(e) {
	  
  }
  
}
```

**2.** Write a `RequestStatus` component using one `status` state variable (`'idle' | 'loading' | 'success' | 'error'`) instead of three separate booleans. Include a `fetchData` function that transitions through the states correctly, including the error path.

```jsx
function RequestStatus() {
  // your code here
}
```

**3.** Write a `Roster` component with a `players` array in state (each `{ id, name, score }`) and no separate `totalScore` state — derive the total during render instead.

```jsx
function Roster() {
  // your code here
}
```

**4.** Write a `ContactList` with a `contacts` array and a `selectedId` (not a `selectedContact` object) in state. Include a function that returns the currently selected contact by looking it up from `contacts` at render time.

```jsx
function ContactList() {
  // your code here
}
```

## 6. Modification Exercises

**1.** Merge the two state variables below into one, since they always change together:

```jsx
function RangeSlider() {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);

  function setRange(newMin, newMax) {
    setMin(newMin);
    setMax(newMax);
  }
}
```

**2.** This form stores redundant state — refactor it so `isValid` is calculated during render instead of stored and manually kept in sync:

```jsx
function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);

  function handleEmailChange(e) {
    setEmail(e.target.value);
    setIsValid(e.target.value.includes('@') && password.length >= 8);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
    setIsValid(email.includes('@') && e.target.value.length >= 8);
  }
}
```

**3.** This comment tree is deeply nested — flatten it into a normalized `commentsById` shape, following the same pattern the lesson used for the travel plan:

```jsx
const initialComments = {
  id: 1,
  text: 'Great post!',
  replies: [
    { id: 2, text: 'Agreed!', replies: [] },
    { id: 3, text: 'Nice one', replies: [
      { id: 4, text: 'Thanks!', replies: [] }
    ]},
  ],
};
```

## 7. Edge Case Questions

1. Two state variables always change together in every case you can currently think of, but you're not fully sure they always will in the future. Do you merge them now, or wait? What do you actually lose either way?
2. `fullName` is derived from `firstName + ' ' + lastName` during render instead of stored. If a parent re-renders this component for an unrelated reason, does `fullName` get recomputed even though neither name changed — and does that actually matter?
3. `selectedId` is stored in state, but the item with that ID gets deleted from the `items` array (say, by another user's action synced in from a server). What does `items.find(item => item.id === selectedId)` return, and what does your UI need to handle as a result?
4. You're mirroring a prop into state on purpose, using the `initialColor` naming convention correctly. The parent component changes `initialColor` anyway, expecting the child to pick it up. Whose bug is this — the child component's, or the caller's?
5. A `Set` of `selectedIds` is used in state instead of an array, for fast `.has()` lookups. What's the one thing you must never do directly to a `Set` (or any object) held in state, even though plain JavaScript would technically allow it?
6. A piece of state could be calculated from other state plus props, but the calculation genuinely is expensive — say, it loops over 100,000 items every render. Does "avoid redundant state" still straightforwardly apply, or does this complicate the advice? (This lesson doesn't hand you the answer directly — reason it out from the principles you do have.)

## 8. Real-World Challenge

Build a `TaskBoard` component that combines everything above:

```jsx
function TaskBoard() {
  // your code here
}
```

- State: a single `tasks` array, each `{ id, title, status }`, where `status` is `'todo' | 'in-progress' | 'done'` — not three separate boolean flags per task.
- A `selectedId` (not a `selectedTask` object) tracking which task is open for editing.
- Derive `doneCount` and `totalCount` from `tasks` during render — don't store either.
- A `renameTask(id, newTitle)` function that uses `.map()` to produce a new array without mutation, and correctly updates the displayed title even when the renamed task is also the currently selected one — the "duplication" trap from this lesson, done right this time.
- One deliberate design decision to justify in a code comment: should `status` be a single field per task, or would `done: boolean` plus `inProgress: boolean` also have worked? Tie your answer back to Principle 2.

**Optional stretch:** add a `filterStatus` state variable (`'all' | 'todo' | 'in-progress' | 'done'`) and derive the filtered list during render — resist the temptation to also store a second `filteredTasks` array in state.

---

*No solutions included on purpose — this is built for retrieval practice. Ask anytime for an answer key or a walkthrough of any section once you've had a real attempt.*