import { signin, signOutUser } from '@/services/auth.services';
import { SignInFieldType } from '@/types/auth.type';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const route = useRouter();

  // ====================================================== //
  // ===================== Get a user ===================== //
  // =======================ADMIN======================== //
  //   const useGetUser = (id) => {
  //     return useQuery({
  //       queryKey: ['users', id],
  //       queryFn: () => fetchUserById(id),
  //       refetchOnWindowFocus: false,
  //       refetchOnReconnect: false,
  //     });
  //   };

  // ====================================================== //
  // ================== Get user profile ================== //
  // ====================================================== //
  //   const useGetMe = () => {
  //     return useQuery({
  //       queryKey: ['me'],
  //       queryFn: () => getMe(),
  //       refetchOnWindowFocus: false,
  //       refetchOnReconnect: false,
  //     });
  //   };

  // ====================================================== //
  // ==================== Get all users =================== //
  // =======================ADMIN======================== //
  //   const useGetAllUsers = (keyword, pageNumber) => {
  //     return useQuery({
  //       queryKey: ['users', keyword, pageNumber],
  //       queryFn: () => fetchAllUsers(keyword, pageNumber),
  //       select: (data) => data,
  //       refetchOnWindowFocus: false,
  //       refetchOnReconnect: false,
  //     });
  //   };

  // ====================================================== //
  // =================== Update profile =================== //
  // =============================================== //
  const useSignin = () => {
    const mutation = useMutation({
      mutationFn: async (values: SignInFieldType) => {
        await signin(values);
      },
      onSuccess: (data, variables) => {
        toast.success('You are logged in');
        route.push('/');
      },
      onError: (error) => {
        const errorMessage = (error as any).response?.data?.message || 'Failed to sign in';
        toast.error(errorMessage);
      },
    });

    return mutation;
  };
  const useSignout = () => {
    const mutation = useMutation({
      mutationFn: async () => {
        await signOutUser();
      },
      onSuccess: (data, variables) => {
        route.push('/sign-in');
      },
      onError: (error) => {
        const errorMessage = (error as any).response?.data?.message || 'Failed to sign out';
        toast.error(errorMessage);
      },
    });

    return mutation;
  };

  return { useSignin, useSignout };
};
