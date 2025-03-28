import React, { useState } from "react";
import "./../VintedCSS/AuthModalCSS.css";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onLoginSuccess: (token: string) => void; // Passiamo il token alla funzione
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:9090/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        console.log(data.token);
        localStorage.setItem("userId", data.userId);
        onLoginSuccess(data.token);
        window.location.reload(); // 🔄 Ricarica la pagina per attivare la versione loggata
      } else {
        const errorData = await response.json();
        console.error("Errore durante il login:", errorData);
      }
    } catch (error) {
      console.error("Errore di rete:", error);
    }
  };
  

  return (
    <div className={`auth-modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === "login" ? "Accedi" : "Registrati"}</h2>

        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="auth-btn submit">Accedi</button>
          </form>
        )}

        {mode === "register" && (
          <>
            <input type="text" placeholder="Nome utente" className="auth-input" />
            <input type="email" placeholder="Email" className="auth-input" />
            <input type="password" placeholder="Password" className="auth-input" />
          </>
        )}

        <button className="auth-close" onClick={onClose}>X</button>
      </div>
    </div>
  );
};

export default AuthModal;