import { useState, useCallback, useEffect, useRef } from 'react';

export const useScrollAnimation = (threshold = 0.7) => {
  const [isActive, setIsActive] = useState(false);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const ref = useCallback((node) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {

    const checkVisibility = () => {
      if (hasAnimatedRef.current || !elementRef.current) return;
      // if (!elementRef.current ) return;
      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isVisible = rect.top < windowHeight * threshold && rect.bottom > 0;
      // setIsActive(isVisible);
       if (isVisible && !hasAnimatedRef.current) {
        setIsActive(true);
        hasAnimatedRef.current = true;
      }
    };

    window.addEventListener('scroll', checkVisibility, { passive: true });
    checkVisibility();

    return () => window.removeEventListener('scroll', checkVisibility);
  }, [threshold]);

  return [ref, isActive];
};
