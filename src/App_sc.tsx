import { useState } from 'react';
import styled from 'styled-components';

// Стилизованные компоненты
const SquareButton = styled.button`
  width: 60px;
  height: 60px;
  font-size: 24px;
  border: 1px solid #999;
  border-radius: 5px;
  background-color: #fff;
  margin: 5px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    background-color: #e0e0e0;
    border: 1px solid #666;
  }
`;

const StatusText = styled.div`
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: bold;
`;

const BoardRow = styled.div`
  display: flex;
  justify-content: center;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const GameInfo = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 300px;
`;

const MoveButton = styled.button`
  background: none;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  padding: 5px 10px;
  margin: 2px 0;
  border-radius: 3px;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

// Интерфейсы
interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
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

// Компоненты
function Square({ value, onSquareClick }: SquareProps) {
  return (
    <SquareButton onClick={onSquareClick}>
      {value}
    </SquareButton>
  );
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
    status = `Победитель: ${result.winner}`;
  } else if (result.isDraw) {
    status = 'Ничья!';
  } else {
    status = `Следующий игрок: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <>
      <StatusText>{status}</StatusText>
      <BoardRow>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </BoardRow>
      <BoardRow>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </BoardRow>
      <BoardRow>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </BoardRow>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
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

  const moves = history.map((_, move) => {
    const description = move > 0 ? `Перейти к ходу #${move}` : 'Вернуться к началу игры';
    return (
      <li key={move}>
        <MoveButton onClick={() => jumpTo(move)}>
          {description}
        </MoveButton>
      </li>
    );
  });

  return (
    <GameContainer>
      <div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <GameInfo>
        <h3>История ходов:</h3>
        <ol>{moves}</ol>
      </GameInfo>
    </GameContainer>
  );
}

function calculateGameResult(squares: (string | null)[]): GameResult {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // горизонтали
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // вертикали
    [0, 4, 8], [2, 4, 6]             // диагонали
  ];

  // Проверка на победителя
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], isDraw: false };
    }
  }

  // Проверка на ничью
  const isDraw = squares.every(square => square !== null);
  return { winner: null, isDraw };
}