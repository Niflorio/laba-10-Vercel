import './App_tw.css';
import { useState } from 'react';

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <button 
      className="w-16 h-16 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

interface BoardProps {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (squares: (string | null)[]) => void;
}

interface GameResult {
  winner: string | null;
  isDraw: boolean;
}

function Board({ xIsNext, squares, onPlay }: BoardProps) {
  function handleClick(i: number) {
    const result = calculateGameResult(squares);
    if (result.winner || result.isDraw || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const result = calculateGameResult(squares);
  let status: string;
  if (result.winner) {
    status = 'Победитель: ' + result.winner;
  } else if (result.isDraw) {
    status = 'Ничья!';
  } else {
    status = 'Следующий игрок: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-lg mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-2">
        {squares.map((square, index) => (
          <Square 
            key={index} 
            value={square} 
            onSquareClick={() => handleClick(index)} 
          />
        ))}
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_squares, move) => {
    const description = move > 0 ? `Перейти к ходу #${move}` : 'Перейти к началу игры';
    return (
      <li key={move}>
        <button 
          className="text-blue-500 hover:underline" 
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol className="list-disc">
          {moves}
        </ol>
      </div>
    </div>
  );
}

function calculateGameResult(squares: (string | null)[]): GameResult {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  // Проверка на победителя
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], isDraw: false };
    }
  }
  
  // Проверка на ничью
  const isDraw = squares.every(square => square !== null);
  return { winner: null, isDraw };
}