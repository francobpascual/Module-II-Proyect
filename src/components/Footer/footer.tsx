import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, MouseEvent, ReactNode } from 'react';
import './footer.css';

/* ------------------------------------------------------------------ */
/*  Redes sociales                                                     */
/* ------------------------------------------------------------------ */
export type SocialKey = 'facebook' | 'x' | 'instagram' | 'youtube' | 'twitch' | 'discord' | 'reddit' | 'tiktok';

interface Social {
  key: SocialKey;
  name: string;
  handle: string;
  url: string; // URL por defecto (inicio de la red) → cambiala por la de tu marca
  color: string; // color al hacer hover
  icon: ReactNode;
}

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const SOCIALS: Social[] = [
  {
    key: 'facebook', name: 'Facebook', handle: '/vapor', url: 'https://www.facebook.com/', color: '#1877f2',
    icon: <svg viewBox="0 0 24 24" {...stroke}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>,
  },
  {
    key: 'x', name: 'X (Twitter)', handle: '@vapor', url: 'https://x.com/', color: '#e7e9ea',
    icon: <svg viewBox="0 0 24 24" {...stroke}><path d="M4 4l11.7 16H20L8.3 4z" /><path d="M4 20l6.8-6.8M13.2 10.8L20 4" /></svg>,
  },
  {
    key: 'instagram', name: 'Instagram', handle: '@vapor', url: 'https://www.instagram.com/', color: '#e4405f',
    icon: <svg viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" /></svg>,
  },
  {
    key: 'youtube', name: 'YouTube', handle: '@vapor', url: 'https://www.youtube.com/', color: '#ff2d2d',
    icon: <svg viewBox="0 0 24 24" {...stroke}><rect x="2" y="5" width="20" height="14" rx="4" /><path d="M10 9l5 3-5 3z" fill="currentColor" /></svg>,
  },
  {
    key: 'twitch', name: 'Twitch', handle: '/vapor', url: 'https://www.twitch.tv/', color: '#9146ff',
    icon: <svg viewBox="0 0 24 24" {...stroke}><path d="M4 3h17v11l-4 4h-4l-3 3H7v-3H4z" /><path d="M15 8v4M11 8v4" /></svg>,
  },
  {
    key: 'discord', name: 'Discord', handle: 'Comunidad', url: 'https://discord.com/', color: '#5865f2',
    icon: <svg viewBox="0 0 24 24" {...stroke}><path d="M7 7c3-1.5 7-1.5 10 0 2 3 3 7 3 11-2 1.5-4 2-5 2l-1-2c-1 .3-3 .3-4 0l-1 2c-1 0-3-.5-5-2 0-4 1-8 3-11z" /><circle cx="9" cy="13" r="1.2" fill="currentColor" /><circle cx="15" cy="13" r="1.2" fill="currentColor" /></svg>,
  },
  {
    key: 'reddit', name: 'Reddit', handle: 'r/vapor', url: 'https://www.reddit.com/', color: '#ff4500',
    icon: <svg viewBox="0 0 24 24" {...stroke}><ellipse cx="12" cy="14" rx="8" ry="5.5" /><circle cx="9" cy="13.5" r="1" fill="currentColor" /><circle cx="15" cy="13.5" r="1" fill="currentColor" /><path d="M9.5 16.5c1.5 1 3.5 1 5 0M12 8.5l1.2-4.5 4 1" /><circle cx="18" cy="5" r="1.3" /><circle cx="4" cy="12" r="1.5" /><circle cx="20" cy="12" r="1.5" /></svg>,
  },
  {
    key: 'tiktok', name: 'TikTok', handle: '@vapor', url: 'https://www.tiktok.com/', color: '#25f4ee',
    icon: <svg viewBox="0 0 24 24" {...stroke}><path d="M14 3v11.5a3.5 3.5 0 11-3.5-3.5" /><path d="M14 3c.3 2.5 2 4.3 5 4.5" /></svg>,
  },
];

