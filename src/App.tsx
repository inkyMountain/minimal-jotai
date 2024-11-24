import { useMemo, useReducer, useRef } from "react";
import "./App.css";
import { atom, useAtom } from "./jotai";

const countAtom = atom(0);

function App() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div className="list">
      <div
        className="first"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +1
      </div>
      <div>count: {count}</div>

      <Child />
    </div>
  );
}

const Child = () => {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <div>child count: {count}</div>
      <div
        onClick={() => {
          setCount(count + 1);
        }}
      >
        setCount
      </div>
    </div>
  );
};

export default App;
