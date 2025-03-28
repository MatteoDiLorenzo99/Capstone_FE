import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeScreen from "./Components/HomeScreen";
import VintedUnloggedPage from "./Components/Vinted/UnloggedPage/VintedUnloggedHomepage";
import VintedLoggedPage from "./Components/Vinted/LoggedPage/LoggedPageScreen";
import Game from "./Components/Game/Game";
import SaldoPage from "./Components/Vinted/LoggedPage/SaldoPage/SaldoPage";
import ProductPage from "./Components/Vinted/GlobalComponents/ProductPage";
import Orders from "./Components/Vinted/LoggedPage/OrderPage/OrderListPage";
import ChatPage from "./Components/Vinted/GlobalComponents/Chat/ChatPage";
import SearchResults from "./Components/Vinted/GlobalComponents/SearchResults";
import OrderCheckout from "./Components/Vinted/GlobalComponents/OrderCheckout";
import PaymentPage from "./Components/Vinted/GlobalComponents/Checkout/PaymentPage";
import SuccessPage from "./Components/Vinted/GlobalComponents/Checkout/SuccessPage";

const App: React.FC = () => {
  const [isLogged, setIsLogged] = useState<boolean>(!!localStorage.getItem("token"));
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    setIsLogged(!!token); // Se c'è un token, l'utente è loggato
    if (storedUserId) {
      setUserId(parseInt(storedUserId)); // Recuperiamo l'userId e lo trasformiamo in numero
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/vinted" element={<VintedUnloggedPage setIsLogged={setIsLogged} />} />
        <Route path="/vinted/isLogged" element={isLogged ? <VintedLoggedPage /> : <Navigate to="/vinted" />} />
        <Route path="/saldo" element={isLogged ? <SaldoPage /> : <Navigate to="/vinted" />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/chat/:chatRoomId?" element={userId ? <ChatPage userId={userId} /> : <Navigate to="/vinted" />} />
        <Route path="/game" element={<Game />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/orderCheckout" element={<OrderCheckout />} />
        <Route path="/PaymentStripe" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
