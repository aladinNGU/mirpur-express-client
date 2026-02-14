import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import Swal from "sweetalert2";

const SendParcel = () => {
  const serviceCenters = useLoaderData();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const parcelType = watch("parcelType", "Document");
  const weight = Number(watch("parcelWeight")) || 0;

  const senderRegion = watch("senderRegion");
  const senderDistrict = watch("senderDistrict");
  const receiverRegion = watch("receiverRegion");
  const receiverDistrict = watch("receiverDistrict");

  /* ---------------- Dynamic Location Logic ---------------- */

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
  }, [senderRegion, setValue]);

  useEffect(() => {
    setValue("senderArea", "");
  }, [senderDistrict, setValue]);

  useEffect(() => {
    setValue("receiverDistrict", "");
    setValue("receiverArea", "");
  }, [receiverRegion, setValue]);

  useEffect(() => {
    setValue("receiverArea", "");
  }, [receiverDistrict, setValue]);

  /* ---------------- Pricing Logic ---------------- */

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
      title: "Confirm Your Booking",
      html: `
      <div style="text-align:left">
        <h3 style="margin-bottom:8px;">📦 Parcel Information</h3>
        <p><strong>Type:</strong> ${data.parcelType}</p>
        ${
          data.parcelType === "Non-Document"
            ? `<p><strong>Weight:</strong> ${weight} kg</p>`
            : ""
        }
        <p><strong>Delivery:</strong> ${
          pricing.isWithinCity ? "Within City" : "Outside City/District"
        }</p>

        <hr style="margin:15px 0"/>

        <h3 style="margin-bottom:8px;">💰 Price Breakdown</h3>
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td>Base Price</td>
            <td style="text-align:right;">৳${pricing.base}</td>
          </tr>
          <tr>
            <td>Extra Charge</td>
            <td style="text-align:right;">৳${pricing.extra}</td>
          </tr>
          <tr style="border-top:1px solid #ccc;">
            <td><strong>Total</strong></td>
            <td style="text-align:right;"><strong>৳${pricing.total}</strong></td>
          </tr>
        </table>
      </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Confirm Booking",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      width: 500,
    });

    if (result.isConfirmed) {
      await Swal.fire({
        icon: "success",
        title: "Booking Successful!",
        text: `Total Charge: ৳${pricing.total}`,
        timer: 2000,
        showConfirmButton: false,
      });

      reset();
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center">Send a Parcel</h2>
          <p className="text-center text-gray-500 mb-6">
            Fast, reliable and secure delivery service
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Parcel Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Parcel Title</label>
                <input
                  className="input input-bordered w-full"
                  {...register("parcelTitle", { required: true })}
                />
              </div>

              <div>
                <label className="label">Parcel Type</label>
                <select
                  className="select select-bordered w-full"
                  {...register("parcelType")}
                >
                  <option>Document</option>
                  <option>Non-Document</option>
                </select>
              </div>

              {parcelType === "Non-Document" && (
                <div>
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

            {/* Sender Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Sender Details</h3>

              <div className="grid md:grid-cols-2 gap-6">
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
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-4">
                <select
                  className="select select-bordered w-full"
                  {...register("senderRegion", {
                    required: true,
                  })}
                >
                  <option value="">Region</option>
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
                  <option value="">District</option>
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
                  <option value="">Covered Area</option>
                  {senderAreas.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Full Address"
                className="textarea textarea-bordered w-full mt-4"
                {...register("senderAddress", { required: true })}
              />
            </div>

            {/* Receiver Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Receiver Details</h3>

              <div className="grid md:grid-cols-2 gap-6">
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
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-4">
                <select
                  className="select select-bordered w-full"
                  {...register("receiverRegion", {
                    required: true,
                  })}
                >
                  <option value="">Region</option>
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
                  <option value="">District</option>
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
                  <option value="">Covered Area</option>
                  {receiverAreas.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Full Address"
                className="textarea textarea-bordered w-full mt-4"
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
