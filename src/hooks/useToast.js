import { useState, useCallback, useRef } from "react";

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const addToast = useCallback((title, message, duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, title, message }]);

    timers.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timers.current[id];
    }, duration);

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  return { toasts, addToast, dismissToast };
}
