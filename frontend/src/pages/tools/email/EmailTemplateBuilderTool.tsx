import { useState, useEffect } from "react";
import { Copy, Check, FileCode, Monitor, Smartphone, LayoutGrid, Download, Sliders, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import ToolLayout from "@/components/layout/ToolLayout";
import ToolFAQ from "@/components/ToolFAQ";
import ToolHero from "@/components/ToolHero";
import { API_URLS } from "@/lib/api-complete";
import SimilarTools from "@/components/SimilarTools";

const categoryColor = "250 85% 55%";

const EmailTemplateBuilderTool = () => {
  const [layout, setLayout] = useState("newsletter");
  const [title, setTitle] = useState("Exciting Updates Ahead!");
  const [subtitle, setSubtitle] = useState("Here is what we have been building for you this month");
  const [body, setBody] = useState("We are thrilled to launch our new product features designed to help you save time and boost productivity. Click below to read our detailed release notes and discover how to activate them on your account.");
  const [buttonText, setButtonText] = useState("Explore New Features");
  const [buttonUrl, setButtonUrl] = useState("https://example.com/features");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=60");
  const [footerText, setFooterText] = useState("© 2026 Acme Corp. 123 Innovation Way, Tech Suite 500, California. You received this because you are an active subscriber.");

  const [compiledHtml, setCompiledHtml] = useState("");
  const [viewportMode, setViewportMode] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`${API_URLS.BASE_URL}${API_URLS.EMAIL_TEMPLATE_BUILDER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layout,
          content: { title, subtitle, body, buttonText, buttonUrl, imageUrl, footerText },
        }),
      });
      const data = await response.json();
      if (data.success) {
        setCompiledHtml(data.html);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTemplate();
    }, 450); // Debounce template rebuilds

    return () => clearTimeout(timer);
  }, [layout, title, subtitle, body, buttonText, buttonUrl, imageUrl, footerText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([compiledHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${layout}_template.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadPreset = (preset: string) => {
    setLayout(preset);
    if (preset === "newsletter") {
      setTitle("Monthly Newsletter");
      setSubtitle("Industry news, company articles, and resources");
      setBody("Welcome to our weekly dispatch! Inside this edition, discover why micro-animations are transforming web engagement, learn how to audit your site's SEO in under an hour, and read our interview with Acme's lead product designer.");
      setButtonText("Read Full Articles");
      setButtonUrl("https://example.com/blog");
      setImageUrl("https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=60");
    } else if (preset === "promotional") {
      setTitle("Flash Sale: 40% Off!");
      setSubtitle("Upgrade to professional plans and save big today");
      setBody("Unlock unlimited workflows, PDF exports, and premium developer APIs for 40% less. This exclusive discount is automatically applied at checkout and expires this Friday. Grab your premium seat today.");
      setButtonText("Claim Your Discount");
      setButtonUrl("https://example.com/pricing");
      setImageUrl("https://images.unsplash.com/photo-1472851294608-062f824d296e?w=800&auto=format&fit=crop&q=60");
    } else if (preset === "welcome") {
      setTitle("Welcome Aboard!");
      setSubtitle("We're excited to help you optimize your workflows");
      setBody("Thank you for joining Acme Corp. We built this platform to make daily media processing, security hashing, and document management effortless. We recommend starting with our 5-minute video guide below.");
      setButtonText("Watch Quick Start Video");
      setButtonUrl("https://example.com/welcome-guide");
      setImageUrl("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60");
    } else {
      // transactional
      setTitle("Invoice / Order Confirmation");
      setSubtitle("Order ID: #ACM-2026-98213");
      setBody("Thank you for your purchase. Your payment of $49.00 has been processed successfully. Your developer license keys are now active. You can find detailed billing details and download PDFs in your dashboard.");
      setButtonText("View Account Dashboard");
      setButtonUrl("https://example.com/dashboard");
    }
  };

  return (
    <>
      <ToolLayout
        breadcrumbTitle="Email Template Builder"
        category="Email Marketing Tools"
        categoryPath="/category/email"
      >
        <div className="space-y-6">
          <ToolHero
            title="Email Template Builder"
            subtitle="Create responsive, inline-styled HTML marketing email templates without writing code."
            tags={["email template", "html email", "responsive"]}
            Icon={Mail}
            categoryColor={categoryColor}
          />

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Input Config panels (Left) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Presets and template layout */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
              >
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-indigo-500" />
                  Select Template
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "newsletter", label: "Newsletter" },
                    { id: "promotional", label: "Promotional" },
                    { id: "welcome", label: "Welcome Setup" },
                    { id: "transactional", label: "Transactional Receipt" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => loadPreset(item.id)}
                      className={`rounded-lg py-2 border text-xs font-semibold ${
                        layout === item.id
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-border hover:bg-muted text-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Editor controls */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
              >
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-indigo-500" />
                  Customize Content
                </h3>
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Header Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter header title"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Subtitle / Subheader</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Enter subtitle or subheader"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border text-sm focus:outline-none"
                    />
                  </div>
                  {layout !== "transactional" && (
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Banner Image URL</label>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full rounded-lg bg-muted px-3 py-2 border border-border text-sm focus:outline-none"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Body Text Paragraph</label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Enter body text paragraph"
                      className="w-full h-28 rounded-lg bg-muted px-3 py-2 border border-border text-sm focus:outline-none"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        placeholder="e.g., Click Here"
                        className="w-full rounded-lg bg-muted px-3 py-2 border border-border text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">CTA Button URL</label>
                      <input
                        type="text"
                        value={buttonUrl}
                        onChange={(e) => setButtonUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full rounded-lg bg-muted px-3 py-2 border border-border text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Footer Legal Text</label>
                    <textarea
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                      placeholder="Enter footer legal text"
                      className="w-full h-16 rounded-lg bg-muted px-3 py-2 border border-border text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Live Preview (Right) */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Template Live Preview</h3>
                  {/* Viewport & Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex rounded-lg border border-border p-0.5 bg-muted">
                      <button
                        type="button"
                        onClick={() => setViewportMode("desktop")}
                        className={`p-1 rounded ${
                          viewportMode === "desktop" ? "bg-white shadow text-indigo-600" : "text-muted-foreground"
                        }`}
                        aria-label="Desktop viewport"
                        title="Desktop viewport"
                      >
                        <Monitor className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewportMode("mobile")}
                        className={`p-1 rounded ${
                          viewportMode === "mobile" ? "bg-white shadow text-indigo-600" : "text-muted-foreground"
                        }`}
                        aria-label="Mobile viewport"
                        title="Mobile viewport"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleDownload}
                      className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-indigo-600"
                      title="Download HTML"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Render screen */}
                <div className="border border-border rounded-lg bg-muted/20 p-2 flex justify-center overflow-hidden">
                  <div
                    className="transition-all duration-300 bg-white shadow-inner rounded overflow-hidden"
                    style={{
                      width: viewportMode === "mobile" ? "375px" : "100%",
                      height: "440px",
                    }}
                  >
                    <iframe
                      title="Template Preview Frame"
                      srcDoc={compiledHtml}
                      className="w-full h-full border-none bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 rounded-lg py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 transition-colors text-sm"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <FileCode className="h-4 w-4" />}
                    {copied ? "HTML Copied!" : "Copy Inline HTML Code"}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          <ToolFAQ
            faqs={[
              {
                question: "Why does the builder use inline CSS styles?",
                answer: "Most email applications (such as Apple Mail, Gmail, and Outlook) strip external stylesheets or head blocks. Inlining CSS directly on elements guarantees your fonts, colors, and layout widths remain intact.",
              },
              {
                question: "Can I replace the Unsubscribe link?",
                answer: "Yes, the generated footer contains an unsubscribe tag placeholder that you can replace with your ESP's (e.g. Mailchimp, Klaviyo) specific tag code (like *|UNSUBSCRIBE|*).",
              },
              {
                question: "How do I ensure image banner displays properly?",
                answer: "Ensure your image URL is hosted on an HTTPS server (like your own website CDN) and is publicly viewable. Some email applications block HTTP images.",
              },
            ]}
          />
          <SimilarTools currentToolSlug="email-template-builder" />
        </div>
      </ToolLayout>
    </>
  );
};

export default EmailTemplateBuilderTool;
