export interface UpdateMessage {
  id: string;
  date: string; // ISO format: YYYY-MM-DD
  title: string;
  content: string;
  type: "feature" | "fix" | "announcement" | "preview";
  showOnMainPage: boolean;
}

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00"); // Append time to avoid timezone issues
  return dateFormatter.format(date);
}

export const UPDATES: UpdateMessage[] = [
    {
      id: "reenganche-2026",
      date: "2025-12-31",
      title: "Reenganches",
      content:
        "A pedido de la gente (y especialmente de Luján 😅), ahora se pueden manejar y contar los reenganches. ¡Que no se corte el juego en este 2026!",
      type: "feature",
      showOnMainPage: true,
    },
    {
      id: "analytics-2026",
      date: "2025-12-31",
      title: "Estadísticas",
      content:
        "Estamos probando una nueva sección de estadísticas con historial de partidas y ranking de jugadores. Es una vista previa: todavía está en desarrollo, pero ya podés ir chusmeando quién viene ganando 😎",
      type: "preview",
      showOnMainPage: true,
    },
    {
        id: "sidebar-2026",
        date: "2025-12-31",
        title: "Nuevo menú lateral",
        content:
          "Sumamos un menú lateral para moverte más rápido por la app, entrar a la configuración y ver estas novedades. Todo más ordenado y a mano 😉",
        type: "feature",
        showOnMainPage: false,
      },
      {
        id: "persistence-2026",
        date: "2025-12-31",
        title: "Guardado automático",
        content:
          "Mejoramos el guardado de la partida: ahora los puntajes no se pierden aunque cierres o reiniciesel navegador. Además, podés arrancar una nueva partida con los mismos jugadores.",
        type: "fix",
        showOnMainPage: false,
      },
  ];

const DISMISSED_KEY = "loba-dismissed-updates";

export function getDismissedUpdates(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    return dismissed ? JSON.parse(dismissed) : [];
  } catch {
    return [];
  }
}

export function dismissUpdate(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const dismissed = getDismissedUpdates();
    if (!dismissed.includes(id)) {
      dismissed.push(id);
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
    }
  } catch (error) {
    console.error("Error dismissing update:", error);
  }
}

export function getUndismissedUpdates(): UpdateMessage[] {
  const dismissed = getDismissedUpdates();
  return UPDATES.filter((update) => !dismissed.includes(update.id));
}

export function getLatestUndismissedUpdate(): UpdateMessage | null {
  const dismissed = getDismissedUpdates();
  const mainPageUpdates = UPDATES.filter(
    (update) => update.showOnMainPage && !dismissed.includes(update.id)
  );
  return mainPageUpdates.length > 0 ? mainPageUpdates[0] : null;
}
