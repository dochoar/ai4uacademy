import React from "react";
import { motion } from "framer-motion";

const EXAMPLE = [
  { word: "Según", type: "ok" },
  { word: "el", type: "ok" },
  { word: "estudio", type: "ok" },
  { word: "de", type: "ok" },
  { word: "Harvard", type: "ok" },
  { word: "2021", type: "wrong" },
  { word: ",", type: "ok" },
  { word: "los", type: "ok" },
  { word: "gatos", type: "ok" },
  { word: "hablan", type: "wrong" }
];

const CARDS = [
  {
    title: "Patrón aprendido",
    desc: "Frases como 'Según un estudio de Harvard...' aparecen mucho en datos."
  },
  {
    title: "Sin verificación",
    desc: "El modelo no comprueba si ese estudio existe o es real."
  },
  {
    title: "Encaje superficial",
    desc: "Las palabras encajan bien entre sí, suenan creíbles."
  },
  {
    title: "Alucinación",
    desc: "El contenido es falso, pero se presenta con confianza."
  }
];

export default function App() {
  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative border border-gray-100">

        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#0B1647] mb-6">
          Alucinación: suena real, pero no lo es
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
              Predice palabras
              <br />
              (no verifica hechos)
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
              Texto creíble
              <br />
              pero falso
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
          La IA usa patrones comunes para sonar convincente, pero no tiene una base de datos de "verdad" para comprobar lo que dice.
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
           Laboratorio de Alucinaciones — AI4U Academy
        </div>

      </div>
    </div>
  );
}
