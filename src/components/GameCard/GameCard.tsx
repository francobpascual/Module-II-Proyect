import { Bell, Check, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router";
import type { Game } from "../../interfaces/Game";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import "./GameCard.css";

interface GameCardProps {
  game: Game;
}

function isValidFutureDate(value?: string): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return false;
  }

  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  return value > today;
}

function formatReleaseDate(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function createCalendarLink(
  title: string,
  releaseDate: string
): string {
  const [year, month, day] = releaseDate.split("-").map(Number);

  const startDate = releaseDate.replace(/-/g, "");

  const nextDay = new Date(
    Date.UTC(year, month - 1, day + 1)
  );

  const endDate = [
    nextDay.getUTCFullYear(),
    String(nextDay.getUTCMonth() + 1).padStart(2, "0"),
    String(nextDay.getUTCDate()).padStart(2, "0"),
  ].join("");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Lanzamiento de ${title}`,
    dates: `${startDate}/${endDate}`,
    details: `Recordatorio del lanzamiento de ${title}. Agregado desde Gamerlix.`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function GameCard({ game }: GameCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();

  const isUpcoming = game.status === "upcoming";
  const alreadyInCart = isInCart(game.id);

  const canSetReminder =
    isUpcoming && isValidFutureDate(game.releaseDate);

  const calendarUrl =
    canSetReminder && game.releaseDate
      ? createCalendarLink(game.title, game.releaseDate)
      : null;

  function handleAddToCart() {
    if (isUpcoming || alreadyInCart) return;

    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: `/detail/${game.id}`,
        },
      });
      return;
    }

    addToCart(game);
  }

  return (
    <article className="game-card">
      <div className="game-card__artwork">
        <img
          src={game.image}
          alt={game.title}
          loading="lazy"
        />

        {isUpcoming && (
          <span className="game-card__upcoming-badge">
            PRÓXIMAMENTE
          </span>
        )}

        {calendarUrl && (
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="game-card__reminder"
            aria-label={`Agregar recordatorio del lanzamiento de ${game.title} a Google Calendar`}
            title="Recordarme el lanzamiento"
          >
            <Bell size={21} strokeWidth={2} />

            <span className="game-card__reminder-tooltip">
              Recordarme el lanzamiento
            </span>
          </a>
        )}

        <span className="game-card__category">
          {game.category}
        </span>
      </div>

      <div className="game-card__content">
        <h3 className="game-card__title">
          {game.title}
        </h3>

        {isUpcoming && game.releaseDate && (
          <p className="game-card__release-date">
            Lanzamiento: {formatReleaseDate(game.releaseDate)}
          </p>
        )}

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

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isUpcoming || alreadyInCart}
          className={`game-card__cart-button ${
            alreadyInCart
              ? "game-card__cart-button--added"
              : ""
          }`}
        >
          {alreadyInCart ? (
            <>
              <Check size={18} />
              EN EL CARRITO
            </>
          ) : isUpcoming ? (
            <>
              <Bell size={18} />
              PRÓXIMAMENTE
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              AÑADIR AL CARRITO
            </>
          )}
        </button>
      </div>
    </article>
  );
}

export default GameCard;
