"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { useMousePosition } from "@/hooks";

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

// Shield-Crab Mascot SVG Component with animations
function ShieldCrabMascot() {
  const { normalizedX, normalizedY, isReducedMotion } = useMousePosition();
  const [isInView, setIsInView] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const mascotRef = useRef<HTMLDivElement>(null);
  const waveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Maximum eye offset in pixels (±12px for dramatic pupil movement across eyeball)
  const MAX_EYE_OFFSET = 12;

  // Spring configuration for smooth eye movement
  const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };
  // Laggier spring for secondary highlights - trails behind main pupil
  const secondarySpringConfig = { stiffness: 80, damping: 20, mass: 1.0 };

  // Create spring-animated values for smooth eye tracking
  const targetEyeX = isInView && !isReducedMotion ? normalizedX * MAX_EYE_OFFSET : 0;
  const targetEyeY = isInView && !isReducedMotion ? normalizedY * MAX_EYE_OFFSET : 0;

  const eyeSpringX = useSpring(targetEyeX, springConfig);
  const eyeSpringY = useSpring(targetEyeY, springConfig);
  // Secondary springs with laggier physics for trailing effect
  const secondarySpringX = useSpring(targetEyeX, secondarySpringConfig);
  const secondarySpringY = useSpring(targetEyeY, secondarySpringConfig);

  // Update spring targets when mouse moves
  useEffect(() => {
    eyeSpringX.set(targetEyeX);
    eyeSpringY.set(targetEyeY);
    secondarySpringX.set(targetEyeX);
    secondarySpringY.set(targetEyeY);
  }, [targetEyeX, targetEyeY, eyeSpringX, eyeSpringY, secondarySpringX, secondarySpringY]);

  // Intersection Observer to detect when mascot is visible
  useEffect(() => {
    const currentRef = mascotRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle click for wave animation
  const handleClick = useCallback(() => {
    if (isReducedMotion) return;
    setIsWaving(true);
    // Clear any existing timeout
    if (waveTimeoutRef.current) clearTimeout(waveTimeoutRef.current);
    // Reset after animation completes
    waveTimeoutRef.current = setTimeout(() => setIsWaving(false), 600);
  }, [isReducedMotion]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (waveTimeoutRef.current) clearTimeout(waveTimeoutRef.current);
    };
  }, []);

  return (
    <motion.div
      ref={mascotRef}
      className="relative cursor-pointer"
      onClick={handleClick}
      animate={{
        y: [0, -15, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Glow effect behind mascot */}
      <div className="absolute inset-0 blur-3xl opacity-40">
        <div className="w-full h-full bg-gradient-to-br from-accent-coral/50 via-transparent to-accent-cyan/50 rounded-full" />
      </div>

      <svg
        width="280"
        height="320"
        viewBox="0 0 280 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-2xl"
      >
        {/* Shield background with gradient */}
        <defs>
          <linearGradient
            id="hero-shield-gradient"
            x1="40"
            y1="20"
            x2="240"
            y2="280"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ff4d4d" />
            <stop offset="0.5" stopColor="#ff6b6b" />
            <stop offset="1" stopColor="#00e5cc" />
          </linearGradient>
          <linearGradient
            id="hero-shield-fill"
            x1="40"
            y1="20"
            x2="240"
            y2="280"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ff4d4d" stopOpacity="0.15" />
            <stop offset="1" stopColor="#00e5cc" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="inner-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Main Shield */}
        <motion.path
          d="M140 20L40 60V145C40 215 80 265 140 290C200 265 240 215 240 145V60L140 20Z"
          fill="url(#hero-shield-fill)"
          stroke="url(#hero-shield-gradient)"
          strokeWidth="3"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Shield inner border */}
        <path
          d="M140 35L55 70V145C55 205 90 250 140 272C190 250 225 205 225 145V70L140 35Z"
          fill="none"
          stroke="url(#hero-shield-gradient)"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Crab Body - main shell */}
        <motion.ellipse
          cx="140"
          cy="165"
          rx="55"
          ry="40"
          fill="#ff4d4d"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
        />

        {/* Crab shell texture/highlights */}
        <ellipse cx="140" cy="158" rx="45" ry="28" fill="#ff6b6b" fillOpacity="0.4" />
        <ellipse cx="140" cy="152" rx="30" ry="15" fill="#ff8080" fillOpacity="0.3" />

        {/* Crab claws - Left with wave animation on click */}
        <motion.g
          initial={{ rotate: -10, x: -5 }}
          animate={
            isWaving
              ? {
                  rotate: [0, -25, 15, -20, 10, -5, 0],
                  x: [0, -8, 5, -6, 3, -2, 0],
                  y: [0, -5, 3, -4, 2, -1, 0],
                }
              : { rotate: [0, -8, 0], x: [0, -3, 0] }
          }
          transition={
            isWaving
              ? { duration: 0.6, ease: "easeOut" }
              : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ originX: "85px", originY: "115px" }}
        >
          <path
            d="M70 140C45 120 30 100 35 85C42 70 60 75 75 95L85 115"
            stroke="#ff4d4d"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          {/* Claw pincer left */}
          <path
            d="M35 85C25 80 20 70 30 65C40 60 48 70 42 82"
            stroke="#ff4d4d"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M35 85C30 95 20 95 18 88C16 80 25 75 35 85"
            stroke="#ff4d4d"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Crab claws - Right */}
        <motion.g
          initial={{ rotate: 10, x: 5 }}
          animate={{ rotate: [0, 8, 0], x: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        >
          <path
            d="M210 140C235 120 250 100 245 85C238 70 220 75 205 95L195 115"
            stroke="#ff4d4d"
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
          {/* Claw pincer right */}
          <path
            d="M245 85C255 80 260 70 250 65C240 60 232 70 238 82"
            stroke="#ff4d4d"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M245 85C250 95 260 95 262 88C264 80 255 75 245 85"
            stroke="#ff4d4d"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Crab legs - Left side */}
        <g>
          <path d="M95 185L65 210L55 235" stroke="#ff4d4d" strokeWidth="8" strokeLinecap="round" />
          <path d="M90 195L55 225L40 255" stroke="#ff4d4d" strokeWidth="7" strokeLinecap="round" />
          <path d="M88 205L50 240L35 270" stroke="#ff4d4d" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Crab legs - Right side */}
        <g>
          <path d="M185 185L215 210L225 235" stroke="#ff4d4d" strokeWidth="8" strokeLinecap="round" />
          <path d="M190 195L225 225L240 255" stroke="#ff4d4d" strokeWidth="7" strokeLinecap="round" />
          <path d="M192 205L230 240L245 270" stroke="#ff4d4d" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Eye stalks */}
        <path d="M115 135L108 115" stroke="#ff4d4d" strokeWidth="8" strokeLinecap="round" />
        <path d="M165 135L172 115" stroke="#ff4d4d" strokeWidth="8" strokeLinecap="round" />

        {/* Eyes with cursor tracking */}
        <motion.g
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Eye sockets (static) */}
          <circle cx="108" cy="108" r="14" fill="#050810" />
          <circle cx="172" cy="108" r="14" fill="#050810" />
          {/* Eye highlights (move with cursor) */}
          <motion.circle
            r="5"
            fill="white"
            style={{
              cx: useTransform(eyeSpringX, (x) => 112 + x),
              cy: useTransform(eyeSpringY, (y) => 104 + y),
            }}
          />
          <motion.circle
            r="5"
            fill="white"
            style={{
              cx: useTransform(eyeSpringX, (x) => 176 + x),
              cy: useTransform(eyeSpringY, (y) => 104 + y),
            }}
          />
          {/* Smaller highlights (lag behind main pupils for sloshy effect) */}
          <motion.circle
            r="2"
            fill="white"
            fillOpacity="0.5"
            style={{
              cx: useTransform(secondarySpringX, (x) => 105 + x),
              cy: useTransform(secondarySpringY, (y) => 112 + y),
            }}
          />
          <motion.circle
            r="2"
            fill="white"
            fillOpacity="0.5"
            style={{
              cx: useTransform(secondarySpringX, (x) => 169 + x),
              cy: useTransform(secondarySpringY, (y) => 112 + y),
            }}
          />
        </motion.g>

        {/* Mouth/smile */}
        <path
          d="M125 175C130 182 150 182 155 175"
          stroke="#050810"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Security badge on shield */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <circle cx="140" cy="235" r="18" fill="#00e5cc" fillOpacity="0.2" stroke="#00e5cc" strokeWidth="2" />
          <path
            d="M132 235L138 241L150 229"
            stroke="#00e5cc"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}

