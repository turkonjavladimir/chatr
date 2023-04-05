import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";

import { PostForm } from "~/components";
import PageLayout from "~/components/layout";

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

        {sessionData && (
          <div className="m-4">
            <PostForm />
          </div>
        )}
      </PageLayout>
    </>
  );
};

export default Home;
