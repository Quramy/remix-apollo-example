import type { QueryRef } from "@apollo/client/index.js";

import {
  useReadQuery as useOriginalReadQuery,
  type UseReadQueryResult,
} from "@apollo/client/react/hooks/useReadQuery.js";

export function useReadQuery<TData>(
  queryRef: QueryRef<TData>
): UseReadQueryResult<TData> {
  return (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    "toPromise" in queryRef ? useOriginalReadQuery(queryRef) : queryRef
  ) as any;
}
