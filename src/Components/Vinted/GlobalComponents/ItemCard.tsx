import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "../UnloggedPage/AuthModal";
import "./../VintedCSS/ItemCard.css";

interface ItemProps {
  id: number;
  image: string;
  title: string;
  size: string;
  price: string;
  likes: number;
  ownerId: number;
}

const ItemCard: React.FC<ItemProps> = ({ id, image, title, size, price, likes, ownerId }) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const saveOwner = () => {
    // Salviamo l'owner nel localStorage
    localStorage.setItem("ownerId", ownerId.toString());
    console.log(ownerId);
  };

  const handleLike = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault(); // Evita la navigazione al click

    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      console.log(token);
      setIsAuthModalOpen(true); // Apri il modal di login se non loggato
      return;
    }

    try {
      const response = await fetch(`http://localhost:9090/api/products/${id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Errore nell'aggiornamento del like");
      }

      const data = await response.json();
      setLikeCount(data.numero_like); // Aggiorna lo stato con il nuovo numero di like
    } catch (error) {
      console.error("Errore nel like:", error);
    }
  };

  return (
    <>
      {/* Link alla pagina del prodotto */}
      <Link 
        to={`/product/${id}`} 
        className="item-card" 
        onClick={saveOwner}  // Salva l'owner prima della navigazione
      >
        <img 
          src={image} 
          alt={title} 
          className="item-image" 
          onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")} 
        />
        <div className="item-info">
          <h3 className="item-title">{title}</h3>
          <p className="item-size">{size}</p>
          <p className="item-price">{price} €</p>
        </div>
        <div className="like-button" onClick={handleLike}>
          ❤️ {likeCount}
        </div>
      </Link>

      {/* Modal per il login */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        mode="login"
        onLoginSuccess={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default ItemCard;
