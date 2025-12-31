"use client";

import { useState, useEffect } from "react";
import { PlayerForm } from "./player-form";
import { ScoreBoard } from "./score-board";
import { GameOver } from "./game-over";
import { globalStyles } from "./global-styles";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { X, Megaphone, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getUndismissedUpdates,
  dismissUpdate,
  type UpdateMessage,
} from "@/lib/updates";

interface Player {
  id: string;
  name: string;
  score: number;
  roundTotal: number;
  rejoinCount: number;
  isEliminated: boolean;
  rejoinedThisRound: boolean;
}

interface RoundScore {
  playerId: string;
  roundScore: number;
  totalAfterRound: number;
  eliminatedThisRound: boolean;
  rejoinedThisRound: boolean;
}

interface Round {
  roundNumber: number;
  scores: RoundScore[];
  timestamp: number;
}

interface Match {
  id: string;
  players: Player[];
  rounds: Round[];
  winnerPlayerId: string | null;
  startedAt: number;
  finishedAt: number | null;
}

interface GameSettings {
  allowRejoin: boolean;
  restartWithSamePlayers: boolean;
}

const STORAGE_KEY = "loba-counter-state";
const SETTINGS_KEY = "loba-counter-settings";
const HISTORY_KEY = "loba-counter-history";

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
  
  // Analytics state
  const [matchId, setMatchId] = useState<string | null>(null);
  const [matchStartedAt, setMatchStartedAt] = useState<number | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [matchHistory, setMatchHistory] = useState<Match[]>([]);

  // Update notification state
  const [updates, setUpdates] = useState<UpdateMessage[]>([]);

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
        if (parsed.matchId) setMatchId(parsed.matchId);
        if (parsed.matchStartedAt) setMatchStartedAt(parsed.matchStartedAt);
        if (parsed.rounds) setRounds(parsed.rounds);
      }
      const savedSettings = localStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      }
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) setMatchHistory(parsedHistory);
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Load update notifications after hydration
  useEffect(() => {
    if (isHydrated) {
      setUpdates(getUndismissedUpdates(true)); // Only show updates marked for main page
    }
  }, [isHydrated]);

  // Listen for settings changes from sidebar
  useEffect(() => {
    const handleSettingsChange = (e: CustomEvent<GameSettings>) => {
      setSettings(e.detail);
    };
    window.addEventListener("settings-changed", handleSettingsChange as EventListener);
    return () => {
      window.removeEventListener("settings-changed", handleSettingsChange as EventListener);
    };
  }, []);

  const handleDismissUpdate = (updateId: string) => {
    dismissUpdate(updateId);
    setUpdates(getUndismissedUpdates(true));
  };

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const stateToSave = {
        players,
        gameOver,
        winner,
        lastPlayers,
        matchId,
        matchStartedAt,
        rounds,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving state to localStorage:", error);
    }
  }, [players, gameOver, winner, lastPlayers, matchId, matchStartedAt, rounds, isHydrated]);

  // Save match history to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(matchHistory));
    } catch (error) {
      console.error("Error saving match history to localStorage:", error);
    }
  }, [matchHistory, isHydrated]);

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
    // Initialize match metadata when first player is added
    if (players.length === 0) {
      setMatchId(crypto.randomUUID());
      setMatchStartedAt(Date.now());
      setRounds([]);
    }
    
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      score: 0,
      roundTotal: 0,
      rejoinCount: 0,
      isEliminated: false,
      rejoinedThisRound: false,
    };
    setPlayers([...players, newPlayer]);
  };

  const submitRound = (pointsArray: number[]) => {
    const newPlayers = [...players];
    const previousEliminationStatus = newPlayers.map(p => p.isEliminated);
    
    // Update all player scores
    newPlayers.forEach((player, index) => {
      const points = pointsArray[index] || 0;
      player.score += points;
      player.roundTotal += points;
    });

    // Mark players as eliminated if they exceed 100
    newPlayers.forEach((player) => {
      player.isEliminated = player.score >= 101;
    });

    // Record the round for analytics
    const roundScores: RoundScore[] = newPlayers.map((player, index) => ({
      playerId: player.id,
      roundScore: pointsArray[index] || 0,
      totalAfterRound: player.score,
      eliminatedThisRound: !previousEliminationStatus[index] && player.isEliminated,
      rejoinedThisRound: player.rejoinedThisRound,
    }));

    const newRound: Round = {
      roundNumber: rounds.length + 1,
      scores: roundScores,
      timestamp: Date.now(),
    };

    setRounds([...rounds, newRound]);

    // Reset rejoinedThisRound flags after recording
    newPlayers.forEach((player) => {
      player.rejoinedThisRound = false;
    });

    // Check if only one player remains with a score less than 101
    const remainingPlayers = newPlayers.filter((player) => !player.isEliminated);
    let gameEnded = false;
    let matchWinner: Player | null = null;

    if (remainingPlayers.length === 1) {
      gameEnded = true;
      matchWinner = remainingPlayers[0];
    } else if (remainingPlayers.length === 0) {
      // If no players are below 101, the winner is the player with the lowest score
      gameEnded = true;
      matchWinner = newPlayers.reduce((prev, current) =>
        prev.score < current.score ? prev : current
      );
    }

    if (gameEnded && matchWinner) {
      setGameOver(true);
      setWinner(matchWinner);
      
      // Save completed match to history
      if (matchId && matchStartedAt) {
        const completedMatch: Match = {
          id: matchId,
          players: newPlayers,
          rounds: [...rounds, newRound],
          winnerPlayerId: matchWinner.id,
          startedAt: matchStartedAt,
          finishedAt: Date.now(),
        };
        setMatchHistory([...matchHistory, completedMatch]);
      }
    } else {
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
      // Reset scores but keep player names, generate new IDs for new match
      const resetPlayers = players.map((player) => ({
        ...player,
        id: crypto.randomUUID(),
        score: 0,
        roundTotal: 0,
        rejoinCount: 0,
        isEliminated: false,
        rejoinedThisRound: false,
      }));
      setPlayers(resetPlayers);
      // Start new match
      setMatchId(crypto.randomUUID());
      setMatchStartedAt(Date.now());
    } else {
      setPlayers([]);
      setMatchId(null);
      setMatchStartedAt(null);
    }
    
    // Clear rounds for new match
    setRounds([]);
    setGameOver(false);
    setWinner(null);
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
    playerToRejoin.rejoinedThisRound = true;

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

        {/* Update Notifications Carousel */}
        {updates.length > 0 && (
          <Card className="mb-6 bg-indigo-950/60 border-indigo-500/40 backdrop-blur-sm animate-fade-in overflow-hidden">
            <Carousel opts={{ loop: true }} className="w-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
                      <Megaphone className="h-5 w-5 text-indigo-400" />
                      Novedades
                    </CardTitle>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-indigo-400 hover:text-indigo-200 text-xs"
                      asChild
                    >
                      <Link href="/announcements" className="flex items-center gap-0">
                          Ver todas <ArrowUpRight/>
                        </Link>
                    </Button>
                  </div>
                  {updates.length > 1 && (
                    <div className="flex items-center gap-1">
                      <CarouselPrevious className="static translate-y-0 h-7 w-7 bg-transparent border-indigo-500/40 text-indigo-300 hover:bg-indigo-800/50 hover:text-indigo-100" />
                      <CarouselNext className="static translate-y-0 h-7 w-7 bg-transparent border-indigo-500/40 text-indigo-300 hover:bg-indigo-800/50 hover:text-indigo-100" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-2">
                <CarouselContent className="-ml-0">
                  {updates.map((update) => (
                    <CarouselItem key={update.id} className="pl-0">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              update.type === "preview"
                                ? "border-pink-500/50 bg-pink-500/20 text-pink-300"
                                : update.type === "fix"
                                ? "border-blue-500/50 bg-blue-500/20 text-blue-300"
                                : "border-purple-500/50 bg-purple-500/20 text-purple-300"
                            }
                          >
                            {update.type === "preview"
                              ? "Preview"
                              : update.type === "fix"
                              ? "Corrección"
                              : "Nueva función"}
                          </Badge>
                          <h3 className="text-white font-semibold text-base">
                            {update.title}
                          </h3>
                        </div>
                        <p className="text-indigo-200/90 text-sm leading-relaxed">
                          {update.content}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismissUpdate(update.id)}
                          className="h-auto px-2 py-1 text-indigo-400/60 hover:text-indigo-200 hover:bg-indigo-500/10 gap-1"
                        >
                          <X className="h-3 w-3" />
                          Descartar mensaje
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </CardContent>
            </Carousel>
          </Card>
        )}

        {!gameOver ? (
          <div className="space-y-6">
            <PlayerForm addPlayer={addPlayer} />
            <ScoreBoard
              players={players}
              submitRound={submitRound}
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
