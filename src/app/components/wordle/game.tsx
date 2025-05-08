"use client";

import { useState } from "react";
import { Delete } from "lucide-react";
import { submitGuess, archiveGame } from "@/app/pages/wordle/functions";
import { Button } from "../ui/button";

type CellState = "correct" | "present" | "absent" | "empty";
type GuessResult = { letter: string; state: string };

type GameData = {
  id: string;
  status: string;
  guesses: Array<{
    word: string;
    result: Array<GuessResult>;
  }>;
};

export default function WordleGame({ gameData }: { gameData: GameData }) {
  console.log("Game Data:", gameData);
  // Initialize board from gameData
  const [board, setBoard] = useState(() => {
    // Create empty board
    const emptyBoard = Array(6)
      .fill(null)
      .map(() => Array(5).fill(""));

    // Fill in the guesses from gameData
    gameData.guesses.forEach((guess, rowIndex) => {
      const letters = guess.word.split("");
      letters.forEach((letter, colIndex) => {
        emptyBoard[rowIndex][colIndex] = letter;
      });
    });

    return emptyBoard;
  });

  // Set current row based on number of guesses
  const [currentRow, setCurrentRow] = useState(gameData.guesses.length);
  const [currentCol, setCurrentCol] = useState(0);

  // Initialize cell states from gameData
  const [cellStates, setCellStates] = useState<CellState[][]>(() => {
    // Create empty cell states
    const emptyCellStates = Array(6)
      .fill(null)
      .map(() => Array(5).fill("empty" as CellState));

    // Fill in the cell states from gameData
    gameData.guesses.forEach((guess, rowIndex) => {
      guess.result.forEach((result, colIndex) => {
        emptyCellStates[rowIndex][colIndex] = result.state as CellState;
      });
    });

    return emptyCellStates;
  });

  // Initialize key states based on cell states
  const [keyStates, setKeyStates] = useState<Record<string, CellState>>(() => {
    const initialKeyStates: Record<string, CellState> = {};

    gameData.guesses.forEach((guess) => {
      guess.result.forEach((result, index) => {
        const letter = guess.word[index];
        const state = result.state as CellState;

        // Only update if the new state is "better" than the existing one
        if (
          !initialKeyStates[letter] ||
          (initialKeyStates[letter] === "absent" &&
            (state === "present" || state === "correct")) ||
          (initialKeyStates[letter] === "present" && state === "correct")
        ) {
          initialKeyStates[letter] = state;
        }
      });
    });

    return initialKeyStates;
  });

  // State for loading status during API calls
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State for error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submit guess to the server
  const submitGuessToServer = async (row: number) => {
    const guess = board[row].join("");
    if (guess.length !== 5) return;

    // Set loading state
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Call the server function to submit the guess
      const updatedGame = await submitGuess(gameData.id, guess);

      // Update the game state with the server response
      if (updatedGame) {
        // Get the latest guess result
        const latestGuess = updatedGame.guesses[updatedGame.guesses.length - 1];
        const guessResult = latestGuess.result as Array<{
          letter: string;
          state: string;
        }>;

        // Update cell states for the current row
        const newCellStates = [...cellStates];
        guessResult.forEach(
          (result: { letter: string; state: string }, index: number) => {
            newCellStates[row][index] = result.state as CellState;
          }
        );
        setCellStates(newCellStates);

        // Update key states
        const newKeyStates = { ...keyStates };
        guessResult.forEach(
          (result: { letter: string; state: string }, index: number) => {
            const letter = guess[index];
            const state = result.state as CellState;

            // Only update if the new state is "better" than the existing one
            if (
              !newKeyStates[letter] ||
              (newKeyStates[letter] === "absent" &&
                (state === "present" || state === "correct")) ||
              (newKeyStates[letter] === "present" && state === "correct")
            ) {
              newKeyStates[letter] = state;
            }
          }
        );
        setKeyStates(newKeyStates);

        // Move to the next row
        setCurrentRow(currentRow + 1);
        setCurrentCol(0);
      }
    } catch (error) {
      // Handle errors
      console.error("Error submitting guess:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (key: string) => {
    // Prevent input if game is over or submitting
    if (gameData.status !== "active" || isSubmitting || currentRow >= 6) return;

    // Clear any previous error message
    if (errorMessage) setErrorMessage(null);

    if (key === "ENTER") {
      if (currentCol === 5) {
        submitGuessToServer(currentRow);
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

  const getCellColor = (rowIndex: number, colIndex: number) => {
    const state = cellStates[rowIndex][colIndex];
    switch (state) {
      case "correct":
        return "bg-green-500 text-white";
      case "present":
        return "bg-yellow-500 text-black";
      case "absent":
        return "bg-gray-500 text-white";
      default:
        return "bg-white text-black";
    }
  };

  // Get the background color for a keyboard key
  const getKeyColor = (key: string) => {
    const state = keyStates[key];
    switch (state) {
      case "correct":
        return "bg-green-500 text-white";
      case "present":
        return "bg-yellow-500 text-black";
      case "absent":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-200 text-gray-500";
    }
  };

  // To ensure the new game is loaded, we must reload the page after starting a new game.
  // This is necessary because the game data is fetched on the server and passed as props.
  const handleGameReset = async () => {
    await archiveGame(gameData.id);
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {/* Add the game status message and reset button to the return statement
      Add this after the game board div and before the keyboard div: */}
      {gameData.status !== "active" && (
        <div className="mb-8 text-center">
          <div
            className={`text-2xl font-bold mb-2 ${
              gameData.status === "won" ? "text-green-600" : "text-red-600"
            }`}
          >
            {gameData.status === "won" ? "You won! 🎉" : "Game over!"}
          </div>
          {/* {gameData.status === "lost" && (
            <div className="text-lg mb-4">
              The word was <span className="font-bold">{targetWordReveal}</span>
            </div>
          )} */}
          <Button onClick={handleGameReset}>Play Again</Button>
        </div>
      )}

      <div className="mb-8">
        {/* Game board */}
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex mb-2">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-14 h-14 border border-gray-900 m-0.5 flex items-center justify-center text-2xl font-bold transition-colors ${getCellColor(
                  rowIndex,
                  colIndex
                )} ${getCellColor(rowIndex, colIndex)}`}
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
              className={`w-10 h-14 m-0.5 rounded-md flex items-center justify-center font-bold text-xl transition-colors ${getKeyColor(
                key
              )} ${getKeyColor(key)}`}
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
              className={`w-10 h-14 m-0.5 rounded-md flex items-center justify-center font-bold text-xl transition-colors ${getKeyColor(
                key
              )} ${getKeyColor(key)}`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => handleKeyPress("ENTER")}
            className="px-2 h-14 bg-blue-500 m-0.5 rounded-md flex items-center justify-center font-bold text-sm"
          >
            ENTER
          </button>
          {["Z", "X", "C", "V", "B", "N", "M"].map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className={`w-10 h-14 m-0.5 rounded-md flex items-center justify-center font-bold text-xl transition-colors ${getKeyColor(
                key
              )} ${getKeyColor(key)}`}
            >
              {key}
            </button>
          ))}
          <button
            onClick={() => handleKeyPress("BACKSPACE")}
            className="w-16 h-14 bg-blue-500 m-0.5 rounded-md flex items-center justify-center font-bold"
          >
            <Delete size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
