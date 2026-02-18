import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { HiEye, HiPencilAlt, HiTrash, HiUserRemove } from "react-icons/hi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);
  const [searchText, setSearchText] = useState("");

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["activeRiders", searchText],
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/active?search=${searchText}`);
      return res.data;
    },
  });

  // 🔴 Deactivate Rider
  const handleDeactivate = async (id) => {
    const result = await Swal.fire({
      title: "Deactivate Rider?",
      text: "This rider will no longer be active.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Deactivate",
    });

    if (result.isConfirmed) {
      const res = await axiosSecure.patch(`/riders/deactivate/${id}`);

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Deactivated!",
          timer: 2000,
          showConfirmButton: false,
        });
        setSelectedRider(null);
        refetch();
      }
    }
  };

  // Delete Rider
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This rider will be permanently deleted!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      const res = await axiosSecure.delete(`/riders/${id}`);
      if (res.data.deletedCount > 0) {
        Swal.fire("Deleted!", "", "success");
        setSelectedRider(null);
        refetch();
      }
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

      {/* 🔎 Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Region</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {riders.map((rider, index) => {
              const isSelected = selectedRider?._id === rider._id;

              return (
                <tr
                  key={rider._id}
                  className={`transition-all duration-300 ${
                    isSelected
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.phone}</td>
                  <td>
                    {rider.region}, {rider.district}
                  </td>

                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>

                  <td className="flex gap-2">
                    {/* View */}
                    <button
                      onClick={() => setSelectedRider(rider)}
                      className="btn btn-sm btn-info text-white"
                    >
                      <HiEye />
                    </button>

                    {/* Deactivate */}
                    <button
                      onClick={() => handleDeactivate(rider._id)}
                      className="btn btn-sm bg-orange-500 text-white"
                    >
                      <HiUserRemove />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(rider._id)}
                      className="btn btn-sm btn-error text-white"
                    >
                      <HiTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Transparent Glass Modal */}
      {selectedRider && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30">
          <div className="bg-white/80 backdrop-blur-lg border border-white/40 p-6 rounded-2xl w-96 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-blue-600">
              Rider Details
            </h3>

            <p>
              <strong>Name:</strong> {selectedRider.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedRider.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedRider.phone}
            </p>
            <p>
              <strong>Region:</strong> {selectedRider.region}
            </p>
            <p>
              <strong>District:</strong> {selectedRider.district}
            </p>
            <p>
              <strong>Bike:</strong> {selectedRider.bikeInfo}
            </p>

            <button
              onClick={() => setSelectedRider(null)}
              className="btn btn-primary text-black mt-4 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRiders;
