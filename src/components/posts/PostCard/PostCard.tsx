import Link from "next/link";

import { formatDistance } from "date-fns";
import { useSession } from "next-auth/react";

import { LoadingSpinner } from "~/components/common";

import { usePost } from "../hooks/usePost";
import { useHandlePostClick } from "../hooks/useHandlePostClick";

import { type RouterOutputs, api } from "~/utils/api";

import AuthorInfo from "./AuthorInfo";
import PostActions from "./PostActions";
import SocialStats from "./SocialStats";

type PostWithUser = RouterOutputs["posts"]["getAll"][number] & {
  isLoading?: boolean;
  redirectOnDelete?: boolean;
};
const PostCard = ({
  id: postId,
  author,
  createdAt,
  content,
  isLoading,
  isLikedByUser,
  redirectOnDelete = false,
}: PostWithUser) => {
  const { data: likes } = api.likes.getLikesByPostId.useQuery({ postId });

  const { handleDeletePost, isDeleting } = usePost({
    postId,
    redirect: redirectOnDelete,
  });

  const { data: sessionData } = useSession();

  const isPostOwner = author.id === sessionData?.user?.id;

  const elapsedTime = formatDistance(new Date(createdAt ?? ""), new Date(), {
    includeSeconds: true,
    addSuffix: true,
  });

  const { handlePostClick } = useHandlePostClick({
    postId,
    isDeleting,
    isLoading: isLoading ?? false,
  });

  return (
    <div
      onClick={handlePostClick}
      className={`flex gap-4 rounded-xl bg-gray-100 p-4 ${
        isLoading || isDeleting
          ? "pointer-events-none animate-pulse opacity-70"
          : "cursor-pointer"
      }`}
    >
      <div className="flex min-w-0 grow flex-col gap-1">
        <AuthorInfo author={author}>
          <Link
            href={`/post/${postId}`}
            className="truncate text-sm text-gray-500 hover:underline"
          >
            {elapsedTime}
          </Link>
          <div>
            <span className="text-gray-800">{content}</span>
          </div>

          <SocialStats likesCount={likes?.count ?? 0} commentsCount={0} />
          <PostActions isLikedByUser={isLikedByUser} postId={postId} />

          {isPostOwner && (
            <button
              disabled={isDeleting || isLoading}
              onClick={handleDeletePost}
              className="mt-3 inline-flex w-24 items-center justify-center gap-2 rounded-lg border bg-red-500 py-1 text-sm font-semibold text-white hover:bg-red-600 disabled:pointer-events-auto disabled:opacity-50"
            >
              Delete
              {isDeleting && <LoadingSpinner />}
            </button>
          )}
        </AuthorInfo>
      </div>
    </div>
  );
};

export default PostCard;
