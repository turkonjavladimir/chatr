import type { GetStaticProps, NextPage } from "next";

import PageLayout from "~/components/layout";
import { PostView } from "~/components/posts";

import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";

const Profile: NextPage<{ slug: string }> = ({ slug }) => {
  const { data: posts, isLoading } = api.posts.getByUserId.useQuery({
    id: slug,
  });

  if (isLoading) return <div>Loading</div>;

  if (!posts || posts.length === 0) return <span>No posts yet</span>;

  console.log("posts", posts);
  return (
    <>
      <PageLayout>
        <div>
          <h1>Profile</h1>
          {posts.map((postData) => (
            <PostView key={postData.id} {...postData} />
          ))}
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
