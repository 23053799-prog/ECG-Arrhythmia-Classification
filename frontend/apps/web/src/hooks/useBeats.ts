import { useQuery } from "@tanstack/react-query"

import { getBeats } from "../api/client"

import type { BeatQuery } from "../api/types"

export function useBeats(
  recordId: string | undefined,
  query: BeatQuery = {},
) {
  return useQuery({
    queryKey: ["beats", recordId, query],

    queryFn: () => {
      if (!recordId) {
        throw new Error("Record ID is required.")
      }

      return getBeats(recordId, query)
    },

    enabled: Boolean(recordId),
    staleTime: 15000,
    retry: false,
  })
}