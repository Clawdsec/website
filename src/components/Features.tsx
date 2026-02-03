"use client";

import { motion } from "framer-motion";

// Feature data
const features = [
  {
    icon: "cart",
    title: "Purchase Protection",
    description: "Block bots from buying on Amazon, Stripe, etc.",
  },
  {
    icon: "globe",
    title: "Website Control",
    description: "Whitelist/blacklist which URLs AI can visit",
  },
  {
    icon: "explosion",
    title: "Destructive Commands",
    description: "Stop rm -rf, DROP TABLE, and dangerous operations",
  },
];

// Animation variants
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

// Icon components
function CartIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-accent-coral"
    >
      <circle cx="24" cy="24" r="24" fill="currentColor" fillOpacity="0.1" />
      <path
        d="M16 16H14L12 32H34L32 16H30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 16V14C20 12.9391 20.4214 11.9217 21.1716 11.1716C21.9217 10.4214 22.9391 10 24 10C25.0609 10 26.0783 10.4214 26.8284 11.1716C27.5786 11.9217 28 12.9391 28 14V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 24L22 28L30 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-accent-cyan"
    >
      <circle cx="24" cy="24" r="24" fill="currentColor" fillOpacity="0.1" />
      <circle
        cx="24"
        cy="24"
        r="12"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 24H36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 12C27 16 28 20 28 24C28 28 27 32 24 36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 12C21 16 20 20 20 24C20 28 21 32 24 36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExplosionIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-accent-coral"
    >
      <circle cx="24" cy="24" r="24" fill="currentColor" fillOpacity="0.1" />
      <path
        d="M24 12L26.5 20H34L28 25L30.5 34L24 28L17.5 34L20 25L14 20H21.5L24 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 20V28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 24H28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getIcon(iconName: string) {
  switch (iconName) {
    case "cart":
      return <CartIcon />;
    case "globe":
      return <GlobeIcon />;
    case "explosion":
      return <ExplosionIcon />;
    default:
      return null;
  }
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  index,
}: {
  icon: string;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative"
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${
          index === 1 ? "bg-accent-cyan/20" : "bg-accent-coral/20"
        }`}
      />

      {/* Card */}
      <div className="relative glass rounded-2xl p-8 h-full border border-white/5 group-hover:border-white/20 transition-all duration-300">
        {/* Icon */}
        <motion.div
          className="mb-6"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {getIcon(icon)}
        </motion.div>

        {/* Title */}
        <h3 className="font-clash text-xl md:text-2xl font-semibold text-text-primary mb-3">
          {title}
        </h3>

        {/* Description */}
        <p className="font-satoshi text-text-muted text-base md:text-lg leading-relaxed">
          {description}
        </p>

        {/* Decorative corner accent */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            index === 1 ? "text-accent-cyan" : "text-accent-coral"
          }`}
        >
          <svg
            viewBox="0 0 80 80"
            fill="none"
            className="w-full h-full"
          >
            <path
              d="M80 0V80H0"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section
      id="features"
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
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent-coral/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-coral/10 border border-accent-coral/30 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <span className="font-satoshi text-sm font-medium text-accent-coral">
              Core Features
            </span>
          </motion.div>

          {/* Headline */}
          <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Protection at{" "}
            <span className="gradient-text">Every Layer</span>
          </h2>

          {/* Subheading */}
          <p className="font-satoshi text-lg md:text-xl text-text-muted max-w-2xl mx-auto">
            Comprehensive security controls that keep your AI agents safe without limiting their capabilities.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
