import { CSSProperties, useMemo, useRef, useState, useEffect } from 'react';
import { MotionValue, motion, useMotionTemplate, useScroll, useTransform } from 'motion/react';
import styles from './FilmLayersScroll.module.css';
import filmRaw1 from '../../images/film raw 1.jpg';
import filmRaw2 from '../../images/film raw 2.jpeg';
import filmRaw3 from '../../images/film raw 3.jpeg';
import filmRaw4 from '../../images/film raw 4.jpeg';

const CARD_IMAGES = [filmRaw1, filmRaw2, filmRaw3, filmRaw4];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress;

const easePower2InOut = (value: number) => {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
};

const easePower2Out = (value: number) => {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return 1 - (1 - value) * (1 - value);
};

const segmentProgress = (
  progress: number,
  start: number,
  end: number,
  ease: (value: number) => number = (value) => value
) => {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return ease((progress - start) / (end - start));
};

function useViewportWidth() {
  const [width, setWidth] = useState(() => (typeof window === 'undefined' ? 1440 : window.innerWidth));

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return width;
}

const CARD_LABELS = ['Raw Scan', 'Structural Corrections', 'Light + Color Grade', 'AI Post-Edit'];

interface FilmLayersScrollProps {
  cardCount?: number;
  pinDurationVh?: number;
  cardScale?: number;
  gapScale?: number;
}

interface CardState {
  x: number;
  rotateY: number;
  rotateZ: number;
  z: number;
  opacity: number;
}

interface FilmLayerCardProps {
  index: number;
  progress: MotionValue<number>;
  tint: string;
  cardWidth: number;
  cardHeight: number;
  imageUrl?: string;
  getCardState: (index: number, progress: number) => CardState;
  label: string;
  revealProgress: MotionValue<number>;
}

function FilmLayerCard({ index, progress, tint, cardWidth, cardHeight, imageUrl, getCardState, label, revealProgress }: FilmLayerCardProps) {
  const x = useTransform(progress, (value) => getCardState(index, value).x);
  const rotateY = useTransform(progress, (value) => getCardState(index, value).rotateY);
  const rotateZ = useTransform(progress, (value) => getCardState(index, value).rotateZ);
  const z = useTransform(progress, (value) => getCardState(index, value).z);
  const opacity = useTransform(progress, (value) => getCardState(index, value).opacity);
  const transform = useMotionTemplate`translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale3d(1, 1, 1)`;

  const lineHeight = useTransform(revealProgress, [0, 0.65], [0, 28]);
  const labelOpacity = useTransform(revealProgress, [0.55, 1.0], [0, 1]);
  const tipOpacity = useTransform(revealProgress, [0.4, 0.75], [0, 1]);

  return (
    <motion.div
      className={styles.cardOuter}
      style={{
        transform,
        opacity,
        width: cardWidth,
        height: cardHeight,
        marginLeft: -cardWidth / 2,
        marginTop: -cardHeight / 2,
        zIndex: 20 - index,
        cursor: 'default',
      }}
    >
      <div className={styles.cardRect} style={{ '--card-tint': tint } as CSSProperties} />
      {imageUrl ? <img className={styles.cardImg} src={imageUrl} alt="" aria-hidden="true" draggable={false} /> : null}
      <motion.div className={styles.pointerLine} style={{ height: lineHeight }}>
        <motion.span className={styles.pointerTip} style={{ opacity: tipOpacity }} />
      </motion.div>
      <motion.p className={styles.cardLabel} style={{ opacity: labelOpacity }}>{label}</motion.p>
    </motion.div>
  );
}

