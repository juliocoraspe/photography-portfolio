import { useEffect, useRef, useState } from "react";

const DRONE_VIDEOS = [
  "/photography-portfolio/videos/drone.mov",
  "/photography-portfolio/videos/vid 2.mov",
  "/photography-portfolio/videos/vid 3.mov",
] as const;

function DroneVideoCard({
  src, cardClass, videoRef, isPlaying, onPlay,
}: {
  src: string;
  cardClass: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const [ctrlVisible, setCtrlVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showControls = () => {
    setCtrlVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCtrlVisible(false), 2000);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); onPlay(); }
    else { v.pause(); onPlay(); }
    showControls();
  };

  const openFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (v?.requestFullscreen) v.requestFullscreen();
  };

  return (
    <div className={`drone-video-card ${cardClass}`} onClick={showControls}>
      <video ref={videoRef} className="drone-card-video" src={src} loop playsInline />
      <div className={`drone-card-controls${ctrlVisible ? " is-visible" : ""}`}>
        <button className="drone-card-play" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="3.5" height="12" rx="1" fill="white"/><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="white"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2.5l9 5.5-9 5.5V2.5z" fill="white"/></svg>
          )}
        </button>
        <button className="drone-card-fullscreen" onClick={openFullscreen} aria-label="Open fullscreen">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 4.5V1h3.5M7.5 1H11v3.5M11 7.5V11H7.5M4.5 11H1V7.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

// ── Timing constants (ms) ───────────────────────────────────────────
const ANIM_START_DELAY  = 150;   // pause before anything starts
const DROPS_VISIBLE_END = 380;   // drops start fading
const DROPS_FADE_DUR    = 120;   // fade-out duration
const GRID_DURATION     = 750;   // grid flatten total duration
const CARDS_THRESHOLD   = 0.8;   // gridFlattenProgress that triggers cards
const GROUND_FADE_PX    = 110;   // px above ground line where drops fade out

const DROP_COUNT = 8;

interface Drop {
  x: number;
  length: number;
  speed: number;         // px/ms — fast
  phaseOffset: number;   // 0–1: initial position fraction of groundY
  opacity: number;
}

