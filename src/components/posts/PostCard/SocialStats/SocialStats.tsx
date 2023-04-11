import Link from "next/link";
import {
  HeartIcon,
  ArrowPathRoundedSquareIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/solid";

const SocialStats = ({
  likesCount,
  commentsCount,
}: {
  likesCount: number;
  commentsCount: number;
}) => {
  return (
    <div className="my-1 flex items-center justify-between gap-3 text-sm">
      <Link href="/">
        <div className="flex items-center justify-center gap-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-500">
            <HeartIcon className="h-3 w-3 text-white" />
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600">
            <ArrowPathRoundedSquareIcon className="h-3 w-3 text-white" />
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500">
            <ArrowUpOnSquareIcon className="h-3 w-3 text-white" />
          </span>
          <span className="ml-1 text-sm text-gray-500">{likesCount}</span>
        </div>
      </Link>
      <div className="flex">
        <span className="min-w-0 truncate text-sm text-gray-500">
          {commentsCount} Comments
        </span>
      </div>
    </div>
  );
};

export default SocialStats;
