import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Player {
  name: string;
  score: number;
  roundTotal: number;
}

interface ScoreBoardProps {
  players: Player[];
  submitScore: (index: number, points: number) => void;
  deletePlayer: (index: number) => void;
  resetGame: () => void;
}

export function ScoreBoard({
  players,
  submitScore,
  deletePlayer,
  resetGame,
}: ScoreBoardProps) {
  const [points, setPoints] = useState<string[]>(() =>
    Array(players.length).fill("")
  );

  useEffect(() => {
    const newPoints = Array(players.length).fill("");
    setPoints(newPoints);
  }, [players.length]);

  const handlePointChange = (index: number, value: string) => {
    const newPoints = [...points];
    newPoints[index] = value === "" ? "" : value;
    setPoints(newPoints);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    players.forEach((_, index) => {
      submitScore(index, parseInt(points[index]) || 0);
    });
    setPoints(new Array(players.length).fill(""));

    // Only focus on desktop
    if (window.matchMedia("(min-width: 768px)").matches) {
      const nextInput = document.querySelector(
        `input[name="points-0"]`
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const adjustPoints = (index: number, adjustment: number) => {
    const currentPoints = parseInt(points[index]) || 0;
    handlePointChange(index, (currentPoints + adjustment).toString());
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentIndex: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Only focus on desktop
      if (window.matchMedia("(min-width: 768px)").matches) {
        const nextInput = document.querySelector(
          `input[name="points-${currentIndex + 1}"]`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        } else {
          // If it's the last input, move focus to the submit button
          const submitButton = document.querySelector(
            'button[id="submit-round"]'
          ) as HTMLButtonElement;
          if (submitButton) {
            submitButton.focus();
          }
        }
      }
    }
  };

  return (
    <>
      <div className="space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-4">
            {players.map((player, index) => (
              <Card
                key={index}
                className={`backdrop-blur-sm ${
                  player.score >= 101
                    ? "bg-red-500/10 border-red-500"
                    : "bg-white/10 border-white/20"
                }`}
              >
                <CardContent className="p-2 sm:p-4">
                  <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => deletePlayer(index)}
                      className="h-8 w-8 sm:h-10 sm:w-10 bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </Button>
                    <div className="w-12 sm:w-16 text-center">
                      <span className="text-base sm:text-lg font-semibold text-white">
                        {player.roundTotal || 0}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <span className="text-base sm:text-lg font-semibold text-white block truncate">
                        {player.name}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => adjustPoints(index, -1)}
                      className="h-8 w-8 sm:h-10 sm:w-10 bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </Button>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Input
                        type="number"
                        name={`points-${index}`}
                        value={points[index] || ""}
                        onChange={(e) =>
                          handlePointChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        placeholder="0"
                        className="w-12 h-8 sm:h-10 text-sm sm:text-base text-center bg-white/90 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => adjustPoints(index, 1)}
                      className="h-8 w-8 sm:h-10 sm:w-10 bg-green-500/20 hover:bg-green-500/30 border-green-500/50"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {players.length <= 1 && (
            <div className="text-center p-8 mt-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-white/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white/70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {players.length === 0
                      ? "¡Comienza una nueva partida!"
                      : "¡Necesitas más jugadores!"}
                  </h3>
                  <p className="text-white/70">
                    {players.length === 0
                      ? "Agrega jugadores para comenzar una nueva partida"
                      : "Agrega al menos un jugador más para comenzar la partida"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            id="submit-round"
            type="submit"
            disabled={players.length <= 1}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Guardar Ronda
          </Button>

          <div className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  disabled={players.length <= 1}
                  className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white"
                >
                  Reiniciar Partida
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-zinc-900 border-zinc-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    ¿Estás seguro?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-400">
                    Esta acción no se puede deshacer. Se borrarán todos los
                    puntajes y jugadores de la partida actual.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetGame}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Reiniciar Partida
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </div>
    </>
  );
}
