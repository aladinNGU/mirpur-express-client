// src/hooks/useRiderBalance.js
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const useRiderBalance = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  const {
    data: balanceData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["riderBalance", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/balance", {
        params: { email },
      });
      return res.data.data;
    },
  });

  return {
    balance: balanceData?.currentBalance || 0,
    totalEarnings: balanceData?.totalEarnings || 0,
    totalCashouted: balanceData?.totalCashouted || 0,
    hasPendingCashout: balanceData?.hasPendingCashout || false,
    pendingCashoutAmount: balanceData?.pendingCashoutAmount || 0,
    isLoading,
    isError,
    refetch,
  };
};

export default useRiderBalance;
