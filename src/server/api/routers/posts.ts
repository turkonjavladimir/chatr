import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const postsRouter = createTRPCRouter({
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
});
