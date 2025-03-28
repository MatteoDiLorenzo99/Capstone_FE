import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useParams } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51R2u15H5H7cuaYz2mvssnhKHo3Jai4ospyW4syUNqGxSFcHHLxitt38wx4DIbzAqF8yIn8KHOWrAfebum4pGIY5M00yXl57zXp");

const PaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get project ID from URL params
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const idprodotto = localStorage.getItem("IDPRODOTTO");
  const link ="http://localhost:9090/api/checkout/create-checkout-session";

  const handleCheckout = async () => {
    if (!token || !userId) {
      alert("You must be logged in to proceed with the payment.");
      return;
    }
  
    try {
        console.log(link);
        console.log(token, userId, idprodotto);
      const { data } = await axios.post(
        link,
        {
          prodottoId: idprodotto, // 🔥 Usa l'ID dinamico
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
        },
        }
      );
  
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error creating checkout session.");
      }
    } catch (error) {
      console.error("Error during checkout request:", error);
      alert("Error processing payment. Check the console for details.");
    }
  };
  

  return (
    <div className="payment-page">
      <h1>Payment Page</h1>
      <button onClick={handleCheckout}>Proceed to Payment</button>
    </div>
  );
};

export default PaymentPage;