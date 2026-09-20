import { useEffect, useEffectEvent } from "react";

export function useInterval(callback: () => void, delay: number) {
  const runCallback = useEffectEvent(callback);

  useEffect(() => {
    const intervalId = setInterval(runCallback, delay);
    return () => {
      clearInterval(intervalId);
    };
  }, [delay]);
}
