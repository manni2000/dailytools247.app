import { useState } from "react";
import { Eye, FileCode, Monitor, Smartphone, AlertCircle, ShieldAlert, Sparkles, Download, RotateCcw, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";
import ToolLayout from "@/components/layout/ToolLayout";
import ToolFAQ from "@/components/ToolFAQ";
import ToolHero from "@/components/ToolHero";
import { API_URLS } from "@/lib/api-complete";
import { CategorySEO } from "@/components/ToolSEO";
import { getToolSeoMetadata } from "@/data/toolSeoEnhancements";

const categoryColor = "250 85% 55%";

const defaultPresetHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome Newsletter</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f5; font-family:sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f4f5; padding:30px 0;">
    <tr>
      <td align="center" style="padding:10px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; max-width:600px; width:100%;">
          <tr>
            <td style="background-color:#4f46e5; padding:40px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:28px;">Welcome to Acme Corp!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px; color:#374151; line-height:1.6;">
              <p>Hi there,</p>
              <p>Thank you for subscribing to our news. We are thrilled to have you on board! We promise to bring you useful tips, exclusive promotions, and company updates directly to your inbox.</p>
              <p style="margin-top:25px; text-align:center;">
                <a href="https://example.com" style="background-color:#4f46e5; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:4px; font-weight:bold; display:inline-block;">Get Started Now</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#1f2937; padding:20px; text-align:center; color:#9ca3af; font-size:12px;">
              <p style="margin:0 0 8px 0;">© 2026 Acme Corp, 100 Main St, NY.</p>
              <p style="margin:0;">To opt out, click here to <a href="#" style="color:#6366f1; text-decoration:underline;">unsubscribe</a>.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

interface AnalysisResult {
  score: number;
  sizeKb: string;
  issues: Array<{
    type: "error" | "warning" | "info";
    message: string;
  }>;
}

const HTMLEmailPreviewerTool = () => {
  const toolSeoData = getToolSeoMetadata('html-email-previewer');
  const [htmlCode, setHtmlCode] = useState(defaultPresetHtml);
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">("desktop");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!htmlCode.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URLS.BASE_URL}${API_URLS.HTML_EMAIL_PREVIEWER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: htmlCode }),
      });
      const data = await response.json();
      if (data.success) {
        setAnalysis({
          score: data.score,
          sizeKb: data.sizeKb,
          issues: data.issues,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "email_template.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {CategorySEO.Email(
        toolSeoData?.title || "HTML Email Previewer & Analyzer",
        toolSeoData?.description || "Paste your HTML code, preview it across responsive screen sizes, and identify compatibility errors before sending.",
        "html-email-previewer"
      )}
      <ToolLayout
        breadcrumbTitle="HTML Email Previewer"
        category="Email Marketing Tools"
        categoryPath="/category/email"
      >
        <div className="space-y-6">
          <ToolHero
            title="HTML Email Previewer & Analyzer"
            subtitle="Paste your HTML code, preview it across responsive screen sizes, and identify compatibility errors before sending."
            tags={["html email preview", "email testing", "compatibility"]}
            Icon={Mail}
            categoryColor={categoryColor}
          />

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Editor Pane (Left) */}
            <div className="lg:col-span-6 space-y-4">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-indigo-500" />
                    HTML Email Editor
                  </h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setHtmlCode("")}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors"
                      title="Clear code"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="p-1.5 rounded hover:bg-muted text-indigo-600 transition-colors"
                      title="Download template"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  placeholder="Paste your HTML email template code here..."
                  className="w-full h-[450px] font-mono text-xs rounded-lg border border-border p-4 bg-muted/30 focus:outline-none"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="flex-1 rounded-lg py-2.5 font-medium text-white flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, hsl(${categoryColor}) 0%, hsl(${categoryColor} / 0.8) 100%)`,
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {loading ? "Analyzing..." : "Analyze & Preview"}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Preview Pane & Results (Right) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Responsive Preview Screen */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Eye className="h-5 w-5 text-indigo-500" />
                    Live Render
                  </h3>
                  {/* Viewport Toggles */}
                  <div className="flex rounded-lg border border-border p-1 bg-muted">
                    <button
                      type="button"
                      onClick={() => setViewportMode("desktop")}
                      className={`p-1.5 rounded-md ${
                        viewportMode === "desktop" ? "bg-white shadow text-indigo-600" : "text-muted-foreground"
                      }`}
                      aria-label="Desktop view"
                      title="Desktop view"
                    >
                      <Monitor className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewportMode("mobile")}
                      className={`p-1.5 rounded-md ${
                        viewportMode === "mobile" ? "bg-white shadow text-indigo-600" : "text-muted-foreground"
                      }`}
                      aria-label="Mobile view"
                      title="Mobile view"
                    >
                      <Smartphone className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Render Container */}
                <div className="border border-border rounded-lg bg-muted/20 p-2 flex justify-center overflow-hidden">
                  <div
                    className="transition-all duration-300 bg-white shadow-inner rounded overflow-hidden"
                    style={{
                      width: viewportMode === "mobile" ? "375px" : "100%",
                      maxWidth: "100%",
                      height: "400px",
                    }}
                  >
                    <iframe
                      title="Email Preview Frame"
                      srcDoc={htmlCode}
                      className="w-full h-full border-none bg-white"
                      sandbox="allow-popups"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Analysis Inspector */}
              {analysis && (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Render Analysis</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold" style={{ color: analysis.score >= 80 ? '#22c55e' : analysis.score >= 50 ? '#eab308' : '#ef4444' }}>
                        {analysis.score}/100
                      </div>
                      <div className="text-xs text-muted-foreground">HTML Size: {analysis.sizeKb} KB</div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {analysis.issues.length > 0 ? (
                      analysis.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-2.5 p-3 rounded-lg border text-sm ${
                            issue.type === "error"
                              ? "bg-red-50 text-red-950 border-red-200"
                              : issue.type === "warning"
                              ? "bg-yellow-50 text-yellow-950 border-yellow-200"
                              : "bg-blue-50 text-blue-950 border-blue-200"
                          }`}
                        >
                          {issue.type === "error" ? (
                            <ShieldAlert className="h-4 w-4 mt-0.5 text-red-600 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="h-4 w-4 mt-0.5 text-yellow-600 flex-shrink-0" />
                          )}
                          <span>{issue.message}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 border border-green-200 bg-green-50 text-green-900 rounded-lg text-sm">
                        🎉 Splendid! No rendering or compatibility alerts were detected. Ready to send!
                      </div>
                    )}
                  </div>
                </motion.div>
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
              <Eye className="h-5 w-5 text-blue-500" />
              What is HTML Email Previewing?
            </h3>
            <p className="text-muted-foreground mb-4">
              HTML Email Previewing renders your raw HTML email templates in an isolated environment. It tests how the markup displays on different viewport sizes and analyzes compatibility issues across different email software.
            </p>
            
            <h4 className="font-semibold mb-2">How It Works</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
              <li>Paste your raw email HTML code into the editor.</li>
              <li>View the layout instantly in desktop or mobile frames.</li>
              <li>Click Analyze to run a compatibility check.</li>
              <li>Read suggestions on layout width, CSS usage, images, and HTML size constraints.</li>
            </ol>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-1">Key Features</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Isolated sandboxed iframe render</li>
                  <li>• Interactive desktop/mobile viewport toggle</li>
                  <li>• Real-time HTML size calculation</li>
                  <li>• CSS compatibility checker</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-1">Use Cases</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Checking responsive mobile layouts</li>
                  <li>• Avoiding Gmail 102KB email clipping</li>
                  <li>• Identifying broken HTML syntax/tags</li>
                  <li>• Reviewing image and link paths</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <ToolFAQ
            faqs={[
              {
                question: "Why do email designs break on Gmail mobile?",
                answer: "Gmail on mobile parses media queries and embedded styles differently. It often drops external style headers, making inline styles crucial.",
              },
              {
                question: "Why is HTML code size important for emails?",
                answer: "If your HTML payload exceeds 102 KB, Google Gmail will truncate the email footer, rendering a link saying '[Message clipped] View entire message'. This hides your unsubscribe link and web trackers.",
              },
              {
                question: "Should I use Javascript or video embeds in emails?",
                answer: "No. Interactive scripts, inputs, and videos (iframe or object) are blocked by nearly all modern email providers to guard against phishing and security leaks.",
              },
            ]}
          />
        </div>
      </ToolLayout>
    </>
  );
};

export default HTMLEmailPreviewerTool;
