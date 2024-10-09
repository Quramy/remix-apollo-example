import {
  useReadQuery as useOriginalReadQuery,
  type UseReadQueryResult,
  type QueryRef,
} from "@apollo/client/index.js";

export function useReadQuery<TData>(
  queryRef: QueryRef<TData>
): UseReadQueryResult<TData> {
  return (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ("toPromise" in queryRef ? useOriginalReadQuery(queryRef) : queryRef) as any
  );
}
