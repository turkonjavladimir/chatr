import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const postsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          authorId: ctx.session.user.id,
          content: input.content,
        },
      });

      return post;
    }),
});
