import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ChevronRight, TrendingUp, Star, ShieldCheck, Zap, Layers, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCategoryById } from "@/data/toolCategories";
import ToolCard from "@/components/ToolCard";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { universalToolFaqs } from "@/data/toolSeoEnhancements";
import { getCategoryFaqs } from "@/data/categorySpecificFaqs";
import CategoryFAQSection from "@/components/CategoryFAQSection";
import SEOHelmet from "@/components/SEOHelmet";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = getCategoryById(categoryId || "");

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Category not found</p>
      </div>
    );
  }

  const Icon = category.icon;

  const getCategoryDescription = () => {
    const descriptions: Record<string, string> = {
      "ai": "Free AI tools for background removal, text summarization, speech to text, code generation, and marketing. Fast, browser-based AI utilities.",
      "pdf": "Free PDF tools to merge, split, compress, sign, and convert PDF documents to Word, Excel, and PPT. Fast, secure, and watermark-free online tools.",
      "image": "Free online image tools to compress, resize, crop, and convert JPG, PNG, and WebP photos. Fast browser processing with zero quality loss.",
      "video": "Free video tools to trim clips, convert video to audio, adjust playback speed, and change resolution online. Fast and easy video utilities.",
      "audio": "Free audio tools to convert formats, transcribe speech to text, trim tracks, and merge audio files online. Fast, high-quality audio utilities.",
      "text": "Free online text tools to count words, convert text cases, clean spaces, sort lines, and compare text diffs. Fast and simple text utilities.",
      "security": "Free security tools to generate strong passwords, compute hashes, encode Base64, and scan QR safety. Client-side privacy and encryption tools.",
      "finance": "Free finance tools to calculate loan EMIs, GST amounts, investment returns, salary breakups, and invoices. Accurate financial calculators.",
      "dev": "Free developer tools to format JSON, test regular expressions, decode JWT tokens, and generate Dockerfiles. Fast online coding utilities.",
      "education": "Free education tools with scientific calculators, unit converters, study timetables, and MCQ generators. Smart learning utilities for students.",
      "internet": "Free internet tools for IP address lookup, DNS record checks, SSL certificate verification, and website screenshots. Fast network tools.",
      "seo": "Free SEO tools to generate meta tags, check keyword density, validate XML sitemaps, and audit on-page SEO. Boost your search rankings.",
      "social": "Free social media tools to generate viral hashtags, profile bios, caption line breaks, and memes. Boost your social reach and engagement.",
      "zip": "Free ZIP tools to compress files, extract archives, and create password-protected ZIP folders online. Fast browser-based archive utilities.",
      "date-time": "Free date and time tools to calculate age, count days between dates, compute business days, and view world clocks. Fast time calculators.",
      "govt-legal": "Free legal tools to resize passport and Aadhaar photos under 50KB, create signatures, and generate legal document templates online.",
      "ecommerce": "Free e-commerce tools to remove backgrounds, add shadows, generate barcodes, and create GST invoices. Boost your online store sales.",
      "email": "Free email marketing tools to generate subject lines, check spam scores, preview HTML emails, and generate SPF and DKIM records."
    };

    return descriptions[categoryId || ""] || `Free online ${category.name.toLowerCase()} for all your needs. Fast, browser-based utilities with zero registration required.`;
  };

  const getCategoryKeywords = () => {
    const keywords: Record<string, string[]> = {
      "ai": ["ai tools", "ai background remover", "ai text summarizer", "speech to text", "ai code generator", "free ai utilities", "machine learning tools"],
      "pdf": ["free pdf editor", "pdf converter", "pdf merger", "pdf compressor", "pdf tools online", "edit pdf free", "convert pdf", "pdf organizer"],
      "image": ["image compressor", "image converter", "resize image", "crop image", "image editor free", "compress images", "convert images", "image tools"],
      "video": ["video editor", "video converter", "trim video", "video to audio", "video processing", "edit video free", "video tools", "video editor online"],
      "audio": ["audio converter", "audio editor", "trim audio", "merge audio", "audio processing", "edit audio free", "audio tools", "audio merger"],
      "text": ["word counter", "text editor", "case converter", "text tools", "text processing", "edit text free", "text utilities", "writing tools"],
      "security": ["password generator", "hash calculator", "security tools", "encryption tools", "privacy tools", "security utilities", "online security", "base64 encoder"],
      "finance": ["gst calculator", "emi calculator", "invoice generator", "finance tools", "business calculator", "tax tools", "currency converter", "financial calculator"],
      "dev": ["json formatter", "regex tester", "jwt decoder", "url encoder", "developer tools", "programming tools", "web development", "coding utilities"],
      "education": ["scientific calculator", "unit converter", "percentage calculator", "learning tools", "calculator", "educational utilities", "study tools", "math tools"],
      "internet": ["ip lookup", "dns checker", "ssl checker", "ping test", "network tools", "web tools", "internet utilities", "network analysis"],
      "seo": ["meta tags", "keyword analyzer", "robots txt", "page seo", "seo tools", "search optimization", "website seo", "optimization tools"],
      "social": ["hashtag generator", "bio creator", "caption formatter", "social media tools", "social utilities", "media tools", "content creator", "social marketing"],
      "zip": ["create zip", "extract zip", "compression zip", "file compression", "zip creator", "archive extractor", "file manager", "compression tools"],
      "date-time": ["date calculator", "age calculator", "countdown timer", "working days", "time tools", "scheduler", "planning tools", "date utilities"],
      "govt-legal": ["passport photo", "document creator", "signature maker", "legal tools", "legal utilities", "government forms", "document tools", "legal aid"],
      "ecommerce": ["barcode generator", "invoice creator", "gst invoice", "business tools", "seller tools", "online store", "e-commerce utilities", "online business tools"],
      "email": ["email subject generator", "email spam checker", "html email previewer", "spf generator", "dkim generator", "email marketing tools"]
    };

    return keywords[categoryId || ""] || ["free online tools", "web utilities", "browser tools", "online applications"];
  };

  const getTrendingTools = () => {
    const trendingMap: Record<string, string[]> = {
      "ai": ["ai-background-remover", "ai-speech-to-text", "ai-text-summarizer", "ai-dockerfile-generator"],
      "pdf": ["pdf-to-word", "pdf-to-image", "pdf-merge", "pdf-compressor"],
      "image": ["png-to-jpg-converter", "qr-code-scanner", "image-compressor", "image-resize"],
      "video": ["video-to-audio", "video-trim", "video-speed", "video-thumbnail"],
      "audio": ["audio-converter", "ai-speech-to-text", "audio-trimmer", "audio-merger"],
      "text": ["word-counter", "case-converter", "color-converter", "text-diff"],
      "security": ["password-generator", "password-strength", "hash-generator", "base64-tool"],
      "finance": ["invoice-generator", "gst-calculator", "emi-calculator", "currency-converter"],
      "dev": ["json-formatter", "regex-tester", "jwt-decoder", "url-encoder"],
      "education": ["scientific-calculator", "percentage-calc", "unit-converter", "compound-interest"],
      "internet": ["ip-lookup", "dns-lookup", "ssl-checker", "ping-test"],
      "seo": ["meta-title-description", "keyword-density", "robots-txt", "page-seo"],
      "social": ["ai-hashtag-generator", "ai-bio-generator", "caption-formatter", "ai-meme-generator"],
      "zip": ["create-zip", "extract-zip", "password-zip", "compression-zip"],
      "date-time": ["date-difference", "age-calculator", "working-days", "countdown"],
      "govt-legal": ["passport-photo-resizer", "pdf-compressor", "signature-maker", "document-template"],
      "ecommerce": ["ai-shadow-adder", "barcode-generator", "gst-invoice-generator", "ecommerce-calculator"],
      "email": ["ai-email-subject-line-generator", "ai-spam-score-checker", "html-email-previewer", "spf-record-generator"]
    };

    return trendingMap[categoryId || ""] || [];
  };

  const trendingTools = getTrendingTools();
  const isTrending = (toolId: string) => trendingTools.includes(toolId);

  // Combined specific and universal FAQs
  const categoryFaqs = getCategoryFaqs(category.name);
  const combinedFaqs = [...categoryFaqs, ...universalToolFaqs].slice(0, 8);

  return (
    <>
      <SEOHelmet
        title={`Free ${category.name.endsWith('Tools') ? category.name : `${category.name} Tools`} Online - No Signup Required`}
        description={getCategoryDescription()}
        keywords={getCategoryKeywords()}
        category={category.name}
      />
      <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border/60 bg-muted/20">
          <div className="container py-4 flex items-center justify-center">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground font-semibold">{category.name}</span>
            </nav>
          </div>
        </div>

        {/* Category Header - Enhanced */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 sm:py-20">
          {/* Grid backdrop */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <svg className="absolute inset-0 h-full w-full stroke-primary/[0.04] [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]">
              <defs>
                <pattern id="grid-pattern-category" width="24" height="24" patternUnits="userSpaceOnUse" x="-1" y="-1">
                  <path d="M.5 24V.5H24" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern-category)" />
            </svg>
          </div>

          {/* Animated background elements */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: `hsl(${category.color} / 0.15)` }}
          />
          
          <div className="container relative px-4 text-center">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center max-w-4xl mx-auto"
            >
              {/* Enhanced Icon with Glow Aura */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: [0, -4, 4, 0] }}
                transition={{ duration: 0.5 }}
                className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl mb-6 shadow-lg shadow-black/5"
                style={{
                  backgroundColor: `hsl(${category.color} / 0.12)`,
                  border: `1px solid hsl(${category.color} / 0.25)`,
                }}
              >
                <Icon
                  className="h-8 w-8 sm:h-10 sm:w-10 relative z-10"
                  style={{ color: `hsl(${category.color})` }}
                />
                {/* Glow ring */}
                <div
                  className="absolute inset-0 rounded-2xl sm:rounded-3xl animate-pulse pointer-events-none"
                  style={{
                    boxShadow: `0 0 25px 5px hsl(${category.color} / 0.35)`,
                  }}
                />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                {category.name}
                <span className="relative ml-1">
                  <span 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: `hsl(${category.color})` }}
                  />
                </span>
              </h1>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span 
                  className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
                  style={{ backgroundColor: `hsl(${category.color})` }}
                >
                  {category.tools.length} Tools
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
                  100% Free
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  No Registration
                </span>
              </div>

              <p className="mt-6 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed font-light max-w-2xl">
                {getCategoryDescription()}
              </p>

              {/* HSL Styled Keyword badging */}
              <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-3xl">
                {getCategoryKeywords().slice(0, 8).map((keyword, index) => (
                  <span 
                    key={index} 
                    style={{ 
                      backgroundColor: `hsl(${category.color} / 0.05)`,
                      borderColor: `hsl(${category.color} / 0.2)`,
                      color: `hsl(${category.color})`
                    }}
                    className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-sm backdrop-blur-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* All Tools Section - Enhanced */}
        <section className="py-12 sm:py-16">
          <div className="container">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-10"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg"
                >
                  <TrendingUp className="h-6 w-6 text-primary" />
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tight">All {category.name}</h2>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                    </motion.div>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-muted-foreground">
                Complete collection of {category.name.toLowerCase()} - Trending tools shown first
              </p>
            </motion.div>

            {/* Enhanced grid with stagger animation */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {category.tools
                .sort((a, b) => {
                  const aIsTrending = isTrending(a.id);
                  const bIsTrending = isTrending(b.id);
                  if (aIsTrending && !bIsTrending) return -1;
                  if (!aIsTrending && bIsTrending) return 1;
                  return 0;
                })
                .map((tool, index) => (
                  <ToolCard
                    key={tool.id}
                    id={tool.id}
                    name={tool.name}
                    description={tool.description}
                    path={tool.path}
                    categoryColor={category.color}
                    isTrending={isTrending(tool.id)}
                    delay={index * 0.05}
                  />
                ))}
            </motion.div>
          </div>
        </section>

        {/* Category Features & Privacy Section */}
        <section className="py-12 border-t border-border/60 bg-muted/20">
          <div className="container">
            <div className="max-w-4xl mx-auto rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Why Use Our {category.name}?</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 font-light text-sm sm:text-base">
                DailyTools247 is engineered to provide professional-grade {category.name.toLowerCase()} that run directly inside your web browser. By leveraging modern client-side technologies, your files and private data are processed locally with maximum speed, zero queuing delays, and complete data confidentiality.
              </p>
              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                <div className="p-4 rounded-xl bg-background/80 border border-border/60">
                  <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Instant Processing
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Zero upload wait times. Work directly on your device with high performance.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-background/80 border border-border/60">
                  <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    100% Private
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your files never touch our servers. No data retention or tracking.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-background/80 border border-border/60">
                  <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    No Limits
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Use any tool as many times as you need without paywalls or watermarks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <CategoryFAQSection faqs={combinedFaqs} categoryName={category.name.toLowerCase()} />
      </main>
      <Footer />
    </div>
    </>
  );
};

export default CategoryPage;
