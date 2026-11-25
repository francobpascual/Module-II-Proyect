
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import "./navbar.css";

const PC_CHECKER_URL = "/downloads/GAMERLIX_PC_Checker_v4.exe";

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const shopRef = useRef<HTMLDivElement>(null);
  const isHome = location.pathname === "/";

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
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shopRef.current &&
        !shopRef.current.contains(event.target as Node)
      ) {
        setShopOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShopOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setShopOpen(false);
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `cinematic-nav__link ${
      isActive ? "cinematic-nav__link--active" : ""
    }`;

  return (
    <header
      className={[
        "cinematic-nav",
        isHome ? "cinematic-nav--home" : "cinematic-nav--inner",
        scrolled ? "cinematic-nav--scrolled" : "",
      ].join(" ")}
    >
      <div className="cinematic-nav__container">
        <Link
          to="/"
          className="cinematic-nav__brand"
          aria-label="Gamerlix - Inicio"
        >
          <span className="cinematic-nav__symbol">X</span>
          <span className="cinematic-nav__brand-name">
            GAMERLIX
          </span>
        </Link>

        <nav
          className="cinematic-nav__desktop"
          aria-label="Navegación principal"
        >
          <NavLink to="/" end className={navClass}>
            INICIO
          </NavLink>

          <div
            ref={shopRef}
            className="cinematic-nav__dropdown"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <button
              type="button"
              className={`cinematic-nav__link cinematic-nav__dropdown-trigger ${
                shopOpen ? "cinematic-nav__link--active" : ""
              }`}
              onClick={() => setShopOpen((prev) => !prev)}
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

          <NavLink to="/about" className={navClass}>
            ACERCA DE
          </NavLink>

          {isAuthenticated && (
            <a
              href={PC_CHECKER_URL}
              download="GAMERLIX_PC_Checker_v4.exe"
              className="cinematic-nav__link"
              title="Descargar el detector de hardware de GAMERLIX"
            >
              DETECTAR MI PC
            </a>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={navClass}>
              PANEL ADMINISTRATIVO
            </NavLink>
          )}
        </nav>

        <div className="cinematic-nav__actions">
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

        <button
          type="button"
          className={`cinematic-nav__mobile-toggle ${
            mobileOpen
              ? "cinematic-nav__mobile-toggle--open"
              : ""
          }`}
          aria-label={
            mobileOpen ? "Cerrar menú" : "Abrir menú"
          }
          aria-expanded={mobileOpen}
          aria-controls="cinematic-mobile-menu"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        id="cinematic-mobile-menu"
        className={`cinematic-nav__mobile ${
          mobileOpen ? "cinematic-nav__mobile--open" : ""
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

        <NavLink
          to="/about"
          onClick={() => setMobileOpen(false)}
        >
          ACERCA DE
        </NavLink>

        {isAuthenticated && (
          <a
            href={PC_CHECKER_URL}
            download="GAMERLIX_PC_Checker_v4.exe"
            onClick={() => setMobileOpen(false)}
          >
            DETECTAR MI PC
          </a>
        )}

        {isAdmin && (
          <NavLink
            to="/admin"
            onClick={() => setMobileOpen(false)}
          >
            PANEL ADMINISTRATIVO
          </NavLink>
        )}

        {isAuthenticated ? (
          <button type="button" onClick={handleLogout}>
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