function createDrops(vw: number): Drop[] {
  const h = (n: number) => Math.abs(Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1;
  return Array.from({ length: DROP_COUNT }, (_, i) => ({
    x:           h(i * 3.1 + 0.5) * vw,
    length:      40 + h(i * 5.7) * 80,          // 40–120 px
    speed:       1.5 + h(i * 7.3) * 1.5,         // 1.5–3.0 px/ms
    phaseOffset: h(i * 13.7),                     // spread across height
    opacity:     0.18 + h(i * 11.1) * 0.48,      // 0.18–0.66
  }));
}

export function WireframeDrone() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const animRef       = useRef<number>(0);
  const startTimeRef  = useRef<number | null>(null);
  const cardsFiredRef = useRef(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let drops = createDrops(window.innerWidth);

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = createDrops(window.innerWidth);
    };
    resize();
    window.addEventListener("resize", resize);

    // ── helpers ─────────────────────────────────────────────────
    const easeInOutSine = (v: number) => -(Math.cos(Math.PI * v) - 1) / 2;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const clamp01 = (v: number, s: number, e: number) => {
      if (v <= s) return 0;
      if (v >= e) return 1;
      return (v - s) / (e - s);
    };

    // ── main draw loop ───────────────────────────────────────────
    const draw = (now: number) => {
      if (!canvas || !ctx) return;
      if (startTimeRef.current === null) startTimeRef.current = now;

      const elapsed     = now - startTimeRef.current;
      const animElapsed = Math.max(0, elapsed - ANIM_START_DELAY);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX     = canvas.width  * 0.5;
      const isMobile    = canvas.width <= 768;
      const gridCenterY = canvas.height * (isMobile ? 0.9 : 0.83);

      // ── ground / grid animation (identical visuals to before) ──
      const gridFlattenProgress = easeInOutSine(clamp01(animElapsed, 0, GRID_DURATION));
      const finalLineProgress   = easeInOutSine(clamp01(gridFlattenProgress, 0.72, 1));
      const gridTilt            = lerp(Math.PI / 14, 0, gridFlattenProgress);
      const gridNearHalfWidth   = lerp(Math.min(canvas.width * 0.17, 280), canvas.width * 0.48, finalLineProgress);
      const gridFarHalfWidth    = lerp(Math.min(canvas.width * 0.12, 190), canvas.width * 0.48, finalLineProgress);
      const gridDepth           = lerp(200, 0, gridFlattenProgress);
      const gridPerspective     = 1200;
      const gridOpacity         = 0.7 * (1 - finalLineProgress);
      const lineOpacity         = lerp(0.85 * finalLineProgress, 0.9, clamp01(gridFlattenProgress, 0.72, 1));

      const projectGrid = (xNorm: number, zNorm: number) => {
        const zWorld    = zNorm * gridDepth;
        const yRotated  = -zWorld * Math.sin(gridTilt);
        const zRotated  = zWorld  * Math.cos(gridTilt);
        const halfWidth = lerp(gridNearHalfWidth, gridFarHalfWidth, (zNorm + 1) * 0.5);
        const ps        = gridPerspective / (gridPerspective + zRotated);
        return { x: centerX + xNorm * halfWidth * ps, y: gridCenterY + yRotated * ps };
      };

      if (gridOpacity > 0.01) {
        ctx.lineWidth = 1.5;
        ctx.lineCap   = "round";
        ctx.lineJoin  = "round";

        for (let xi = 0; xi < 9; xi++) {
          const xn    = (xi / 8) * 2 - 1;
          const alpha = gridOpacity * Math.pow(1 - Math.abs(xn), 1.35) * 0.75;
          if (alpha <= 0.01) continue;
          const s = projectGrid(xn, -1);
          const e = projectGrid(xn,  1);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(e.x, e.y); ctx.stroke();
        }
        for (let zi = 0; zi < 7; zi++) {
          const zn    = (zi / 6) * 2 - 1;
          const alpha = gridOpacity * Math.pow(1 - Math.abs(zn), 1.2);
          if (alpha <= 0.01) continue;
          const s = projectGrid(-1, zn);
          const e = projectGrid( 1, zn);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(e.x, e.y); ctx.stroke();
        }
      }

      if (lineOpacity > 0.01) {
        const lineInset = lerp(Math.min(canvas.width * 0.24, 280), Math.max(canvas.width * 0.085, 72), finalLineProgress);
        ctx.strokeStyle = `rgba(255,255,255,${lineOpacity})`;
        ctx.lineWidth   = 1.5;
        ctx.lineCap     = "round";
        ctx.beginPath();
        ctx.moveTo(lineInset, gridCenterY);
        ctx.lineTo(canvas.width - lineInset, gridCenterY);
        ctx.stroke();
      }

      // ── falling motion drops (loop, fade before ground) ────────
      const dropPhaseEnd = DROPS_VISIBLE_END + DROPS_FADE_DUR;
      if (animElapsed < dropPhaseEnd) {
        const globalFadeOut = clamp01(animElapsed, DROPS_VISIBLE_END, dropPhaseEnd);

        ctx.lineWidth = 1;
        ctx.lineCap   = "round";

        drops.forEach((drop) => {
          // One-shot position: each drop travels upward once from its starting point
          const travelLength = gridCenterY + drop.length;
          const initialPos   = drop.phaseOffset * travelLength;
          const elapsed      = animElapsed * drop.speed + initialPos;
          const yTop         = gridCenterY - elapsed;
          const yBottom      = yTop + drop.length;

          // Clip to visible screen area
          if (yBottom < 0 || yTop > gridCenterY) return;

          // Fade out as drop approaches ground line
          const groundFade = clamp01(yBottom, gridCenterY - GROUND_FADE_PX, gridCenterY);
          const alpha      = drop.opacity * (1 - groundFade) * (1 - globalFadeOut);
          if (alpha <= 0.01) return;

          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(drop.x, Math.max(0, yTop));
          ctx.lineTo(drop.x, Math.min(gridCenterY, yBottom));
          ctx.stroke();
        });
      }

      // ── trigger cards once grid is sufficiently flat ─────────
      if (gridFlattenProgress >= CARDS_THRESHOLD && !cardsFiredRef.current) {
        cardsFiredRef.current = true;
        setCardsVisible(true);
      }

      // ── loop until animation is complete ─────────────────────
      if (animElapsed < GRID_DURATION + 200) {
        animRef.current = requestAnimationFrame(draw);
      }
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ height: "100vh" }} className="relative wireframe-drone-stage">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-screen"
        style={{ background: "#000000" }}
      />
      <div className={`drone-media-ui ${cardsVisible ? "is-visible" : ""}`} aria-hidden={!cardsVisible}>
        <div className="drone-rec-indicator type-micro">REC</div>
        <div className="drone-video-cards">
          {DRONE_VIDEOS.map((src, i) => (
            <DroneVideoCard
              key={i}
              src={src}
              cardClass={`drone-video-card--${i + 1}`}
              videoRef={videoRefs[i]}
              isPlaying={playingIndex === i}
              onPlay={() => {
                const v = videoRefs[i].current;
                if (!v) return;
                if (!v.paused) {
                  // This card just started playing — pause all others
                  videoRefs.forEach((ref, j) => {
                    if (j !== i && ref.current) { ref.current.pause(); }
                  });
                  setPlayingIndex(i);
                } else {
                  setPlayingIndex(null);
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
