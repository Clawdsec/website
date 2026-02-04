"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useMousePosition } from "@/hooks";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Examples", href: "#examples" },
  { name: "Docs", href: "#docs" },
  { name: "GitHub", href: "https://github.com/clawsec", external: true },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

  // Mouse position for eye tracking
  const { normalizedX, normalizedY, isReducedMotion } = useMousePosition();

  // Animation controller for claw wave
  const clawControls = useAnimation();

  // Calculate eye offset (only when scrolled and not reduced motion)
  const maxEyeOffset = 2; // px
  const eyeOffsetX = isScrolled && !isReducedMotion ? normalizedX * maxEyeOffset : 0;
  const eyeOffsetY = isScrolled && !isReducedMotion ? normalizedY * maxEyeOffset : 0;

  // Claw wave animation handler
  const handleLogoClick = async () => {
    if (isReducedMotion) return;

    // Trigger wave animation on left claw
    await clawControls.start({
      rotate: [0, -15, 10, -8, 5, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string, external?: boolean) => {
    if (external) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      // Smooth scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "py-3" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`glass rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300 ${
              isScrolled ? "shadow-lg shadow-black/20" : ""
            }`}
          >
            {/* Logo */}
            <motion.a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogoClick();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl" role="img" aria-label="Clawsec logo">
                {/* Crab with Shield SVG */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:scale-110 transition-transform duration-300"
                >
                  {/* Shield background with breathing glow */}
                  <path
                    d="M16 2L4 7V14.5C4 21.5 9 27.5 16 30C23 27.5 28 21.5 28 14.5V7L16 2Z"
                    fill="url(#shield-gradient-nav)"
                    fillOpacity="0.2"
                    stroke="url(#shield-gradient-nav)"
                    strokeWidth="1.5"
                    className={`${!isReducedMotion ? "animate-breathing-glow" : ""}`}
                    style={{
                      filter: isLogoHovered && !isReducedMotion ? "drop-shadow(0 0 6px rgba(255, 77, 77, 0.6))" : undefined,
                    }}
                  />
                  {/* Crab body */}
                  <ellipse cx="16" cy="17" rx="6" ry="4" fill="#ff4d4d" />
                  {/* Left claw with wave animation */}
                  <motion.path
                    d="M8 14C6 12 5 10 6.5 9C8 8 9.5 9.5 10.5 11.5"
                    stroke="#ff4d4d"
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={clawControls}
                    style={{ transformOrigin: "10.5px 11.5px" }}
                  />
                  {/* Right claw */}
                  <path
                    d="M24 14C26 12 27 10 25.5 9C24 8 22.5 9.5 21.5 11.5"
                    stroke="#ff4d4d"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {/* Crab eyes with tracking and hover scale */}
                  <motion.g
                    animate={{
                      scale: isLogoHovered && !isReducedMotion ? 1.15 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ transformOrigin: "16px 15px" }}
                  >
                    {/* Left eye */}
                    <circle
                      cx={13 + eyeOffsetX}
                      cy={15 + eyeOffsetY}
                      r="1.5"
                      fill="#050810"
                    />
                    {/* Right eye */}
                    <circle
                      cx={19 + eyeOffsetX}
                      cy={15 + eyeOffsetY}
                      r="1.5"
                      fill="#050810"
                    />
                    {/* Left eye shine */}
                    <circle
                      cx={13.5 + eyeOffsetX}
                      cy={14.5 + eyeOffsetY}
                      r="0.5"
                      fill="white"
                    />
                    {/* Right eye shine */}
                    <circle
                      cx={19.5 + eyeOffsetX}
                      cy={14.5 + eyeOffsetY}
                      r="0.5"
                      fill="white"
                    />
                  </motion.g>
                  <defs>
                    <linearGradient
                      id="shield-gradient-nav"
                      x1="4"
                      y1="2"
                      x2="28"
                      y2="30"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#ff4d4d" />
                      <stop offset="1" stopColor="#00e5cc" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span className="font-clash text-xl font-bold text-text-primary group-hover:text-accent-coral transition-colors duration-300">
                Clawsec
              </span>
            </motion.a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <motion.button
                  key={link.name}
                  onClick={() => handleNavClick(link.href, link.external)}
                  className="font-satoshi text-text-muted hover:text-text-primary transition-colors duration-300 relative group"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {link.name}
                  {link.external && (
                    <svg
                      className="inline-block ml-1 w-3 h-3 opacity-50"
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
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-cyan group-hover:w-full transition-all duration-300" />
                </motion.button>
              ))}
            </div>

            {/* CTA Button - Desktop */}
            <motion.button
              onClick={() => handleNavClick("#waitlist")}
              className="hidden md:block px-5 py-2.5 bg-accent-coral text-white font-satoshi font-semibold rounded-lg hover:shadow-glow-coral transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Waitlist
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-white/5 transition-colors duration-300"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <motion.span
                className="w-5 h-0.5 bg-text-primary rounded-full"
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 2 : -3,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-text-primary rounded-full"
                animate={{
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-text-primary rounded-full"
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -2 : 3,
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-20 left-4 right-4 glass rounded-2xl p-6 z-50 md:hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    onClick={() => handleNavClick(link.href, link.external)}
                    className="font-satoshi text-lg text-text-muted hover:text-text-primary text-left py-2 border-b border-white/5 last:border-0 transition-colors duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {link.name}
                    {link.external && (
                      <svg
                        className="inline-block ml-2 w-4 h-4 opacity-50"
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
                  </motion.button>
                ))}

                {/* Mobile CTA */}
                <motion.button
                  onClick={() => handleNavClick("#waitlist")}
                  className="mt-2 px-5 py-3 bg-accent-coral text-white font-satoshi font-semibold rounded-lg hover:shadow-glow-coral transition-all duration-300 w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Waitlist
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
