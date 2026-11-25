
import { CalendarDays, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useGames } from "../../hooks/useGames";
import GameCard from "../../components/GameCard/GameCard";

function getTodayLocal(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function UpcomingPage() {
  const { games } = useGames();
  const today = getTodayLocal();

  const upcomingGames = games
    .filter(
      (game) =>
        game.status === "upcoming" &&
        Boolean(game.releaseDate) &&
        game.releaseDate! > today
    )
    .sort((a, b) =>
      (a.releaseDate ?? "").localeCompare(b.releaseDate ?? "")
    );

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>

        <header className="mb-12 border-b border-red-900/40 pb-10">
          <div className="mb-5 flex items-center gap-3 text-red-500">
            <CalendarDays size={24} />
            <span className="text-xs font-bold tracking-[0.3em] uppercase">
              Descubrí lo que viene
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight uppercase md:text-6xl">
            Próximos{" "}
            <span className="text-red-600">lanzamientos</span>
          </h1>

          <p className="mt-5 max-w-2xl text-zinc-400">
            Explorá los videojuegos que están por llegar.
            Activá la campanita para agregar un recordatorio
            a tu Google Calendar y no perderte su estreno.
          </p>
        </header>

        {upcomingGames.length > 0 ? (
          <>
            <p className="mb-7 text-sm text-zinc-400">
              {upcomingGames.length}{" "}
              {upcomingGames.length === 1
                ? "próximo lanzamiento"
                : "próximos lanzamientos"}
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {upcomingGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 px-6 py-20 text-center">
            <CalendarDays
              size={44}
              className="mx-auto mb-5 text-red-500"
            />

            <h2 className="text-xl font-bold">
              Todavía no hay próximos lanzamientos
            </h2>

            <p className="mt-3 text-sm text-zinc-400">
              Los videojuegos con fechas de lanzamiento
              futuras aparecerán acá.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default UpcomingPage;
