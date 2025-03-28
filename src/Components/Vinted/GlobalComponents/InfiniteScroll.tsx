import React, { useState, useEffect, useRef, useCallback } from "react";
import ItemCard from "./ItemCard";
import "./../VintedCSS/InfiniteScrollCSS.css";

// Funzione per recuperare i dati tramite l'API
const fetchItems = async (page: number) => {
  try {
    // Ottieni l'ID dell'utente loggato dal localStorage
    const loggedInUserId = localStorage.getItem("userId"); // Assicurati che l'ID sia correttamente memorizzato

    // Costruisci l'URL senza il parametro userId se l'utente non è loggato
    const url = loggedInUserId 
      ? `http://localhost:9090/api/products/random?page=${page}&size=6&userId=${loggedInUserId}`
      : `http://localhost:9090/api/products/random?page=${page}&size=6`; // Ometti il parametro userId

    // Fai la richiesta al back-end
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dati ricevuti dall'API:", data);

    return data.content;
  } catch (error) {
    console.error("Errore nel recupero degli elementi:", error);
    return []; // Restituisce un array vuoto in caso di errore
  }
};

const InfiniteScroll: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);  // Stato per memorizzare i prodotti
  const [page, setPage] = useState(0);  // Stato della paginazione
  const [loading, setLoading] = useState(false);  // Stato del caricamento
  const observer = useRef<IntersectionObserver | null>(null);  // Riferimento per IntersectionObserver

  // Callback che si attiva quando l'ultimo elemento entra nella vista
  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          fetchItems(page + 1).then((newItems: any) => {
            setItems((prev) => [...prev, ...newItems]);  // Aggiungiamo i nuovi prodotti alla lista
            setPage((prev) => prev + 1);  // Incrementiamo la pagina per il prossimo fetch
            setLoading(false);
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, page]  // La funzione dipende dallo stato di loading e dalla pagina
  );

  // Effetto per caricare i prodotti iniziali al caricamento del componente
  useEffect(() => {
    fetchItems(0).then((data: any) => setItems(data));  // Carichiamo i prodotti iniziali
  }, []);

  return (
    <div className="feed-container">
      <h2 className="feed-title">Feed</h2>
      <div className="feed-grid">
        {items.map((item, index) => (
          <div ref={index === items.length - 1 ? lastItemRef : null} key={item.id}>
            <ItemCard 
              id={item.id}
              image={item.immagine} // Assicurati che il campo corrisponda ai dati dell'API
              title={item.title}
              size={item.size}
              price={item.prezzo}
              likes={item.numero_like}
              ownerId={item.ownerId}
            />
          </div>
        ))}
      </div>
      {loading && <p className="loading">Caricamento...</p>}  {/* Mostriamo il messaggio di caricamento */}
    </div>
  );
};

export default InfiniteScroll;
