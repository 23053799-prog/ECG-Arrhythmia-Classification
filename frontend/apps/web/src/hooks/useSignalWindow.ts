import { useQuery } from "@tanstack/react-query"

import { getSignalWindow } from "../api/client"

import type { SignalQuery } from "../api/types"

export function useSignalWindow(
  recordId: string | undefined,
  query: SignalQuery,
) {
  return useQuery({
    queryKey: [
      "signal",
      recordId,
      query.start_sec,
      query.end_sec,
      query.max_points ?? 4000,
    ],

    queryFn: () => {
      if (!recordId) {
        throw new Error("Record ID is required.")
      }

      return getSignalWindow(recordId, query)
    },

    enabled: Boolean(recordId),

    staleTime: 60 * 1000,
    retry: false,
  })
}