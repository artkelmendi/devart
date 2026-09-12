'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

export default function SmoothScroll() {
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (preference.matches) return;
      const lenis = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        prevent: (node) => node.matches('textarea, [data-native-scroll]'),
      });
      const tick = (time: number) => lenis.raf(time * 1000);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(tick);
      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    };
    setup();
    preference.addEventListener('change', setup);
    return () => {
      preference.removeEventListener('change', setup);
      cleanup();
    };
  }, []);
  return null;
}
