import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

// Objetivo: "el gato duerme mucho"
const VOCAB = ["duerme", "come", "corre", "mucho"];

const tokenize = (text) => text.trim().split(/\s+/).filter(Boolean);

const scoreWord = (tokens, word) => {
  const last = tokens[tokens.length - 1];

  let score = 0.1;

  if (tokens.join(" ") === "el gato") {
    if (word === "duerme") score += 3;
  }

  if (last === "duerme") {
    if (word === "mucho") score += 3;
  }

  return score;
};

const softmax = (logits, temperature) => {
  const scaled = logits.map((l) => l / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
};

export default function App() {
  const [input, setInput] = useState("el gato");
  const [temperature, setTemperature] = useState(1);
  const [step, setStep] = useState(0);

  const tokens = useMemo(() => tokenize(input), [input]);

  const logits = useMemo(() => VOCAB.map((w) => scoreWord(tokens, w)), [tokens]);
  const probs = useMemo(() => softmax(logits, temperature), [logits, temperature]);

  const topK = useMemo(() => {
    return VOCAB.map((w, i) => ({ w, p: probs[i] }))
      .sort((a, b) => b.p - a.p)
      .slice(0, 2);
  }, [probs]);

  const appendToken = (word) => {
    if (tokens.length >= 4) return; // máximo: el gato duerme mucho
    setInput((prev) => prev + " " + word);
    setStep(0);
  };

  return (
    <div className="p-6 bg-white text-[#0B1647] min-h-screen">

      <h1 className="text-3xl mb-6 text-center font-bold">
        Predicción paso a paso
      </h1>

      <div className="flex gap-4 mb-4 items-center justify-center">
        <button onClick={() => setStep((s) => Math.max(s - 1, 0))} className="bg-gray-200 px-3 py-2 rounded">←</button>
        <button onClick={() => setStep((s) => Math.min(s + 1, 3))} className="bg-[#0B1647] text-white px-3 py-2 rounded">→</button>
        <div className="text-sm">Paso: {step}</div>
      </div>

      <div className="mb-6 max-w-md mx-auto">
        <div>Temperatura: {temperature.toFixed(2)}</div>
        <input
          type="range"
          min="0.2"
          max="2"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Paso 1 */}
      {step >= 0 && (
        <div className="mb-6 text-center">
          <h2>1. Frase</h2>
          <div className="flex gap-2 justify-center text-lg">
            {tokens.map((t, i) => (
              <div key={i} className="bg-[#48E5E5] px-3 py-1 rounded">{t}</div>
            ))}
            {tokens.length < 4 && <div className="border px-3 py-1 rounded">?</div>}
          </div>
        </div>
      )}

      {/* Paso 2 */}
      {step >= 1 && (
        <div className="mb-6 text-center">
          <h2>2. Probabilidades</h2>
          {VOCAB.map((w, i) => (
            <div key={i} className="flex justify-center gap-4">
              <span>{w}</span>
              <span>{probs[i].toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Paso 3 */}
      {step >= 2 && tokens.length < 4 && (
        <div className="mb-6 text-center">
          <h2>3. Elegir palabra</h2>
          <div className="flex gap-3 justify-center">
            {topK.map((item, i) => (
              <button
                key={i}
                onClick={() => appendToken(item.w)}
                className="bg-[#0B1647] text-white px-4 py-2 rounded"
              >
                {item.w} ({item.p.toFixed(2)})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultado */}
      <div className="text-center mt-6">
        <h2>Resultado</h2>
        <div className="flex justify-center gap-2">
          {tokens.map((t, i) => (
            <motion.div key={i} className="bg-green-500 text-white px-3 py-1 rounded" initial={{ scale: 0 }} animate={{ scale: 1 }}>
              {t}
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
