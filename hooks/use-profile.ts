import { apiService, CreateUserRequest } from '@/services/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'


export function useCreateProfile() {
  return useMutation({
    mutationFn: (params: CreateUserRequest) => apiService.createUser(params),
  })
}


export function useUploadProfilePicture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ uri, fileName, mimeType }: { uri: string; fileName: string; mimeType: string }) =>
      apiService.uploadProfilePicture(uri, fileName, mimeType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    }
  })
}


export function useGetProfile() {
    return useQuery({
          queryKey: ['profile'],
          queryFn: () => apiService.getUser()
        })
}