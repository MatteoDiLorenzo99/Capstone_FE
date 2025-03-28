import React from "react";
import "./../VintedCSS/UnderHeroComponentCSS.css";

const UnderHeroComponent: React.FC = () => {
  return (
    <div className="under-hero-container">
      <div className="text-box">
        <span className="tag">NOVITÀ</span>
        <h2>Vendi articoli di elettronica senza costi</h2>
        <button className="earn-button">Inizia a guadagnare</button>
      </div>
    </div>
  );
};

export default UnderHeroComponent;
