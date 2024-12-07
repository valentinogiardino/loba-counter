import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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
  // Sort players by score in ascending order
  const sortedPlayers = [...players].sort((a, b) => a.score - b.score);

  return (
    <Card className="max-w-md mx-auto bg-white/10 backdrop-blur-sm border-green-500">
      <CardContent className="p-6 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">GANASTE!</h2>
        {winner && (
          <p className="text-xl mb-6 text-green-400">
            {winner.name} ganó la partida con {winner.score} puntos!
          </p>
        )}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Puntuaciones finales:</h3>
          <ul className="space-y-2">
            {sortedPlayers.map((player, index) => (
              <li 
                key={index} 
                className={`text-lg ${player === winner ? 'text-green-400 font-bold' : 'text-white'}`}
              >
                {player.name}: {player.score} puntos
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <Button 
            onClick={resetGame}
            className="bg-green-600 hover:bg-green-700 text-white w-full"
          >
            Nueva Partida
          </Button>
          <Button 
            onClick={returnToGame}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full"
          >
            Volver a la Partida
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

