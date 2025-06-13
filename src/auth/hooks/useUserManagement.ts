import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../../lib/supabase';
import { UserProfile } from '../types';

interface UpdateProfileInput {
  userId: string;
  updates: Partial<UserProfile>;
}

interface ExtendedUserProfile extends UserProfile {
  id: string;
}

type ProfileQueryKey = ['profiles'] | ['profile', string];

export const useUserManagement = () => {
  const queryClient = useQueryClient();

  const updateUserProfile = useMutation<ExtendedUserProfile, Error, UpdateProfileInput>({
    mutationFn: async ({ userId, updates }) => {
      const result = await updateProfile(userId, updates);
      if (!result) {
        throw new Error('Failed to update profile');
      }
      return { ...result, id: userId };
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.setQueryData(['profile', data.id], data);
    },
  });

  return {
    updateProfile: (userId: string, updates: Partial<UserProfile>) =>
      updateUserProfile.mutateAsync({ userId, updates }),
    isUpdating: updateUserProfile.isPending,
    updateError: updateUserProfile.error,
  };
};

export default useUserManagement;