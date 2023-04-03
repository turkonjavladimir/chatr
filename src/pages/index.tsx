import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chatr</title>
        <meta
          name="description"
          content="Chatr: A haven for tweets without Elongated Muskrat's influence!"
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h2>Hello world</h2>
        </div>
      </main>
    </>
  );
};

export default Home;
