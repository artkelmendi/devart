'use client';

export const dynamic = 'force-static';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
  Menu,
  Pause,
  Play,
  X,
} from 'lucide-react';
import BinaryField from '@/components/BinaryField';
import MotionSystem from '@/components/MotionSystem';
import HeroIdentity from '@/components/HeroIdentity';
import EntryIntro from '@/components/EntryIntro';
import { projects } from '@/lib/projects';

const navigation = [
  ['Work', 'work'],
  ['Engineering', 'engineering'],
  ['About', 'about'],
  ['Contact', 'contact'],
];
const deploymentBase = import.meta.env.VITE_DEPLOYMENT_BASE ?? '';

function Wordmark() {
  return (
    <span className="wordmark" aria-label="devart.">
      <span>dev</span>
      <strong>art</strong>
      <span className="brand-period">.</span>
    </span>
  );
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -55% 0px' },
    );
    ['top', ...navigation.map(([, id]) => id)].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const resize = () => {
      if (innerWidth > 760) setOpen(false);
    };
    window.addEventListener('keydown', close);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('keydown', close);
      window.removeEventListener('resize', resize);
    };
  }, [open]);
  return (
    <header className="site-header">
      <a href="#top" aria-label="devart. home" className="header-brand">
        <Wordmark />
      </a>
      <nav className="desktop-navigation" aria-label="Main navigation">
        {navigation.map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? 'location' : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
      <a className="header-cta" href="mailto:info@devart.com">
        Let’s talk
        <ArrowUpRight size={16} />
      </a>
      <button
        className="menu-toggle"
        ref={menuButton}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Mobile navigation"
        >
          {navigation.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => {
                setOpen(false);
                document.getElementById(id)?.focus({ preventScroll: true });
              }}
            >
              {label}
              <ArrowUpRight size={22} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function CopyEmail() {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText('info@devart.com');
      setState('copied');
    } catch {
      setState('error');
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 3500);
  }
  return (
    <div className="copy-wrap">
      <button
        className="copy-button"
        onClick={copy}
        aria-label="Copy email address"
      >
        {state === 'copied' ? <Check size={17} /> : <Copy size={17} />}
      </button>
      <output className="copy-feedback" aria-live="polite">
        {state === 'copied'
          ? 'Email copied'
          : state === 'error'
            ? 'Select the email to copy it.'
            : ''}
      </output>
    </div>
  );
}

const practices = [
  {
    name: 'Systems software',
    description:
      'Strong C and C++ foundations for software close to the system: precise behavior, memory-aware code, debugging, and maintainable design.',
    skills: ['C', 'C++', 'Linux', 'Debugging'],
  },
  {
    name: '5G & telecom validation',
    description:
      'Hands-on validation in Ericsson Networks environments, testing real radios, basebands, and 5G behavior where software meets hardware.',
    skills: ['5G', 'Radios', 'Basebands', 'System validation'],
  },
  {
    name: 'Test engineering',
    description:
      'Quality built in at several levels: focused unit tests, block-level tests, automated Jenkins pipelines, and real-world verification.',
    skills: ['Jenkins', 'Unit tests', 'Block tests', 'CI automation'],
  },
  {
    name: 'Frontend & web applications',
    description:
      'Responsive interfaces with considered state, accessible interactions, and a dependable foundation.',
    skills: ['React', 'Next.js', 'TypeScript', 'Canvas & motion'],
  },
];

