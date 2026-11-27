import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router";
import { ShoppingCart, Sun } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { pcStorageKey } from "../PCProfileBridge/PCProfileBridge";
import "./navbar.css";

const PC_CHECKER_URL =
  "/downloads/GAMERLIX_PC_Checker_v4.exe";

function hasSavedPCProfile(userId?: string): boolean {
  if (!userId) return false;

  try {
    const stored = localStorage.getItem(pcStorageKey(userId));

    if (!stored) return false;

    const profile: unknown = JSON.parse(stored);

    if (typeof profile !== "object" || profile === null) {
      return false;
    }

    const data = profile as Record<string, unknown>;

    return (
      typeof data.CPU === "object" &&
      data.CPU !== null &&
      typeof data.RAMGB === "number" &&
      Array.isArray(data.GPUs) &&
      Array.isArray(data.Disks)
    );
  } catch {
    return false;
  }
}

export default function Navbar() {
  const {
    currentUser,
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  const { cartCount, cartTotal } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [pcOpen, setPcOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() =>
    localStorage.getItem("gamerlix-theme") === "light"
      ? "light"
      : "dark"
  );

  const [hasPCData, setHasPCData] = useState(() =>
    hasSavedPCProfile(currentUser?.id)
  );

  const shopRef = useRef<HTMLDivElement>(null);
  const pcRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === "/";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("gamerlix-theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setShopOpen(false);
    setPcOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const refreshPCStatus = () => {
      setHasPCData(hasSavedPCProfile(currentUser?.id));
    };

    refreshPCStatus();

    window.addEventListener(
      "gamerlix-pc-updated",
      refreshPCStatus
    );

    window.addEventListener("storage", refreshPCStatus);

    return () => {
      window.removeEventListener(
        "gamerlix-pc-updated",
        refreshPCStatus
      );

      window.removeEventListener(
        "storage",
        refreshPCStatus
      );
    };
  }, [currentUser?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        shopRef.current &&
        !shopRef.current.contains(target)
      ) {
        setShopOpen(false);
      }

      if (
        pcRef.current &&
        !pcRef.current.contains(target)
      ) {
        setPcOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShopOpen(false);
        setPcOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShopOpen(false);
    setPcOpen(false);
    setMobileOpen(false);
    setHasPCData(false);

    navigate("/", { replace: true });
  };

  const navClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `cinematic-nav__link ${
      isActive ? "cinematic-nav__link--active" : ""
    }`;

  return (
    <header
      className={[
        "cinematic-nav",
        isHome
          ? "cinematic-nav--home"
          : "cinematic-nav--inner",
        scrolled ? "cinematic-nav--scrolled" : "",
      ].join(" ")}
    >
      <div className="cinematic-nav__container">
        <div className="cinematic-nav__brand-group">
          <Link
            to="/"
            className="cinematic-nav__brand"
            aria-label="Gamerlix - Inicio"
          >
            <span className="cinematic-nav__symbol">
              X
            </span>

            <span className="cinematic-nav__brand-name">
              GAMERLIX
            </span>
          </Link>
          <button
            type="button"
            className="cinematic-nav__theme-toggle"
            onClick={() =>
              setTheme((current) =>
                current === "dark" ? "light" : "dark"
              )
            }
            aria-label={
              theme === "dark"
                ? "Activar modo claro"
                : "Activar modo oscuro"
            }
            aria-pressed={theme === "light"}
          >
            <Sun size={19} aria-hidden="true" />
          </button>
        </div>

        <nav
          className="cinematic-nav__desktop"
          aria-label="Navegación principal"
        >
          <NavLink
            to="/"
            end
            className={navClass}
          >
            INICIO
          </NavLink>

          {/* TIENDA */}
          <div
            ref={shopRef}
            className="cinematic-nav__dropdown"
            onMouseEnter={() => {
              setShopOpen(true);
              setPcOpen(false);
            }}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button
              type="button"
              className={`cinematic-nav__link cinematic-nav__dropdown-trigger ${
                shopOpen
                  ? "cinematic-nav__link--active"
                  : ""
              }`}
              onClick={() => {
                setShopOpen((prev) => !prev);
                setPcOpen(false);
              }}
              aria-expanded={shopOpen}
              aria-haspopup="true"
              aria-controls="cinematic-shop-menu"
            >
              TIENDA

              <span
                className="cinematic-nav__chevron"
                aria-hidden="true"
              >
                ▾
              </span>
            </button>

            <div
              id="cinematic-shop-menu"
              className={`cinematic-nav__dropdown-menu ${
                shopOpen
                  ? "cinematic-nav__dropdown-menu--open"
                  : ""
              }`}
              aria-hidden={!shopOpen}
              inert={!shopOpen}
            >
              <Link
                to="/#catalogo"
                className="cinematic-nav__dropdown-item"
                onClick={() => setShopOpen(false)}
              >
                LISTA DE JUEGOS
              </Link>

              <Link
                to="/upcoming"
                className="cinematic-nav__dropdown-item"
                onClick={() => setShopOpen(false)}
              >
                PRÓXIMOS LANZAMIENTOS
              </Link>
            </div>
          </div>

          <Link
            to="/#ubicacion"
            className="cinematic-nav__link"
          >
            ACERCA DE
          </Link>

          {/* DETECTAR MI PC */}
          {isAuthenticated && (
            <div
              ref={pcRef}
              className="cinematic-nav__dropdown"
              onMouseEnter={() => {
                setPcOpen(true);
                setShopOpen(false);
              }}
              onMouseLeave={() => setPcOpen(false)}
            >
              <button
                type="button"
                className={`cinematic-nav__link cinematic-nav__dropdown-trigger ${
                  pcOpen
                    ? "cinematic-nav__link--active"
                    : ""
                }`}
                onClick={() => {
                  setPcOpen((prev) => !prev);
                  setShopOpen(false);
                }}
                aria-expanded={pcOpen}
                aria-haspopup="true"
                aria-controls="cinematic-pc-menu"
              >
                DETECTAR MI PC

                <span
                  className="cinematic-nav__chevron"
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>

              <div
                id="cinematic-pc-menu"
                className={`cinematic-nav__dropdown-menu ${
                  pcOpen
                    ? "cinematic-nav__dropdown-menu--open"
                    : ""
                }`}
                aria-hidden={!pcOpen}
                inert={!pcOpen}
              >
                <a
                  href={PC_CHECKER_URL}
                  download="GAMERLIX_PC_Checker_v4.exe"
                  className="cinematic-nav__dropdown-item"
                  onClick={() => setPcOpen(false)}
                >
                  DESCARGAR DETECTOR
                </a>

                {hasPCData && (
                  <NavLink
                    to="/mi-pc"
                    className="cinematic-nav__dropdown-item"
                    onClick={() => setPcOpen(false)}
                  >
                    DATOS DE MI PC
                  </NavLink>
                )}
              </div>
            </div>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={navClass}
            >
              PANEL ADMINISTRATIVO
            </NavLink>
          )}
        </nav>

        {/* CARRITO Y SESIÓN */}
        <div className="cinematic-nav__actions">
          {isAuthenticated && (
            <Link
              to="/cart"
              className="cinematic-nav__cart"
              aria-label={`Ver carrito: ${cartCount} videojuegos, total $${cartTotal.toLocaleString("es-AR")}`}
              title="Ver mi carrito"
            >
              <span className="cinematic-nav__cart-icon">
                <ShoppingCart
                  size={23}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                {cartCount > 0 && (
                  <span className="cinematic-nav__cart-count">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </span>
              <span className="cinematic-nav__cart-total">
                ${cartTotal.toLocaleString("es-AR")}
              </span>
            </Link>
          )}

          {isAuthenticated ? (
            <button
              type="button"
              className="cinematic-nav__action-button"
              onClick={handleLogout}
            >
              <span>LOGOUT</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="cinematic-nav__action-button"
            >
              <span>INICIAR SESIÓN</span>
            </Link>
          )}
        </div>

        {/* BOTÓN MÓVIL */}
        <button
          type="button"
          className={`cinematic-nav__mobile-toggle ${
            mobileOpen
              ? "cinematic-nav__mobile-toggle--open"
              : ""
          }`}
          aria-label={
            mobileOpen
              ? "Cerrar menú"
              : "Abrir menú"
          }
          aria-expanded={mobileOpen}
          aria-controls="cinematic-mobile-menu"
          onClick={() =>
            setMobileOpen((prev) => !prev)
          }
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MENÚ MÓVIL */}
      <nav
        id="cinematic-mobile-menu"
        className={`cinematic-nav__mobile ${
          mobileOpen
            ? "cinematic-nav__mobile--open"
            : ""
        }`}
        aria-label="Navegación móvil"
        inert={!mobileOpen}
      >
        <NavLink
          to="/"
          onClick={() => setMobileOpen(false)}
        >
          INICIO
        </NavLink>

        <Link
          to="/#catalogo"
          onClick={() => setMobileOpen(false)}
        >
          LISTA DE JUEGOS
        </Link>

        <Link
          to="/upcoming"
          onClick={() => setMobileOpen(false)}
        >
          PRÓXIMOS LANZAMIENTOS
        </Link>

        <Link
          to="/#ubicacion"
          onClick={() => setMobileOpen(false)}
        >
          ACERCA DE
        </Link>

        {/* DETECTOR EN MÓVIL */}
        {isAuthenticated && (
          <>
            <a
              href={PC_CHECKER_URL}
              download="GAMERLIX_PC_Checker_v4.exe"
              onClick={() => setMobileOpen(false)}
            >
              DESCARGAR DETECTOR DE PC
            </a>

            {hasPCData && (
              <NavLink
                to="/mi-pc"
                onClick={() => setMobileOpen(false)}
              >
                DATOS DE MI PC
              </NavLink>
            )}
          </>
        )}

        {isAdmin && (
          <NavLink
            to="/admin"
            onClick={() => setMobileOpen(false)}
          >
            PANEL ADMINISTRATIVO
          </NavLink>
        )}

        {/* CARRITO MÓVIL */}
        {isAuthenticated && (
          <NavLink
            to="/cart"
            onClick={() => setMobileOpen(false)}
          >
            MI CARRITO ({cartCount}) · ${cartTotal.toLocaleString("es-AR")}
          </NavLink>
        )}

        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogout}
          >
            LOGOUT
          </button>
        ) : (
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
          >
            INICIAR SESIÓN
          </Link>
        )}
      </nav>
    </header>
  );
}
