import { Link, useLocation } from 'react-router';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-8 py-6">
      <Link
        to="/camera"
        className="text-white text-sm tracking-wider uppercase transition-opacity"
        style={{
          opacity: location.pathname === '/camera' ? 1 : 0.5,
          textDecoration: 'none',
        }}
      >
        Canon AE-1
      </Link>
      <span className="text-white" style={{ opacity: 0.3 }}>|</span>
      <Link
        to="/scanner"
        className="text-white text-sm tracking-wider uppercase transition-opacity"
        style={{
          opacity: location.pathname === '/scanner' ? 1 : 0.5,
          textDecoration: 'none',
        }}
      >
        Plustek 8300
      </Link>
      <span className="text-white" style={{ opacity: 0.3 }}>|</span>
      <Link
        to="/sony"
        className="text-white text-sm tracking-wider uppercase transition-opacity"
        style={{
          opacity: location.pathname === '/sony' ? 1 : 0.5,
          textDecoration: 'none',
        }}
      >
        Sony A7CR
      </Link>
      <span className="text-white" style={{ opacity: 0.3 }}>|</span>
      <Link
        to="/drone"
        className="text-white text-sm tracking-wider uppercase transition-opacity"
        style={{
          opacity: location.pathname === '/drone' ? 1 : 0.5,
          textDecoration: 'none',
        }}
      >
        DJI FPV
      </Link>
    </nav>
  );
}