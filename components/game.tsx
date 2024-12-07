'use client'

import { useState } from 'react'
import { PlayerForm } from './player-form'
import { ScoreBoard } from './score-board'
import { GameOver } from './game-over'
import { globalStyles } from './global-styles'

interface Player {
  name: string
  score: number
  roundTotal: number
}

export default function Game() {
  const [players, setPlayers] = useState<Player[]>([])
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<Player | null>(null)

  const addPlayer = (name: string) => {
    setPlayers([...players, { name, score: 0, roundTotal: 0 }])
  }

  const submitScore = (index: number, points: number) => {
    const newPlayers = [...players];
    newPlayers[index].score += points;
    newPlayers[index].roundTotal += points;

    // Check if only one player remains with a score less than 101
    const remainingPlayers = newPlayers.filter(player => player.score < 101);

    if (remainingPlayers.length === 1) {
      setGameOver(true);
      setWinner(remainingPlayers[0]);
    } else if (remainingPlayers.length === 0) {
      // If no players are below 101, the winner is the player with the lowest score
      const winner = newPlayers.reduce((prev, current) => 
        (prev.score < current.score) ? prev : current
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

  const resetGame = () => {
    setPlayers([])
    setGameOver(false)
    setWinner(null)
  }

  const returnToGame = () => {
    setGameOver(false);
  }

  const deletePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index);
    setPlayers(newPlayers);
  }

  globalStyles()

  return (
    <div className="min-h-screen bg-[#1b4d1b]">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-white text-center">Contador de Lova</h1>
        {!gameOver ? (
          <div className="space-y-6">
            <PlayerForm addPlayer={addPlayer} />
            <ScoreBoard 
              players={players} 
              submitScore={submitScore} 
              deletePlayer={deletePlayer} 
              resetGame={resetGame} 
            />
          </div>
        ) : (
          <GameOver 
            winner={winner} 
            players={players} 
            resetGame={resetGame} 
            returnToGame={returnToGame} 
          />
        )}
      </div>
    </div>
  )
}

