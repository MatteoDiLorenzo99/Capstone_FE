import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./../../Vinted/VintedCSS/OrderCheckoutCSS.css";  // Assicurati di avere i tuoi stili CSS qui

interface Product {
  title: string;
  prezzo: number;
  imageUrl: string; // Aggiungi l'immagine del prodotto
}


const OrderCheckout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product as Product;

  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [address, setAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  
console.log(product);

  if (!product) {
    return <div>Errore: Nessun prodotto selezionato!</div>;
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleConfirmPayment = () => {
    navigate("/PaymentStripe"); // Naviga alla pagina di conferma successo (da creare)
  };

  return (
    <div className="order-checkout">
      <h1>Checkout</h1>
      
      {/* Riepilogo ordine */}
      <div className="order-summary">
        <h2>Riepilogo Ordine</h2>
        <div className="product-details">
        <img src={product.immagine} alt={product.title} />
        <div className="product-info">
            <h3>{product.title}</h3>
            <p>{product.prezzo} €</p>
          </div>
        </div>
      </div>

      {/* Indirizzo di spedizione */}
      <div className="shipping-address">
        <h2>Indirizzo di spedizione</h2>
        <input 
          type="text" 
          placeholder="Inserisci il tuo indirizzo di spedizione" 
          value={address}
          onChange={handleAddressChange}
          required
        />
      </div>

      {/* Metodo di pagamento */}
      <div className="payment-method">
        <h2>Metodo di pagamento</h2>
        <div>
          <input 
            type="radio" 
            id="creditCard" 
            name="paymentMethod" 
            value="creditCard" 
            checked={paymentMethod === "creditCard"} 
            onChange={handlePaymentChange}
          />
          <label htmlFor="creditCard">Carta di credito</label>
        </div>
        <div>
          <input 
            type="radio" 
            id="paypal" 
            name="paymentMethod" 
            value="paypal" 
            checked={paymentMethod === "paypal"} 
            onChange={handlePaymentChange}
          />
          <label htmlFor="paypal">PayPal</label>
        </div>
      </div>

      {/* Riepilogo finale e pulsante di pagamento */}
      <div className="final-summary">
        <button 
          onClick={handleConfirmPayment}
          disabled={isProcessing || !address || !paymentMethod}
        >
          {isProcessing ? "Elaborazione..." : "Procedi con il pagamento"}
        </button>
      </div>
    </div>
  );
};

export default OrderCheckout;