/* ------------------------------------------------------------------ */
/*  Columnas de enlaces                                                */
/* ------------------------------------------------------------------ */
const COLUMNS: { title: string; links: string[] }[] = [
  { title: 'Tienda', links: ['Destacados', 'Novedades', 'Más vendidos', 'Ofertas', 'Tarjetas de regalo'] },
  { title: 'Comunidad', links: ['Foros', 'Taller', 'Mercado', 'Guías', 'Eventos'] },
  { title: 'Soporte', links: ['Centro de ayuda', 'Reembolsos', 'Estado de la cuenta', 'Contactar'] },
  { title: 'Empresa', links: ['Acerca de Vapor', 'Empleos', 'Prensa', 'Distribución', 'Afiliados'] },
];

const LEGAL = ['Política de privacidad', 'Información legal', 'Acuerdo de suscriptor', 'Reembolsos', 'Cookies'];
const LANGS = ['Español', 'English', 'Português', 'Français', 'Deutsch', '日本語'];
const PAYMENTS = ['VISA', 'Mastercard', 'PayPal', 'Mercado Pago', 'Transferencia'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** <a> que no salta al inicio cuando href="#". Si usás react-router, cambialo por <Link>. */
function A({ href = '#', children, className, onClick }: { href?: string; children: ReactNode; className?: string; onClick?: () => void }) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (href === '#') e.preventDefault();
    onClick?.();
  };
  return <a href={href} className={className} onClick={handle}>{children}</a>;
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
export interface FooterProps {
  /** Cambiá las URLs de tus redes: { instagram: 'https://instagram.com/tumarca' } */
  socialUrls?: Partial<Record<SocialKey, string>>;
  /** Se llama al suscribirse al newsletter (podés conectar tu API acá) */
  onSubscribe?: (email: string) => void | Promise<void>;
}

