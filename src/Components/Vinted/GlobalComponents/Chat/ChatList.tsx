import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../../VintedCSS/ChatCss/ChatList.css";

interface ChatRoom {
  id: number;
  user1: { id: number; username: string };
  user2: { id: number; username: string };
  product: { id: number; title: string };
}

const ChatList: React.FC<{ userId: number }> = ({ userId }) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:9090/api/chat/user/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setChatRooms(data);
        console.log(data);  // Aggiungi questa riga per stampare tutti i dettagli
      })
      .catch((err) => console.error("Errore nel recupero delle chat:", err));
  }, [userId]);

  const aprichat = (chatId: number, product: { id: number; title: string }) => {
    // Salva i dettagli del prodotto nel localStorage
    localStorage.setItem("productDetails", JSON.stringify(product));

    // Naviga alla chat specifica
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="chat-list">
      {/* Back button */}
      <button className="back-button" onClick={() => navigate('/vinted/isLogged')}>
        <span className="arrow">←</span> Torna indietro
      </button>
      
      <h2>Le tue chat</h2>
      {chatRooms.map((chat) => (
        <div 
          key={chat.id} 
          onClick={() => aprichat(chat.id, chat.product)} // Passa il prodotto alla funzione aprichat
          className="chat-item"
        >
          <p>Chat su <span className="product-title">{chat.product.title}</span></p>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
