import React, { useState, useEffect } from 'react';

/**
 * -------------------------------------------------------------------
 * Solution for 03-managing-state/02-structuring-state
 * -------------------------------------------------------------------
 */

// Written Answers (Recall, Conceptual, Code Reading, Edge Cases)
export const answers = {
  recall: {
    q1: "group related states, avoid impossible states, avoid redundant state, avoid duplicating state, avoid deeply nested states", 
    q2: "when the states are related ", 
    q3: "", 
    q4: "", 
    q5: ""
  },
  conceptual: {
    q1: "", q2: ""
  },
  edgeCase: {
    q1: "Merge them now, if merged I loose simplicity and if not I loose code predictability"
  }, 

};

/**
 * Exercise Block 1: Rectangle
 */
export function Rectangle() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(50);
  const [area, setArea] = useState(5000);

  function handleWidthChange(newWidth) {
    setWidth(newWidth);
    setArea(newWidth * height);
  }
}

/**
 * Exercise Block 2: Profile
 */
export function Profile({ userId }) {
  const [id, setId] = useState(userId);
  // parent later re-renders Profile with a different userId
}

/**
 * Exercise Block 3: Toggle
 */
export function Toggle() {
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

/**
 * Exercise Block 4: Cart
 */
export function Cart() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Pen', qty: 2 },
    { id: 2, name: 'Notebook', qty: 1 },
  ]);
  const [totalItems, setTotalItems] = useState(3);
}

/**
 * Exercise Block 5: Board
 */
export function Board() {
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

/**
 * Exercise Block 6: DraggableBox
 */
export function DraggableBox() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  function handleDrag(newX, newY) {
    setX(newX);
    // developer forgot the y update here
  }
}

/**
 * Exercise Block 7: UploadButton
 */
export function UploadButton() {
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

/**
 * Exercise Block 8: ShoppingCart
 */
export function ShoppingCart({ items }) {
  const [itemCount, setItemCount] = useState(items.length);

  function handleRemove(id) {
    const next = items.filter(i => i.id !== id);
    // assume `items` itself is updated correctly elsewhere
    setItemCount(next.length);
  }
}

/**
 * Exercise Block 9: Playlist
 */
export function Playlist({ songs }) {
  const [nowPlaying, setNowPlaying] = useState(songs[0]);

  function renameSong(id, newTitle) {
    // assume this correctly updates the songs state elsewhere
  }
}

/**
 * Exercise Block 10: Avatar
 */
export function Avatar({ userId, initialUsername }) {
  const [username, setUsername] = useState(initialUsername);
}

/**
 * Exercise Block 11: ColorPicker
 */
export function ColorPicker() {
  // your code here
   const [color, setColor] = useState({
    hue: 180,
    saturation: 50,
  });

  function handleChangeColor(e) {
    const { name, value } = e.target;

    setColor({
      ...color,
      [name]: value,
    });
  }

  return (
    <div>
      <label>
        Hue:
        <input
          type="range"
          name="hue"
          min="0"
          max="360"
          value={color.hue}
          onChange={handleChangeColor}
        />
        {color.hue}
      </label>

      <label>
        Saturation:
        <input
          type="range"
          name="saturation"
          min="0"
          max="100"
          value={color.saturation}
          onChange={handleChangeColor}
        />
        {color.saturation}%
      </label>
    </div>
  );
  
}

/**
 * Exercise Block 12: RequestStatus
 */
export function RequestStatus() {
  // your code here
  const [status, setStatus] = useState('idle');

  async function fetchData() {
    setStatus('loading');
    
    try {
      const response = await fetch("https://example.com/api/data");

      if(!response.ok) {
        throw new Error("Request Failed");
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <div>
      <button onClick={fetchData}>
        Fetch Data
      </button>
      {status === "idle" && <p>Ready to fetch</p>}
      {status === "loading" && <p>Loading...</p>}
      {status === "success" && <p>Success!</p>}
      {status === "error" && <p>Something went wrong.</p>}
    </div>
    
  )
}

/**
 * Exercise Block 13: Roster
 */
export function Roster() {
  const [players, setPlayers] = useState([
    { id: 1, name: "Alpha", score: 100 },
    { id: 2, name: "Beta", score: 95 },
    { id: 3, name: "Gamma", score: 75 },
  ]);

  const totalScore = players.reduce(
    (sum, player) => sum + player.score,
    0
  );

  return (
    <section>
      <h2>Roster</h2>

      {players.map((player) => (
        <div key={player.id}>
          {player.name}: {player.score}
        </div>
      ))}

      <strong>Total Score: {totalScore}</strong>
    </section>
  );
}

/**
 * Exercise Block 14: ContactList
 */
export function ContactList() {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Amit Kumar", contact: "123-456-789" },
    { id: 2, name: "Manish Chauhan", contact: "312-654-987" }
  ]);

  const [selectedId, setSelectedId] = useState(1);

  function getSelectedContact() {
    return contacts.find(contact => contact.id === selectedId);
  }

  return (
    <div>
      <h2>All Contacts</h2>

      <ol>
        {contacts.map(contact => (
          <li key={contact.id}>
            {`Name: ${contact.name} Contact: ${contact.contact}`}
            <button onClick={() => setSelectedId(contact.id)}>
              Select
            </button>
          </li>
        ))}
      </ol>

      <hr />
      <strong>Selected Contact: </strong>

      <p>
         {getSelectedContact().name}:{" "}
        {getSelectedContact().contact}
      </p>
    </div>
  );
}

/**
 * Exercise Block 15: RangeSlider
 */
export function RangeSlider() {
  const [range, setRange] = useState({ min: 0, max: 100 });

  const [selectedValue, setSelectedValue] = useState(
    Math.floor((range.max - range.min) / 2 + range.min)
  );

  function onChangeRange(newMin = range.min, newMax = range.max) {
    if (newMin > newMax) {
      alert("Minimum cannot be greater than max");
      return;
    }

    setRange({
      min: newMin,
      max: newMax
    });

    setSelectedValue(
      Math.floor((newMax - newMin) / 2 + newMin)
    );
  }

  return (
    <div>
      <p>
        {range.min} - {range.max}
      </p>

      <input
        type="range"
        min={range.min}
        max={range.max}
        onChange={(e) => setSelectedValue(Number(e.target.value))}
        value={selectedValue}
      />

      <p>Selected Value: {selectedValue}</p>

      <div>
        <p>
          <strong>Change Range:</strong>
        </p>

        <label htmlFor="changeMin">
          Set New Minimum:
        </label>

        <input id="changeMin" type="number" />

        <button
          onClick={() => {
            onChangeRange(
              Number(document.getElementById("changeMin").value)
            );
          }}
        >
          Set
        </button>

        <br />

        <label htmlFor="changeMax">
          Set New Maximum:
        </label>

        <input id="changeMax" type="number" />

        <button
          onClick={() => {
            onChangeRange(
              range.min,
              Number(document.getElementById("changeMax").value)
            );
          }}
        >
          Set
        </button>
      </div>
    </div>
  );
}

/**
 * Exercise Block 16: SignupForm
 */
export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValid = email.includes("@") && password.length >= 8;

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  return (
    <form>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />

      <button disabled={!isValid}>Sign Up</button>
    </form>
  );
}

const initialComments = [
  { id: 1, text: 'Great Post', replyIds: [2, 3]},
  { id: 2, text: 'Agreed!', replyIds: [] },
  { id: 3, text: 'Nice one', repyIds: [4]},
  { id: 4, text: 'Thanks!', replyIds: [] }

]

/**
 * Exercise Block 17: TaskBoard
 */
export default function TaskBoard() {
  // your code here
}

