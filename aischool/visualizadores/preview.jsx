import React from "react";
import { motion } from "framer-motion";

const EXAMPLE = [
  { word: "According", type: "ok" },
  { word: "to", type: "ok" },
  { word: "a", type: "ok" },
  { word: "2021", type: "wrong" },
  { word: "Harvard", type: "ok" },
  { word: "study", type: "ok" },
  { word: ",", type: "ok" },
  { word: "cats", type: "ok" },
  { word: "can", type: "ok" },
  { word: "talk", type: "wrong" }
];

const CARDS = [
  {
    title: "Learned pattern",
    desc: "Phrases like 'According to a study...' appear frequently in training data."
  },
  {
    title: "No verification",
    desc: "The model doesn't check if that study actually exists or is real."
  },
  {
    title: "Surface fit",
    desc: "The words fit together well, making the text sound believable."
  },
  {
    title: "Hallucination",
    desc: "The content is false, but it is presented with high confidence."
  }
];

export default function App() {
  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <div className="w-[1000px] h-[620px] bg-white rounded-2xl shadow-xl p-8 relative">
 
        <h1 className="text-2xl font-bold text-center text-[#0B1647] mb-6">
          Hallucination: sounds real, but it isn't
        </h1>

        <div className="flex items-center justify-between h-[240px]">

          <div className="flex flex-col items-center w-[160px]">
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
              (no fact-checking)
            </div>
          </div>

          <div className="flex gap-5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-20 h-12 bg-[#48E5E5] rounded-lg border border-[#0B1647] flex items-center justify-center"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.4 }}
              >
                ✔
              </motion.div>
            ))}

            <motion.div
              className="w-20 h-12 bg-red-200 rounded-lg border border-red-500 flex items-center justify-center"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: [0, -4, 0], opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8, repeat: Infinity }}
            >
              ⚠
            </motion.div>
          </div>

          <div className="flex flex-col items-center w-[160px]">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-3xl"
            >
              📄
            </motion.div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Believable text
              <br />
              but false
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-2 flex-wrap">
          {EXAMPLE.map((t, i) => (
            <motion.span
              key={i}
              className={`px-2 py-1 rounded border text-sm ${
                t.type === "wrong"
                  ? "bg-red-100 border-red-500 text-red-600"
                  : "bg-[#48E5E5] border-[#0B1647] text-[#0B1647]"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              {t.word}
            </motion.span>
          ))}
        </div>

        <div className="text-center text-sm text-[#0B1647] mt-3">
          Uses common patterns to sound convincing, without checking if it's true.
        </div>

        <div className="grid grid-cols-4 gap-3 mt-6 max-w-4xl mx-auto">
          {CARDS.map((c, i) => (
            <div key={i} className="p-3 rounded-lg border bg-gray-50">
              <div className="text-sm font-semibold text-[#0B1647]">{c.title}</div>
              <div className="text-xs text-gray-600 mt-1 leading-snug">
                {c.desc}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-gray-500 mt-4">
          Hallucination example: non-existent quote or study presented as real.
        </div>

      </div>
    </div>
  );
}