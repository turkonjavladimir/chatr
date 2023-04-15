import { type MutableRefObject, useRef } from "react";
import useIntersectionObserver from "./useIntersectionObserver";

interface UseInfiniteScrollProps {
  fetchNextPage: () => Promise<unknown>;
  hasNextPage: boolean | undefined;
  isFetching: boolean;
}

function useInfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetching,
}: UseInfiniteScrollProps): MutableRefObject<HTMLDivElement | null> {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useIntersectionObserver({
    targetRef: loadMoreRef,
    callback: (entries) => {
      const target = entries[0];
      if (target?.isIntersecting && !isFetching && hasNextPage) {
        void fetchNextPage().catch((error) => {
          console.error("Error fetching next page:", error);
        });
      }
    },
  });

  return loadMoreRef;
}

export default useInfiniteScroll;
