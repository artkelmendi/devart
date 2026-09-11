'use client';

import { useLayoutEffect } from 'react';

type MotionSystemProps = { scope?: 'home' | 'case' };

export default function MotionSystem({ scope = 'home' }: MotionSystemProps) {
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        document.documentElement.classList.add('motion-enhanced');

        const context = gsap.context(() => {
          const ease = 'power4.out';

          if (scope === 'home') {
            const intro = gsap.timeline();
            intro
              .fromTo(
                '.site-header > *',
                {
                  opacity: 0.35,
                  clipPath: 'inset(0 100% 0 0)',
                },
                {
                  opacity: 1,
                  clipPath: 'inset(0 0% 0 0)',
                  duration: 0.55,
                  stagger: 0.055,
                  ease,
                },
              )
              .fromTo(
                '.binary-field',
                { opacity: 0.15, scale: 0.94 },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 1.8,
                  ease,
                },
                0.1,
              )
              .fromTo(
                '.hero-role',
                { clipPath: 'inset(0 100% 0 0)' },
                {
                  clipPath: 'inset(0 0% 0 0)',
                  duration: 0.7,
                  ease,
                },
                0.65,
              )
              .fromTo(
                '.hero-description',
                {
                  opacity: 0,
                  clipPath: 'inset(0 0 100% 0)',
                },
                {
                  opacity: 1,
                  clipPath: 'inset(0 0 0% 0)',
                  duration: 0.68,
                  ease,
                },
                0.95,
              )
              .fromTo(
                '.hero-actions > *',
                { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
                {
                  opacity: 1,
                  clipPath: 'inset(0 0% 0 0)',
                  duration: 0.55,
                  stagger: 0.09,
                  ease,
                },
                1.15,
              )
              .fromTo(
                '.field-annotation, .hero-bottom > *',
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: 0.5,
                  stagger: 0.06,
                  ease,
                },
                1.35,
              );

            if (window.scrollY > window.innerHeight * 0.5) intro.progress(1);

            gsap.fromTo(
              '.section-heading > *',
              { clipPath: 'inset(0 0 100% 0)', filter: 'blur(8px)' },
              {
                clipPath: 'inset(0 0 0% 0)',
                filter: 'blur(0px)',
                duration: 0.85,
                ease,
                scrollTrigger: {
                  trigger: '.section-heading',
                  start: 'top 82%',
                  once: true,
                },
              },
            );

            gsap.utils.toArray<HTMLElement>('.project-row').forEach((row) => {
              const preview = row.querySelector('.project-preview');
              const details = row.querySelectorAll('.project-info > *');
              const timeline = gsap.timeline({
                scrollTrigger: { trigger: row, start: 'top 78%', once: true },
              });
              timeline
                .fromTo(
                  row,
                  { '--reveal-line': 0 },
                  { '--reveal-line': 1, duration: 0.8, ease },
                )
                .fromTo(
                  details,
                  {
                    opacity: 0,
                    filter: 'blur(7px)',
                    clipPath: 'inset(0 0 100% 0)',
                  },
                  {
                    opacity: 1,
                    filter: 'blur(0px)',
                    clipPath: 'inset(0 0 0% 0)',
                    duration: 0.58,
                    stagger: 0.045,
                    ease,
                  },
                  '-=0.56',
                );
              if (preview) {
                timeline.fromTo(
                  preview,
                  {
                    clipPath: 'polygon(9% 0, 9% 0, 0 100%, 0 100%)',
                    filter: 'blur(7px)',
                  },
                  {
                    clipPath: 'polygon(9% 0, 100% 0, 100% 100%, 0 100%)',
                    filter: 'blur(0px)',
                    duration: 0.86,
                    ease,
                  },
                  '-=0.62',
                );
              }
            });

            gsap.fromTo(
              '.github-link',
              { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
              {
                opacity: 1,
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.6,
                ease,
                scrollTrigger: {
                  trigger: '.github-link',
                  start: 'top 92%',
                  once: true,
                },
              },
            );

            const engineering = gsap.timeline({
              scrollTrigger: {
                trigger: '.engineering-section',
                start: 'top 75%',
                once: true,
              },
            });
            engineering
              .fromTo(
                '.engineering-intro h2',
                { clipPath: 'inset(0 0 100% 0)', filter: 'blur(9px)' },
                {
                  clipPath: 'inset(0 0 0% 0)',
                  filter: 'blur(0px)',
                  duration: 0.82,
                  ease,
                },
              )
              .fromTo(
                '.engineering-intro > div',
                { opacity: 0, filter: 'blur(8px)' },
                { opacity: 1, filter: 'blur(0px)', duration: 0.65, ease },
                '-=0.5',
              );

            gsap.utils
              .toArray<HTMLElement>('.practice-list article')
              .forEach((row) => {
                gsap
                  .timeline({
                    scrollTrigger: {
                      trigger: row,
                      start: 'top 86%',
                      once: true,
                    },
                  })
                  .fromTo(
                    row,
                    { '--reveal-line': 0 },
                    { '--reveal-line': 1, duration: 0.72, ease },
                  )
                  .fromTo(
                    row.children,
                    { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
                    {
                      opacity: 1,
                      clipPath: 'inset(0 0% 0 0)',
                      duration: 0.6,
                      stagger: 0.09,
                      ease,
                    },
                    '-=0.48',
                  );
              });

            gsap.fromTo(
              '.runtime-note > *',
              {
                opacity: 0,
                filter: 'blur(7px)',
                clipPath: 'inset(0 100% 0 0)',
              },
              {
                opacity: 1,
                filter: 'blur(0px)',
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.58,
                stagger: 0.08,
                ease,
                scrollTrigger: {
                  trigger: '.runtime-note',
                  start: 'top 88%',
                  once: true,
                },
              },
            );

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: '.about-section',
                  start: 'top 76%',
                  once: true,
                },
              })
              .fromTo(
                '.about-label h2, .about-name',
                { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
                {
                  opacity: 1,
                  clipPath: 'inset(0 0% 0 0)',
                  duration: 0.65,
                  stagger: 0.08,
                  ease,
                },
              )
              .fromTo(
                '.about-mark > span',
                { opacity: 0, filter: 'blur(12px)', rotation: -6, scale: 0.9 },
                {
                  opacity: 1,
                  filter: 'blur(0px)',
                  rotation: 0,
                  scale: 1,
                  duration: 0.8,
                  stagger: 0.09,
                  ease,
                },
                '-=0.48',
              )
              .fromTo(
                '.about-copy > *',
                {
                  opacity: 0,
                  filter: 'blur(7px)',
                  clipPath: 'inset(0 0 100% 0)',
                },
                {
                  opacity: 1,
                  filter: 'blur(0px)',
                  clipPath: 'inset(0 0 0% 0)',
                  duration: 0.58,
                  stagger: 0.07,
                  ease,
                },
                '-=0.62',
              );

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: '.contact-section',
                  start: 'top 78%',
                  once: true,
                },
              })
              .fromTo(
                '.contact-section h2 .contact-line',
                { clipPath: 'inset(100% 0 0 0)', filter: 'blur(10px)' },
                {
                  clipPath: 'inset(0% 0 0 0)',
                  filter: 'blur(0px)',
                  duration: 0.78,
                  stagger: 0.1,
                  ease,
                },
              )
              .fromTo(
                '.contact-arrow',
                { opacity: 0, rotate: -42, scale: 0.55 },
                { opacity: 1, rotate: 0, scale: 1, duration: 0.75, ease },
                '-=0.55',
              )
              .fromTo(
                '.contact-bottom > *',
                { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
                {
                  opacity: 1,
                  clipPath: 'inset(0 0% 0 0)',
                  duration: 0.6,
                  stagger: 0.1,
                  ease,
                },
                '-=0.42',
              );

            gsap.fromTo(
              '.site-footer > *',
              { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
              {
                opacity: 1,
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.48,
                stagger: 0.055,
                ease,
                scrollTrigger: {
                  trigger: '.site-footer',
                  start: 'top 95%',
                  once: true,
                },
              },
            );
          } else {
            const caseIntro = gsap.timeline({ delay: 0.08 });
            caseIntro
              .fromTo(
                '.case-header > *',
                { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
                {
                  opacity: 1,
                  clipPath: 'inset(0 0% 0 0)',
                  duration: 0.56,
                  stagger: 0.06,
                  ease,
                },
              )
              .fromTo(
                '.case-opening h1',
                { filter: 'blur(14px)', clipPath: 'inset(100% 0 0 0)' },
                {
                  filter: 'blur(0px)',
                  clipPath: 'inset(0% 0 0 0)',
                  duration: 0.82,
                  ease,
                },
                '-=0.3',
              )
              .fromTo(
                '.case-summary, .case-meta > div',
                {
                  opacity: 0,
                  filter: 'blur(7px)',
                  clipPath: 'inset(0 100% 0 0)',
                },
                {
                  opacity: 1,
                  filter: 'blur(0px)',
                  clipPath: 'inset(0 0% 0 0)',
                  duration: 0.58,
                  stagger: 0.07,
                  ease,
                },
                '-=0.42',
              )
              .fromTo(
                '.case-image',
                {
                  clipPath: 'polygon(0 0, 7% 0, 0 100%, 0 100%)',
                  filter: 'blur(7px)',
                },
                {
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                  filter: 'blur(0px)',
                  duration: 0.9,
                  ease,
                },
                '-=0.32',
              );

            gsap.utils
              .toArray<HTMLElement>(
                '.case-section, .case-decisions, .architecture-figure, .next-project',
              )
              .forEach((section) => {
                gsap.fromTo(
                  section.children,
                  {
                    opacity: 0,
                    filter: 'blur(7px)',
                    clipPath: 'inset(0 0 100% 0)',
                  },
                  {
                    opacity: 1,
                    filter: 'blur(0px)',
                    clipPath: 'inset(0 0 0% 0)',
                    duration: 0.7,
                    stagger: 0.08,
                    ease,
                    scrollTrigger: {
                      trigger: section,
                      start: 'top 82%',
                      once: true,
                    },
                  },
                );
              });

            gsap.fromTo(
              '.case-footer > *',
              { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
              {
                opacity: 1,
                clipPath: 'inset(0 0% 0 0)',
                duration: 0.5,
                stagger: 0.08,
                ease,
                scrollTrigger: {
                  trigger: '.case-footer',
                  start: 'top 94%',
                  once: true,
                },
              },
            );
          }
        });

        cleanup = () => {
          context.revert();
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
          document.documentElement.classList.remove('motion-enhanced');
        };
      })
      .catch(() => {
        document.documentElement.classList.remove('motion-enhanced');
      });

    const handlePreference = () => {
      if (!reduceMotion.matches) return;
      disposed = true;
      cleanup?.();
    };
    reduceMotion.addEventListener('change', handlePreference);

    return () => {
      disposed = true;
      reduceMotion.removeEventListener('change', handlePreference);
      cleanup?.();
    };
  }, [scope]);

  return null;
}
