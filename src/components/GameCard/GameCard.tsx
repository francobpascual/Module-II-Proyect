
import { Link } from "react-router";
import type { Game } from "../../interfaces/Game";
import "./GameCard.css";

interface GameCardProps {
  game: Game;
}

function GameCard({ game }: GameCardProps) {
  return (
    <article className="game-card">
      <div className="game-card__artwork">
        <img src={game.image} alt="" loading="lazy" />
        <span className="game-card__category">{game.category}</span>
      </div>

      <div className="game-card__content">
        <h3 className="game-card__title">{game.title}</h3>
        <div className="game-card__footer">
          <p className="game-card__price">
            ${game.price.toLocaleString("es-AR")}
          </p>
          <Link
            to={`/detail/${game.id}`}
            className="game-card__link"
          >
            Ver detalles
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default GameCard;
