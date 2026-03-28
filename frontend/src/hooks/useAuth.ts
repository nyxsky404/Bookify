import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService, AuthUser, LoginDto, RegisterDto } from "@/lib/auth";
import { toast } from "sonner";

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auth", "user"],
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated(),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginDto) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterDto) => authService.register(userData),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], data.user);
      toast.success(`Welcome to Bookify, ${data.user.name}!`);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Logout failed");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name?: string; address?: string; phone?: string }) =>
      authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["auth", "user"], updatedUser);
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Profile update failed");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      authService.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Password change failed");
    },
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
}
