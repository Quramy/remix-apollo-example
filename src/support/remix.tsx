import { useLoaderData as useRemixLoaderData } from "@remix-run/react";

export function useLoaderData<
  T extends (...args: any[]) => any = (...args: any[]) => any
>(): Awaited<ReturnType<T>> {
  const result = useRemixLoaderData();
  return result as Awaited<ReturnType<T>>;
}
