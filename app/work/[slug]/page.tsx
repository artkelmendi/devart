import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { projects } from '@/lib/projects';
import MotionSystem from '@/components/MotionSystem';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);
  return {
    title: project
      ? `${project.name} — Engineering & Development | devart.`
      : 'Project not found',
    description: project?.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  return (
    <div className="case-page">
      <MotionSystem scope="case" />
      <a className="skip-link" href="#case-main">
        Skip to content
      </a>
      <header className="case-header">
        <Link href="/#work" className="quiet-link">
          <ArrowLeft size={18} />
          All work
        </Link>
        <Link href="/" className="case-signature" aria-label="devart. home">
          <span>dev</span>
          <strong>art</strong>
          <span className="brand-period">.</span>
        </Link>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="quiet-link"
        >
          Live website
          <ArrowUpRight size={18} />
        </a>
      </header>
      <main className="case-main" id="case-main">
        <div className="case-opening">
          <h1>{project.name}</h1>
          <p className="case-summary">{project.summary}</p>
          <div className="case-meta">
            <div>
              <span>CONTRIBUTION</span>
              <p>{project.contribution}</p>
            </div>
            <div>
              <span>CONTEXT</span>
              <p>{project.sector}</p>
            </div>
            <div>
              <span>TECHNOLOGIES</span>
              <p>{project.technologies.join(' · ')}</p>
            </div>
          </div>
        </div>
        <div className="case-image">
          <Image
            unoptimized
            src={project.image}
            alt={`${project.name} website homepage`}
            width={1440}
            height={1000}
            priority
          />
        </div>
        <section className="case-section">
          <h2>The project.</h2>
          <p>{project.overview}</p>
        </section>
        <section className="case-section">
          <h2>The challenge.</h2>
          <p>{project.challenge}</p>
        </section>
        <section className="case-decisions">
          <h2>Engineering decisions.</h2>
          <div>
            {project.decisions.map((decision) => (
              <article key={decision.title}>
                <h3>{decision.title}</h3>
                <p>{decision.text}</p>
              </article>
            ))}
          </div>
        </section>
        <figure className="architecture-figure">
          <figcaption>IMPLEMENTATION FLOW</figcaption>
          <ol>
            {project.flow.map((step, i) => (
              <li key={step}>
                <span>{step}</span>
                {i < project.flow.length - 1 && (
                  <ArrowRight size={20} aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </figure>
        <section className="case-section">
          <h2>The result.</h2>
          <div>
            <p>{project.outcome}</p>
            <div className="case-result-links">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-link"
              >
                Explore the live website
                <ArrowUpRight size={18} />
              </a>
              {project.source && (
                <a
                  href={project.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quiet-link"
                >
                  View source
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        </section>
        <Link className="next-project" href={`/work/${next.slug}`}>
          <span>Next project</span>
          <strong>{next.name}</strong>
          <ArrowUpRight size={48} />
        </Link>
      </main>
      <footer className="case-footer">
        <Link href="/">devart. / Software Engineer</Link>
        <a href="mailto:info@devart.com">
          Start a conversation
          <ArrowUpRight size={16} />
        </a>
      </footer>
    </div>
  );
}
