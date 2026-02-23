import React from "react";
import useAxiosSecure from "./useAxiosSecure";

const useTrackingLogger = () => {
  const axiosSecure = useAxiosSecure();

  const logTracking = async ({ trackingId, status, details, updatedBy }) => {
    try {
      const payload = {
        trackingId,
        status,
        details,
        updatedBy,
      };
      await axiosSecure.post("/trackings", payload);
    } catch (error) {
      console.error("Failed to track logging", error);
    }
  };

  return { logTracking };
};

export default useTrackingLogger;
