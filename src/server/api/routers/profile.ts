import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          posts: true,
        },
      });

      if (!profile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      return profile;
    }),
});
