import { useEffect, useState } from "react";
import t, { useToasterStore } from "react-hot-toast";

const useToast = ({ amount = 3 }: { amount?: number } = {}) => {
  const { toasts } = useToasterStore();

  const [toastLimit, setToastLimit] = useState<number>(amount);

  useEffect(() => {
    toasts
      .filter((tt) => tt.visible)
      .filter((_, i) => i >= toastLimit)
      .forEach((tt) => t.dismiss(tt.id));
  }, [toasts, toastLimit]);

  const toast = {
    ...t,
    setLimit: (l: number) => {
      if (l !== toastLimit) {
        setToastLimit(l);
      }
    },
  };

  return { toast };
};

export default useToast;
