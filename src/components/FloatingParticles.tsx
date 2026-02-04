"use client";

import { useMemo, useState, useEffect } from "react";

// Generate deterministic random values for particles
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

interface Particle {
  id: number;
  left: number; // percentage
  top: number; // percentage
  size: number; // px
  color: "coral" | "cyan";
  opacity: number;
  duration: number; // seconds
  delay: number; // seconds
  swayAmount: number; // px
}

function generateParticles(count: number): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const seed = i + 1;
    particles.push({
      id: i,
      left: seededRandom(seed * 1) * 100,
      top: seededRandom(seed * 2) * 100,
      size: 2 + seededRandom(seed * 3) * 2, // 2-4px
      color: seededRandom(seed * 4) > 0.5 ? "coral" : "cyan",
      opacity: 0.3 + seededRandom(seed * 5) * 0.2, // 0.3-0.5
      duration: 40 + seededRandom(seed * 6) * 20, // 40-60s
      delay: seededRandom(seed * 7) * -40, // stagger start times
      swayAmount: 20 + seededRandom(seed * 8) * 30, // 20-50px horizontal sway
    });
  }

  return particles;
}

export default function FloatingParticles() {
  const [isMounted, setIsMounted] = useState(false);
  const particles = useMemo(() => generateParticles(35), []);

  // Only render on client to avoid hydration mismatch from floating point precision differences
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="floating-particle absolute rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color === "coral" ? "#ff4d4d" : "#00e5cc",
            opacity: particle.opacity,
            filter: `blur(${particle.size > 3 ? 1 : 0.5}px)`,
            ["--particle-sway" as string]: `${particle.swayAmount}px`,
            animation: `particle-float ${particle.duration}s linear ${particle.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
