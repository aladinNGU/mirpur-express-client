// src/components/Rider/CashoutHistory.jsx
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const CashoutHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: cashouts = [], isLoading } = useQuery({
    queryKey: ["cashoutHistory", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/cashout-history", {
        params: { email: user?.email },
      });
      return res.data.data;
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="badge badge-success text-white">Completed</span>
        );
      case "Pending":
        return <span className="badge badge-warning">Pending</span>;
      case "Rejected":
        return <span className="badge badge-error text-white">Rejected</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <span className="loading loading-spinner loading-sm"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-xl shadow overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Cashout History</h3>
      </div>

      {cashouts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No cashout history yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {cashouts.map((cashout) => (
                <tr key={cashout._id}>
                  <td>{new Date(cashout.requestDate).toLocaleDateString()}</td>
                  <td className="font-semibold">
                    ৳ {cashout.amount.toFixed(2)}
                  </td>
                  <td>{getStatusBadge(cashout.status)}</td>
                  <td className="text-sm">{cashout.transactionId || "-"}</td>
                  <td className="text-sm text-gray-500">
                    {cashout.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CashoutHistory;
