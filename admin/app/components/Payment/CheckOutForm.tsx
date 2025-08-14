"use client";
import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
  setOpen: (open: boolean) => void;
  data: any;
  user: any;
  refetch: any;
};

const CheckOutForm: React.FC<Props> = ({ setOpen, data, user, refetch }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { refetch: refetchUser } = useLoadUserQuery(undefined, {});
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setLoading(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        toast.error(error.message || "Payment failed");
        setLoading(false);
        return;
      }

      // Create order
      const orderData = {
        courseId: data._id,
        payment_info: {
          id: paymentMethod.id,
          status: "succeeded",
        },
      };

      const result = await createOrder(orderData).unwrap();

      if (result.success) {
        toast.success("Payment successful!");
        refetch();
        refetchUser();
        setOpen(false);
        router.push(`/course-access/${data._id}`);
      } else {
        toast.error("Order creation failed");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <h1 className="text-[25px] font-Poppins font-[600] text-black dark:text-white text-center py-2">
          Payment
        </h1>
        <div className="w-full">
          <div className="w-full flex items-center justify-between py-3">
            <h5 className="text-[18px] font-Poppins font-[600] text-black dark:text-white">
              Course Name:
            </h5>
            <h5 className="text-[18px] font-Poppins font-[600] text-black dark:text-white">
              {data.name}
            </h5>
          </div>
          <div className="w-full flex items-center justify-between py-3">
            <h5 className="text-[18px] font-Poppins font-[600] text-black dark:text-white">
              Price:
            </h5>
            <h5 className="text-[18px] font-Poppins font-[600] text-black dark:text-white">
              ${data.price}
            </h5>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full border border-[#00000026] p-4 rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
          <div className="w-full flex items-center justify-between py-3">
            <h5 className="text-[18px] font-Poppins font-[600] text-black dark:text-white">
              Total:
            </h5>
            <h5 className="text-[18px] font-Poppins font-[600] text-black dark:text-white">
              ${data.price}
            </h5>
          </div>
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full bg-[#37a39a] text-white py-3 rounded-md font-Poppins font-[600] hover:bg-[#2d8a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : `Pay $${data.price}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckOutForm;
