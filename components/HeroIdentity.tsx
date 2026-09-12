'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { gsap } from 'gsap';

const letters = Array.from('devart');

/** Fixed letter cells let binary fragments assemble without moving the layout. */
export default function HeroIdentity({
  paused,
  onResolve,
}: {
  paused: boolean;
  onResolve: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const resolveRef = useRef(onResolve);
  const pausedRef = useRef(paused);
  const [running, setRunning] = useState(false);
  const [reduced, setReduced] = useState(false);
  resolveRef.current = onResolve;
  pausedRef.current = paused;

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let context: gsap.Context | undefined;

    function build() {
      context?.revert();
      timeline.current = null;
      setReduced(media.matches);
      setRunning(false);
      if (media.matches) return;

      context = gsap.context(() => {
        const sequence = gsap.timeline({
          paused: true,
          delay: location.hash ? 0 : 0.9,
          onStart: () => setRunning(true),
          onComplete: () => {
            setRunning(false);
            resolveRef.current();
          },
        });
        timeline.current = sequence;
        const glyphs = element!.querySelectorAll('.identity-glyph');

        sequence
          .set('.glyph-face', { opacity: 0 })
          .set('.glyph-slice', { opacity: 0 })
          .set('.identity-period', { opacity: 0 })
          .fromTo(
            '.identity-scan',
            { scaleX: 0, opacity: 0.65 },
            { scaleX: 1, opacity: 0, duration: 1.9, ease: 'power2.inOut' },
            0,
          );

        glyphs.forEach((glyph, index) => {
          const start = 0.12 + index * 0.13;
          const code = glyph.querySelector('.glyph-code');
          const slices = glyph.querySelectorAll('.glyph-slice');
          const face = glyph.querySelector('.glyph-face');
          sequence
            .fromTo(
              code,
              { opacity: 0, scaleX: 0.7 },
              { opacity: 0.7, scaleX: 1, duration: 0.2, ease: 'power2.out' },
              start,
            )
            .to(code, { opacity: 0, duration: 0.3 }, start + 0.3);
          slices.forEach((slice, band) => {
            sequence.fromTo(
              slice,
              {
                xPercent: [10, 7, 4, 1][band],
                yPercent: 0,
                opacity: 0,
              },
              {
                xPercent: 0,
                yPercent: 0,
                opacity: 1,
                duration: 0.9,
                ease: 'power3.out',
              },
              start + 0.22 + band * 0.025,
            );
          });
          sequence
            .to(face, { opacity: 1, duration: 0.14, ease: 'none' }, start + 1.2)
            .set(slices, { opacity: 0 }, start + 1.34);
        });

        sequence.fromTo(
          '.identity-period',
          {
            opacity: 0,
            scaleX: 0.24,
            scaleY: 3.4,
            yPercent: -30,
            transformOrigin: '50% 76%',
          },
          {
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            yPercent: 0,
            duration: 0.48,
            ease: 'power3.out',
          },
          1.72,
        );

        // Deep-link visits and reduced motion arrive with a fully formed identity.
        if (scrollY > innerHeight * 0.5) sequence.progress(1, true);
        else if (!pausedRef.current && !document.hidden) sequence.play();
      }, element!);
    }

    const visibility = () => {
      if (
        media.matches ||
        !timeline.current ||
        timeline.current.progress() === 1
      )
        return;
      if (document.hidden || pausedRef.current) timeline.current.pause();
      else timeline.current.play();
    };
    const skipOffscreen = () => {
      if (
        scrollY < innerHeight * 0.6 ||
        !timeline.current ||
        timeline.current.progress() === 1
      )
        return;
      timeline.current.progress(1, true).pause();
      setRunning(false);
    };

    build();
    media.addEventListener('change', build);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('scroll', skipOffscreen, { passive: true });
    return () => {
      media.removeEventListener('change', build);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('scroll', skipOffscreen);
      context?.revert();
      timeline.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    if (paused) timeline.current?.pause();
    else if (
      !document.hidden &&
      timeline.current &&
      timeline.current.progress() < 1
    )
      timeline.current.play();
  }, [paused]);

  return (
    <div className="hero-identity" ref={root}>
      <h1 id="hero-title" className="hero-wordmark" aria-label="devart.">
        {letters.map((letter, index) => (
          <span
            className={`identity-glyph${index > 2 ? ' identity-art' : ''}`}
            key={index}
            aria-hidden="true"
          >
            <span className="glyph-face">{letter}</span>
            <span className="glyph-code">
              {letter.charCodeAt(0).toString(2).padStart(8, '0')}
            </span>
            {[0, 1, 2, 3].map((band) => (
              <span className={`glyph-slice glyph-slice-${band}`} key={band}>
                {letter}
              </span>
            ))}
          </span>
        ))}
        <span className="brand-period identity-period" aria-hidden="true">
          .
        </span>
      </h1>
      <span className="identity-scan" aria-hidden="true" />
      <button
        className="identity-replay"
        aria-label="Replay wordmark animation"
        title="Replay wordmark animation"
        disabled={running || paused || reduced}
        onClick={() => {
          if (timeline.current && !timeline.current.isActive()) {
            setRunning(true);
            timeline.current.restart();
          }
        }}
      >
        <RotateCcw size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
