"use client";

import { useState } from "react";
import { X } from "lucide-react";

type CellState = "correct" | "present" | "absent" | "empty";

export default function WordleGame({
  targetWord = "APPLE",
}: {
  targetWord?: string;
}) {
  const [board, setBoard] = useState(
    Array(6)
      .fill(null)
      .map(() => Array(5).fill(""))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  const [cellStates, setCellStates] = useState<CellState[][]>(
    Array(6)
      .fill("")
      .map(() => Array(5).fill("empty"))
  );
  const [keyStates, setKeyStates] = useState<Record<string, CellState>>({});
  const [gameOver, setGameOver] = useState(false);

  const checkGuess = (row: number) => {
    const guess = board[row].join("");
    if (guess.length !== 5) return;

    // Create a copy of the cell states
    const newCellStates = [...cellStates];
    const newKeyStates = { ...keyStates };

    // First pass: mark correct letters
    const targetLetters = targetWord.split("");
    const remainingTargetLetters = [...targetLetters];

    // First pass: find exact matches (correct position)
    for (let i = 0; i < 5; i++) {
      if (board[row][i] === targetLetters[i]) {
        newCellStates[row][i] = "correct";
        newKeyStates[board[row][i]] = "correct";
        // Remove this letter from remaining target letters
        const index = remainingTargetLetters.indexOf(board[row][i]);
        if (index > -1) {
          remainingTargetLetters.splice(index, 1);
        }
      }
    }

    // Second pass: find partial matches (present but wrong position)
    for (let i = 0; i < 5; i++) {
      if (newCellStates[row][i] !== "correct") {
        const letter = board[row][i];
        const index = remainingTargetLetters.indexOf(letter);

        if (index > -1) {
          // Letter is present but in wrong position
          newCellStates[row][i] = "present";
          // Only update key state if it's not already marked as correct
          if (newKeyStates[letter] !== "correct") {
            newKeyStates[letter] = "present";
          }
          // Remove this letter from remaining target letters
          remainingTargetLetters.splice(index, 1);
        } else {
          // Letter is not in the target word
          newCellStates[row][i] = "absent";
          // Only update key state if it's not already marked as correct or present
          if (!newKeyStates[letter]) {
            newKeyStates[letter] = "absent";
          }
        }
      }
    }

    setCellStates(newCellStates);
    setKeyStates(newKeyStates);

    // Check if the game is won
    if (guess === targetWord) {
      setGameOver(true);
      alert("Congratulations! You won!");
    } else if (row === 5) {
      setGameOver(true);
      alert(`Game over! The word was ${targetWord}`);
    }
  };

  const handleKeyPress = (key: string) => {
    if (currentRow >= 6) return;

    if (key === "ENTER") {
      if (currentCol === 5) {
        checkGuess(currentRow);
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      }
    } else if (key === "BACKSPACE") {
      if (currentCol > 0) {
        const newBoard = [...board];
        newBoard[currentRow][currentCol - 1] = "";
        setBoard(newBoard);
        setCurrentCol(currentCol - 1);
      }
    } else if (/^[A-Z]$/.test(key) && currentCol < 5) {
      const newBoard = [...board];
      newBoard[currentRow][currentCol] = key;
      setBoard(newBoard);
      setCurrentCol(currentCol + 1);
    }
  };

  const getCellBackground = (rowIndex: number, colIndex: number) => {
    const state = cellStates[rowIndex][colIndex];
    switch (state) {
      case "correct":
        return "bg-green-500";
      case "present":
        return "bg-yellow-500";
      case "absent":
        return "bg-gray-500";
      default:
        return "bg-white";
    }
  };

  // Get the background color for a keyboard key
  const getKeyBackground = (key: string) => {
    const state = keyStates[key];
    switch (state) {
      case "correct":
        return "bg-green-500";
      case "present":
        return "bg-yellow-500";
      case "absent":
        return "bg-gray-500";
      default:
        return "bg-gray-200";
    }
  };

  // Get the text color for a cell or key
  const getTextColor = (background: string) => {
    return background === "bg-white" ? "text-black" : "text-white";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="mb-8">
        {/* Game board */}
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex mb-2">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-14 h-14 border border-gray-300 m-0.5 flex items-center justify-center text-2xl font-bold transition-colors ${getCellBackground(
                  rowIndex,
                  colIndex
                )} ${getTextColor(getCellBackground(rowIndex, colIndex))}`}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-2">
          {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className={`w-10 h-14 m-0.5 rounded-md flex items-center justify-center font-bold text-xl transition-colors ${getKeyBackground(
                key
              )} ${getTextColor(getKeyBackground(key))}`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex justify-center mb-2">
          {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className={`w-10 h-14 m-0.5 rounded-md flex items-center justify-center font-bold text-xl transition-colors ${getKeyBackground(
                key
              )} ${getTextColor(getKeyBackground(key))}`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => handleKeyPress("ENTER")}
            className="px-2 h-14 bg-gray-200 m-0.5 rounded-md flex items-center justify-center font-bold text-sm"
          >
            ENTER
          </button>
          {["Z", "X", "C", "V", "B", "N", "M"].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className={`w-10 h-14 m-0.5 rounded-md flex items-center justify-center font-bold text-xl transition-colors ${getKeyBackground(
                key
              )} ${getTextColor(getKeyBackground(key))}`}
            >
              {key}
            </button>
          ))}
          <button
            onClick={() => handleKeyPress("BACKSPACE")}
            className="w-10 h-14 bg-gray-200 m-0.5 rounded-md flex items-center justify-center font-bold"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
