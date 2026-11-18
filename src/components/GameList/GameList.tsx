import type { Game } from "../../interfaces/Game";
import GameCard from "../GameCard/GameCard";

interface GameListProps {
  games: Game[];
}

function GameList({ games }: GameListProps) {
  if (games.length === 0) {
    return (
      <p className="py-10 text-center text-zinc-400">
        No hay videojuegos disponibles.
      </p>
    );
  }
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </section>
  );
}

export default GameList;
