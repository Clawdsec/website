"use client";

import { Hero, Features, Scenarios, BeforeAfter, CodeExample, Waitlist, Footer } from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <Hero />

      <Features />

      <Scenarios />

      <BeforeAfter />

      <CodeExample />

      <Waitlist />

      <Footer />
    </main>
  );
}
