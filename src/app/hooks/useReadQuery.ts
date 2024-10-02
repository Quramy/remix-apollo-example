import {
  useReadQuery as useAcReadQuery,
  type QueryRef,
} from "@apollo/client/index.js";

import { type UseReadQueryResult } from "@apollo/client/react/hooks/useReadQuery.js";

export function useReadQuery<TData>(
  queryRef: QueryRef<TData>
): UseReadQueryResult<TData> {
  return ("toPromise" in queryRef ? useAcReadQuery(queryRef) : queryRef) as any;
}
