# Lifecycle of Reactive Effects

> **Reference:** [React Docs](https://react.dev/learn/lifecycle-of-reactive-effects)

## 1. Recall Questions

1. How does a component lifecycle (mount -> update -> unmount) differ from an Effect's lifecycle (start synchronizing -> stop synchronizing)?
2. What are "reactive values" in React (props, state, and variables declared inside the component body)?
3. Why must every reactive value read inside an Effect be included in its dependency array?
4. What happens when a reactive dependency changes between renders?
5. Why are global variables or values declared outside the component body non-reactive?

## 2. Conceptual Questions

1. Explain why Effects synchronize independently of component mount/unmount lifecycles.

## 3. Code Reading & Prediction

### Exercise 3.1: Reactive Dependency Trace

```jsx
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  return <h1>Welcome to {roomId}!</h1>;
}
```

- **Task:** Trace what happens when `roomId` changes from `"general"` to `"travel"`.

## 4. Debugging Exercises

### Exercise 4.1: Missing Reactive Dependency

```jsx
// Buggy Code
export function Timer({ delay }) {
  useEffect(() => {
    const id = setInterval(() => {
      console.log("Tick every", delay);
    }, delay);
    return () => clearInterval(id);
  }, []); // Missing `delay` dependency!
}
```

- **Task:** Fix the dependency array to include `delay` so changing props updates the timer interval.

## 5. Implementation Exercises

### Exercise 5.1: Synchronized Room Connection

Write a `ConnectionManager` component with `roomId` prop that logs connection synchronization steps inside `useEffect`.

## 6. Modification Exercises

### Exercise 6.1: Separating Non-Reactive Logic

Move non-reactive helper variables outside component scope to avoid unnecessary Effect synchronizations.

## 7. Edge Case Questions

1. What happens if an Effect reads a reactive state variable but omits it from the dependency array?

## 8. Real-World Challenge: Reactive Chat Room Synchronization

Build a `ReactiveChatRoom` component with interactive room switcher that connects and disconnects cleanly.

```jsx
export default function ReactiveChatRoom() {
  const [roomId, setRoomId] = useState('general');

  useEffect(() => {
    console.log(`[Effect] Connecting to room: ${roomId}`);
    return () => {
      console.log(`[Cleanup] Disconnecting from room: ${roomId}`);
    };
  }, [roomId]);

  return (
    <div style={{ padding: '20px', background: '#1e293b', color: '#fff', borderRadius: '8px' }}>
      <h2>Active Room: {roomId}</h2>
      <button onClick={() => setRoomId('general')}>General</button>
      <button onClick={() => setRoomId('sports')}>Sports</button>
      <button onClick={() => setRoomId('music')}>Music</button>
    </div>
  );
}
```
