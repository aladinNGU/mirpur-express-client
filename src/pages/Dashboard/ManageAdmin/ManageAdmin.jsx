import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { HiUserAdd, HiUserRemove } from "react-icons/hi";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const ManageAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [triggerSearch, setTriggerSearch] = useState("");

  // Fetch users only when searched
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["searchUsers", triggerSearch],
    enabled: !!triggerSearch,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users/search?search=${triggerSearch}`,
      );
      return res.data;
    },
  });

  // 🔵 Make Admin
  const handleMakeAdmin = async (userItem) => {
    if (userItem.email === user?.email) {
      return Swal.fire({
        icon: "warning",
        title: "Action Not Allowed",
        text: "You cannot change your own role.",
      });
    }

    const result = await Swal.fire({
      title: "Make Admin?",
      text: `${userItem.email} will become an admin.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Yes, Make Admin",
    });

    if (result.isConfirmed) {
      const res = await axiosSecure.patch(`/users/make-admin/${userItem._id}`);

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "User is now Admin.",
          timer: 2000,
          showConfirmButton: false,
        });
        refetch();
      }
    }
  };

  // 🔴 Revoke Admin
  const handleRevokeAdmin = async (userItem) => {
    if (userItem.email === user?.email) {
      return Swal.fire({
        icon: "warning",
        title: "Action Not Allowed",
        text: "You cannot revoke your own admin role.",
      });
    }

    const result = await Swal.fire({
      title: "Revoke Admin?",
      text: `${userItem.email} will be reverted to normal user.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Revoke",
    });

    if (result.isConfirmed) {
      const res = await axiosSecure.patch(
        `/users/revoke-admin/${userItem._id}`,
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Revoked!",
          text: "Admin role removed.",
          timer: 2000,
          showConfirmButton: false,
        });
        refetch();
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setTriggerSearch(searchText.trim());
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Admin</h2>

      {/* 🔍 Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search user by email..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="input input-bordered w-full max-w-md"
        />
        <button type="submit" className="btn btn-primary text-black">
          Search
        </button>
      </form>

      {/* No Search State */}
      {!triggerSearch && (
        <p className="text-gray-500">Search a user to manage admin role.</p>
      )}

      {/* Loading */}
      {isLoading && <p className="text-center mt-6">Searching...</p>}

      {/* Results */}
      {triggerSearch && users.length === 0 && !isLoading && (
        <p className="text-red-500">No users found.</p>
      )}

      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((userItem, index) => (
                <tr key={userItem._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>

                  <td>{userItem.email}</td>

                  <td>
                    {userItem.role === "admin" ? (
                      <span className="badge badge-success">Admin</span>
                    ) : (
                      <span className="badge badge-ghost">User</span>
                    )}
                  </td>

                  <td>{new Date(userItem.createdAt).toLocaleDateString()}</td>

                  <td className="flex gap-2">
                    {userItem.role !== "admin" ? (
                      <button
                        onClick={() => handleMakeAdmin(userItem)}
                        className="btn btn-sm bg-green-600 text-white"
                      >
                        <HiUserAdd />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRevokeAdmin(userItem)}
                        className="btn btn-sm btn-error text-white"
                      >
                        <HiUserRemove />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageAdmin;
