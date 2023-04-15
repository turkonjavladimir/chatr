import type { NextPage } from "next";

import PageLayout from "~/components/layout";

import { api } from "~/utils/api";
import { PostCard, PostForm } from "~/components/posts";
import useInfiniteScroll from "~/utils/hooks/useInfiniteScroll";
import { LoadingSpinner } from "~/components/common";

const Feed = () => {
  const {
    data,
    isLoading: postsLoading,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = api.posts.getAll.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage?.nextCursor) {
          return lastPage?.nextCursor;
        }
        return undefined;
      },
    }
  );

  const loadMoreRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  const posts = data?.pages?.flatMap((page) => page?.posts);

  if (postsLoading) return <div>Loading...</div>;

  if (!posts) return <div>No posts to show</div>;

  return (
    <div className="rounded-xl-4 flex gap-4">
      <div className="flex grow flex-col gap-3">
        {posts?.map((postData) => (
          <PostCard key={postData?.id} {...postData} />
        ))}
        {hasNextPage && (
          <div ref={loadMoreRef} className="mt-2 flex justify-center">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <PageLayout>
        <div className="mb-5">
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
