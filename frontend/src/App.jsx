import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="app"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-mesh"
      >
        <Home />
      </motion.div>
    </AnimatePresence>
  );
}
