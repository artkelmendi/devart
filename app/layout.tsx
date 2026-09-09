import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'devart. — Software Engineer',
  description:
    'Art Kelmendi is a software engineer building software, web applications, and carefully crafted frontend experiences. Explore the work and the engineering behind it.',
  icons: { icon: '/favicon.svg' },
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
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html:
              '<!-- THESIS: devart., software engineering as a quiet flowing binary environment. OWN-WORLD: Near-black, silver-white, a warm orange accent; lowercase Manrope identity with heavier art and Geist prose. STORY: Identity, systems and 5G engineering, real work with technical detail, practice, person, conversation. FIRST VIEWPORT: Large devart. at left with software engineer underneath, binary volume at right, direct work and contact actions. FORM: User-pinned digital system with authored system-assembly motion. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md -->',
          }}
        />
        {children}
      </body>
    </html>
  );
}
