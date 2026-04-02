import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid, Thermometer, Eye, BarChart3,
  Download, CheckCircle2, Info, ChevronDown, ChevronUp
} from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider.jsx";

const TAB_CONFIG = [
  { id: "compare",    label: "Before / After",    icon: Eye },
  { id: "prediction", label: "Prediction Map",    icon: LayoutGrid },
  { id: "pca",        label: "PCA View",          icon: BarChart3 },
  { id: "heatmap",    label: "Confidence Heatmap", icon: Thermometer },
];

function ImageCard({ src, label, badge, badgeColor = "bg-sky-500" }) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = `data:image/png;base64,${src}`;
    a.download = `${label.replace(/\s+/g, "_")}.png`;
    a.click();
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-lifted border border-white/60">
      <img
        src={`data:image/png;base64,${src}`}
        alt={label}
        className="w-full aspect-square object-cover"
      />
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30
                      transition-all duration-300 flex items-center justify-center">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          onClick={handleDownload}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     bg-white rounded-xl px-4 py-2 flex items-center gap-2
                     text-sm font-medium text-gray-700 shadow-lifted"
        >
          <Download className="w-4 h-4" />
          Download
        </motion.button>
      </div>
      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t
                      from-black/60 to-transparent p-3">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium">{label}</span>
          {badge && (
            <span className={`${badgeColor} text-white text-xs px-2 py-0.5 rounded-full`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ClassBar({ name, percentage, color }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
          <span className="text-gray-700 font-medium">{name}</span>
        </div>
        <span className="text-gray-500 font-mono text-xs">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function StatsPanel({ predictions }) {
  const [expanded, setExpanded] = useState(false);
  const { class_distribution, mean_confidence, total_patches, grid_shape, patch_size, n_pca_components, n_bands } = predictions;

  return (
    <div className="card bg-white/80 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-600 text-gray-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Detection Results
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Patches", value: total_patches, color: "text-sky-600" },
          { label: "Avg Confidence", value: `${(mean_confidence * 100).toFixed(1)}%`, color: "text-violet-600" },
          { label: "Grid", value: `${grid_shape[0]}×${grid_shape[1]}`, color: "text-cyan-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
            <div className={`text-lg font-display font-700 ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Class distribution */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-600">Class Distribution</h4>
        {Object.entries(class_distribution).map(([name, data]) => (
          <ClassBar key={name} name={name} percentage={data.percentage} color={data.color} />
        ))}
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <h4 className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                <Info className="w-4 h-4" /> Model Parameters
              </h4>
              {[
                ["Patch Size",       `${patch_size}×${patch_size} px`],
                ["PCA Components",  n_pca_components],
                ["Spectral Bands",  n_bands],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-1 border-b border-gray-50">
                  <span className="text-gray-500">{k}</span>
                  <span className="text-gray-800 font-mono font-medium">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResultViewer({ result }) {
  const [activeTab, setActiveTab] = useState("compare");
  const { images, predictions } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Success banner */}
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200
                      rounded-xl px-4 py-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <p className="text-sm text-emerald-700 font-medium">
          Analysis complete — {predictions.total_patches} patches classified across a{" "}
          {predictions.grid_shape[0]}×{predictions.grid_shape[1]} grid.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-gray-100/80 p-1 rounded-xl overflow-x-auto">
        {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => setActiveTab(id)}
            whileTap={{ scale: 0.96 }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                        font-medium whitespace-nowrap flex-1 justify-center
                        transition-all duration-200
                        ${activeTab === id
                          ? "bg-white text-gray-800 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                        }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "compare" && (
            <BeforeAfterSlider
              beforeSrc={images.original}
              afterSrc={images.prediction}
              beforeLabel="Original"
              afterLabel="Predicted"
            />
          )}

          {activeTab === "prediction" && (
            <ImageCard
              src={images.prediction}
              label="Patch Prediction Overlay"
              badge="CNN Output"
              badgeColor="bg-violet-500"
            />
          )}

          {activeTab === "pca" && (
            <ImageCard
              src={images.pca_view}
              label="PCA False-Color Visualization"
              badge="PCA"
              badgeColor="bg-sky-500"
            />
          )}

          {activeTab === "heatmap" && (
            <ImageCard
              src={images.heatmap}
              label="Confidence Heatmap"
              badge="Jet Colormap"
              badgeColor="bg-orange-500"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Stats panel */}
      <StatsPanel predictions={predictions} />
    </motion.div>
  );
}
