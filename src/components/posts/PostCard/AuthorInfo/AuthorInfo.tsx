import Link from "next/link";
import type { ReactNode } from "react";

import { Avatar } from "~/components/common";
import type { RouterOutputs } from "~/utils/api";

type Author = RouterOutputs["posts"]["getAll"][number]["author"];
const AuthorInfo = ({
  author,
  children,
}: {
  author: Author;
  children: ReactNode;
}) => (
  <div className="flex">
    <Link href={`/${author?.id ?? ""}`}>
      <Avatar
        size="lg"
        label={author.name ?? ""}
        imageUrl={author?.image ?? ""}
      />
    </Link>
    <div className="ml-4 flex w-full flex-col gap-1">
      <div className="flex min-w-0 items-baseline gap-1">
        <Link
          href={`/${author.id}`}
          className="truncate font-semibold hover:underline"
        >
          {author.name}
        </Link>
        <Link
          href={`/${author.id}`}
          className="truncate text-sm font-semibold lowercase text-gray-500 hover:underline"
        >{`@${author.name?.toLowerCase() ?? ""}`}</Link>
      </div>
      {children}
    </div>
  </div>
);

export default AuthorInfo;
