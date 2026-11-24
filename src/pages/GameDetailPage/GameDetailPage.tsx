
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Gamepad2 } from "lucide-react";
import type { Game } from "../../interfaces/Game";
import { gameService } from "../../services/gameService";

function GameDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [selectedGame, setSelectedGame] = useState<Game | undefined>(
    () => (id ? gameService.getById(id) : undefined)
  );

  useEffect(() => {
    function updateSelectedGame() {
      setSelectedGame(
        id ? gameService.getById(id) : undefined
      );
    }

    updateSelectedGame();

    const unsubscribe = gameService.subscribe(updateSelectedGame);

    return () => {
      unsubscribe();
    };
  }, [id]);

  if (!selectedGame) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-zinc-950 px-4 text-white">
        <Gamepad2 size={48} className="mb-4 text-red-500" />

        <h1 className="mb-4 text-3xl font-bold">
          Videojuego no encontrado
        </h1>

        <Link
          to="/"
          className="rounded-lg bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-700"
        >
          Volver al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Volver al catálogo
        </Link>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <img
              src={selectedGame.image}
              alt={selectedGame.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-red-500">
              {selectedGame.category}
            </span>

            <h1 className="mt-3 text-4xl font-bold">
              {selectedGame.title}
            </h1>

            <p className="mt-6 text-3xl font-bold text-red-500">
              ${selectedGame.price.toLocaleString("es-AR")}
            </p>

            <section className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">
                Descripción
              </h2>

              <p className="leading-relaxed text-zinc-400">
                {selectedGame.description}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">
                Requisitos del sistema
              </h2>

              <p className="leading-relaxed text-zinc-400">
                {selectedGame.requirements}
              </p>
            </section>

            <section className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">
                Desarrollador
              </h2>

              <p className="text-zinc-400">
                {selectedGame.developer}
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default GameDetailPage;
