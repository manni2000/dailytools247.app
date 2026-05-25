import { useState } from "react";
import { Copy, Check, ShieldCheck, Download, AlertCircle, Sparkles, Key, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";
import ToolLayout from "@/components/layout/ToolLayout";
import ToolFAQ from "@/components/ToolFAQ";
import ToolHero from "@/components/ToolHero";
import { API_URLS } from "@/lib/api-complete";
import SimilarTools from "@/components/SimilarTools";

const categoryColor = "250 85% 55%";

interface DkimResult {
  domain: string;
  selector: string;
  host: string;
  record: string;
  publicKeyPem: string;
  privateKeyPem: string;
}

const DKIMGeneratorTool = () => {
  const [domain, setDomain] = useState("");
  const [selector, setSelector] = useState("default");
  const [keyLength, setKeyLength] = useState("2048");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DkimResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim() || !selector.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URLS.BASE_URL}${API_URLS.DKIM_GENERATOR}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: domain.trim(),
          selector: selector.trim(),
          keyLength,
        }),
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

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadKey = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ToolLayout
        breadcrumbTitle="DKIM Generator"
        category="Email Marketing Tools"
        categoryPath="/category/email"
      >
        <div className="space-y-6">
          <ToolHero
            title="DKIM Record Generator"
            subtitle="Generate cryptographically secure public/private RSA key pairs and format public keys for DNS TXT records."
            tags={["dkim generator", "dns txt record", "email auth"]}
            Icon={Mail}
            categoryColor={categoryColor}
          />

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Form configuration (Left) */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-5 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4 h-fit"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Key className="h-5 w-5 text-indigo-500" />
                DKIM Settings
              </h3>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Domain Name</label>
                  <input
                    type="text"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. yourdomain.com"
                    className="w-full rounded-lg bg-muted px-4 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">DKIM Selector</label>
                  <input
                    type="text"
                    required
                    value={selector}
                    onChange={(e) => setSelector(e.target.value)}
                    placeholder="e.g. default, mail, client"
                    className="w-full rounded-lg bg-muted px-4 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Key Size (RSA Length)</label>
                  <select
                    value={keyLength}
                    onChange={(e) => setKeyLength(e.target.value)}
                    aria-label="Key Size (RSA Length)"
                    className="w-full rounded-lg bg-muted px-4 py-2 border border-border focus:outline-none"
                  >
                    <option value="2048">2048-bit (Recommended, High Security)</option>
                    <option value="1024">1024-bit (Legacy compatibility)</option>
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
                  {loading ? "Generating RSA Keys..." : "Generate DKIM Keys"}
                </button>
              </form>
            </motion.div>

            {/* Keys Output (Right) */}
            <div className="lg:col-span-7 space-y-6">
              {result ? (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Public TXT DNS entry */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
                    <h3 className="font-semibold text-sm">Public DNS TXT Record</h3>
                    
                    <div>
                      <span className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Host / Name</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-2 border border-border bg-muted rounded font-mono text-xs select-all break-all">
                          {result.host}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(result.host, "host")}
                          className="p-2 border border-border rounded bg-card hover:bg-muted"
                          aria-label="Copy host name"
                          title="Copy host name"
                        >
                          {copiedKey === "host" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Value / TXT Data</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-2 border border-border bg-muted rounded font-mono text-xs select-all break-all max-h-24 overflow-y-auto">
                          {result.record}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(result.record, "record")}
                          className="p-2 border border-border rounded bg-card hover:bg-muted self-start"
                          aria-label="Copy record data"
                          title="Copy record data"
                        >
                          {copiedKey === "record" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Private & Public Key Files */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                    <h3 className="font-semibold text-sm">Download Key PEM Files</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => downloadKey(result.privateKeyPem, "dkim_private.key")}
                        className="flex-1 rounded-lg py-2.5 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" /> Download Private Key (.key)
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadKey(result.publicKeyPem, "dkim_public.pem")}
                        className="flex-1 rounded-lg py-2.5 bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" /> Download Public Key (.pem)
                      </button>
                    </div>
                    <div className="p-3 bg-red-50 text-red-950 border border-red-200 rounded-lg text-xs flex gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Security Warning:</strong> The Private Key is highly sensitive. Anyone with access to this key can sign spoofed emails in your name. Protect this key and configure it directly in your MTA (Postfix, Exim, Sendmail, etc.).
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border border-border border-dashed rounded-xl bg-card text-muted-foreground text-center">
                  <Key className="h-12 w-12 mb-2 text-muted-foreground/40" />
                  <p className="text-sm">Enter your domain settings and hit generate to compile the keys. The keys are created securely inside the server context.</p>
                </div>
              )}
            </div>
          </div>

          <ToolFAQ
            faqs={[
              {
                question: "What is DKIM selector?",
                answer: "A selector is an arbitrary string that differentiates multiple DKIM keys configured under a single domain. For example, if your selector is 'default', the DNS entry is found at 'default._domainkey.domain.com'.",
              },
              {
                question: "Should I select 1024 or 2048 keys?",
                answer: "Choose 2048-bit keys unless your DNS service provider strictly prohibits TXT record lengths over 256 characters. 2048-bit is the current security standard and is required by Gmail.",
              },
              {
                question: "Where do I host the Private Key?",
                answer: "The Private Key must be configured inside your email delivery server software (like Postfix, PowerMTA, Sendgrid, or cPanel Mail). The mail server automatically signs outbound emails using this key.",
              },
            ]}
          />
          <SimilarTools currentToolSlug="dkim-generator" />
        </div>
      </ToolLayout>
    </>
  );
};

export default DKIMGeneratorTool;
