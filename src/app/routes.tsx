import { createBrowserRouter, Navigate } from 'react-router';
import { WireframeCamera } from './components/WireframeCamera';
import { WireframeScanner } from './components/WireframeScanner';
import { WireframeSonyCamera } from './components/WireframeSonyCamera';
import { WireframeDrone } from './components/WireframeDrone';
import { Navigation } from './components/Navigation';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen" style={{ background: '#000000' }}>
      <Navigation />
      {children}
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/camera" replace />,
  },
  {
    path: '/camera',
    element: (
      <Layout>
        <WireframeCamera />
      </Layout>
    ),
  },
  {
    path: '/scanner',
    element: (
      <Layout>
        <WireframeScanner />
      </Layout>
    ),
  },
  {
    path: '/sony',
    element: (
      <Layout>
        <WireframeSonyCamera />
      </Layout>
    ),
  },
  {
    path: '/drone',
    element: (
      <Layout>
        <WireframeDrone />
      </Layout>
    ),
  },
]);