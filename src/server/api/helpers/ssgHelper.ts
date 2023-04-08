import SuperJSON from "superjson";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";

import { prisma } from "~/server/db";
import { appRouter } from "../root";

export const generateSSGHelper = () =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: SuperJSON,
  });
