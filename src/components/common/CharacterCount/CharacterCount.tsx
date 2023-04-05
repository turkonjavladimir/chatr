import { useEffect } from "react";
import { toast } from "react-hot-toast";

const CharacterCount = ({
  value,
  max,
  alwaysShow = false,
}: {
  value: number;
  max: number;
  alwaysShow?: boolean;
}) => {
  const remaining = max - value;
  const exceeded = remaining <= 0;

  useEffect(() => {
    if (exceeded) {
      toast("Character limit reached");
    }
  }, [exceeded]);

  if (!alwaysShow && !exceeded) return null;

  return (
    <span
      className={`text-sm ${
        exceeded ? "text-red-400" : "text-gray-500"
      } select-none`}
    >
      {remaining}
    </span>
  );
};

export default CharacterCount;
