import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useLoaderData } from "react-router";

const calculatePrice = (data) => {
  const isWithinCity = data.senderRegion === data.receiverRegion;
  const breakdown = {
    baseCharge: 0,
    extraWeightCharge: 0,
    outsideExtraCharge: 0,
    total: 0,
    routeType: isWithinCity ? "Within City" : "Outside City/District",
  };

  // Document pricing
  if (data.parcelType === "Document") {
    breakdown.baseCharge = isWithinCity ? 60 : 80;
    breakdown.total = breakdown.baseCharge;
    return breakdown;
  }

  // Non-Document pricing
  const weight = parseFloat(data.parcelWeight || 0);

  if (weight <= 3) {
    breakdown.baseCharge = isWithinCity ? 110 : 150;
    breakdown.total = breakdown.baseCharge;
    return breakdown;
  }

  // Weight > 3kg
  breakdown.baseCharge = isWithinCity ? 110 : 150;

  const extraKg = weight - 3;
  breakdown.extraWeightCharge = extraKg * 40;

  if (!isWithinCity) {
    breakdown.outsideExtraCharge = 40;
  }

  breakdown.total =
    breakdown.baseCharge +
    breakdown.extraWeightCharge +
    breakdown.outsideExtraCharge;

  return breakdown;
};

const regions = {
  Dhaka: ["Mirpur Hub", "Uttara Hub", "Gulshan Hub"],
  Chittagong: ["Agrabad Hub", "Pahartoli Hub"],
  Sylhet: ["Amberkhana Hub", "Beanibazar Hub"],
  Khulna: ["Sonadanga Hub", "Khalishpur Hub"],
};

