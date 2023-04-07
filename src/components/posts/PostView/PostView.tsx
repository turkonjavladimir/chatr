import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import { Avatar, LoadingSpinner } from "~/components/common";
import { formatDistance } from "date-fns";

type PostWithUser = RouterOutputs["posts"]["getAll"][number] & {
  isLoading?: boolean;
};
const PostView = (props: PostWithUser) => {
  const ctx = api.useContext();
  const { data: sessionData } = useSession();

  const elapsedTime = formatDistance(
    new Date(props?.updatedAt ?? ""),
    new Date(),
    {
      includeSeconds: true,
      addSuffix: true,
    }
  );

  const { mutate, isLoading: isDeleting } = api.posts.deleteById.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate();
      toast.success("Deleted");
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });

  const isPostOwner = props?.author.id === sessionData?.user?.id;

  return (
    <div
      className={`flex gap-4 rounded-xl bg-gray-100 p-4 ${
        props?.isLoading || isDeleting
          ? "pointer-events-none animate-pulse opacity-70"
          : ""
      }`}
    >
      <div>
        <Avatar
          size="lg"
          label={props?.author.name ?? ""}
          imageUrl={props?.author?.image ?? ""}
        />
      </div>
      <div className="flex w-full min-w-0 flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate font-semibold">{props?.author.name}</span>
            <span className="truncate text-sm font-semibold lowercase text-gray-500">{`@${
              props?.author.name ?? ""
            }`}</span>
          </div>
          <div>
            <span className="truncate text-xs">menu</span>
          </div>
        </div>
        <span className="truncate text-sm text-gray-500">{elapsedTime}</span>
        <div>
          <span>{props?.content}</span>
        </div>
        {isPostOwner && (
          <div>
            <button
              onClick={() =>
                mutate({
                  id: props?.id,
                })
              }
              className="inline-flex w-24 items-center justify-center gap-2 rounded-lg border bg-red-500 py-1 text-sm font-semibold text-white hover:bg-red-600 disabled:pointer-events-auto disabled:opacity-50"
            >
              Delete
              {isDeleting && <LoadingSpinner />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostView;
