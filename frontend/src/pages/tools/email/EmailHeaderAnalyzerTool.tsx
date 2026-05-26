import { useState } from "react";
import { Search, ShieldCheck, ShieldAlert, GitCommit, Clock, Server, FileText, ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";
import ToolLayout from "@/components/layout/ToolLayout";
import ToolFAQ from "@/components/ToolFAQ";
import ToolHero from "@/components/ToolHero";
import { API_URLS } from "@/lib/api-complete";

const categoryColor = "250 85% 55%";

interface Hop {
  hop: number;
  server: string;
  raw: string;
  time: string;
  delaySeconds: number;
}

interface AnalyzerResult {
  details: {
    from: string;
    to: string;
    subject: string;
    date: string;
    messageId: string;
    contentType: string;
  };
  hops: Hop[];
  authStatus: {
    spf: "pass" | "fail" | "neutral" | "unknown";
    dkim: "pass" | "fail" | "unknown";
    dmarc: "pass" | "fail" | "unknown";
  };
}

const EmailHeaderAnalyzerTool = () => {
  const [rawHeaders, setRawHeaders] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzerResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawHeaders.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URLS.BASE_URL}${API_URLS.EMAIL_HEADER_ANALYZER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headers: rawHeaders }),
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

  const getAuthBadge = (val: string) => {
    if (val === "pass") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
          <ShieldCheck className="h-3.5 w-3.5" /> PASS
        </span>
      );
    }
    if (val === "fail") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
          <ShieldAlert className="h-3.5 w-3.5" /> FAIL
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
        UNKNOWN
      </span>
    );
  };

  return (
    <>
      <ToolLayout
        breadcrumbTitle="Email Header Analyzer"
        category="Email Marketing Tools"
        categoryPath="/category/email"
      >
        <div className="space-y-6">
          <ToolHero
            title="Email Header Analyzer"
            subtitle="Paste raw email headers to trace routing server paths, transfer delays, and cryptographic authentication results."
            tags={["email header analyzer", "spf dkim dmarc", "email routing"]}
            Icon={Mail}
            categoryColor={categoryColor}
          />

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Input card */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-6 rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                Raw Email Headers
              </h3>
              <form onSubmit={handleAnalyze} className="space-y-4">
                <textarea
                  value={rawHeaders}
                  onChange={(e) => setRawHeaders(e.target.value)}
                  placeholder="Paste raw email header lines here (e.g. Received: from...)"
                  className="w-full h-80 font-mono text-xs rounded-lg border border-border p-4 bg-muted/30 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg py-2.5 font-medium text-white flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, hsl(${categoryColor}) 0%, hsl(${categoryColor} / 0.8) 100%)`,
                  }}
                >
                  <Search className="h-4 w-4" />
                  {loading ? "Analyzing..." : "Analyze Email Headers"}
                </button>
              </form>
            </motion.div>

            {/* Analysis card */}
            <div className="lg:col-span-6 space-y-6">
              {result ? (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* General Details & Authentication */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-semibold">General & Auth Summary</h3>
                    
                    {/* Auth Results */}
                    <div className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg border border-border text-center">
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">SPF</div>
                        {getAuthBadge(result.authStatus.spf)}
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">DKIM</div>
                        {getAuthBadge(result.authStatus.dkim)}
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">DMARC</div>
                        {getAuthBadge(result.authStatus.dmarc)}
                      </div>
                    </div>

                    {/* Basic Grid */}
                    <div className="text-xs space-y-2 border-t border-border pt-4">
                      <div>
                        <strong className="text-muted-foreground">From:</strong>
                        <div className="mt-0.5 text-foreground font-mono break-all">{result.details.from}</div>
                      </div>
                      <div>
                        <strong className="text-muted-foreground">Subject:</strong>
                        <div className="mt-0.5 text-foreground font-mono">{result.details.subject}</div>
                      </div>
                      <div>
                        <strong className="text-muted-foreground">Date:</strong>
                        <div className="mt-0.5 text-foreground font-mono">{result.details.date}</div>
                      </div>
                      <div>
                        <strong className="text-muted-foreground">Message ID:</strong>
                        <div className="mt-0.5 text-foreground font-mono break-all">{result.details.messageId}</div>
                      </div>
                    </div>
                  </div>

                  {/* Routing Hops Timeline */}
                  <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <GitCommit className="h-5 w-5 text-indigo-500" />
                      Email Route Trace ({result.hops.length} Hops)
                    </h3>
                    <div className="space-y-4 pl-2 relative border-l-2 border-border ml-2">
                      {result.hops.map((hop, index) => (
                        <div key={hop.hop} className="relative pl-6 text-xs">
                          {/* Dot indicator */}
                          <div className="absolute h-3 w-3 bg-indigo-600 rounded-full -left-[24px] top-1 border-2 border-card" />
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold flex items-center gap-1">
                                <Server className="h-3 w-3 text-muted-foreground" />
                                Hop #{hop.hop}: {hop.server}
                              </span>
                              <span className="text-[10px] text-muted-foreground">{hop.time}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground font-mono break-all line-clamp-1">{hop.raw}</p>
                            {index > 0 && (
                              <div className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded border border-indigo-100 mt-1 font-semibold">
                                <Clock className="h-3 w-3" />
                                Delay: +{hop.delaySeconds}s
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 border border-border border-dashed rounded-xl bg-card text-muted-foreground text-center">
                  <Search className="h-12 w-12 mb-2 text-muted-foreground/40" />
                  <p className="text-sm">Paste raw headers from your mail client and click analyze to track the routing hops and authentication records.</p>
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
              <FileText className="h-5 w-5 text-blue-500" />
              What is Email Header Analysis?
            </h3>
            <p className="text-muted-foreground mb-4">
              Email Header Analysis is the process of inspecting the metadata headers of an email message. These headers reveal the routing path, sender validation status (SPF, DKIM, DMARC), spam scores, and delivery delays.
            </p>
            
            <h4 className="font-semibold mb-2">How It Works</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
              <li>Open the raw source or original format of an email.</li>
              <li>Copy all the header lines and paste them into the input text area.</li>
              <li>Click Analyze to parse the routing history and security checks.</li>
              <li>Review the security protocol statuses, relay hops, and potential delay points.</li>
            </ol>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-1">Key Features</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Detailed routing path timeline</li>
                  <li>• SPF, DKIM, and DMARC verification check</li>
                  <li>• Basic sender and receiver metadata parsing</li>
                  <li>• Server relay delay detection</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-1">Use Cases</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Investigating phishing or spoofed emails</li>
                  <li>• Diagnosing email transit delays</li>
                  <li>• Auditing server IPs and relays</li>
                  <li>• Debugging email delivery and DNS settings</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <ToolFAQ
            faqs={[
              {
                question: "How do I extract raw headers from Gmail?",
                answer: "1. Open the email in Gmail. 2. Click the three dots (More) next to the reply button. 3. Select 'Show original'. 4. Copy the long list of headers shown in the top table or copy the raw text beneath.",
              },
              {
                question: "What are 'Hops' in an email route?",
                answer: "Every email travels through mail transfer servers (MTA) before arriving in your mailbox. Each transit point is recorded in the 'Received' header as a Hop. Analyzing hops reveals the original sender's IP and server delays.",
              },
              {
                question: "Why should I inspect SPF/DKIM/DMARC status?",
                answer: "These DNS validation records protect domains against spoofing. SPF checks sender server IPs, DKIM validates cryptographic signatures, and DMARC dictates handling policies (like reject or quarantine) when checks fail.",
              },
            ]}
          />
        </div>
      </ToolLayout>
    </>
  );
};

export default EmailHeaderAnalyzerTool;
