import type { z } from "zod";
import { useForm } from "react-hook-form";
import type { UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}
