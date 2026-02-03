"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

// Terminal line data types
interface TerminalLineData {
  type: "command" | "output" | "error" | "success" | "info";
  text: string;
}

// Without Clawsec terminal content
const withoutClawsecLines: TerminalLineData[] = [
  { type: "command", text: '> agent.purchase("MacBook Pro", $2,499)' },
  { type: "output", text: "Connecting to checkout..." },
  { type: "output", text: "Processing payment..." },
  { type: "error", text: "✗ Purchase completed. Card charged $2,499.00" },
];

// With Clawsec terminal content
const withClawsecLines: TerminalLineData[] = [
  { type: "command", text: '> agent.purchase("MacBook Pro", $2,499)' },
  { type: "output", text: "Connecting to checkout..." },
  { type: "success", text: "🛡 BLOCKED: Unauthorized purchase attempt" },
  { type: "info", text: "→ Action requires explicit user approval" },
];

// Get line styling based on type
function getLineStyle(type: TerminalLineData["type"]) {
  switch (type) {
    case "command":
      return "text-accent-cyan";
    case "error":
      return "text-accent-coral";
    case "success":
      return "text-accent-cyan";
    case "info":
      return "text-text-muted";
    default:
      return "text-text-muted";
  }
}

// Typewriter component that handles a single line
function TypewriterLine({
  line,
  onComplete,
  speed,
}: {
  line: TerminalLineData;
  onComplete: () => void;
  speed: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const hasCompleted = useRef(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    hasCompleted.current = false;

    const interval = setInterval(() => {
      if (index < line.text.length) {
        index++;
        setDisplayedText(line.text.slice(0, index));
      } else {
        clearInterval(interval);
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onComplete();
        }
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [line.text, speed, onComplete]);

  return (
    <div className={`font-mono text-sm md:text-base ${getLineStyle(line.type)}`}>
      {displayedText}
      <motion.span
        className="inline-block w-2 h-4 bg-current ml-0.5 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      />
    </div>
  );
}

// Completed line display (no animation)
function CompletedLine({ line }: { line: TerminalLineData }) {
  return (
    <div className={`font-mono text-sm md:text-base ${getLineStyle(line.type)}`}>
      {line.text}
    </div>
  );
}

// Terminal component with sequential line animation
function Terminal({
  title,
  lines,
  variant,
  shouldStart,
}: {
  title: string;
  lines: TerminalLineData[];
  variant: "danger" | "success";
  shouldStart: boolean;
}) {
  // State: -1 = not started, 0-3 = currently typing that line, 4+ = all done
  const [phase, setPhase] = useState(-1);
  const hasStarted = useRef(false);

  // Start animation when shouldStart becomes true (only once)
  useEffect(() => {
    if (shouldStart && !hasStarted.current) {
      hasStarted.current = true;
      const timer = setTimeout(() => {
        setPhase(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [shouldStart]);

  // Callback when current line finishes typing
  const handleLineComplete = useCallback(() => {
    // Wait a bit before moving to next line
    setTimeout(() => {
      setPhase((prev) => prev + 1);
    }, 400);
  }, []);

  const allDone = phase >= lines.length;
  const borderColor = variant === "danger" ? "border-accent-coral/30" : "border-accent-cyan/30";
  const headerBg = variant === "danger" ? "bg-accent-coral/10" : "bg-accent-cyan/10";
  const titleColor = variant === "danger" ? "text-accent-coral" : "text-accent-cyan";

  return (
    <motion.div
      className={`rounded-xl overflow-hidden border ${borderColor} bg-bg-card/80 backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Terminal header */}
      <div className={`px-4 py-3 ${headerBg} border-b ${borderColor} flex items-center gap-3`}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-coral/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className={`font-mono text-sm font-medium ${titleColor}`}>
          {title}
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-4 md:p-6 min-h-[200px] md:min-h-[220px] space-y-3">
        {lines.map((line, index) => {
          if (index < phase) {
            // This line is completed - show static text
            return <CompletedLine key={index} line={line} />;
          } else if (index === phase) {
            // This line is currently being typed
            return (
              <TypewriterLine
                key={index}
                line={line}
                onComplete={handleLineComplete}
                speed={line.type === "command" ? 35 : 25}
              />
            );
          }
          // Lines not yet reached - don't render
          return null;
        })}
      </div>

      {/* Status indicator */}
      <div className={`px-4 py-2 border-t ${borderColor} ${headerBg}`}>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: allDone ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              variant === "danger" ? "bg-accent-coral" : "bg-accent-cyan"
            }`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              variant === "danger" ? "bg-accent-coral" : "bg-accent-cyan"
            }`} />
          </span>
          <span className={`font-mono text-xs ${
            variant === "danger" ? "text-accent-coral" : "text-accent-cyan"
          }`}>
            {variant === "danger" ? "Transaction Complete" : "Threat Neutralized"}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      id="comparison"
      className="relative py-24 md:py-32 bg-bg-primary overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
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
        <div className="absolute top-1/4 left-0 w-80 h-80 bg-accent-coral/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-coral/10 to-accent-cyan/10 border border-white/10 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="font-satoshi text-sm font-medium gradient-text">
              Side by Side
            </span>
          </motion.div>

          <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            The Difference is <span className="gradient-text">Clear</span>
          </h2>

          <p className="font-satoshi text-lg md:text-xl text-text-muted max-w-2xl mx-auto">
            See what happens when an AI agent tries to make an unauthorized purchase
          </p>
        </motion.div>

        {/* Terminal Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Without Clawsec */}
          <div>
            <motion.div
              className="flex items-center justify-center gap-2 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <span className="text-2xl">❌</span>
              <span className="font-clash text-lg md:text-xl font-semibold text-text-primary">
                Without Clawsec
              </span>
            </motion.div>
            <Terminal
              title="ai-agent.sh"
              lines={withoutClawsecLines}
              variant="danger"
              shouldStart={isInView}
            />
          </div>

          {/* With Clawsec */}
          <div>
            <motion.div
              className="flex items-center justify-center gap-2 mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <span className="text-2xl">✅</span>
              <span className="font-clash text-lg md:text-xl font-semibold text-text-primary">
                With Clawsec
              </span>
            </motion.div>
            <Terminal
              title="ai-agent.sh (protected)"
              lines={withClawsecLines}
              variant="success"
              shouldStart={isInView}
            />
          </div>
        </div>

        {/* Bottom emphasis */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="font-satoshi text-text-muted">
            Same agent, same task.{" "}
            <span className="text-accent-cyan font-medium">Different outcome.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
