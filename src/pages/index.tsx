import Image from "next/image";
import type { NextPage } from "next";
import { toast } from "react-hot-toast";
import { signIn, signOut, useSession } from "next-auth/react";

import { PostForm } from "~/components";
import PageLayout from "~/components/layout";
import { LoadingSpinner } from "~/components/PostForm/PostForm";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

type PostWithUser = RouterOutputs["posts"]["getAll"][number] & {
  isLoading?: boolean;
};
const PostView = (props: PostWithUser) => {
  const ctx = api.useContext();
  const { data: sessionData } = useSession();

  const { mutate, isLoading: isDeleting } = api.posts.deleteById.useMutation({
    onSuccess: async () => {
      await ctx.posts.getAll.invalidate();
      toast.success("Deleted");
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });

  const isPostOwner = props?.author.id === sessionData?.user?.id;
  return (
    <div
      className={`flex gap-4 rounded-xl bg-gray-100 p-4 ${
        props?.isLoading || isDeleting
          ? "pointer-events-none animate-pulse opacity-70"
          : ""
      }`}
    >
      <Image
        className="flex h-12 w-12 items-center justify-center rounded-full"
        src={props?.author.image ?? ""}
        alt={props?.author.name ?? ""}
        width={48}
        height={48}
      />

      <div className="flex w-full min-w-0 flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-baseline gap-2">
            <span className="truncate font-semibold">{props?.author.name}</span>
            <span className="truncate text-sm font-semibold lowercase text-gray-500">{`@${
              props?.author.name ?? ""
            }`}</span>
          </div>
          <div>
            <span className="truncate text-xs">menu</span>
          </div>
        </div>
        <span className="truncate text-sm text-gray-500">
          {new Date(props?.createdAt).toLocaleString("en-US", {
            timeZone: "UTC",
          })}
        </span>
        <div>
          <span>{props?.content}</span>
        </div>
        {isPostOwner && (
          <div>
            <button
              onClick={() =>
                mutate({
                  id: props?.id,
                })
              }
              className="inline-flex w-24 items-center justify-center gap-2 rounded-lg border bg-red-500 py-1 text-sm font-semibold text-white hover:bg-red-600 disabled:pointer-events-auto disabled:opacity-50"
            >
              Delete
              {isDeleting && <LoadingSpinner />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Feed = () => {
  const { data: posts, isLoading: postsLoading } =
    api.posts.getAll.useQuery<PostWithUser>();

  if (postsLoading) return <div>Loading...</div>;

  if (!posts) throw new Error("No posts");

  return (
    <div className="rounded-xl-4 flex gap-4">
      <div className="mx-4 flex grow flex-col gap-3">
        {posts?.map((postData) => (
          <PostView key={postData?.id} {...postData} />
        ))}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <PageLayout>
        <div className="my-4 flex justify-center">
          <button
            className="rounded-full bg-neutral-800 px-5 py-2 font-semibold text-white no-underline transition"
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </button>
        </div>

        <div className="m-4">
          <PostForm />
        </div>

        <section className="mb-5">
          <Feed />
        </section>
      </PageLayout>
    </>
  );
};

export default Home;