// Coming Soon Badge Component
function ComingSoonBadge() {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mb-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      style={{
        boxShadow: "0 0 20px rgba(0, 229, 204, 0.2), inset 0 0 20px rgba(0, 229, 204, 0.05)",
      }}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
      </span>
      <span className="font-satoshi text-sm font-medium text-accent-cyan">Coming Soon</span>
    </motion.div>
  );
}

export default function Hero() {
  const handleJoinWaitlist = () => {
    const element = document.querySelector("#waitlist");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewExamples = () => {
    const element = document.querySelector("#examples");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary pt-20">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial gradient glow behind content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[800px] h-[800px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 77, 77, 0.15) 0%, rgba(0, 229, 204, 0.1) 40%, transparent 70%)",
          }}
        />
      </div>

      {/* Secondary subtle glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-coral/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Coming Soon Badge */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <ComingSoonBadge />
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-clash text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="text-text-primary">The </span>
              <span className="gradient-text">security layer</span>
              <br />
              <span className="text-text-primary">for </span>
              <span className="text-accent-cyan">OpenClaw</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="font-satoshi text-lg sm:text-xl md:text-2xl text-text-muted mb-10 max-w-xl mx-auto lg:mx-0"
            >
              Stop your AI from going rogue. Intelligent guardrails that protect your AI agents from taking dangerous actions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {/* Primary CTA - Join Waitlist */}
              <motion.button
                onClick={handleJoinWaitlist}
                className="px-8 py-4 bg-accent-coral text-white font-satoshi font-semibold text-lg rounded-xl hover:shadow-glow-coral transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Waitlist
              </motion.button>

              {/* Secondary CTA - View Examples */}
              <motion.button
                onClick={handleViewExamples}
                className="px-8 py-4 border-2 border-accent-cyan/50 text-accent-cyan font-satoshi font-semibold text-lg rounded-xl hover:border-accent-cyan hover:bg-accent-cyan/10 hover:shadow-glow-cyan transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                View Examples
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Mascot */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <ShieldCrabMascot />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-text-muted"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-satoshi text-sm">Scroll to explore</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
