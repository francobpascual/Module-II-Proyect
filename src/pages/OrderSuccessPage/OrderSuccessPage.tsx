
import { Link, useLocation } from "react-router";
import {
  CheckCircle2,
  ShoppingBag,
  CalendarDays,
  Receipt,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import type { CartItem } from "../../interfaces/Cart";
import "./OrderSuccessPage.css";

interface Order {
  id: string;
  date: string;
  email: string;
  items: CartItem[];
  total: number;
  status: "approved-demo";
}

function isValidOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const order = value as Partial<Order>;

  return (
    typeof order.id === "string" &&
    typeof order.date === "string" &&
    typeof order.email === "string" &&
    Array.isArray(order.items) &&
    order.items.length > 0 &&
    typeof order.total === "number" &&
    Number.isFinite(order.total) &&
    order.status === "approved-demo"
  );
}

function formatPrice(price: number): string {
  return price.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

export default function OrderSuccessPage() {
  const location = useLocation();

  const state: unknown = location.state;

  const candidate =
    typeof state === "object" && state !== null
      ? (state as { order?: unknown }).order
      : null;

  const order = isValidOrder(candidate) ? candidate : null;

  if (!order) {
    return (
      <main className="order-success">
        <div className="order-success__missing" data-reveal>
          <AlertCircle size={52} />

          <h1>NO HAY UN PEDIDO PARA MOSTRAR</h1>

          <p>
            No encontramos información de un pedido reciente.
            Podés volver a la tienda para continuar comprando.
          </p>

          <Link to="/#catalogo" className="order-success__button">
            IR A LA TIENDA
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(order.date).toLocaleString(
    "es-AR",
    {
      dateStyle: "long",
      timeStyle: "short",
    }
  );

  return (
    <main className="order-success">
      <div className="order-success__container" data-reveal>
        <div className="order-success__icon">
          <CheckCircle2 size={58} strokeWidth={1.5} />
        </div>

        <span className="order-success__eyebrow">
          GAMERLIX / CHECKOUT
        </span>

        <h1>¡PEDIDO CONFIRMADO!</h1>

        <p className="order-success__subtitle">
          Tu pedido se registró correctamente.
          A continuación podés consultar el resumen de tu compra.
        </p>

        <div className="order-success__receipt">
          <div className="order-success__receipt-heading">
            <div>
              <Receipt size={22} />
              <h2>RESUMEN DEL PEDIDO</h2>
            </div>

            <span className="order-success__status">
              REGISTRADO
            </span>
          </div>

          <div className="order-success__details">
            <div>
              <span>NÚMERO DE PEDIDO</span>
              <strong>{order.id}</strong>
            </div>

            <div>
              <span>FECHA DE COMPRA</span>
              <strong>
                <CalendarDays size={15} />
                {formattedDate}
              </strong>
            </div>

            {order.email && (
              <div>
                <span>CORREO ELECTRÓNICO</span>
                <strong>{order.email}</strong>
              </div>
            )}
          </div>

          <div className="order-success__section-title">
            <ShoppingBag size={19} />
            <h3>VIDEOJUEGOS DEL PEDIDO</h3>
          </div>

          <div className="order-success__items">
            {order.items.map((item) => (
              <div
                key={item.gameId}
                className="order-success__item"
              >
                <img src={item.image} alt={item.title} />

                <div className="order-success__item-info">
                  <strong>{item.title}</strong>
                  <span>VIDEOJUEGO DIGITAL</span>
                </div>

                <strong className="order-success__item-price">
                  {formatPrice(item.price)}
                </strong>
              </div>
            ))}
          </div>

          <div className="order-success__total">
            <span>TOTAL DEL PEDIDO</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </div>

        <Link
          to="/#catalogo"
          className="order-success__button"
        >
          VOLVER A LA TIENDA
          <ArrowRight size={20} />
        </Link>
      </div>
    </main>
  );
}
