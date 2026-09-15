import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="gw-simple-state">
      <p>Page not found</p>
      <h1>There is nothing at this address.</h1>
      <Link href="/ideas">Return to your ideas</Link>
    </main>
  );
}
