import Link from "next/link";
import type { PropsWithChildren } from "react";

const HeaderContent = () => {
  return (
    <div className="flex gap-4">
      <div>
        <Link href="/">Logo</Link>
      </div>

      <div>
        <form role="search">
          <label htmlFor="search-input" className="sr-only">
            Search
          </label>
          <input id="search-input" type="search" placeholder="Search" />
        </form>
      </div>
    </div>
  );
};

const MainNavigation = () => {
  return (
    <nav className="">
      <ul className="flex gap-4">
        <li>Home</li>
        <li>Spaces</li>
        <li>Messages</li>
        <li>Notifications</li>
        <li>
          <button aria-label="User options">User dropdown</button>
        </li>
        <li>
          <button aria-label="More options">More Menu</button>
        </li>
      </ul>
    </nav>
  );
};

const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {/*      <header className="flex flex-row justify-between">
        <HeaderContent />
        <MainNavigation />
      </header> */}
      <main className="flex h-screen justify-center">
        <div className="h-full w-full overflow-y-scroll border-x border-slate-200 md:max-w-2xl">
          {children}
        </div>
      </main>
    </>
  );
};

export default PageLayout;
