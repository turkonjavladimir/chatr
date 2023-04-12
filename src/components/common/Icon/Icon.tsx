import { Fragment } from "react";
import { useIcons } from "~/utils/hooks/useIcons";

export type IconName = "home" | "envelope" | "magnifyingGlass" | "bell";

interface IconProps {
  name: IconName;
  variant?: "outline" | "solid";
  className?: string;
}

const Icon = ({
  name,
  variant = "outline",
  className = "",
  ...props
}: IconProps) => {
  const icons = useIcons();
  const IconComponent = icons[name]?.[variant] || Fragment;

  return <IconComponent className={`${className}`} {...props} />;
};

export default Icon;