export default function Home() {
  const [paused, setPaused] = useState(false);
  const [transform, setTransform] = useState(0);
  const [transforming, setTransforming] = useState(false);
  const [identitySignal, setIdentitySignal] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <BinaryField
        paused={paused}
        transform={transform}
        onTransformingChange={setTransforming}
        signal={identitySignal}
      />
      <EntryIntro />
      <MotionSystem />
      <Navigation />
      <main id="main">
        <section
          className="hero section-shell"
          id="top"
          aria-labelledby="hero-title"
        >
          <div className="hero-content">
            <HeroIdentity
              paused={paused}
              onResolve={() => setIdentitySignal((value) => value + 1)}
            />
            <p className="hero-role">
              SOFTWARE ENGINEER
              <span className="role-cursor" aria-hidden="true" />
            </p>
            <p className="hero-description">
              I build software, web applications, and digital
              <br className="wide-break" /> experiences. From the logic
              underneath
              <br className="wide-break" /> to the details you interact with.
            </p>
            <div className="hero-actions">
              <a href="#work" className="button-primary">
                Explore my work
                <ArrowDown size={18} />
              </a>
              <a href="#contact" className="text-link">
                Get in touch
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="field-annotation" aria-hidden="true">
            <span className="annotation-cross">+</span>
            <span>
              Move through the field.
              <br />
              Click to send a pulse.
            </span>
          </div>
          <div className="hero-bottom">
            <a className="scroll-cue" href="#work">
              <span className="scroll-track">
                <span />
              </span>
              Scroll to explore
            </a>
            <p className="hero-expertise">
              <span className="hero-expertise-domains">
                C / C++ <i /> 5G systems <i /> Web applications
              </span>
              <span>From the system to the screen.</span>
            </p>
            <div className="field-controls">
              <button
                className="field-transform"
                disabled={paused || reducedMotion || transforming}
                onClick={() => setTransform((value) => value + 1)}
                aria-label="Transform the binary circle into a code symbol"
              >
                <span aria-hidden="true">+</span>
                {transforming ? 'Transforming' : 'Transform'}
              </button>
              <button
                className="motion-toggle"
                onClick={() => setPaused(!paused)}
                aria-pressed={paused}
                disabled={reducedMotion}
                aria-label={
                  reducedMotion
                    ? 'Motion reduced by system preference'
                    : paused
                      ? 'Resume animation'
                      : 'Pause animation'
                }
              >
                {paused || reducedMotion ? (
                  <Play size={12} />
                ) : (
                  <Pause size={12} />
                )}
                <span>
                  {reducedMotion
                    ? 'Reduced motion'
                    : paused
                      ? 'Motion paused'
                      : 'Motion on'}
                </span>
              </button>
            </div>
          </div>
        </section>

        <section
          className="work-section section-shell content-surface"
          id="work"
          tabIndex={-1}
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <h2 id="work-title">
              Selected work<span className="heading-dot">.</span>
            </h2>
            <p>
              Different problems. Considered solutions.
              <br />A selection of what I’ve built.
            </p>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-row" key={project.slug}>
                <div className="project-info">
                  <h3>
                    <a href={`${deploymentBase}/work/${project.slug}`}>{project.name}</a>
                  </h3>
                  <p className="project-category">{project.category}</p>
                  <p className="project-summary">{project.summary}</p>
                  <ul
                    className="tech-list"
                    aria-label={`${project.name} technologies`}
                  >
                    {project.technologies.slice(0, 4).map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  <a href={`${deploymentBase}/work/${project.slug}`} className="project-link">
                    Explore the project
                    <ArrowUpRight size={20} />
                  </a>
                </div>
                <a
                  className={`project-preview preview-${project.slug}`}
                  href={`${deploymentBase}/work/${project.slug}`}
                  aria-label={`Explore ${project.name}`}
                >
                  <div className="preview-topline" aria-hidden="true">
                    <span className="preview-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>
                      {new URL(project.url).hostname}
                      {new URL(project.url).pathname === '/'
                        ? ''
                        : new URL(project.url).pathname}
                    </span>
                    <ArrowUpRight size={13} />
                  </div>
                  <div className="preview-image">
                    <Image
                      unoptimized
                      src={`${deploymentBase}${project.image}`}
                      alt={`${project.name} website homepage`}
                      width="1440"
                      height="1000"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <span className="preview-action" aria-hidden="true">
                    <ArrowUpRight size={26} />
                  </span>
                </a>
              </article>
            ))}
          </div>
          <a
            className="github-link text-link"
            href="https://github.com/artkelmendi"
            target="_blank"
            rel="noopener noreferrer"
          >
            More in the repositories
            <ArrowUpRight size={17} />
          </a>
        </section>

        <section
          className="engineering-section section-shell content-surface"
          id="engineering"
          tabIndex={-1}
          aria-labelledby="engineering-title"
        >
          <div className="engineering-intro">
            <h2 id="engineering-title">
              Built to work.
              <br />
              <span className="muted">Made to feel right.</span>
            </h2>
            <div>
              <p>
                I’m a software engineer with a foundation in C and C++, telecom
                systems, test automation, and hands-on 5G validation. I carry
                that engineering discipline into every interface I build.
              </p>
              <a
                href="https://github.com/artkelmendi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                Explore my GitHub
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="practice-list">
            {practices.map((practice) => (
              <article key={practice.name}>
                <h3>{practice.name}</h3>
                <p>{practice.description}</p>
                <ul className="practice-skills">
                  {practice.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="runtime-note">
            <span className="runtime-symbol" aria-hidden="true">
              {'{ }'}
            </span>
            <p>
              This page is part of the practice.
              <span>
                A responsive binary field. Pointer-driven depth. Motion that
                respects your preferences.
              </span>
            </p>
            <a href="#top" className="text-link">
              Experience it
              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        <section
          className="about-section section-shell content-surface"
          id="about"
          tabIndex={-1}
          aria-labelledby="about-title"
        >
          <div className="about-label">
            <h2 id="about-title">
              Behind devart<span className="heading-dot">.</span>
            </h2>
            <span className="about-name">Art Kelmendi / Software engineer</span>
            <div className="about-identity">
              <span className="about-identity-index">01 / THE PERSON BEHIND THE CODE</span>
              <div className="about-signature" aria-label="devart.">
                dev<strong>art</strong><span>.</span>
              </div>
              <div className="about-identity-rule" aria-hidden="true" />
              <dl className="about-identity-details">
                <div><dt>Foundation</dt><dd>C / C++ / 5G systems</dd></div>
                <div><dt>Expression</dt><dd>Software &amp; interfaces</dd></div>
              </dl>
              <span className="about-identity-note">Built with intent. Refined with care.</span>
            </div>
          </div>
          <div className="about-copy">
            <p className="about-statement">
              An engineer’s mindset.
              <br />
              <span className="muted">A maker’s attention to detail.</span>
            </p>
            <p>
              I’m Art, a software engineer with a particular appreciation for
              the web. I like taking complex problems apart and building clear,
              useful solutions.
            </p>
            <p>
              My work connects software development with a carefully built
              frontend. Architecture and interaction, structure and expression —
              I care about both sides of the screen.
            </p>
            <p>
              devart. is where those two instincts meet.
              <br />
              The developer and the craft.
            </p>
            <a href="#contact" className="text-link">
              Let’s build something
              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        <section
          className="contact-section section-shell"
          id="contact"
          tabIndex={-1}
          aria-labelledby="contact-title"
        >
          <h2 id="contact-title">
            <span className="contact-line">Let’s build</span>
            <span className="contact-line">
              something <em>good.</em>
            </span>
            <ArrowUpRight className="contact-arrow" aria-hidden="true" />
          </h2>
          <div className="contact-bottom">
            <div className="email-group">
              <a className="contact-email" href="mailto:info@devart.com">
                info@devart.com
                <ArrowUpRight size={23} />
              </a>
              <CopyEmail />
            </div>
            <p>Software. Interfaces. New possibilities.</p>
          </div>
        </section>
      </main>
      <footer className="site-footer section-shell">
        <a href="#top" aria-label="devart. home">
          <Wordmark />
        </a>
        <p>© {new Date().getFullYear()} devart.</p>
        <a
          href="https://github.com/artkelmendi"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-github"
        >
          GitHub
          <ArrowUpRight size={14} />
        </a>
        <a href="#top" className="back-to-top">
          Back to top
          <ArrowUp size={15} />
        </a>
      </footer>
    </>
  );
}
