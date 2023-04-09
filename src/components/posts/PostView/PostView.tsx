import Link from "next/link";
import type { ReactNode } from "react";

import { formatDistance } from "date-fns";
import { useSession } from "next-auth/react";

import { usePost } from "../hooks/usePost";

import type { RouterOutputs } from "~/utils/api";

import { Avatar, LoadingSpinner } from "~/components/common";
import { useHandlePostClick } from "../hooks/useHandlePostClick";

type PostActionsProps = {
  postId: string;
  isLikedByUser: boolean;
};
const PostActions = ({ postId, isLikedByUser }: PostActionsProps) => {
  const { handleLike, handleUnlike, isLiking, isUnliking } = usePost({
    postId,
  });
  return (
    <div className="mt-3 grid grid-cols-1 justify-start gap-3 sm:grid-cols-4">
      <button
        disabled={isLiking || isUnliking}
        onClick={() => {
          if (!isLikedByUser) {
            handleLike();
          } else {
            handleUnlike();
          }
        }}
        className={`w-26 inline-flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold text-gray-700 transition-colors disabled:pointer-events-auto disabled:opacity-50 ${
          isLikedByUser ? "bg-blue-200" : "bg-gray-200"
        }`}
      >
        {isLikedByUser ? "Unlike" : "Like"}
        {(isLiking || isUnliking) && <LoadingSpinner />}
      </button>
    </div>
  );
};

type Author = RouterOutputs["posts"]["getAll"][number]["author"];
const UserInfo = ({
  author,
  children,
}: {
  author: Author;
  children: ReactNode;
}) => (
  <div className="flex">
    <Link href={`/${author?.id ?? ""}`}>
      <Avatar
        size="lg"
        label={author.name ?? ""}
        imageUrl={author?.image ?? ""}
      />
    </Link>
    <div className="ml-4 flex w-full flex-col gap-1">
      <div className="flex min-w-0 items-baseline gap-2">
        <Link
          href={`/${author.id}`}
          className="truncate font-semibold hover:underline"
        >
          {author.name}
        </Link>
        <Link
          href={`/${author.id}`}
          className="truncate text-sm font-semibold lowercase text-gray-500 hover:underline"
        >{`@${author.name?.toLowerCase() ?? ""}`}</Link>
      </div>
      {children}
    </div>
  </div>
);

type PostWithUser = RouterOutputs["posts"]["getAll"][number] & {
  isLoading?: boolean;
  redirectOnDelete?: boolean;
};
const PostView = (props: PostWithUser) => {
  const {
    id: postId,
    author,
    createdAt,
    content,
    isLoading,
    likes,
    isLikedByUser,
    redirectOnDelete = false,
  } = props;

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
        <UserInfo author={author}>
          <Link
            href={`/post/${postId}`}
            className="truncate text-sm text-gray-500 hover:underline"
          >
            {elapsedTime}
          </Link>
          <div>
            <span className="text-black">{content}</span>
          </div>

          <div className="my-1 flex items-center justify-between gap-3 text-sm">
            <span>{likes?.length ?? "0"} likes</span>
            <span>Comments</span>
          </div>

          {isPostOwner && (
            <button
              disabled={isDeleting || isLoading}
              onClick={handleDeletePost}
              className="inline-flex w-24 items-center justify-center gap-2 rounded-lg border bg-red-500 py-1 text-sm font-semibold text-white hover:bg-red-600 disabled:pointer-events-auto disabled:opacity-50"
            >
              Delete
              {isDeleting && <LoadingSpinner />}
            </button>
          )}
          <PostActions isLikedByUser={isLikedByUser} postId={postId} />
        </UserInfo>
      </div>
    </div>
  );
};

export default PostView;
