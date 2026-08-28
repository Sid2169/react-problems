

## 1. Recall Questions

1. **The Core Trigger Distinction:** What is the fundamental difference in *why* an event handler executes compared to why an Effect executes?
2. **Defining Reactive Values:** What specific criteria qualify a variable inside a component as a "reactive value," and which three standard component elements automatically fall into this category?
3. **The Purpose of `useEffectEvent`:** What precise architectural problem does the `useEffectEvent` Hook solve when writing synchronization logic?
4. **Dependency Exclusion:** Why must functions wrapped in `useEffectEvent` be explicitly omitted from an Effect's dependency array?
5. **Structural Limitations:** What are the two strict structural boundaries regarding where you can declare, call, or pass an Effect Event?

## 2. Conceptual Questions

1. **The Hazard of Reactive Event Handlers:** Imagine a hypothetical version of React where event handlers were reactive—meaning an `onClick` handler would automatically re-execute whenever any state variable it read changed. Why would this paradigm completely destroy the user experience of an interactive application?
2. **The Stale Closure Mechanics:** A developer notices an Effect re-running too frequently because of a state variable in its dependency array. To stop the re-runs, they suppress the linter (`// eslint-disable-next-line react-hooks/exhaustive-deps`). Trace the exact mechanical sequence of how React's rendering engine processes this suppression, and explain why it guarantees a "stale closure" bug.
3. **Defining the "Event" Boundary:** When logging analytics inside an Effect, why is passing the triggering reactive variable as an argument (`onVisit(url)`) structurally superior to reading that same variable directly inside the `useEffectEvent` callback body?
4. **Breaking the Reactivity Chain:** Explain what it means to "break the chain" of reactivity between an Effect and a non-reactive piece of code. If you want non-reactive logic, why can't you simply declare a standard helper function outside the component file instead of using `useEffectEvent`?
5. **Custom Hook Encapsulation:** React strictly forbids passing an Effect Event as an argument into a custom Hook (e.g., `useTimer(onTick, 1000)`). What is the architectural reason for this limitation, and how must you restructure the custom Hook and component to achieve the same result safely?

## 3. Code Reading & Prediction

#### Exercise 3.1: Trigger Analysis

Analyze the code below. Predict the exact console output for the following chronological sequence of user actions:

1. The component mounts with `roomId = "general"`.
2. The user types `"Hello"` into the input field (changing `message`).
3. The user clicks the "Send" button.
4. The user changes the select dropdown to `roomId = "support"`.

JavaScript

```jsx
function ChatClient({ roomId }){
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log(`[Sync] Connecting to ${roomId}`);
    return () => console.log(`[Sync] Disconnecting from ${roomId}`);
  }, [roomId]);

  function handleSend(){
    console.log(`[Event] Sending "${message}" to ${roomId}`);
  }

  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </>
  );
}
```

#### Exercise 3.2: Async Effect Event Timing

Predict the console output if the user mounts the component with `page = "/home"`, and then **2 seconds later** (before the timer fires) navigates to `page = "/checkout"`, which updates the prop and increments `visitCount` to `2`.

JavaScript

```jsx
function PageTracker({ page, visitCount }){
  const onLog = useEffectEvent((triggeredPage) => {
    console.log(`Logged: ${triggeredPage} | Total Visits: ${visitCount}`);
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      onLog(page);
    }, 4000);

    return () => clearTimeout(timer);
  }, [page]);

  return <div>Current Page: {page}</div>;
}
```

#### Exercise 3.3: Linter Suppression Consequence

This component attempts to track mouse movement while allowing the user to freeze the tracking dot. Assuming the user checks the box to set `isFrozen` to `true` and then moves their mouse across the screen, will the dot stop moving? Explain the exact runtime behavior caused by the suppressed linter.

JavaScript

```jsx
function CursorTracker(){
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isFrozen, setIsFrozen] = useState(false);

  function handleMove(e){
    if (!isFrozen) {
      setPos({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <h1>Cursor: {pos.x}, {pos.y}</h1>;
}
```

## 4. Debugging Exercises

#### Exercise 4.1: The Stale Interval Trap

This timer is supposed to increment the counter every second by whatever value is currently set in `step`. Because the developer suppressed the linter to stop the timer from resetting every time the user changed the `step` input, the counter only ever increments by `1`. Fix this code using `useEffectEvent` so the timer never resets when `step` changes, but always increments by the latest `step` value.

JavaScript

```jsx
function StepTimer(){
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + step);
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>Count: {count}</h1>
      <input
        type="number"
        value={step}
        onChange={e => setStep(Number(e.target.value))}
      />
    </>
  );
}
```

