import { useCallback, useEffect } from "react";

type IntersectionCallback = (entries: IntersectionObserverEntry[]) => void;

interface UseIntersectionObserverProps {
  targetRef: React.RefObject<HTMLElement | null>;
  callback: IntersectionCallback;
}

function useIntersectionObserver({
  targetRef,
  callback,
}: UseIntersectionObserverProps) {
  const handleObserver: IntersectionObserverCallback = useCallback(
    (entries) => {
      callback(entries);
    },
    [callback]
  );

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    const currentRef = targetRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleObserver, targetRef]);
}

export default useIntersectionObserver;
