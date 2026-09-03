import { useState } from "react";
import { Check, AlertTriangle, AlertOctagon, HelpCircle, FileText, HeartCrack, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIProcessingIndicator from "@/components/AIProcessingIndicator";
import { fadeInUp, scaleIn } from "@/lib/animations";
import ToolLayout from "@/components/layout/ToolLayout";
import ToolFAQ from "@/components/ToolFAQ";
import ToolHero from "@/components/ToolHero";
import { API_URLS } from "@/lib/api-complete";
import { CategorySEO } from "@/components/ToolSEO";
import { getToolSeoMetadata } from "@/data/toolSeoEnhancements";

const categoryColor = "250 85% 55%";

interface SpamCheckResult {
  score: number;
  rating: string;
  spamWordsFound: string[];
  recommendations: string[];
}

const SpamScoreCheckerTool = () => {
  const toolSeoData = getToolSeoMetadata('ai-spam-score-checker');
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpamCheckResult | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() && !body.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URLS.BASE_URL}${API_URLS.SPAM_SCORE_CHECKER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await response.json();
      if (data.success) {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500 border-green-500 bg-green-50/50";
    if (score >= 50) return "text-yellow-500 border-yellow-500 bg-yellow-50/50";
    return "text-red-500 border-red-500 bg-red-50/50";
  };

  return (
    <>
      {CategorySEO.Email(
        toolSeoData?.title || "Email AI Spam Score Checker",
        toolSeoData?.description || "Scan your subject lines and email copy for words, links, and formatting that trigger spam filters.",
        "ai-spam-score-checker"
      )}
      <ToolLayout
        breadcrumbTitle="AI Spam Score Checker"
        category="Email Marketing Tools"
        categoryPath="/category/email"
      >
        <div className="space-y-6">
          <ToolHero
            title="Email AI Spam Score Checker"
            subtitle="Scan your subject lines and email copy for words, links, and formatting that trigger spam filters."
            tags={["spam checker", "deliverability", "email content"]}
            Icon={Mail}
            categoryColor={categoryColor}
          />

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Input form */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                Email Content Composer
              </h3>
              <form onSubmit={handleCheck} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Subject Line</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter your email subject line..."
                    className="w-full rounded-lg bg-muted px-4 py-2.5 border border-border focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email Body Copy (Plain text or HTML)</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Paste or write your email body text here..."
                    className="w-full h-72 rounded-lg bg-muted px-4 py-3 border border-border focus:outline-none text-sm font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg py-2.5 font-medium text-white flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, hsl(${categoryColor}) 0%, hsl(${categoryColor} / 0.8) 100%)`,
                  }}
                >
                  {loading ? "Analyzing Copy..." : "Scan Email for Spam"}
                </button>
              </form>
            </motion.div>

            {/* Results Panel */}
            <div className="lg:col-span-5 space-y-6">
              {result ? (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Score circle */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
                    <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Deliverability Score</h3>
                    <div className={`h-28 w-28 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(result.score)}`}>
                      <span className="text-3xl font-extrabold">{result.score}</span>
                      <span className="text-[10px] font-bold">/ 100</span>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{result.rating}</div>
                      <p className="text-xs text-muted-foreground mt-1">Scores above 80 typically pass standard corporate inbox filters.</p>
                    </div>
                  </div>

                  {/* Identified spam terms */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <AlertOctagon className="h-4 w-4 text-red-500" />
                      Trigger Words Found ({result.spamWordsFound.length})
                    </h3>
                    {result.spamWordsFound.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.spamWordsFound.map((word, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-1 rounded bg-red-100 text-red-800 border border-red-200 text-xs font-medium"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Fantastic! No spam keywords detected in subject or body.</p>
                    )}
                  </div>

                  {/* Recommendations */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Actionable Checklist
                    </h3>
                    <div className="space-y-2">
                      {result.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex gap-2 text-xs text-foreground bg-muted/30 p-2.5 rounded-lg border border-border">
                          <Check className="h-4.5 w-4.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border border-border border-dashed rounded-xl bg-card text-muted-foreground text-center">
                  <HeartCrack className="h-12 w-12 mb-2 text-muted-foreground/40" />
                  <p className="text-sm">Submit your email subject and body copy to trigger the spam analyzer engine.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tool Definition Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-6"
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-blue-500" />
              What is Spam Score Checking?
            </h3>
            <p className="text-muted-foreground mb-4">
              Spam Score Checking analyzes text and HTML emails to identify potential triggers that might cause spam filters to flag or route the message to the spam folder. It evaluates keywords, punctuation, capitalizations, and link structures.
            </p>
            
            <h4 className="font-semibold mb-2">How It Works</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
              <li>Paste your email subject line and body text.</li>
              <li>Run the analyzer to calculate a score from 0 (Safe) to 100 (High Risk).</li>
              <li>Review flagged trigger words, formatting issues, and link counts.</li>
              <li>Adjust your content based on recommendations to optimize inbox delivery.</li>
            </ol>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-1">Key Features</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Financial & sales hype trigger words check</li>
                  <li>• Formatting & capitalization analyzer</li>
                  <li>• Real-time score calculator</li>
                  <li>• Actionable checklist recommendations</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-1">Use Cases</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Auditing campaign copies before dispatch</li>
                  <li>• Removing spam filters trigger terms</li>
                  <li>• Verifying link densities</li>
                  <li>• Maximizing marketing ROI & inbox rates</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <ToolFAQ
            faqs={[
              {
                question: "What triggers an email to go to spam?",
                answer: "Several components: spam trigger terms (financial hype, artificial urgency), formatting (ALL CAPS, too many exclamation marks), high link counts with short copy, and DNS authentication records (SPF/DKIM/DMARC).",
              },
              {
                question: "Can email spam checkers guarantee placement?",
                answer: "No checker can guarantee 100% placement because receiver firewalls use sender IP reputation, history, and individual subscriber behavior to make final filters. However, content scanning eliminates common flags.",
              },
              {
                question: "How do I avoid filters without rewriting everything?",
                answer: "Keep your style professional, minimize multiple sales pitch words like 'FREE' or 'Winner', verify your links point to valid HTTPS URLs, and include a clear, compliant footer with an unsubscribe option.",
              },
            ]}
          />
        </div>
      </ToolLayout>
    </>
  );
};

export default SpamScoreCheckerTool;
