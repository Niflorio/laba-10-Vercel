import { useState } from 'react';
import { Button, Typography, Box, List, ListItem } from '@mui/material';

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
}

function Square({ value, onSquareClick }: SquareProps) {
  return (
    <Button 
      variant="contained" 
      onClick={onSquareClick} 
      sx={{
        width: '60px',
        height: '60px',
        fontSize: '24px',
        color: '#000',
        backgroundColor: '#fff',
        '&:hover': {
          backgroundColor: '#f5f5f5'
        },
        margin: '4px'
      }}
    >
      {value}
    </Button>   
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
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{status}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex' }}>
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </Box>
      </Box>
    </Box>
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

  const moves = history.map((_, move) => {
    const description = move > 0 ? `Перейти к ходу #${move}` : 'Вернуться к началу игры';
    return (
      <ListItem key={move} sx={{ p: 0 }}>
        <Button 
          onClick={() => jumpTo(move)}
          sx={{ textTransform: 'none' }}
        >
          {description}
        </Button>
      </ListItem>
    );
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      <Box sx={{ width: '100%', maxWidth: '300px' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>История ходов:</Typography>
        <List sx={{ p: 0 }}>
          {moves}
        </List>
      </Box>
    </Box>
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
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], isDraw: false };
    }
  }
  
  // Проверка на ничью
  const isDraw = squares.every(square => square !== null);
  return { winner: null, isDraw };
}