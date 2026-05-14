import { useEffect, useRef } from "react";

export function useIntersectionObserver(callback: () => void) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target && target.isIntersecting) {
          callback();
        }
      },
      { threshold: 0.1 }
    );

    const loaderElement = loaderRef.current;
    if (loaderElement) {
      observer.observe(loaderElement);
    }

    return () => {
      if (loaderElement) {
        observer.unobserve(loaderElement);
      }
    };
  }, [callback]);

  return loaderRef;
}
