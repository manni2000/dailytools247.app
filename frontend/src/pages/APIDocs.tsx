import { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { Copy, Key, Code2, Zap, Shield, Clock, ChevronDown, ChevronRight, Eye, EyeOff, Terminal, Rocket, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import APIPlayground from "../components/APIPlayground";
import { ToolSEO } from "../components/ToolSEO";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const noopApiKeyChange = (_key: string) => undefined;

interface ApiEndpoint {
  method: string;
  path: string;
  name: string;
  description: string;
  contentType: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: any;
    description: string;
  }>;
  example: {
    curl: string;
    response: any;
  };
}

interface ApiCategory {
  category: string;
  endpoints: ApiEndpoint[];
}

interface ApiKey {
  key: string;
  name: string;
  status: string;
  tier: string;
  dailyLimit: number;
  createdAt: string;
  usage?: number;
}

const APIDocs = () => {
  const [apiDocs, setApiDocs] = useState<{ endpoints: ApiCategory[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [keyName, setKeyName] = useState("");
  const [generatingKey, setGeneratingKey] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [userKeys, setUserKeys] = useState<ApiKey[]>([]);
  const [lookupEmail, setLookupEmail] = useState("");
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("getstarted");

  useEffect(() => {
    fetchApiDocs();
  }, []);

  const fetchApiDocs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/docs`);
      const data = await response.json();
      setApiDocs(data);
    } catch (error) {
      toast.error("Failed to load API documentation");
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setGeneratingKey(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/keys/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: keyName || "Default" }),
      });

      const data = await response.json();

      if (data.success) {
        setNewApiKey(data.data.apiKey);
        toast.success("API key generated successfully!");
      } else {
        toast.error(data.error || "Failed to generate API key");
      }
    } catch (error) {
      toast.error("Failed to generate API key");
    } finally {
      setGeneratingKey(false);
    }
  };

  const lookupKeys = async () => {
    if (!lookupEmail) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/keys/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: lookupEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setUserKeys(data.keys);
        if (data.keys.length === 0) {
          toast.info("No API keys found for this email");
        }
      } else {
        toast.error(data.error || "Failed to lookup keys");
      }
    } catch (error) {
      toast.error("Failed to lookup keys");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const toggleEndpoint = (id: string) => {
    const newExpanded = new Set(expandedEndpoints);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEndpoints(newExpanded);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500/10 text-green-500 border-green-500/25";
      case "POST":
        return "bg-blue-500/10 text-blue-500 border-blue-500/25";
      case "PUT":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/25";
      case "DELETE":
        return "bg-red-500/10 text-red-500 border-red-500/25";
      default:
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/25";
    }
  };

  return (
    <>
      <ToolSEO
        toolName="Developer API Documentation — DailyTools247"
        toolDescription="Access and integrate powerful APIs for PDF, Image, Video, and Developer tools from DailyTools247."
        category="Developer Tools"
        toolSlug="api-docs"
      />
      <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
        <Header />
        
        {/* Premium Banner Hero Section */}
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/15 via-background to-primary/5 py-16 sm:py-20 md:py-24">
          {/* Background pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute inset-0 h-full w-full stroke-primary/[0.04] [mask-image:radial-gradient(100%_100%_at_top,white,transparent)]" aria-hidden="true">
              <defs>
                <pattern id="grid-pattern-apidocs" width="24" height="24" patternUnits="userSpaceOnUse" x="-1" y="-1">
                  <path d="M.5 24V.5H24" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern-apidocs)" />
            </svg>
            <div className="absolute -left-1/4 -top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl opacity-60" />
            <div className="absolute -right-1/4 -bottom-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl opacity-50" />
          </div>

          <div className="container relative px-4 text-center">
            <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs sm:text-sm font-semibold text-primary backdrop-blur-sm shadow-sm">
              <Sparkles className="h-4 w-4" />
              API Platform for Developers
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight max-w-4xl mx-auto">
              Integrate <span className="gradient-text">DailyTools247</span> directly into your apps
            </h1>
            
            <p className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
              Access powerful utility APIs for PDF editing, image conversions, text processing, and document management. 
              <span className="text-primary font-semibold"> 100 free requests daily.</span>
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-10 border-t border-border/40 pt-8">
              <div className="bg-card/40 backdrop-blur-sm border border-border p-4 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-300">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">15+</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">API Endpoints</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm border border-border p-4 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-300">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">99.9%</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Uptime SLA</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm border border-border p-4 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-300">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">&lt;100ms</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Latency</div>
              </div>
              <div className="bg-card/40 backdrop-blur-sm border border-border p-4 rounded-2xl shadow-sm hover:scale-[1.02] transition-transform duration-300">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary mb-1">100</div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Free Req / Day</div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <main className="flex-1 container mx-auto px-4 py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 max-w-7xl mx-auto">
            {/* Elegant Tabs Trigger Row */}
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-muted/65 p-1 rounded-2xl border border-border/80 backdrop-blur-sm h-auto">
              <TabsTrigger 
                value="getstarted" 
                className="text-xs sm:text-sm py-2.5 px-2 rounded-xl transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md border border-transparent data-[state=active]:border-border/60"
              >
                Get Started
              </TabsTrigger>
              <TabsTrigger 
                value="endpoints" 
                className="text-xs sm:text-sm py-2.5 px-2 rounded-xl transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md border border-transparent data-[state=active]:border-border/60"
              >
                Endpoints
              </TabsTrigger>
              <TabsTrigger 
                value="playground" 
                className="text-xs sm:text-sm py-2.5 px-2 rounded-xl transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md border border-transparent data-[state=active]:border-border/60 flex items-center justify-center gap-1.5"
              >
                <Terminal className="h-4 w-4" />
                Playground
              </TabsTrigger>
              <TabsTrigger 
                value="mykeys" 
                className="text-xs sm:text-sm py-2.5 px-2 rounded-xl transition-all duration-300 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md border border-transparent data-[state=active]:border-border/60"
              >
                My Keys
              </TabsTrigger>
            </TabsList>

            {/* Get Started Tab */}
            <TabsContent value="getstarted" className="space-y-8 outline-none">
              {activeTab === "getstarted" && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Generate API Key Card */}
                    <Card className="bg-card border border-border/80 rounded-3xl shadow-lg relative overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-400">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                      <CardHeader className="p-6 pb-4 sm:p-8 sm:pb-4 relative z-10">
                        <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-5">
                          <Key className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="flex items-center gap-2 text-foreground text-xl font-bold">
                          Generate API Key
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground font-light leading-relaxed">
                          Enter your email to retrieve or create your free API key, enabling immediate request triggers.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6 sm:p-8 pt-0 sm:pt-0 relative z-10">
                        <Input
                          id="api-email-input"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground text-sm h-12 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                        />
                        <Input
                          id="api-key-name-input"
                          placeholder="Key identifier (e.g. Production, Test)"
                          value={keyName}
                          onChange={(e) => setKeyName(e.target.value)}
                          className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground text-sm h-12 rounded-xl focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                        />
                        <Button
                          id="generate-api-key-btn"
                          onClick={generateApiKey}
                          disabled={generatingKey}
                          className="w-full h-12 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground transition-all duration-300 shadow-md shadow-primary/15"
                        >
                          {generatingKey ? (
                            <>
                              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                              Generating your credentials...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate API Key
                            </>
                          )}
                        </Button>

                        {newApiKey && (
                          <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-2xl relative overflow-hidden">
                            <div className="relative z-10">
                              <p className="text-xs text-green-600 dark:text-green-400 mb-2.5 font-bold flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Credentials Generated Successfully (Save this safely!)
                              </p>
                              <div className="flex items-center gap-2">
                                <code className="flex-1 text-xs bg-muted/40 p-3 rounded-xl text-green-600 dark:text-green-400 font-semibold font-mono break-all leading-relaxed border border-green-500/25">
                                  {showKey ? newApiKey : "•".repeat(32)}
                                </code>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setShowKey(!showKey)}
                                  className="h-10 w-10 p-0 rounded-xl hover:bg-green-500/10 text-green-600 hover:text-green-500"
                                >
                                  {showKey ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(newApiKey)}
                                  className="h-10 w-10 p-0 rounded-xl hover:bg-green-500/10 text-green-600 hover:text-green-500"
                                >
                                  <Copy className="h-4.5 w-4.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Quick Start Card with Mock Light Console */}
                    <Card className="bg-card border border-border/80 rounded-3xl shadow-lg relative overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-400">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                      <CardHeader className="p-6 pb-4 sm:p-8 sm:pb-4 relative z-10">
                        <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-5">
                          <Code2 className="h-6 w-6 text-blue-500" />
                        </div>
                        <CardTitle className="flex items-center gap-2 text-foreground text-xl font-bold">
                          Quick Start Guide
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground font-light leading-relaxed">
                          Initialize endpoints in seconds by supplying your key inside standard headers.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 p-6 sm:p-8 pt-0 sm:pt-0 relative z-10">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                            <ArrowRight className="h-3.5 w-3.5 text-primary" />
                            API Base URL
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs bg-muted/30 p-3 rounded-xl text-primary font-mono border border-border">
                              {API_BASE_URL || "https://www.dailytools247.app"}/api/v1
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(`${API_BASE_URL || "https://www.dailytools247.app"}/api/v1`)}
                              className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10 text-primary"
                            >
                              <Copy className="h-4.5 w-4.5" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                            <ArrowRight className="h-3.5 w-3.5 text-primary" />
                            Required Headers
                          </p>
                          <code className="block text-xs bg-muted/30 p-3 rounded-xl text-foreground font-mono border border-border">
                            X-API-Key: YOUR_API_KEY
                          </code>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
                            <ArrowRight className="h-3.5 w-3.5 text-primary" />
                            cURL Example
                          </p>
                          <div className="rounded-2xl border border-border bg-muted/20 overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-green-400/80"></span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(`curl -X POST "${API_BASE_URL || "https://www.dailytools247.app"}/api/v1/text/word-count" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"text": "Hello world!"}'`)}
                                className="h-6 px-2 text-[10px] hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <pre className="p-3.5 text-[11px] sm:text-xs text-foreground font-mono overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal leading-relaxed">
                              {`curl -X POST "${API_BASE_URL || "https://www.dailytools247.app"}/api/v1/text/word-count" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Hello world!"}'`}
                            </pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Rate Limits & Features Grid */}
                  <Card className="bg-card border border-border/80 rounded-3xl shadow-lg overflow-hidden">
                    <CardHeader className="p-6 sm:p-8 border-b border-border/40 bg-muted/20">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center">
                          <Clock className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                          <CardTitle className="text-foreground text-xl font-bold">API Specifications & Policy</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground font-light leading-relaxed">
                            A clear outline of rate limits, response structures, and formatting details.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 sm:p-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-muted/15 p-5 rounded-2xl border border-border">
                          <h4 className="font-bold text-foreground mb-4 text-sm sm:text-base flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Rate Limits
                          </h4>
                          <ul className="space-y-3 text-muted-foreground text-xs sm:text-sm font-light leading-relaxed">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              100 requests per day
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              Resets at midnight UTC
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              Unlimited access endpoints
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              3 credentials per account
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-muted/15 p-5 rounded-2xl border border-border">
                          <h4 className="font-bold text-foreground mb-4 text-sm sm:text-base flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Response Headers
                          </h4>
                          <ul className="space-y-2 text-muted-foreground text-[11px] sm:text-xs font-mono">
                            <li className="bg-muted p-2 rounded-xl text-foreground border border-border">
                              X-RateLimit-Limit: 100
                            </li>
                            <li className="bg-muted p-2 rounded-xl text-foreground border border-border">
                              X-RateLimit-Remaining: 95
                            </li>
                            <li className="bg-muted p-2 rounded-xl text-foreground border border-border">
                              X-RateLimit-Reset: 172900
                            </li>
                          </ul>
                        </div>

                        <div className="bg-muted/15 p-5 rounded-2xl border border-border">
                          <h4 className="font-bold text-foreground mb-4 text-sm sm:text-base flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Payload Formats
                          </h4>
                          <ul className="space-y-3 text-muted-foreground text-xs sm:text-sm font-light leading-relaxed">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              JSON Requests/Responses
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              Multi-part File Uploads
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              Base64 String support
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              CORS Enabled headers
                            </li>
                          </ul>
                        </div>

                        <div className="bg-muted/15 p-5 rounded-2xl border border-border">
                          <h4 className="font-bold text-foreground mb-4 text-sm sm:text-base flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Error Handling
                          </h4>
                          <ul className="space-y-3 text-muted-foreground text-xs sm:text-sm font-light leading-relaxed">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              Detailed JSON exceptions
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              Standard HTTP statuses
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              Rate Limit warnings
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                              Strict property validation
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* API Endpoints Tab */}
            <TabsContent value="endpoints" className="space-y-6 outline-none">
              {activeTab === "endpoints" && (
                loading ? (
                  <div className="text-center py-16 sm:py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-slate-400 mt-2 text-sm font-light">Compiling endpoints data...</p>
                  </div>
                ) : (
                  apiDocs?.endpoints?.map((category, catIndex) => (
                    <Card key={catIndex} className="bg-card border border-border/80 rounded-3xl shadow-md overflow-hidden">
                      <CardHeader className="p-5 sm:p-6 border-b border-border/40 bg-muted/10">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                            <Terminal className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-foreground text-lg sm:text-xl font-bold">{category.category}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-muted-foreground font-light">
                              Contains {category.endpoints.length} active service endpoint{category.endpoints.length !== 1 ? 's' : ''}.
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 divide-y divide-border/60">
                        {category.endpoints.map((endpoint, endIndex) => {
                          const endpointId = `${catIndex}-${endIndex}`;
                          const isExpanded = expandedEndpoints.has(endpointId);

                          return (
                            <div key={endIndex} className="transition-all duration-300">
                              <button
                                onClick={() => toggleEndpoint(endpointId)}
                                className="w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-4 sm:p-5 hover:bg-muted/15 transition-colors text-left group"
                              >
                                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                  {isExpanded ? (
                                    <ChevronDown className="h-4.5 w-4.5 text-muted-foreground shrink-0 transition-transform duration-300 rotate-180" />
                                  ) : (
                                    <ChevronRight className="h-4.5 w-4.5 text-muted-foreground shrink-0 transition-transform duration-300" />
                                  )}
                                  <Badge className={`${getMethodColor(endpoint.method)} border font-mono text-[10px] sm:text-xs shrink-0 rounded-lg px-2.5 py-1 font-bold`}>
                                    {endpoint.method}
                                  </Badge>
                                  <code className="text-xs sm:text-sm text-foreground break-all group-hover:text-primary transition-colors font-mono font-medium truncate">
                                    {endpoint.path}
                                  </code>
                                </div>
                                <span className="text-xs sm:text-sm text-muted-foreground shrink-0 group-hover:text-foreground transition-colors font-light">
                                  {endpoint.name}
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 md:p-8 border-t border-border bg-card/45">
                                  {/* Left Details Column */}
                                  <div className="lg:col-span-7 space-y-5">
                                    <div>
                                      <p className="text-xs text-primary font-bold uppercase tracking-wider mb-2 lg:hidden">{endpoint.name}</p>
                                      <p className="text-muted-foreground text-sm sm:text-base font-light leading-relaxed">
                                        {endpoint.description}
                                      </p>
                                    </div>

                                    {endpoint.parameters.length > 0 && (
                                      <div className="space-y-3">
                                        <h5 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                          Request Parameters
                                        </h5>
                                        
                                        {/* Mobile view parameters */}
                                        <div className="space-y-3 sm:hidden">
                                          {endpoint.parameters.map((param, pIndex) => (
                                            <div key={pIndex} className="bg-muted/40 p-3 rounded-2xl border border-border text-xs space-y-1.5">
                                              <div className="flex items-center justify-between">
                                                <code className="font-mono text-primary font-bold">{param.name}</code>
                                                {param.required ? (
                                                  <Badge variant="destructive" className="text-[10px] rounded px-1.5 py-0.5">Required</Badge>
                                                ) : (
                                                  <Badge variant="secondary" className="text-[10px] rounded px-1.5 py-0.5">Optional</Badge>
                                                )}
                                              </div>
                                              <p className="text-[11px] text-muted-foreground font-medium">Type: {param.type}</p>
                                              <p className="text-muted-foreground font-light leading-normal">{param.description}</p>
                                              {param.default !== undefined && (
                                                <p className="text-[10px] text-muted-foreground/60">Default: {String(param.default)}</p>
                                              )}
                                            </div>
                                          ))}
                                        </div>

                                        {/* Desktop table parameters */}
                                        <div className="overflow-x-auto hidden sm:block border border-border/80 rounded-2xl bg-background/50">
                                          <table className="w-full text-xs sm:text-sm border-collapse text-left">
                                            <thead>
                                              <tr className="border-b border-border bg-muted/40 text-foreground font-semibold text-xs tracking-wider uppercase">
                                                <th className="py-2.5 px-4">Parameter</th>
                                                <th className="py-2.5 px-4">Type</th>
                                                <th className="py-2.5 px-4">Required</th>
                                                <th className="py-2.5 px-4">Description</th>
                                              </tr>
                                            </thead>
                                            <tbody className="text-muted-foreground font-light">
                                              {endpoint.parameters.map((param, pIndex) => (
                                                <tr key={pIndex} className="border-b border-border/40 last:border-0 odd:bg-card/45 hover:bg-muted/10 transition-colors">
                                                  <td className="py-3 px-4 font-mono text-primary font-bold">{param.name}</td>
                                                  <td className="py-3 px-4">
                                                    <span className="bg-muted px-2 py-1 rounded text-[10px] sm:text-xs font-semibold border border-border/60">{param.type}</span>
                                                  </td>
                                                  <td className="py-3 px-4">
                                                    {param.required ? (
                                                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-red-500/10 text-red-500">Required</span>
                                                    ) : (
                                                      <span className="inline-flex px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold bg-slate-500/10 text-slate-500">Optional</span>
                                                    )}
                                                  </td>
                                                  <td className="py-3 px-4 text-xs">
                                                    {param.description}
                                                    {param.default !== undefined && (
                                                      <span className="text-[10px] text-muted-foreground/60 block mt-0.5">(default: {String(param.default)})</span>
                                                    )}
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Right Terminal Console Column - Fully Light Styled */}
                                  <div className="lg:col-span-5 space-y-4">
                                    {/* Request Box */}
                                    <div className="rounded-2xl border border-border bg-muted/20 overflow-hidden shadow-sm">
                                      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
                                        <div className="flex items-center gap-1.5">
                                          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
                                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></span>
                                          <span className="w-2.5 h-2.5 rounded-full bg-green-400/80"></span>
                                          <span className="text-xs text-muted-foreground font-mono ml-2">Request</span>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => copyToClipboard(endpoint.example.curl.replace("{{baseUrl}}", API_BASE_URL))}
                                          className="h-7 px-2 text-[10px] hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-lg"
                                        >
                                          <Copy className="h-3 w-3 mr-1" />
                                          Copy
                                        </Button>
                                      </div>
                                      <pre className="p-4 text-[11px] sm:text-xs text-foreground font-mono overflow-x-auto whitespace-pre-wrap break-all sm:whitespace-pre sm:break-normal leading-relaxed">
                                        {endpoint.example.curl.replace("{{baseUrl}}", API_BASE_URL)}
                                      </pre>
                                    </div>

                                    {/* Response Box */}
                                    <div className="rounded-2xl border border-border bg-muted/20 overflow-hidden shadow-sm">
                                      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-xs text-muted-foreground font-mono">Response (200 OK)</span>
                                        </div>
                                      </div>
                                      <pre className="p-4 text-[11px] sm:text-xs text-teal-600 dark:text-teal-400 font-mono overflow-x-auto leading-relaxed max-h-60 overflow-y-auto">
                                        {JSON.stringify(endpoint.example.response, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  ))
                )
              )}
            </TabsContent>

            {/* API Playground Tab */}
            <TabsContent value="playground" className="space-y-6 outline-none">
              {activeTab === "playground" && (
                <div className="rounded-3xl border border-border shadow-lg p-1 bg-muted/10">
                  <APIPlayground
                    apiDocs={apiDocs}
                    onApiKeyChange={noopApiKeyChange}
                  />
                </div>
              )}
            </TabsContent>

            {/* My API Keys Tab */}
            <TabsContent value="mykeys" className="space-y-6 outline-none">
              {activeTab === "mykeys" && (
                <Card className="bg-card border border-border/80 rounded-3xl shadow-lg relative overflow-hidden group hover:shadow-xl hover:border-primary/20 transition-all duration-400">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                  <CardHeader className="p-6 sm:p-8 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center">
                        <Shield className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground text-xl font-bold">Credential Center</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground font-light leading-relaxed">
                          Query and display your keys by checking your registered account email.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6 sm:p-8 pt-0 sm:pt-0 relative z-10">
                    <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                      <Input
                        id="lookup-email-input"
                        type="email"
                        placeholder="your@email.com"
                        value={lookupEmail}
                        onChange={(e) => setLookupEmail(e.target.value)}
                        className="bg-background border-border/85 text-foreground placeholder:text-muted-foreground text-sm h-12 rounded-xl focus:border-purple-500/50 transition-colors"
                      />
                      <Button
                        id="lookup-keys-btn"
                        onClick={lookupKeys}
                        className="h-12 sm:px-6 bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 rounded-xl font-semibold shadow-md shadow-purple-500/15"
                      >
                        <Shield className="h-4.5 w-4.5 mr-2" />
                        Lookup Keys
                      </Button>
                    </div>

                    {userKeys.length > 0 && (
                      <div className="space-y-4 border-t border-border/40 pt-6">
                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shrink-0"></span>
                          Found {userKeys.length} active API key{userKeys.length !== 1 ? 's' : ''}
                        </div>
                        <div className="grid gap-4">
                          {userKeys.map((key, index) => (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-muted/15 rounded-2xl border border-border hover:bg-muted/20 transition-all duration-300"
                            >
                              <div className="min-w-0 flex-1 space-y-2.5">
                                <div className="flex items-center gap-2.5">
                                  <p className="text-foreground font-bold text-base">{key.name || "Default Key"}</p>
                                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                                    key.status === "active" ? "bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20" : "bg-red-500/15 text-red-500 border border-red-500/20"
                                  }`}>
                                    {key.status}
                                  </span>
                                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                    {key.tier} Tier
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <code className="text-xs bg-muted/40 px-3 py-2 rounded-xl text-foreground font-mono border border-border break-all select-all">
                                    {key.key.slice(0, 8)}••••••••••••{key.key.slice(-4)}
                                  </code>
                                  <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-semibold px-2 py-1 bg-muted border border-border/40 select-none rounded-lg">
                                    Masked
                                  </span>
                                </div>

                                {typeof key.usage === "number" && (
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                      Usage: {key.usage} / {key.dailyLimit} daily
                                    </span>
                                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                                      Remaining: {Math.max(0, (key.dailyLimit || 0) - key.usage)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-xs text-muted-foreground shrink-0 flex items-center gap-1.5 font-light">
                                <Clock className="h-4.5 w-4.5 text-primary shrink-0" />
                                Created: {new Date(key.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {userKeys.length === 0 && lookupEmail && (
                      <div className="text-center py-10 border-t border-border/40">
                        <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                          <Key className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-light text-sm">No API keys found for this email.</p>
                        <p className="text-muted-foreground/60 text-xs mt-1.5 font-light">You can generate a new credentials token from the Get Started tab.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default APIDocs;
