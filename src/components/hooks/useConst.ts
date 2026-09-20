import { useRef } from "react";

type InitFn<T> = () => T;

export function useConst<T>(init: InitFn<T>): T {
  const constRef = useRef<T | undefined>(undefined);

  if (constRef.current === undefined) {
    constRef.current = init();
  }

  return constRef.current;
}