export default function Footer({ socialUrls = {}, onSubscribe }: FooterProps) {
  /* newsletter */
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  /* idioma */
  const [lang, setLang] = useState<string>(() => {
    try { return localStorage.getItem('vapor-lang') || 'Español'; } catch { return 'Español'; }
  });
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  /* otros */
  const [showTop, setShowTop] = useState(false);
  const [online, setOnline] = useState(1284530);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  /* botón "volver arriba" */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* contador de jugadores en línea (datos de ejemplo) */
  useEffect(() => {
    const id = window.setInterval(() => setOnline(n => n + Math.round((Math.random() - 0.45) * 900)), 2500);
    return () => window.clearInterval(id);
  }, []);

  /* cerrar selector de idioma */
  useEffect(() => {
    const onDown = (e: globalThis.MouseEvent) => { if (!langRef.current?.contains(e.target as Node)) setLangOpen(false); };
    const onKey = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') setLangOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  const pickLang = (l: string) => {
    setLang(l);
    setLangOpen(false);
    try { localStorage.setItem('vapor-lang', l); } catch { /* sin storage */ }
    showToast(`Idioma: ${l}`);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!EMAIL_RE.test(v)) { setError('Ingresá un correo válido, por ejemplo nombre@mail.com'); return; }
    setError('');
    setSending(true);
    try {
      if (onSubscribe) await onSubscribe(v); else await new Promise(r => setTimeout(r, 900));
      setDone(true);
    } catch {
      setError('No pudimos suscribirte. Probá de nuevo en un momento.');
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="ft" aria-label="Pie de página">
      {/* ===== franja newsletter ===== */}
      <div className="ft-news">
        <div className="ft-wrap ft-news-in">
          <div className="ft-news-txt">
            <h3>No te pierdas ninguna oferta</h3>
            <p>Suscribite y recibí lanzamientos y descuentos en tu correo. Sin spam.</p>
          </div>

          {done ? (
            <div className="ft-ok" role="status">
              <svg viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="10" /><path d="M8 12.5l3 3 5-6" /></svg>
              ¡Listo! Te suscribimos con <b>{email.trim()}</b>
            </div>
          ) : (
            <form className="ft-form" onSubmit={submit} noValidate>
              <div className={`ft-field ${error ? 'ft-bad' : ''}`}>
                <input
                  type="email"
                  value={email}
                  placeholder="tu@correo.com"
                  aria-label="Correo electrónico"
                  aria-invalid={!!error}
                  aria-describedby="ft-err"
                  autoComplete="email"
                  onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                />
                <button type="submit" disabled={sending}>{sending ? 'Enviando…' : 'Suscribirme'}</button>
              </div>
              <p className="ft-err" id="ft-err" role="alert">{error}</p>
            </form>
          )}
        </div>
      </div>

      {/* ===== cuerpo ===== */}
      <div className="ft-main">
        <div className="ft-wrap ft-grid">
          <div className="ft-brand">
            <A href="#" className="ft-logo">
              <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="18" stroke="#66c0f4" strokeWidth="2" />
                <path d="M8 24c4-1 6 4 10 2s2-8 8-7 7 8 6 9" stroke="#c7d5e0" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="27" cy="13" r="4.5" fill="#66c0f4" />
                <circle cx="12" cy="27" r="3" fill="#c7d5e0" />
              </svg>
              <b>VAPOR</b>
            </A>
            <p className="ft-tag">Tu plataforma para descubrir, jugar y compartir.</p>

            <div className="ft-online" title="Datos de ejemplo">
              <i className="ft-pulse" />
              <span><b>{online.toLocaleString('es-AR')}</b> jugadores en línea</span>
            </div>

            <div className="ft-apps">
              <A href="#" className="ft-app" onClick={() => showToast('Descargando instalador… (demo)')}>
                <svg viewBox="0 0 24 24" {...stroke}><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
                <span><small>Descargar para</small>Escritorio</span>
              </A>
              <A href="#" className="ft-app" onClick={() => showToast('App móvil próximamente')}>
                <svg viewBox="0 0 24 24" {...stroke}><rect x="7" y="2" width="10" height="20" rx="2.5" /><path d="M11 18h2" /></svg>
                <span><small>Llevala en el</small>Celular</span>
              </A>
            </div>
          </div>

          {COLUMNS.map(col => (
            <nav className="ft-col" key={col.title} aria-label={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(l => <li key={l}><A href="#">{l}</A></li>)}
              </ul>
            </nav>
          ))}
        </div>

        {/* ===== redes sociales ===== */}
        <div className="ft-wrap ft-social-row">
          <div>
            <h4 className="ft-soc-title">Seguinos en redes</h4>
            <ul className="ft-social">
              {SOCIALS.map(s => (
                <li key={s.key}>
                  <a
                    href={socialUrls[s.key] ?? s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ft-soc"
                    style={{ '--c': s.color } as CSSProperties}
                    aria-label={`${s.name} (se abre en una pestaña nueva)`}
                  >
                    {s.icon}
                    <span className="ft-tip">{s.name}<small>{s.handle}</small></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="ft-side">
            <div className="ft-lang" ref={langRef}>
              <button
                className="ft-lang-btn"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                onClick={() => setLangOpen(o => !o)}
              >
                <svg viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>
                {lang}
                <svg className="ft-caret" viewBox="0 0 10 10" fill="currentColor"><path d="M1 3l4 4 4-4z" /></svg>
              </button>
              {langOpen && (
                <ul className="ft-lang-list" role="listbox">
                  {LANGS.map(l => (
                    <li key={l} role="option" aria-selected={l === lang}>
                      <button onClick={() => pickLang(l)}>{l}{l === lang && <span>✓</span>}</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <ul className="ft-pay" aria-label="Medios de pago">
              {PAYMENTS.map(p => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* ===== legal ===== */}
      <div className="ft-legal">
        <div className="ft-wrap ft-legal-in">
          <p>
            © {new Date().getFullYear()} Vapor Corp. Todos los derechos reservados. Todas las marcas pertenecen a sus respectivos dueños.
            Los precios incluyen impuestos donde corresponda. Proyecto de demostración.
          </p>
          <ul>
            {LEGAL.map(l => <li key={l}><A href="#">{l}</A></li>)}
          </ul>
        </div>
      </div>

      {/* ===== volver arriba + toast ===== */}
      <button
        className={`ft-top ${showTop ? 'ft-show' : ''}`}
        aria-label="Volver arriba"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg viewBox="0 0 24 24" {...stroke}><path d="M6 14l6-6 6 6" /></svg>
      </button>
      {toast && <div className="ft-toast" role="status">{toast}</div>}
    </footer>
  );
}