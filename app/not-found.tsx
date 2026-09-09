import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="not-found">
      <p>404 / Not found</p>
      <h1>A little off course.</h1>
      <p>This page doesn’t exist. The work is still here.</p>
      <Link href="/" className="primary-link">
        Back to devart.
      </Link>
    </main>
  );
}
