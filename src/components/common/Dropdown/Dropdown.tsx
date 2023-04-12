import { Fragment, type HTMLAttributes } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

export const MenuItem = ({
  text,
  icon,
  disabled,
  ...props
}: {
  text: string;
  icon?: React.ReactNode;
  disabled?: boolean;
} & HTMLAttributes<HTMLButtonElement>) => {
  return (
    <Menu.Item
      disabled={disabled}
      as="button"
      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
      {...props}
    >
      {icon}
      {text}
    </Menu.Item>
  );
};

const Dropdown = ({ children }: { children: React.ReactNode }) => {
  if (!children) {
    return null;
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-neutral-600">
          <span className="sr-only">Open options</span>
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 max-h-52 w-56 origin-top-right divide-y divide-gray-100 overflow-y-scroll rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-neutral-700 dark:bg-neutral-800">
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
