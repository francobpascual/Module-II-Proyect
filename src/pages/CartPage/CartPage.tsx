import { Link, useNavigate } from "react-router";
import {
  ShoppingCart,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import "./CartPage.css";

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    items,
    cartCount,
    cartTotal,
    removeFromCart,
    clearCart,
  } = useCart();

  if (!isAuthenticated) {
    return (
      <main className="cart-page">
        <div className="cart-page__empty">
          <ShoppingCart size={56} />

          <h1>INICIÁ SESIÓN</h1>

          <p>
            Necesitás iniciar sesión para acceder a tu carrito.
          </p>

          <Link to="/login" className="cart-page__primary-button">
            INICIAR SESIÓN
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-page__container">
        <Link to="/#catalogo" className="cart-page__back">
          <ArrowLeft size={18} />
          SEGUIR COMPRANDO
        </Link>

        <div className="cart-page__heading" data-reveal>
          <h1>MI CARRITO</h1>

          <p>
            Revisá tus videojuegos antes de finalizar la compra.
          </p>
        </div>

        {cartCount === 0 ? (
          <div className="cart-page__empty">
            <ShoppingCart size={56} />

            <h2>TU CARRITO ESTÁ VACÍO</h2>

            <p>
              Todavía no agregaste videojuegos a tu carrito.
            </p>

            <Link
              to="/#catalogo"
              className="cart-page__primary-button"
            >
              EXPLORAR VIDEOJUEGOS
            </Link>
          </div>
        ) : (
          <div className="cart-page__layout" data-reveal>
            <section className="cart-page__products">
              <div className="cart-page__section-header">
                <h2>
                  VIDEOJUEGOS ({cartCount})
                </h2>

                <button
                  type="button"
                  onClick={clearCart}
                  className="cart-page__clear-button"
                >
                  <Trash2 size={17} />
                  VACIAR CARRITO
                </button>
              </div>

              <div className="cart-page__items">
                {items.map((item) => (
                  <article
                    key={item.gameId}
                    className="cart-page__item"
                  >
                    <Link to={`/detail/${item.gameId}`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="cart-page__item-image"
                      />
                    </Link>

                    <div className="cart-page__item-info">
                      <Link
                        to={`/detail/${item.gameId}`}
                        className="cart-page__item-title"
                      >
                        {item.title}
                      </Link>

                      <span className="cart-page__item-type">
                        VIDEOJUEGO DIGITAL
                      </span>

                      <span className="cart-page__item-price">
                        ${item.price.toLocaleString("es-AR")}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="cart-page__remove-button"
                      onClick={() =>
                        removeFromCart(item.gameId)
                      }
                      aria-label={`Eliminar ${item.title} del carrito`}
                      title="Eliminar del carrito"
                    >
                      <Trash2 size={20} />
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <aside className="cart-page__summary">
              <h2>RESUMEN DE COMPRA</h2>

              <div className="cart-page__summary-line">
                <span>
                  Productos ({cartCount})
                </span>

                <span>
                  ${cartTotal.toLocaleString("es-AR")}
                </span>
              </div>

              <div className="cart-page__summary-line">
                <span>Envío</span>
                <span>Digital</span>
              </div>

              <div className="cart-page__summary-divider" />

              <div className="cart-page__summary-total">
                <span>TOTAL</span>

                <strong>
                  ${cartTotal.toLocaleString("es-AR")}
                </strong>
              </div>

              <button
                type="button"
                className="cart-page__checkout-button"
                onClick={() => navigate("/checkout")}
              >
                CONTINUAR AL PAGO
                <ArrowRight size={20} />
              </button>

              <p className="cart-page__security">
                <ShieldCheck size={18} />
                Compra simulada con fines educativos.
                No se realizarán cobros reales.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
