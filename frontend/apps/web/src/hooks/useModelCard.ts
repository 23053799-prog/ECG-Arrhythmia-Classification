import { useQuery } from "@tanstack/react-query"

import { getModelCard } from "../api/client"

export function useModelCard() {
  return useQuery({
    queryKey: ["model-card"],
    queryFn: getModelCard,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}