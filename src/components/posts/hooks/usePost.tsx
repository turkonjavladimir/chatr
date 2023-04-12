import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

import { api } from "~/utils/api";

import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";
import type { Like } from "@prisma/client";

type PostProps = {
  postId: string;
};

export const usePost = ({ postId }: PostProps) => {
  const ctx = api.useContext();
  const router = useRouter();
  const { data: sessionData } = useSession();

  const { mutate: likePost, isLoading: isLiking } = api.likes.like.useMutation({
    onMutate: async ({ postId }) => {
      await ctx.likes.getLikesByPostId.cancel();

      // get a snapshot of current data
      const previousLikesByPostId = ctx.likes.getLikesByPostId.getData({
        postId,
      });

      ctx.likes.getLikesByPostId.setData({ postId }, (prev) => {
        const currentLikes = prev?.likesById ?? [];
        const currentCount = currentLikes.length;

        const optimisticLike = {
          id: uuidv4(),
          postId: postId,
          userId: sessionData?.user?.id ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Like;

        // if prev exists, return new data
        return {
          likedByCurrentUser: true,
          likesById: [optimisticLike, ...currentLikes],
          count: currentCount + 1,
        };
      });

      // rollback to previous value if mutation fails
      return {
        previousLikesByPostId,
      };
    },
    onSettled: () => {
      /*       await ctx.posts.getAll.invalidate();
      await ctx.posts.getById.invalidate();
      await ctx.posts.getByUserId.invalidate();
      await ctx.likes.getLikesByPostId.invalidate(); */
      toast.success("Liked!");
    },
    onError: () => {
      toast.error("Failed to like");
    },
  });

  const { mutate: unlikePost, isLoading: isUnliking } =
    api.likes.unlike.useMutation({
      onMutate: async ({ postId }) => {
        await ctx.likes.getLikesByPostId.cancel();

        // get a snapshot of current data
        const previousLikesByPostId = ctx.likes.getLikesByPostId.getData({
          postId,
        });

        ctx.likes.getLikesByPostId.setData({ postId }, (prev) => {
          const currentLikes = prev?.likesById ?? [];
          const currentCount = currentLikes.length;

          // Find the index of the user's like
          const likeIndex = currentLikes.findIndex(
            (like) => like.userId === sessionData?.user?.id
          );

          // Remove the user's like from the array
          const updatedLikes = [
            ...currentLikes.slice(0, likeIndex),
            ...currentLikes.slice(likeIndex + 1),
          ];

          return {
            likedByCurrentUser: false,
            likesById: updatedLikes,
            count: currentCount === 0 ? 0 : currentCount - 1,
          };
        });

        // rollback to previous value if mutation fails
        return {
          previousLikesByPostId,
        };
      },
      onSettled: () => {
        /*        await ctx.likes.getLikesByPostId.invalidate();
        await ctx.posts.getById.invalidate();
        await ctx.posts.getByUserId.invalidate();
        await ctx.posts.getAll.invalidate(); */
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

        if (router.query.id) {
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
