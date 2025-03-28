import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import "./../VintedCSS/NuoviArriviSection.css";

// Funzione per recuperare i dati tramite l'API
const fetchItems = async () => {
  try {
    // Ottieni l'ID dell'utente loggato dal localStorage
    const loggedInUserId = localStorage.getItem("userId"); // O dove hai memorizzato l'ID dell'utente loggato

    // Costruisci l'URL senza il parametro userId se l'utente non è loggato
    const url = loggedInUserId 
      ? `http://localhost:9090/api/products/random?page=0&size=5&userId=${loggedInUserId}`
      : `http://localhost:9090/api/products/random?page=0&size=5`; // Ometti il parametro userId

    // Fai la richiesta al server
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text(); // Leggi il testo della risposta
    const data = JSON.parse(text); // Converte la risposta in JSON

    return data.content || []; // Evita crash se 'content' è undefined
  } catch (error) {
    console.error("Errore nel recupero degli elementi:", error);
    return []; // Restituisce un array vuoto in caso di errore
  }
};

const NuoviArriviSection: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // Recupera i prodotti escludendo quelli dell'utente loggato
    fetchItems().then((data) => setItems(data)); // Recupera solo 5 elementi
  }, []);

  return (
    <div className="new-arrivals-section">
      <div className="section-header">
        <h2>Articoli visualizzati di recente</h2>
        <a href="#" className="see-all">Vedi tutti</a>
      </div>
      <div className="items-container">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            image={item.immagine} // Assicurati che il campo corrisponda ai dati dell'API
            title={item.title}
            size={item.size}
            price={item.prezzo}
            likes={item.numero_like}
            ownerId={item.ownerId}
          />
        ))}
      </div>
    </div>
  );
};

export default NuoviArriviSection;
