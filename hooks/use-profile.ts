import { useAuthContext } from '@/hooks/use-auth-context'
import { apiService, CreateUserRequest } from '@/services/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

export interface UserData {
  name: string
  email: string
  avatarUrl: string
  joinedDate: string
  rank: string
  level: string
  levelColor: string
}

export interface UserStats {
  totalHours: number
  totalSessions: number
  longestStreak: number
  currentStreak: number
  averagePerDay: number
  level: string
  levelColor: string
}

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
    queryFn: () => apiService.getUser(),
    staleTime: 1800000, // 30 minutes
  })
}

export function useUserData(): UserData {
  const { session } = useAuthContext()
  const { data: profileData } = useGetProfile()

  return useMemo(() => {
    const name = profileData?.data?.name || session?.user?.user_metadata?.name || 'User'
    const email = session?.user?.email || ''
    const profilePictureUrl = profileData?.data?.profile_picture_url || session?.user?.user_metadata?.avatar_url

    return {
      name,
      email,
      avatarUrl: profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=200`,
      joinedDate: new Date(
        profileData?.data?.created_at || session?.user?.created_at || Date.now()
      ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      rank: profileData?.data?.rank || '#1',
      level: profileData?.data?.level || 'Unknown',
      levelColor: profileData?.data?.level_color || '#3b82f6',
    }
  }, [profileData, session])
}

export function useUserStats(): UserStats {
  const { data: profileData } = useGetProfile()

  return useMemo(() => ({
    totalHours: profileData?.data?.total_hours || 0,
    totalSessions: profileData?.data?.total_sessions || 0,
    longestStreak: 0,
    currentStreak: profileData?.data?.current_streak || 0,
    averagePerDay: profileData?.data?.dayily_avg || 0,
    level: profileData?.data?.level || 'Newbie',
    levelColor: profileData?.data?.level_color || '#3b82f6',
  }), [profileData])
}