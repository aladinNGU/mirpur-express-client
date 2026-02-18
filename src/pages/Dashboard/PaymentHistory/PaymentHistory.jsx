import React, { useMemo, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { format } from "date-fns";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const {
    isPending,
    isError,
    data: payments = [],
  } = useQuery({
    queryKey: ["payments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?${user.email}`);
      return res.data;
    },
  });

  // 🔎 Filter Payments
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch = payment.transactionId
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const paymentDate = payment.paidAt ? new Date(payment.paidAt) : null;

      const matchesFromDate = fromDate
        ? paymentDate >= new Date(fromDate)
        : true;

      const matchesToDate = toDate
        ? paymentDate <= new Date(`${toDate}T23:59:59`)
        : true;

      return matchesSearch && matchesFromDate && matchesToDate;
    });
  }, [payments, search, fromDate, toDate]);

  // 💰 Total Revenue
  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0,
  );

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-error py-10">
        Failed to load payments.
      </div>
    );
  }
  return (
    <div className="bg-base-100 shadow-xl rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Payment History</h2>
        <p className="text-sm text-base-content/60">
          View all your successful parcel transactions.
        </p>
      </div>

      {/* Stats */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Transactions</div>
          <div className="stat-value text-primary">
            {filteredPayments.length}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Paid</div>
          <div className="stat-value text-secondary text-xl">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              // currency: filteredPayments[0]?.currency?.toUpperCase() || "USD",
              currency: "USD",
            }).format(totalAmount)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Search */}
        <div className="flex flex-col w-full lg:w-1/3">
          <label htmlFor="search" className="text-sm font-medium mb-1">
            Search Transaction
          </label>
          <input
            type="text"
            id="search"
            placeholder="Enter Transaction ID..."
            className="input input-bordered w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* From Date */}
        <div className="flex flex-col">
          <label htmlFor="fromDate" className="text-sm font-medium mb-1">
            From Date
          </label>
          <input
            type="date"
            id="fromDate"
            className="input input-bordered"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col">
          <label htmlFor="toDate" className="text-sm font-medium mb-1">
            To Date
          </label>
          <input
            type="date"
            id="toDate"
            className="input input-bordered"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* Reset Filters */}
        <div className="flex flex-col mt-2 lg:mt-0">
          <label htmlFor="toDate" className="text-sm font-medium mb-1">
            Reset
          </label>
          <button
            type="button"
            className="btn btn-outline btn-error"
            disabled={!search && !fromDate && !toDate} // disables if no filters
            onClick={() => {
              setSearch("");
              setFromDate("");
              setToDate("");
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th>#</th>
              <th>Transaction ID</th>
              <th>Parcel</th>
              <th>Amount</th>
              <th>Paid By</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment, index) => (
                <tr key={payment._id} className="hover">
                  <td>{index + 1}</td>
                  <td className="font-mono text-sm">{payment.transactionId}</td>
                  <td className="text-sm">
                    {payment.parcelId?.toString().slice(-6)}
                  </td>
                  <td className="font-semibold text-primary">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: payment.currency?.toUpperCase() || "USD",
                    }).format(Number(payment.amount || 0))}
                  </td>
                  <td className="text-sm">{payment.paidBy}</td>
                  <td className="text-sm">
                    {format(new Date(payment.paidAt), "dd MMM yyyy, hh:mm a")}
                  </td>
                  <td>
                    <span className="badge badge-success badge-sm">Paid</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10 text-base-content/60"
                >
                  No payment history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentHistory;
