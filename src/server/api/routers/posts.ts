import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        author: true,
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: true,
        },
      });
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
        },
        take: 10,
        orderBy: { createdAt: "desc" },
      });

      return posts;
    }),
});
