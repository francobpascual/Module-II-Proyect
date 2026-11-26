
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  LockKeyhole,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "../../schemas/checkoutSchema";
import "./CheckoutPage.css";

function formatPrice(value: number): string {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { items, cartTotal, cartCount, clearCart } = useCart();

  const [completed, setCompleted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      expirationDate: "",
      cvv: "",
    },
  });

  const cardNumber = useWatch({
    control,
    name: "cardNumber",
    defaultValue: "",
  });

  const cardholderName = useWatch({
    control,
    name: "cardholderName",
    defaultValue: "",
  });

  const expirationDate = useWatch({
    control,
    name: "expirationDate",
    defaultValue: "",
  });

  const formattedCardNumber =
    (cardNumber || "")
      .padEnd(16, "•")
      .match(/.{1,4}/g)
      ?.join(" ") ?? "•••• •••• •••• ••••";

  function onSubmit(_data: CheckoutFormData) {
    if (!isAuthenticated || cartCount === 0 || completed) {
      return;
    }

    setCompleted(true);

    const order = {
      id: `GLX-${Date.now()}`,
      date: new Date().toISOString(),
      email: currentUser?.email ?? "",
      items: items.map((item) => ({ ...item })),
      total: cartTotal,
      status: "approved-demo" as const,
    };

    // No se guardan los datos de la tarjeta.
    clearCart();

    navigate("/order-success", {
      replace: true,
      state: { order },
    });
  }

  if (!isAuthenticated) {
    return (
      <main className="checkout-page">
        <div className="checkout-page__message">
          <LockKeyhole size={42} />
          <h1>INICIÁ SESIÓN</h1>
          <p>Ingresá a tu cuenta para continuar con tu compra.</p>
          <Link to="/login" className="checkout-page__button">
            INICIAR SESIÓN
          </Link>
        </div>
      </main>
    );
  }

  if (cartCount === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-page__message">
          <ShoppingCart size={42} />
          <h1>TU CARRITO ESTÁ VACÍO</h1>
          <p>Agregá videojuegos para continuar con la compra.</p>
          <Link to="/cart" className="checkout-page__button">
            VOLVER AL CARRITO
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-page__container">
        <Link to="/cart" className="checkout-page__back">
          <ArrowLeft size={17} />
          VOLVER AL CARRITO
        </Link>

        <header className="checkout-page__heading">
          <span className="checkout-page__eyebrow">
            GAMERLIX / CHECKOUT
          </span>
          <h1>FINALIZAR COMPRA</h1>
          <p>Estás a un paso de completar tu pedido.</p>
        </header>

        <div className="checkout-page__steps">
          <div className="checkout-page__step">
            <CheckCircle2 size={17} />
            <span>CARRITO</span>
          </div>
          <div className="checkout-page__step-line" />
          <div className="checkout-page__step checkout-page__step--active">
            <span className="checkout-page__step-number">2</span>
            <span>PAGO</span>
          </div>
          <div className="checkout-page__step-line" />
          <div className="checkout-page__step">
            <span className="checkout-page__step-number">3</span>
            <span>CONFIRMACIÓN</span>
          </div>
        </div>

        <div className="checkout-page__layout">
          <section className="checkout-page__panel">
            <div className="checkout-page__panel-heading">
              <div>
                <CreditCard size={22} />
                <h2>INFORMACIÓN DE PAGO</h2>
              </div>
              <span>TARJETA DE CRÉDITO</span>
            </div>

            <div className="checkout-page__card-preview">
              <div className="checkout-page__card-top">
                <span>GAMERLIX</span>
                <CreditCard size={30} strokeWidth={1.4} />
              </div>

              <div className="checkout-page__chip">
                <span />
              </div>

              <strong className="checkout-page__card-number">
                {formattedCardNumber}
              </strong>

              <div className="checkout-page__card-bottom">
                <div>
                  <span>TITULAR</span>
                  <strong>
                    {cardholderName?.trim()
                      ? cardholderName.toUpperCase()
                      : "NOMBRE Y APELLIDO"}
                  </strong>
                </div>

                <div>
                  <span>VENCIMIENTO</span>
                  <strong>{expirationDate || "MM/AA"}</strong>
                </div>
              </div>
            </div>

            <form
              className="checkout-page__form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              autoComplete="off"
            >
              <div className="checkout-page__field">
                <label htmlFor="cardholderName">
                  NOMBRE Y APELLIDO DEL TITULAR
                </label>
                <input
                  id="cardholderName"
                  type="text"
                  placeholder="Nombre y apellido"
                  maxLength={100}
                  aria-invalid={!!errors.cardholderName}
                  {...register("cardholderName")}
                />
                {errors.cardholderName && (
                  <p className="checkout-page__error">
                    {errors.cardholderName.message}
                  </p>
                )}
              </div>

              <div className="checkout-page__field">
                <label htmlFor="cardNumber">
                  NÚMERO DE TARJETA
                </label>
                <div className="checkout-page__input-icon">
                  <input
                    id="cardNumber"
                    type="text"
                    inputMode="numeric"
                    maxLength={16}
                    placeholder="0000000000000000"
                    aria-invalid={!!errors.cardNumber}
                    {...register("cardNumber", {
                      onChange: (event) => {
                        event.target.value =
                          event.target.value.replace(/\D/g, "").slice(0, 16);
                      },
                    })}
                  />
                  <CreditCard size={20} />
                </div>
                {errors.cardNumber && (
                  <p className="checkout-page__error">
                    {errors.cardNumber.message}
                  </p>
                )}
              </div>

              <div className="checkout-page__field-row">
                <div className="checkout-page__field">
                  <label htmlFor="expirationDate">
                    FECHA DE VENCIMIENTO
                  </label>
                  <input
                    id="expirationDate"
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    placeholder="MM/AA"
                    aria-invalid={!!errors.expirationDate}
                    {...register("expirationDate", {
                      onChange: (event) => {
                        const digits = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);

                        event.target.value =
                          digits.length > 2
                            ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                            : digits;
                      },
                    })}
                  />
                  {errors.expirationDate && (
                    <p className="checkout-page__error">
                      {errors.expirationDate.message}
                    </p>
                  )}
                </div>

                <div className="checkout-page__field">
                  <label htmlFor="cvv">
                    CÓDIGO DE SEGURIDAD
                  </label>
                  <div className="checkout-page__input-icon">
                    <input
                      id="cvv"
                      type="text"
                      inputMode="numeric"
                      maxLength={3}
                      placeholder="CVV"
                      aria-invalid={!!errors.cvv}
                      {...register("cvv", {
                        onChange: (event) => {
                          event.target.value =
                            event.target.value.replace(/\D/g, "").slice(0, 3);
                        },
                      })}
                    />
                    <LockKeyhole size={18} />
                  </div>
                  {errors.cvv && (
                    <p className="checkout-page__error">
                      {errors.cvv.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="checkout-page__button"
                disabled={isSubmitting || completed}
              >
                {isSubmitting || completed
                  ? "PROCESANDO..."
                  : `CONFIRMAR COMPRA · ${formatPrice(cartTotal)}`}
                <ArrowRight size={19} />
              </button>
            </form>
          </section>

          <aside className="checkout-page__summary">
            <h2>RESUMEN DEL PEDIDO</h2>
            <span className="checkout-page__summary-count">
              {cartCount} {cartCount === 1 ? "VIDEOJUEGO" : "VIDEOJUEGOS"}
            </span>

            <div className="checkout-page__items">
              {items.map((item) => (
                <div className="checkout-page__item" key={item.gameId}>
                  <img src={item.image} alt={item.title} />
                  <div className="checkout-page__item-info">
                    <strong>{item.title}</strong>
                    <span>VERSIÓN DIGITAL</span>
                    <b>{formatPrice(item.price)}</b>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-page__totals">
              <div>
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div>
                <span>Entrega</span>
                <span>Digital</span>
              </div>
              <div className="checkout-page__total">
                <strong>TOTAL</strong>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
