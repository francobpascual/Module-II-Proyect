import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, Dispatch, KeyboardEvent, MouseEvent, ReactNode, SetStateAction } from 'react';
import './navbar.css';


type Status = 'on' | 'away' | 'off';

interface Notif {
  id: number;
  icon: string;
  who: string;
  text: string;
  time: string;
  unread: boolean;
}

export interface NavbarProps {
  /** Cantidad de juegos en el carrito (viene de tu estado global/App) */
  cartCount?: number;
  /** Cantidad de juegos deseados */
  wishlistCount?: number;
  userName?: string;
  balance?: string;
  /** Lista de nombres para autocompletar el buscador */
  suggestions?: string[];
  /** Se llama al buscar (Enter, click en sugerencia o categoría) */
  onSearch?: (query: string) => void;
  onCartClick?: () => void;
  onWishlistClick?: () => void;
}

const DEFAULT_SUGGESTIONS = [
  'Cinder Vale', 'Neon Drifters', 'Hollow Peak', 'Starforge Tactics', 'Pixel Pirates',
  'Moss & Memory', 'Iron Orchard', 'Quantum Courier', 'Last Lantern', 'Tidebreakers',
];

const INITIAL_NOTIFS: Notif[] = [
  { id: 1, icon: '🏷️', who: 'Quantum Courier', text: 'de tu lista de deseados está al 50%.', time: 'hace 5 min', unread: true },
  { id: 2, icon: '👥', who: 'Lucía', text: 'te envió una solicitud de amistad.', time: 'hace 1 h', unread: true },
  { id: 3, icon: '💬', who: 'Nico', text: '¿jugamos esta noche?', time: 'hace 3 h', unread: true },
  { id: 4, icon: '🎁', who: 'Fede', text: 'te envió un regalo.', time: 'ayer', unread: false },
];

const CATEGORIES_A = ['Acción', 'Aventura', 'Rol', 'Estrategia'];
const CATEGORIES_B = ['Carreras', 'Puzles', 'Indie', 'Simulación'];
const CATEGORIES_C = ['Cooperativo', 'Un jugador', 'Multijugador'];

const STATUS_LABEL: Record<Status, string> = { on: 'Conectado', away: 'Ausente', off: 'Invisible' };

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/* ------------------------------------------------------------------ */
/*  Piezas pequeñas                                                    */
/* ------------------------------------------------------------------ */

/** <a> que no salta al inicio de la página cuando href="#".
 *  Si usás react-router, cambialo por <Link to="...">. */
function A({ href = '#', children, onClick, className, role }: {
  href?: string; children: ReactNode; onClick?: () => void; className?: string; role?: string;
}) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href === '#') e.preventDefault();
    onClick?.();
  };
  return <a href={href} onClick={handle} className={className} role={role}>{children}</a>;
}

const Caret = () => (
  <svg className="nb-caret" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M1 3l4 4 4-4z" /></svg>
);

function Highlight({ text, q }: { text: string; q: string }) {
  const v = norm(q.trim());
  const i = v ? norm(text).indexOf(v) : -1;
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + v.length)}</mark>{text.slice(i + v.length)}</>;
}

/* Dropdown genérico: hover (escritorio) + click + teclado + Escape */
interface DropdownProps {
  id: string;
  openId: string | null;
  setOpenId: Dispatch<SetStateAction<string | null>>;
  trigger: ReactNode;
  triggerClass?: string;
  triggerLabel?: string;
  panelClass?: string;
  wrapStyle?: CSSProperties;
  children: ReactNode;
}

