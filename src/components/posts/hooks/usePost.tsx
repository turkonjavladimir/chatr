import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { api } from "~/utils/api";

type PostProps = {
  postId: string;
  redirect?: boolean;
};

export const usePost = ({ postId, redirect }: PostProps) => {
  const ctx = api.useContext();
  const router = useRouter();

  const { mutate: likePost, isLoading: isLiking } = api.likes.like.useMutation({
    /*     onMutate: async () => {
      // cancel all outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.likes.getLikesByPostId.cancel();

      // Snapshot the previous value
      const previousLikes = ctx.likes.getLikesByPostId.getData({ postId: id });
      console.log("hello like", previousLikes);

      // Optimistically update to the new value
      ctx.likes.getLikesByPostId.setData({ postId: id }, (prev) => {
        const optimisticLike = {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: sessionData?.user?.id,
          postId: id,
          user: sessionData?.user,
          isLikedByUser: true,
        };
        console.log(optimisticLike);
        if (!prev) {
          return [optimisticLike];
        }

        return [optimisticLike, ...prev];
      });

      return { previousLikes };
    }, */
    onSettled: async () => {
      await ctx.posts.getAll.invalidate();
      await ctx.posts.getById.invalidate();
      await ctx.posts.getByUserId.invalidate();
      toast.success("Liked!");
    },
    onError: () => {
      toast.error("Failed to like");
    },
  });

  const { mutate: unlikePost, isLoading: isUnliking } =
    api.likes.unlike.useMutation({
      /*     onMutate: async ({ postId }) => {
      // cancel all outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.likes.getLikesByPostId.cancel();

      // Snapshot the previous value
      const previousLikes = ctx.likes.getLikesByPostId.getData({ postId: id });

      console.log("previousLikes", previousLikes);
      console.log("postId", postId);

      // Optimistically update to the new value
      ctx.likes.getLikesByPostId.setData({ postId }, (prev) => {
        if (!prev) return previousLikes;

        return prev?.filter((like) => like.postId !== postId);
      });

      return { previousLikes };
    }, */
      onSettled: async () => {
        await ctx.posts.getAll.invalidate();
        await ctx.posts.getById.invalidate();
        await ctx.posts.getByUserId.invalidate();
        toast.success("Unliked!");
      },
      onError: () => {
        toast.error("Failed to remove like");
      },
    });

  const { mutate: deletePost, isLoading: isDeleting } =
    api.posts.deleteById.useMutation({
      onSuccess: async () => {
        await ctx.posts.getAll.invalidate();
        await ctx.posts.getByUserId.invalidate();
        toast.success("Deleted");

        if (redirect) {
          void router.push("/");
        }
      },
      onError: () => {
        toast.error("Failed to delete");
      },
    });

  const handleLike = () => likePost({ postId });
  const handleUnlike = () => unlikePost({ postId });
  const handleDeletePost = () => deletePost({ id: postId });

  return {
    handleLike,
    handleUnlike,
    handleDeletePost,
    isDeleting,
    isLiking,
    isUnliking,
  };
};
