'use client';

import { useEffect, useRef } from 'react';

export default function PointerHalo() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current!;
    const allowed = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0, last = 0;
    let visible = false;
    const hide = () => {
      visible = false;
      node.dataset.visible = 'false';
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };
    const tick = (time: number) => {
      const damping = 1 - Math.exp(-Math.min(time - (last || time - 16), 50) / 65);
      last = time;
      x += (targetX - x) * damping;
      y += (targetY - y) * damping;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = Math.hypot(targetX - x, targetY - y) > 0.1 ? requestAnimationFrame(tick) : 0;
      if (!frame) last = 0;
    };
    const move = (event: PointerEvent) => {
      if (!allowed.matches || event.pointerType !== 'mouse') { hide(); return; }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) { x = targetX; y = targetY; visible = true; }
      node.dataset.visible = 'true';
      node.dataset.active = String(event.target instanceof Element && !!event.target.closest('a, button, [role="button"], input'));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const down = () => { node.dataset.pressed = 'true'; };
    const up = () => { node.dataset.pressed = 'false'; };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up, { passive: true });
    window.addEventListener('blur', hide);
    window.addEventListener('scroll', hide, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    document.addEventListener('visibilitychange', hide);
    allowed.addEventListener('change', hide);
    return () => {
      hide();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('blur', hide);
      window.removeEventListener('scroll', hide);
      document.documentElement.removeEventListener('pointerleave', hide);
      document.removeEventListener('visibilitychange', hide);
      allowed.removeEventListener('change', hide);
    };
  }, []);
  return <div ref={ref} className="pointer-halo" aria-hidden="true"><span /></div>;
}
