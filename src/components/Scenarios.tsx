"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// Scenario data
const scenarios = [
  {
    id: "rogue-shopper",
    title: "The Rogue Shopper",
    description:
      "AI agent attempts to make unauthorized purchases on e-commerce sites. Clawsec intercepts and blocks the checkout action before any transaction occurs.",
    accentColor: "coral",
  },
  {
    id: "curious-crawler",
    title: "The Curious Crawler",
    description:
      "AI navigates to a known malicious URL or phishing site. Clawsec's real-time threat detection prevents the connection before any data is exposed.",
    accentColor: "cyan",
  },
  {
    id: "overzealous-cleaner",
    title: "The Overzealous Cleaner",
    description:
      "AI attempts to run destructive terminal commands like rm -rf. Clawsec's command analysis blocks dangerous operations before execution.",
    accentColor: "coral",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

// Icon Components
function BotIcon({ color }: { color: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={color === "coral" ? "text-accent-coral" : "text-accent-cyan"}
    >
      <rect
        x="8"
        y="12"
        width="24"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <circle cx="14" cy="22" r="3" fill="currentColor" />
      <circle cx="26" cy="22" r="3" fill="currentColor" />
      <path
        d="M16 28H24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 12V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="4" r="2" fill="currentColor" />
      <path
        d="M8 20H4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M36 20H32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShoppingCartIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-text-muted"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.3"
        fill="currentColor"
        fillOpacity="0.05"
      />
      <path
        d="M10 12H12L14 26H28L30 14H14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="30" r="2" fill="currentColor" />
      <circle cx="26" cy="30" r="2" fill="currentColor" />
      <path
        d="M18 18H24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M21 15V21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MaliciousUrlIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-text-muted"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.3"
        fill="currentColor"
        fillOpacity="0.05"
      />
      <circle
        cx="20"
        cy="20"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 20H30"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M20 10C23 14 24 17 24 20C24 23 23 26 20 30"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M20 10C17 14 16 17 16 20C16 23 17 26 20 30"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M17 14L23 26"
        stroke="#ff4d4d"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M23 14L17 26"
        stroke="#ff4d4d"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-text-muted"
    >
      <rect
        x="6"
        y="8"
        width="28"
        height="24"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.05"
      />
      <path
        d="M6 14H34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />
      <circle cx="10" cy="11" r="1" fill="#ff4d4d" />
      <circle cx="14" cy="11" r="1" fill="#ffc107" />
      <circle cx="18" cy="11" r="1" fill="#4caf50" />
      <path
        d="M12 20L16 24L12 28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 28H28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldBlockIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="shield-gradient"
          x1="8"
          y1="4"
          x2="36"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ff4d4d" />
          <stop offset="1" stopColor="#00e5cc" />
        </linearGradient>
        <filter id="shield-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M22 4L8 10V20C8 30 14 38 22 42C30 38 36 30 36 20V10L22 4Z"
        fill="url(#shield-gradient)"
        fillOpacity="0.2"
        stroke="url(#shield-gradient)"
        strokeWidth="2"
        filter="url(#shield-glow)"
      />
      <path
        d="M16 22L20 26L28 18"
        stroke="#00e5cc"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-text-muted"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 7L19 12L14 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getActionIcon(scenarioId: string) {
  switch (scenarioId) {
    case "rogue-shopper":
      return <ShoppingCartIcon />;
    case "curious-crawler":
      return <MaliciousUrlIcon />;
    case "overzealous-cleaner":
      return <TerminalIcon />;
    default:
      return null;
  }
}

// Icon Sequence Animation Component
function IconSequence({
  scenarioId,
  color,
  isInView,
}: {
  scenarioId: string;
  color: string;
  isInView: boolean;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isInView) {
      setStep(0);
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    // Step 1: Bot appears (already visible)
    timers.push(setTimeout(() => setStep(1), 300));
    // Step 2: Arrow 1 appears
    timers.push(setTimeout(() => setStep(2), 700));
    // Step 3: Action icon appears
    timers.push(setTimeout(() => setStep(3), 1100));
    // Step 4: Arrow 2 appears
    timers.push(setTimeout(() => setStep(4), 1500));
    // Step 5: Shield appears with block
    timers.push(setTimeout(() => setStep(5), 1900));

    return () => timers.forEach((t) => clearTimeout(t));
  }, [isInView]);

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

  const arrowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4 py-6">
      {/* Bot Icon */}
      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate={step >= 1 ? "visible" : "hidden"}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        <BotIcon color={color} />
      </motion.div>

      {/* Arrow 1 */}
      <motion.div
        variants={arrowVariants}
        initial="hidden"
        animate={step >= 2 ? "visible" : "hidden"}
        transition={{ duration: 0.2 }}
      >
        <ArrowIcon />
      </motion.div>

      {/* Action Icon */}
      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate={step >= 3 ? "visible" : "hidden"}
        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      >
        {getActionIcon(scenarioId)}
      </motion.div>

      {/* Arrow 2 */}
      <motion.div
        variants={arrowVariants}
        initial="hidden"
        animate={step >= 4 ? "visible" : "hidden"}
        transition={{ duration: 0.2 }}
      >
        <ArrowIcon />
      </motion.div>

      {/* Shield Block Icon */}
      <motion.div
        variants={iconVariants}
        initial="hidden"
        animate={step >= 5 ? "visible" : "hidden"}
        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
        className="relative"
      >
        <motion.div
          animate={
            step >= 5
              ? {
                  boxShadow: [
                    "0 0 0px rgba(0, 229, 204, 0)",
                    "0 0 20px rgba(0, 229, 204, 0.6)",
                    "0 0 10px rgba(0, 229, 204, 0.3)",
                  ],
                }
              : {}
          }
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-full"
        >
          <ShieldBlockIcon />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Blocked Badge Component
function BlockedBadge({ isVisible }: { isVisible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 10 }}
      animate={
        isVisible
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.5, y: 10 }
      }
      transition={{ duration: 0.4, type: "spring", stiffness: 300, delay: 0.2 }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-coral/20 border border-accent-coral/50"
      style={{
        boxShadow: isVisible ? "0 0 20px rgba(255, 77, 77, 0.3)" : "none",
      }}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-coral opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-coral" />
      </span>
      <span className="font-satoshi text-sm font-bold text-accent-coral tracking-wider">
        BLOCKED
      </span>
    </motion.div>
  );
}

// Scenario Card Component
function ScenarioCard({
  scenario,
  index,
}: {
  scenario: (typeof scenarios)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const [showBlocked, setShowBlocked] = useState(false);

  useEffect(() => {
    if (isInView) {
      // Show BLOCKED badge after sequence completes
      const timer = setTimeout(() => setShowBlocked(true), 2300);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
          scenario.accentColor === "cyan"
            ? "bg-accent-cyan/15"
            : "bg-accent-coral/15"
        }`}
      />

      {/* Card */}
      <motion.div
        className="relative glass rounded-2xl p-6 md:p-8 h-full border border-white/5 group-hover:border-white/20 transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Card number indicator */}
        <div
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-satoshi font-bold ${
            scenario.accentColor === "cyan"
              ? "bg-accent-cyan/10 text-accent-cyan"
              : "bg-accent-coral/10 text-accent-coral"
          }`}
        >
          {index + 1}
        </div>

        {/* Title */}
        <h3 className="font-clash text-xl md:text-2xl font-semibold text-text-primary mb-2 pr-10">
          {scenario.title}
        </h3>

        {/* Description */}
        <p className="font-satoshi text-text-muted text-sm md:text-base leading-relaxed mb-4">
          {scenario.description}
        </p>

        {/* Icon Sequence Animation */}
        <div className="bg-bg-primary/50 rounded-xl border border-white/5 mb-4">
          <IconSequence
            scenarioId={scenario.id}
            color={scenario.accentColor}
            isInView={isInView}
          />
        </div>

        {/* BLOCKED Badge */}
        <div className="flex justify-center">
          <BlockedBadge isVisible={showBlocked} />
        </div>

        {/* Decorative corner lines */}
        <div
          className={`absolute bottom-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            scenario.accentColor === "cyan"
              ? "text-accent-cyan"
              : "text-accent-coral"
          }`}
        >
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <path
              d="M0 64V0H64"
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Scenarios() {
  return (
    <section
      id="examples"
      className="relative py-24 md:py-32 bg-bg-secondary overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-accent-coral/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-cyan/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="font-satoshi text-sm font-medium text-accent-cyan">
              See It In Action
            </span>
          </motion.div>

          {/* Headline */}
          <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Real-Time{" "}
            <span className="gradient-text">Threat Prevention</span>
          </h2>

          {/* Subheading */}
          <p className="font-satoshi text-lg md:text-xl text-text-muted max-w-2xl mx-auto">
            Watch how Clawsec intercepts dangerous AI actions before they cause
            harm. Every block happens in milliseconds.
          </p>
        </motion.div>

        {/* Scenario Cards Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {scenarios.map((scenario, index) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              index={index}
            />
          ))}
        </motion.div>

        {/* Bottom CTA hint */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="font-satoshi text-text-muted text-sm">
            And many more scenarios...{" "}
            <span className="text-accent-cyan">all handled automatically</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
