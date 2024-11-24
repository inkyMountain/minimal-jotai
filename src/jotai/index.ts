import { useEffect, useState } from "react";

type Atom<Value = unknown> = {
  init: Value;
};
type AtomState<Value = unknown> = {
  value: Value;
  listeners: Set<(value: Value) => void>;
};

export const atom = <Value>(initialValue: Value): Atom<Value> => {
  return {
    init: initialValue,
  };
};

const atomStateMap = new WeakMap();
const getAtomState = <Value>(atom: Atom<Value>) => {
  const atomState = atomStateMap.get(atom) as AtomState<Value>;
  if (atomState !== undefined) {
    return atomState;
  }
  const state: AtomState<Value> = {
    listeners: new Set(),
    value: atom.init,
  };
  atomStateMap.set(atom, state);
  return state;
};

export const useAtom = <Value>(atom: Atom<Value>) => {
  const atomState = getAtomState(atom);
  const [state, setState] = useState<Value>(atomState.value);

  useEffect(() => {
    const listener = (value: Value) => {
      console.log("listener runs ==>", value);
      setState(value);
    };
    atomState.listeners.add(listener);
    return () => {
      atomState.listeners.delete(listener);
    };
  }, [atomState]);

  const setAtomValue = (value: Value) => {
    console.log("value ==========>", value);
    atomState.listeners.forEach((listener) => {
      listener(value);
    });
  };

  return [state, setAtomValue] as const;
};
