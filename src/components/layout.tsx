import type { PropsWithChildren } from "react";

import Header from "./layout/Header";
/* import { ProfileWidget } from "./profile";
 */
const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      {/*       <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 justify-center gap-4 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:flex">
            <ProfileWidget />
          </aside>
          <main className="flex h-full justify-center lg:col-span-6">
            <div className="w-full">{children}</div>
          </main>
          <aside className="hidden bg-blue-100 lg:col-span-3 lg:flex">
            <div>Right side</div>
          </aside>
        </div>
      </div> */}
      <main className="mx-4">
        <div className="mx-auto lg:max-w-7xl">
          {/* Main 3 column grid */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left column */}
            <aside className="hidden grid-cols-1 lg:col-span-3 lg:grid">
              <section aria-labelledby="section-2-title">
                {/*                 <ProfileWidget /> */}
              </section>
            </aside>

            {/* Center column */}
            <div className="grid grid-cols-1 gap-4 lg:col-span-6">
              <section aria-labelledby="section-1-title">
                <div className="overflow-hidden">{children}</div>
              </section>
            </div>

            {/* Right column */}
            <aside className="hidden grid-cols-1 lg:col-span-3 lg:grid">
              <section aria-labelledby="section-2-title">
                <span>Right column</span>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default PageLayout;
