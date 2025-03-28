import React from "react";
import { Link } from "react-router-dom";

const CancelPage: React.FC = () => {
  return (
    <div className="payment-status-container">
      <h1>Pagamento Annullato ❌</h1>
      <p>Sembra che tu abbia annullato il pagamento. Se hai bisogno di aiuto, contatta il nostro supporto.</p>
      <Link to="/payment">
        <button className="payment-btn">Riprova il Pagamento</button>
      </Link>
      <Link to="/">
        <button className="payment-btn secondary">Torna alla Home</button>
      </Link>
    </div>
  );
};

export default CancelPage;