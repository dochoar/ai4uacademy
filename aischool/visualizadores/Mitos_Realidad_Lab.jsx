import React, { useState } from "react";
import { motion } from "framer-motion";

// 🎬 Myth vs Reality Cards (interactive + visual)

const CARDS = [
  {
    myth: "AI knows everything",
    reality: "It can be wrong and generate false information"
  },
  {
    myth: "AI thinks",
    reality: "It only predicts text based on patterns"
  },
  {
    myth: "AI understands",
    reality: "It doesn't comprehend, it only calculates probabilities"
  },
  {
    myth: "AI is always accurate",
    reality: "It depends on the context and the data"
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

        {/* Front (Myth) */}
        <div
          className="absolute w-full h-full bg-[#0B1647] text-white rounded-xl flex items-center justify-center text-center p-3"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <div className="text-xs opacity-70 mb-2">MYTH</div>
            <div className="text-sm font-semibold">{myth}</div>
          </div>
        </div>

        {/* Back (Reality) */}
        <div
          className="absolute w-full h-full bg-[#48E5E5] text-[#0B1647] rounded-xl flex items-center justify-center text-center p-3"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div>
            <div className="text-xs opacity-70 mb-2">REALITY</div>
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

        {/* Title */}
        <h1 className="text-lg font-bold text-center text-[#0B1647] mb-4">
          AI Myths vs Reality
        </h1>

        {/* Card Grid */}
        <div className="grid grid-cols-2 gap-4 flex-1 place-items-center">
          {CARDS.map((c, i) => (
            <Card key={i} myth={c.myth} reality={c.reality} />
          ))}
        </div>

        {/* Instruction */}
        <div className="text-center text-xs text-gray-400 mt-4">
          Tap a card to reveal the truth
        </div>

        {/* Branding */}
        <div className="text-center text-xs text-gray-400 mt-2">
          AI4U Academy
        </div>

      </div>
    </div>
  );
}
