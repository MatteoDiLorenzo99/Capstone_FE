import React from "react";
import { useNavigate } from "react-router-dom";
import "./Css/HomeScreenCSS.css";

// Importa immagini
import img1 from "./Images/netflix.png";
import img2 from "./Images/weather.png";
import img3 from "./Images/library.png";
import img4 from "./Images/vinted.png";
import img5 from "./Images/linkedin.png";
import img6 from "./Images/apple_Music.png";
import img7 from "./Images/spotify.png";
import img8 from "./Images/gioco.png";

const images = [
  { src: img1, name: "netflix", url: "https://www.google.com" },
  { src: img2, name: "weather", url: "https://www.google.com" },
  { src: img3, name: "library", url: "https://www.google.com" },
  { src: img4, name: "vinted", route: "/vinted" }, // Aprirà il componente Vinted
  { src: img5, name: "linkedin", url: "https://www.google.com" },
  { src: img6, name: "apple_music", url: "https://www.google.com" },
  { src: img7, name: "spotify", url: "https://www.google.com" },
  { src: img8, name: "game", route: "/game" }, // Aprirà il componente Game
];

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  // Divide le immagini in righe da 5 elementi
  const rows: { src: string; name: string; url?: string; route?: string }[][] = [];
  for (let i = 0; i < images.length; i += 5) {
    rows.push(images.slice(i, i + 5));
  }

  return (
    <div className="home-container">
      <div className="grid">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((image, colIndex) => (
              <div
                key={colIndex}
                className="square"
                onClick={() => {
                  if (image.route) {
                    navigate(image.route); // Naviga a un'altra pagina
                  } else if (image.url) {
                    window.location.href = image.url; // Reindirizza all'URL
                  }
                }}
              >
                <img src={image.src} alt={image.name} className="square-img" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
