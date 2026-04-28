import React, { useState } from "react";
import { motion } from "framer-motion";

// 🎬 Tarjetas Mito vs Realidad (interactivo + visual)

const CARDS = [
  {
    myth: "La IA lo sabe todo",
    reality: "Puede equivocarse y generar información falsa"
  },
  {
    myth: "La IA piensa",
    reality: "Solo predice texto basado en patrones"
  },
  {
    myth: "La IA entiende",
    reality: "No comprende, solo calcula probabilidades"
  },
  {
    myth: "La IA siempre es precisa",
    reality: "Depende del contexto y los datos"
  }
];

function Card({ myth, reality }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-[150px] h-[180px] perspective" onClick={() => setFlipped(!flipped)}>
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >

        {/* Front (Mito) */}
        <div
          className="absolute w-full h-full bg-[#0B1647] text-white rounded-xl flex items-center justify-center text-center p-3"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <div className="text-xs opacity-70 mb-2">MITO</div>
            <div className="text-sm font-semibold">{myth}</div>
          </div>
        </div>

        {/* Back (Realidad) */}
        <div
          className="absolute w-full h-full bg-[#48E5E5] text-[#0B1647] rounded-xl flex items-center justify-center text-center p-3"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div>
            <div className="text-xs opacity-70 mb-2">REALIDAD</div>
            <div className="text-sm font-semibold">{reality}</div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center py-10">
      <div className="w-[360px] h-[640px] bg-white rounded-2xl shadow-xl p-6 flex flex-col">

        {/* Título */}
        <h1 className="text-lg font-bold text-center text-[#0B1647] mb-4">
          Mitos vs Realidad sobre la IA
        </h1>

        {/* Grid tarjetas */}
        <div className="grid grid-cols-2 gap-4 flex-1 place-items-center">
          {CARDS.map((c, i) => (
            <Card key={i} myth={c.myth} reality={c.reality} />
          ))}
        </div>

        {/* Instrucción */}
        <div className="text-center text-xs text-gray-400 mt-4">
          Toca una tarjeta para revelar la verdad
        </div>

        {/* Branding */}
        <div className="text-center text-xs text-gray-400 mt-2">
          AI4U Academy
        </div>

      </div>
    </div>
  );
}
