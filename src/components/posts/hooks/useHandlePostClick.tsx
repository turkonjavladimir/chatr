import { useRouter } from "next/router";
import type { MouseEvent, TouchEvent } from "react";

type UseHandlePostClickProps = {
  isLoading: boolean;
  isDeleting: boolean;
  postId: string;
};

export const useHandlePostClick = ({
  isLoading,
  isDeleting,
  postId,
}: UseHandlePostClickProps) => {
  const router = useRouter();

  const handlePostClick = (
    e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    const targetTag = (e.target as HTMLElement).tagName.toLowerCase();

    if (isLoading || isDeleting) {
      return;
    }

    if (targetTag !== "a" && targetTag !== "button" && targetTag !== "img") {
      const targetPath = `/post/${postId}`;

      // Check if the target path is the same as the current path
      if (router.asPath !== targetPath) {
        void router.push(targetPath);
      }
    }
  };

  return { handlePostClick };
};
