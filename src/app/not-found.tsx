import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary">
      <h1 className="font-clash text-6xl font-bold mb-4">404</h1>
      <p className="font-satoshi text-xl text-text-muted mb-8">
        Page not found
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-accent-coral text-white font-satoshi font-semibold rounded-xl hover:shadow-glow-coral transition-all duration-300"
      >
        Go Home
      </Link>
    </main>
  );
}
