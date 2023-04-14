import {
  ArrowPathRoundedSquareIcon,
  ArrowUpOnSquareIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";

import { api } from "~/utils/api";
import { usePost } from "../../hooks/usePost";
import { useSession } from "next-auth/react";

import useToast from "~/utils/hooks/useToast";

type PostActionsProps = {
  postId: string;
  isLikedByUser: boolean;
};
const PostActions = ({ postId }: PostActionsProps) => {
  const { data: sessionData } = useSession();
  const { toast } = useToast();
  const { handleLike, handleUnlike, isLiking, isUnliking } = usePost({
    postId,
  });

  const { data: likes } = api.likes.getLikesByPostId.useQuery({ postId });

  const handleClick = () => {
    if (!sessionData) {
      toast.error("You must be logged in to like a post");
      return;
    }

    if (!likes?.likedByCurrentUser) {
      void handleLike();
    } else {
      void handleUnlike();
    }
  };

  return (
    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <button
        disabled={isLiking || isUnliking}
        onClick={handleClick}
        className={`group inline-flex items-center justify-center gap-2 rounded-lg border shadow-sm transition-colors ${
          likes?.likedByCurrentUser ? "bg-pink-200" : "bg-gray-200"
        } px-5 py-2 text-sm font-semibold text-gray-700 transition-colors disabled:pointer-events-auto`}
      >
        <span>
          <HeartIcon
            className={`h-5 w-5 transition-colors group-hover:text-pink-500 ${
              likes?.likedByCurrentUser ? "text-pink-500" : "text-gray-500"
            }`}
          />
        </span>
        <span
          className={` hidden text-xs transition-colors group-hover:text-pink-500 sm:block ${
            likes?.likedByCurrentUser ? "text-pink-500" : "text-gray-500"
          }`}
        >
          Like
        </span>
      </button>

      <button
        disabled={true}
        className="group inline-flex items-center justify-center gap-2 rounded-lg border bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-green-500/20 disabled:pointer-events-none disabled:opacity-50"
      >
        <span>
          <ArrowPathRoundedSquareIcon className="h-5 w-5 text-gray-500 transition-colors group-hover:text-green-600" />
        </span>
        <span className="hidden text-xs sm:block">Repost</span>
      </button>

      <button
        disabled={true}
        className="group inline-flex items-center justify-center gap-2 rounded-lg border bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-blue-500/20 disabled:pointer-events-none disabled:opacity-50"
      >
        <span>
          <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 text-gray-500 transition-colors group-hover:text-blue-500" />
        </span>
        <span className="hidden text-xs sm:block">Comment</span>
      </button>

      <button
        disabled={true}
        className="group inline-flex items-center justify-center gap-2 rounded-lg border bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-sky-500/20 disabled:pointer-events-none disabled:opacity-50"
      >
        <span>
          <ArrowUpOnSquareIcon className="h-5 w-5 text-gray-500 transition-colors group-hover:text-sky-500" />
        </span>{" "}
        <span className="hidden text-xs sm:block">Share</span>
      </button>
    </div>
  );
};

export default PostActions;
