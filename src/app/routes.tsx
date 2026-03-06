import { useEffect, useRef, useState } from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router';
import { WireframeCamera } from './components/WireframeCamera';
import { WireframeScanner } from './components/WireframeScanner';
import { WireframeSonyCamera } from './components/WireframeSonyCamera';
import { WireframeDrone } from './components/WireframeDrone';
import { SectionOverlay } from './components/SectionOverlay';
import { SonyNextSection } from './components/SonyNextSection';
import { GlobalHeroNav } from './components/GlobalHeroNav';
import { FilmLayersScroll } from '../components/FilmLayersScroll/FilmLayersScroll';
import { IntroGate } from './components/IntroGate';
import { VerticalVideoScreen } from './components/VerticalVideoScreen';

function DigitalFilmPage() {
  const filmCameraSectionRef = useRef<HTMLDivElement>(null);
  const filmSectionRef = useRef<HTMLDivElement>(null);
  const filmLayersSectionRef = useRef<HTMLDivElement>(null);
  const [inFilmCameraSection, setInFilmCameraSection] = useState(false);
  const [inFilmSection, setInFilmSection] = useState(false);
  const [inFilmLayersSection, setInFilmLayersSection] = useState(false);

  useEffect(() => {
    const check = () => {
      const scrollY = window.scrollY;
      const cameraTop = filmCameraSectionRef.current?.offsetTop ?? Number.MAX_SAFE_INTEGER;
      const scanTop = filmSectionRef.current?.offsetTop ?? Number.MAX_SAFE_INTEGER;
      const layersTop = filmLayersSectionRef.current?.offsetTop ?? Number.MAX_SAFE_INTEGER;

      setInFilmCameraSection(scrollY >= cameraTop && scrollY < scanTop);
      if (filmSectionRef.current) {
        setInFilmSection(scrollY >= scanTop && scrollY < layersTop);
      }
      if (filmLayersSectionRef.current) {
        setInFilmLayersSection(scrollY >= layersTop);
      }
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    return () => window.removeEventListener('scroll', check);
  }, []);

  return (
    <>
      <div id="film-bento-top">
        <IntroGate />
      </div>
      <div id="film-camera-top" ref={filmCameraSectionRef} className="pipeline-stage">
        <WireframeCamera />
        <div style={{ opacity: inFilmCameraSection ? 1 : 0, pointerEvents: inFilmCameraSection ? 'auto' : 'none', transition: 'opacity 300ms ease' }}>
          <SectionOverlay
            sectionTitle="Analog Capture"
            subtitle="Capture and manual film development using a Canon AE-1 Program."
            body="The capture stage begins with selecting the appropriate lens and film stock for the scene. Lens kit: Canon 28mm, Canon 50mm, and Sigma 70–210mm. Preferred film stock: Fujifilm ISO 400, with additional brands used when needed."
            bodySecondary="After exposure, the film is manually developed using traditional darkroom techniques. Chemical processing is handled personally under controlled temperature and light conditions to ensure consistent results."
            bodyPairBottom
            className="scene-overlay--film-camera"
          />
        </div>
      </div>
      <div ref={filmSectionRef} id="film-inline" className="pipeline-stage">
        <WireframeScanner />
        <div style={{ opacity: inFilmSection ? 1 : 0, pointerEvents: inFilmSection ? 'auto' : 'none', transition: 'opacity 300ms ease' }}>
          <SectionOverlay
            sectionTitle="Scan"
            subtitle="Negative to editable data, scanned frame by frame."
            body="After development, the physical negative is placed into a film holder and scanned on a Plustek OpticFilm 8300i. This step converts the image from analog material into a high-resolution digital file ready for editing. During scanning, I apply basic pre-adjustments—exposure, color balance, and grain—to establish a clean starting point before the main edit."
            bodyBottomCenter
            bodyIndex="03"
            className="scene-overlay--scan scene-overlay--film-scan"
          />
        </div>
      </div>
      <div ref={filmLayersSectionRef} id="film-layers-inline" className="pipeline-stage">
        <FilmLayersScroll cardScale={2} pinDurationVh={400} gapScale={0.65} />
        <div style={{ opacity: inFilmLayersSection ? 1 : 0, pointerEvents: inFilmLayersSection ? 'auto' : 'none', transition: 'opacity 300ms ease' }}>
          <SectionOverlay
            sectionTitle="Edit + Post-Edit"
            subtitle="From raw scan to film-faithful futures."
            body="Starting from the scanner output, I correct structure first (crop, straighten, rotate), then refine light and color to preserve the film character. The final pass is intervention: AI-assisted compositing in Photoshop to introduce futuristic elements while keeping the original analog texture intact."
            bodyBottomCenter
            bodyIndex="04"
            className="scene-overlay--wide scene-overlay--film-layers"
          />
        </div>
      </div>
      <button
        type="button"
        className={`pipeline-back-top ${inFilmLayersSection ? 'is-visible' : ''}`}
        onClick={() => {
          document.getElementById('film-bento-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        ↑ Back To Top
      </button>
    </>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="w-full min-h-screen relative" style={{ background: '#000000' }}>
      <GlobalHeroNav />
      {children}
    </div>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/sony" replace />,
    },
    {
      path: '/camera',
      element: (
        <Layout>
          <DigitalFilmPage />
        </Layout>
      ),
    },
    {
      path: '/scanner',
      element: (
        <Layout>
          <div id="film-placeholder" style={{ height: '100vh' }} />
        </Layout>
      ),
    },
    {
      path: '/about',
      element: (
        <Layout>
          <div className="sony-home-stage sony-home-stage--about">
            <WireframeSonyCamera disableScrollAnimationOnMobile />
            <SectionOverlay home noFade />
            <div className="about-contact-section">
              <p className="about-contact-section__title">Contact</p>
              <nav className="about-contact" aria-label="Contact">
                <a href="mailto:juliocoraspe@gmail.com" className="about-contact__link">E Mail</a>
                <span className="about-contact__divider" aria-hidden="true" />
                <a href="https://www.linkedin.com/in/juliocoraspe/" target="_blank" rel="noopener noreferrer" className="about-contact__link">LinkedIn</a>
                <span className="about-contact__divider" aria-hidden="true" />
                <a href="tel:+13236402351" className="about-contact__link">Phone Number</a>
                <span className="about-contact__divider" aria-hidden="true" />
                <a href="https://juliocoraspe.github.io/UXUIDesignPortfolio/" target="_blank" rel="noopener noreferrer" className="about-contact__link">UX/UI Portfolio</a>
              </nav>
            </div>
          </div>
        </Layout>
      ),
    },
    {
      path: '/sony',
      element: (
        <Layout>
          <SonyNextSection standalone />
        </Layout>
      ),
    },
    {
      path: '/film-layers',
      element: (
        <Layout>
          <VerticalVideoScreen />
        </Layout>
      ),
    },
    {
      path: '/drone',
      element: (
        <Layout>
          <WireframeDrone />
          <SectionOverlay
            sectionTitle="Drone Videography"
            subtitle="Aerial cinematography focused on trajectory, altitude, and spatial storytelling."
            body="Drone videography is my way of exploring perspective—pulling back from the scene to reveal new scale, rhythm, and context. I shoot with a DJI FPV, then refine the footage through editing and color grading to shape the final tone."
            bodyBottomCenter
            className="scene-overlay--drone"
          />
        </Layout>
      ),
    },
  ],
  { basename: import.meta.env.BASE_URL }
);
