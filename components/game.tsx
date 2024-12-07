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

  const cardSuits = [
    { symbol: '♥️', color: 'text-red-500' },
    { symbol: '♣️', color: 'text-black' },
    { symbol: '♦️', color: 'text-red-500' },
    { symbol: '♠️', color: 'text-black' },
  ] as const;

  globalStyles()

  return (
    <div className="min-h-screen bg-[#1b4d1b] bg-gradient-to-b from-[#1b4d1b] to-[#0f290f]">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-glow animate-fade-in">
            Contador de Lova
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