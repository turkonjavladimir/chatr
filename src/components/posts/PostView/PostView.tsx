import Link from "next/link";
import type { ReactNode } from "react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { formatDistance } from "date-fns";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import { Avatar, LoadingSpinner } from "~/components/common";

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
    <div className="ml-4 flex flex-col gap-1">
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
  const router = useRouter();
  const ctx = api.useContext();
  const { data: sessionData } = useSession();

  const {
    id,
    author,
    createdAt,
    content,
    isLoading,
    redirectOnDelete = false,
  } = props;

  const elapsedTime = formatDistance(new Date(createdAt ?? ""), new Date(), {
    includeSeconds: true,
    addSuffix: true,
  });

  const { mutate, isLoading: isDeleting } = api.posts.deleteById.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate();
      await ctx.posts.getByUserId.invalidate();
      toast.success("Deleted");

      if (redirectOnDelete) {
        void router.push("/");
      }
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });

  const isPostOwner = author.id === sessionData?.user?.id;

  const handlePostClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const targetTag = (e.target as HTMLElement).tagName.toLowerCase();

    if (isLoading || isDeleting) {
      return;
    }

    if (targetTag !== "a" && targetTag !== "button") {
      void router.push(`/post/${id}`);
    }
  };

  return (
    <div
      onClick={handlePostClick}
      className={`flex gap-4 rounded-xl bg-gray-100 p-4 ${
        isLoading || isDeleting
          ? "pointer-events-none animate-pulse opacity-70"
          : "cursor-pointer"
      }`}
    >
      <div className="flex w-full min-w-0 flex-col gap-1">
        <UserInfo author={author}>
          <Link
            href={`/post/${id}`}
            className="truncate text-sm text-gray-500 hover:underline"
          >
            {elapsedTime}
          </Link>
          <div>
            <span className="text-black">{content}</span>
          </div>

          {isPostOwner && (
            <button
              disabled={isDeleting || isLoading}
              onClick={() =>
                mutate({
                  id,
                })
              }
              className="inline-flex w-24 items-center justify-center gap-2 rounded-lg border bg-red-500 py-1 text-sm font-semibold text-white hover:bg-red-600 disabled:pointer-events-auto disabled:opacity-50"
            >
              Delete
              {isDeleting && <LoadingSpinner />}
            </button>
          )}
        </UserInfo>
      </div>
    </div>
  );
};

export default PostView;
