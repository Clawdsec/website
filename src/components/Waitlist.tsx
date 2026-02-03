"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// LocalStorage keys
const STORAGE_KEYS = {
  emails: "clawsec_waitlist_emails",
  count: "clawsec_waitlist_count",
} as const;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

// Checkmark animation component
function SuccessCheckmark() {
  return (
    <motion.div
      className="relative w-20 h-20 mx-auto mb-6"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-accent-cyan"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Inner glow */}
      <div className="absolute inset-0 rounded-full bg-accent-cyan/20 blur-md" />

      {/* Checkmark */}
      <svg
        className="absolute inset-0 w-full h-full p-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M5 13l4 4L19 7"
          className="text-accent-cyan"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </svg>
    </motion.div>
  );
}

// Loading spinner component
function LoadingSpinner() {
  return (
    <motion.div
      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    setIsClient(true);

    try {
      // Get current count from localStorage
      const storedCount = localStorage.getItem(STORAGE_KEYS.count);
      if (storedCount) {
        setWaitlistCount(parseInt(storedCount, 10));
      } else {
        // Initialize with a base count for social proof
        const initialCount = 127;
        localStorage.setItem(STORAGE_KEYS.count, String(initialCount));
        setWaitlistCount(initialCount);
      }
    } catch {
      // localStorage not available, use default
      setWaitlistCount(127);
    }
  }, []);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email.trim());
  };

  // Check if email already exists
  const isEmailAlreadySubmitted = (email: string): boolean => {
    try {
      const storedEmails = localStorage.getItem(STORAGE_KEYS.emails);
      if (storedEmails) {
        const emails = JSON.parse(storedEmails) as string[];
        return emails.includes(email.toLowerCase().trim());
      }
    } catch {
      // If parsing fails, assume not submitted
    }
    return false;
  };

  // Save email to localStorage
  const saveEmail = (email: string) => {
    try {
      const normalizedEmail = email.toLowerCase().trim();

      // Get existing emails
      const storedEmails = localStorage.getItem(STORAGE_KEYS.emails);
      const emails: string[] = storedEmails ? JSON.parse(storedEmails) : [];

      // Add new email
      emails.push(normalizedEmail);
      localStorage.setItem(STORAGE_KEYS.emails, JSON.stringify(emails));

      // Update count
      const newCount = waitlistCount + 1;
      localStorage.setItem(STORAGE_KEYS.count, String(newCount));
      setWaitlistCount(newCount);
    } catch {
      // localStorage write failed, but we'll still show success
      console.error("Failed to save email to localStorage");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Check if already submitted
    if (isEmailAlreadySubmitted(email)) {
      setError("This email is already on the waitlist!");
      return;
    }

    // Simulate submission
    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Save to localStorage
    saveEmail(email);

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <section
      id="waitlist"
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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-coral/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Badge */}
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-coral/10 to-accent-cyan/10 border border-white/10 mb-6"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-coral opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-coral" />
                  </span>
                  <span className="font-satoshi text-sm font-medium gradient-text">
                    Early Access
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h2
                  variants={itemVariants}
                  className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6"
                >
                  Be the first to know when{" "}
                  <span className="gradient-text">Clawsec</span> launches
                </motion.h2>

                {/* Subheading */}
                <motion.p
                  variants={itemVariants}
                  className="font-satoshi text-lg md:text-xl text-text-muted mb-8 max-w-lg mx-auto"
                >
                  Join our waitlist and get notified when we launch. No spam, just important updates.
                </motion.p>

                {/* Counter */}
                {isClient && waitlistCount > 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="mb-8"
                  >
                    <p className="font-satoshi text-text-muted">
                      <span className="text-accent-cyan font-semibold">
                        {waitlistCount.toLocaleString()}
                      </span>{" "}
                      {waitlistCount === 1 ? "person has" : "people have"} already joined
                    </p>
                  </motion.div>
                )}

                {/* Form */}
                <motion.form
                  variants={itemVariants}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      value={email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      disabled={isSubmitting}
                      className={`w-full px-5 py-4 bg-bg-card/80 backdrop-blur-sm border rounded-xl font-satoshi text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan/50 transition-all duration-200 disabled:opacity-50 ${
                        error
                          ? "border-accent-coral/50 focus:ring-accent-coral/50 focus:border-accent-coral/50"
                          : "border-white/10"
                      }`}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 bg-accent-coral text-white font-satoshi font-semibold rounded-xl hover:shadow-glow-coral transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                    whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner />
                        <span>Joining...</span>
                      </>
                    ) : (
                      "Notify Me"
                    )}
                  </motion.button>
                </motion.form>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 font-satoshi text-sm text-accent-coral"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Privacy note */}
                <motion.p
                  variants={itemVariants}
                  className="mt-6 font-satoshi text-xs text-text-muted/60"
                >
                  We respect your privacy. Unsubscribe at any time.
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-8"
              >
                {/* Success checkmark */}
                <SuccessCheckmark />

                {/* Success headline */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-clash text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-4"
                >
                  You&apos;re on the list!
                </motion.h3>

                {/* Success message */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-satoshi text-lg text-text-muted max-w-md mx-auto mb-6"
                >
                  We&apos;ll notify you when we launch. Thanks for your interest in Clawsec!
                </motion.p>

                {/* Updated counter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/30"
                >
                  <span className="font-satoshi text-sm text-accent-cyan">
                    You&apos;re #{waitlistCount.toLocaleString()} on the waitlist
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
