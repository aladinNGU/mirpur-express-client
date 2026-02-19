import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { HiEye, HiPencilAlt, HiTrash } from "react-icons/hi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/active");
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This rider will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const res = await axiosSecure.delete(`/riders/${id}`);
      if (res.data.deletedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          timer: 2000,
          showConfirmButton: false,
        });
        setSelectedRider(null);
        refetch();
      }
    }
  };

  const handleEdit = async (rider) => {
    const { value: phone } = await Swal.fire({
      title: "Edit Phone Number",
      input: "text",
      inputValue: rider.phone,
      showCancelButton: true,
      confirmButtonText: "Update",
    });

    if (phone) {
      const res = await axiosSecure.patch(`/riders/${rider._id}`, { phone });
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          timer: 2000,
          showConfirmButton: false,
        });
        refetch();
      }
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Active Riders</h2>

      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Region</th>
              <th>Phone</th>
              <th>Bike</th>
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
                      ? "bg-blue-50 border-l-4 border-blue-500 shadow-md"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td>{index + 1}</td>
                  <td className="font-medium">{rider.name}</td>
                  <td>
                    {rider.region}, {rider.district}
                  </td>
                  <td>{rider.phone}</td>
                  <td>{rider.bikeInfo}</td>

                  <td className="flex gap-2">
                    {/* View */}
                    <button
                      onClick={() => setSelectedRider(rider)}
                      className={`btn btn-sm transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : "btn-info text-white"
                      }`}
                    >
                      <HiEye />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(rider)}
                      className={`btn btn-sm transition-all ${
                        isSelected
                          ? "bg-yellow-500 text-white scale-105"
                          : "btn-warning text-white"
                      }`}
                    >
                      <HiPencilAlt />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(rider._id)}
                      className={`btn btn-sm transition-all ${
                        isSelected
                          ? "bg-red-600 text-white scale-105"
                          : "btn-error text-white"
                      }`}
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

      {/* Details Modal */}
      {selectedRider && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-white/30">
          <div className="bg-white/80 backdrop-blur-lg border border-white/40 p-6 rounded-2xl w-96 shadow-2xl transition-all duration-300">
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
              <strong>Age:</strong> {selectedRider.age}
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
              <strong>Bike Info:</strong> {selectedRider.bikeInfo}
            </p>
            <p>
              <strong>Bike Reg:</strong> {selectedRider.bikeRegistration}
            </p>

            <button
              onClick={() => setSelectedRider(null)}
              className="btn btn-primary mt-4 w-full"
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
