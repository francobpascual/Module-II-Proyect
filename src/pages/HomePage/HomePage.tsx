import { useState } from "react";
import { useGames } from "../../hooks/useGames";
import GameList from "../../components/GameList/GameList";
import SearchBar from "../../components/SearchBar/SearchBar";

function HomePage() {
  const { games } = useGames();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredGames = games.filter((game) =>
    game.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  );

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

        <div className="mb-8">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>

        <GameList games={filteredGames} />
      </div>
    </main>
  );
}

export default HomePage;
