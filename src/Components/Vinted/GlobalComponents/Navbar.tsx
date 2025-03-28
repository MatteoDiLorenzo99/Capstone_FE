import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./../UnloggedPage/AuthModal";
import "./../VintedCSS/Navbar.css";
import Logo from "./../Images/Logo.png";

interface NavbarProps {
  setIsLogged: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setIsLogged }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Stato login aggiornato:", localStorage.getItem("isLogged"));
  }, []);

  const openAuthModal = (mode: "login" | "register") => {
    setIsAuthModalOpen(true);
    setMode(mode);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleLoginSuccess = () => {
    localStorage.setItem("isLogged", "true"); // Salviamo lo stato di login
    setIsLogged(true); // Aggiorniamo lo stato React
    closeAuthModal();
    navigate("/vinted/isLogged"); // Redirect alla pagina loggata
  };

  // Funzione per gestire la ricerca
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };


  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <a href="/" className="logo-link">
              <img src={Logo} alt="Vinted Logo" className="logo-img" />
            </a>
          </div>

          <div className="navbar-search">
            <input
              type="text"
              className="search-input"
              placeholder="Cerca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch}>Cerca</button>
          </div>

       

          <div className="navbar-links">
            <button className="navbar-link" onClick={() => openAuthModal("login")}>
              Accedi
            </button>
            <button className="navbar-link navbar-register" onClick={() => openAuthModal("register")}>
              Registrati
            </button>
          </div>

          <div className="navbar-home">
            <button className="navbar-home-btn" onClick={() => navigate("/")}>
              Torna alla Home
            </button>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} mode={mode} onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

export default Navbar;
