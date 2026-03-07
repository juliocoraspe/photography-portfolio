import { useEffect, useRef, useState } from 'react';
import styles from './IntroGate.module.css';
import imgH1 from '../../images/granja 9.JPG';
import imgH2 from '../../images/nieve 13.JPG';
import imgH3 from '../../images/sin nombre_5 (2).jpg';
import imgH4 from '../../images/barvin9.jpeg';
import imgV4 from '../../images/1.jpeg';
import imgV1 from '../../images/IMG_9961.jpg';
import imgV2 from '../../images/IMG_9965.JPG';
import imgV3 from '../../images/focofoco 5.jpg';

/* ── Canvas dot grid — true dots with imperfect random fade ──── */
function DottedGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Stable pseudo-random based on grid position (sine hash)
    const hash = (n: number) => Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1;
    const hash2 = (n: number) => Math.abs(Math.sin(n * 269.5 + 183.3) * 43758.5453) % 1;
    // Low-frequency patch noise: groups of cells share a regional fade
    const patchNoise = (col: number, row: number) =>
      Math.abs(Math.sin((Math.floor(col / 5) * 100 + Math.floor(row / 5)) * 37.3 + 91.7));

    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const spacing = 26;
      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;

      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          const seed = c * 1031 + r;
          const h1 = hash(seed);
          const h2 = hash2(seed);
          const patch = patchNoise(c, r);

          // Drop threshold increases in "dark patch" areas
          const dropThreshold = 0.28 + patch * 0.30;
          if (h1 < dropThreshold) continue;

          // Opacity: base range 0.06–0.17, further dimmed by patch
          const opacity = (0.06 + h2 * 0.11) * (1 - patch * 0.55);
          if (opacity < 0.02) continue;

          // Slight jitter so dots don't fall on a perfect grid
          const jitter = spacing * 0.14;
          const x = c * spacing + (hash(seed + 0.3) - 0.5) * jitter;
          const y = r * spacing + (hash2(seed + 0.7) - 0.5) * jitter;

          ctx.beginPath();
          ctx.arc(x, y, 0.85, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
          ctx.fill();
        }
      }
    };

    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  return <canvas ref={canvasRef} className={styles.grid} aria-hidden="true" />;
}

/* ── Viewfinder corners on gate container ────────────────────── */
function ViewfinderCorners() {
  return (
    <>
      <span className={styles.vfTL} aria-hidden="true" />
      <span className={styles.vfTR} aria-hidden="true" />
      <span className={styles.vfBL} aria-hidden="true" />
      <span className={styles.vfBR} aria-hidden="true" />
    </>
  );
}

/* ── Card definitions — random develop timing per card ────────── */
// delay (ms) and duration (ms) chosen to feel like film developing at uneven rates
const CARDS: { cls: string; delay: number; dur: number; img?: string }[] = [
  { cls: styles.cardV1, delay: 320,  dur: 1400, img: imgV1 },
  { cls: styles.cardH1, delay: 80,   dur: 1900, img: imgH1 },
  { cls: styles.cardV2, delay: 650,  dur: 1100, img: imgV2 },
  { cls: styles.cardH2, delay: 1100, dur: 2200, img: imgH2 },
  { cls: styles.cardH3, delay: 200,  dur: 1700, img: imgH3 },
  { cls: styles.cardV3, delay: 900,  dur: 1300, img: imgV3 },
  { cls: styles.cardH4, delay: 1400, dur: 960,  img: imgH4 },
  { cls: styles.cardV4, delay: 560,  dur: 2400, img: imgV4 },
];

/* ── IntroGate ────────────────────────────────────────────────── */
export function IntroGate() {
  const [activeImg, setActiveImg] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveImg(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const stopEvent = (
    e: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const swallowPointer = (e: React.PointerEvent<HTMLElement>) => {
    e.stopPropagation();
  };

  const closeLightbox = (
    e?: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>
  ) => {
    if (e) {
      stopEvent(e);
    }
    setActiveImg(null);
  };

  return (
    <section className={`${styles.gate} ${activeImg ? styles.gateModalOpen : ''}`}>
      <DottedGrid />

      <div className={styles.titleArea}>
        <h2 className={`type-section ${styles.gateTitle}`}>Analog Character</h2>
        <p className={`type-subtitle ${styles.gateSubtitle}`}>Shot on a Canon AE-1 Program with a Sakar 28mm, Canon 50mm, and Sigma 70–210mm.</p>
        <p className={`type-body ${styles.gateBody}`}>Film photography gives me a visual language that digital doesn&apos;t fully replicate. Grain, color shifts, and subtle imperfections create a texture that feels physical rather than purely digital.</p>
        <p className={`type-body ${styles.gateBody}`}>The slower process also changes how images are made. Each frame is intentional, and the results only appear after the roll is developed. That delay encourages patience, observation, and careful composition.</p>
      </div>

      {/* Bento puzzle layout — corners sit outside the grid */}
      <div className={styles.bentoWrapper}>
        <ViewfinderCorners />
        <div className={styles.bento}>
        {CARDS.map(({ cls, delay, dur, img }, i) => (
          <div
            key={i}
            className={`${styles.card} ${cls}`}
            style={{
              '--card-delay': `${delay}ms`,
              '--card-dur': `${dur}ms`,
            } as React.CSSProperties}
            onClick={() => { if (img) setActiveImg(img); }}
          >
            {img && <img src={img} alt="" aria-hidden="true" draggable={false} className={styles.cardImage} />}
          </div>
        ))}
        </div>
      </div>

      <p className={styles.cta} aria-hidden="true">
        View the Film Pipeline ↓
      </p>

      {activeImg && (
        <div
          className={styles.lightbox}
          onPointerDown={swallowPointer}
          onClick={closeLightbox}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onPointerDown={swallowPointer}
            onClick={closeLightbox}
            aria-label="Close"
          >
            ✕
          </button>
          <img
            src={activeImg}
            alt=""
            className={styles.lightboxImg}
            onPointerDown={swallowPointer}
            onClick={stopEvent}
            draggable={false}
          />
        </div>
      )}
    </section>
  );
}
