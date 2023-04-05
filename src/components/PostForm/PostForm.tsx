import { z } from "zod";
import { toast } from "react-hot-toast";
import type { SubmitHandler } from "react-hook-form";

import { api } from "~/utils/api";
import useZodForm from "~/utils/hooks/useZodForm";
import { CharacterCount } from "~/components/common";

const MediaButtons = () => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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

const Avatar = () => {
  return (
    <div className="flex animate-pulse space-x-4">
      <div className="h-10 w-10 rounded-full bg-slate-700"></div>
    </div>
  );
};

const postSchema = z.object({
  content: z.string().min(1).max(280),
});
type PostSchemaValidation = z.infer<typeof postSchema>;

const PostForm = () => {
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

  const { mutate } = api.posts.create.useMutation({
    onSuccess: () => {
      reset();
      toast.success("Posted!");
    },
    onError: (error) => {
      console.log("error", error);
      toast.error("Failed to post");
    },
  });

  const onSubmit: SubmitHandler<PostSchemaValidation> = (data) => {
    mutate({ content: data?.content });
    reset();
  };

  return (
    <div className="flex w-full items-start gap-4">
      <Avatar />
      <div className="flex grow flex-col">
        <div className="rounded-xl bg-gray-100 p-4 shadow-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col items-end rounded-xl border bg-white shadow-sm">
              <textarea
                {...register("content", { required: "Required" })}
                name="content"
                aria-invalid={errors.content ? "true" : "false"}
                placeholder={`What's happening?`}
                maxLength={280}
                className="h-20 w-full resize-none rounded-t-xl px-3 py-2 text-base text-gray-700 placeholder-gray-500 outline-none transition-all"
              />

              <div className="flex items-center">
                <CharacterCount
                  alwaysShow={true}
                  value={contentValue}
                  max={280}
                />
                <button
                  disabled={!isValid}
                  type="submit"
                  className="m-2 inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 disabled:pointer-events-auto disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  Post
                </button>
              </div>
            </div>

            <MediaButtons />
          </form>
        </div>
      </div>
    </div>
  );
};
export default PostForm;
