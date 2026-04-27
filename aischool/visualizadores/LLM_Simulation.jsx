import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

// Expanded vocabulary for better demonstration
const VOCAB = [
  "sleeps", "eats", "runs", "jumps", "meows", 
  "a lot", "fish", "milk", "in", "the", 
  "sofa", "fast", "slowly", "happy"
];

const tokenize = (text) => text.trim().split(/\s+/).filter(Boolean);

const scoreWord = (tokens, word) => {
  const phrase = tokens.join(" ");
  const last = tokens[tokens.length - 1];

  let score = 0.5; // Base score (noise)

  // Prediction logic based on context
  if (phrase === "the cat") {
    if (word === "sleeps") score += 4;
    if (word === "eats") score += 3;
    if (word === "meows") score += 2.5;
    if (word === "jumps") score += 2;
    if (word === "runs") score += 1.5;
  } else if (last === "sleeps") {
    if (word === "a lot") score += 4;
    if (word === "in") score += 3;
    if (word === "slowly") score += 2;
    if (word === "happy") score += 1.5;
  } else if (last === "eats") {
    if (word === "fish") score += 4;
    if (word === "milk") score += 3;
    if (word === "a lot") score += 2;
  } else if (last === "jumps") {
    if (word === "in") score += 4;
    if (word === "a lot") score += 2;
  } else if (last === "in") {
    if (word === "the") score += 5;
  } else if (last === "the") {
    if (word === "sofa") score += 4;
  }

  return score;
};

const softmax = (logits, temperature) => {
  // Safety adjustment to avoid division by zero or extremely low temperatures
  const temp = Math.max(temperature, 0.01);
  const scaled = logits.map((l) => l / temp);
  const max = Math.max(...scaled);
  const exps = scaled.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
};

export default function App() {
  const [input, setInput] = useState("the cat");
  const [temperature, setTemperature] = useState(1);
  const [step, setStep] = useState(0);

  const tokens = useMemo(() => tokenize(input), [input]);

  const logits = useMemo(() => VOCAB.map((w) => scoreWord(tokens, w)), [tokens]);
  const probs = useMemo(() => softmax(logits, temperature), [logits, temperature]);

  // Increased to "Top 5" to see more options when changing temperature
  const topK = useMemo(() => {
    return VOCAB.map((w, i) => ({ w, p: probs[i] }))
      .sort((a, b) => b.p - a.p)
      .slice(0, 5); 
  }, [probs]);

  const appendToken = (word) => {
    if (tokens.length >= 6) return; // Limit phrase length
    setInput((prev) => prev + " " + word);
    setStep(0); // Reset to step 0 when adding a word to see the flow again
  };

  const resetAll = () => {
    setInput("the cat");
    setStep(0);
  };

  return (
    <div className="p-6 bg-white text-[#0B1647] min-h-screen font-sans">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-[#0B1647]">How does an LLM predict?</h1>
          <p className="text-gray-600">Interactive simulation of token probability</p>
        </header>

        {/* Main Controls */}
        <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-6">
            <div className="w-full md:w-1/2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-500">Temperature</label>
                <span className="bg-[#48E5E5] px-2 py-0.5 rounded text-xs font-bold">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.5"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B1647]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 uppercase">
                <span>Deterministic (Low)</span>
                <span>Random (High)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep((s) => Math.max(s - 1, 0))} 
                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                title="Previous Step"
              >
                ←
              </button>
              <div className="bg-[#0B1647] text-white px-4 py-2 rounded-full text-sm font-medium">
                Step {step + 1} of 3
              </div>
              <button 
                onClick={() => setStep((s) => Math.min(s + 1, 2))} 
                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                title="Next Step"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Step Visualization */}
        <div className="space-y-8">
          
          {/* Step 1: Current Context */}
          <section className={`transition-opacity duration-300 ${step >= 0 ? "opacity-100" : "opacity-30"}`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-600">1</span>
              Phrase (Context)
            </h2>
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 items-center">
              {tokens.map((t, i) => (
                <motion.div 
                  key={i} 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#0B1647] text-white px-4 py-2 rounded-lg font-medium shadow-sm"
                >
                  {t}
                </motion.div>
              ))}
              {tokens.length < 6 && (
                <div className="bg-white border-2 border-[#48E5E5] text-[#48E5E5] px-4 py-2 rounded-lg font-bold animate-pulse">
                  ?
                </div>
              )}
            </div>
          </section>

          {/* Step 2: Probability Distribution */}
          <section className={`transition-opacity duration-300 ${step >= 1 ? "opacity-100" : "opacity-10"}`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-600">2</span>
              Probability Distribution (Softmax)
            </h2>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              {topK.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>{item.w}</span>
                    <span>{(item.p * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-[#48E5E5] h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.p * 100}%` }}
                      transition={{ type: "spring", stiffness: 50 }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-gray-400 italic mt-4 text-center">
                * Showing the 5 most likely tokens from the vocabulary.
              </p>
            </div>
          </section>

          {/* Step 3: Next Token Selection */}
          <section className={`transition-opacity duration-300 ${step >= 2 ? "opacity-100" : "opacity-10"}`}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-600">3</span>
              Prediction (Proposed options)
            </h2>
            
            {tokens.length < 6 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {topK.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => appendToken(item.w)}
                    disabled={step < 2}
                    className="group relative bg-white hover:bg-[#0B1647] border border-gray-200 hover:border-[#0B1647] p-4 rounded-xl text-left transition-all hover:shadow-lg disabled:opacity-50"
                  >
                    <div className="text-[#0B1647] group-hover:text-white font-bold text-lg mb-1">{item.w}</div>
                    <div className="text-[#48E5E5] font-mono text-xs">p = {item.p.toFixed(3)}</div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" strokeWidth="3" fill="none"><path d="M12 5v14M5 12h14"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-100">
                <div className="text-green-600 font-bold mb-2">Phrase completed!</div>
                <button onClick={resetAll} className="text-sm text-[#0B1647] underline font-bold">Reset simulation</button>
              </div>
            )}
          </section>

        </div>

        {/* Footer info */}
        <footer className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">
            AI4U Academy — Experimenting with Transformer architectures
          </p>
        </footer>
      </div>
    </div>
  );
}