#### Exercise 4.2: Misplaced Effect Event

A junior developer tried to use `useEffectEvent` to prevent unnecessary re-renders in a custom polling hook, but their implementation violates React's structural rules and throws errors. Identify the rule violations and refactor the code into a valid architecture.

JavaScript

```jsx
// 🔴 Bugged Implementation
function usePolling(url, onReceiveData){
  // Violation: Wrapping a callback inside a custom hook to pass around
  const handleData = useEffectEvent((data) => {
    onReceiveData(data);
  });

  useEffect(() => {
    const poller = startPolling(url, handleData);
    return () => poller.stop();
  }, [url]);
}

export default function LiveFeed({ url }){
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  // Violation: Passing an Effect Event into a custom hook
  const onNewData = useEffectEvent((data) => {
    if (filter === "all" || data.type === filter) {
      setItems(prev => [...prev, data]);
    }
  });

  usePolling(url, onNewData);

  return <div>Items: {items.length}</div>;
}
```

#### Exercise 4.3: The Theme Reconnection Bug

Whenever the user toggles between dark mode and light mode, the WebSocket connection drops and reconnects, clearing the active session. Refactor this component so that switching themes updates the notification style without breaking the active chat connection.

JavaScript

```jsx
function LiveChat({ serverUrl, roomId, theme }){
  useEffect(() => {
    const socket = connectSocket(serverUrl, roomId);

    socket.on('message', (msg) => {
      showToast(msg.text, { style: theme });
    });

    socket.connect();
    return () => socket.disconnect();
  }, [serverUrl, roomId, theme]);

  return <div>Active Room: {roomId}</div>;
}
```

## 5. Implementation Exercises

#### Exercise 5.1: Analytics Page View Tracker

Write a `PageViewer` component that takes `currentPath` (string), `userRole` (string), and `cartItemCount` (number) as props.

- When the `currentPath` changes, you must call `AnalyticsSDK.recordView(path, { role: userRole, cartItems: cartItemCount })`.
- If the user adds an item to their cart (changing `cartItemCount`) or if their `userRole` updates while remaining on the same page, **do not** record a new page view.
- When a path change *does* occur, the analytics ping must reliably send the freshest `userRole` and `cartItemCount`.

#### Exercise 5.2: Auto-Saving Form with Live Diagnostics

Create a `DraftEditor` component that accepts `docId` and `content` as props.

- Implement an auto-save mechanism that calls `saveDraft(docId, content, lastErrorCode)` every 10 seconds using `setInterval`.
- Read a `lastErrorCode` state variable from an external error-tracking hook (`useDiagnostics()`).
- Ensure that typing new `content` or receiving a new `lastErrorCode` does **not** reset the 10-second timer interval.
- The timer must only tear down and restart if the `docId` prop changes.

#### Exercise 5.3: Window Resize Telemetry

Write a `ResponsiveCanvas` component that takes a `layoutMode` prop (`"grid"` or `"list"`).

- Attach an event listener to `window.addEventListener('resize', ...)` when the component mounts.
- When the window resizes, calculate the new width and call `Telemetry.logResize(window.innerWidth, layoutMode)`.
- Ensure that changing the `layoutMode` prop does not remove and re-attach the window resize event listener, while guaranteeing the telemetry ping always logs the active layout mode.

## 6. Modification Exercises

#### Exercise 6.1: Removing Linter Suppressions

Refactor the following component to eliminate the suppressed linter warning without causing the audio stream to disconnect and reconnect whenever the user toggles the mute button.

JavaScript

```jsx
function AudioPlayer({ streamUrl }){
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    const audioStream = connectStream(streamUrl);

    audioStream.onData((audioBuffer) => {
      if (!isMuted) {
        playBuffer(audioBuffer, volume);
      }
    });

    return () => audioStream.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamUrl]);

  return (
    <button onClick={() => setIsMuted(!isMuted)}>
      {isMuted ? "Unmute" : "Mute"}
    </button>
  );
}
```

#### Exercise 6.2: Separating User Interaction from Sync

This component incorrectly uses state and an Effect to handle a form submission that should be driven entirely by a user interaction event. Refactor the component to eliminate the `shouldSubmit` state and the `useEffect` entirely, moving the submission logic into a clean event handler.

JavaScript

```jsx
function CheckoutForm({ cart, userId }){
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  useEffect(() => {
    if (shouldSubmit) {
      setIsSubmitting(true);
      api.submitOrder({ cart, userId }).then(() => {
        setIsSubmitting(false);
        setShouldSubmit(false);
      });
    }
  }, [shouldSubmit, cart, userId]);

  return (
    <button disabled={isSubmitting} onClick={() => setShouldSubmit(true)}>
      Confirm Purchase
    </button>
  );
}
```

