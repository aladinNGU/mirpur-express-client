import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const CompletedDelivery = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;
  const queryClient = useQueryClient();

  // 🔹 Fetch Completed Parcels
  const {
    data: parcels = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["completedDeliveries", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/completed-parcels", {
        params: { email },
      });
      return res.data.data;
    },
  });

  // 🔹 Earning Calculation
  const calculateEarning = (parcel) => {
    const isSameDistrict = parcel.senderDistrict === parcel.receiverDistrict;
    return (parcel.deliveryCharge || 0) * (isSameDistrict ? 0.8 : 0.3);
  };

  const totalDeliveryCharge = parcels.reduce(
    (sum, parcel) => sum + (parcel.deliveryCharge || 0),
    0,
  );

  const totalRiderEarnings = parcels.reduce(
    (sum, parcel) =>
      parcel.cashoutStatus === "cashed out"
        ? sum
        : sum + calculateEarning(parcel),
    0,
  );

  // 🔥 Mutation (v5 safe)
  const cashoutMutation = useMutation({
    mutationFn: async (parcelId) => {
      const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["completedDeliveries", email],
      });

      Swal.fire({
        icon: "success",
        title: "Cashout Successful",
        text: "Your earning has been cashed out.",
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Cashout Failed",
        text:
          error?.response?.data?.message || "Something went wrong. Try again.",
      });
    },
  });

  const handleCashout = (parcelId, cashoutStatus) => {
    if (cashoutStatus === "cashed out") {
      Swal.fire("Already Cashed Out", "", "info");
      return;
    }
    Swal.fire({
      title: "Confirm Cash Out",
      text: "Are you sure you want to cash out this earning?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Cash Out",
    }).then((result) => {
      if (result.isConfirmed) {
        cashoutMutation.mutate(parcelId);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load completed deliveries.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-base-200 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Delivery Charge</p>
          <p className="text-xl font-bold text-primary">
            ৳ {totalDeliveryCharge.toFixed(2)}
          </p>
        </div>

        <div className="bg-success text-white p-4 rounded-xl shadow">
          <p className="text-sm">Available Rider Earnings</p>
          <p className="text-xl font-bold">৳ {totalRiderEarnings.toFixed(2)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Charge</th>
              <th>Earning</th>
              <th>Status</th>
              <th>Cashout</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.trackingId}</td>
                <td>৳ {parcel.deliveryCharge}</td>
                <td className="text-success font-semibold">
                  ৳ {calculateEarning(parcel).toFixed(2)}
                </td>
                <td>{parcel.deliveryStatus}</td>
                <td>
                  {parcel.cashoutStatus === "cashed out" ? (
                    <span className="badge badge-success">Cashed Out</span>
                  ) : (
                    <button
                      onClick={() =>
                        handleCashout(parcel._id, parcel.cashoutStatus)
                      }
                      disabled={cashoutMutation.isPending}
                      className="btn btn-sm btn-warning"
                    >
                      {cashoutMutation.isPending ? "Processing..." : "Cash Out"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedDelivery;
