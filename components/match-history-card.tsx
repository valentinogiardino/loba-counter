"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

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

interface MatchHistoryCardProps {
  match: Match;
}

export function MatchHistoryCard({ match }: MatchHistoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const winner = match.players.find((p) => p.id === match.winnerPlayerId);
  const sortedPlayers = [...match.players].sort((a, b) => a.score - b.score);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardContent className="p-0">
        {/* Match Summary Header */}
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 h-auto flex items-center justify-between hover:bg-white/5 rounded-none"
        >
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-start">
              <span className="text-xs text-white/50">
                {formatDate(match.startedAt)}
              </span>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-white font-medium">
                  {winner?.name || "Sin ganador"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-white/50">
                {match.players.length} jugadores · {match.rounds.length} rondas
              </div>
              <div className="flex gap-2 justify-end mt-1">
                {sortedPlayers.slice(0, 3).map((player) => (
                  <span
                    key={player.id}
                    className={`text-xs px-2 py-0.5 rounded ${
                      player.id === match.winnerPlayerId
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/10 text-white/70"
                    }`}
                  >
                    {player.name}: {player.score}
                  </span>
                ))}
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-white/50" />
            ) : (
              <ChevronDown className="h-5 w-5 text-white/50" />
            )}
          </div>
        </Button>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t border-white/10 p-4 space-y-4">
            {/* Final Scores */}
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2">
                Puntuaciones Finales
              </h4>
              <div className="flex flex-wrap gap-2">
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      player.id === match.winnerPlayerId
                        ? "bg-green-500/20 border border-green-500/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <span className="text-sm">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                    </span>
                    <span
                      className={`font-medium ${
                        player.id === match.winnerPlayerId
                          ? "text-green-400"
                          : "text-white"
                      }`}
                    >
                      {player.name}
                    </span>
                    <span className="text-white/70">{player.score} pts</span>
                    {player.rejoinCount > 0 && (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium bg-amber-500/80 text-white rounded-full">
                        {player.rejoinCount}x
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Round-by-Round Breakdown */}
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2">
                Detalle por Ronda
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-white/50 py-2 px-2">Ronda</th>
                      {match.players.map((player) => (
                        <th
                          key={player.id}
                          className={`text-center py-2 px-2 ${
                            player.id === match.winnerPlayerId
                              ? "text-green-400"
                              : "text-white/70"
                          }`}
                        >
                          {player.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {match.rounds.map((round) => (
                      <tr key={round.roundNumber} className="border-b border-white/10">
                        <td className="py-2 px-2 text-white/50">
                          R{round.roundNumber}
                        </td>
                        {match.players.map((player) => {
                          const scoreData = round.scores.find(
                            (s) => s.playerId === player.id
                          );
                          return (
                            <td
                              key={player.id}
                              className="text-center py-2 px-2"
                            >
                              <div className="flex flex-col items-center">
                                <span
                                  className={`${
                                    scoreData?.eliminatedThisRound
                                      ? "text-red-400"
                                      : scoreData?.rejoinedThisRound
                                      ? "text-amber-400"
                                      : "text-white"
                                  }`}
                                >
                                  {scoreData?.roundScore !== undefined
                                    ? `+${scoreData.roundScore}`
                                    : "-"}
                                </span>
                                <span className="text-xs text-white/50">
                                  ({scoreData?.totalAfterRound || 0})
                                </span>
                                {scoreData?.eliminatedThisRound && (
                                  <span className="text-xs text-red-400">💀</span>
                                )}
                                {scoreData?.rejoinedThisRound && (
                                  <RotateCcw className="h-3 w-3 text-amber-400" />
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Match Duration */}
            {match.finishedAt && (
              <div className="text-xs text-white/50 text-center pt-2 border-t border-white/10">
                Duración: {Math.round((match.finishedAt - match.startedAt) / 60000)} minutos
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

