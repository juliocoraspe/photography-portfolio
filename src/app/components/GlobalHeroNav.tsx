import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const menuItems = [
  { index: '01.', label: 'Digital Photography', path: '/sony', scrollTo: 'sony-next-section' },
  { index: '02.', label: 'Film Photography', path: '/camera', scrollTo: 'film-bento-top' },
  { index: '03.', label: 'Drone Videography', path: '/drone' },
  { index: '04.', label: 'Vertical Video for Social Media', path: '/film-layers' },
];

export function GlobalHeroNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeItem = menuItems.find((item) => item.path === location.pathname);
  const currentLabel =
    location.pathname === '/about'
      ? 'About'
      : location.pathname === '/scanner'
        ? 'Film Photography'
        : activeItem?.label ?? 'Current Section';

  const navigateTo = (path: string, scrollTo?: string) => {
    const scrollToTarget = () => {
      if (scrollTo) {
        const el = document.getElementById(scrollTo);
        if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (location.pathname !== path) {
      navigate(path);
      setTimeout(scrollToTarget, 50);
    } else {
      scrollToTarget();
    }

    setMobileOpen(false);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="global-hero-nav-layer" aria-label="Global navigation">
      <div className="nav-topbar">
        <button
          type="button"
          className={`nav-profile-icon ${location.pathname === '/about' ? 'is-active' : ''}`}
          onClick={() => navigateTo('/about')}
          aria-label="About"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="7" r="3.5" />
            <path d="M2.5 18c0-4.142 3.358-7.5 7.5-7.5s7.5 3.358 7.5 7.5" />
          </svg>
        </button>
        <div className="nav-current-label" aria-live="polite">
          <span className="type-micro nav-current-label__text">{currentLabel}</span>
        </div>
        <button
          type="button"
          className={`nav-hamburger ${mobileOpen ? 'is-open' : ''}`}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <div
        className="hero-grid hero-grid--global"
        role="navigation"
      >
        {menuItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`hero-grid__item ${location.pathname === item.path ? 'is-active' : ''}`}
            onClick={() => navigateTo(item.path, item.scrollTo)}
          >
            <span className="type-micro hero-grid__label">
              {item.index} — {item.label}
            </span>
          </button>
        ))}
      </div>
      <div className={`mobile-nav-menu ${mobileOpen ? 'is-open' : ''}`} role="navigation" aria-label="Mobile navigation">
        {menuItems.map((item) => (
          <button
            key={`mobile-${item.path}`}
            type="button"
            className={`mobile-nav-menu__item ${location.pathname === item.path ? 'is-active' : ''}`}
            onClick={() => navigateTo(item.path, item.scrollTo)}
          >
            <span className="type-micro">{String(parseInt(item.index, 10))} — {item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
