import { apiService, CreateTimeEntryRequest, GetTimeEntriesRequest, UpdateTimeEntryRequest } from '@/services/api'
import { useMutation, useQuery } from '@tanstack/react-query'


export function useCreateTimeEntry() {
  return useMutation({
    mutationFn: (params: CreateTimeEntryRequest) => apiService.createTimeEntry(params),
  })
}


export function useUpdateTimeEntry() {
    return useMutation({
      mutationFn: (params: UpdateTimeEntryRequest) => apiService.updateTimeEntry(params),
    })
}


export function useGetTimeEntries(params: GetTimeEntriesRequest = {}) {
    return useQuery({
          queryKey: ['time-entries', params],
          queryFn: () => apiService.getTimeEntries(params)
        })
}