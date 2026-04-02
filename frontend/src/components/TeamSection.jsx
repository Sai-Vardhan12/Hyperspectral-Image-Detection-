import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Users, BookOpen, Award } from "lucide-react";

const TEAM = [
  {
    name: "Bodla Manvitha",
    role: "ML Engineer",
    initials: "BM",
    gradient: "from-sky-400 to-cyan-500",
    bg: "bg-sky-50",
    border: "border-sky-100",
    roleColor: "text-sky-600",
    roleBg: "bg-sky-50 border-sky-200",
  },
  {
    name: "Madani Sai Vardhan",
    role: "Fullstack Developer",
    initials: "MSV",
    gradient: "from-violet-400 to-purple-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
    roleColor: "text-violet-600",
    roleBg: "bg-violet-50 border-violet-200",
  },
  {
    name: "Nenavath Rajesh",
    role: "Frontend Developer",
    initials: "NR",
    gradient: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    roleColor: "text-emerald-600",
    roleBg: "bg-emerald-50 border-emerald-200",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.15, ease: "easeOut" },
  }),
};

export default function TeamSection() {
  return (
    <section id="team" className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
                        from-transparent via-violet-200 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #8b5cf6 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-32 right-0 w-96 h-96 rounded-full
                        bg-violet-200/20 blur-3xl" />
        <div className="absolute -bottom-32 left-0 w-96 h-96 rounded-full
                        bg-sky-200/20 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── Project banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 rounded-2xl overflow-hidden shadow-card"
        >
          <div className="bg-gradient-to-r from-sky-500 via-violet-500 to-purple-600 p-0.5
                          rounded-2xl">
            <div className="bg-white/95 backdrop-blur-sm rounded-[14px] px-8 py-6
                            flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600
                              flex items-center justify-center shadow-glow flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-1.5">
                  Project Title
                </p>
                <h3 className="font-display font-700 text-gray-900 text-base md:text-lg
                               leading-snug">
                  An Explainable and Drift-Aware Adaptive Learning Framework for
                  Object Detection in Hyperspectral Images
                </h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200
                          rounded-full px-4 py-1.5 text-sm font-medium text-violet-700 mb-4">
            <Users className="w-4 h-4" />
             Team
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-700 text-gray-900 mb-4">
            The <span className="text-gradient">People</span> Behind It
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
            A dedicated group of students from Vardhaman College of Engineering
            building intelligent hyperspectral systems.
          </p>
        </motion.div>

        {/* ── Team cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative card ${member.bg} border ${member.border}
                          text-center hover:shadow-lifted transition-all duration-300
                          cursor-default overflow-hidden`}
            >
              {/* Top gradient strip */}
              <div className={`absolute top-0 left-0 right-0 h-1
                               bg-gradient-to-r ${member.gradient}`} />

              {/* Subtle background glow */}
              <div className={`absolute inset-0 bg-gradient-to-b ${member.gradient}
                               opacity-[0.04] pointer-events-none`} />

              {/* Avatar initials */}
              <div className="mt-4 mb-5 flex justify-center relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -6, 6, 0], scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient}
                               flex items-center justify-center shadow-md
                               ring-4 ${member.ring}`}
                >
                  <span className="text-white font-display font-700 text-xl tracking-tight">
                    {member.initials}
                  </span>
                </motion.div>
              </div>

              {/* Name */}
              <h3 className="relative z-10 font-display font-700 text-gray-900
                             text-lg mb-3 leading-tight px-2">
                {member.name}
              </h3>

              {/* Role badge */}
              <div className="relative z-10 flex justify-center pb-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold
                                 px-3 py-1.5 rounded-full border ${member.roleBg}
                                 ${member.roleColor}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                  {member.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── College / Department / Guide info row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* College */}
          <div className="card bg-white/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600
                            flex items-center justify-center flex-shrink-0 shadow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Institution
              </p>
              <p className="font-display font-700 text-gray-800 text-sm leading-snug">
                Vardhaman College of Engineering
              </p>
            </div>
          </div>

          {/* Department & Batch */}
          <div className="card bg-white/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600
                            flex items-center justify-center flex-shrink-0 shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Department & Batch
              </p>
              <p className="font-display font-700 text-gray-800 text-sm leading-snug">
                CSE (Data Science)
              </p>
              <p className="text-xs text-gray-500 mt-0.5 font-mono">2023 – 2027</p>
            </div>
          </div>

          {/* Project Guide */}
          <div className="card bg-white/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600
                            flex items-center justify-center flex-shrink-0 shadow-sm">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                Project Guide
              </p>
              <p className="font-display font-700 text-gray-800 text-sm leading-snug">
                B. Rupa
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Assistant Professor</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
