import { useEffect, useState } from "react";

type Atom<Value = unknown> = { init: () => Value };
type AtomState<Value = unknown> = {
  value: Value;
  listeners: Set<() => void>;
};

export const atom = <Value = unknown>(value: Value): Atom<Value> => {
  return {
    init: () => value,
  };
};

const atomStateMap = new WeakMap<Atom, AtomState>();

export const getAtomState = <Value>(atom: Atom<Value>): AtomState<Value> => {
  const value = atomStateMap.get(atom) as AtomState<Value> | undefined;
  // 如果 map 中不存在 atom 对应的状态，就设置为初始值。
  if (value === undefined) {
    const state = {
      listeners: new Set<() => void>(),
      value: atom.init(),
    };
    atomStateMap.set(atom, state);
    return state;
  }
  // 如果存在，就返回这个值。
  return value;
};

export const useAtom = <Value>(atom: Atom<Value>) => {
  const [value, setValue] = useState(getAtomState(atom).value);

  useEffect(() => {
    const atomState = getAtomState(atom);
    const listener = () => {
      setValue(getAtomState(atom).value);
    };
    atomState.listeners.add(listener);

    return () => {
      atomState.listeners.delete(listener);
    };
  }, [atom]);

  const setAtomValue = (value: Value) => {
    const atomState = getAtomState(atom);
    atomState.value = value;
    atomState.listeners.forEach((listener) => listener());
  };

  return [value, setAtomValue] as const;
};
