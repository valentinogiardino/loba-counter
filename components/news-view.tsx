"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Wrench, Megaphone } from "lucide-react";
import { UPDATES, formatDate } from "@/lib/updates";

const typeConfig = {
  feature: {
    icon: Sparkles,
    label: "Nueva función",
    bgClass: "bg-purple-500/20 border-purple-500/30",
    iconClass: "text-purple-400",
    labelClass: "bg-purple-500/30 text-purple-300",
  },
  fix: {
    icon: Wrench,
    label: "Corrección",
    bgClass: "bg-blue-500/20 border-blue-500/30",
    iconClass: "text-blue-400",
    labelClass: "bg-blue-500/30 text-blue-300",
  },
  announcement: {
    icon: Megaphone,
    label: "Anuncio",
    bgClass: "bg-amber-500/20 border-amber-500/30",
    iconClass: "text-amber-400",
    labelClass: "bg-amber-500/30 text-amber-300",
  },
  preview: {
    icon: Sparkles,
    label: "Preview",
    bgClass: "bg-pink-500/20 border-pink-500/30",
    iconClass: "text-pink-400",
    labelClass: "bg-pink-500/30 text-pink-300",
  },
};

export default function NewsView() {
  return (
    <div className="min-h-screen bg-[#1b4d1b] bg-gradient-to-b from-[#1b4d1b] to-[#0f290f]">
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
            Novedades
          </h1>
        </div>

        {/* Intro */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 text-center">
            <p className="text-white/80 text-lg">
              ¡Bienvenido a las novedades del Contador de Loba! 🃏
            </p>
            <p className="text-white/60 text-sm mt-2">
              Acá vas a encontrar todas las actualizaciones y mejoras de la app.
            </p>
          </CardContent>
        </Card>

        {/* Updates Timeline */}
        <div className="space-y-4">
          {UPDATES.map((update) => {
            const config = typeConfig[update.type];
            const Icon = config.icon;

            return (
              <Card
                key={update.id}
                className={`${config.bgClass} animate-fade-in`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-2 rounded-full bg-white/10 ${config.iconClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${config.labelClass}`}
                        >
                          {config.label}
                        </span>
                        <span className="text-xs text-white/50">
                          {formatDate(update.date)}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        {update.title}
                      </h3>
                      <p className="text-white/80">{update.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm">
            ¿Tenés sugerencias? Contanos en la próxima partida 😄
          </p>
        </div>
      </div>
    </div>
  );
}

