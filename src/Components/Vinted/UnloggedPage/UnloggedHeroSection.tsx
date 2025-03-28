import React from "react";
import "./../VintedCSS/UnlockedHeroSectionCSS.css";

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>È arrivato il momento di liberare l’armadio!</h1>
        <button className="signup-btn">Iscriviti subito</button>
        <a href="#" className="how-it-works">Scopri come funziona</a>
      </div>
    </section>
  );
};

export default HeroSection;
