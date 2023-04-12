import Head from "next/head";
import { Suspense, lazy } from "react";
import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";

const LazyToaster = lazy(() =>
  import("react-hot-toast").then((module) => ({ default: module.Toaster }))
);

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Chatr</title>
        <meta
          name="description"
          content="Chatr: A haven for tweets without Elongated Muskrat's influence!"
        />
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <LazyToaster position="bottom-center" />
      </Suspense>
      <Component {...pageProps} />
      <Analytics />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
