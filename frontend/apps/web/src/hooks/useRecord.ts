import { useQuery } from "@tanstack/react-query"

import { getRecord } from "../api/client"

export function useRecord(recordId: string | undefined) {
  return useQuery({
    queryKey: ["record", recordId],
    queryFn: () => {
      if (!recordId) {
        throw new Error("Record ID is required.")
      }

      return getRecord(recordId)
    },
    enabled: Boolean(recordId),
    retry: false,
  })
}