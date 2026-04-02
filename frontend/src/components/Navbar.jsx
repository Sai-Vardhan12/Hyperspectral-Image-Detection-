import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layers, Zap } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-violet-500
                       flex items-center justify-center shadow-glow"
          >
            <Layers className="w-5 h-5 text-white" />
          </motion.div>
          <span className="font-display font-700 text-xl text-gray-900 tracking-tight">
            Hyper<span className="text-gradient">Vision</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {["Demo", "How It Works", "Team", "About"].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              whileHover={{ y: -1 }}
              className="text-sm font-medium text-gray-600 hover:text-sky-600
                         transition-colors duration-200"
            >
              {item}
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.a
          href="#demo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-violet-500
                     text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-glow
                     hover:shadow-glow-purple transition-all duration-300"
        >
          <Zap className="w-4 h-4" />
          Try Demo
        </motion.a>
      </div>
    </motion.nav>
  );
}
