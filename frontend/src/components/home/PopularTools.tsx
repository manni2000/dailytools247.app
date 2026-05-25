import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Eraser, FileType2, Image, QrCode, Lock, Code2 } from "lucide-react";

const popularTools = [
  {
    id: "background-remover",
    name: "Background Remover",
    description: "Remove background from images automatically using AI processing.",
    path: "/background-remover",
    icon: Eraser,
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF documents to editable DOCX files while keeping layouts.",
    path: "/pdf-to-word",
    icon: FileType2,
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    description: "Reduce image file size up to 90% without sacrificing image resolution.",
    path: "/image-compressor",
    icon: Image,
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Generate customized QR codes for websites, texts, and contact cards.",
    path: "/qr-code-generator",
    icon: QrCode,
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Create highly secure random passwords in your local browser environment.",
    path: "/password-generator",
    icon: Lock,
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Clean, format, indent, and validate JSON data strings instantly.",
    path: "/json-formatter",
    icon: Code2,
  },
];

const PopularTools = () => {
  return (
    <section className="py-16 sm:py-20 border-b border-border bg-background">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              Most Popular Tools
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Trending Online Utilities
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Fast, free online applications most frequently used by our visitors.
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-background hover:bg-muted text-foreground px-4 py-2 text-sm font-semibold transition-colors shadow-sm"
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
                className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:bg-muted/40 hover:border-primary/40 hover:shadow-sm"
              >
                {/* Monospaced Rank Index */}
                <span className="font-mono text-base font-bold text-muted-foreground/40 group-hover:text-primary transition-colors select-none ml-2">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>

                {/* Separator Line */}
                <div className="h-8 w-px bg-border select-none" />

                {/* Tool Icon */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded border border-border bg-muted/40 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors select-none">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base truncate">
                    {tool.name}
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
