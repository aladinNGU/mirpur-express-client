import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;
  console.log(email);

  // ✅ Fetch Pending Deliveries
  const {
    data: parcels = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["pendingDeliveries", email],
    enabled: !!email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/parcels?email=${email}`);
      return res.data.data;
    },
  });
  console.log(parcels);

  // ✅ Update Status
  const handleStatusUpdate = async (parcel) => {
    let newStatus = "";

    if (parcel.deliveryStatus === "Rider assigned") {
      newStatus = "In transit";
    } else if (parcel.deliveryStatus === "In transit") {
      newStatus = "Delivery Completed";
    }

    const confirm = await Swal.fire({
      title: "Confirm Update",
      text: `Mark as ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/parcels/${parcel._id}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        Swal.fire("Success", "Status Updated", "success");

        // ✅ Refetch fresh data
        refetch();
      }
    } catch (error) {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Pending Deliveries ({parcels.length})
      </h2>

      <div className="overflow-x-auto bg-base-100 rounded-xl shadow">
        <table className="table table-zebra">
          <thead className="bg-base-200">
            <tr>
              <th>Tracking</th>
              <th>Parcel</th>
              <th>Receiver</th>
              <th>Area</th>
              <th>Charge</th>
              <th>Status</th>
              <th>Action</th>
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

                <td>{parcel.receiverArea}</td>

                <td>৳ {parcel.deliveryCharge}</td>

                <td>
                  <span
                    className={`badge ${
                      parcel.deliveryStatus === "Rider assigned"
                        ? "badge-warning"
                        : "badge-info"
                    }`}
                  >
                    {parcel.deliveryStatus}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => handleStatusUpdate(parcel)}
                    className={`btn btn-sm ${
                      parcel.deliveryStatus === "Rider assigned"
                        ? "btn-warning"
                        : "btn-success"
                    }`}
                  >
                    {parcel.deliveryStatus === "Rider assigned"
                      ? "Mark Picked Up"
                      : "Mark Delivered"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {parcels.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No Pending Deliveries
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingDeliveries;
