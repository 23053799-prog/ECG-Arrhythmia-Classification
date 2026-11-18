import { useQuery } from "@tanstack/react-query"

import { getTimeline } from "../api/client"

export function useTimeline(
  recordId: string | undefined,
  binSec = 60,
) {
  return useQuery({
    queryKey: ["timeline", recordId, binSec],

    queryFn: () => {
      if (!recordId) {
        throw new Error("Record ID is required.")
      }

      return getTimeline(recordId, binSec)
    },

    enabled: Boolean(recordId),
    staleTime: 30000,
    retry: false,
  })
}