import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Eraser, Mic, Type, Shield, QrCode, Mail } from "lucide-react";

const popularTools = [
  {
    id: "ai-background-remover",
    name: "AI Background Remover",
    description: "Remove background from product images instantly using smart color thresholding.",
    path: "/ai-background-remover",
    icon: Eraser,
  },
  {
    id: "ai-speech-to-text",
    name: "AI Speech to Text",
    description: "Transcribe audio and voice recordings to accurate text using local browser models.",
    path: "/ai-speech-to-text",
    icon: Mic,
  },
  {
    id: "ai-text-summarizer",
    name: "AI Text Summarizer",
    description: "Summarize articles and research papers using advanced word-frequency sentence ranking.",
    path: "/ai-text-summarizer",
    icon: Type,
  },
  {
    id: "ai-url-reputation-checker",
    name: "AI URL & Phishing Checker",
    description: "Analyze URL reputation, high-risk TLDs, and SSL configuration dynamically.",
    path: "/ai-url-reputation-checker",
    icon: Shield,
  },
  {
    id: "ai-qr-phishing-scanner",
    name: "AI QR Phishing Scanner",
    description: "Audit and scan QR codes for redirects, phishing links, and domain risks.",
    path: "/ai-qr-phishing-scanner",
    icon: QrCode,
  },
  {
    id: "ai-email-subject-line-generator",
    name: "AI Email Subject Generator",
    description: "Generate high-converting email subject lines with dynamic effectiveness scoring.",
    path: "/ai-email-subject-line-generator",
    icon: Mail,
  },
];

const PopularTools = () => {
  return (
    <section className="py-16 sm:py-20 border-b border-border bg-background relative overflow-hidden">
      {/* Decorative ambient background glow */}
      <div className="absolute top-[40%] right-[-10%] h-[300px] w-[300px] rounded-full bg-primary/3 blur-[90px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-600 dark:from-white dark:to-indigo-400">
              Trending AI Utilities
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Fast, free online AI applications most frequently used by our visitors.
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-xl border border-input bg-background hover:bg-muted text-foreground px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm"
          >
            Explore All Tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Tools Horizontal Leaderboard List Grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {popularTools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:bg-muted/40 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 duration-300"
              >
                {/* Monospaced Rank Index */}
                <span className="font-mono text-base font-bold text-muted-foreground/40 group-hover:text-primary transition-colors select-none ml-2">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>

                {/* Separator Line */}
                <div className="h-8 w-px bg-border select-none" />

                {/* Tool Icon */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 select-none">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base flex items-center gap-2 truncate">
                    {tool.name}
                    <span className="inline-flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary select-none flex-shrink-0">
                      <Sparkles className="h-2.5 w-2.5" />
                      AI
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                    {tool.description}
                  </p>
                </div>

                {/* Action Arrow */}
                <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all mr-2 flex-shrink-0" />
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default PopularTools;
