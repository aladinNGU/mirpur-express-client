// src/pages/Dashboard/Rider/CompletedDelivery.jsx (Updated)
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useRiderBalance from "./useRiderBalance";
import CashoutHistory from "./CashoutHistory";
import CashoutModal from "./CashoutModal";

const CompletedDelivery = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;
  const [isCashoutModalOpen, setIsCashoutModalOpen] = useState(false);

  const {
    balance,
    totalEarnings,
    totalCashouted,
    hasPendingCashout,
    isLoading: balanceLoading,
  } = useRiderBalance();

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

  if (isLoading || balanceLoading) {
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
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Completed Deliveries ({parcels.length})
          </h2>

          {/* Cashout Button */}
          <button
            onClick={() => setIsCashoutModalOpen(true)}
            className="btn btn-success text-white"
            disabled={balance === 0 || hasPendingCashout}
          >
            {hasPendingCashout ? "Pending Request" : "Cashout Now"}
          </button>
        </div>

        {/* Balance Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {/* Total Delivery Charge */}
          <div className="bg-base-200 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Delivery Charge</p>
            <p className="text-xl font-bold text-primary">
              ৳ {totalDeliveryCharge.toFixed(2)}
            </p>
          </div>

          {/* Total Earnings */}
          <div className="bg-success text-white p-4 rounded-xl shadow">
            <p className="text-sm">Total Earnings</p>
            <p className="text-xl font-bold">৳ {totalEarnings.toFixed(2)}</p>
          </div>

          {/* Current Balance */}
          <div className="bg-info text-white p-4 rounded-xl shadow">
            <p className="text-sm">Current Balance</p>
            <p className="text-xl font-bold">৳ {balance.toFixed(2)}</p>
            <p className="text-xs mt-1">
              Cashouted: ৳ {totalCashouted.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Cashout History Section */}
        <div className="mt-6">
          <CashoutHistory />
        </div>
      </div>

      {/* Table (existing code remains the same) */}
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

      {/* Cashout Modal */}
      <CashoutModal
        isOpen={isCashoutModalOpen}
        onClose={() => setIsCashoutModalOpen(false)}
        balance={balance}
        hasPendingCashout={hasPendingCashout}
      />
    </div>
  );
};

export default CompletedDelivery;
