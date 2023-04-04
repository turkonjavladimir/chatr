import { z } from "zod";
import { toast } from "react-hot-toast";
import type { SubmitHandler } from "react-hook-form";

import { api } from "~/utils/api";
import useZodForm from "~/utils/hooks/useZodForm";

/* const MediaButtons = () => {
  return (
    <div className="flex gap-4">
      <button className="inline-flex w-24 justify-center rounded-full bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300">
        Photo
      </button>
      <button className="inline-flex w-24 justify-center rounded-full bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300">
        Video
      </button>
      <button className="inline-flex w-24 justify-center rounded-full bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300">
        Schedule
      </button>
      <button className="inline-flex w-24 justify-center rounded-full bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300">
        Poll
      </button>
    </div>
  );
}; */

const Avatar = () => {
  return (
    <div className="flex animate-pulse space-x-4">
      <div className="h-10 w-10 rounded-full bg-slate-700"></div>
    </div>
  );
};

const postSchema = z.object({
  content: z.string().min(1),
});
type PostSchemaValidation = z.infer<typeof postSchema>;

const PostForm = () => {
  const { register, handleSubmit, reset, watch } = useZodForm({
    schema: postSchema,
    defaultValues: {
      content: "",
    },
  });

  const { mutate } = api.posts.create.useMutation({
    onSuccess: () => {
      reset();
      toast.success("Posted!");
    },
    onError: () => {
      toast.error("Failed to post");
    },
  });

  const onSubmit: SubmitHandler<PostSchemaValidation> = (data) => {
    mutate({ content: data?.content });
    reset();
  };

  const isDisabled = watch("content") === "";

  return (
    <div className="flex w-full items-start gap-4">
      <Avatar />
      <div className="flex grow flex-col gap-3">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full resize-none flex-col rounded-xl bg-gray-100 p-4 text-gray-700 shadow-sm outline-none"
        >
          <textarea
            {...register("content")}
            name="content"
            placeholder={`What's happening?`}
            className="h-20 resize-none bg-gray-100 text-gray-700 outline-none disabled:pointer-events-none disabled:opacity-50"
          />

          <div className="mt-2 flex justify-end">
            <button
              disabled={isDisabled}
              type="submit"
              className="inline-flex items-center rounded-full bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm disabled:pointer-events-auto disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </form>
        {/* <MediaButtons /> */}
      </div>
    </div>
  );
};
export default PostForm;
