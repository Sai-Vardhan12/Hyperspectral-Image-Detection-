import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Brain, ScanLine, Layers3, ChevronRight } from "lucide-react";

const FeaturePill = ({ icon: Icon, label, color }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -2 }}
    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium
                backdrop-blur-sm ${color}`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </motion.div>
);

const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none ${className}`}
  />
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Floating background orbs */}
      <FloatingOrb className="w-96 h-96 bg-sky-400 -top-20 -left-20" delay={0} />
      <FloatingOrb className="w-80 h-80 bg-violet-400 top-10 right-10" delay={2} />
      <FloatingOrb className="w-64 h-64 bg-cyan-400 bottom-20 left-1/3" delay={4} />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Badge */}
          <motion.div variants={item} className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm
                            border border-sky-200 rounded-full px-4 py-1.5
                            text-sm font-medium text-sky-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              PCA + CNN · Patch-Based Detection · Real-Time Visualization
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="font-display text-5xl md:text-7xl font-800 leading-[1.05]
                       text-gray-900 mb-6 tracking-tight"
          >
            Hyperspectral
            <br />
            <span className="text-gradient">Object Detection</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10
                       leading-relaxed font-body"
          >
            Upload any image and watch it transform — patch-by-patch — through
            PCA dimensionality reduction and CNN classification with vivid,
            color-coded prediction overlays.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            <FeaturePill
              icon={ScanLine}
              label="Patch-Based Processing"
              color="bg-sky-50/80 border-sky-200 text-sky-700"
            />
            <FeaturePill
              icon={Layers3}
              label="PCA Dimensionality Reduction"
              color="bg-violet-50/80 border-violet-200 text-violet-700"
            />
            <FeaturePill
              icon={Brain}
              label="CNN Classification"
              color="bg-cyan-50/80 border-cyan-200 text-cyan-700"
            />
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.a
              href="#demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 btn-primary text-base px-8 py-3.5 rounded-2xl"
            >
              Launch Demo
              <ChevronRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white/70 backdrop-blur-sm
                         border border-gray-200 text-gray-700 font-semibold
                         text-base px-8 py-3.5 rounded-2xl hover:border-sky-300
                         hover:text-sky-600 transition-all duration-200"
            >
              How It Works
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
