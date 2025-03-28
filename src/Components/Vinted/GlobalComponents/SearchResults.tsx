import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ItemCard from "../GlobalComponents/ItemCard";

// Aggiungere la struttura CSS di InfiniteScroll
const SearchResults: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  const [results, setResults] = useState<Product[]>([]);

  interface Product {
    id: number;
    immagine: string;
    title: string;
    packageSize: string;
    prezzo: string;
    numero_like: number;
    ownerId: number;
  }

  useEffect(() => {
    console.log(localStorage.getItem("token"));
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://localhost:9090/api/products/search?query=${query}`);
        if (!response.ok) throw new Error("Errore nella ricerca");

        const data = await response.json();
        setResults(data.content);
      } catch (error) {
        console.error("Errore nella ricerca:", error);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="feed-container">
      <h2 className="feed-title">Risultati per "{query}"</h2>
      <div className="feed-grid">
        {results.length > 0 ? (
          results.map((product) => (
            <div key={product.id}>
              <ItemCard
                id={product.id}
                image={product.immagine}
                title={product.title}
                size={product.packageSize}
                price={product.prezzo}
                likes={product.numero_like}
                ownerId={product.ownerId}
              />
            </div>
          ))
        ) : (
          <p>Nessun risultato trovato.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
