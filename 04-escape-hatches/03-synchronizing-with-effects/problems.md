

## 1. Recall Questions

- **Problem 1.1:** Differentiate between *Rendering code*, *Event handlers*, and *Effects* in terms of what triggers them and whether they are allowed to contain side effects.
- **Problem 1.2:** Describe the three distinct behaviors of `useEffect` based on its second argument:
    1. `useEffect(() => {})` (no dependency array)
    2. `useEffect(() => {}, [])` (empty dependency array)
    3. `useEffect(() => {}, [a, b])` (dependency array with values)
- **Problem 1.3:** Why does React intentionally execute Effects twice (setup $\rightarrow$ cleanup $\rightarrow$ setup) on initial mount when running in Development Mode under `<React.StrictMode>`?
- **Problem 1.4:** Why can stable values like setter functions returned by `useState` or reference objects returned by `useRef` be safely omitted from an Effect's dependency array?

## 2. Conceptual Questions

- **Problem 2.1:** Explain why calling an imperative API method (such as `HTMLVideoElement.play()` or `HTMLDialogElement.showModal()`) directly within the component function body during rendering violates React's core principles and can cause runtime errors.
- **Problem 2.2:** When fetching data inside an Effect, network responses can arrive out of order if a prop or state variable changes quickly. Explain how returning a cleanup function with a local boolean flag (`let ignore = false;`) solves this race condition.
- **Problem 2.3:** A developer attempts to stop an Effect from running twice in development by setting `hasRun.current = true` inside a ref. Explain why this "fix" is an anti-pattern and what real-world bug it hides when a user navigates away from and back to the page.

## 3. Code Reading & Prediction

### Problem 3.1: The Infinite Rendering Spiral

Study the component below. Trace what happens during component execution, rendering, and post-commit layout updates.



```JavaScript
import { useState, useEffect } from 'react';

export default function AnalyticsTracker(){
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    // Attempting to record a view metric
    setVisitorCount(visitorCount + 1);
  });

  return <h1>Total Recorded Views: {visitorCount}</h1>;
}
```

**Predict the output:**

1. What error or runtime behavior will occur when this component mounts in the browser?
2. Detail the exact cycle of steps leading to this outcome.

### Problem 3.2: The Ghost Socket Connection

Analyze the following component structure designed to manage chat rooms:



```JavaScript
import { useState, useEffect } from 'react';

function createSocketConnection(roomId){
  return {
    connect: () => console.log(`[CONNECT] Connected to room: ${roomId}`),
    disconnect: () => console.log(`[DISCONNECT] Left room: ${roomId}`)
  };
}

export default function ChatWidget({ roomId }){
  useEffect(() => {
    const socket = createSocketConnection(roomId);
    socket.connect();
  }, []); // Note the empty dependency array

  return <div>Active Room: {roomId}</div>;
}
```

**Predict the output:**

1. The component mounts with `roomId = "general"`. What gets logged to the console?
2. The parent component updates the prop to `roomId = "vip"`. What gets logged to the console?
3. The component unmounts. What gets logged to the console?
4. Identify the structural flaw in this implementation.

## 4. Debugging Exercises

### Problem 4.1: The Memory-Leaking Resize Listener

The component below monitors screen size updates. However, after navigating between pages multiple times, the application suffers from severe memory leaks and performance degradation.

Locate the bug, explain why it leaks memory, and rewrite the component using proper cleanup semantics.



```JavaScript
import { useState, useEffect } from 'react';

export default function WindowSizeMonitor(){
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize(){
      setWindowWidth(window.innerWidth);
    }

    // Subscribing to window event
    window.addEventListener('resize', handleResize);
  }, []);

  return <div>Viewport Width: {windowWidth}px</div>;
}
```

### Problem 4.2: The Suppressed Dialog Error

A developer created a modal dialog synchronization component. To stop React StrictMode from throwing an error (`InvalidStateError: The element is already open`), they added a ref guard to suppress the second execution.

Identify why this approach fails when the component unmounts naturally, and refactor the code to use standard setup/cleanup synchronization without ref guards.



```JavaScript
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }){
  const dialogRef = useRef(null);
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    // Buggy Workaround: Using refs to bypass StrictMode double-execution
    if (!hasExecutedRef.current) {
      hasExecutedRef.current = true;
      if (isOpen) {
        dialogRef.current.showModal();
      }
    }
  }, [isOpen]);

  return <dialog ref={dialogRef}>{children}</dialog>;
}
```

## 5. Implementation Exercises

### Problem 5.1: Race-Condition Safe Live Search Input

Create a search component that queries an external API as the user types.

- **Requirements:**
    1. Fetch data from `https://api.example.com/search?q=${query}` inside a `useEffect` hook when `query` changes.
    2. Use an `ignore` flag inside the cleanup function (or an `AbortController`) to ensure late-arriving responses from previous requests do not overwrite newer search results.
    3. Do not fire a network request if `query` is an empty string `""` (reset results to an empty array instead).



