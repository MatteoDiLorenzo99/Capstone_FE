import React, { useEffect, useState } from "react";
import axios from "axios";
import Confetti from "react-confetti"; // 🎉 Libreria per effetti
import { useNavigate } from "react-router-dom"; // 🔄 Per la navigazione

const SuccessPage: React.FC = () => {
  const [webhookData, setWebhookData] = useState<any>(null);
  const [transactionSaved, setTransactionSaved] = useState(false);
  const token = localStorage.getItem("token");
  console.log(token);
  const navigate = useNavigate(); // 🚀 Hook per la navigazione

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/webhook/last-event", {
        headers: { Authorization: `Bearer ${token}`
    },
      })
      .then((response) => {
       console.log("dati ricevuti dal webhool", response.data);
       setWebhookData(response.data);
      })
      .catch((error) => {
        console.error("❌ Errore nel recupero dei dati dal webhook:", error);
      });
  }, [token]);

  useEffect(() => {
    if (webhookData && !transactionSaved) {
      handleSaveTransaction();
    }
  }, [webhookData]);

  const handleSaveTransaction = () => {
    if (!webhookData) return;

    const transactionData = {
      stripeSessionId: webhookData.session_id,
      amount: webhookData.amount_total / 100,
      userId: webhookData.client_reference_id,
      prodottoId: webhookData.prodottoId,
    };

    axios
      .post("http://localhost:9090/api/transactions", transactionData, {
        headers: { Authorization: `Bearer ${token}`
    },
      })
      .then((response) => {
        console.log("✅ Transazione salvata con successo:", response.data);
        setTransactionSaved(true);
      })
      .catch((error) => {
        console.error("❌ Errore nel salvataggio della transazione:", error);
      });
  };

  return (
    <div className="payment-status-container">
      {transactionSaved && <Confetti />} {/* 🎉 Effetto fuochi d'artificio */}

      <h1 className="thank-you-message">GRAZIE PER AVERCI AIUTATO 🎊</h1>

      {/* 🔘 Bottoni di navigazione */}
      <div className="button-container">
        <button className="navigate-button" onClick={() => navigate("/")}>
          🏠 Vai alla Dashboard
        </button>
        <button className="navigate-button" onClick={() => navigate("/projects")}>
          📂 Esplora Progetti
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;