#### Exercise 6.3: Custom Hook Refactoring

The parent component passes an inline arrow function (`onMessage`) into a custom hook. Because inline functions are new reactive references on every render, the WebSocket connection continuously drops and reconnects. Refactor the `useSocket` custom hook using `useEffectEvent` so that consumers can pass inline arrow functions without causing reconnection loops.

JavaScript

```jsx
// Refactor this custom hook
function useSocket(url, onMessage){
  useEffect(() => {
    const socket = new WebSocket(url);
    socket.onmessage = (event) => {
      onMessage(JSON.parse(event.data));
    };
    return () => socket.close();
  }, [url, onMessage]); // onMessage causes infinite reconnects
}

// Do NOT modify this component; make the hook support this usage
export default function LiveTicker({ symbol }){
  const [price, setPrice] = useState(null);

  useSocket(`wss://ticker.com/${symbol}`, (data) => {
    setPrice(data.price);
  });

  return <div>Price: {price}</div>;
}
```

## 7. Edge Case Questions

1. **Historical vs. Latest State in Async Effects:** If an Effect initiates an asynchronous network request that takes 5 seconds to resolve, and upon resolution calls an Effect Event to log the result along with a prop like `selectedCategory`, explain the difference between reading `selectedCategory` directly inside the Effect Event versus passing it into the Effect Event as an argument from the Effect's setup block (`onComplete(data, selectedCategory)`).
2. **Multiple Effect Events:** Is there any performance penalty or behavioral risk when declaring multiple distinct `useEffectEvent` hooks inside a single component to serve different Effects? How does React maintain their non-reactive identity across render cycles?
3. **Module-Scope Variables:** If a configuration object or callback is declared at the top-level module scope (outside the React component function entirely), why does reading it inside an Effect not trigger a linter warning, and why is `useEffectEvent` unnecessary for it?

## 8. Real-World Challenge: s

#### Challenge 8.1: Real-Time Financial Ticker with Dynamic Alerts

Build a production-grade `StockTicker` component for a financial trading dashboard.

- **Input Props:** `symbol` (string, e.g., `"AAPL"`), `alertThreshold` (number), and `soundEnabled` (boolean).
- **Requirements:**
    1. Synchronize an external WebSocket feed (`TickerAPI.subscribe(symbol)`). The SDK returns an object with an `.onPrice(callback)` method and a `.close()` method.
    2. When `symbol` changes, the active WebSocket must close and re-subscribe to the new ticker symbol.
    3. When prices arrive via `.onPrice`, update a local `currentPrice` state variable.
    4. **Critical:** If an incoming price exceeds `alertThreshold`, call `triggerAlert(symbol, price)`. If `soundEnabled` is true, also call `playAlertChime()`.
    5. Changing the `alertThreshold` or toggling `soundEnabled` must **never** cause the WebSocket connection to close and reconnect, as dropping the socket risks missing critical market ticks.
    6. Your solution must achieve zero linter warnings without using `// eslint-disable`.

JavaScript

```jsx
// Starter Code
export default function StockTicker({ symbol, alertThreshold, soundEnabled }){
  const [currentPrice, setCurrentPrice] = useState(null);

  // Architect your decoupled reactivity here
}
```

#### Challenge 8.2: Resilient Hardware Telemetry Hook

Design a reusable custom hook named `useGamepadTelemetry` that bridges raw browser hardware events with React application state.

- **Hook Signature:** `useGamepadTelemetry(gamepadIndex, onButtonPress, onJoystickMove)`
- **Requirements:**
    1. Set up a browser polling loop or listener that monitors the connected gamepad at `gamepadIndex`.
    2. When a hardware button press is detected, execute the consumer's `onButtonPress(buttonId, timestamp)` callback.
    3. When joystick axis movement is detected, execute the consumer's `onJoystickMove(coordinates)` callback.
    4. **Critical:** Consumers of this hook will likely pass unstable inline arrow functions for `onButtonPress` and `onJoystickMove`. Your hook must guarantee that changing these callback functions never tears down and restarts the hardware monitoring loop.
    5. The monitoring loop must only reset if `gamepadIndex` changes.
    6. You must strictly obey the structural limitations of Effect Events (do not expose or leak them outside the hook boundary).

JavaScript

```jsx
// Starter Code
export function useGamepadTelemetry(gamepadIndex, onButtonPress, onJoystickMove){
  // Implement resilient hook architecture here
}
```