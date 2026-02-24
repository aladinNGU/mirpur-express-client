import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useTrackingLogger from "../../../hooks/useTrackingLogger";
import useAuth from "../../../hooks/useAuth";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const { logTracking } = useTrackingLogger();
  const { user } = useAuth();

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedRider, setSelectedRider] = useState("");

  // 🔹 Load riders based on district
  const { data: riders = [], isLoading: riderIsLoading } = useQuery({
    queryKey: ["riders", selectedDistrict],
    enabled: !!selectedDistrict,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders?district=${selectedDistrict}`);
      return res.data;
    },
  });

  const { data: parcels = [], isLoading: parcelIsLoading } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/assignable");
      return res.data;
    },
  });

  // 🔹 Open modal
  const openModal = (parcel) => {
    setSelectedParcel(parcel);
    setSelectedDistrict(parcel.receiverDistrict);
    document.getElementById("assign_modal").showModal();
  };

  // 🔹 Assign rider
  const handleAssign = async () => {
    if (!selectedRider) return alert("Select a rider");

    await axiosSecure.patch(`/parcels/assign/${selectedParcel._id}`, {
      riderId: selectedRider._id,
      riderEmail: selectedRider.email,
      riderName: selectedRider.name,
    });

    document.getElementById("assign_modal").close();
    alert("Rider Assigned Successfully");

    await logTracking({
      trackingId: selectedParcel.trackingId,
      status: "Rider Assigned",
      details: `Assigned to ${selectedRider.name}`,
      updatedBy: user.email,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Assign Riders</h2>

      {/* Parcel List */}
      <table className="table">
        <thead>
          <tr>
            <th>Parcel</th>
            <th>District</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel) => (
            <tr key={parcel._id}>
              <td>{parcel._id}</td>
              <td>{parcel.receiverDistrict}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary text-black"
                  onClick={() => openModal(parcel)}
                >
                  Assign Rider
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <dialog id="assign_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">
            Select Rider ({selectedDistrict})
          </h3>

          {riderIsLoading || parcelIsLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <select
              className="select select-bordered w-full"
              onChange={(e) =>
                setSelectedRider(
                  riders.find((r) => r._id.toString() === e.target.value),
                )
              }
            >
              <option value="">Choose Rider</option>
              {riders.map((rider) => (
                <option key={rider._id} value={rider._id}>
                  {rider.name} - {rider.phone}
                </option>
              ))}
            </select>
          )}

          <div className="modal-action">
            <button className="btn btn-success" onClick={handleAssign}>
              Confirm Assign
            </button>
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default AssignRider;
