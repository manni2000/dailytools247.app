import { useState } from "react";
import { Copy, Check, ShieldCheck, ShieldAlert, AlertTriangle, Plus, Trash2, Search, Sparkles, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";
import ToolLayout from "@/components/layout/ToolLayout";
import ToolFAQ from "@/components/ToolFAQ";
import ToolHero from "@/components/ToolHero";
import { API_URLS } from "@/lib/api-complete";
import { CategorySEO } from "@/components/ToolSEO";
import { getToolSeoMetadata } from "@/data/toolSeoEnhancements";

const categoryColor = "250 85% 55%";

interface SpfResult {
  record: string;
  existingRecords: string[];
  isValid: boolean;
  domain: string;
}

const SPFRecordGeneratorTool = () => {
  const toolSeoData = getToolSeoMetadata('spf-record-generator');
  const [domain, setDomain] = useState("");
  const [mxHosts, setMxHosts] = useState(true);
  const [aHosts, setAHosts] = useState(true);
  const [ip4Addresses, setIp4Addresses] = useState<string[]>([]);
  const [ip6Addresses, setIp6Addresses] = useState<string[]>([]);
  const [includeDomains, setIncludeDomains] = useState<string[]>([]);
  const [allPolicy, setAllPolicy] = useState("softfail");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpfResult | null>(null);
  const [copied, setCopied] = useState(false);

  const addField = (type: "ip4" | "ip6" | "include") => {
    if (type === "ip4") setIp4Addresses([...ip4Addresses, ""]);
    if (type === "ip6") setIp6Addresses([...ip6Addresses, ""]);
    if (type === "include") setIncludeDomains([...includeDomains, ""]);
  };

  const removeField = (type: "ip4" | "ip6" | "include", index: number) => {
    if (type === "ip4") setIp4Addresses(ip4Addresses.filter((_, i) => i !== index));
    if (type === "ip6") setIp6Addresses(ip6Addresses.filter((_, i) => i !== index));
    if (type === "include") setIncludeDomains(includeDomains.filter((_, i) => i !== index));
  };

  const updateField = (type: "ip4" | "ip6" | "include", index: number, value: string) => {
    if (type === "ip4") {
      const updated = [...ip4Addresses];
      updated[index] = value;
      setIp4Addresses(updated);
    }
    if (type === "ip6") {
      const updated = [...ip6Addresses];
      updated[index] = value;
      setIp6Addresses(updated);
    }
    if (type === "include") {
      const updated = [...includeDomains];
      updated[index] = value;
      setIncludeDomains(updated);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URLS.BASE_URL}${API_URLS.SPF_RECORD_GENERATOR}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          mxHosts: mxHosts ? ["mx"] : [],
          aHosts: aHosts ? ["a"] : [],
          ip4Addresses,
          ip6Addresses,
          includeDomains,
          allPolicy,
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
      {CategorySEO.Email(
        toolSeoData?.title || "SPF Record Generator & Checker",
        toolSeoData?.description || "Generate SPF records for your domain and check active DNS records to prevent email bouncebacks.",
        "spf-record-generator"
      )}
      <ToolLayout
        breadcrumbTitle="SPF Record Generator"
        category="Email Marketing Tools"
        categoryPath="/category/email"
      >
        <div className="space-y-6">
          <ToolHero
            title="SPF Record Generator & Checker"
            subtitle="Generate SPF records for your domain and check active DNS records to prevent email bouncebacks."
            tags={["spf generator", "spf checker", "email auth"]}
            Icon={Mail}
            categoryColor={categoryColor}
          />

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Input Config (Left) */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 rounded-xl border border-border bg-card p-6 shadow-sm space-y-5"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                SPF Rules Configuration
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

                {/* Switch flags */}
                <div className="grid grid-cols-2 gap-4 border-t border-border pt-3">
                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={mxHosts}
                      onChange={(e) => setMxHosts(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Allow Domain MX Servers</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={aHosts}
                      onChange={(e) => setAHosts(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Allow Domain A Records</span>
                  </label>
                </div>

                {/* IPv4 addresses */}
                <div className="space-y-2 border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Authorized IPv4 Addresses</label>
                    <button
                      type="button"
                      onClick={() => addField("ip4")}
                      className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-bold"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add IP
                    </button>
                  </div>
                  {ip4Addresses.map((val, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => updateField("ip4", idx, e.target.value)}
                        placeholder="e.g. 192.168.1.1"
                        className="flex-1 rounded-lg bg-muted px-3 py-1.5 border border-border text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeField("ip4", idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        aria-label="Remove field"
                        title="Remove field"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Include Domains */}
                <div className="space-y-2 border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Included Services (Third party tools)</label>
                    <button
                      type="button"
                      onClick={() => addField("include")}
                      className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-bold"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Domain
                    </button>
                  </div>
                  {includeDomains.map((val, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => updateField("include", idx, e.target.value)}
                        placeholder="e.g. spf.protection.outlook.com"
                        className="flex-1 rounded-lg bg-muted px-3 py-1.5 border border-border text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeField("include", idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        aria-label="Remove domain"
                        title="Remove domain"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Policy selection */}
                <div className="border-t border-border pt-3">
                  <label className="block text-sm font-medium mb-1">Mismatch Policy (~all / -all)</label>
                  <select
                    value={allPolicy}
                    onChange={(e) => setAllPolicy(e.target.value)}
                    className="w-full rounded-lg bg-muted px-4 py-2 border border-border focus:outline-none"
                    title="Mismatch Policy selection"
                    aria-label="Mismatch Policy"
                  >
                    <option value="softfail">SoftFail (~all) - Recommend (Accept but flag)</option>
                    <option value="fail">Fail (-all) - Strict (Reject immediately)</option>
                    <option value="neutral">Neutral (?all) - No policy</option>
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
                  <Search className="h-4 w-4" />
                  {loading ? "Checking DNS..." : "Generate SPF & Query DNS"}
                </button>
              </form>
            </motion.div>

            {/* Results Panel (Right) */}
            <div className="lg:col-span-5 space-y-6">
              {result ? (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Generated Record output */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
                    <h3 className="font-semibold text-sm">Generated SPF Record</h3>
                    <div className="p-3 bg-muted rounded-lg font-mono text-xs text-foreground select-all break-all">
                      {result.record}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="w-full rounded-lg py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 text-xs transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied!" : "Copy Record"}
                    </button>
                  </div>

                  {/* DNS Live verification */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3">
                    <h3 className="font-semibold text-sm">Active DNS Lookup</h3>
                    {result.existingRecords.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-green-700 bg-green-50 border border-green-200 p-3 rounded-lg text-xs">
                          <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                          <span>SPF records found on your domain DNS server!</span>
                        </div>
                        <div className="space-y-1.5">
                          {result.existingRecords.map((rec, idx) => (
                            <div key={idx} className="p-2 border border-border bg-muted/30 rounded font-mono text-[10px] break-all">
                              {rec}
                            </div>
                          ))}
                        </div>
                        {result.existingRecords.length > 1 && (
                          <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg text-xs">
                            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                            <span>Warning: Multiple SPF records found. Having more than one record is invalid and will cause authorization checks to fail! Merge them into a single record.</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-xs">
                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                        <span>No existing SPF TXT records found. If you just updated your DNS settings, propagation can take up to 24 hours.</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border border-border border-dashed rounded-xl bg-card text-muted-foreground text-center">
                  <Search className="h-12 w-12 mb-2 text-muted-foreground/40" />
                  <p className="text-sm">Configure parameters and hit generate to construct the DNS string and verify existing domain records.</p>
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
              What is an SPF Record?
            </h3>
            <p className="text-muted-foreground mb-4">
              A Sender Policy Framework (SPF) record is a DNS TXT record that lists the specific mail servers authorized to send emails on behalf of your domain name. It prevents unauthorized senders from using your domain to send fraudulent emails.
            </p>
            
            <h4 className="font-semibold mb-2">How It Works</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
              <li>Enter your domain name and define which servers can send email (IP addresses, MX, A records).</li>
              <li>Specify third-party delivery services (e.g. Mailchimp, Google Workspace, Sendgrid).</li>
              <li>Set the fallback rule (Strict Fail, Soft Fail, or Neutral).</li>
              <li>Copy the generated SPF record and paste it in your domain's DNS provider settings.</li>
            </ol>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-1">Key Features</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Custom A/MX record rules</li>
                  <li>• IPv4 and IPv6 range support</li>
                  <li>• Third-party includes configuration</li>
                  <li>• Live DNS active record checker</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-1">Use Cases</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Preventing outgoing brand domain abuse</li>
                  <li>• Boosting recipient inbox landing rates</li>
                  <li>• Cleaning up multiple duplicate SPF records</li>
                  <li>• Onboarding new email marketing tools</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <ToolFAQ
            faqs={[
              {
                question: "What is an SPF record?",
                answer: "Sender Policy Framework (SPF) is a DNS TXT record that specifies which mail servers are permitted to send email on behalf of your domain name. This stops spoofing and phishers.",
              },
              {
                question: "Why does having multiple SPF records fail?",
                answer: "SPF specifications strictly forbid having more than one SPF TXT record. If a mail receiver sees multiple records, it immediately flags authorization status as PermError and may reject the email.",
              },
              {
                question: "What is the difference between ~all and -all?",
                answer: "~all represents a 'SoftFail' (deliver email but flag as suspicious when sender IP is incorrect). -all represents a 'Fail' (hard reject). SoftFail is safer to configure when onboarding new services.",
              },
            ]}
          />
        </div>
      </ToolLayout>
    </>
  );
};

export default SPFRecordGeneratorTool;
