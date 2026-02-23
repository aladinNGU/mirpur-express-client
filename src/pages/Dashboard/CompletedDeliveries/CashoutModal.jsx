// src/components/Rider/CashoutModal.jsx
import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const CashoutModal = ({ isOpen, onClose, balance, hasPendingCashout }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCashout = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cashoutAmount = parseFloat(amount);

    if (cashoutAmount < 100) {
      setError("Minimum cashout amount is ৳100");
      setLoading(false);
      return;
    }

    if (cashoutAmount > balance) {
      setError(`Insufficient balance. Available: ৳${balance.toFixed(2)}`);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosSecure.post("/riders/cashout", {
        email: user?.email,
        amount: cashoutAmount,
        riderName: user?.displayName,
      });

      if (response.data.success) {
        // Invalidate queries to refresh data
        await queryClient.invalidateQueries(["riderBalance", user?.email]);
        await queryClient.invalidateQueries(["cashoutHistory", user?.email]);
        onClose();
        // You can show a success toast here
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to process cashout request",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Cashout Request</h3>

        {hasPendingCashout ? (
          <div className="text-center py-4">
            <p className="text-warning font-semibold mb-2">
              You have a pending cashout request
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Please wait for admin approval before making another request.
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleCashout}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Available Balance
              </label>
              <div className="text-2xl font-bold text-success">
                ৳ {balance.toFixed(2)}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Cashout Amount (Min: ৳100)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter amount"
                min="100"
                max={balance}
                step="0.01"
                required
              />
            </div>

            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success text-white"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Request Cashout"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CashoutModal;
