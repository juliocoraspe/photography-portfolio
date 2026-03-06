import { useEffect, useState } from 'react';

interface SectionOverlayProps {
  sectionTitle?: string;
  subtitle?: string;
  body?: string;
  bodySecondary?: string;
  bodyPairBottom?: boolean;
  bodyBottomCenter?: boolean;
  bodyIndex?: string;
  label?: string;
  home?: boolean;
  noFade?: boolean;
  className?: string;
}

export function SectionOverlay({
  sectionTitle,
  subtitle,
  body,
  bodySecondary,
  bodyPairBottom = false,
  bodyBottomCenter = false,
  bodyIndex,
  label,
  home = false,
  noFade = false,
  className,
}: SectionOverlayProps) {
  const [heroTitleOpacity, setHeroTitleOpacity] = useState(noFade ? 0.9 : 1);

  useEffect(() => {
    if (!home || noFade) return;

    const updateHeroState = () => {
      const heroSection = document.querySelector('.sony-home-stage > .relative') as HTMLElement | null;
      const heroHeight = heroSection?.offsetHeight ?? window.innerHeight * 4;
      const heroStart = heroSection?.offsetTop ?? 0;
      const heroScrollableHeight = Math.max(1, heroHeight - window.innerHeight);
      const heroProgress = Math.min(Math.max((window.scrollY - heroStart) / heroScrollableHeight, 0), 1);
      const fadeStartProgress = 0.16;
      const fadeEndProgress = 0.46;
      const y = window.scrollY;

      if (heroProgress <= fadeStartProgress || y <= heroStart) {
        setHeroTitleOpacity(1);
      } else if (heroProgress >= fadeEndProgress) {
        setHeroTitleOpacity(0);
      } else {
        setHeroTitleOpacity(1 - (heroProgress - fadeStartProgress) / (fadeEndProgress - fadeStartProgress));
      }
    };

    updateHeroState();
    window.addEventListener('scroll', updateHeroState, { passive: true });
    window.addEventListener('resize', updateHeroState);

    return () => {
      window.removeEventListener('scroll', updateHeroState);
      window.removeEventListener('resize', updateHeroState);
    };
  }, [home]);

  return (
    <aside className={`scene-overlay ${home ? 'scene-overlay--home' : ''} ${className ?? ''}`} aria-label={`${sectionTitle ?? 'Section'} section details`}>
      {home ? (
        <div className="scene-hero">
          <div className="scene-hero__title-wrap" style={{ opacity: heroTitleOpacity }}>
            <h1 className="type-hero scene-hero__title">Julio Coraspe</h1>
            <span className="scene-hero__rule" aria-hidden="true" />
          </div>
          <div className="scene-hero__bio" style={{ opacity: heroTitleOpacity }}>
            <p className="type-body scene-hero__bio-line">
              Born in Venezuela, where I graduated as a lawyer, I recently earned my certification as a UX/UI designer and front-end developer.
            </p>
            <p className="type-body scene-hero__bio-line">
              Photography has always been one of my core passions. My work spans digital photography and analog film: from capture to developing, scanning, editing, and post-processing. I also work with drone videography and vertical video production for social media.
            </p>
            <p className="type-body scene-hero__bio-line">
              I use tools such as Photoshop, Lightroom, Adobe Fresco, and Feather for digital drawing and 3D sketching, alongside strong experience working with code, generative workflows, and AI through prompt and content engineering.
            </p>
            <p className="type-body scene-hero__bio-line">
              My visual philosophy blends opposites: the mechanical, manual, and analog with the minimalist, modern, and futuristic. This approach allows me to move across technologies and mediums, combining traditional craftsmanship with emerging tools to create a distinctive visual language.
            </p>
          </div>
        </div>
      ) : null}

      {!home ? (
        <>
          <div className={`scene-copy ${bodyPairBottom ? 'scene-copy--body-pair-bottom' : ''}`}>
            {label ? <p className="type-micro scene-copy__label">{label}</p> : null}
            {sectionTitle ? <h2 className="type-section scene-copy__title">{sectionTitle}</h2> : null}
            {subtitle ? <p className="type-subtitle scene-copy__subtitle">{subtitle}</p> : null}
            {bodyPairBottom && body && bodySecondary ? (
              <div className="scene-copy__body-pair">
                <div className="scene-copy__body-item">
                  <p className="type-micro scene-copy__body-index">01</p>
                  <p className="type-body scene-copy__body">{body}</p>
                </div>
                <div className="scene-copy__body-item">
                  <p className="type-micro scene-copy__body-index">02</p>
                  <p className="type-body scene-copy__body">{bodySecondary}</p>
                </div>
              </div>
            ) : !bodyBottomCenter ? (
              <>
                {body ? <p className="type-body scene-copy__body">{body}</p> : null}
                {bodySecondary ? <p className="type-body scene-copy__body">{bodySecondary}</p> : null}
              </>
            ) : null}
          </div>
          {bodyBottomCenter && body ? (
            <div className="scene-copy__body-bottom-center">
              {bodyIndex ? <p className="type-micro scene-copy__body-index">{bodyIndex}</p> : null}
              <p className="type-body scene-copy__body">{body}</p>
            </div>
          ) : null}
        </>
      ) : null}
    </aside>
  );
}
