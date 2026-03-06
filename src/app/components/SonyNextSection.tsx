import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import sonyImg1 from '../../images/IMG_3832.JPG';
import sonyImg2 from '../../images/DSC00738.JPG';
import sonyImg3 from '../../images/DSC00735.JPG';
import sonyImg4 from '../../images/IMG_3625.jpeg';

const containerCount = 12;

// null = no image; assign the 4 images to cards 0, 2, 5, 7
const CARD_IMAGES: (string | null)[] = [
  sonyImg1 as unknown as string,
  null,
  sonyImg2 as unknown as string,
  null,
  null,
  sonyImg3 as unknown as string,
  null,
  sonyImg4 as unknown as string,
  // row 3 — no images yet
  null,
  null,
  null,
  null,
];

// Per-card nudge offsets — varied directions so fills rest at different positions within each cell
const CARD_NUDGES: { x: string; y: string }[] = [
  { x: '-6%', y: '-8%' },
  { x:  '5%', y: '-12%' },
  { x: '-4%', y:  '9%' },
  { x:  '8%', y: '-5%' },
  { x: '-2%', y: '-9%' },
  { x: '-8%', y: '16%' },
  { x:  '3%', y:  '8%' },
  { x: '-7%', y: '-4%' },
  // row 3
  { x:  '6%', y:  '7%' },
  { x: '-5%', y: '-11%' },
  { x:  '9%', y:  '4%' },
  { x: '-3%', y: '-7%' },
];

export function SonyNextSection({ standalone = false }: { standalone?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(standalone);
  const [columns, setColumns] = useState(4);
  const [activeImg, setActiveImg] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveImg(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) {
        setColumns(1);
        return;
      }

      if (window.innerWidth < 1080) {
        setColumns(2);
        return;
      }

      setColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useEffect(() => {
    if (standalone) {
      setIsVisible(true);
      return;
    }

    const sectionNode = sectionRef.current;
    if (!sectionNode) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Latch visible once entered to avoid disappearing cards on minor scroll/layout shifts.
        if (entry.isIntersecting || entry.intersectionRatio > 0.12) {
          setIsVisible(true);
        }
      },
      { threshold: 0.32, rootMargin: '0px 0px -12% 0px' }
    );

    observer.observe(sectionNode);

    return () => observer.disconnect();
  }, [standalone]);

  const gap = columns === 4 ? 18 : columns === 2 ? 14 : 12;
  const rows = Math.ceil(containerCount / columns);

  const verticalGuideStyles = useMemo(
    () =>
      Array.from({ length: Math.max(columns - 1, 0) }, (_, index) => ({
        left: `calc(((100% - ${(columns - 1) * gap}px) / ${columns}) * ${index + 1} + ${(index + 0.5) * gap}px)`,
      })),
    [columns, gap]
  );

  const horizontalGuideStyles = useMemo(
    () =>
      Array.from({ length: Math.max(rows - 1, 0) }, (_, index) => ({
        top: `calc(((100% - ${(rows - 1) * gap}px) / ${rows}) * ${index + 1} + ${(index + 0.5) * gap}px)`,
      })),
    [rows, gap]
  );

  return (
    <>
    <section
      ref={sectionRef}
      id="sony-next-section"
      className={`sony-next ${isVisible ? 'is-visible' : ''} ${standalone ? 'sony-next--standalone' : ''}`}
      aria-label="Sony section details and vertical video container layout"
    >
      <div className="sony-next__inner">
        <div className="sony-next__copy">
<h2 className="type-section sony-next__title">Sony A7CR System</h2>
          <p className="type-subtitle sony-next__subtitle">
            Compact full-frame setup for digital portrait, lifestyle, and editorial production.
          </p>
          <p className="type-body sony-next__body">
            Hybrid workflow built for speed: fast capture, calibrated grading, and consistent delivery across stills and social formats.
          </p>
        </div>

        <div className="sony-next__grid-shell">
          <div className="sony-next__guides" aria-hidden="true">
            {verticalGuideStyles.map((style, index) => (
              <span key={`v-${index}`} className="sony-next__guide sony-next__guide--v" style={style} />
            ))}
            {horizontalGuideStyles.map((style, index) => (
              <span key={`h-${index}`} className="sony-next__guide sony-next__guide--h" style={style} />
            ))}
          </div>

          <div
            className="sony-next__grid"
            style={
              {
                '--grid-gap': `${gap}px`,
                '--grid-columns': columns,
              } as CSSProperties
            }
          >
            {Array.from({ length: containerCount }, (_, index) => {
              const col = index % columns;
              const row = Math.floor(index / columns);
              const orderFromRight = row * columns + (columns - 1 - col);
              const pairRank = Math.floor(orderFromRight / 2);

              return (
                <a
                  key={index}
                  href={`#sony-grid-item-${index + 1}`}
                  className="sony-next__card"
                  aria-label={`Open Sony content container ${index + 1}`}
                  style={{
                    '--delay': `${pairRank * 160}ms`,
                    '--nudge-x': CARD_NUDGES[index % CARD_NUDGES.length].x,
                    '--nudge-y': CARD_NUDGES[index % CARD_NUDGES.length].y,
                    cursor: CARD_IMAGES[index] ? 'pointer' : 'default',
                  } as CSSProperties}
                  onClick={(e) => { if (CARD_IMAGES[index]) { e.preventDefault(); setActiveImg(CARD_IMAGES[index]); } }}
                >
                  {CARD_IMAGES[index] ? (
                    <img src={CARD_IMAGES[index]!} alt="" aria-hidden="true" className="sony-next__card-img" />
                  ) : (
                    <span className="sony-next__card-fill" />
                  )}
                  <span className="sony-next__card-guide sony-next__card-guide--top" />
                  <span className="sony-next__card-guide sony-next__card-guide--right" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

    </section>

      {activeImg && (
        <div className="sony-next__lightbox" onClick={() => setActiveImg(null)}>
          <button className="sony-next__lightbox-close" onClick={() => setActiveImg(null)} aria-label="Close">✕</button>
          <img src={activeImg} alt="" className="sony-next__lightbox-img" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
