import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const CompletedDelivery = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;
  // const queryClient = new QueryClient();

  // ✅ Fetch Completed Parcels
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

  // ✅ Calculate Rider Earning Per Parcel
  const calculateEarning = (parcel) => {
    const isSameDistrict = parcel.senderDistrict === parcel.receiverDistrict;

    const percentage = isSameDistrict ? 0.8 : 0.3;

    return (parcel.deliveryCharge || 0) * percentage;
  };

  // ✅ Total Delivery Charge
  const totalDeliveryCharge = parcels.reduce(
    (sum, parcel) => sum + (parcel.deliveryCharge || 0),
    0,
  );

  // ✅ Total Rider Earnings
  const totalRiderEarnings = parcels.reduce(
    (sum, parcel) => sum + calculateEarning(parcel),
    0,
  );

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

  // // Mutation for cashout
  // const { mutateAsync: cashout } = useMutation({
  //   mutationFn: async (parcelId) => {
  //     const res = await axiosSecure.patch(`/parcels/${parcelId}/cashout`);
  //     return res.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(["completeDeliveries"]);
  //   },
  // });

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Completed Deliveries ({parcels.length})
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Total Delivery Charge */}
          <div className="bg-base-200 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Delivery Charge</p>
            <p className="text-xl font-bold text-primary">
              ৳ {totalDeliveryCharge.toFixed(2)}
            </p>
          </div>

          {/* Total Rider Earnings */}
          <div className="bg-success text-white p-4 rounded-xl shadow">
            <p className="text-sm">Total Rider Earnings</p>
            <p className="text-xl font-bold">
              ৳ {totalRiderEarnings.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>Tracking ID</th>
              <th>Parcel</th>
              <th>Receiver</th>
              <th>Area</th>
              <th>Delivery Charge</th>
              <th>Rider Earning</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td className="font-semibold text-primary">
                  {parcel.trackingId}
                </td>

                <td>
                  {parcel.parcelType}
                  <div className="text-sm text-gray-500">
                    {parcel.parcelName}
                  </div>
                </td>

                <td>
                  {parcel.receiverName}
                  <div className="text-sm text-gray-500">
                    {parcel.receiverContact}
                  </div>
                </td>

                <td>
                  {parcel.receiverDistrict}
                  <div className="text-xs text-gray-400">
                    {parcel.receiverArea}
                  </div>
                </td>

                <td>৳ {parcel.deliveryCharge}</td>

                <td className="font-semibold text-success">
                  ৳ {calculateEarning(parcel).toFixed(2)}
                </td>

                <td>
                  <span
                    className={`badge text-xs font-bold ${
                      parcel.deliveryStatus === "Delivered"
                        ? "badge-success"
                        : "badge-accent"
                    }`}
                  >
                    {parcel.deliveryStatus}
                  </span>
                </td>

                <td>{new Date(parcel.creationDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {parcels.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No Completed Deliveries Yet
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedDelivery;
