import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'devart. — Type Study',
  description:
    'Six typographic directions for the devart. software engineering identity.',
};

export default function TypeStudyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
