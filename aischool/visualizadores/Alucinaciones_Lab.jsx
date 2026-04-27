import React from "react";
import { motion } from "framer-motion";

const EXAMPLE = [
  { word: "According", type: "ok" },
  { word: "to", type: "ok" },
  { word: "the", type: "ok" },
  { word: "Harvard", type: "ok" },
  { word: "study", type: "ok" },
  { word: "of", type: "ok" },
  { word: "2021", type: "wrong" },
  { word: ",", type: "ok" },
  { word: "cats", type: "ok" },
  { word: "talk", type: "wrong" }
];

const CARDS = [
  {
    title: "Learned pattern",
    desc: "Phrases like 'According to a Harvard study...' appear often in training data."
  },
  {
    title: "No verification",
    desc: "The model doesn't check if that study exists or is real."
  },
  {
    title: "Surface fit",
    desc: "Words fit well together, they sound credible and fluent."
  },
  {
    title: "Hallucination",
    desc: "The content is false, but presented with absolute confidence."
  }
];

export default function App() {
  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative border border-gray-100">

        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#0B1647] mb-6">
          Hallucination: sounds real, but it isn't
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-8">

          <div className="flex flex-col items-center w-full sm:w-[160px]">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl"
            >
              🤖
            </motion.div>
            <div className="text-xs text-[#0B1647] mt-2 text-center">
              Predicts words
              <br />
              (doesn't verify facts)
            </div>
          </div>

          <div className="flex gap-3 sm:gap-5 flex-wrap justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-16 h-10 sm:w-20 sm:h-12 bg-[#48E5E5] rounded-lg border border-[#0B1647] flex items-center justify-center"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.4 }}
              >
                <span className="text-[#0B1647] font-bold">✔</span>
              </motion.div>
            ))}

            <motion.div
              className="w-16 h-10 sm:w-20 sm:h-12 bg-red-100 rounded-lg border border-red-500 flex items-center justify-center"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: [0, -4, 0], opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8, repeat: Infinity }}
            >
              <span className="text-red-600 font-bold">⚠</span>
            </motion.div>
          </div>

          <div className="flex flex-col items-center w-full sm:w-[160px]">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-3xl"
            >
              📄
            </motion.div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Credible text
              <br />
              but false
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          {EXAMPLE.map((t, i) => (
            <motion.span
              key={i}
              className={`px-3 py-1.5 rounded border text-sm font-medium ${
                t.type === "wrong"
                  ? "bg-red-50 border-red-400 text-red-600"
                  : "bg-[#48E5E5]/20 border-[#0B1647]/20 text-[#0B1647]"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              {t.word}
            </motion.span>
          ))}
        </div>

        <div className="text-center text-sm text-[#0B1647] mt-6 max-w-lg mx-auto">
          AI uses common patterns to sound convincing, but it doesn't have a "truth" database to check what it says.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          {CARDS.map((c, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white transition-colors">
              <div className="text-sm font-bold text-[#0B1647] mb-1">{c.title}</div>
              <div className="text-xs text-gray-600 leading-relaxed">
                {c.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-[10px] text-gray-400 mt-8 border-t pt-4">
           Hallucinations Lab — AI4U Academy
        </div>

      </div>
    </div>
  );
}
