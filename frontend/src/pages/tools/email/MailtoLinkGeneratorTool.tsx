import { useState, useEffect } from "react";
import { Copy, Check, ExternalLink, FileCode, Keyboard, Send, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import ToolLayout from "@/components/layout/ToolLayout";
import ToolFAQ from "@/components/ToolFAQ";
import { API_URLS } from "@/lib/api-complete";
import ToolHero from "@/components/ToolHero";
import { CategorySEO } from "@/components/ToolSEO";
import { getToolSeoMetadata } from "@/data/toolSeoEnhancements";

const categoryColor = "250 85% 55%";

const MailtoLinkGeneratorTool = () => {
  const toolSeoData = getToolSeoMetadata('mailto-link-generator');
  const [to, setTo] = useState("hello@example.com");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("Quick Question");
  const [body, setBody] = useState("Hi there,\n\nI was browsing your website and had a question about your custom design services. Let me know when you are free for a quick call.\n\nBest regards,\n[Your Name]");

  const [mailtoUrl, setMailtoUrl] = useState("");
  const [htmlLink, setHtmlLink] = useState("");
  const [markdownLink, setMarkdownLink] = useState("");

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchMailto = async () => {
    try {
      const response = await fetch(`${API_URLS.BASE_URL}${API_URLS.MAILTO_LINK_GENERATOR}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, cc, bcc, subject, body }),
      });
      const data = await response.json();
      if (data.success) {
        setMailtoUrl(data.mailtoUrl);
        setHtmlLink(data.htmlLink);
        setMarkdownLink(data.markdownLink);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMailto();
    }, 300); // Debounce queries

    return () => clearTimeout(timer);
  }, [to, cc, bcc, subject, body]);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <>
      {CategorySEO.Email(
        toolSeoData?.title || "Mailto Link Generator",
        toolSeoData?.description || "Instantly compose pre-filled email mailto links with To, CC, BCC, Subject, and Body parameters.",
        "mailto-link-generator"
      )}
      <ToolLayout
        breadcrumbTitle="Mailto Link Generator"
        category="Email Marketing Tools"
        categoryPath="/category/email"
      >
        <div className="space-y-6">
          <ToolHero
            title="Mailto Link Generator"
            subtitle="Instantly compose pre-filled email mailto links with To, CC, BCC, Subject, and Body parameters."
            tags={["mailto link", "pre-filled email", "email links"]}
            Icon={Mail}
            categoryColor={categoryColor}
          />

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Form Composer (Left) */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-indigo-500" />
                Mailto Link Composer
              </h3>
              <div className="space-y-3.5">
                <div>
                  <label className="block text-sm font-medium mb-1">To Email Address</label>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="e.g. contact@domain.com"
                    className="w-full rounded-lg bg-muted px-3 py-2 border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">CC Address (Optional)</label>
                    <input
                      type="text"
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                      placeholder="e.g. boss@domain.com"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">BCC Address (Optional)</label>
                    <input
                      type="text"
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                      placeholder="e.g. archive@domain.com"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Pre-filled subject header..."
                    className="w-full rounded-lg bg-muted px-3 py-2 border border-border text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email Body Text</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Pre-filled mail body paragraphs..."
                    className="w-full h-40 rounded-lg bg-muted px-3 py-2 border border-border text-sm focus:outline-none font-sans"
                  />
                </div>
              </div>
            </motion.div>

            {/* Code Output (Right) */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 sticky top-6"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileCode className="h-5 w-5 text-indigo-500" />
                  Generated Formats
                </h3>

                {/* Mailto URL */}
                <div className="space-y-1">
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Raw URL Link</span>
                  <div className="flex gap-2">
                    <div className="flex-1 p-2 bg-muted border border-border rounded font-mono text-[10px] select-all break-all max-h-16 overflow-y-auto">
                      {mailtoUrl}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(mailtoUrl, "url")}
                      className="p-2 border border-border rounded bg-card hover:bg-muted self-start"
                      aria-label="Copy URL"
                      title="Copy URL"
                    >
                      {copiedKey === "url" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* HTML Anchor */}
                <div className="space-y-1">
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">HTML Code Tag</span>
                  <div className="flex gap-2">
                    <div className="flex-1 p-2 bg-muted border border-border rounded font-mono text-[10px] select-all break-all max-h-16 overflow-y-auto">
                      {htmlLink}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(htmlLink, "html")}
                      className="p-2 border border-border rounded bg-card hover:bg-muted self-start"
                      aria-label="Copy HTML"
                      title="Copy HTML"
                    >
                      {copiedKey === "html" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Markdown Link */}
                <div className="space-y-1">
                  <span className="block text-xs font-semibold text-muted-foreground uppercase">Markdown Syntax</span>
                  <div className="flex gap-2">
                    <div className="flex-1 p-2 bg-muted border border-border rounded font-mono text-[10px] select-all break-all max-h-16 overflow-y-auto">
                      {markdownLink}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(markdownLink, "markdown")}
                      className="p-2 border border-border rounded bg-card hover:bg-muted self-start"
                      aria-label="Copy Markdown"
                      title="Copy Markdown"
                    >
                      {copiedKey === "markdown" ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Interactive Test Action */}
                <div className="border-t border-border pt-4">
                  <a
                    href={mailtoUrl}
                    className="w-full rounded-lg py-2.5 font-medium text-white flex items-center justify-center gap-2 transition-colors"
                    style={{
                      background: `linear-gradient(135deg, hsl(${categoryColor}) 0%, hsl(${categoryColor} / 0.8) 100%)`,
                    }}
                  >
                    <Send className="h-4 w-4" />
                    Test Mail Client Link
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
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
              <Mail className="h-5 w-5 text-blue-500" />
              What is a Mailto Link?
            </h3>
            <p className="text-muted-foreground mb-4">
              A Mailto Link is a specialized hyperlink (`mailto:`) that opens the user's default email client pre-populated with recipient addresses, subject lines, CC/BCC targets, and body templates.
            </p>
            
            <h4 className="font-semibold mb-2">How It Works</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
              <li>Input the primary email address and optional CC/BCC.</li>
              <li>Write a default subject line and pre-filled body text.</li>
              <li>Click generate to build the URL, HTML tag code, and Markdown syntax.</li>
              <li>Test the mailto behavior directly or copy the generated code blocks for your site.</li>
            </ol>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-1">Key Features</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• To, CC, and BCC recipient fields</li>
                  <li>• Automatic URL encoding for body text</li>
                  <li>• HTML and Markdown code generation</li>
                  <li>• In-browser mail client testing</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-1">Use Cases</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Simple contact links on websites</li>
                  <li>• Pre-filled feedback form triggers</li>
                  <li>• Direct support mail integrations</li>
                  <li>• Pre-formatted email client templates</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <ToolFAQ
            faqs={[
              {
                question: "How do mailto links handle line breaks in the body?",
                answer: "Line breaks in mailto parameters are URL-encoded as '%0A'. Our generator automatically converts paragraph formatting so it displays correctly inside the mail application window.",
              },
              {
                question: "Can I enter multiple recipient emails?",
                answer: "Yes, you can add multiple emails in the 'To', 'CC', or 'BCC' inputs separated by a comma (e.g. 'hello@domain.com, sales@domain.com').",
              },
              {
                question: "Do mailto links work on all mobile devices?",
                answer: "Yes. When a user clicks a mailto link on an iPhone or Android phone, the device immediately launches their default mail application (like Apple Mail or Gmail) pre-populated with your variables.",
              },
            ]}
          />
        </div>
      </ToolLayout>
    </>
  );
};

export default MailtoLinkGeneratorTool;
