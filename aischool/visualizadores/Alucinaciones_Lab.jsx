import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🎬 Versión vertical tipo short (9:16)
// Secuencia automática para video corto

const SCENES = [
  {
    id: 0,
    title: "La IA suena convincente…",
    subtitle: "pero no siempre dice la verdad"
  },
  {
    id: 1,
    sentence: ["Según", "un", "estudio", "de", "Harvard"],
    highlight: -1
  },
  {
    id: 2,
    sentence: ["Según", "un", "estudio", "de", "Harvard", "2021"],
    highlight: 5
  },
  {
    id: 3,
    sentence: ["Según", "un", "estudio", "de", "Harvard", "2021", ",", "los", "gatos", "hablan"],
    highlight: 9
  },
  {
    id: 4,
    title: "¿El problema?",
    subtitle: "No verifica si es verdad"
  },
  {
    id: 5,
    title: "Solo predice",
    subtitle: "la siguiente palabra más probable"
  }
];

export default function App() {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScene((prev) => (prev + 1) % SCENES.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const current = SCENES[scene];

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center py-10">
      <div className="w-[360px] h-[640px] bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between">

        <AnimatePresence mode="wait">
          <motion.div
            key={scene}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col justify-center items-center text-center"
          >

            {/* Escenas de texto */}
            {current.title && (
              <>
                <h1 className="text-xl font-bold text-[#0B1647] mb-3">
                  {current.title}
                </h1>
                <p className="text-sm text-gray-600">
                  {current.subtitle}
                </p>
              </>
            )}

            {/* Escenas de oración */}
            {current.sentence && (
              <div className="flex flex-wrap justify-center gap-2">
                {current.sentence.map((word, i) => (
                  <motion.span
                    key={i}
                    className={`px-2 py-1 rounded text-sm border ${
                      i === current.highlight
                        ? "bg-red-100 border-red-500 text-red-600"
                        : "bg-[#48E5E5] border-[#0B1647] text-[#0B1647]"
                    }`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Footer tipo branding */}
        <div className="text-center text-xs text-gray-400">
          AI4U Academy
        </div>

      </div>
    </div>
  );
}
