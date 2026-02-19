import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { HiEye, HiPencilAlt, HiTrash } from "react-icons/hi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveRiders = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedRider, setSelectedRider] = useState(null);

  // Fetch Active Riders
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

  // Delete Rider
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
      try {
        const res = await axiosSecure.delete(`/riders/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Rider has been removed.",
            timer: 2000,
            showConfirmButton: false,
          });
          refetch();
        }
      } catch (error) {
        Swal.fire("Error", "Failed to delete rider", error);
      }
    }
  };

  // Edit Rider
  const handleEdit = async (rider) => {
    const { value: phone } = await Swal.fire({
      title: "Edit Phone Number",
      input: "text",
      inputValue: rider.phone,
      showCancelButton: true,
      confirmButtonText: "Update",
      inputValidator: (value) => {
        if (!value) return "Phone number is required!";
      },
    });

    if (phone) {
      try {
        const res = await axiosSecure.patch(`/riders/${rider._id}`, {
          phone,
        });

        if (res.data.modifiedCount > 0) {
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Rider info updated successfully.",
            timer: 2000,
            showConfirmButton: false,
          });
          refetch();
        }
      } catch (error) {
        Swal.fire("Failed to update rider", error);
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
            {riders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>
                  {rider.region}, {rider.district}
                </td>
                <td>{rider.phone}</td>
                <td>{rider.bikeInfo}</td>
                <td className="flex gap-2">
                  {/* View */}
                  <button
                    onClick={() => setSelectedRider(rider)}
                    className="btn btn-sm btn-info text-white"
                  >
                    <HiEye />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(rider)}
                    className="btn btn-sm btn-warning text-white"
                  >
                    <HiPencilAlt />
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Rider Details</h3>

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
              className="btn btn-sm btn-primary mt-4 w-full"
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
