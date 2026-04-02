import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import HeroSection from "../components/HeroSection.jsx";
import StepIndicator from "../components/StepIndicator.jsx";
import UploadPanel from "../upload/UploadPanel.jsx";
import ResultViewer from "../visualization/ResultViewer.jsx";
import LoadingAnimation from "../components/LoadingAnimation.jsx";
import { AlertCircle, RotateCcw } from "lucide-react";
import TeamSection from "../components/TeamSection.jsx";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async ({ file, patchSize, pcaComponents, nClasses }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("patch_size", patchSize);
      formData.append("n_pca_components", pcaComponents);
      formData.append("n_classes", nClasses);
      formData.append("n_bands", 30);

      const response = await axios.post(`${API_BASE}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      if (response.data?.success) {
        setResult(response.data);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to connect to backend. Make sure the API is running on port 8000.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* How It Works */}
      <StepIndicator />

      {/* ── DEMO SECTION ── */}
      <section id="demo" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200
                            rounded-full px-4 py-1.5 text-sm font-medium text-sky-700 mb-4">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              Live Demo
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-700 text-gray-900 mb-4">
              Try It <span className="text-gradient">Now</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Upload any image — satellite, aerial, or standard photo — and watch the
              PCA + CNN pipeline classify every patch in real time.
            </p>
          </motion.div>

          {/* Main card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* LEFT — Upload panel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-600 text-gray-800 text-lg">
                  Upload Image
                </h3>
                {result && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-sm text-gray-500
                               hover:text-sky-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    New Image
                  </motion.button>
                )}
              </div>

              <UploadPanel onSubmit={handleSubmit} isLoading={isLoading} />

              {/* Info box */}
              {!result && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-5 bg-sky-50/80 border border-sky-100 rounded-xl p-4"
                >
                  <p className="text-xs text-sky-700 leading-relaxed">
                    <strong>Tip:</strong> Satellite or aerial images show the most
                    interesting results. Any image format works — the backend will
                    simulate a 30-band hyperspectral cube automatically.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* RIGHT — Results */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card p-6 min-h-[460px]"
            >
              <h3 className="font-display font-600 text-gray-800 text-lg mb-5">
                Detection Output
              </h3>

              <AnimatePresence mode="wait">
                {/* Loading */}
                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingAnimation />
                  </motion.div>
                )}

                {/* Error */}
                {error && !isLoading && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200
                                    flex items-center justify-center mb-4">
                      <AlertCircle className="w-7 h-7 text-red-500" />
                    </div>
                    <h4 className="font-display font-600 text-gray-800 mb-2">
                      Something went wrong
                    </h4>
                    <p className="text-sm text-gray-500 max-w-xs mb-5 leading-relaxed">
                      {error}
                    </p>
                    <button
                      onClick={handleReset}
                      className="btn-primary text-sm px-5 py-2"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}

                {/* Results */}
                {result && !isLoading && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ResultViewer result={result} />
                  </motion.div>
                )}

                {/* Placeholder */}
                {!result && !isLoading && !error && (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="relative mb-6">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br
                                      from-sky-100 to-violet-100 border border-sky-200
                                      flex items-center justify-center">
                        <div className="grid grid-cols-3 gap-0.5 p-3">
                          {Array(9).fill(0).map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                              className="w-4 h-4 rounded-sm"
                              style={{
                                backgroundColor: [
                                  "#228B22", "#808080", "#1E90FF",
                                  "#DC143C", "#228B22", "#D2B48C",
                                  "#808080", "#1E90FF", "#DC143C",
                                ][i],
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 font-medium mb-1">
                      No results yet
                    </p>
                    <p className="text-gray-400 text-sm">
                      Upload an image and click "Run Detection"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <TeamSection />

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center bg-white/50">
        <p className="text-gray-400 text-sm mb-1">
          HyperVision — Hyperspectral Object Detection ·{" "}
          <span className="text-gradient font-medium">Python + PCA + CNN + FastAPI + React</span>
        </p>
        <p className="text-gray-400 text-xs">
          © 2026 · Vardhaman College of Engineering · CSE – Data Science · Batch 2023–2027
        </p>
      </footer>
    </div>
  );
}