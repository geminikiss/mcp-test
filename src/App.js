import React, { useState } from 'react';
import './App.css';

function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [showModal, setShowModal] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState(null);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setIsXNext(!isXNext);
  }

  function handleRestart() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setIsXNext(true);
    setShowModal(false);
  }

  function updateScore(result) {
    if (result === 'draw') {
      setWinner(null);
      setShowModal(true);
    } else if (result) {
      setScores(prev => ({
        ...prev,
        [result]: prev[result] + 1
      }));
      setWinner(result);
      setShowModal(true);
    }
  }

  function handleEndGame() {
    setGameEnded(true);
    setShowModal(false);
  }

  function handleContinue() {
    handleRestart();
  }

  return (
    <div className="game">
      <div className="game-info">
        <div className="scores">
          <div className="score x-score">Player X: {scores.X}</div>
          <div className="score o-score">Player O: {scores.O}</div>
        </div>
        <button className="restart-button" onClick={handleRestart}>Restart Game</button>
      </div>
      <div className="game-board">
        <Board 
          squares={currentSquares} 
          xIsNext={isXNext} 
          onPlay={handlePlay}
          onWin={updateScore}
          gameEnded={gameEnded}
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Game Result</h2>
            {winner ? (
              <p className={winner === 'X' ? 'x-mark' : 'o-mark'}>
                Player {winner} Wins!
              </p>
            ) : (
              <p className="draw-result">It's a Draw!</p>
            )}
            <div className="modal-buttons">
              <button className="modal-button continue" onClick={handleContinue}>
                Continue
              </button>
              <button className="modal-button end-game" onClick={handleEndGame}>
                End Game
              </button>
            </div>
          </div>
        </div>
      )}

      {gameEnded && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Final Results</h2>
            <div className="final-scores">
              <p className="x-mark">Player X: {scores.X} wins</p>
              <p className="o-mark">Player O: {scores.O} wins</p>
              <p className="winner-announcement">
                {scores.X > scores.O ? "Player X Wins the Game!" :
                 scores.O > scores.X ? "Player O Wins the Game!" :
                 "It's a Tie!"}
              </p>
            </div>
            <div className="modal-buttons">
              <button 
                className="modal-button new-game" 
                onClick={() => {
                  setGameEnded(false);
                  setScores({ X: 0, O: 0 });
                  handleRestart();
                }}
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Board({ squares, xIsNext, onPlay, onWin, gameEnded }) {
  const BOARD_SIZE = 3;

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares) || gameEnded) return;
    
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
    
    const winner = calculateWinner(nextSquares);
    if (winner) {
      onWin(winner);
    } else if (!nextSquares.includes(null)) {
      // It's a draw
      onWin('draw');
    }
  }

  function renderSquare(i) {
    return (
      <Square 
        key={i}
        value={squares[i]} 
        onSquareClick={() => handleClick(i)}
        className={squares[i] === 'X' ? 'x-mark' : squares[i] === 'O' ? 'o-mark' : ''}
      />
    );
  }

  function renderBoard() {
    const rows = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const cells = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        cells.push(renderSquare(i * BOARD_SIZE + j));
      }
      rows.push(
        <div key={i} className="board-row">
          {cells}
        </div>
      );
    }
    return rows;
  }

  const winner = calculateWinner(squares);
  const status = winner 
    ? `Winner: ${winner}`
    : squares.every(square => square) 
    ? "It's a draw!" 
    : `Next player: ${xIsNext ? "X" : "O"}`;

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board">{renderBoard()}</div>
    </div>
  );
}

function Square({ value, onSquareClick, className }) {
  return (
    <button className={`square ${className}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const BOARD_SIZE = 3;
  const WIN_LENGTH = 3;

  // Check horizontal, vertical and diagonal lines
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!squares[row * BOARD_SIZE + col]) continue;

      // Check horizontal
      if (col <= BOARD_SIZE - WIN_LENGTH) {
        let win = true;
        for (let i = 1; i < WIN_LENGTH; i++) {
          if (squares[row * BOARD_SIZE + col] !== squares[row * BOARD_SIZE + col + i]) {
            win = false;
            break;
          }
        }
        if (win) return squares[row * BOARD_SIZE + col];
      }

      // Check vertical
      if (row <= BOARD_SIZE - WIN_LENGTH) {
        let win = true;
        for (let i = 1; i < WIN_LENGTH; i++) {
          if (squares[row * BOARD_SIZE + col] !== squares[(row + i) * BOARD_SIZE + col]) {
            win = false;
            break;
          }
        }
        if (win) return squares[row * BOARD_SIZE + col];
      }

      // Check diagonal down-right
      if (row <= BOARD_SIZE - WIN_LENGTH && col <= BOARD_SIZE - WIN_LENGTH) {
        let win = true;
        for (let i = 1; i < WIN_LENGTH; i++) {
          if (squares[row * BOARD_SIZE + col] !== squares[(row + i) * BOARD_SIZE + col + i]) {
            win = false;
            break;
          }
        }
        if (win) return squares[row * BOARD_SIZE + col];
      }

      // Check diagonal down-left
      if (row <= BOARD_SIZE - WIN_LENGTH && col >= WIN_LENGTH - 1) {
        let win = true;
        for (let i = 1; i < WIN_LENGTH; i++) {
          if (squares[row * BOARD_SIZE + col] !== squares[(row + i) * BOARD_SIZE + col - i]) {
            win = false;
            break;
          }
        }
        if (win) return squares[row * BOARD_SIZE + col];
      }
    }
  }
  return null;
}

export default App;
