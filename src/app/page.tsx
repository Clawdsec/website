"use client";

import { Hero, Features, Scenarios, BeforeAfter, CodeExample, Waitlist, Footer, FloatingParticles } from "@/components";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary">
      <FloatingParticles />
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
