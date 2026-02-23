import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

dayjs.extend(isoWeek);

const MyEarnings = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  const [filter, setFilter] = useState("overall");

  // 🔹 Fetch Completed Parcels
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["myEarnings", email],
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

  // 🔥 Date Filter Logic
  const filteredParcels = useMemo(() => {
    const now = dayjs();

    return parcels.filter((parcel) => {
      const deliveredDate = dayjs(parcel.deliveredAt);
      if (!deliveredDate.isValid()) return false;

      if (filter === "today") {
        return deliveredDate.isSame(now, "day");
      }

      if (filter === "week") {
        return deliveredDate.isSame(now, "week");
      }

      if (filter === "month") {
        return deliveredDate.isSame(now, "month");
      }

      if (filter === "year") {
        return deliveredDate.isSame(now, "year");
      }

      return true; // overall
    });
  }, [parcels, filter]);

  // 🔹 Calculations
  const totalEarnings = filteredParcels.reduce(
    (sum, parcel) => sum + calculateEarning(parcel),
    0,
  );

  const totalCashedOut = filteredParcels
    .filter((parcel) => parcel.cashoutStatus === "cashed out")
    .reduce((sum, parcel) => sum + calculateEarning(parcel), 0);

  const totalPending = totalEarnings - totalCashedOut;

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 🔥 Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        {["overall", "today", "week", "month", "year"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`btn btn-sm ${
              filter === item ? "btn-primary text-black" : "btn-outline"
            }`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🔥 Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <div className="bg-base-200 p-6 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <h2 className="text-2xl font-bold text-primary">
            ৳ {totalEarnings.toFixed(2)}
          </h2>
        </div>

        {/* Cashed Out */}
        <div className="bg-success text-white p-6 rounded-xl shadow">
          <p className="text-sm">Total Cashed Out</p>
          <h2 className="text-2xl font-bold">৳ {totalCashedOut.toFixed(2)}</h2>
        </div>

        {/* Pending */}
        <div className="bg-warning text-white p-6 rounded-xl shadow">
          <p className="text-sm">Pending Earnings</p>
          <h2 className="text-2xl font-bold">৳ {totalPending.toFixed(2)}</h2>
        </div>
      </div>

      {/* 🔥 Details Table */}
      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Delivered At</th>
              <th>Charge</th>
              <th>Earning</th>
              <th>Cashout Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredParcels.map((parcel) => (
              <tr key={parcel._id}>
                <td>{parcel.trackingId}</td>
                <td>
                  {dayjs(parcel.deliveredAt).format("DD MMM YYYY, hh:mm A")}
                </td>
                <td>৳ {parcel.deliveryCharge}</td>
                <td className="font-semibold text-success">
                  ৳ {calculateEarning(parcel).toFixed(2)}
                </td>
                <td>
                  {parcel.cashoutStatus === "cashed out" ? (
                    <span className="badge badge-success">Cashed Out</span>
                  ) : (
                    <span className="badge badge-warning">Pending</span>
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

export default MyEarnings;
