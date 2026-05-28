import { useCallback, useEffect, useRef } from "react";

export function useIntersectionObserver(callback: (el: Element) => void) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const loaderRef = useCallback((element: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (element) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const target = entries[0];
          if (target?.isIntersecting) {
            callbackRef.current(target.target);
          }
        },
        { threshold: 0 }
      );
      observerRef.current.observe(element);
    }
  }, []);

  return loaderRef;
}
