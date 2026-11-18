import type { Game } from "../../interfaces/Game";
interface GameCardProps {
  game: Game;
}
function GameCard({ game }: GameCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <img
        src={game.image}
        alt={game.title}
        className="h-52 w-full object-cover"
      />

      <div className="p-5">
        <span className="text-sm text-red-500">
          {game.category}
        </span>

        <h3 className="mt-2 text-xl font-bold text-white">
          {game.title}
        </h3>

        <p className="mt-3 text-2xl font-semibold text-white">
          ${game.price.toLocaleString("es-AR")}
        </p>

        <button
          type="button"
          className="mt-5 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white"
        >
          Ver detalles
        </button>
      </div>
    </article>
  );
}

export default GameCard;
