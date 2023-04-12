import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import PageLayout from "~/components/layout";

import { api } from "~/utils/api";
import { PostCard, PostForm } from "~/components/posts";

const Feed = () => {
  const { data: posts, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <div>Loading...</div>;

  if (!posts) return <div>No posts to show</div>;

  return (
    <div className="rounded-xl-4 flex gap-4">
      <div className="mx-4 flex grow flex-col gap-3">
        {posts?.map((postData) => (
          <PostCard key={postData?.id} {...postData} />
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