```JavaScript
// Starter Code
import { useState, useEffect } from 'react';

export default function LiveSearch(){
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    // TODO: Implement race-condition safe data fetching logic here
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type to search..."
      />
      <ul>
        {results.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 6. Modification Exercises

### Problem 6.1: Synchronizing Video Playback with External State Controls

The following `<ControlledVideoPlayer>` component receives an `isPlaying` prop and a `volume` prop (number between `0` and `1`).

- **Tasks:**
    1. Refactor the component to synchronize `isPlaying` using `useEffect` with appropriate dependencies.
    2. Add a second Effect (or expand the existing one correctly) to synchronize the HTML video element's `.volume` property whenever the `volume` prop changes.
    3. Ensure `play()` promises are handled safely if the user toggles states rapidly.



```JavaScript
// Starter Code - Refactor and Complete
import { useState, useRef, useEffect } from 'react';

function ControlledVideoPlayer({ src, isPlaying, volume }){
  const videoRef = useRef(null);

  // TODO: Implement synchronization logic for playback and volume controls

  return (
    <video
      ref={videoRef}
      src={src}
      width="400"
      playsInline
    />
  );
}

export default function VideoConsole(){
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  return (
    <div>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
      <ControlledVideoPlayer
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        isPlaying={isPlaying}
        volume={volume}
      />
    </div>
  );
}
```

## 7. Edge Case Questions

- **Problem 7.1:** If you pass an inline object or inline array directly into a dependency array (e.g., `useEffect(() => {}, [{ id: 1 }])`), what happens on every re-render of the parent component? Explain how React evaluates dependency changes under the hood (`Object.is`).
- **Problem 7.2:** Why is triggering an analytics event (e.g., `"BUY_BUTTON_CLICKED"`) inside a `useEffect` hook upon state mutation considered an anti-pattern compared to placing it inside the button's `onClick` event handler? Conversely, when *is* an analytics log appropriate inside an Effect?

## 8. Real-World Challenge: The Synchronizing With Effects Challenge

### The Dynamic Live Telemetry Monitor Dashboard

You are tasked with building a real-time server diagnostics component that connects to a remote telemetry stream via WebSockets or long polling subscriptions.

```
┌─────────────────────────────────────────────────────────┐
│               [ Telemetry Monitor Panel ]               │
├─────────────────────────────────────────────────────────┤
│ Active Channel: [ Server #1 (us-east) ] [ Server #2 ]   │
├─────────────────────────────────────────────────────────┤
│ Status: 🟢 CONNECTED TO server-us-east                  │
│ Logs received:                                          │
│  - [10:00:01] CPU Usage: 42%                            │
│  - [10:00:03] Memory Allocation: 1.2GB                  │
└─────────────────────────────────────────────────────────┘
```

#### Specifications:

1. **Connection Lifecycle:** The component receives a `serverId` prop. When `serverId` changes, the component must disconnect from the previous server channel and establish a connection to the new server channel.
2. **Strict Mode Resilience:** Under development mode, mounting the monitor component must gracefully establish, tear down, and re-establish the connection without leaving dangling duplicate listeners or open connections.
3. **Stale Telemetry Suppression:** If a network lag causes logs from `server-1` to arrive *after* the user switched to `server-2`, those incoming logs must be discarded.
4. **Buffer Reset:** When `serverId` changes, clear the current displayed log buffer so metrics from different servers are never mixed.



```JavaScript
// Starter Skeleton
import { useState, useEffect } from 'react';

// Mock telemetry API provider
function connectToTelemetryStream(serverId, onMessage){
  console.log(`📡 [CONNECTING] Stream opening for ${serverId}...`);

  const intervalId = setInterval(() => {
    onMessage(`Metrics snapshot from ${serverId} at ${new Date().toLocaleTimeString()}`);
  }, 2000);

  return {
    unsubscribe: () => {
      console.log(`🔌 [DISCONNECTED] Stream closed for ${serverId}`);
      clearInterval(intervalId);
    }
  };
}

export default function TelemetryDashboard(){
  const [selectedServer, setSelectedServer] = useState('server-us-east');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // TODO: 1. Clear previous logs when server changes
    // TODO: 2. Connect to telemetry stream safely
    // TODO: 3. Ensure cleanup unsubscribes on unmount or prop change
  }, [selectedServer]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div>
        <button onClick={() => setSelectedServer('server-us-east')}>Server US-East</button>
        <button onClick={() => setSelectedServer('server-eu-west')}>Server EU-West</button>
      </div>

      <h3>Active Stream Target: {selectedServer}</h3>

      <div style={{ background: '#1e1e1e', color: '#00ff00', padding: '15px', borderRadius: '5px' }}>
        <h4>Live Log Output:</h4>
        {logs.length === 0 && <p>No logs available for this target...</p>}
        {logs.map((log, idx) => (
          <div key={idx}>{log}</div>
        ))}
      </div>
    </div>
  );
}
```