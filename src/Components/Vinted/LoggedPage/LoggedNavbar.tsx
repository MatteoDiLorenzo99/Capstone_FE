import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./../Images/Logo.png"; // Aggiungi il logo

const NavbarLogged: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // Stato per il menu
  const navigate = useNavigate();

  // Funzione di logout
  const handleLogout = () => {
    // Rimuoviamo il flag di login da localStorage
    localStorage.removeItem("isLogged");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/vinted"); // Riporta l'utente alla pagina di login
  };

  // Funzione per aprire/chiudere il menu a tendina
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Funzione per gestire la ricerca
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <nav className="navbar-logged">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <a href="/" className="logo-link">
            <img src={Logo} alt="Vinted Logo" className="logo-img" />
          </a>
        </div>

        {/* Barra di ricerca */}
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

        {/* Link di navigazione */}
        <div className="navbar-links">
          {/* Profilo con menu a tendina */}
          <div className="profile-menu">
            <button className="navbar-link" onClick={toggleMenu}>
              Il mio profilo
            </button>
            {menuOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate("/orders")} className="dropdown-item">
                  I miei ordini
                </button>
                <button onClick={() => navigate("/chat")} className="dropdown-item">
                  Chat
                </button>
                <button onClick={() => navigate("/saldo")} className="dropdown-item">
                  Saldo
                </button>
                <button onClick={() => navigate("/settings")} className="dropdown-item">
                  Impostazioni
                </button>
                <button onClick={() => navigate("/invite")} className="dropdown-item">
                  Invita amici
                </button>
              </div>
            )}
          </div>

          <button className="navbar-link" onClick={() => navigate("/vinted/isLogged")}>
            Home
          </button>
          <button className="navbar-link" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarLogged;
