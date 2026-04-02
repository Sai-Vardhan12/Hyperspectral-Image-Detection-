import React from "react";
import { motion } from "framer-motion";

const STEPS = [
  "Loading image...",
  "Simulating hyperspectral bands...",
  "Extracting patches...",
  "Running PCA reduction...",
  "Classifying with CNN...",
  "Rendering visualizations...",
];

export default function LoadingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      {/* Animated rings */}
      <div className="relative w-24 h-24 mb-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: i === 0 ? "#0ea5e9" : i === 1 ? "#8b5cf6" : "#22d3ee",
              scale: 1 + i * 0.25,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1 + i * 0.25, 1.1 + i * 0.25, 1 + i * 0.25] }}
            transition={{
              rotate: { duration: 3 - i * 0.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
            }}
          />
        ))}
        {/* Center dot */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 m-auto w-6 h-6 rounded-full
                     bg-gradient-to-br from-sky-500 to-violet-500 shadow-glow"
        />
      </div>

      <h3 className="font-display text-xl font-700 text-gray-800 mb-2">
        Analyzing Image
      </h3>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">
        Running patch-based hyperspectral detection pipeline
      </p>

      {/* Step indicators */}
      <div className="w-full max-w-xs space-y-2">
        {STEPS.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.4, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.4 + 0.2 }}
              className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-violet-500
                         flex items-center justify-center flex-shrink-0"
            >
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-white"
              />
            </motion.div>
            <span className="text-sm text-gray-600">{step}</span>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-full max-w-xs h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-sky-500 to-violet-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "90%" }}
          transition={{ duration: STEPS.length * 0.4 + 0.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}
