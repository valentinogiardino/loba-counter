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
      {players.length >= 1 && (
        <div className="space-y-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {players.map((player, index) => (
                <Card
                  key={index}
                  className={`backdrop-blur-sm ${
                    player.score >= 101
                      ? "bg-red-500/10 border-red-500"
                      : "bg-white/10 border-white/20"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => deletePlayer(index)}
                        className="bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                      <div className="w-16 text-center">
                        <span className="text-lg font-semibold text-white">
                          {player.roundTotal || 0}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <span className="text-lg font-semibold text-white">
                          {player.name}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => adjustPoints(index, -1)}
                        className="bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
                      >
                        <Minus className="h-4 w-4 text-white" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          name={`points-${index}`}
                          value={points[index] || ""}
                          onChange={(e) =>
                            handlePointChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          placeholder="0"
                          className="w-12 bg-white/90 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => adjustPoints(index, 1)}
                        className="bg-green-500/20 hover:bg-green-500/30 border-green-500/50"
                      >
                        <Plus className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
      )}
      {players.length <= 1 && (
        <div className="text-white text-center p-8">
          Agrega jugadores para empezar la partida
        </div>
      )}
    </>
  );
}
