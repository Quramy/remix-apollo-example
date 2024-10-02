import type { QueryRef } from "@apollo/client/index.js";

import {
  useReadQuery as useOriginalReadQuery,
  type UseReadQueryResult,
} from "@apollo/client/react/hooks/useReadQuery.js";

export function useReadQuery<TData>(
  queryRef: QueryRef<TData>
): UseReadQueryResult<TData> {
  return (
    "toPromise" in queryRef ? useOriginalReadQuery(queryRef) : queryRef
  ) as any;
}
