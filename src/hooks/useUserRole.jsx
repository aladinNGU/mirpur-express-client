// hooks/useUserRole.js
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserRole = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/role?email=${user.email}`);
      return res.data;
    },
  });
  return {
    role: data?.role || "user",
    roleLoading: loading || isLoading,
  };
};

export default useUserRole;
