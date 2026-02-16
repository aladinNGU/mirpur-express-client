import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { format } from "date-fns";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: payments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?${user?.email}`);
      return res.data;
    },
  });

  console.log("Payments", payments);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load payment history.
      </div>
    );
  }

  return (
    <div>
      <table className="table table-zebra">
        <thead className="bg-base-200 text-base-content">
          <tr>
            <th>#</th>
            <th>Transaction</th>
            <th>Parcel</th>
            <th>Amount</th>
            <th>Paid By</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {payments?.length > 0 ? (
            payments.map((payment, index) => (
              <tr key={payment._id} className="hover">
                <td>{index + 1}</td>

                <td className="font-mono text-sm">{payment.transactionId}</td>

                <td className="text-sm">
                  {payment.parcelId?.toString().slice(-6)}
                </td>

                <td className="font-semibold text-primary">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: payment.currency?.toUpperCase() || "USD",
                  }).format(payment.amount)}
                </td>

                <td className="text-sm">{payment.paidBy}</td>

                <td className="text-sm">
                  {format(new Date(payment.paidAt), "dd MMM yyyy, hh:mm a")}
                </td>

                <td>
                  <span className="badge badge-success badge-sm">Paid</span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center py-10 text-base-content/60"
              >
                No payment history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
