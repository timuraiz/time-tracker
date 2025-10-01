import { apiService } from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export function useLeaderboard() {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => apiService.getLeaderboard(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}
