import Link from "next/link";
import { useRouter } from "next/router";
import { Menu } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";

import useToast from "~/utils/hooks/useToast";
import { Avatar, Dropdown, MenuItem } from "~/components/common";

import Icon, { type IconName } from "~/components/common/Icon/Icon";

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

const NavigationItem = ({ href, icon }: { href: string; icon: IconName }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-2 rounded-full p-2 ${
          isActive ? "bg-sky-100" : "bg-transparent"
        }`}
      >
        <Icon
          name={icon}
          className={`h-5 w-5 ${isActive ? "text-sky-600" : "text-gray-500"}`}
          variant={isActive ? "solid" : "outline"}
        />
      </Link>
    </li>
  );
};

const UserDropdownButton = ({
  name,
  imageUrl,
}: {
  imageUrl: string;
  name: string;
}) => {
  return (
    <Menu.Button className="flex min-w-0 items-center rounded-full bg-gray-200 p-1 transition-colors hover:bg-gray-300">
      <Avatar size="xs" imageUrl={imageUrl} label={name} />
      <span className="mx-2 min-w-0 truncate text-xs font-semibold">
        {name}
      </span>
    </Menu.Button>
  );
};

const MainNavigation = () => {
  const { data: sessionData } = useSession();
  const { toast } = useToast();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    toast.loading("Logging out...", {
      duration: 1000,
      position: "top-center",
    });
    void signOut();
  };

  return (
    <nav className="flex items-center">
      <ul className="flex gap-2">
        <NavigationItem href="/" icon="home" />
        <NavigationItem href="/explore" icon="magnifyingGlass" />
        <NavigationItem href="/messages" icon="envelope" />
        <NavigationItem href="/notifications" icon="bell" />
      </ul>

      <div className="mr-3 h-8 w-[1px] rounded-full bg-neutral-200" />

      {sessionData && (
        <Dropdown
          button={
            <UserDropdownButton
              imageUrl={sessionData.user.image ?? ""}
              name={sessionData.user.name ?? ""}
            />
          }
        >
          <div>
            <span className="my-2 block px-2 text-xs font-semibold text-neutral-500">
              {sessionData?.user?.email}
            </span>
            <MenuItem text="Profile" href={`/${sessionData?.user?.id}`} />
            <MenuItem text="Settings" />
            <MenuItem text="Logout" onClick={handleLogout} />
          </div>
        </Dropdown>
      )}

      {!sessionData && (
        <button
          className="rounded-full bg-neutral-800 px-2 py-1 text-xs font-semibold text-white no-underline transition"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      )}

      {/* <button aria-label="More options">Menu</button> */}
    </nav>
  );
};

const Header = () => {
  return (
    <header className="flex items-center justify-between gap-3 px-4 py-2">
      <HeaderContent />
      <MainNavigation />
    </header>
  );
};

export default Header;
