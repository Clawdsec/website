"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// YAML configuration content
const yamlContent = `# Clawsec Configuration
rules:
  purchase_protection:
    enabled: true
    blocked_domains:
      - amazon.com
      - stripe.com
      - shopify.com
    severity: critical

  website_control:
    mode: whitelist
    allowed_domains:
      - docs.openclaw.ai
      - github.com
    severity: high

  destructive_commands:
    enabled: true
    blocked_patterns:
      - "rm -rf"
      - "DROP TABLE"
      - "DELETE FROM"
    severity: critical`;

// Syntax highlighting function for YAML
function highlightYaml(code: string): JSX.Element[] {
  const lines = code.split("\n");

  return lines.map((line, lineIndex) => {
    const elements: JSX.Element[] = [];
    let remaining = line;
    let keyIndex = 0;

    // Handle comments
    if (remaining.trim().startsWith("#")) {
      return (
        <div key={lineIndex} className="code-line">
          <span className="text-text-muted/60 italic">{remaining}</span>
        </div>
      );
    }

    // Handle empty lines
    if (remaining.trim() === "") {
      return (
        <div key={lineIndex} className="code-line">
          &nbsp;
        </div>
      );
    }

    // Extract leading whitespace
    const leadingWhitespace = remaining.match(/^(\s*)/)?.[1] || "";
    if (leadingWhitespace) {
      elements.push(
        <span key={`ws-${keyIndex++}`}>{leadingWhitespace}</span>
      );
      remaining = remaining.slice(leadingWhitespace.length);
    }

    // Handle list items (lines starting with -)
    if (remaining.startsWith("- ")) {
      elements.push(
        <span key={`dash-${keyIndex++}`} className="text-text-muted">
          -{" "}
        </span>
      );
      remaining = remaining.slice(2);

      // Check if it's a quoted string
      if (remaining.startsWith('"') && remaining.endsWith('"')) {
        elements.push(
          <span key={`str-${keyIndex++}`} className="text-green-400">
            {remaining}
          </span>
        );
      } else {
        // Plain string value
        elements.push(
          <span key={`val-${keyIndex++}`} className="text-green-400">
            {remaining}
          </span>
        );
      }

      return (
        <div key={lineIndex} className="code-line">
          {elements}
        </div>
      );
    }

    // Handle key-value pairs
    const colonIndex = remaining.indexOf(":");
    if (colonIndex !== -1) {
      const key = remaining.slice(0, colonIndex);
      const rest = remaining.slice(colonIndex);

      // Key
      elements.push(
        <span key={`key-${keyIndex++}`} className="text-accent-cyan">
          {key}
        </span>
      );

      // Colon
      elements.push(
        <span key={`colon-${keyIndex++}`} className="text-text-muted">
          :
        </span>
      );

      // Value (if any)
      const value = rest.slice(1).trim();
      if (value) {
        elements.push(
          <span key={`space-${keyIndex++}`}> </span>
        );

        // Boolean values
        if (value === "true" || value === "false") {
          elements.push(
            <span key={`bool-${keyIndex++}`} className="text-purple-400">
              {value}
            </span>
          );
        }
        // String values (severity levels, modes, etc.)
        else if (value === "critical" || value === "high" || value === "medium" || value === "low") {
          elements.push(
            <span key={`severity-${keyIndex++}`} className="text-accent-coral">
              {value}
            </span>
          );
        }
        else if (value === "whitelist" || value === "blacklist") {
          elements.push(
            <span key={`mode-${keyIndex++}`} className="text-yellow-400">
              {value}
            </span>
          );
        }
        // Quoted strings
        else if (value.startsWith('"') && value.endsWith('"')) {
          elements.push(
            <span key={`qstr-${keyIndex++}`} className="text-green-400">
              {value}
            </span>
          );
        }
        // Other values
        else {
          elements.push(
            <span key={`other-${keyIndex++}`} className="text-text-primary">
              {value}
            </span>
          );
        }
      }

      return (
        <div key={lineIndex} className="code-line">
          {elements}
        </div>
      );
    }

    // Default: plain text
    return (
      <div key={lineIndex} className="code-line">
        <span className="text-text-primary">{remaining}</span>
      </div>
    );
  });
}

// Copy button component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {copied ? (
        <>
          <svg
            className="w-4 h-4 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-mono text-xs text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span className="font-mono text-xs text-text-muted">Copy</span>
        </>
      )}
    </motion.button>
  );
}

export default function CodeExample() {
  return (
    <section
      id="docs"
      className="relative py-24 md:py-32 bg-bg-primary overflow-hidden"
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
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-accent-coral/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-coral/10 to-accent-cyan/10 border border-white/10 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="font-satoshi text-sm font-medium gradient-text">
              Configuration
            </span>
          </motion.div>

          {/* Headline */}
          <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Simple{" "}
            <span className="gradient-text">Setup</span>
          </h2>

          {/* Subheading */}
          <p className="font-satoshi text-lg md:text-xl text-text-muted max-w-2xl mx-auto">
            Define your security rules in a simple YAML configuration file
          </p>
        </motion.div>

        {/* Code Block */}
        <motion.div
          className="rounded-xl overflow-hidden border border-white/10 bg-bg-card/80 backdrop-blur-sm shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Code block header */}
          <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Window controls */}
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-coral/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              {/* File name */}
              <span className="font-mono text-sm text-text-muted">
                clawsec.yaml
              </span>
            </div>

            {/* Copy button */}
            <CopyButton text={yamlContent} />
          </div>

          {/* Code content */}
          <div className="p-4 md:p-6 overflow-x-auto">
            <pre className="font-mono text-sm md:text-base leading-relaxed">
              <code>{highlightYaml(yamlContent)}</code>
            </pre>
          </div>
        </motion.div>

        {/* Feature highlights below code */}
        <motion.div
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: "Purchase Blocking",
              description: "Prevent unauthorized purchases",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              ),
              title: "Domain Whitelist",
              description: "Control website access",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ),
              title: "Severity Levels",
              description: "Fine-grained control",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex items-center gap-3 p-4 rounded-lg bg-bg-card/50 border border-white/5"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-accent-coral/20 to-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-clash text-sm font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="font-satoshi text-xs text-text-muted">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
