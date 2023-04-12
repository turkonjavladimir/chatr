import Link from "next/link";
import type { PropsWithChildren } from "react";

import Header from "./layout/Header";

const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/*      <header className="flex flex-row justify-between">
        <HeaderContent />
        <MainNavigation />
      </header> */}
      <Header />
      <main className="flex h-screen justify-center">
        <div className="h-full w-full overflow-y-scroll border-x border-slate-200 md:max-w-2xl">
          {children}
        </div>
      </main>
    </>
  );
};

export default PageLayout;
