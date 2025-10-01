import { apiService, CreateUserRequest } from '@/services/api'
import { useMutation, useQuery } from '@tanstack/react-query'


export function useCreateProfile() {
  return useMutation({
    mutationFn: (params: CreateUserRequest) => apiService.createUser(params),
  })
}


// export function useUpdateProfilePicture() {
//     return useMutation({
//       mutationFn: (params: UpdateUserResponse) => apiService.updateTimeEntry(params),
//     })
// }


export function useGetProfile() {
    return useQuery({
          queryKey: ['profile'],
          queryFn: () => apiService.getUser()
        })
}