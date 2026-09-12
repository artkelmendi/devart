import type { Metadata } from 'next';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

export const dynamic = 'force-static';
const deploymentBase = import.meta.env.VITE_DEPLOYMENT_BASE ?? '';

export const metadata: Metadata = {
  title: 'devart. — Software Engineer',
  description:
    'Art Kelmendi is a software engineer building software, web applications, and carefully crafted frontend experiences. Explore the work and the engineering behind it.',
  icons: { icon: `${deploymentBase}/favicon.svg` },
  openGraph: {
    title: 'devart. — Software Engineer',
    description:
      'Engineering at the core. Craft in every detail. Software, web applications, and digital experiences by Art Kelmendi.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html:
              '<!-- THESIS: Code becomes identity: devart. assembles from binary fragments and sends a pulse into a flowing binary environment. OWN-WORLD: Near-black, silver-white, warm orange; lowercase terminal identity with heavier art, Manrope headings and Geist prose. STORY: Identity, systems and 5G engineering, real work, practice, person, conversation. FIRST VIEWPORT: Wordmark at left, software engineer underneath, binary volume at right; direct work and contact actions with a small replay control. FORM: User-pinned digital system with finite sliced-letter assembly; readable content and native scrolling throughout. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->',
          }}
        />
        {children}
      </body>
    </html>
  );
}
