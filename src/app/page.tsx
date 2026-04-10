"use client";

import { useState } from "react";
import { Copy, Sparkles, Wand2, ArrowRight, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState("normal-talk");
  const [format, setFormat] = useState("long");

  const tones = [
    { id: "ui-design", label: "🎨 UI Design" },
    { id: "logic-building", label: "🧠 Logic Building" },
    { id: "bug-fixing", label: "🐛 Bug Fixing" },
    { id: "feature-building", label: "💡 Feature & Ideas" },
    { id: "normal-talk", label: "💬 Normal Talk" },
  ];

  const formats = [
    { id: "short", label: "⚡ Short" },
    { id: "long", label: "📋 Long" },
    { id: "json", label: "{ } JSON" },
    { id: "technical", label: "⚙️ Technical" },
  ];

  const handleRefine = async () => {
    if (!input.trim()) {
      toast.error("Pehle kuch prompt likh bhai! 😅");
      return;
    }

    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, tone, format }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong!");
        return;
      }

      setOutput(data.refined);
      toast.success("Prompt refine ho gaya! 🎉");
    } catch {
      toast.error("Network error — check your connection!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard! Ab jaake paste kar 🚀");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <main className="min-h-screen bg-cross-pattern relative overflow-x-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/8 rounded-full blur-[120px] animate-glow-pulse" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-700/5 rounded-full blur-[100px] animate-drift" />

      {/* Floating sparkles — hidden on very small screens to avoid overflow */}
      <div className="hidden sm:block absolute top-[15%] right-[20%] text-yellow-400 sparkle-1 text-lg">✦</div>
      <div className="absolute top-[30%] left-[4%] text-yellow-300 sparkle-2 text-sm">✦</div>
      <div className="hidden sm:block absolute top-[50%] right-[5%] text-indigo-400 sparkle-3 text-base">✦</div>
      <div className="absolute top-[70%] left-[3%] text-yellow-400 sparkle-4 text-xs">✦</div>
      <div className="hidden md:block absolute top-[20%] left-[30%] text-indigo-300 sparkle-5 text-sm">✦</div>
      <div className="hidden sm:block absolute top-[60%] right-[5%] text-yellow-300 sparkle-6 text-lg">✦</div>
      <div className="hidden md:block absolute top-[85%] left-[50%] text-indigo-400 sparkle-7 text-xs">✦</div>
      <div className="hidden sm:block absolute top-[40%] right-[4%] text-yellow-400 sparkle-8 text-base">✦</div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Outer frame */}
        <div className="rounded-2xl sm:rounded-3xl border border-white/[0.09] bg-white/[0.02] backdrop-blur-sm shadow-2xl shadow-black/40 p-4 sm:p-6 lg:p-10">
        {/* Header */}
        <div className="text-center mb-10">
          {/* Script top label — like "Amanat" in screenshot */}
          <div className="font-caveat text-3xl sm:text-4xl lg:text-5xl text-indigo-400 mb-1 leading-none">
            Bad to Good
          </div>

          {/* Big bold heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-1">
            Prompt
            <br />
            <span className="relative inline-block">
              Refiner
              <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 rounded-full" />
            </span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mt-3 px-2">
            Apna messy, Hinglish, galat spelling wala prompt daal — aur clean professional prompt le ja for Windsurf, Cursor, ChatGPT.
          </p>
        </div>

        {/* Tone & Format Selectors */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
          {/* Tone Selector */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Prompt Tone</p>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border ${
                    tone === t.id
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px bg-white/[0.08]" />

          {/* Format Selector */}
          <div className="sm:w-56">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Output Format</p>
            <div className="flex flex-wrap gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border ${
                    format === f.id
                      ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                      : "bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Bad Prompt (Tera messy input)
              </label>
              <span className="text-xs text-gray-500">{input.length} chars</span>
            </div>
            <div className="gradient-border">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Yahan apna bekar prompt likh... jaise: 'mujhe ek todo app banana hai react mai jismay dark mode ho aur localstorge mai data save ho aur animeshan bhi chahiye'"
                className="w-full h-48 sm:h-64 lg:h-80 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 text-gray-100 placeholder-gray-600 resize-none focus:outline-none text-sm leading-relaxed"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    handleRefine();
                  }
                }}
              />
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Good Prompt (Refined output)
              </label>
              {output && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="gradient-border">
              <div
                className={`w-full h-48 sm:h-64 lg:h-80 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 overflow-auto text-sm leading-relaxed ${
                  output ? "text-gray-100" : "text-gray-600"
                } ${loading ? "animate-shimmer" : ""}`}
              >
                {loading ? (
                  <div className="flex items-center gap-3 text-purple-300">
                    <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    Refining your prompt...
                  </div>
                ) : output ? (
                  <pre className="whitespace-pre-wrap font-sans">{output}</pre>
                ) : (
                  "Refined prompt yahaan dikhega..."
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mt-6">
          <button
            onClick={handleRefine}
            disabled={loading || !input.trim()}
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:shadow-none"
          >
            <Wand2 className="w-5 h-5" />
            {loading ? "Refining..." : "Refine Prompt"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {(input || output) && (
            <button
              onClick={handleClear}
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-gray-200 font-medium rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-gray-700/50"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}

          {output && (
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 bg-green-600/20 hover:bg-green-600/30 text-green-300 font-medium rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-green-500/30"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Refined Prompt
                </>
              )}
            </button>
          )}
        </div>

        {/* Keyboard Shortcut Hint — desktop only */}
        <p className="hidden sm:block text-center text-gray-600 text-xs mt-4">
          Tip: Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-400">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-400">Enter</kbd> to refine
        </p>

        {/* Footer */}
        <footer className="text-center mt-12">
          <span className="text-gray-500 text-sm">Made by </span>
          <span className="font-caveat text-xl text-indigo-400">Azhan Ali</span>
        </footer>

        </div>{/* end outer frame */}
      </div>
    </main>
  );
}
