import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";

interface StripePaymentFormProps {
  clientSecret: string;
  orderId: string;
  projectId: string;
  planPrice: number;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

export function StripePaymentForm({
  clientSecret,
  orderId,
  projectId,
  planPrice,
  onPaymentSuccess,
  onPaymentError,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleCardChange = (event: any) => {
    setCardError(event.error ? event.error.message : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setCardError(null);

    try {
      const cardElement = elements.getElement(CardElement) as StripeCardElement;

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setCardError(error.message || "Payment failed");
        onPaymentError(error.message || "Payment failed");
        setLoading(false);
        return;
      }

      if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "requires_capture")) {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (error: any) {
      setCardError(error.message);
      onPaymentError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
      
      <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
        <p className="text-sm text-gray-600">Amount to pay</p>
        <p className="text-2xl font-bold text-green-600">₹{planPrice}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border rounded-lg bg-white">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <CardElement
            onChange={handleCardChange}
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

        {cardError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {cardError}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {loading ? "Processing Payment..." : `Pay ₹${planPrice}`}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Your payment is secure and encrypted
        </p>
      </form>
    </div>
  );
}