"use client";

import { useState, useEffect } from "react";
import { PlayerForm } from "./player-form";
import { ScoreBoard } from "./score-board";
import { GameOver } from "./game-over";
import { SettingsModal } from "./settings-modal";
import { globalStyles } from "./global-styles";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

interface Player {
  name: string;
  score: number;
  roundTotal: number;
  rejoinCount: number;
  isEliminated: boolean;
}

interface GameSettings {
  allowRejoin: boolean;
  restartWithSamePlayers: boolean;
}

const STORAGE_KEY = "loba-counter-state";
const SETTINGS_KEY = "loba-counter-settings";

const DEFAULT_SETTINGS: GameSettings = {
  allowRejoin: true,
  restartWithSamePlayers: true,
};

export default function Game() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [lastPlayers, setLastPlayers] = useState<Player[]>([]);

  const { width, height } = useWindowSize();

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.players) setPlayers(parsed.players);
        if (parsed.gameOver !== undefined) setGameOver(parsed.gameOver);
        if (parsed.winner) setWinner(parsed.winner);
        if (parsed.lastPlayers) setLastPlayers(parsed.lastPlayers);
      }
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToSave = {
        players,
        gameOver,
        winner,
        lastPlayers,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving state to localStorage:", error);
    }
  }, [players, gameOver, winner, lastPlayers, isHydrated]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings to localStorage:", error);
    }
  }, [settings, isHydrated]);

  const addPlayer = (name: string) => {
    setPlayers([...players, { name, score: 0, roundTotal: 0, rejoinCount: 0, isEliminated: false }]);
  };

  const submitScore = (index: number, points: number) => {
    const newPlayers = [...players];
    newPlayers[index].score += points;
    newPlayers[index].roundTotal += points;

    // Mark players as eliminated if they exceed 100
    newPlayers.forEach((player) => {
      player.isEliminated = player.score >= 101;
    });

    // Check if only one player remains with a score less than 101
    const remainingPlayers = newPlayers.filter((player) => !player.isEliminated);

    if (remainingPlayers.length === 1) {
      setGameOver(true);
      setWinner(remainingPlayers[0]);
    } else if (remainingPlayers.length === 0) {
      // If no players are below 101, the winner is the player with the lowest score
      const winner = newPlayers.reduce((prev, current) =>
        prev.score < current.score ? prev : current
      );
      setGameOver(true);
      setWinner(winner);
    } else {
      // If there are still multiple players below 101, ensure game is not over
      setGameOver(false);
      setWinner(null);
    }

    setPlayers(newPlayers);
  };

  const resetGame = (keepPlayers: boolean = false) => {
    // Store current players before resetting for "restart with same players" feature
    if (players.length > 0) {
      setLastPlayers(players);
    }

    if (keepPlayers) {
      // Reset scores but keep player names
      const resetPlayers = players.map((player) => ({
        ...player,
        score: 0,
        roundTotal: 0,
        rejoinCount: 0,
        isEliminated: false,
      }));
      setPlayers(resetPlayers);
    } else {
      setPlayers([]);
    }
    setGameOver(false);
    setWinner(null);
  };

  const restartWithSamePlayers = () => {
    if (lastPlayers.length > 0) {
      const resetPlayers = lastPlayers.map((player) => ({
        name: player.name,
        score: 0,
        roundTotal: 0,
        rejoinCount: 0,
        isEliminated: false,
      }));
      setPlayers(resetPlayers);
      setGameOver(false);
      setWinner(null);
    }
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const returnToGame = () => {
    setGameOver(false);
  };

  const deletePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  };

  const rejoinPlayer = (index: number) => {
    if (!settings.allowRejoin) return;

    const newPlayers = [...players];
    const playerToRejoin = newPlayers[index];

    // Find the highest score among active (non-eliminated) players
    const activePlayers = newPlayers.filter((p) => !p.isEliminated);
    
    if (activePlayers.length === 0) {
      // If no active players, use the lowest score among all players
      const lowestScore = Math.min(...newPlayers.map((p) => p.score));
      playerToRejoin.score = lowestScore;
      playerToRejoin.roundTotal = lowestScore;
    } else {
      // Set score to the highest among active players
      const highestActiveScore = Math.max(...activePlayers.map((p) => p.score));
      playerToRejoin.score = highestActiveScore;
      playerToRejoin.roundTotal = highestActiveScore;
    }

    // Update player status
    playerToRejoin.rejoinCount += 1;
    playerToRejoin.isEliminated = false;

    // Re-check game state since we may have more active players now
    const remainingPlayers = newPlayers.filter((p) => !p.isEliminated);
    if (remainingPlayers.length > 1) {
      setGameOver(false);
      setWinner(null);
    }

    setPlayers(newPlayers);
  };

  const cardSuits = [
    { symbol: "♥️", color: "text-red-500" },
    { symbol: "♣️", color: "text-black" },
    { symbol: "♦️", color: "text-red-500" },
    { symbol: "♠️", color: "text-black" },
  ] as const;

  globalStyles();

  return (
    <div className="min-h-screen bg-[#1b4d1b] bg-gradient-to-b from-[#1b4d1b] to-[#0f290f]">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Settings Icon in Header */}
        <div className="flex justify-end mb-4">
          <SettingsModal
            settings={settings}
            updateSettings={updateSettings}
            hasLastPlayers={lastPlayers.length > 0}
            restartWithSamePlayers={restartWithSamePlayers}
          />
        </div>
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-glow animate-fade-in">
            Contador de Loba
          </h1>
          <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 animate-fade-in delay-200">
            {cardSuits.map((suit, index) => (
              <span
                key={index}
                className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl transform hover:scale-125 transition-transform duration-200 ${suit.color}`}
              >
                {suit.symbol}
              </span>
            ))}
          </div>
          <p className="text-green-300 text-sm sm:text-base md:text-lg lg:text-xl italic animate-fade-in delay-300 font-medium">
            La suerte está echada...
          </p>
        </div>
        {!gameOver ? (
          <div className="space-y-6">
            <PlayerForm addPlayer={addPlayer} />
            <ScoreBoard
              players={players}
              submitScore={submitScore}
              deletePlayer={deletePlayer}
              resetGame={resetGame}
              rejoinPlayer={rejoinPlayer}
              allowRejoin={settings.allowRejoin}
            />
          </div>
        ) : (
          <>
            <GameOver
              winner={winner}
              players={players}
              resetGame={resetGame}
              returnToGame={returnToGame}
              restartWithSamePlayersDefault={settings.restartWithSamePlayers}
            />
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={600}
            />
          </>
        )}
      </div>
    </div>
  );
}
