import { useGames } from "../../hooks/useGames";
import GameList from "../../components/GameList/GameList";

function HomePage() {
  const { games } = useGames();

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <h1 className="text-3xl font-bold md:text-5xl">
            Explora nuestros videojuegos
          </h1>

          <p className="mt-3 text-zinc-400">
            Descubrí los mejores videojuegos para tu próxima aventura.
          </p>
        </header>

        <GameList games={games} />
      </div>
    </main>
  );
}

export default HomePage;
