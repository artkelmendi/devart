'use client';

import { useLayoutEffect, useState } from 'react';

/** A brief identity cue, never a loading gate. */
export default function EntryIntro() {
  const [visible, setVisible] = useState(true);
  useLayoutEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches || scrollY > innerHeight * 0.5 || location.hash) {
      setVisible(false);
      return;
    }
    const dismiss = () => setVisible(false);
    const timer = window.setTimeout(dismiss, 1500);
    window.addEventListener('pointerdown', dismiss, { once: true });
    window.addEventListener('keydown', dismiss, { once: true });
    window.addEventListener('scroll', dismiss, { once: true, passive: true });
    media.addEventListener('change', dismiss);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('keydown', dismiss);
      window.removeEventListener('scroll', dismiss);
      media.removeEventListener('change', dismiss);
    };
  }, []);
  if (!visible) return null;
  return (
    <div className="entry-intro" aria-hidden="true">
      <div className="entry-signature">
        <span className="entry-command">&gt; initialise</span>
        <span className="entry-name">dev<strong>art</strong><span>.</span></span>
        <span className="entry-track"><span /></span>
        <span className="entry-caption">SOFTWARE / SYSTEMS / INTERFACES</span>
      </div>
    </div>
  );
}
