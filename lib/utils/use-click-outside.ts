import { useState, useRef, useEffect } from 'react';

export function useClickOutside() {
  const ref = useRef<HTMLElement>(null);

  const [state, setState] = useState({
    hasClickedOutside: false,
  });

  function handleEvent(e: MouseEvent | PointerEvent) {
    /* istanbul ignore else  */
    if (ref && ref.current) {
      if (ref.current.contains(e.target as Node)) {
        setState({ hasClickedOutside: false });
      } else {
        setState({ hasClickedOutside: true });
      }
    }
  }

  useEffect(() => {
    if (window.PointerEvent) {
      document.addEventListener('pointerdown', handleEvent);
    } else {
      document.addEventListener('mousedown', handleEvent);
    }

    return () => {
      if (window.PointerEvent) {
        document.removeEventListener('pointerdown', handleEvent);
      } else {
        document.removeEventListener('mousedown', handleEvent);
      }
    };
  }, []);

  return [ref, state.hasClickedOutside];
}
