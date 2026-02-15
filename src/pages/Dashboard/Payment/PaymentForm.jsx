import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();

  const { parcelId } = useParams();
  //   console.log(parcelId);

  const [error, setError] = useState("");

  const axiosSecure = useAxiosSecure();

  const { data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`parcels/${parcelId}`);
      return res.data;
    },
  });
  console.log(parcelInfo);
  const amount = parcelInfo.deliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("payment method", paymentMethod);
    }
    // create payment intent
    const res = await axiosSecure.post("/create-payment-intent", {
      amount,
      parcelId,
    });

    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      //   console.log(result.error.message);
      setError(result.error.message);
    } else {
      setError("");
      if (result.paymentIntent.status === "succeeded") {
        console.log("Payment succeeded");
        console.log(result);
        // Mark parcel paid and also create payment history
        const paymentData = {
          parcelId,
          transactionId: result.paymentIntent.id,
          email: user.email, // temporary until JWT added
        };
        const paymentRes = await axiosSecure.post("/payments", paymentData);
        if (paymentRes.data.paymentId) {
          console.log("Payment successful");
        }
      }
    }
    // console.log("res from intent", res);
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-2 border rounded"></CardElement>
        <button
          type="submit"
          disabled={!stripe}
          className="btn btn-primary w-full text-black"
        >
          Pay BDT {amount}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
