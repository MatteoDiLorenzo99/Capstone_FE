import React, { useState, useEffect } from "react";
import "./../../VintedCSS/SaldoComponent.css";

const SaldoComponent: React.FC = () => {
  // Stati per i saldi e per la visibilità del modal
  const [saldoSospeso, setSaldoSospeso] = useState<number>(0);
  const [saldoDisponibile, setSaldoDisponibile] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [transferAmount, setTransferAmount] = useState<number>(0);

  // Funzione per aprire e chiudere il modal
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Funzione per gestire l'input dell'importo da trasferire
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransferAmount(Number(e.target.value));
  };

  // Funzione per gestire la richiesta di trasferimento del saldo
  const handleTransfer = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      console.log(token);
      if (!token || !userId) {
        console.error("Token o ID utente mancanti! L'utente deve fare il login.");
        return;
      }

      if (transferAmount <= 0 || transferAmount > saldoDisponibile) {
        alert("Importo non valido.");
        return;
      }

      const response = await fetch(`http://localhost:9090/api/prelievo/transfer/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: transferAmount }),
      });

      if (!response.ok) {
        console.log(token);

        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const data = await response.json();
      setSaldoDisponibile(data.newSaldo);  // Aggiorna il saldo disponibile
      setSaldoSospeso(data.newSaldoSospeso); // Aggiorna il saldo sospeso se necessario
      toggleModal(); // Chiudi il modal
    } catch (error) {
      console.error("Errore nel trasferimento:", error);
    }
  };

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        console.log(token);
        if (!token || !userId) {

          console.error("Token o ID utente mancanti! L'utente deve fare il login.");
          return;
        }

        const response = await fetch(`http://localhost:9090/api/saldo/getsaldo/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);

        const data = await response.json();
        console.log(token);
        setSaldoSospeso(data.saldoSospeso);
        setSaldoDisponibile(data.saldo);
      } catch (error) {
        console.error("Errore nel recupero del saldo:", error);
      }
    };

    fetchSaldo();
  }, []);

  return (
    <div className="saldo-container">
      <div className="saldo-box">
        <p className="saldo-date">Febbraio 2025</p>
        <p className="saldo-label">Saldo in sospeso</p>
        <p className="saldo-amount">{saldoSospeso.toFixed(2)} €</p>
      </div>

      <div className="saldo-extra">
        <p>Vuoi guadagnare soldi extra?</p>
        <p>Più articoli carichi, più facile sarà per gli utenti trovarti.</p>
        <a href="/carica-articolo" className="saldo-link">Carica un articolo &gt;</a>
      </div>

      <div className="saldo-box">
        <p className="saldo-amount saldo-disponibile">{saldoDisponibile.toFixed(2)} €</p>
        <p className="saldo-label">Saldo disponibile</p>
        <button className="saldo-button" onClick={toggleModal}>Trasferisci sul conto corrente</button>
      </div>

      {/* Modal per il trasferimento del saldo */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Trasferisci saldo</h2>
            <p>Saldo disponibile: {saldoDisponibile.toFixed(2)} €</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="amount">Importo da trasferire (€):</label>
              <input
                type="number"
                id="amount"
                value={transferAmount}
                onChange={handleAmountChange}
                min="0"
                max={saldoDisponibile}
              />
              <button type="button" onClick={handleTransfer}>Conferma Trasferimento</button>
              <button type="button" onClick={toggleModal}>Annulla</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaldoComponent;
