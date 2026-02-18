import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { HiEye, HiCheckCircle, HiXCircle } from "react-icons/hi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PendingRiders = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: riders = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  // 🔍 View Details
  const handleView = (rider) => {
    Swal.fire({
      title: "Rider Details",
      html: `
        <div style="text-align:left">
          <p><strong>Name:</strong> ${rider.name}</p>
          <p><strong>Email:</strong> ${rider.email}</p>
          <p><strong>Age:</strong> ${rider.age}</p>
          <p><strong>Phone:</strong> ${rider.phone}</p>
          <p><strong>Region:</strong> ${rider.region}</p>
          <p><strong>District:</strong> ${rider.district}</p>
          <p><strong>Bike Brand:</strong> ${rider.bikeBrand}</p>
          <p><strong>Bike Model:</strong> ${rider.bikeModel}</p>
          <p><strong>Registration:</strong> ${rider.bikeRegistration}</p>
          <p><strong>NID:</strong> ${rider.nid}</p>
          <p><strong>Experience:</strong> ${rider.experience || "N/A"}</p>
        </div>
      `,
      width: 600,
      confirmButtonColor: "#2563eb",
    });
  };

  // ✅ Approve Rider
  const handleApprove = async (id) => {
    const confirm = await Swal.fire({
      title: "Approve Rider?",
      text: "This will activate the rider account.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.patch(`/riders/${id}/approve`);
      Swal.fire("Approved!", "Rider is now active.", "success");
      refetch();
    }
  };

  // ❌ Reject Rider
  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Reject Application?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Reject",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.patch(`/riders/${id}/reject`);
      Swal.fire("Rejected!", "Application has been rejected.", "success");
      refetch();
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="bg-base-100 shadow-xl rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6">Pending Rider Applications</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Region</th>
              <th>District</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {riders.length > 0 ? (
              riders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>{rider.phone}</td>

                  <td className="flex gap-2">
                    {/* View */}
                    <button
                      onClick={() => handleView(rider)}
                      className="btn btn-sm btn-info"
                    >
                      <HiEye className="text-lg" />
                    </button>

                    {/* Approve */}
                    <button
                      onClick={() => handleApprove(rider._id)}
                      className="btn btn-sm btn-success"
                    >
                      <HiCheckCircle className="text-lg" />
                    </button>

                    {/* Reject */}
                    <button
                      onClick={() => handleReject(rider._id)}
                      className="btn btn-sm btn-error"
                    >
                      <HiXCircle className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  No pending applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingRiders;
