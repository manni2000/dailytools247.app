import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eraser, Mic, Type, ArrowRight, Play, Check, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExampleTab {
  id: string;
  name: string;
  toolName: string;
  icon: any;
  path: string;
  inputHeader: string;
  outputHeader: string;
}

export const AIExamplesShowcase = () => {
  const [activeTab, setActiveTab] = useState("bg-remover");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [typingText, setTypingText] = useState("");
  const navigate = useNavigate();

  const tabs: ExampleTab[] = [
    {
      id: "bg-remover",
      name: "Background Remover",
      toolName: "AI Background Remover",
      icon: Eraser,
      path: "/ai-background-remover",
      inputHeader: "Raw Product Photo",
      outputHeader: "Studio Transparent PNG",
    },
    {
      id: "speech-to-text",
      name: "Speech to Text",
      toolName: "AI Speech to Text Converter",
      icon: Mic,
      path: "/ai-speech-to-text",
      inputHeader: "Voice Waveform",
      outputHeader: "Real-time Transcript",
    },
    {
      id: "summarizer",
      name: "Text Summarizer",
      toolName: "AI Text Summarizer",
      icon: Type,
      path: "/ai-text-summarizer",
      inputHeader: "Full Length Article",
      outputHeader: "AI-Generated Bullet Summary",
    },
  ];

  // Reset states when tab changes
  useEffect(() => {
    setIsProcessing(false);
    setIsCompleted(false);
    setTypingText("");
  }, [activeTab]);

  // Transcribe effect
  useEffect(() => {
    if (activeTab === "speech-to-text" && isCompleted) {
      const fullText = "All file operations and AI calculations are processed securely inside your browser local sandbox. No data ever leaves your device.";
      let index = 0;
      setTypingText("");
      const interval = setInterval(() => {
        setTypingText((prev) => prev + fullText.charAt(index));
        index++;
        if (index >= fullText.length) {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [activeTab, isCompleted]);

  const handleProcess = () => {
    setIsProcessing(true);
    setIsCompleted(false);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
    }, 1500);
  };

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background border-t border-b border-border">
      {/* Background glow */}
      <div className="absolute top-[20%] left-[-15%] h-[350px] w-[350px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-15%] h-[350px] w-[350px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            AI Performance Showcase
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-indigo-600 dark:from-white dark:via-primary dark:to-indigo-400">
            See the Local AI Engine in Action
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Experience near-zero latency processing. We run neural-network models directly inside your web browser. No uploads, no servers, absolute privacy.
          </p>
        </div>

        {/* Tabs navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-2xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all border ${
                  isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25 scale-[1.02]"
                    : "bg-card border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Showcase Grid */}
        <div className="grid gap-8 lg:grid-cols-12 max-w-5xl mx-auto items-stretch">
          {/* Interactive Playground Cards */}
          <div className="lg:col-span-8 flex flex-col justify-between border border-border bg-card/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl">
            {/* Visualizer Areas */}
            <div className="flex-1">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Input Column */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {tabs.find((t) => t.id === activeTab)?.inputHeader}
                  </h4>

                  <div className="h-[220px] rounded-xl border border-border bg-muted/40 flex items-center justify-center overflow-hidden p-4 relative">
                    <AnimatePresence mode="wait">
                      {activeTab === "bg-remover" && (
                        <motion.div
                          key="bg-remover-input"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 via-orange-100 to-indigo-100 dark:from-amber-950 dark:via-orange-950 dark:to-indigo-950"
                        >
                          <div className="relative p-6 bg-white/70 dark:bg-black/70 rounded-2xl shadow-lg border border-white/50 backdrop-blur-sm scale-95 sm:scale-100">
                            <span className="text-4xl select-none">👞</span>
                            <span className="absolute -top-1 -right-1 text-base animate-bounce">✨</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground/80 mt-4 select-none">Noisy, busy photography backdrop</span>
                        </motion.div>
                      )}

                      {activeTab === "speech-to-text" && (
                        <motion.div
                          key="speech-to-text-input"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center w-full h-full"
                        >
                          <div className="flex items-center gap-1.5 h-16 mb-4">
                            {[1, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 5, 4, 3, 2, 3, 4, 3, 2, 1].map((val, idx) => (
                              <motion.div
                                key={idx}
                                className="w-1 rounded-full bg-primary"
                                animate={{
                                  height: isProcessing ? [val * 3, val * 7, val * 3] : val * 4,
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: idx * 0.03,
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-muted-foreground select-none">Click Run to process speech model locally</span>
                        </motion.div>
                      )}

                      {activeTab === "summarizer" && (
                        <motion.div
                          key="summarizer-input"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col w-full h-full text-left justify-start"
                        >
                          <div className="text-[11px] font-mono leading-relaxed text-muted-foreground overflow-y-auto max-h-[190px] p-2 bg-muted/20 border border-border/30 rounded-lg">
                            <p className="mb-2 font-semibold text-foreground">
                              --- Research Draft on In-Browser Compute Patterns ---
                            </p>
                            <p>
                              Artificial intelligence processing is undergoing a paradigm shift. Traditionally, deep learning calculations required massive cloud-based GPU clusters to process requests. However, client-side processing using WebAssembly (WASM), WebGL, and WebGPU allows modern browsers to download compressed weight matrices directly.
                            </p>
                            <p className="mt-1">
                              By implementing local heuristics and on-device NLP libraries, DailyTools247 facilitates zero-server text extraction, summarization, and data compression. This drastically enhances data privacy by ensuring files never leave the machine.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Output Column */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between gap-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {tabs.find((t) => t.id === activeTab)?.outputHeader}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <ShieldCheck className="h-3 w-3" /> Secure
                      </span>
                    )}
                  </h4>

                  <div className="h-[220px] rounded-xl border border-border bg-muted/10 dark:bg-muted/5 flex items-center justify-center overflow-hidden p-4 relative">
                    {/* Checkered background for background remover */}
                    {activeTab === "bg-remover" && isCompleted && (
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,_#ccc_25%,_transparent_25%,_transparent_75%,_#ccc_75%,_#ccc),_linear-gradient(45deg,_#ccc_25%,_#fff_25%,_#fff_75%,_#ccc_75%,_#ccc)] bg-[size:16px_16px] bg-[position:0_0,_8px_8px] dark:bg-[linear-gradient(45deg,_#1f2937_25%,_transparent_25%,_transparent_75%,_#1f2937_75%,_#1f2937),_linear-gradient(45deg,_#1f2937_25%,_#111827_25%,_#111827_75%,_#1f2937_75%,_#1f2937)] opacity-20 absolute inset-0 z-0" />
                    )}

                    <AnimatePresence mode="wait">
                      {isProcessing && (
                        <motion.div
                          key="processing-state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center z-10"
                        >
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
                          <span className="text-xs font-semibold text-primary animate-pulse">Running local model...</span>
                        </motion.div>
                      )}

                      {!isProcessing && !isCompleted && (
                        <motion.div
                          key="empty-state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center p-4 z-10"
                        >
                          <div className="mx-auto w-12 h-12 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center mb-3">
                            <Sparkles className="h-5 w-5 text-muted-foreground/40" />
                          </div>
                          <p className="text-xs text-muted-foreground">Click "Run AI Model" to generate outputs locally</p>
                        </motion.div>
                      )}

                      {!isProcessing && isCompleted && (
                        <motion.div
                          key="completed-state"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-full h-full flex flex-col items-center justify-center z-10"
                        >
                          {activeTab === "bg-remover" && (
                            <motion.div
                              initial={{ y: 20 }}
                              animate={{ y: [0, -6, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="p-6 bg-white/30 dark:bg-black/30 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md"
                            >
                              <span className="text-5xl select-none">👞</span>
                            </motion.div>
                          )}

                          {activeTab === "speech-to-text" && (
                            <div className="w-full h-full text-left p-3 rounded-lg border border-border bg-card overflow-y-auto">
                              <span className="text-xs font-mono leading-relaxed text-foreground select-text">
                                {typingText}
                                <span className="inline-block w-1.5 h-3 bg-primary ml-0.5 animate-pulse" />
                              </span>
                            </div>
                          )}

                          {activeTab === "summarizer" && (
                            <div className="w-full h-full text-left p-4 rounded-lg border border-border bg-card overflow-y-auto flex flex-col justify-center space-y-2">
                              <div className="flex items-start gap-2 text-xs text-foreground">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>Local NLP tools can bypass heavy server loads by doing lexical analyses directly in browser variables.</span>
                              </div>
                              <div className="flex items-start gap-2 text-xs text-foreground">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>Secures data operations, keeping sensitive document scripts fully within client control.</span>
                              </div>
                              <div className="flex items-start gap-2 text-xs text-foreground">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>Facilitates high-speed text summarizations using advanced word-frequency sentence ranking.</span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Run Button bar */}
            <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-5">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                Browser sandbox active
              </span>

              <button
                type="button"
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground px-5 py-3 text-sm font-semibold transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-current" />
                Run AI Model
              </button>
            </div>
          </div>

          {/* Value Pitch Side Column */}
          <div className="lg:col-span-4 flex flex-col justify-between border border-border bg-card/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {tabs.find((t) => t.id === activeTab)?.toolName}
              </h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {activeTab === "bg-remover" &&
                  "Our smart edge-detection script isolates products by comparing color differentials and alpha masks locally. Superb for e-commerce store listings."}
                {activeTab === "speech-to-text" &&
                  "Directly streams device audio feeds into browser-resident speech-recognition layers. Transcribe interviews and notes with zero cloud transmission."}
                {activeTab === "summarizer" &&
                  "Uses custom TF-IDF keyword heuristics to parse paragraph trees. Reduces whitepapers to actionable abstracts in microseconds without a backend."}
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-primary mt-0.5 flex-shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-foreground">100% Privacy Checked</p>
                    <p className="text-muted-foreground mt-0.5">Files never upload to any remote server.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-primary mt-0.5 flex-shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-foreground">Near-Zero Latency</p>
                    <p className="text-muted-foreground mt-0.5">Processes locally, beating high cloud traffic queues.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(tabs.find((t) => t.id === activeTab)?.path || "/")}
              className="mt-8 group flex items-center justify-center gap-2 w-full rounded-xl border border-primary hover:bg-primary hover:text-primary-foreground text-primary px-4 py-3.5 text-sm font-semibold transition-all"
            >
              Open Full Tool
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