function Dropdown({ id, openId, setOpenId, trigger, triggerClass = 'nb-btn', triggerLabel, panelClass = '', wrapStyle, children }: DropdownProps) {
  const open = openId === id;
  const timer = useRef<number | undefined>(undefined);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const canHover = () => window.matchMedia('(hover:hover) and (min-width:901px)').matches;
  const enter = () => {
    if (!canHover()) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpenId(id), 90);
  };
  const leave = () => {
    if (!canHover()) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpenId(cur => (cur === id ? null : cur)), 220);
  };

  const focusables = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a, button') ?? []);

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpenId(id);
      window.setTimeout(() => focusables()[0]?.focus(), 40);
    }
  };
  const onPanelKey = (e: KeyboardEvent) => {
    const items = focusables();
    const i = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length]?.focus(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length]?.focus(); }
    if (e.key === 'Escape') { setOpenId(null); btnRef.current?.focus(); }
  };

  return (
    <div className="nb-dd" data-dd style={wrapStyle} onMouseEnter={enter} onMouseLeave={leave}>
      <button
        ref={btnRef}
        className={triggerClass}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={triggerLabel}
        onClick={() => setOpenId(cur => (cur === id ? null : id))}
        onKeyDown={onTriggerKey}
      >
        {trigger}
      </button>
      <div
        ref={panelRef}
        className={`nb-panel ${panelClass} ${open ? 'nb-open' : ''}`}
        onKeyDown={onPanelKey}
        onClick={e => { if ((e.target as HTMLElement).closest('a')) setOpenId(null); }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */
export default function Navbar({
  cartCount = 0,
  wishlistCount = 0,
  userName = 'Martín',
  balance = 'ARS$ 4.250,00',
  suggestions = DEFAULT_SUGGESTIONS,
  onSearch,
  onCartClick,
  onWishlistClick,
}: NavbarProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [status, setStatus] = useState<Status>('on');
  const [notifs, setNotifs] = useState<Notif[]>(INITIAL_NOTIFS);
  const [activeLink, setActiveLink] = useState('comunidad');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  /* buscador */
  const [query, setQuery] = useState('');
  const [sOpen, setSOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [recents, setRecents] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('vapor-recents') || '[]'); } catch { return []; }
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const unread = notifs.filter(n => n.unread).length;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  /* sombra + barra compacta al hacer scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* click afuera, Escape y atajo "/" */
  useEffect(() => {
    const onDown = (e: globalThis.MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('[data-dd]')) setOpenId(null);
      if (!t.closest('.nb-search')) setSOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenId(null); setSOpen(false); setDrawer(false); }
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (e.key === '/' && tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  /* bloquear scroll con el drawer abierto + cerrar al agrandar la ventana */
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : '';
    const onResize = () => { if (window.innerWidth > 900) setDrawer(false); };
    window.addEventListener('resize', onResize);
    return () => { document.body.style.overflow = ''; window.removeEventListener('resize', onResize); };
  }, [drawer]);

  /* ---- búsqueda ---- */
  const matches = useMemo(() => {
    const v = norm(query.trim());
    return (v ? suggestions.filter(s => norm(s).includes(v)) : suggestions.slice(0, 4)).slice(0, 6);
  }, [query, suggestions]);
  const showRecents = !query.trim() && recents.length > 0;
  const options = useMemo(() => [...(showRecents ? recents : []), ...matches], [showRecents, recents, matches]);

  const submit = (value: string) => {
    const v = value.trim();
    if (!v) return;
    const next = [v, ...recents.filter(r => r !== v)].slice(0, 4);
    setRecents(next);
    try { localStorage.setItem('vapor-recents', JSON.stringify(next)); } catch { /* sin storage */ }
    setQuery(v);
    setSOpen(false);
    setActive(-1);
    setDrawer(false);
    inputRef.current?.blur();
    if (onSearch) onSearch(v); else showToast(`Buscando “${v}”`);
  };

  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSOpen(true); setActive(a => (a + 1) % Math.max(options.length, 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => (a - 1 + options.length) % Math.max(options.length, 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); submit(active >= 0 ? options[active] : query); }
  };

  const goCategory = (c: string) => {
    setQuery(c);
    setOpenId(null);
    setDrawer(false);
    if (onSearch) onSearch(c); else showToast(`Categoría: ${c}`);
  };

  const markAll = () => setNotifs(ns => ns.map(n => ({ ...n, unread: false })));
  const readOne = (id: number) => setNotifs(ns => ns.map(n => (n.id === id ? { ...n, unread: false } : n)));

  const link = (key: string) => () => setActiveLink(key);

  /* ---------------------------------------------------------------- */
  return (
    <>
      <header className={`nb ${scrolled ? 'nb-scrolled' : ''}`}>
        {/* ===== barra superior ===== */}
        <div className="nb-top">
          <div className="nb-wrap">
            <button className="nb-burger" aria-label="Abrir menú" aria-expanded={drawer} onClick={() => setDrawer(d => !d)}>
              <span />
            </button>

            <A href="#" className="nb-logo">
              <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="18" stroke="#66c0f4" strokeWidth="2" />
                <path d="M8 24c4-1 6 4 10 2s2-8 8-7 7 8 6 9" stroke="#c7d5e0" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="27" cy="13" r="4.5" fill="#66c0f4" />
                <circle cx="12" cy="27" r="3" fill="#c7d5e0" />
              </svg>
              <b>VAPOR</b>
            </A>

            <ul className="nb-gnav">
              <li>
                <Dropdown id="tienda" openId={openId} setOpenId={setOpenId} trigger={<>Tienda <Caret /></>}>
                  <A href="#">Destacados y recomendados</A>
                  <A href="#" onClick={onWishlistClick}>Lista de deseados <em>{wishlistCount}</em></A>
                  <A href="#">Noticias</A>
                  <hr />
                  <div className="nb-sub">Explorar</div>
                  <A href="#">Más vendidos</A>
                  <A href="#">Novedades</A>
                  <A href="#">Próximamente</A>
                </Dropdown>
              </li>
              <li><A href="#" className={`nb-link ${activeLink === 'comunidad' ? 'nb-active' : ''}`} onClick={link('comunidad')}>Comunidad</A></li>
              <li>
                <Dropdown id="perfil" openId={openId} setOpenId={setOpenId} trigger={<>Perfil <Caret /></>}>
                  <A href="#">Actividad</A>
                  <A href="#">Insignias</A>
                  <A href="#">Capturas</A>
                  <A href="#">Inventario</A>
                </Dropdown>
              </li>
              <li><A href="#" className={`nb-link ${activeLink === 'chat' ? 'nb-active' : ''}`} onClick={link('chat')}>Chat</A></li>
              <li><A href="#" className={`nb-link ${activeLink === 'soporte' ? 'nb-active' : ''}`} onClick={link('soporte')}>Soporte</A></li>
            </ul>

            <div className="nb-right">
              <A href="#" className="nb-install" onClick={() => showToast('Descargando instalador… (demo)')}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 11L3 6h3V1h4v5h3zM2 13h12v2H2z" /></svg>
                Instalar Vapor
              </A>

              {/* notificaciones */}
              <Dropdown
                id="notif" openId={openId} setOpenId={setOpenId} panelClass="nb-right-panel nb-wide"
                triggerClass="nb-icon" triggerLabel="Notificaciones"
                trigger={
                  <>
                    <svg viewBox="0 0 20 20" fill="currentColor" className={unread ? 'nb-ring' : ''}><path d="M10 2a5 5 0 00-5 5v3l-1.5 3h13L15 10V7a5 5 0 00-5-5zM8 16a2 2 0 004 0z" /></svg>
                    {unread > 0 && <span className="nb-badge">{unread}</span>}
                  </>
                }
              >
                <div className="nb-phead">Notificaciones <button onClick={markAll}>Marcar como leídas</button></div>
                {notifs.map(n => (
                  <button key={n.id} className={`nb-notif ${n.unread ? 'nb-unread' : ''}`} onClick={() => readOne(n.id)}>
                    <span className="nb-nic">{n.icon}</span>
                    <span><p><b>{n.who}</b> {n.text}</p><small>{n.time}</small></span>
                  </button>
                ))}
              </Dropdown>

              {/* usuario */}
              <Dropdown
                id="user" openId={openId} setOpenId={setOpenId} panelClass="nb-right-panel" triggerClass="nb-user"
                trigger={
                  <>
                    <span className="nb-avatar" data-s={status}>{userName.charAt(0).toUpperCase()}</span>
                    <span className="nb-uname">{userName}<small>{balance}</small></span>
                  </>
                }
              >
                <div className="nb-sub">Estado</div>
                <div className="nb-status">
                  {(Object.keys(STATUS_LABEL) as Status[]).map(s => (
                    <button key={s} aria-pressed={status === s} onClick={() => { setStatus(s); showToast(`Estado: ${STATUS_LABEL[s]}`); }}>
                      <i className={`nb-dot ${s}`} />{STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
                <hr />
                <A href="#">Ver mi perfil</A>
                <A href="#">Cuenta <em>Detalles</em></A>
                <A href="#">Agregar fondos <em>{balance}</em></A>
                <A href="#">Cambiar de cuenta…</A>
                <hr />
                <A href="#" onClick={() => showToast('Sesión cerrada (demo)')}>Cerrar sesión</A>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* ===== barra de tienda ===== */}
        <nav className="nb-store" aria-label="Tienda">
          <div className="nb-wrap">
            <ul className="nb-snav">
              <li>
                <Dropdown id="yours" openId={openId} setOpenId={setOpenId} triggerClass="nb-sbtn" trigger={<>Tu tienda <Caret /></>}>
                  <A href="#">Inicio</A>
                  <A href="#">Recomendaciones de la comunidad</A>
                  <A href="#">Vistos recientemente</A>
                  <A href="#">Tus etiquetas</A>
                </Dropdown>
              </li>
              <li>
                <Dropdown id="new" openId={openId} setOpenId={setOpenId} triggerClass="nb-sbtn" trigger={<>Nuevo y destacable <Caret /></>}>
                  <A href="#">Novedades</A>
                  <A href="#">Más vendidos</A>
                  <A href="#">Más jugados</A>
                  <A href="#">Próximos lanzamientos</A>
                </Dropdown>
              </li>
              <li>
                <Dropdown id="cat" openId={openId} setOpenId={setOpenId} triggerClass="nb-sbtn" panelClass="nb-mega" trigger={<>Categorías <Caret /></>}>
                  <div>
                    <h4>Géneros</h4>
                    {CATEGORIES_A.map(c => <A key={c} href="#" onClick={() => goCategory(c)}>{c}</A>)}
                  </div>
                  <div>
                    <h4>&nbsp;</h4>
                    {CATEGORIES_B.map(c => <A key={c} href="#" onClick={() => goCategory(c)}>{c}</A>)}
                  </div>
                  <div>
                    <h4>Modos</h4>
                    {CATEGORIES_C.map(c => <A key={c} href="#" onClick={() => goCategory(c)}>{c}</A>)}
                  </div>
                  <A href="#" className="nb-feat" onClick={() => goCategory('Cinder Vale')}>
                    <b>Cinder Vale</b><span>Oferta de otoño · Rol</span><i>Ver oferta →</i>
                  </A>
                </Dropdown>
              </li>
              <li><A href="#" className="nb-slink">Tienda de puntos</A></li>
              <li><A href="#" className="nb-slink">Noticias</A></li>
              <li><A href="#" className="nb-slink">Laboratorios <i className="nb-new">NUEVO</i></A></li>
            </ul>

            {/* buscador */}
            <div className="nb-search">
              <form role="search" onSubmit={e => { e.preventDefault(); if (active < 0) submit(query); }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  placeholder="buscar"
                  aria-label="Buscar en la tienda"
                  role="combobox"
                  aria-expanded={sOpen}
                  aria-controls="nb-sugg"
                  aria-autocomplete="list"
                  autoComplete="off"
                  onChange={e => { setQuery(e.target.value); setSOpen(true); setActive(-1); }}
                  onFocus={() => setSOpen(true)}
                  onKeyDown={onSearchKey}
                />
                <kbd>/</kbd>
                <button type="submit" aria-label="Buscar">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6.5" cy="6.5" r="4.5" /><path d="M10 10l5 5" strokeLinecap="round" /></svg>
                </button>
              </form>

              {sOpen && (
                <ul className="nb-sugg" id="nb-sugg" role="listbox">
                  {showRecents && <li className="nb-sec" role="presentation">Búsquedas recientes</li>}
                  {showRecents && recents.map((r, i) => (
                    <li key={'r' + r} role="option" aria-selected={active === i}
                        onMouseDown={e => { e.preventDefault(); submit(r); }} onMouseEnter={() => setActive(i)}>
                      <span className="nb-n">🕘 {r}</span>
                    </li>
                  ))}
                  <li className="nb-sec" role="presentation">{query.trim() ? 'Resultados' : 'Populares ahora'}</li>
                  {matches.length === 0 && <li className="nb-none" role="presentation">Sin coincidencias</li>}
                  {matches.map((m, j) => {
                    const i = (showRecents ? recents.length : 0) + j;
                    return (
                      <li key={m} role="option" aria-selected={active === i}
                          onMouseDown={e => { e.preventDefault(); submit(m); }} onMouseEnter={() => setActive(i)}>
                        <span className="nb-n"><Highlight text={m} q={query} /></span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <A href="#" className="nb-wish" onClick={onWishlistClick}>
              <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 14S1 9.5 1 5.5A3.5 3.5 0 018 4a3.5 3.5 0 017 1.5C15 9.5 8 14 8 14z" /></svg>
              <span>Deseados (<b key={wishlistCount} className="nb-pop">{wishlistCount}</b>)</span>
            </A>

            {/* carrito */}
            <Dropdown
              id="cart" openId={openId} setOpenId={setOpenId} triggerClass="nb-cart" triggerLabel="Carrito"
              panelClass="nb-right-panel nb-wide" wrapStyle={{ alignSelf: 'center' }}
              trigger={
                <>
                  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M0 1h3l.6 2H15l-1.7 7H5L3 2H0zM5.5 15a1.3 1.3 0 100-2.6 1.3 1.3 0 000 2.6zm7 0a1.3 1.3 0 100-2.6 1.3 1.3 0 000 2.6z" /></svg>
                  <span className="nb-lbl">Carrito (<b key={cartCount} className="nb-pop">{cartCount}</b>)</span>
                </>
              }
            >
              <div className="nb-phead">Tu carrito</div>
              {cartCount === 0
                ? <div className="nb-empty">Tu carrito está vacío</div>
                : <div className="nb-empty">Tenés <b>{cartCount}</b> {cartCount === 1 ? 'artículo' : 'artículos'} en el carrito</div>}
              <A href="#" className="nb-green" onClick={onCartClick ?? (() => showToast('Ir al carrito (demo)'))}>Ir al carrito</A>
            </Dropdown>
          </div>
        </nav>
      </header>

      {/* ===== menú móvil ===== */}
      <div className={`nb-overlay ${drawer ? 'nb-open' : ''}`} onClick={() => setDrawer(false)} />
      <aside className={`nb-drawer ${drawer ? 'nb-open' : ''}`} aria-hidden={!drawer} aria-label="Menú móvil">
        <div className="nb-dhead"><b>VAPOR</b></div>
        <div className="nb-dsearch">
          <input
            type="search" placeholder="Buscar juegos…" aria-label="Buscar"
            onKeyDown={e => { if (e.key === 'Enter') submit((e.target as HTMLInputElement).value); }}
          />
        </div>
        <details open>
          <summary>Tienda</summary>
          <A href="#" onClick={() => setDrawer(false)}>Destacados</A>
          <A href="#" onClick={() => setDrawer(false)}>Novedades</A>
          <A href="#" onClick={() => setDrawer(false)}>Más vendidos</A>
          <A href="#" onClick={() => { setDrawer(false); onWishlistClick?.(); }}>Lista de deseados ({wishlistCount})</A>
        </details>
        <details>
          <summary>Categorías</summary>
          {[...CATEGORIES_A, 'Indie'].map(c => <A key={c} href="#" onClick={() => goCategory(c)}>{c}</A>)}
        </details>
        <A href="#" onClick={() => setDrawer(false)}>Comunidad</A>
        <details>
          <summary>Perfil</summary>
          <A href="#" onClick={() => setDrawer(false)}>Actividad</A>
          <A href="#" onClick={() => setDrawer(false)}>Insignias</A>
          <A href="#" onClick={() => setDrawer(false)}>Inventario</A>
        </details>
        <A href="#" onClick={() => setDrawer(false)}>Chat</A>
        <A href="#" onClick={() => setDrawer(false)}>Soporte</A>
        <A href="#" className="nb-dinstall" onClick={() => { setDrawer(false); showToast('Descargando instalador… (demo)'); }}>⬇ Instalar Vapor</A>
      </aside>

      {toast && <div className="nb-toast" role="status">{toast}</div>}
    </>
  );
}