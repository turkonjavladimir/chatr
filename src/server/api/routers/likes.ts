import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const likesRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.postId,
        },
      });

      // If the post doesn't exist, throw an error
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      // check for existing like
      const existingLike = await ctx.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: ctx.session.user.id,
            postId: input.postId,
          },
        },
      });

      if (existingLike) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Already liked" });
      }

      // create like
      return ctx.prisma.like.create({
        data: {
          postId: input.postId,
          userId: ctx.session.user.id,
        },
      });
    }),
  unlike: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const like = await ctx.prisma.like.findUnique({
        where: {
          userId_postId: {
            userId: ctx.session.user.id,
            postId: input.postId,
          },
        },
      });

      if (ctx.session.user.id !== like?.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
      }

      return ctx.prisma.like.delete({
        where: {
          userId_postId: {
            userId: ctx.session.user.id,
            postId: input.postId,
          },
        },
      });
    }),
  getLikesByPostId: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const likesById = await ctx.prisma.like.findMany({
        where: {
          postId: input.postId,
        },
      });

      const likedByCurrentUser = likesById.some(
        (like) => like.userId === ctx?.session?.user.id
      );

      return { likesById, count: likesById?.length, likedByCurrentUser };
    }),
  getAll: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx }) => {
      const likes = await ctx.prisma.like.findMany();

      const likedByCurrentUser = likes.some(
        (like) => like.userId === ctx?.session?.user.id
      );

      return {
        likes,
        count: likes?.length,
        likedByCurrentUser,
      };
    }),
});
