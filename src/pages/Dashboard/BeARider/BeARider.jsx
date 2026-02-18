import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import serviceCenters from "/public/serviceCenters.json";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const BeARider = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const selectedRegion = watch("region");

  // ✅ Get unique regions
  const regions = useMemo(() => {
    return [...new Set(serviceCenters.map((item) => item.region))];
  }, []);

  // ✅ Get districts based on selected region
  const districts = useMemo(() => {
    return serviceCenters
      .filter((item) => item.region === selectedRegion)
      .map((item) => item.district);
  }, [selectedRegion]);

  // 🚀 Professional Submit Handler
  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      name: user?.displayName,
      email: user?.email,
      age: Number(data.age),
      status: "pending",
      appliedAt: new Date(),
    };

    console.log("Rider Application", riderData);

    try {
      // 🔄 Loading Alert
      Swal.fire({
        title: "Submitting Application...",
        text: "Please wait while we process your request.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const res = await axiosSecure.post("/riders", riderData);

      Swal.close();

      if (res.data.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          html: `
            <p>Your rider application has been received.</p>
            <p style="font-size: 14px; color: gray;">
              Our team will review it and notify you soon.
            </p>
          `,
          confirmButtonColor: "#2563eb",
          confirmButtonText: "OK",
        });

        // reset();
      }
    } catch (error) {
      Swal.close();

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-base-100 p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Become a Rider</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            value={user?.displayName || ""}
            readOnly
            className="input input-bordered w-full bg-base-200"
          />
        </div>

        {/* Email */}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="input input-bordered w-full bg-base-200"
          />
        </div>

        {/* Age */}
        <div>
          <label className="label">Age</label>
          <input
            type="number"
            className="input input-bordered w-full"
            {...register("age", {
              required: "Age is required",
              min: { value: 18, message: "Minimum age is 18" },
            })}
          />
          {errors.age && (
            <p className="text-error text-sm mt-1">{errors.age.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="label">Phone Number</label>
          <input
            type="tel"
            className="input input-bordered w-full"
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^[0-9]{10,15}$/,
                message: "Enter a valid phone number",
              },
            })}
          />
          {errors.phone && (
            <p className="text-error text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Region */}
        <div>
          <label className="label">Region</label>
          <select
            className="select select-bordered w-full"
            {...register("region", { required: "Region is required" })}
          >
            <option value="">Select Region</option>
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="text-error text-sm mt-1">{errors.region.message}</p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="label">District</label>
          <select
            className="select select-bordered w-full"
            disabled={!selectedRegion}
            {...register("district", {
              required: "District is required",
            })}
          >
            <option value="">Select District</option>
            {districts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-error text-sm mt-1">{errors.district.message}</p>
          )}
        </div>

        {/* Bike Brand */}
        <div>
          <label className="label">Bike Brand</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("bikeBrand", {
              required: "Bike brand is required",
            })}
          />
          {errors.bikeBrand && (
            <p className="text-error text-sm mt-1">
              {errors.bikeBrand.message}
            </p>
          )}
        </div>

        {/* Bike Model */}
        <div>
          <label className="label">Bike Model</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("bikeModel", {
              required: "Bike model is required",
            })}
          />
        </div>

        {/* Bike Registration */}
        <div>
          <label className="label">Bike Registration Number</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("bikeRegistration", {
              required: "Registration number is required",
            })}
          />
        </div>

        {/* NID */}
        <div>
          <label className="label">National ID Number</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("nid", {
              required: "NID is required",
            })}
          />
        </div>

        {/* Experience */}
        <div>
          <label className="label">
            Previous Delivery Experience (Optional)
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            {...register("experience")}
          ></textarea>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary text-black w-full">
          Apply Now
        </button>
      </form>
    </div>
  );
};

export default BeARider;
