import { useState, useEffect, useRef } from 'react'
import './App.css'

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 }
];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const SPEED = 120;

function getRandomFood(snake) {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) break;
  }
  return newFood;
}

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFood(INITIAL_SNAKE));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const moveRef = useRef(direction);

  useEffect(() => {
    moveRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (moveRef.current.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (moveRef.current.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (moveRef.current.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (moveRef.current.x !== -1) setDirection({ x: 1, y: 0 }); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const newHead = {
          x: prev[0].x + moveRef.current.x,
          y: prev[0].y + moveRef.current.y
        };
        // 撞墙或撞自己
        if (
          newHead.x < 0 || newHead.x >= BOARD_SIZE ||
          newHead.y < 0 || newHead.y >= BOARD_SIZE ||
          prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          setGameOver(true);
          return prev;
        }
        let newSnake;
        if (newHead.x === food.x && newHead.y === food.y) {
          newSnake = [newHead, ...prev];
          setFood(getRandomFood([newHead, ...prev]));
          setScore(s => s + 1);
        } else {
          newSnake = [newHead, ...prev.slice(0, -1)];
        }
        return newSnake;
      });
    }, SPEED);
    return () => clearInterval(interval);
  }, [food, gameOver]);

  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(getRandomFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="snake-container">
      <h1>贪吃蛇游戏</h1>
      <div className="score">分数: {score}</div>
      <div className="board">
        {Array.from({ length: BOARD_SIZE }).map((_, y) => (
          <div className="row" key={y}>
            {Array.from({ length: BOARD_SIZE }).map((_, x) => {
              const isSnake = snake.some(seg => seg.x === x && seg.y === y);
              const isHead = snake[0].x === x && snake[0].y === y;
              const isFood = food.x === x && food.y === y;
              return (
                <div
                  key={x}
                  className={`cell${isSnake ? ' snake' : ''}${isHead ? ' head' : ''}${isFood ? ' food' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="game-over">
          <div>游戏结束！最终得分：{score}</div>
          <button onClick={handleRestart}>重新开始</button>
        </div>
      )}
      <div className="tip">使用方向键控制移动</div>
    </div>
  );
}

export default App
