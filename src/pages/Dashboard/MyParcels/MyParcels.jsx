import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import MyParcelsTable from "./MyParcelsTable";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["my-parcels", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/parcels/${id}`);

      if (res.data.deletedCount) {
        await Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Parcel has been deleted successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        refetch();
      } else {
        Swal.fire("Error", "Parcel was not deleted.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to delete parcel.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load parcels.
      </div>
    );
  }

  return (
    <div className="p-6">
      <MyParcelsTable parcels={parcels} onDelete={handleDelete} />
    </div>
  );
};

export default MyParcels;
