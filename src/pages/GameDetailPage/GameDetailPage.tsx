import { Link, useParams } from "react-router";
import { useGames } from "../../hooks/useGames";

function GameDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { games } = useGames();

  const selectedGame = games.find(
    (game) => game.id === id
  );

  if (!selectedGame) {
    return (
      <main className="min-h-screen bg-zinc-950 p-10 text-center text-white">
        <h1 className="text-3xl font-bold">
          Juego no encontrado, lo buscaremos en nuestro armario luego...
        </h1>

        <Link
          to="/"
          className="mt-6 inline-block text-red-500"
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
          className="mb-8 inline-block text-red-500 hover:text-red-400"
        >
          ← Volver al catálogo
        </Link>

        <div className="grid gap-10 md:grid-cols-2">
          <img
            src={selectedGame.image}
            alt={selectedGame.title}
            className="w-full rounded-xl object-cover"
          />

          <div>
            <span className="text-red-500">
              {selectedGame.category}
            </span>

            <h1 className="mt-3 text-4xl font-bold">
              {selectedGame.title}
            </h1>

            <p className="mt-5 text-3xl font-semibold">
              ${selectedGame.price.toLocaleString("es-AR")}
            </p>

            <h2 className="mt-8 text-xl font-bold">
              Descripción
            </h2>
            <p className="mt-3 text-zinc-400">
              {selectedGame.description}
            </p>

            <h2 className="mt-8 text-xl font-bold">
              Requisitos del sistema
            </h2>
            <p className="mt-3 text-zinc-400">
              {selectedGame.requirements}
            </p>

            <h2 className="mt-8 text-xl font-bold">
              Desarrollador
            </h2>
            <p className="mt-3 text-zinc-400">
              {selectedGame.developer}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default GameDetailPage;
