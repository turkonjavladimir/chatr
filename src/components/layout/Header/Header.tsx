import Link from "next/link";
import { useRouter } from "next/router";
import { Menu } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";

import useToast from "~/utils/hooks/useToast";
import { Avatar, Dropdown, MenuItem } from "~/components/common";

import Icon, { type IconName } from "~/components/common/Icon/Icon";

const LogoAndSearch = () => {
  return (
    <div className="flex w-full items-center gap-4">
      <div>
        <Link href="/">Logo</Link>
      </div>

      <form role="search" className="flex grow">
        <div className="flex max-w-xs grow rounded-lg bg-gray-100 px-2 shadow-sm ring-1 ring-inset ring-gray-100">
          <input
            type="text"
            name="search"
            id="search"
            className="block max-w-md flex-1 grow border-0 bg-transparent py-1.5 pl-1 text-gray-900 outline-none placeholder:text-gray-500 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="# Explore"
          />
        </div>
      </form>
    </div>
  );
};

const NavbarItem = ({ href, icon }: { href: string; icon: IconName }) => {
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
          className={`h-6 w-6 ${isActive ? "text-sky-600" : "text-gray-500"}`}
          variant={isActive ? "solid" : "outline"}
        />
      </Link>
    </li>
  );
};

const UserMenuButton = ({
  name,
  imageUrl,
}: {
  imageUrl: string;
  name: string;
}) => {
  return (
    <Menu.Button className="flex max-w-[160px] items-center rounded-full bg-gray-100 p-1 transition-colors hover:bg-gray-200">
      <span className="flex items-center">
        <Avatar
          size="xs"
          imageUrl={imageUrl}
          label={name}
          className="min-w-0"
        />
      </span>
      <span className="mx-2 truncate text-xs font-semibold text-gray-700">
        {name}
      </span>
    </Menu.Button>
  );
};

const Navbar = () => {
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
        <NavbarItem href="/" icon="home" />
        <NavbarItem href="/explore" icon="magnifyingGlass" />
        <NavbarItem href="/messages" icon="envelope" />
        <NavbarItem href="/notifications" icon="bell" />
      </ul>

      <div className="mr-3 h-8 w-[1px] rounded-full bg-neutral-200" />

      <div className="flex items-center gap-3">
        {sessionData && (
          <Dropdown
            button={
              <UserMenuButton
                imageUrl={sessionData.user.image ?? ""}
                name={sessionData.user.name ?? ""}
              />
            }
          >
            <div>
              <span className="my-2 block px-2 text-xs font-semibold text-neutral-400">
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

        <button aria-label="menu">
          <Icon name="squares2X2" className="h-6 w-6 text-gray-500" />
        </button>
      </div>
    </nav>
  );
};

const Header = () => {
  const { data: sessionData } = useSession();
  return (
    <header className="m-auto max-w-6xl">
      <div className="flex h-16 w-full items-center justify-between gap-3 px-4 py-3">
        {/* Mobile layout */}
        <div className="flex w-full justify-between md:hidden">
          <div className="flex items-center">
            <Avatar
              size="md"
              imageUrl={sessionData?.user.image ?? ""}
              label={sessionData?.user?.name ?? ""}
            />
          </div>

          <div className="flex items-center">
            <Link href="/">Logo</Link>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden w-full items-center justify-between md:flex">
          <LogoAndSearch />
          <Navbar />
        </div>
      </div>
    </header>
  );
};

export default Header;
