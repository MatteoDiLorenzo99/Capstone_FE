import React, { useEffect, useState } from "react";
import "./../../VintedCSS/OrderListPage.css";
import NavbarLogged from "../LoggedNavbar";

// Tipi per un ordine
interface Order {
  id: number;
  prodotto: {
    id: number;
    immagine: string;  // Usa 'immagine' invece di 'image'
    title: string;
    price: string;
  };
  status: "in_corso" | "completato" | "annullato";
  message: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("tutti");
  const [selectedSection, setSelectedSection] = useState<"vendite" | "acquisti">("vendite");
  const [loading, setLoading] = useState<boolean>(true);

  const userToken = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // Supponiamo che sia salvato nel localStorage

  useEffect(() => {
    if (!userToken || !userId) {
      console.error("Token o ID utente non disponibili.");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log(userId);
    
        const endpoint =
          selectedSection === "acquisti"
            ? `http://localhost:9090/api/transactions/acquisti/${userId}`
            : `http://localhost:9090/api/transactions/vendite/${userId}`;
    
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });
    
        if (!response.ok) {
          throw new Error("Errore nel recupero degli ordini");
        }
    
        const data: Order[] = await response.json();
        console.log("Dati ricevuti dall'API:", data); // Log per vedere i dati
        setOrders(data);
      } catch (error) {
        console.error("Errore nel recupero degli ordini:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedSection]); // Cambia gli ordini quando si passa tra acquisti e vendite

  // Filtrare gli ordini in base allo stato selezionato
  const filteredOrders =
    selectedFilter === "tutti" ? orders : orders.filter((order) => order.status === selectedFilter);

  return (
    <div>
      <NavbarLogged />
      <div className="orders-container">
        <h2>I miei ordini</h2>

        {/* Sidebar per scegliere tra vendite e acquisti */}
        <div className="orders-sidebar">
          <p
            className={`sidebar-link ${selectedSection === "vendite" ? "active" : ""}`}
            onClick={() => setSelectedSection("vendite")}
          >
            Vendite
          </p>
          <p
            className={`sidebar-link ${selectedSection === "acquisti" ? "active" : ""}`}
            onClick={() => setSelectedSection("acquisti")}
          >
            Acquisti
          </p>
        </div>

        {/* Filtri */}
        <div className="orders-filters">
          {["tutti", "in_corso", "completato", "annullato"].map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${selectedFilter === filter ? "active" : ""}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter === "tutti"
                ? "Tutti"
                : filter === "in_corso"
                ? "In corso"
                : filter === "completato"
                ? "Completati"
                : "Annullati"}
            </button>
          ))}
        </div>

        {/* Contenuto */}
        <div className="orders-content">
          {loading ? (
            <p>Caricamento ordini...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="no-orders">Nessun ordine trovato</p>
          ) : (
            <div className="orders-list">
              {filteredOrders.map((order) => (
                <div key={order.id} className="order-card">
                  <img
                    src={order.prodotto.immagine} // Usa 'immagine' invece di 'image'
                    alt={order.prodotto.title}
                    className="order-img"
                  />
                  <div className="order-info">
                    <h3 className="order-title">{order.prodotto.title}</h3>
                    <p className="order-price">{parseFloat(order.prodotto.price)} €</p> {/* Conversione del prezzo in numero */}
                    <p className={`order-status ${order.status}`}>
                      {order.status === "in_corso" && order.message === "Pagamento riuscito." ? (
                        <span className="status-icon danger">⚠️</span>
                      ) : order.status === "completato" ? (
                        <span className="status-icon success">✅</span>
                      ) : order.status === "annullato" ? (
                        <span className="status-icon danger">❌</span>
                      ) : (
                        <span className="status-icon pending">⏳</span>
                      )}
                      {order.message}
                    </p>
                  </div>
                  <span className="order-arrow">›</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
