import Head from "next/head";
import type { GetStaticProps, NextPage } from "next";

import PageLayout from "~/components/layout";
import { PostView } from "~/components/posts";

import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";

const SinglePost: NextPage<{ id: string }> = ({ id }) => {
  const { data: postData } = api.posts.getById.useQuery({ id });

  if (!postData) return <span>Post not found</span>;

  return (
    <>
      <Head>
        <title>{`${postData?.author?.name ?? ""}: ${postData?.content}`}</title>
      </Head>
      <PageLayout>
        <PostView {...postData} redirectOnDelete={true} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context?.params?.id ?? "";

  if (typeof id !== "string") throw new Error("Id is not a string");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePost;
