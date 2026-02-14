import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

/* ---------------- Tracking ID Generator ---------------- */
const generateTrackingId = () => {
  const prefix = "MPX";
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
};

const SendParcel = () => {
  const serviceCenters = useLoaderData();

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      parcelType: "Document",
    },
  });

  const parcelType = watch("parcelType");
  const senderRegion = watch("senderRegion");
  const senderDistrict = watch("senderDistrict");
  const receiverRegion = watch("receiverRegion");
  const receiverDistrict = watch("receiverDistrict");

  /* ---------------- Regions ---------------- */

  const uniqueRegions = [...new Set(serviceCenters.map((item) => item.region))];

  /* ---------------- Districts ---------------- */

  const senderDistricts = [
    ...new Set(
      serviceCenters
        .filter((item) => item.region === senderRegion)
        .map((item) => item.district),
    ),
  ];

  const receiverDistricts = [
    ...new Set(
      serviceCenters
        .filter((item) => item.region === receiverRegion)
        .map((item) => item.district),
    ),
  ];

  /* ---------------- Areas ---------------- */

  const senderAreas =
    serviceCenters.find(
      (item) =>
        item.region === senderRegion && item.district === senderDistrict,
    )?.covered_area || [];

  const receiverAreas =
    serviceCenters.find(
      (item) =>
        item.region === receiverRegion && item.district === receiverDistrict,
    )?.covered_area || [];

  /* ---------------- Reset on Region Change ---------------- */

  useEffect(() => {
    setValue("senderDistrict", "");
    setValue("senderArea", "");
  }, [senderRegion, setValue]);

  useEffect(() => {
    setValue("receiverDistrict", "");
    setValue("receiverArea", "");
  }, [receiverRegion, setValue]);

  /* ---------------- Pricing ---------------- */

  const calculatePrice = (data) => {
    const weight = Number(data.parcelWeight) || 0;
    const isWithinCity = data.senderDistrict === data.receiverDistrict;

    let base = 0;
    let extra = 0;

    if (data.parcelType === "Document") {
      base = isWithinCity ? 60 : 80;
    } else {
      if (weight <= 3) {
        base = isWithinCity ? 110 : 150;
      } else {
        base = isWithinCity ? 110 : 150;
        extra = (weight - 3) * 40;
        if (!isWithinCity) extra += 40;
      }
    }

    return {
      base,
      extra,
      total: base + extra,
      isWithinCity,
    };
  };

  /* ---------------- Submit ---------------- */

  const onSubmit = async (data) => {
    const pricing = calculatePrice(data);
    const trackingId = generateTrackingId();

    const result = await Swal.fire({
      title: "Confirm Booking",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm Booking",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      html: `
        <div style="text-align:left">
          <p><strong>Tracking ID:</strong> ${trackingId}</p>
          <p><strong>Parcel Type:</strong> ${data.parcelType}</p>
          <p><strong>Parcel Name:</strong> ${data.parcelName}</p>
          ${
            data.parcelType === "Non-Document"
              ? `<p><strong>Weight:</strong> ${data.parcelWeight} kg</p>`
              : ""
          }
          <p><strong>Delivery:</strong> ${
            pricing.isWithinCity ? "Within City" : "Outside City/District"
          }</p>

          <hr style="margin:10px 0"/>

          <table style="width:100%">
            <tr>
              <td>Base Price</td>
              <td style="text-align:right">৳${pricing.base}</td>
            </tr>
            <tr>
              <td>Extra Charge</td>
              <td style="text-align:right">৳${pricing.extra}</td>
            </tr>
            <tr style="font-weight:bold;border-top:1px solid #ddd">
              <td>Total</td>
              <td style="text-align:right">৳${pricing.total}</td>
            </tr>
          </table>
        </div>
      `,
    });

    if (result.isConfirmed) {
      const finalBooking = {
        ...data,
        trackingId,
        deliveryCharge: pricing.total,
        createdBy: user.email,
        paymentStatus: "unpaid",
        deliveryStatus: "not_collected",
        creationDate: new Date().toISOString(),
        // pricingDetails: pricing,
      };

      console.log(finalBooking);

      axiosSecure.post("/parcels", finalBooking).then((res) => {
        console.log(res.data);
        if (res.data.insertedId) {
          // TODO: Here you could redirect to a payment page or trigger a payment modal
          Swal.fire({
            icon: "success",
            title: "Booking Successful!",
            html: `
            <p><strong>Tracking ID:</strong> ${trackingId}</p>
            <p>Total: ৳${pricing.total}</p>
          `,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });

      reset();
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body space-y-6">
          <h2 className="text-3xl font-bold text-center">Send a Parcel</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Parcel Type */}
            <div className="bg-base-200 p-4 rounded-xl">
              <h3 className="font-semibold mb-3">Parcel Type</h3>

              <div className="flex gap-8">
                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    value="Document"
                    className="radio radio-primary"
                    {...register("parcelType")}
                  />
                  <span>Document</span>
                </label>

                <label className="label cursor-pointer gap-2">
                  <input
                    type="radio"
                    value="Non-Document"
                    className="radio radio-primary"
                    {...register("parcelType")}
                  />
                  <span>Non-Document</span>
                </label>
              </div>

              {/* ✅ NEW Parcel Name Field */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Parcel Name (e.g. Important Documents, Mobile Phone, Gift Box)"
                  className="input input-bordered w-full"
                  {...register("parcelName", { required: true })}
                />
              </div>

              {parcelType === "Non-Document" && (
                <div className="mt-4">
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    className="input input-bordered w-full"
                    {...register("parcelWeight", {
                      required: parcelType === "Non-Document",
                      min: 0.1,
                    })}
                  />
                </div>
              )}
            </div>

            {/* Sender Info */}
            <div className="bg-base-200 p-4 rounded-xl space-y-4">
              <h3 className="font-semibold text-lg">Sender Information</h3>

              <input
                placeholder="Sender Name"
                className="input input-bordered w-full"
                {...register("senderName", { required: true })}
              />

              {/* ✅ NEW Address Field */}
              <input
                placeholder="Sender Address"
                className="input input-bordered w-full"
                {...register("senderFullAddress", { required: true })}
              />

              <input
                placeholder="Contact Number"
                className="input input-bordered w-full"
                {...register("senderContact", {
                  required: true,
                })}
              />

              <select
                className="select select-bordered w-full"
                {...register("senderRegion", {
                  required: true,
                })}
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              <select
                className="select select-bordered w-full"
                {...register("senderDistrict", {
                  required: true,
                })}
                disabled={!senderRegion}
              >
                <option value="">Select District</option>
                {senderDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>

              <select
                className="select select-bordered w-full"
                {...register("senderArea", {
                  required: true,
                })}
                disabled={!senderDistrict}
              >
                <option value="">Select Covered Area</option>
                {senderAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              {/* 🔁 Renamed to avoid conflict */}
              <textarea
                placeholder="Pick Instruction"
                className="textarea textarea-bordered w-full"
                {...register("senderInstruction", {
                  required: true,
                })}
              />
            </div>

            {/* Receiver Info */}
            <div className="bg-base-200 p-4 rounded-xl space-y-4">
              <h3 className="font-semibold text-lg">Receiver Information</h3>

              <input
                placeholder="Receiver Name"
                className="input input-bordered w-full"
                {...register("receiverName", {
                  required: true,
                })}
              />

              {/* ✅ NEW Address Field */}
              <input
                placeholder="Receiver Address"
                className="input input-bordered w-full"
                {...register("receiverFullAddress", { required: true })}
              />

              <input
                placeholder="Contact Number"
                className="input input-bordered w-full"
                {...register("receiverContact", {
                  required: true,
                })}
              />

              <select
                className="select select-bordered w-full"
                {...register("receiverRegion", {
                  required: true,
                })}
              >
                <option value="">Select Region</option>
                {uniqueRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              <select
                className="select select-bordered w-full"
                {...register("receiverDistrict", {
                  required: true,
                })}
                disabled={!receiverRegion}
              >
                <option value="">Select District</option>
                {receiverDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>

              <select
                className="select select-bordered w-full"
                {...register("receiverArea", {
                  required: true,
                })}
                disabled={!receiverDistrict}
              >
                <option value="">Select Covered Area</option>
                {receiverAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              {/* 🔁 Renamed to avoid conflict */}
              <textarea
                placeholder="Delivery Instruction"
                className="textarea textarea-bordered w-full"
                {...register("receiverInstruction", {
                  required: true,
                })}
              />
            </div>

            <button className="btn btn-primary w-full text-lg text-black">
              Proceed to Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendParcel;
