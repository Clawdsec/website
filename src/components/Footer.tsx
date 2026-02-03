"use client";

import { motion } from "framer-motion";

const footerLinks = [
  { name: "GitHub", href: "https://github.com/clawsec", external: true },
  { name: "Docs", href: "#docs", external: false },
  { name: "OpenClaw", href: "https://openclaw.ai", external: true },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-bg-secondary border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Navigation Links */}
          <nav className="flex items-center gap-6 sm:gap-8">
            {footerLinks.map((link, index) => (
              <span key={link.name} className="flex items-center gap-6 sm:gap-8">
                <a
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="font-satoshi text-text-muted hover:text-text-primary transition-colors duration-300 flex items-center gap-1"
                >
                  {link.name}
                  {link.external && (
                    <svg
                      className="w-3 h-3 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  )}
                </a>
                {index < footerLinks.length - 1 && (
                  <span className="text-text-muted/30">|</span>
                )}
              </span>
            ))}
          </nav>

          {/* Tagline */}
          <p className="font-satoshi text-text-muted text-center">
            Built for the 🦞 community
          </p>

          {/* Copyright */}
          <p className="font-satoshi text-sm text-text-muted/60">
            &copy; {currentYear} Clawsec. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
