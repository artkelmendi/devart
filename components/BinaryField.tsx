'use client';

import { useEffect, useRef } from 'react';

type BinaryFieldProps = { paused: boolean };
type Particle = {
  a: number;
  b: number;
  radius: number;
  phase: number;
  speed: number;
  depth: number;
  glyph: number;
  amber: boolean;
  group: number;
};
type ProjectedGlyph = {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  glyph: number;
  palette: number;
};

const TAU = Math.PI * 2;

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function makeParticles(): Particle[] {
  const random = seededRandom(0x44455641);
  return Array.from({ length: 1020 }, (_, index) => ({
    a: random() * TAU,
    b: random() * TAU,
    radius: random(),
    phase: random() * TAU,
    speed: 0.65 + random() * 0.65,
    depth: random(),
    glyph: random() > 0.5 ? 1 : 0,
    amber: random() > 0.946,
    group: index < 800 ? 0 : index < 945 ? 1 : 2,
  }));
}

/** A quietly orbiting, deterministic data sculpture. No scene graph or WebGL. */
export default function BinaryField({ paused }: BinaryFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const controllerRef = useRef<{ setPaused: (value: boolean) => void } | null>(
    null,
  );

  useEffect(() => {
    pausedRef.current = paused;
    controllerRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarseQuery = window.matchMedia('(pointer: coarse)');
    const particles = makeParticles();
    const projected: ProjectedGlyph[] = [];
    const atlas = document.createElement('canvas');
    // Six pre-rasterized glyphs replace a thousand fillText calls per frame.
    const cell = 64;
    atlas.width = cell * 2;
    atlas.height = cell * 3;
    const atlasContext = atlas.getContext('2d');
    if (!atlasContext) return;
    atlasContext.font =
      '400 38px "SFMono-Regular", Consolas, "Liberation Mono", monospace';
    atlasContext.textAlign = 'center';
    atlasContext.textBaseline = 'middle';
    ['#afb7bd', '#e0e6e5', '#b89569'].forEach((color, row) => {
      atlasContext.fillStyle = color;
      atlasContext.fillText('0', cell / 2, row * cell + cell / 2);
      atlasContext.fillText('1', cell + cell / 2, row * cell + cell / 2);
    });

    let width = 1;
    let height = 1;
    let dpr = 1;
    let isSmall = false;
    let reducedMotion = motionQuery.matches;
    let isPaused = pausedRef.current;
    let frame = 0;
    let lastTimestamp = 0;
    let lastPaint = 0;
    let elapsed = 0;
    let quality = 1;
    let frameSamples = 0;
    let frameCost = 0;
    let resizeFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let scroll = reducedMotion ? 0 : window.scrollY;
    let targetScroll = scroll;
    let disposed = false;
    let fieldVisible = true;

    const canAnimate = () =>
      !isPaused &&
      !reducedMotion &&
      !document.hidden &&
      !disposed &&
      fieldVisible;

    function paint() {
      if (!context) return;
      const started = performance.now();
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      projected.length = 0;

      const base = Math.min(width * (isSmall ? 0.46 : 0.223), height * 0.36);
      const centerX = width * (isSmall ? 0.88 : 0.785);
      const centerY = height * (isSmall ? 0.47 : 0.49);
      const flow = elapsed * 0.027;
      const tilt = -0.36 + Math.sin(elapsed * 0.043) * 0.025;
      const sinTilt = Math.sin(tilt);
      const cosTilt = Math.cos(tilt);
      const yaw = 0.69 + Math.sin(elapsed * 0.035) * 0.07;
      const sinYaw = Math.sin(yaw);
      const cosYaw = Math.cos(yaw);
      const pitch = 0.47;
      const sinPitch = Math.sin(pitch);
      const cosPitch = Math.cos(pitch);
      // The environment loses contrast beyond the opening viewport, keeping long-form content quiet.
      const pageAttenuation = reducedMotion
        ? 1
        : 1 - Math.min(scroll / (height * 1.4), 1) * 0.66;
      const density = (isSmall ? 0.61 : 1) * quality;

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        // Stable culling retains the same sculpture as the adaptive budget changes.
        if ((index * 0.61803398875) % 1 > density) continue;
        let x: number;
        let y: number;
        let z: number;
        let alpha: number;
        let glyphSize: number;

        if (particle.group === 0) {
          const angle = particle.a + flow * particle.speed;
          const tube = particle.b + Math.sin(angle * 2 + elapsed * 0.06) * 0.21;
          // A gently deformed torus creates open space at its core and a readable elliptical silhouette.
          const orbit = 0.8 + Math.cos(tube) * (0.13 + particle.radius * 0.15);
          const localX = Math.cos(angle) * orbit * base * 1.25;
          const localY = Math.sin(angle) * orbit * base * 1.02;
          const localZ =
            Math.sin(tube) * base * 0.29 + Math.sin(angle * 3) * base * 0.055;
          const yawX = localX * cosYaw + localZ * sinYaw;
          const yawZ = -localX * sinYaw + localZ * cosYaw;
          const pitchY = localY * cosPitch - yawZ * sinPitch;
          z = localY * sinPitch + yawZ * cosPitch;
          const perspective = 1 + z / (base * 4.5);
          const depth = (z / base + 1) * 0.5;
          x = centerX + (yawX * cosTilt - pitchY * sinTilt) * perspective;
          y = centerY + (yawX * sinTilt + pitchY * cosTilt) * perspective;
          x += pointerX * (10 + depth * 20);
          y +=
            pointerY * (8 + depth * 16) -
            Math.min(scroll, height * 2) * (0.026 + depth * 0.031);
          const fade = 0.64 + Math.sin(elapsed * 0.26 + particle.phase) * 0.23;
          alpha = (0.16 + depth * 0.61) * fade * pageAttenuation;
          glyphSize = (14 + depth * 8.5) * (isSmall ? 0.85 : 1);
        } else if (particle.group === 1) {
          // Two loose, sinuous lateral streams feed the central field. Never vertical rainfall.
          const progress =
            (particle.a / TAU + elapsed * 0.0035 * particle.speed) % 1;
          const band = particle.b > Math.PI ? 1 : -1;
          const depth = particle.depth;
          x = progress * (width + 140) - 70;
          y =
            height * 0.5 +
            band * height * 0.29 +
            Math.sin(progress * 5.2 + band * 0.9) * height * 0.08;
          y += (particle.radius - 0.5) * height * 0.14;
          x += pointerX * (4 + depth * 17);
          y +=
            pointerY * (3 + depth * 13) -
            Math.min(scroll, height * 2) * (0.012 + depth * 0.025);
          z = depth * base - base;
          const edge = Math.sin(progress * Math.PI);
          alpha =
            (0.038 + depth * 0.105) *
            (0.7 + Math.sin(elapsed * 0.16 + particle.phase) * 0.3) *
            edge *
            pageAttenuation;
          glyphSize = 13 + depth * 6;
        } else {
          // Very sparse near-field fragments imply depth without covering the copy.
          const depth = particle.depth;
          x =
            (particle.a / TAU) * width +
            Math.sin(elapsed * 0.032 + particle.phase) * 12;
          y =
            (particle.b / TAU) * height +
            Math.cos(elapsed * 0.028 + particle.phase) * 9;
          x += pointerX * (12 + depth * 22);
          y +=
            pointerY * (10 + depth * 18) - Math.min(scroll, height * 2) * 0.05;
          z = base + depth;
          alpha =
            (0.023 + depth * 0.04) *
            (0.7 + Math.sin(elapsed * 0.17 + particle.phase) * 0.3) *
            pageAttenuation;
          glyphSize = 20 + depth * 11;
        }

        // Quiet the main reading column and soften glyphs at the physical edges.
        const readingMask = isSmall
          ? 0.27
          : 0.36 + Math.min(Math.max((x / width - 0.36) / 0.24, 0), 1) * 0.64;
        const edgeMask = Math.min(
          1,
          Math.max(0, x / 48),
          Math.max(0, (width - x) / 48),
          Math.max(0, y / 42),
          Math.max(0, (height - y) / 42),
        );
        alpha *= readingMask * edgeMask;
        if (
          alpha < 0.007 ||
          y < -32 ||
          y > height + 32 ||
          x < -32 ||
          x > width + 32
        )
          continue;
        projected.push({
          x,
          y,
          z,
          size: glyphSize,
          alpha,
          glyph: particle.glyph,
          palette: particle.amber ? 2 : z > 0 ? 1 : 0,
        });
      }

      projected.sort((a, b) => a.z - b.z);
      for (const glyph of projected) {
        context.globalAlpha = Math.min(glyph.alpha, 0.65);
        context.drawImage(
          atlas,
          glyph.glyph * cell,
          glyph.palette * cell,
          cell,
          cell,
          glyph.x - glyph.size / 2,
          glyph.y - glyph.size / 2,
          glyph.size,
          glyph.size,
        );
      }
      context.globalAlpha = 1;

      if (canAnimate()) {
        frameSamples += 1;
        frameCost += performance.now() - started;
        if (frameSamples >= 90) {
          const average = frameCost / frameSamples;
          if (average > 7 && quality > 0.55)
            quality = Math.max(0.55, quality - 0.12);
          frameSamples = 0;
          frameCost = 0;
        }
      }
    }

    function tick(timestamp: number) {
      frame = 0;
      if (!canAnimate()) return;
      const delta = lastTimestamp
        ? Math.min((timestamp - lastTimestamp) / 1000, 0.05)
        : 0;
      lastTimestamp = timestamp;
      elapsed += delta;
      const damping = 1 - Math.exp(-delta * 3.7);
      pointerX += (targetPointerX - pointerX) * damping;
      pointerY += (targetPointerY - pointerY) * damping;
      scroll += (targetScroll - scroll) * (1 - Math.exp(-delta * 5));
      // Coarse pointers benefit from a lower power budget; animation speed remains time-based.
      if (timestamp - lastPaint >= 1000 / (coarseQuery.matches ? 30 : 60) - 1) {
        paint();
        lastPaint = timestamp;
      }
      frame = window.requestAnimationFrame(tick);
    }

    function start() {
      if (canAnimate() && !frame) {
        lastTimestamp = 0;
        frame = window.requestAnimationFrame(tick);
      }
    }

    function stop() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastTimestamp = 0;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      isSmall = width < 760;
      const pixelBudget = Math.sqrt(3_000_000 / Math.max(1, width * height));
      dpr = Math.min(
        window.devicePixelRatio || 1,
        isSmall ? 1.5 : 1.75,
        pixelBudget,
      );
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      paint();
    }

    function handleResize() {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    }

    function handlePointer(event: PointerEvent) {
      if (!canAnimate() || event.pointerType === 'touch') return;
      targetPointerX = (event.clientX / width - 0.5) * 2;
      targetPointerY = (event.clientY / height - 0.5) * 2;
    }

    function handlePointerLeave() {
      if (!canAnimate()) return;
      targetPointerX = 0;
      targetPointerY = 0;
    }

    function handleScroll() {
      if (!canAnimate()) return;
      targetScroll = window.scrollY;
    }

    function handleVisibility() {
      if (document.hidden) stop();
      else {
        targetScroll = window.scrollY;
        start();
      }
    }

    function handleMotionPreference() {
      reducedMotion = motionQuery.matches;
      stop();
      if (reducedMotion) {
        pointerX = pointerY = targetPointerX = targetPointerY = 0;
        scroll = targetScroll = 0;
        paint();
      } else {
        targetScroll = window.scrollY;
        start();
      }
    }

    controllerRef.current = {
      setPaused(value) {
        isPaused = value;
        if (value) stop();
        else {
          targetScroll = window.scrollY;
          start();
        }
      },
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointer, { passive: true });
    document.documentElement.addEventListener(
      'pointerleave',
      handlePointerLeave,
      { passive: true },
    );
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery.addEventListener('change', handleMotionPreference);
    const visibleSections = new Map<Element, boolean>();
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) =>
        visibleSections.set(entry.target, entry.isIntersecting),
      );
      fieldVisible = [...visibleSections.values()].some(Boolean);
      if (fieldVisible) {
        targetScroll = window.scrollY;
        start();
      } else stop();
    });
    ['top', 'contact'].forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        visibleSections.set(section, false);
        visibilityObserver.observe(section);
      }
    });
    resize();
    start();

    return () => {
      disposed = true;
      visibilityObserver.disconnect();
      stop();
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      controllerRef.current = null;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointer);
      document.documentElement.removeEventListener(
        'pointerleave',
        handlePointerLeave,
      );
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleMotionPreference);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="binary-field"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
