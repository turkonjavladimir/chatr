import type { GetStaticProps, NextPage } from "next";

import PageLayout from "~/components/layout";
import { PostCard } from "~/components/posts";

import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";

const Profile: NextPage<{ slug: string }> = ({ slug }) => {
  const { data: posts, isLoading } = api.posts.getByUserId.useQuery({
    id: slug,
  });

  if (isLoading) return <div>Loading</div>;

  if (!posts || posts.length === 0) return <span>No posts yet</span>;

  return (
    <>
      <PageLayout>
        <div className="rounded-xl-4 flex gap-4">
          <div className="mx-4 flex grow flex-col gap-3">
            <h1>Profile Page</h1>
            {posts.map((postData) => (
              <PostCard key={postData.id} {...postData} />
            ))}
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const slug = context?.params?.slug;

  if (typeof slug !== "string") throw new Error("Slug is not a string");

  await ssg.profile.getById.prefetch({ id: slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      slug,
    },
    revalidate: 5,
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default Profile;