const SendParcel = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const serviceCenters = useLoaderData();
  console.log(serviceCenters);

  const parcelType = watch("parcelType", "Document");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const onSubmit = async (data) => {
    const priceData = calculatePrice(data);

    const result = await Swal.fire({
      title: "Confirm Booking",
      width: 600,
      html: `
      <div style="text-align:left; font-size:14px">
        
        <h3 style="margin-bottom:10px;">📦 Parcel Summary</h3>
        <p><strong>Name:</strong> ${data.parcelName}</p>
        <p><strong>Type:</strong> ${data.parcelType}</p>
        ${
          data.parcelType === "Non-Document"
            ? `<p><strong>Weight:</strong> ${data.parcelWeight} KG</p>`
            : ""
        }
        <p><strong>Route:</strong> ${priceData.routeType}</p>

        <hr style="margin:15px 0"/>

        <h3 style="margin-bottom:10px;">💰 Price Breakdown</h3>

        <table style="width:100%; border-collapse: collapse;">
          <tr>
            <td>Base Charge</td>
            <td style="text-align:right;">৳${priceData.baseCharge}</td>
          </tr>

          ${
            priceData.extraWeightCharge > 0
              ? `
            <tr>
              <td>Extra Weight Charge</td>
              <td style="text-align:right;">৳${priceData.extraWeightCharge}</td>
            </tr>`
              : ""
          }

          ${
            priceData.outsideExtraCharge > 0
              ? `
            <tr>
              <td>Outside City Surcharge</td>
              <td style="text-align:right;">৳${priceData.outsideExtraCharge}</td>
            </tr>`
              : ""
          }

          <tr style="border-top:1px solid #ddd; font-weight:bold; font-size:16px;">
            <td>Total</td>
            <td style="text-align:right; color:#16a34a;">
              ৳${priceData.total}
            </td>
          </tr>
        </table>
      </div>
    `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm & Book",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#84cc16",
      cancelButtonColor: "#ef4444",
      borderRadius: "12px",
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: "Booking Successful!",
        html: `
        <h2 style="color:#16a34a;">
          Total Paid: ৳${priceData.total}
        </h2>
      `,
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
      });

      console.log({
        ...data,
        deliveryCharge: priceData.total,
        routeType: priceData.routeType,
      });

      reset();
    }
  };

  // Reset service center when region changes
  useEffect(() => {
    setValue("senderServiceCenter", "");
  }, [senderRegion, setValue]);

  useEffect(() => {
    setValue("receiverServiceCenter", "");
  }, [receiverRegion, setValue]);

  return (
    <div className="bg-base-200 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-base-100 shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-2">Send A Parcel</h1>
        <p className="text-lg font-semibold mb-6">Enter your parcel details</p>
        <p className="text-center text-gray-500 mb-6">
          Fast, reliable and secure delivery service
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Parcel Type */}
          <div className="flex gap-8">
            <label className="label cursor-pointer gap-2">
              <input
                type="radio"
                value="Document"
                {...register("parcelType")}
                className="radio radio-success"
                defaultChecked
              />
              <span className="label-text">Document</span>
            </label>

            <label className="label cursor-pointer gap-2">
              <input
                type="radio"
                value="Non-Document"
                {...register("parcelType")}
                className="radio"
              />
              <span className="label-text">Non-Document</span>
            </label>
          </div>

          {/* Parcel Name */}
          <input
            type="text"
            placeholder="Parcel Name"
            className="input input-bordered w-full"
            {...register("parcelName", { required: true })}
          />

          {/* Show Weight Only if Non-Document */}
          {parcelType === "Non-Document" && (
            <div>
              <input
                type="number"
                step="0.1"
                placeholder="Parcel Weight (KG)"
                className="input input-bordered w-full"
                {...register("parcelWeight", {
                  required: "Weight is required for non-document",
                })}
              />
              {errors.parcelWeight && (
                <p className="text-error text-sm mt-1">
                  {errors.parcelWeight.message}
                </p>
              )}
            </div>
          )}

          {/* Sender & Receiver */}
          <div className="grid md:grid-cols-2 gap-10">
            {/* Sender */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Sender Details</h2>

              <input
                type="text"
                placeholder="Sender Name"
                className="input input-bordered w-full"
                {...register("senderName", { required: true })}
              />

              <input
                type="text"
                placeholder="Address"
                className="input input-bordered w-full"
                {...register("senderAddress", { required: true })}
              />

              <input
                type="text"
                placeholder="Sender Phone"
                className="input input-bordered w-full"
                {...register("senderPhone", { required: true })}
              />

              {/* Region */}
              <select
                className="select select-bordered w-full"
                {...register("senderRegion", { required: true })}
              >
                <option value="">Select Region</option>
                {Object.keys(regions).map((region) => (
                  <option key={region}>{region}</option>
                ))}
              </select>

              {/* Service Center */}
              <select
                className="select select-bordered w-full"
                {...register("senderServiceCenter", { required: true })}
                disabled={!senderRegion}
              >
                <option value="">Select Service Center</option>
                {senderRegion &&
                  regions[senderRegion].map((center) => (
                    <option key={center}>{center}</option>
                  ))}
              </select>

              <textarea
                placeholder="Pickup Instruction"
                className="textarea textarea-bordered w-full"
                rows="3"
                {...register("pickupInstruction")}
              ></textarea>
            </div>

            {/* Receiver */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Receiver Details</h2>

              <input
                type="text"
                placeholder="Receiver Name"
                className="input input-bordered w-full"
                {...register("receiverName", { required: true })}
              />

              <input
                type="text"
                placeholder="Receiver Address"
                className="input input-bordered w-full"
                {...register("receiverAddress", { required: true })}
              />

              <input
                type="text"
                placeholder="Receiver Phone"
                className="input input-bordered w-full"
                {...register("receiverPhone", { required: true })}
              />

              {/* Region */}
              <select
                className="select select-bordered w-full"
                {...register("receiverRegion", { required: true })}
              >
                <option value="">Select Region</option>
                {Object.keys(regions).map((region) => (
                  <option key={region}>{region}</option>
                ))}
              </select>

              {/* Service Center */}
              <select
                className="select select-bordered w-full"
                {...register("receiverServiceCenter", { required: true })}
                disabled={!receiverRegion}
              >
                <option value="">Select Service Center</option>
                {receiverRegion &&
                  regions[receiverRegion].map((center) => (
                    <option key={center}>{center}</option>
                  ))}
              </select>

              <textarea
                placeholder="Delivery Instruction"
                className="textarea textarea-bordered w-full"
                rows="3"
                {...register("deliveryInstruction")}
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            className="btn bg-lime-400 hover:bg-lime-500 border-none text-black mt-6"
          >
            Proceed to Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendParcel;
