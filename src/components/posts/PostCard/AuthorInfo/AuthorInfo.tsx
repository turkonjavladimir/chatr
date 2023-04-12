import { TrashIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  Avatar,
  Dropdown,
  LoadingSpinner,
  MenuItem,
} from "~/components/common";

import type { RouterOutputs } from "~/utils/api";
import { usePost } from "../../hooks/usePost";

type Author = RouterOutputs["posts"]["getAll"][number]["author"];
const AuthorInfo = ({
  author,
  children,
  postId,
}: {
  author: Author;
  children: ReactNode;
  postId: string;
}) => {
  const { data: sessionData } = useSession();
  const isPostOwner = author.id === sessionData?.user?.id;

  const { handleDeletePost, isDeleting } = usePost({
    postId,
  });

  return (
    <div className="flex">
      <Link href={`/${author?.id ?? ""}`}>
        <Avatar
          size="lg"
          label={author.name ?? ""}
          imageUrl={author?.image ?? ""}
        />
      </Link>
      <div className="ml-4 flex w-full flex-col gap-1">
        <div className="flex min-w-0 items-center justify-between gap-1">
          <div className="flex items-center gap-1">
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

          <Dropdown>
            <div>
              <MenuItem disabled={true} text="Edit" />
              {isPostOwner && (
                <MenuItem
                  disabled={isDeleting}
                  text="Delete"
                  icon={
                    isDeleting ? (
                      <LoadingSpinner />
                    ) : (
                      <TrashIcon className="h-4 w-4 text-red-400" />
                    )
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void handleDeletePost();
                  }}
                />
              )}
            </div>
          </Dropdown>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthorInfo;
