"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { MatchHistoryCard } from "./match-history-card";
import Link from "next/link";
import {
  Trophy,
  Target,
  RotateCcw,
  Users,
  TrendingUp,
  Calendar,
  FlaskConical,
} from "lucide-react";

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

interface PlayerStats {
  name: string;
  matchesPlayed: number;
  wins: number;
  winRate: number;
  avgFinalScore: number;
  totalRejoins: number;
  bestScore: number;
}

const HISTORY_KEY = "loba-counter-history";

export default function AnalyticsView() {
  const [matchHistory, setMatchHistory] = useState<Match[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          setMatchHistory(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading match history:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Calculate global stats
  const totalMatches = matchHistory.length;
  const totalRounds = matchHistory.reduce((sum, match) => sum + match.rounds.length, 0);
  const avgRoundsPerMatch = totalMatches > 0 ? (totalRounds / totalMatches).toFixed(1) : "0";

  // Get all unique player names and calculate their stats
  const playerStatsMap = new Map<string, PlayerStats>();

  matchHistory.forEach((match) => {
    match.players.forEach((player) => {
      const existing = playerStatsMap.get(player.name) || {
        name: player.name,
        matchesPlayed: 0,
        wins: 0,
        winRate: 0,
        avgFinalScore: 0,
        totalRejoins: 0,
        bestScore: Infinity,
      };

      existing.matchesPlayed += 1;
      existing.wins += player.id === match.winnerPlayerId ? 1 : 0;
      existing.avgFinalScore =
        (existing.avgFinalScore * (existing.matchesPlayed - 1) + player.score) /
        existing.matchesPlayed;
      existing.totalRejoins += player.rejoinCount;
      existing.bestScore = Math.min(existing.bestScore, player.score);

      playerStatsMap.set(player.name, existing);
    });
  });

  // Calculate win rates and convert to array
  const playerStats: PlayerStats[] = Array.from(playerStatsMap.values())
    .map((stats) => ({
      ...stats,
      winRate: stats.matchesPlayed > 0 ? (stats.wins / stats.matchesPlayed) * 100 : 0,
      bestScore: stats.bestScore === Infinity ? 0 : stats.bestScore,
    }))
    .sort((a, b) => b.wins - a.wins || a.avgFinalScore - b.avgFinalScore);

  const totalUniquePlayers = playerStats.length;

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#1b4d1b] bg-gradient-to-b from-[#1b4d1b] to-[#0f290f] flex items-center justify-center">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1b4d1b] bg-gradient-to-b from-[#1b4d1b] to-[#0f290f]">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
            Estadísticas
          </h1>
        </div>

        {/* Experimental Feature Alert */}
        <div className="flex justify-center mb-6">
            <Alert variant="warning">
                <FlaskConical className="h-4 w-4" />
                <AlertTitle>
                    Esta función está en desarrollo experimental. Algunas características pueden cambiar o mejorar con el tiempo.
                </AlertTitle>
            </Alert>
        </div>


        {totalMatches === 0 ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8 text-center">
              <Calendar className="h-16 w-16 text-white/50 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                No hay partidas registradas
              </h2>
              <p className="text-white/70 mb-4">
                Jugá tu primera partida completa para ver las estadísticas aquí.
              </p>
              <Link href="/">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Empezar a Jugar
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Global Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {totalMatches}
                  </div>
                  <div className="text-sm text-white/70">Partidas Jugadas</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {totalRounds}
                  </div>
                  <div className="text-sm text-white/70">Rondas Totales</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {avgRoundsPerMatch}
                  </div>
                  <div className="text-sm text-white/70">Promedio Rondas/Partida</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {totalUniquePlayers}
                  </div>
                  <div className="text-sm text-white/70">Jugadores Únicos</div>
                </CardContent>
              </Card>
            </div>

            {/* Player Leaderboard */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Tabla de Líderes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left text-white/70 py-2 px-2 text-sm">#</th>
                        <th className="text-left text-white/70 py-2 px-2 text-sm">Jugador</th>
                        <th className="text-center text-white/70 py-2 px-2 text-sm">Partidas</th>
                        <th className="text-center text-white/70 py-2 px-2 text-sm">Victorias</th>
                        <th className="text-center text-white/70 py-2 px-2 text-sm">% Victoria</th>
                        <th className="text-center text-white/70 py-2 px-2 text-sm">Prom. Pts</th>
                        <th className="text-center text-white/70 py-2 px-2 text-sm">Mejor</th>
                        <th className="text-center text-white/70 py-2 px-2 text-sm" title="Reenganches">
                          <RotateCcw className="h-4 w-4 inline" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerStats.map((player, index) => (
                        <tr
                          key={player.name}
                          className={`border-b border-white/10 ${
                            index === 0 ? "bg-yellow-500/10" : ""
                          }`}
                        >
                          <td className="py-3 px-2 text-white font-medium">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                          </td>
                          <td className="py-3 px-2 text-white font-medium">{player.name}</td>
                          <td className="py-3 px-2 text-center text-white/80">
                            {player.matchesPlayed}
                          </td>
                          <td className="py-3 px-2 text-center text-green-400 font-medium">
                            {player.wins}
                          </td>
                          <td className="py-3 px-2 text-center text-white/80">
                            {player.winRate.toFixed(0)}%
                          </td>
                          <td className="py-3 px-2 text-center text-white/80">
                            {player.avgFinalScore.toFixed(0)}
                          </td>
                          <td className="py-3 px-2 text-center text-blue-400">
                            {player.bestScore}
                          </td>
                          <td className="py-3 px-2 text-center">
                            {player.totalRejoins > 0 && (
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium bg-amber-500/80 text-white rounded-full">
                                {player.totalRejoins}x
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Match History */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Historial de Partidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {matchHistory
                  .slice()
                  .reverse()
                  .map((match) => (
                    <MatchHistoryCard key={match.id} match={match} />
                  ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

