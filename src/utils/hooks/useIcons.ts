import { useMemo } from "react";
import {
  BellIcon as BellIconOutline,
  EnvelopeIcon as EnvelopeIconOutline,
  HomeIcon as HomeIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  Squares2X2Icon as Squares2X2IconOutline,
} from "@heroicons/react/24/outline";

import {
  BellIcon as BellIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  HomeIcon as HomeIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
} from "@heroicons/react/24/solid";

export const icons = {
  bell: {
    outline: BellIconOutline,
    solid: BellIconSolid,
  },
  envelope: {
    outline: EnvelopeIconOutline,
    solid: EnvelopeIconSolid,
  },
  home: {
    outline: HomeIconOutline,
    solid: HomeIconSolid,
  },
  magnifyingGlass: {
    outline: MagnifyingGlassIconOutline,
    solid: MagnifyingGlassIconSolid,
  },
  squares2X2: {
    outline: Squares2X2IconOutline,
    solid: Squares2X2IconSolid,
  },
} as const;

export const useIcons = () => {
  const memoizedIcons = useMemo(() => icons, []);
  return memoizedIcons;
};
