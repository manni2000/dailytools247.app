import { useState } from "react";
import { Copy, Check, ShieldCheck, ShieldAlert, AlertTriangle, Search, Sparkles, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";
import ToolLayout from "@/components/layout/ToolLayout";
import ToolFAQ from "@/components/ToolFAQ";
import ToolHero from "@/components/ToolHero";
import { API_URLS } from "@/lib/api-complete";

const categoryColor = "250 85% 55%";

interface DmarcResult {
  record: string;
  host: string;
  existingRecords: string[];
  domain: string;
}

const DMARCGeneratorTool = () => {
  const [domain, setDomain] = useState("");
  const [policy, setPolicy] = useState("none");
  const [subdomainPolicy, setSubdomainPolicy] = useState("none");
  const [rua, setRua] = useState("");
  const [ruf, setRuf] = useState("");
  const [pct, setPct] = useState(100);
  const [adkim, setAdkim] = useState("r");
  const [aspf, setAspf] = useState("r");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DmarcResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URLS.BASE_URL}${API_URLS.DMARC_GENERATOR}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: domain.trim(),
          policy,
          rua,
          ruf,
          subdomainPolicy,
          pct,
          adkim,
          aspf,
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

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.record);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <ToolLayout
        breadcrumbTitle="DMARC Generator"
        category="Email Marketing Tools"
        categoryPath="/category/email"
      >
        <div className="space-y-6">
          <ToolHero
            title="DMARC Record Generator & Checker"
            subtitle="Build DMARC deployment policies, enable aggregate reports, and verify existing active records in DNS."
            tags={["dmarc generator", "dmarc checker", "email auth"]}
            Icon={Mail}
            categoryColor={categoryColor}
          />

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Input Config (Left) */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                DMARC Configuration
              </h3>
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Domain Name</label>
                  <input
                    type="text"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. yourdomain.com"
                    className="w-full rounded-lg bg-muted px-4 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">DMARC Policy (p=)</label>
                    <select
                      value={policy}
                      onChange={(e) => setPolicy(e.target.value)}
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none text-sm"
                      aria-label="DMARC Policy"
                    >
                      <option value="none">None (Monitor Only - Safest)</option>
                      <option value="quarantine">Quarantine (Send to Spam)</option>
                      <option value="reject">Reject (Discard Email immediately)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subdomain Policy (sp=)</label>
                    <select
                      value={subdomainPolicy}
                      onChange={(e) => setSubdomainPolicy(e.target.value)}
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none text-sm"
                      aria-label="Subdomain Policy"
                    >
                      <option value="none">Same as Domain policy</option>
                      <option value="quarantine">Quarantine</option>
                      <option value="reject">Reject</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Aggregate Email (rua=)</label>
                    <input
                      type="email"
                      value={rua}
                      onChange={(e) => setRua(e.target.value)}
                      placeholder="e.g. dmarc@yourdomain.com"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Forensic Email (ruf=)</label>
                    <input
                      type="email"
                      value={ruf}
                      onChange={(e) => setRuf(e.target.value)}
                      placeholder="e.g. dmarc-forensics@yourdomain.com"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Coverage % (pct=)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={pct}
                      onChange={(e) => setPct(parseInt(e.target.value) || 100)}
                      placeholder="100"
                      title="Coverage percentage for DMARC policy"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">DKIM Alignment (adkim=)</label>
                    <select
                      value={adkim}
                      onChange={(e) => setAdkim(e.target.value)}
                      title="DKIM alignment mode"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none text-sm"
                    >
                      <option value="r">Relaxed (Recommend)</option>
                      <option value="s">Strict</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">SPF Alignment (aspf=)</label>
                    <select
                      value={aspf}
                      onChange={(e) => setAspf(e.target.value)}
                      title="SPF alignment mode"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none text-sm"
                    >
                      <option value="r">Relaxed (Recommend)</option>
                      <option value="s">Strict</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg py-2.5 font-medium text-white flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, hsl(${categoryColor}) 0%, hsl(${categoryColor} / 0.8) 100%)`,
                  }}
                >
                  <Search className="h-4 w-4" />
                  {loading ? "Checking DNS..." : "Generate DMARC & Check DNS"}
                </button>
              </form>
            </motion.div>

            {/* Results Output (Right) */}
            <div className="lg:col-span-5 space-y-6">
              {result ? (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Generated record */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
                    <h3 className="font-semibold text-sm">Generated DNS DMARC Record</h3>
                    <div>
                      <span className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Host</span>
                      <div className="p-2 border border-border bg-muted rounded font-mono text-xs select-all">
                        {result.host}
                      </div>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-muted-foreground mb-1 uppercase">Value (TXT Record)</span>
                      <div className="p-2 border border-border bg-muted rounded font-mono text-xs select-all break-all">
                        {result.record}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="w-full rounded-lg py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 text-xs transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied!" : "Copy Record Data"}
                    </button>
                  </div>

                  {/* DNS Checker */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
                    <h3 className="font-semibold text-sm">DNS Live Validation</h3>
                    {result.existingRecords.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg text-xs">
                          <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                          <span>DMARC record actively deployed on DNS server!</span>
                        </div>
                        <div className="space-y-1.5">
                          {result.existingRecords.map((rec, idx) => (
                            <div key={idx} className="p-2 border border-border bg-muted/30 rounded font-mono text-[10px] break-all">
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span>No active DMARC DNS record found under _dmarc.{result.domain}. Apply the generated record to your domain DNS settings.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border border-border border-dashed rounded-xl bg-card text-muted-foreground text-center">
                  <Search className="h-12 w-12 mb-2 text-muted-foreground/40" />
                  <p className="text-sm">Configure parameters and click generate to query DMARC DNS entries and inspect validation states.</p>
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
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              What is DMARC?
            </h3>
            <p className="text-muted-foreground mb-4">
              Domain-based Message Authentication, Reporting, and Conformance (DMARC) is an email authentication protocol. It builds on the SPF and DKIM protocols to block fraudulent senders, protect domain ownership, and provide detailed reporting on email traffic.
            </p>
            
            <h4 className="font-semibold mb-2">How It Works</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
              <li>Specify your domain and configure your authentication alignment settings.</li>
              <li>Set a policy action (None to monitor, Quarantine for spam, or Reject to discard).</li>
              <li>Provide email addresses to receive aggregate and forensic reports.</li>
              <li>Publish the generated DMARC TXT record in your DNS settings to enforce policy rules.</li>
            </ol>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-1">Key Features</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Custom policy configuration</li>
                  <li>• DNS lookup for existing DMARC records</li>
                  <li>• Live DNS record validation</li>
                  <li>• Formatted TXT record builder</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-1">Use Cases</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Stopping email phishing & spoofing campaigns</li>
                  <li>• Auditing domain-wide sender sources</li>
                  <li>• Meeting modern deliverability standards</li>
                  <li>• Monitoring third-party mail vendor security</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <ToolFAQ
            faqs={[
              {
                question: "What is a DMARC policy?",
                answer: "DMARC (Domain-based Message Authentication, Reporting, and Conformance) informs receiving email servers how to handle messages that fail SPF or DKIM checks. Policies include 'none' (monitor), 'quarantine' (mark as spam), and 'reject' (block outright).",
              },
              {
                question: "What are rua and ruf reporting parameters?",
                answer: "rua specifies the email address to receive daily aggregate XML reports of all sending servers acting in your domain name. ruf specifies where to send real-time redacted forensic copies of individual message failures.",
              },
              {
                question: "How should I roll out DMARC?",
                answer: "Begin with a policy of 'p=none' for several weeks and audit rua reports. Once you confirm all authentic services (like Mailchimp or Zendesk) pass alignment checks, update to 'quarantine', and eventually 'reject'.",
              },
            ]}
          />
        </div>
      </ToolLayout>
    </>
  );
};

export default DMARCGeneratorTool;
