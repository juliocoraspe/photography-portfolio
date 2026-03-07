import { useEffect, useRef, useState } from 'react';
import styles from './VerticalVideoScreen.module.css';

const CLIP_VIDEOS = [
  '/photography-portfolio/videos/copy_0DB074FA-5E0B-4F53-96F2-E53B443AF1AA.MOV',
  '/photography-portfolio/videos/copy_742D7BC1-C1B3-490B-8E20-F5263C6C33B8.MOV',
  '/photography-portfolio/videos/4119F723-5AD2-49B5-B998-D7B2EB31FC0B.mov',
  '/photography-portfolio/videos/6FC18A4A-0A13-4352-9896-6E4434A581E4.MP4',
] as const;

const specItems = [
  'Short-form storytelling — Narrative structuring optimized for high-retention vertical video.',
  'Vertical-first editing workflows — Efficient pipelines tailored for 9:16 content.',
  'Audience retention mechanics — Hooks, pacing strategies, and loop-based storytelling.',
  'Platform-aware composition — Framing designed for social UI overlays and safe zones.',
  'High-velocity editing & pacing — Dynamic rhythm, jump cuts, motion-driven sequencing.',
  'Cross-platform optimization — Adapted for TikTok, Instagram Reels, and YouTube Shorts.',
];

const clipLabels = ['Clip 01', 'Clip 02', 'Clip 03', 'Clip 04'];

function LikeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 5h16v10H8l-4 4V5z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M15 8l5-5M20 3h-4M20 3v4" />
      <path d="M20 14v6H4V4h6" />
    </svg>
  );
}

function VerticalVideoCard({
  label, src, index, videoRef, isPlaying, onPlay,
}: {
  label: string;
  src: string;
  index: number;
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
    <article
      className={styles.videoCard}
      style={{ ['--card-delay' as string]: `${index * 120}ms` }}
      aria-label={label}
      onClick={showControls}
    >
      <video ref={videoRef} className={styles.cardVideo} src={src} loop playsInline />
      <div className={`${styles.cardControls}${ctrlVisible ? ` ${styles.visible}` : ''}`}>
        <button className={styles.cardPlay} onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="3.5" height="12" rx="1" fill="white"/><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="white"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2.5l9 5.5-9 5.5V2.5z" fill="white"/></svg>
          )}
        </button>
        <button className={styles.cardFullscreen} onClick={openFullscreen} aria-label="Open fullscreen">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 4.5V1h3.5M7.5 1H11v3.5M11 7.5V11H7.5M4.5 11H1V7.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className={styles.cardContent}>
        <p className={`type-micro ${styles.clipLabel}`}>{label}</p>
        <div className={styles.cardMeta}>
          <button className={styles.metaAction} type="button" aria-label={`${label} like`}><LikeIcon /></button>
          <button className={styles.metaAction} type="button" aria-label={`${label} comment`}><CommentIcon /></button>
          <button className={styles.metaAction} type="button" aria-label={`${label} share`}><ShareIcon /></button>
        </div>
      </div>
    </article>
  );
}

export function VerticalVideoScreen() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const videoRefs = [
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
    useRef<HTMLVideoElement>(null),
  ];

  return (
    <section className={styles.screen} aria-label="Vertical Video for Social Media">
      <div className={styles.copy}>
        <h1 className={`type-section ${styles.title}`}>Attention Mechanics</h1>
        <p className={`type-subtitle ${styles.subtitle}`}>
          9:16 production workflow built for retention, rhythm, and platform-native viewing.
        </p>
      </div>

      <div className={styles.centerStage}>
        <div className={styles.cardsRow}>
          {clipLabels.map((label, index) => (
            <VerticalVideoCard
              key={label}
              label={label}
              src={CLIP_VIDEOS[index]}
              index={index}
              videoRef={videoRefs[index]}
              isPlaying={playingIndex === index}
              onPlay={() => {
                const v = videoRefs[index].current;
                if (!v) return;
                if (!v.paused) {
                  videoRefs.forEach((ref, j) => { if (j !== index && ref.current) ref.current.pause(); });
                  setPlayingIndex(index);
                } else {
                  setPlayingIndex(null);
                }
              }}
            />
          ))}
        </div>
      </div>

      <aside className={styles.specPanel} aria-label="Vertical video technical specifications">
        <div className={styles.specGrid}>
          <ul className={styles.specList}>
            {specItems.slice(0, 3).map((item) => (
              <li key={item} className={`type-body ${styles.specItem}`}>{item}</li>
            ))}
          </ul>
          <ul className={styles.specList}>
            {specItems.slice(3).map((item) => (
              <li key={item} className={`type-body ${styles.specItem}`}>{item}</li>
            ))}
          </ul>
        </div>
      </aside>
    </section>
  );
}
