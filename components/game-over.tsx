import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, ArrowLeft, RotateCcw } from 'lucide-react'

interface Player {
  name: string
  score: number
}

interface GameOverProps {
  winner: Player | null
  players: Player[]
  resetGame: () => void
  returnToGame: () => void
}

export function GameOver({ winner, players, resetGame, returnToGame }: GameOverProps) {
  const sortedPlayers = [...players].sort((a, b) => a.score - b.score);

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
            {sortedPlayers.map((player, index) => (
              <li 
                key={index} 
                className={`p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                  player === winner 
                    ? 'bg-green-500/20 text-green-400 font-bold scale-105' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span className="text-base sm:text-lg break-words">
                  {player.name}: {player.score} puntos
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <Button 
            onClick={resetGame}
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

