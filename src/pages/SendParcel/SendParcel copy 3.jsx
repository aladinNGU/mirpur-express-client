import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";

const SendParcel = () => {
  const serviceCenters = useLoaderData();

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      parcelType: "Document",
    },
  });

  const parcelType = watch("parcelType");
  const weight = Number(watch("parcelWeight")) || 0;

  const senderRegion = watch("senderRegion");
  const senderDistrict = watch("senderDistrict");
  const receiverRegion = watch("receiverRegion");
  const receiverDistrict = watch("receiverDistrict");

  /* ---------------- Dynamic Location ---------------- */

  const uniqueRegions = [...new Set(serviceCenters.map((item) => item.region))];

  const senderDistricts = serviceCenters.filter(
    (item) => item.region === senderRegion,
  );

  const receiverDistricts = serviceCenters.filter(
    (item) => item.region === receiverRegion,
  );

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

  useEffect(() => {
    setValue("senderDistrict", "");
    setValue("senderArea", "");
  }, [senderRegion]);

  useEffect(() => {
    setValue("receiverDistrict", "");
    setValue("receiverArea", "");
  }, [receiverRegion]);

  /* ---------------- Pricing ---------------- */

  const calculatePrice = (data) => {
    const isWithinCity = data.senderDistrict === data.receiverDistrict;

    let base = 0;
    let extra = 0;
    let total = 0;

    if (data.parcelType === "Document") {
      base = isWithinCity ? 60 : 80;
      total = base;
    } else {
      if (weight <= 3) {
        base = isWithinCity ? 110 : 150;
        total = base;
      } else {
        base = isWithinCity ? 110 : 150;
        extra = (weight - 3) * 40;
        if (!isWithinCity) extra += 40;
        total = base + extra;
      }
    }

    return { base, extra, total, isWithinCity };
  };

  /* ---------------- Submit ---------------- */

  const onSubmit = async (data) => {
    const pricing = calculatePrice(data);

    const result = await Swal.fire({
      title: "Confirm Booking",
      html: `
        <div style="text-align:left">
          <h3>📦 Parcel Type: ${data.parcelType}</h3>
          ${
            data.parcelType === "Non-Document"
              ? `<p>Weight: ${weight} kg</p>`
              : ""
          }
          <p>Delivery: ${
            pricing.isWithinCity ? "Within City" : "Outside City/District"
          }</p>

          <hr style="margin:15px 0"/>

          <h3>💰 Price Breakdown</h3>
          <table style="width:100%">
            <tr>
              <td>Base Price</td>
              <td style="text-align:right">৳${pricing.base}</td>
            </tr>
            <tr>
              <td>Extra Charge</td>
              <td style="text-align:right">৳${pricing.extra}</td>
            </tr>
            <tr style="border-top:1px solid #ccc">
              <td><strong>Total</strong></td>
              <td style="text-align:right"><strong>৳${pricing.total}</strong></td>
            </tr>
          </table>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm Booking",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "Booking Successful!",
        text: `Total: ৳${pricing.total}`,
        timer: 2000,
        showConfirmButton: false,
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
          <p className="text-center text-gray-500 -mt-6">
            Fast, reliable and secure delivery service
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Parcel Type Radio */}
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

              {parcelType === "Non-Document" && (
                <div className="mt-4">
                  <label className="label">Weight (kg)</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    {...register("parcelWeight", {
                      required: true,
                    })}
                  />
                </div>
              )}
            </div>

            {/* Sender Info - One Column */}
            <div className="bg-base-200 p-4 rounded-xl space-y-4">
              <h3 className="font-semibold text-lg">Sender Information</h3>

              <input
                placeholder="Sender Name"
                className="input input-bordered w-full"
                {...register("senderName", { required: true })}
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
                  <option key={region}>{region}</option>
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
                {senderDistricts.map((item) => (
                  <option key={item.district}>{item.district}</option>
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
                  <option key={area}>{area}</option>
                ))}
              </select>

              <textarea
                placeholder="Full Address"
                className="textarea textarea-bordered w-full"
                {...register("senderAddress", {
                  required: true,
                })}
              />
            </div>

            {/* Receiver Info - One Column */}
            <div className="bg-base-200 p-4 rounded-xl space-y-4">
              <h3 className="font-semibold text-lg">Receiver Information</h3>

              <input
                placeholder="Receiver Name"
                className="input input-bordered w-full"
                {...register("receiverName", {
                  required: true,
                })}
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
                  <option key={region}>{region}</option>
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
                {receiverDistricts.map((item) => (
                  <option key={item.district}>{item.district}</option>
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
                  <option key={area}>{area}</option>
                ))}
              </select>

              <textarea
                placeholder="Full Address"
                className="textarea textarea-bordered w-full"
                {...register("receiverAddress", {
                  required: true,
                })}
              />
            </div>

            <button className="btn btn-primary w-full text-lg">
              Proceed to Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SendParcel;
