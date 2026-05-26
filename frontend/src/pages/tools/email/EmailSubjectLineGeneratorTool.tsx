import { useState } from "react";
import { Copy, Check, Sparkles, Wand2, Star, ThumbsUp, AlertTriangle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";
import ToolLayout from "@/components/layout/ToolLayout";
import ToolFAQ from "@/components/ToolFAQ";
import ToolHero from "@/components/ToolHero";
import { API_URLS } from "@/lib/api-complete";
import { CategorySEO } from "@/components/ToolSEO";
import { getToolSeoMetadata } from "@/data/toolSeoEnhancements";

const categoryColor = "250 85% 55%";

interface SubjectResult {
  subject: string;
  score: number;
  rating: string;
  reason: string;
  tips: string;
}

const EmailSubjectLineGeneratorTool = () => {
  const toolSeoData = getToolSeoMetadata('email-subject-line-generator');
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("newsletter");
  const [tone, setTone] = useState("professional");
  const [results, setResults] = useState<SubjectResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Custom checker states
  const [customSubject, setCustomSubject] = useState("");
  const [customAnalysis, setCustomAnalysis] = useState<{
    score: number;
    rating: string;
    tips: string;
  } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywords.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URLS.BASE_URL}${API_URLS.EMAIL_SUBJECT_LINE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, tone, category }),
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const analyzeCustomSubject = () => {
    if (!customSubject.trim()) return;

    let score = 70; // baseline
    const len = customSubject.length;
    
    // Length check
    if (len >= 40 && len <= 60) score += 15;
    else if (len > 75) score -= 15;
    else if (len < 20) score -= 10;

    // Emojis check
    const emojiRegex = /[\uD800-\uDFFF\u2600-\u27BF]/;
    if (emojiRegex.test(customSubject)) {
      score += 8;
    }

    // Power words check
    const powerWords = ["free", "save", "exclusive", "now", "off", "guaranteed", "urgent", "secrets", "proven"];
    powerWords.forEach(word => {
      if (customSubject.toLowerCase().includes(word)) score += 5;
    });

    // Spam indicators check
    if (customSubject.includes("!!!") || customSubject.includes("$$$") || (customSubject === customSubject.toUpperCase() && customSubject.length > 5)) {
      score -= 20;
    }

    score = Math.min(100, Math.max(10, score));

    let rating = "Good";
    let tips = "Nice! This is a solid email subject line. Consider testing it with split runs.";
    if (score > 85) {
      rating = "Excellent";
      tips = "Perfect score! High open rate potential. Renders correctly on mobile viewports.";
    } else if (score < 60) {
      rating = "Needs Improvement";
      tips = "Make it shorter, avoid excessive punctuation/caps, and include a clear, enticing value hook.";
    }

    setCustomAnalysis({ score, rating, tips });
  };

  return (
    <>
      {CategorySEO.Email(
        toolSeoData?.title || "Email Subject Line Generator",
        toolSeoData?.description || "Create catchy, high-converting subject lines tailored to your target audience.",
        "email-subject-line-generator"
      )}
      <ToolLayout
        breadcrumbTitle="Email Subject Line Generator"
        category="Email Marketing Tools"
        categoryPath="/category/email"
      >
        <div className="space-y-6">
          <ToolHero
            title="Email Subject Line Generator"
            subtitle="Create catchy, high-converting subject lines tailored to your target audience."
            tags={["subject line generator", "email marketing", "open rate"]}
            Icon={Mail}
            categoryColor={categoryColor}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Input Panel */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-1 rounded-xl border border-border bg-card p-6 shadow-sm h-fit"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-indigo-500" />
                Configure Generator
              </h3>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Keywords / Main Topic</label>
                  <input
                    type="text"
                    required
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. Black Friday Sale, New Feature"
                    className="w-full rounded-lg bg-muted px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Campaign Category</label>
                  <select
                    aria-label="Campaign Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg bg-muted px-4 py-2 border border-border focus:outline-none"
                  >
                    <option value="newsletter">Newsletter / Content</option>
                    <option value="promotional">Promotional / Offer</option>
                    <option value="urgency">Urgency / Limited Time</option>
                    <option value="follow-up">Follow-Up Email</option>
                    <option value="cold-outreach">Cold Outreach</option>
                    <option value="welcome">Welcome Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Brand Tone</label>
                  <select
                    aria-label="Brand Tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-lg bg-muted px-4 py-2 border border-border focus:outline-none"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual / Friendly</option>
                    <option value="funny">Funny / Playful</option>
                    <option value="witty">Witty / Clever</option>
                    <option value="assertive">Assertive / Bold</option>
                    <option value="curious">Curious / Mystique</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg py-2.5 font-medium text-white flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, hsl(${categoryColor}) 0%, hsl(${categoryColor} / 0.8) 100%)`,
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  {loading ? "Generating..." : "Generate Subject Lines"}
                </button>
              </form>
            </motion.div>

            {/* Output Panel */}
            <div className="lg:col-span-2 space-y-6">
              {results.length > 0 ? (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    Generated Recommendations
                  </h3>
                  <div className="space-y-3">
                    {results.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <p className="font-medium text-foreground select-all">{item.subject}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-white ${
                                item.score >= 85
                                  ? "bg-green-500"
                                  : item.score >= 70
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            >
                              Score: {item.score}/100
                            </span>
                            <span className="text-muted-foreground">• {item.rating}</span>
                            <span className="text-muted-foreground">• {item.tips}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.subject, idx)}
                          className="flex items-center justify-center h-8 w-8 rounded-lg bg-card border border-border hover:bg-muted self-end sm:self-center"
                          aria-label="Copy subject line"
                          title="Copy subject line"
                        >
                          {copiedIndex === idx ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border border-border border-dashed rounded-xl bg-card text-muted-foreground">
                  <Wand2 className="h-12 w-12 mb-2 text-muted-foreground/50" />
                  <p>Configure parameters and click generate to view subject line suggestions.</p>
                </div>
              )}

              {/* Analyzer Panel */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Real-time Subject Tester
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Paste your own custom subject line to test its character length, spam flags, and performance score.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Enter subject line to test..."
                    className="flex-1 rounded-lg bg-muted px-4 py-2 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={analyzeCustomSubject}
                    className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 border border-border"
                  >
                    Analyze
                  </button>
                </div>

                {customAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 border border-border rounded-lg bg-muted/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold" style={{ color: customAnalysis.score >= 85 ? '#22c55e' : customAnalysis.score >= 70 ? '#eab308' : '#ef4444' }}>
                        {customAnalysis.score}/100
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{customAnalysis.rating}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{customAnalysis.tips}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-border bg-muted/20 p-6 space-y-4"
          >
            <h4 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-indigo-500" />
              Subject Line Best Practices
            </h4>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="p-3 bg-card rounded-lg border border-border">
                <span className="font-semibold block text-indigo-600 mb-1">1. Keep it Short</span>
                Aim for 40-50 characters. Mail clients truncate anything longer, especially on mobile devices.
              </div>
              <div className="p-3 bg-card rounded-lg border border-border">
                <span className="font-semibold block text-green-600 mb-1">2. Use Power Words</span>
                Incorporate actionable verbs and engaging modifiers, but avoid spam trigger words.
              </div>
              <div className="p-3 bg-card rounded-lg border border-border">
                <span className="font-semibold block text-amber-600 mb-1">3. Emoji Placement</span>
                Emojis can increase open rates by 56% if they are relevant, minimal, and placed at the beginning or end.
              </div>
            </div>
          </motion.div>

          {/* Tool Definition Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              What is Email Subject Line Generation?
            </h3>
            <p className="text-muted-foreground mb-4">
              Email Subject Line Generation utilizes structured parameters and keyword matching to produce engaging, click-worthy subject lines. It helps marketers write subjects optimized for high open rates while avoiding spam filters.
            </p>
            
            <h4 className="font-semibold mb-2">How It Works</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
              <li>Enter the main keywords or topic of your email.</li>
              <li>Select your campaign category and brand tone.</li>
              <li>Generate catchy options with estimated open-rate scores.</li>
              <li>Paste custom subject lines into the tester to evaluate spam triggers and character lengths.</li>
            </ol>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-1">Key Features</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Topic-based subject line generator</li>
                  <li>• Custom brand tone alignment</li>
                  <li>• Real-time custom subject line tester</li>
                  <li>• Detailed readability/open rate scoring</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-1">Use Cases</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Improving campaign open rates</li>
                  <li>• A/B testing subject lines</li>
                  <li>• Removing spam trigger words</li>
                  <li>• Optimizing titles for mobile displays</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <ToolFAQ
            faqs={[
              {
                question: "What is an email subject line score?",
                answer: "It estimates the overall clickability and open rate safety of your subject line based on character length, presence of action hooks, and lack of spam triggers.",
              },
              {
                question: "Should I always use emojis?",
                answer: "Not necessarily. For B2B audiences, emojis should be used sparingly. In B2C and casual campaigns, they can help your email stand out in crowded inboxes.",
              },
              {
                question: "Why does subject line length matter?",
                answer: "Most mobile email apps display only the first 35 to 45 characters. Placing your primary value proposition early ensures it isn't clipped.",
              },
            ]}
          />
        </div>
      </ToolLayout>
    </>
  );
};

export default EmailSubjectLineGeneratorTool;
