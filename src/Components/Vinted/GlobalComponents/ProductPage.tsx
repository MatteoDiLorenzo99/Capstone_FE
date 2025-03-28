import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./../VintedCSS/ProductPage.css";
import NavbarLogged from "./../LoggedPage/LoggedNavbar";
import AltriProdottiComponent from "./AltriProdottiComponent";  

const fetchProduct = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:9090/api/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero del prodotto:", error);
    return null;
  }
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [customPrice, setCustomPrice] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); 
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      fetchProduct(id).then((fetchedProduct) => {
        setProduct(fetchedProduct);
        console.log("ID prodotto:", fetchedProduct.id); // Aggiungi questa riga per stampare l'ID del prodotto
        localStorage.setItem("IDPRODOTTO", fetchedProduct.id);
        console.log(localStorage.getItem("IDPRODOTTO"));
      });
    }
  }, [id]);

  if (!product) {
    return <div>Caricamento...</div>;
  }

  const discountedPrice = (percentage: number) => {
    return (product.prezzo * (1 - percentage / 100)).toFixed(2);
  };

  const handleChat = async () => {
    try {
      console.log(userId, product.sellerId, product.id);
      const response = await fetch(
        `http://localhost:9090/api/chat/create?user1Id=${userId}&user2Id=${product.ownerId}&productId=${product.id}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const chatRoom = await response.json();
      navigate(`/chat/${chatRoom.id}`);
    } catch (error) {
      console.error("Errore nella creazione della chat:", error);
    }
  };

  const handleOpenChatWithOffer = async (offerPrice: string) => {
    try {
      const response = await fetch(
        `http://localhost:9090/api/chat/create?user1Id=${userId}&user2Id=${product.ownerId}&productId=${product.id}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const chatRoom = await response.json();
      navigate(`/chat/${chatRoom.id}`);

      // Invia il messaggio con l'offerta
      await fetch(
        `http://localhost:9090/api/chat/${chatRoom.id}/send?senderId=${userId}&text=Ciao! Venderesti questo prodotto per ${offerPrice} euro?`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Errore nell'invio dell'offerta:", error);
    }
  };

  const handleBuyNow = () => {
    // Redirect to the OrderCheckout component
    navigate("/orderCheckout", {
      state: { product } // Optional: passing product data as state
    });
  };

  return (
    <div>
      <NavbarLogged />
      <div className="product-page">
        <div className="product-image">
          <img src={product.immagine} alt={product.title} />
        </div>
        <div className="product-details">
          <h1>{product.title}</h1>
          <p className="price">{product.prezzo} €</p>
          <button className="info-button" onClick={handleChat}>Chiedi info</button>
          <button className="offer-button" onClick={() => setShowModal(true)}>Fai un'offerta</button>
          <button className="buy-now-button" onClick={handleBuyNow}>Compra subito</button>
        </div>
      </div>

      <AltriProdottiComponent ownerId={product.ownerId} />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Fai un'offerta</h3>
            <p>Prezzo originale: {product.prezzo} €</p>
            <div className="discount-options">
              <button onClick={() => handleOpenChatWithOffer(discountedPrice(5))}>
                -5% ({discountedPrice(5)} €)
              </button>
              <button onClick={() => handleOpenChatWithOffer(discountedPrice(10))}>
                -10% ({discountedPrice(10)} €)
              </button>
              <button onClick={() => handleOpenChatWithOffer(discountedPrice(15))}>
                -15% ({discountedPrice(15)} €)
              </button>
            </div>
            <input
              type="number"
              placeholder="Inserisci la tua offerta"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
            />
            <button onClick={() => handleOpenChatWithOffer(customPrice)}>Invia Offerta</button>
            <button onClick={() => setShowModal(false)}>Chiudi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
