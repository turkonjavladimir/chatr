import Image from "next/image";
import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const avatar = cva(
  "inline-flex items-center justify-center rounded-full cursor-pointer md:text-sm",
  {
    variants: {
      size: {
        sm: ["w-8", "h-8"],
        md: ["w-10", "h-10"],
        lg: ["w-12", "h-12"],
        xl: ["w-14", "h-14"],
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

type AvatarProps = {
  label?: string;
  imageUrl?: string;
} & HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof avatar>;

const getInitials = (label: string) => {
  label = label.trim();

  if (label.length <= 3) return label;

  return (
    label
      ?.split(/\s+/)
      .map((w) => [...w][0])
      .slice(0, 3)
      .join("") ?? ""
  );
};

const Avatar = ({
  label = "",
  imageUrl = "",
  size,
  className,
}: AvatarProps) => {
  return (
    <span
      className={`${avatar({
        size,
        className,
      })}`}
    >
      {!imageUrl ? (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tl from-slate-300 text-xs font-medium leading-none text-black shadow-md dark:text-neutral-200 ">
          {getInitials(label)}
        </span>
      ) : (
        <Image
          className="rounded-full object-cover shadow-md"
          alt="profile-image"
          width={50}
          height={50}
          src={imageUrl}
        />
      )}
    </span>
  );
};

export default Avatar;
