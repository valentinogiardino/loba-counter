"use client";

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, ArrowLeft, RotateCcw, Users } from 'lucide-react'

interface Player {
  id: string
  name: string
  score: number
  roundTotal: number
  rejoinCount: number
  isEliminated: boolean
  rejoinedThisRound: boolean
}

interface GameOverProps {
  winner: Player | null
  players: Player[]
  resetGame: (keepPlayers?: boolean) => void
  returnToGame: () => void
  restartWithSamePlayersDefault: boolean
}

export function GameOver({ winner, players, resetGame, returnToGame, restartWithSamePlayersDefault }: GameOverProps) {
  const [keepSamePlayers, setKeepSamePlayers] = useState(restartWithSamePlayersDefault);
  const sortedPlayers = [...players].sort((a, b) => a.score - b.score);

  // Update checkbox when settings change
  useEffect(() => {
    setKeepSamePlayers(restartWithSamePlayersDefault);
  }, [restartWithSamePlayersDefault]);

  const handleReset = () => {
    resetGame(keepSamePlayers);
  };

  return (
    <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border-green-500 animate-fade-in">
      <CardContent className="p-4 sm:p-6 text-center">
        <div className="flex justify-center mb-4">
          <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-400 animate-bounce" />
        </div>
        {winner && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-glow break-words">
            ¡GANÓ {winner.name.toLocaleUpperCase()}! 🎉
          </h2>
        )}
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">
            Puntuaciones finales:
          </h3>
          <ul className="space-y-2 sm:space-y-3">
            {sortedPlayers.map((player) => (
              <li 
                key={player.id} 
                className={`p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                  player.id === winner?.id 
                    ? 'bg-green-500/20 text-green-400 font-bold scale-105' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-base sm:text-lg break-words">
                    {player.name}: {player.score} puntos
                  </span>
                  {player.rejoinCount > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium bg-amber-500/80 text-white rounded-full">
                      {player.rejoinCount}x
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {/* Checkbox for keeping same players */}
          <label className="flex items-center justify-center gap-3 cursor-pointer p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <input
              type="checkbox"
              checked={keepSamePlayers}
              onChange={(e) => setKeepSamePlayers(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-white/30 bg-transparent checked:bg-green-500 checked:border-green-500 cursor-pointer accent-green-500"
            />
            <span className="text-white flex items-center gap-2 text-sm sm:text-base">
              <Users className="h-4 w-4" />
              Reiniciar con mismos jugadores
            </span>
          </label>

          <Button 
            onClick={handleReset}
            className="bg-green-600 hover:bg-green-700 text-white w-full flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base py-2 h-auto"
          >
            <RotateCcw className="h-4 w-4" />
            Nueva Partida
          </Button>
          <Button 
            onClick={returnToGame}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base py-2 h-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la Partida
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

