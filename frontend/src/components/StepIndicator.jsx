import React from "react";
import { motion } from "framer-motion";
import { Upload, Grid3x3, BarChart3, Brain, Image, ChevronRight } from "lucide-react";

const STEPS = [
  {
    icon: Upload,
    title: "Upload Image",
    desc: "Upload any hyperspectral or standard image to begin the pipeline.",
    color: "from-sky-400 to-sky-500",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  {
    icon: BarChart3,
    title: "PCA Reduction",
    desc: "Each patch undergoes PCA to reduce spectral bands to key components.",
    color: "from-cyan-400 to-cyan-500",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
  },
  {
    icon: Grid3x3,
    title: "Patch Extraction",
    desc: "Image is divided into 16×16 or 32×32 non-overlapping patches.",
    color: "from-violet-400 to-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    icon: Brain,
    title: "CNN Classification",
    desc: "A convolutional neural network classifies each patch into a land-use class.",
    color: "from-emerald-400 to-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    icon: Image,
    title: "Visualization",
    desc: "Predictions are overlaid on the original image with colored patches + heatmap.",
    color: "from-orange-400 to-pink-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function StepIndicator() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200
                          rounded-full px-4 py-1.5 text-sm font-medium text-violet-700 mb-4">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            Processing Pipeline
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-700 text-gray-900 mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Five stages transform your image into a fully annotated prediction map.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5
                          bg-gradient-to-r from-sky-200 via-violet-200 to-pink-200 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`card ${step.bg} border ${step.border} text-center
                              hover:shadow-lifted transition-all duration-300 cursor-default`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color}
                                   flex items-center justify-center mx-auto mb-4 shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200
                                  flex items-center justify-center mx-auto mb-3
                                  text-xs font-bold text-gray-500 font-mono">
                    {i + 1}
                  </div>
                  <h3 className="font-display font-600 text-gray-900 mb-2 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Class legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 card bg-white/70"
        >
          <h3 className="font-display font-600 text-gray-800 mb-4 text-center">
            Detection Classes
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Vegetation",  color: "#228B22" },
              { label: "Urban",       color: "#808080" },
              { label: "Water Body",  color: "#1E90FF" },
              { label: "Barren Land", color: "#D2B48C" },
              { label: "Anomaly",     color: "#DC143C" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-700">
                <div
                  className="w-4 h-4 rounded-sm shadow-sm"
                  style={{ backgroundColor: color }}
                />
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
