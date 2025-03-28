import React, { useState, useEffect, useRef, useCallback } from "react";
import ItemCard from "./ItemCard";

const fetchUserProducts = async (ownerId: string, page: number) => {
  try {
    const response = await fetch(`http://localhost:9090/api/products?ownerId=${ownerId}&page=${page}&size=5`);
    if (!response.ok) {
      throw new Error(`Errore HTTP! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero dei prodotti dell'utente:", error);
    return [];
  }
};

const AltriProdottiComponent: React.FC<{ ownerId: string }> = ({ ownerId }) => {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setLoading(true);
          fetchUserProducts(ownerId, page + 1).then((newItems) => {
            setItems((prev) => [...prev, ...newItems]);
            setPage((prev) => prev + 1);
            setLoading(false);
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, page, ownerId]
  );

  useEffect(() => {
    fetchUserProducts(ownerId, 0).then(setItems);
  }, [ownerId]);

  return (
    <div className="other-products-section">
      <h2>Altri prodotti dell'utente</h2>
      <div className="products-grid">
        {items.map((item, index) => (
          <div ref={index === items.length - 1 ? lastItemRef : null} key={item.id}>
            <ItemCard
              id={item.id}
              image={item.immagine}
              title={item.title}
              size={item.size}
              price={item.prezzo}
              likes={item.numero_like}
              ownerId={item.ownerId}
            />
          </div>
        ))}
      </div>
      {loading && <p className="loading">Caricamento...</p>}
    </div>
  );
};

export default AltriProdottiComponent;
