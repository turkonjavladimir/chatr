import { z } from "zod";

import type { Post, User, Like } from "@prisma/client";
import { useSession } from "next-auth/react";
import type { SubmitHandler } from "react-hook-form";

import { api } from "~/utils/api";
import useZodForm from "~/utils/hooks/useZodForm";

import { Avatar, CharacterCount, LoadingSpinner } from "~/components/common";
import useToast from "~/utils/hooks/useToast";

const MediaButtons = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      <button className="inline-flex w-full justify-center rounded-full border border-gray-300 bg-transparent px-5 py-2 text-sm font-semibold text-gray-800  transition-colors hover:bg-gray-200">
        Photo
      </button>
      <button className="inline-flex w-full justify-center rounded-full border border-gray-300 bg-transparent px-5 py-2 text-sm font-semibold text-gray-800  transition-colors hover:bg-gray-200">
        Video
      </button>
      <button className="inline-flex w-full justify-center rounded-full border border-gray-300 bg-transparent px-5 py-2 text-sm font-semibold text-gray-800  transition-colors hover:bg-gray-200">
        Schedule
      </button>
      <button className="inline-flex w-full justify-center rounded-full border border-gray-300 bg-transparent px-5 py-2 text-sm font-semibold text-gray-800  transition-colors hover:bg-gray-200">
        Poll
      </button>
    </div>
  );
};

const postSchema = z.object({
  content: z.string().min(1).max(280).trim(),
});
type PostSchemaValidation = z.infer<typeof postSchema>;

export type OptimisticPost = Post & {
  author: User;
  isLoading: boolean;
  likes: Like[];
  isLikedByUser: boolean;
};

const PostForm = () => {
  const { data: sessionData } = useSession();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useZodForm({
    schema: postSchema,
    defaultValues: {
      content: "",
    },
  });
  const contentValue = watch("content").length;

  const ctx = api.useContext();
  const { mutate, isLoading } = api.posts.create.useMutation({
    onSettled: async () => {
      await ctx.posts.getAll.invalidate();
      toast.success("Posted");
      reset();
    },
    onError: async () => {
      await ctx.posts.getAll.invalidate();
      toast.error("Failed to post");
      reset();
    },
  });

  const onSubmit: SubmitHandler<PostSchemaValidation> = (data) => {
    mutate({ content: data?.content });
  };

  if (!sessionData) return null;

  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex grow flex-col">
        <div className="flex gap-4 rounded-xl bg-gray-100 p-4 shadow-sm">
          <Avatar
            size="lg"
            label={sessionData?.user.name ?? ""}
            imageUrl={sessionData?.user?.image ?? ""}
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex grow flex-col gap-4"
          >
            <div
              className={`flex flex-col items-end rounded-xl bg-white shadow-sm ${
                isLoading ? "opacity-70" : ""
              }`}
            >
              <textarea
                disabled={isLoading}
                {...register("content", { required: "Required" })}
                name="content"
                aria-invalid={errors.content ? "true" : "false"}
                placeholder={`What's happening?`}
                maxLength={10000}
                className="h-24 w-full resize-none rounded-t-xl px-3 py-2 text-base text-gray-700 placeholder-gray-500 outline-none transition-all disabled:bg-white"
              />

              <div className="mb-2 flex items-center gap-2">
                <CharacterCount
                  alwaysShow={true}
                  value={contentValue}
                  max={280}
                />
                <button
                  disabled={!isValid || isLoading}
                  type="submit"
                  className="mx-2 inline-flex w-20 items-center justify-center gap-2 rounded-lg border border-gray-300 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:pointer-events-auto disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  Post
                  {isLoading && <LoadingSpinner />}
                </button>
              </div>
            </div>

            {/*     <MediaButtons /> */}
          </form>
        </div>
      </div>
    </div>
  );
};
export default PostForm;
