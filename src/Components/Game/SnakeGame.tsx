import React, { useState, useEffect, useRef } from 'react';
import './Gamestyle.css';

const SnakeGame: React.FC = () => {
  const boardSize = 400;  // Dimensioni della "board" del gioco
  const gridSize = 20;    // Dimensione di ogni cella della griglia
  const initialSnake = [
    { x: 160, y: 160 },
    { x: 140, y: 160 },
    { x: 120, y: 160 },
  ]; // Posizione iniziale del serpente

  const generateFood = () => {  // Definisci generateFood qui
    const x = Math.floor(Math.random() * (boardSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (boardSize / gridSize)) * gridSize;
    return { x, y };
  };

  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(generateFood());  // Usa generateFood qui
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  
  snakeRef.current = snake;
  foodRef.current = food;



  const moveSnake = (newDirection: string) => {
    setDirection(newDirection);
  };

  const moveSnakeStep = () => {
    if (gameOver) return;

    let head = { ...snakeRef.current[0] };
    switch (direction) {
      case 'RIGHT':
        head = { x: head.x + gridSize, y: head.y };
        break;
      case 'LEFT':
        head = { x: head.x - gridSize, y: head.y };
        break;
      case 'UP':
        head = { x: head.x, y: head.y - gridSize };
        break;
      case 'DOWN':
        head = { x: head.x, y: head.y + gridSize };
        break;
      default:
        break;
    }

    // Aggiungi la testa e rimuovi l'ultima parte della coda
    const newSnake = [head, ...snakeRef.current.slice(0, snake.length - 1)];

    // Verifica collisioni con il muro
    if (
      head.x < 0 ||
      head.x >= boardSize ||
      head.y < 0 ||
      head.y >= boardSize ||
      snakeRef.current.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    // Verifica se ha mangiato il cibo
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      // Cresci il serpente
      const newSnakeWithFood = [...newSnake, { ...snakeRef.current[snake.length - 1] }];
      setSnake(newSnakeWithFood);
      setScore(score + 1);
      setFood(generateFood());
    } else {
      setSnake(newSnake);
    }
  };

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnakeStep();
    }, 100); // Aggiusta la velocità del gioco

    return () => clearInterval(interval);
  }, [direction, snake, food, gameOver]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') moveSnake('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') moveSnake('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') moveSnake('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') moveSnake('RIGHT');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  return (
    <div className="game-container">
      <h1>Snake Game</h1>
      {gameOver ? <div className="game-over">Game Over!</div> : null}
      <div className="score">Score: {score}</div>
      <div className="board">
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake"
            style={{
              top: segment.y + 'px',
              left: segment.x + 'px',
            }}
          />
        ))}
        <div
          className="food"
          style={{
            top: food.y + 'px',
            left: food.x + 'px',
          }}
        />
      </div>
    </div>
  );
};

export default SnakeGame;