export function FilmLayersScroll({ cardCount = 4, pinDurationVh = 320, cardScale = 1, gapScale = 1 }: FilmLayersScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const width = useViewportWidth();
  const count = clamp(cardCount, 1, 4);
  const effectiveCardScale = width < 768 ? Math.min(cardScale, 0.88) : cardScale;
  // Mobile-only spacing bump so cards don't collide in the div3 sequence.
  const effectiveGapScale = width < 768 ? Math.max(gapScale, 1.05) : gapScale;
  const cardWidth = Math.round((width < 640 ? 112 : width < 1024 ? 144 : 180) * effectiveCardScale);
  const cardHeight = Math.round((cardWidth * 16) / 9);
  const gapUnit = (width < 640 ? cardWidth * 1.12 : width < 1024 ? cardWidth * 1.28 : cardWidth * 1.5) * effectiveGapScale;
  const sceneScale = width < 420 ? 0.74 : width < 640 ? 0.84 : width < 900 ? 0.92 : 1;

  const columnCenters = useMemo(
    () => [-1.5 * gapUnit, -0.5 * gapUnit, 0.5 * gapUnit, 1.5 * gapUnit],
    [gapUnit]
  );

  const tints = useMemo(
    () => [
      'rgba(226, 146, 50, 0.16)',
      'rgba(146, 105, 70, 0.16)',
      'rgba(57, 170, 170, 0.16)',
      'rgba(188, 85, 194, 0.16)',
    ],
    []
  );

  const getCardState = useMemo(() => {
    const ROTATE_START = 0;
    const ROTATE_END = 0.22;
    const MOVE1_START = 0.22;
    const MOVE1_END = 0.38;
    const SPAWN2_START = 0.38;
    const SPAWN2_END = 0.58;
    const SPAWN3_START = 0.58;
    const SPAWN3_END = 0.78;
    const SPAWN4_START = 0.78;
    const SPAWN4_END = 0.98;

    const ROTATE_Y_TARGET = 20;

    return (index: number, progress: number): CardState => {
      const rotate1 = segmentProgress(progress, ROTATE_START, ROTATE_END, easePower2InOut);
      const move1 = segmentProgress(progress, MOVE1_START, MOVE1_END, easePower2Out);
      const spawn2 = segmentProgress(progress, SPAWN2_START, SPAWN2_END, easePower2Out);
      const spawn3 = segmentProgress(progress, SPAWN3_START, SPAWN3_END, easePower2Out);
      const spawn4 = segmentProgress(progress, SPAWN4_START, SPAWN4_END, easePower2Out);

      const state: CardState = {
        x: 0,
        rotateY: ROTATE_Y_TARGET,
        rotateZ: 0,
        z: 0,
        opacity: 0,
      };

      if (index === 0) {
        state.opacity = segmentProgress(progress, 0, 0.08, easePower2Out);
        state.rotateY = lerp(0, ROTATE_Y_TARGET, rotate1);
        state.x = lerp(0, columnCenters[0], move1);
        return state;
      }

      if (index === 1) {
        state.opacity = segmentProgress(progress, SPAWN2_START, SPAWN2_START + 0.04, easePower2Out);
        state.x = lerp(columnCenters[0], columnCenters[1], spawn2);
        state.z = lerp(-24, 0, spawn2);
        return state;
      }

      if (index === 2) {
        state.opacity = segmentProgress(progress, SPAWN3_START, SPAWN3_START + 0.04, easePower2Out);
        state.x = lerp(columnCenters[1], columnCenters[2], spawn3);
        state.z = lerp(-24, 0, spawn3);
        return state;
      }

      state.opacity = segmentProgress(progress, SPAWN4_START, SPAWN4_START + 0.04, easePower2Out);
      state.x = lerp(columnCenters[2], columnCenters[3], spawn4);
      state.z = lerp(-24, 0, spawn4);
      return state;
    };
  }, [columnCenters]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const revealProgress = useTransform(scrollYProgress, [0.92, 1.0], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      style={{ '--pin-duration': `${pinDurationVh}vh` } as CSSProperties}
    >
      <div className={styles.stickyFrame}>
        <motion.div className={styles.scene} style={{ scale: sceneScale }}>
          <div className={styles.cardStage}>
            {Array.from({ length: count }, (_, index) => (
              <FilmLayerCard
                key={index}
                index={index}
                progress={scrollYProgress}
                tint={tints[index % tints.length]}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                getCardState={getCardState}
                imageUrl={CARD_IMAGES[index]}
                label={CARD_LABELS[index]}
                revealProgress={revealProgress}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FilmLayersScroll;
