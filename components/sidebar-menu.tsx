"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Menu, Megaphone, BarChart3, Home } from "lucide-react";

interface GameSettings {
  allowRejoin: boolean;
  restartWithSamePlayers: boolean;
}

const DEFAULT_SETTINGS: GameSettings = {
  allowRejoin: true,
  restartWithSamePlayers: true,
};

export function SidebarMenu() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("loba-counter-settings");
    if (savedSettings) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
    setIsHydrated(true);
  }, []);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("loba-counter-settings", JSON.stringify(updated));
    // Dispatch custom event so game component can react to changes
    window.dispatchEvent(new CustomEvent("settings-changed", { detail: updated }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
          aria-label="Menú"
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[280px] sm:w-[320px] bg-[#0f290f] border-r-white/20"
      >
        <SheetHeader className="text-left">
          <SheetTitle className="text-white text-xl flex items-center gap-2">
            🃏 Contador de Loba
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Navigation Section */}
          <div>
            <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
              Navegación
            </h3>
            <nav className="space-y-1">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
                >
                  <Home className="h-4 w-4 mr-3" />
                  Inicio
                </Button>
              </Link>
              <Link href="/announcements">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
                >
                  <Megaphone className="h-4 w-4 mr-3" />
                  Novedades
                </Button>
              </Link>
              <Link href="/analytics">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10 hover:text-white"
                >
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Estadísticas
                </Button>
              </Link>
            </nav>
          </div>

          {/* Settings Section */}
          {isHydrated && (
            <div>
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                Configuración
              </h3>
              <div className="space-y-4">
                {/* Allow Rejoin Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label
                      htmlFor="sidebar-allow-rejoin"
                      className="text-white text-sm font-medium cursor-pointer"
                    >
                      Permitir reenganche
                    </label>
                    <p className="text-xs text-white/50">
                      Jugadores eliminados pueden volver a la partida
                    </p>
                  </div>
                  <Switch
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-500"
                    id="sidebar-allow-rejoin"
                    checked={settings.allowRejoin}
                    onCheckedChange={(checked) =>
                      updateSettings({ allowRejoin: checked })
                    }
                  />
                </div>

                {/* Default Restart with Same Players Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label
                      htmlFor="sidebar-restart-same"
                      className="text-white text-sm font-medium cursor-pointer"
                    >
                      Mantener jugadores
                    </label>
                    <p className="text-xs text-white/50">
                      Al terminar, reiniciar automáticamente con los mismos jugadores
                    </p>
                  </div>
                  <Switch
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-500"
                    id="sidebar-restart-same"
                    checked={settings.restartWithSamePlayers}
                    onCheckedChange={(checked) =>
                      updateSettings({ restartWithSamePlayers: checked })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
