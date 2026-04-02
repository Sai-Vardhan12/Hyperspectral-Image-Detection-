import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, ImageIcon, X, Settings2, ChevronDown, Zap
} from "lucide-react";

const PATCH_SIZES = [8, 16, 32];
const PCA_OPTIONS = [5, 10, 15, 20];

export default function UploadPanel({ onSubmit, isLoading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [patchSize, setPatchSize] = useState(16);
  const [pcaComponents, setPcaComponents] = useState(10);
  const [nClasses, setNClasses] = useState(5);
  const inputRef = useRef();

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, TIFF).");
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      handleFile(f);
    },
    [handleFile]
  );

  const onFileChange = (e) => handleFile(e.target.files[0]);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!file || isLoading) return;
    onSubmit({ file, patchSize, pcaComponents, nClasses });
  };

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !file && inputRef.current.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300
                    cursor-pointer min-h-[220px] flex items-center justify-center overflow-hidden
                    ${dragging
                      ? "border-sky-400 bg-sky-50 ring-pulse"
                      : file
                      ? "border-violet-300 bg-violet-50/40"
                      : "border-gray-300 bg-gray-50/60 hover:border-sky-400 hover:bg-sky-50/40"
                    }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center p-8 pointer-events-none"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-violet-100
                           border border-sky-200 flex items-center justify-center mx-auto mb-4"
              >
                <UploadCloud className="w-8 h-8 text-sky-500" />
              </motion.div>
              <p className="text-gray-700 font-medium mb-1">
                Drop your image here
              </p>
              <p className="text-gray-400 text-sm">
                PNG, JPG, TIFF supported · Any image works
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full relative"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-[220px] object-contain rounded-xl"
              />
              {/* Remove button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90
                           border border-red-200 flex items-center justify-center
                           text-red-500 shadow-sm hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* File info */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2
                              bg-white/90 backdrop-blur-sm border border-gray-200
                              rounded-xl px-3 py-1.5 shadow-sm">
                <ImageIcon className="w-4 h-4 text-violet-500" />
                <span className="text-xs text-gray-700 font-medium truncate max-w-[160px]">
                  {file.name}
                </span>
                <span className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Settings toggle */}
      <div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600
                     hover:text-sky-600 transition-colors"
        >
          <Settings2 className="w-4 h-4" />
          Model Settings
          <motion.div
            animate={{ rotate: showSettings ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4
                              bg-gray-50/80 border border-gray-200 rounded-xl p-4">
                {/* Patch Size */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Patch Size (px)
                  </label>
                  <div className="flex gap-2">
                    {PATCH_SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setPatchSize(s)}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-medium
                                    border transition-all duration-150
                                    ${patchSize === s
                                      ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                                      : "bg-white text-gray-600 border-gray-200 hover:border-sky-300"
                                    }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PCA Components */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    PCA Components
                  </label>
                  <div className="flex gap-2">
                    {PCA_OPTIONS.map((n) => (
                      <button
                        key={n}
                        onClick={() => setPcaComponents(n)}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-medium
                                    border transition-all duration-150
                                    ${pcaComponents === n
                                      ? "bg-violet-500 text-white border-violet-500 shadow-sm"
                                      : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
                                    }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* N Classes */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Classes
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={10}
                    value={nClasses}
                    onChange={(e) => setNClasses(Math.max(2, Math.min(10, Number(e.target.value))))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5
                               text-sm text-gray-700 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!file || isLoading}
        whileHover={!file || isLoading ? {} : { scale: 1.02 }}
        whileTap={!file || isLoading ? {} : { scale: 0.97 }}
        className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center
                    justify-center gap-3 transition-all duration-300
                    ${!file || isLoading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                      : "bg-gradient-to-r from-sky-500 to-violet-500 text-white shadow-glow hover:shadow-glow-purple"
                    }`}
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
            />
            Analyzing Patches...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            Run Detection
          </>
        )}
      </motion.button>
    </div>
  );
}
