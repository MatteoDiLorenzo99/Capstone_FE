import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./../../VintedCSS/ChatCss/ChatRoom.css";

interface Message {
  id: number;
  text: string;
  timestamp: string;
  sender: { id: number; username: string };
}

const ChatRoom: React.FC = () => {
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [handledOffers, setHandledOffers] = useState<{ [key: number]: boolean }>({});
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (!token) {
      console.error("Token mancante, impossibile recuperare i messaggi");
      return;
    }

    fetch(`http://localhost:9090/api/chat/${chatRoomId}/messages`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setMessages)
      .catch((err) => console.error("Errore nel recupero dei messaggi:", err));
  }, [chatRoomId, token]);

  const sendMessage = (messageText: string) => {
    if (!token) {
      console.error("Token mancante, impossibile inviare il messaggio");
      return;
    }

    const params = new URLSearchParams({
      senderId: userId?.toString() || "",
      text: messageText,
    });

    fetch(`http://localhost:9090/api/chat/${chatRoomId}/send?${params.toString()}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Errore HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setText("");
        fetch(`http://localhost:9090/api/chat/${chatRoomId}/messages`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then(setMessages);
      })
      .catch((err) => console.error("Errore nell'invio del messaggio:", err));
  };

  const extractOffer = (text: string) => {
    if (text.toLowerCase().includes("accettata")) {
      return null;
    }
    const match = text.match(/(\d+(\.\d{1,2})?)\s*euro/i);
    return match ? match[1] : null;
  };

  const handleAcceptOffer = (offer: string, messageId: number) => {
    sendMessage(`Offerta di ${offer} euro accettata! Procediamo con l'acquisto.`);
    setHandledOffers((prev) => ({ ...prev, [messageId]: true }));
  };

  const handleCounterOffer = (currentOffer: string, messageId: number) => {
    const newOffer = prompt(`Fai una controfferta (offerta attuale: ${currentOffer}€)`);
    if (newOffer) {
      sendMessage(`Ti propongo un prezzo di ${newOffer} euro.`);
      setHandledOffers((prev) => ({ ...prev, [messageId]: true }));
    }
  };

  const handlePurchase = () => {
    // Recupera i dettagli del prodotto dal localStorage
    const product = JSON.parse(localStorage.getItem("productDetails") || '{}');

    if (product && product.title) {
      // Naviga al checkout passando il prodotto nel state
      navigate("/orderCheckout", {
        state: { product },
      });
    } else {
      alert("Errore: Nessun prodotto selezionato!");
    }
  };

  return (
    <div className="chat-room">
      <button className="back-button" onClick={() => navigate("/chat")}>
        <span className="arrow">←</span> Torna indietro
      </button>
      <h2>Chat</h2>
      <div className="messages">
        {messages.map((msg) => {
          const isReceived = msg.sender.id !== parseInt(userId || "");
          const offer = extractOffer(msg.text);
          const isHandled = handledOffers[msg.id] || false;
          const isAcceptedMessage = msg.text
            .toLowerCase()
            .includes("offerta di") && msg.text.toLowerCase().includes("accettata");

          return (
            <div key={msg.id} className={`message ${isReceived ? "received" : "sent"}`}>
              <p>
                <strong>{msg.sender.username}:</strong> {msg.text}
              </p>
              {offer && isReceived && (
                <div className="offer-actions">
                  <button onClick={() => handleAcceptOffer(offer, msg.id)} disabled={isHandled}>
                    Accetta
                  </button>
                  <button onClick={() => handleCounterOffer(offer, msg.id)} disabled={isHandled}>
                    Fai il tuo prezzo
                  </button>
                </div>
              )}
              {isAcceptedMessage && isReceived && (
                <button className="purchase-button" onClick={handlePurchase}>
                  Acquista Subito
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="message-input">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Scrivi un messaggio..." />
        <button onClick={() => sendMessage(text)}>Invia</button>
      </div>
    </div>
  );
};

export default ChatRoom;
