import React from "react";
import SnakeGame from "./SnakeGame.tsx";

const Game: React.FC = () => {
  return (
    <div>

      <SnakeGame />
      <button className="buttongame" onClick={() => window.location.reload()}>Ricomincia</button>
      <p className="gameP">
        per giocare: <br></br>
        -WASD per muoversi <br></br>
        -mangiare le mele<br></br>
        -pregare che non si buggi<br></br>
      </p>

      <button  className="buttongame" onClick={() => window.location.href = 'https://www.google.com'}>TORNA ALLA HOME, perdente</button>
      </div>
  );
};

export default Game;
