import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import dayjs from "dayjs";

const TrackParcel = () => {
  const axiosSecure = useAxiosSecure();
  const [trackingId, setTrackingId] = useState("");
  const [searchId, setSearchId] = useState("");

  const { data: trackingData = [], isLoading } = useQuery({
    queryKey: ["trackingData", searchId],
    enabled: !!searchId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/trackings/${searchId}`);
      return res.data;
    },
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Parcel created":
        return "badge badge-info";
      case "Payment Paid":
        return "badge badge-success";
      case "Rider Assigned":
        return "badge badge-primary text-black";
      case "In transit":
        return "badge badge-warning";
      case "Delivery Completed":
        return "badge badge-success";
      default:
        return "badge badge-neutral";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Track Parcel</h2>

      {/* 🔎 Search Section */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="input input-bordered w-full"
        />
        <button
          className="btn btn-primary text-black"
          onClick={() => setSearchId(trackingId)}
        >
          Track
        </button>
      </div>

      {/* 🔄 Loading */}
      {isLoading && (
        <div className="flex justify-center py-6">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* 📋 Table */}
      {trackingData.length > 0 && (
        <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Status</th>
                <th>Details</th>
                <th>Updated By</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {trackingData.map((item) => (
                <tr key={item._id}>
                  <td>
                    <span className={getStatusBadge(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.details}</td>
                  <td>{item.updatedBy}</td>
                  <td>
                    {dayjs(item.timestamp).format("DD MMM YYYY, hh:mm A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ❌ No Data */}
      {searchId && !isLoading && trackingData.length === 0 && (
        <div className="text-center text-gray-500 py-6">
          No tracking data found.
        </div>
      )}
    </div>
  );
};

export default TrackParcel;
