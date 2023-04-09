import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

import type { Post, User, Like } from "@prisma/client";

type PostWithAuthorAndLikes = Post & {
  likes: Like[];
  author: User;
};
export function addIsLikedByUserToPost(
  post: PostWithAuthorAndLikes,
  currentUserId: string | undefined
): PostWithAuthorAndLikes & { isLikedByUser: boolean } {
  const isLikedByUser = post?.likes?.some(
    (like) => like?.userId === currentUserId
  );

  return { ...post, isLikedByUser };
}

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      include: {
        author: true,
        likes: true,
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    const postsWithAUthorAndLikes = posts.map((post) =>
      addIsLikedByUserToPost(post, ctx?.session?.user?.id)
    );

    return postsWithAUthorAndLikes;
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: true,
          likes: true,
        },
      });

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      return addIsLikedByUserToPost(post, ctx?.session?.user?.id);
    }),
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          authorId: ctx.session.user.id,
          content: input.content,
        },
      });
    }),
  deleteById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });

      // If the post doesn't exist, throw an error
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      // If the current user is not the author, throw an error
      if (post.authorId !== ctx.session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }

      // If the current user is the author, delete the post
      return ctx.prisma.post.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getByUserId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: input.id,
        },
        include: {
          author: true,
          likes: true,
        },
        take: 10,
        orderBy: { createdAt: "desc" },
      });

      if (!posts) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Posts not found" });
      }

      const postsWithAUthorAndLikes = posts.map((post) =>
        addIsLikedByUserToPost(post, ctx?.session?.user?.id)
      );

      return postsWithAUthorAndLikes;
    }),
});
