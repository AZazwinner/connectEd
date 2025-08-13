import { useEffect, useRef, useState } from 'react';

// This hook takes a ref to an element and returns whether it's currently visible.
export const useIntersectionObserver = <T extends HTMLElement = HTMLElement>(): [React.RefObject<T>, boolean] => {
  const elementRef = useRef<T>(null) as React.RefObject<T>;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Clean up the previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create a new observer
    observer.current = new IntersectionObserver(([entry]) => {
      // If the element is intersecting (visible)
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        // We only want to trigger this once, so we unobserve the element
        if (elementRef.current) {
          observer.current?.unobserve(elementRef.current);
        }
      }
    }, {
      // Options: trigger when the element is 10% visible
      threshold: 0.1, 
    });

    // Start observing the element
    if (elementRef.current) {
      observer.current.observe(elementRef.current);
    }

    // Cleanup on component unmount
    return () => {
      observer.current?.disconnect();
    };
  }, [elementRef]);

  return [elementRef, isIntersecting];
};