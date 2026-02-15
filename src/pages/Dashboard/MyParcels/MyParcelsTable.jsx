import React from "react";
import { Link } from "react-router";

const MyParcelsTable = ({ parcels, onDelete }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">
          My Parcels ({parcels.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Parcel Name</th> {/* ✅ Added */}
                <th>Parcel Type</th>
                <th>Delivery Charge</th>
                <th>Created At</th>
                <th>Payment</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <th>{index + 1}</th>

                  {/* ✅ Parcel Name */}
                  <td className="font-semibold text-secondary">
                    {parcel.parcelName}
                  </td>

                  <td className="font-medium">{parcel.parcelType}</td>

                  <td className="text-primary font-semibold">
                    ৳ {parcel.deliveryCharge}
                  </td>

                  <td>
                    {new Date(parcel.creationDate).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        parcel.paymentStatus === "paid"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {parcel.paymentStatus}
                    </span>
                  </td>

                  <td>
                    <div className="flex gap-2 justify-center flex-wrap">
                      <Link
                        to={`/dashboard/view/${parcel._id}`}
                        className="btn btn-xs btn-info"
                      >
                        View
                      </Link>

                      <Link
                        to={`/dashboard/details/${parcel._id}`}
                        className="btn btn-xs btn-outline"
                      >
                        Details
                      </Link>

                      {parcel.paymentStatus === "unpaid" && (
                        <Link
                          to={`/dashboard/payment/${parcel._id}`}
                          className="btn btn-xs btn-success"
                        >
                          Pay
                        </Link>
                      )}

                      <button
                        onClick={() => onDelete(parcel._id)}
                        className="btn btn-xs btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {parcels.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No parcels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyParcelsTable;
