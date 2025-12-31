"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GameSettings {
  allowRejoin: boolean;
  restartWithSamePlayers: boolean;
}

interface SettingsModalProps {
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  hasLastPlayers: boolean;
  restartWithSamePlayers: () => void;
}

export function SettingsModal({
  settings,
  updateSettings,
}: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
          aria-label="Configuración"
        >
          <Settings className="h-5 w-5 text-white" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-xl flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Ajustá las opciones del juego según tus preferencias.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          {/* Allow Rejoin Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label
                htmlFor="allow-rejoin"
                className="text-white font-medium cursor-pointer"
              >
                Permitir reenganche
              </label>
              <p className="text-sm text-zinc-400">
                Los jugadores eliminados pueden volver al juego
              </p>
            </div>
            <Switch
              id="allow-rejoin"
              checked={settings.allowRejoin}
              onCheckedChange={(checked) =>
                updateSettings({ allowRejoin: checked })
              }
            />
          </div>

          {/* Default Restart with Same Players Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label
                htmlFor="restart-same-players"
                className="text-white font-medium cursor-pointer"
              >
                Reiniciar con mismos jugadores
              </label>
              <p className="text-sm text-zinc-400">
                Por defecto al reiniciar una partida
              </p>
            </div>
            <Switch
              id="restart-same-players"
              checked={settings.restartWithSamePlayers}
              onCheckedChange={(checked) =>
                updateSettings({ restartWithSamePlayers: checked })
              }
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700">
            Cerrar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

