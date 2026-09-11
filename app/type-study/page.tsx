'use client';

import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import styles from './type-study.module.css';

type Direction = {
  id: string;
  name: string;
  character: string;
  note: string;
  className: string;
  verdict: string;
};

const directions: Direction[] = [
  {
    id: 'geometric',
    name: 'Geometric',
    character: 'Precise · balanced · premium',
    note: 'The current direction. Calm enough for engineering work, with the weight shift giving ART a quiet signature.',
    className: styles.geometric,
    verdict: 'Best all-round fit',
  },
  {
    id: 'grotesk',
    name: 'Neo-grotesk',
    character: 'Direct · contemporary · clear',
    note: 'More neutral and product-minded. It feels closer to a software platform than a creative studio.',
    className: styles.grotesk,
    verdict: 'Strong engineering fit',
  },
  {
    id: 'condensed',
    name: 'Condensed',
    character: 'Technical · assertive · compact',
    note: 'A sharper, more industrial silhouette. It brings telecom and systems engineering to the foreground.',
    className: styles.condensed,
    verdict: 'Most technical',
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    character: 'Engineered · crafted · distinctive',
    note: 'Geist builds the DEV foundation while Manrope gives ART a fuller form. The split becomes more visible.',
    className: styles.hybrid,
    verdict: 'Most ownable',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    character: 'Code-led · rigorous · utilitarian',
    note: 'A literal developer voice. Credible and clear, though less premium and less distinctive as a main identity.',
    className: styles.terminal,
    verdict: 'Most developer-coded',
  },
  {
    id: 'editorial',
    name: 'Editorial serif',
    character: 'Contrasting · cultured · unexpected',
    note: 'The experimental outlier. It makes the portfolio feel authored, but shifts attention away from engineering.',
    className: styles.editorial,
    verdict: 'Most expressive',
  },
];

function Wordmark({ direction }: { direction: Direction }) {
  return (
    <span
      className={`${styles.wordmark} ${direction.className}`}
      aria-label="devart."
    >
      <span className={styles.dev}>dev</span>
      <strong className={styles.art}>art</strong>
      <span className={styles.period}>.</span>
    </span>
  );
}

export default function TypeStudyPage() {
  const [selectedId, setSelectedId] = useState('geometric');
  const selected =
    directions.find((direction) => direction.id === selectedId) ??
    directions[0];

  return (
    <main className={styles.study}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <ArrowLeft aria-hidden="true" size={17} />
          Portfolio
        </Link>
        <p>DEVART / TYPE STUDY</p>
        <span>Six directions</span>
      </header>

      <section className={styles.preview} aria-labelledby="type-study-title">
        <div className={styles.previewMeta}>
          <h1 id="type-study-title">Choose the voice.</h1>
          <p>
            The same name can feel more engineered, more creative, or more
            assured. Select a direction below to see it at hero scale.
          </p>
        </div>

        <div className={styles.heroProof} aria-live="polite">
          <Wordmark direction={selected} />
          <div className={styles.roleLine}>
            <span>SOFTWARE ENGINEER</span>
            <i aria-hidden="true" />
          </div>
          <div className={styles.proofFooter}>
            <span>{selected.name}</span>
            <span>{selected.character}</span>
          </div>
        </div>
      </section>

      <section className={styles.comparison} aria-label="Wordmark directions">
        {directions.map((direction, index) => {
          const active = direction.id === selectedId;
          return (
            <button
              key={direction.id}
              type="button"
              className={`${styles.option} ${active ? styles.active : ''}`}
              onClick={() => setSelectedId(direction.id)}
              aria-pressed={active}
            >
              <span className={styles.index}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={styles.optionMark}>
                <Wordmark direction={direction} />
              </span>
              <span className={styles.optionInfo}>
                <span className={styles.optionName}>{direction.name}</span>
                <span className={styles.optionCharacter}>
                  {direction.character}
                </span>
              </span>
              <span className={styles.optionVerdict}>{direction.verdict}</span>
              <span className={styles.selectIcon} aria-hidden="true">
                {active ? <Check size={18} /> : <ArrowUpRight size={18} />}
              </span>
              <span className={styles.optionNote}>{direction.note}</span>
            </button>
          );
        })}
      </section>

      <footer className={styles.footer}>
        <p>
          Selecting here is only a preview. Your live portfolio has not been
          changed.
        </p>
        <Link href="/">
          Return to devart.
          <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
      </footer>
    </main>
  );
}
