import { z } from "zod";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import type { SubmitHandler } from "react-hook-form";

import { api } from "~/utils/api";
import useZodForm from "~/utils/hooks/useZodForm";

import { CharacterCount } from "~/components/common";

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

const LoadingSpinner = () => {
  return (
    <div aria-label="Loading..." role="status">
      <svg className="h-3 w-3 animate-spin" viewBox="3 3 18 18">
        <path
          className="fill-gray-200"
          d="M12 5C8.13401 5 5 8.13401 5 12c0 3.866 3.13401 7 7 7 3.866.0 7-3.134 7-7 0-3.86599-3.134-7-7-7zM3 12c0-4.97056 4.02944-9 9-9 4.9706.0 9 4.02944 9 9 0 4.9706-4.0294 9-9 9-4.97056.0-9-4.0294-9-9z"
        ></path>
        <path
          className="fill-gray-800"
          d="M16.9497 7.05015c-2.7336-2.73367-7.16578-2.73367-9.89945.0-.39052.39052-1.02369.39052-1.41421.0-.39053-.39053-.39053-1.02369.0-1.41422 3.51472-3.51472 9.21316-3.51472 12.72796.0C18.7545 6.02646 18.7545 6.65962 18.364 7.05015c-.390599999999999.39052-1.0237.39052-1.4143.0z"
        ></path>
      </svg>
    </div>
  );
};

const postSchema = z.object({
  content: z.string().min(1).max(280),
});
type PostSchemaValidation = z.infer<typeof postSchema>;

const PostForm = () => {
  const { data: sessionData } = useSession();

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

  const { mutate, isLoading } = api.posts.create.useMutation({
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

  if (!sessionData) return null;

  return (
    <div className="flex w-full items-start gap-4">
      <div className="flex grow flex-col">
        <div className="flex gap-4 rounded-xl bg-gray-100 p-4 shadow-sm">
          <Image
            className="flex h-12 w-12 items-center justify-center rounded-full"
            src={sessionData?.user?.image ?? ""}
            alt={sessionData?.user?.name ?? ""}
            width={48}
            height={48}
          />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex grow flex-col gap-4"
          >
            <div className="flex flex-col items-end rounded-xl bg-white shadow-sm">
              <textarea
                {...register("content", { required: "Required" })}
                name="content"
                aria-invalid={errors.content ? "true" : "false"}
                placeholder={`What's happening?`}
                maxLength={1280}
                className="h-24 w-full resize-none rounded-t-xl px-3 py-2 text-base text-gray-700 placeholder-gray-500 outline-none transition-all"
              />

              <div className="mb-2 flex items-center gap-2">
                <CharacterCount
                  alwaysShow={true}
                  value={contentValue}
                  max={280}
                />
                <button
                  disabled={!isValid}
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
