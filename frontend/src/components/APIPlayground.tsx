import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import { 
  Play, 
  Copy, 
  Check, 
  Loader2, 
  RefreshCw, 
  Code2, 
  Terminal, 
  FileJson, 
  History,
  Save,
  Trash2,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
  Key,
  Rocket,
  Sparkles,
  ArrowRight,
  Settings,
  Send,
  Globe,
  Shield,
  Activity,
  Search
} from "lucide-react";

const highlightCode = (code: string, lang: string) => {
  if (!code) return "";
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (lang === "curl") {
    escaped = escaped
      .replace(/\b(curl)\b/g, '<span class="text-cyan-400 font-semibold">$1</span>')
      .replace(/(-X\s+POST|-X\s+GET|-X\s+PUT|-X\s+DELETE)\b/g, '<span class="text-amber-400 font-medium">$1</span>')
      .replace(/(-H\s+("[^"]+"|\'[^\']+\'))/g, '<span class="text-emerald-400">$1</span>')
      .replace(/(-d\s+(\'[^\']+\'|"[^"]+"))/g, '<span class="text-purple-400">$1</span>')
      .replace(/("https?:\/\/[^\s"]+")/g, '<span class="text-sky-400">$1</span>');
  } else if (lang === "javascript" || lang === "node") {
    escaped = escaped
      .replace(/\b(const|let|var|await|async|import|from|require|module|exports|return)\b/g, '<span class="text-purple-400 font-semibold">$1</span>')
      .replace(/\b(fetch|Headers|Response|JSON|stringify|log|error|request|write|end|on)\b/g, '<span class="text-sky-400">$1</span>')
      .replace(/(\'[^\']*\'|"[^"]*")/g, '<span class="text-emerald-400">$1</span>')
      .replace(/(\/\/[^\n]*)/g, '<span class="text-zinc-500 italic">$1</span>');
  } else if (lang === "python") {
    escaped = escaped
      .replace(/\b(import|as|from|def|print|return)\b/g, '<span class="text-purple-400 font-semibold">$1</span>')
      .replace(/\b(requests|json|post|get|put|delete|json|headers)\b/g, '<span class="text-sky-400">$1</span>')
      .replace(/(\'[^\\'\n]*\'|"[^"\n]*")/g, '<span class="text-emerald-400">$1</span>')
      .replace(/(#[^\n]*)/g, '<span class="text-zinc-500 italic">$1</span>');
  } else if (lang === "php") {
    escaped = escaped
      .replace(/\b(php|echo|curl_init|curl_setopt_array|curl_exec|curl_error|curl_close|json_encode)\b/g, '<span class="text-sky-400 font-semibold">$1</span>')
      .replace(/\b(if|else|true|false|null)\b/g, '<span class="text-purple-400 font-semibold">$1</span>')
      .replace(/(\'[^\']*\'|"[^"]*")/g, '<span class="text-emerald-400">$1</span>');
  }
  return escaped;
};

const highlightJson = (json: any) => {
  if (!json) return "";
  const str = typeof json === "string" ? json : JSON.stringify(json, null, 2);
  const escaped = str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, (match) => {
    let cls = "text-blue-400";
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = "text-amber-400 font-medium";
      } else {
        cls = "text-emerald-400";
      }
    } else if (/true|false/.test(match)) {
      cls = "text-purple-400 font-semibold";
    } else if (/null/.test(match)) {
      cls = "text-zinc-400 italic";
    }
    return `<span class="${cls}">${match}</span>`;
  });
};


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

interface PlaygroundRequest {
  id: string;
  endpoint: ApiEndpoint;
  parameters: Record<string, any>;
  response: any;
  status: number;
  duration: number;
  timestamp: Date;
  apiKey: string;
}

interface SavedExample {
  id: string;
  name: string;
  endpoint: ApiEndpoint;
  parameters: Record<string, any>;
  createdAt: Date;
}

// Backend selection constants - use relative URLs so Vite proxy routes correctly
const LOCAL_BACKEND = typeof window !== 'undefined' ? window.location.origin : "";
const PROD_BACKEND = "https://api.dailytools247.app";
const DEFAULT_BACKEND = import.meta.env.VITE_API_URL || LOCAL_BACKEND;

const BACKEND_OPTIONS = [
  { label: "Local (proxied via dev server)", value: LOCAL_BACKEND },
  { label: "Production (https://api.dailytools247.app)", value: PROD_BACKEND },
];

const APIPlayground = ({ 
  apiDocs, 
  onApiKeyChange 
}: { 
  apiDocs: { endpoints: ApiCategory[] } | null;
  onApiKeyChange: (key: string) => void;
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseDuration, setResponseDuration] = useState<number | null>(null);
  const [requestHistory, setRequestHistory] = useState<PlaygroundRequest[]>([]);
  const [savedExamples, setSavedExamples] = useState<SavedExample[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("curl");
  const [responseFormat, setResponseFormat] = useState("pretty");
  const [backendUrl, setBackendUrl] = useState<string>(DEFAULT_BACKEND);
  const [searchQuery, setSearchQuery] = useState("");
  const activeBlobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      activeBlobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("api-playground-history");
    if (saved) {
      setRequestHistory(JSON.parse(saved, (key, value) => {
        if (key === "timestamp") return new Date(value);
        return value;
      }));
    }

    const examples = localStorage.getItem("api-playground-examples");
    if (examples) {
      setSavedExamples(JSON.parse(examples, (key, value) => {
        if (key === "createdAt") return new Date(value);
        return value;
      }));
    }
  }, []);

  useEffect(() => {
    if (requestHistory.length > 0) {
      localStorage.setItem("api-playground-history", JSON.stringify(requestHistory));
    }
  }, [requestHistory]);

  useEffect(() => {
    if (savedExamples.length > 0) {
      localStorage.setItem("api-playground-examples", JSON.stringify(savedExamples));
    }
  }, [savedExamples]);

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-mono font-semibold";
      case "POST":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20 font-mono font-semibold";
      case "PUT":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20 font-mono font-semibold";
      case "DELETE":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20 font-mono font-semibold";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20 font-mono font-semibold";
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (status >= 300 && status < 400) return "text-blue-400 bg-blue-400/10 border-blue-400/20";
    if (status >= 400 && status < 500) return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    if (status >= 500) return "text-rose-400 bg-rose-400/10 border-rose-400/20";
    return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  };

  const handleEndpointSelect = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    setParameters({});
    setResponse(null);
    setResponseStatus(null);
    setResponseDuration(null);
    
    // Set default values
    const defaultParams: Record<string, any> = {};
    endpoint.parameters.forEach(param => {
      if (param.default !== undefined) {
        defaultParams[param.name] = param.default;
      }
    });
    setParameters(defaultParams);
  };

  const handleParameterChange = (paramName: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const executeRequest = async () => {
    if (!selectedEndpoint || !apiKey) {
      toast.error("Please select an endpoint and provide an API key", {
        description: "Both endpoint selection and API key are required to make requests.",
        action: {
          label: "Dismiss",
          onClick: () => {}
        }
      });
      return;
    }

    // Validate required parameters
    const missingParams = selectedEndpoint.parameters
      .filter(param => param.required && !parameters[param.name])
      .map(param => param.name);

    if (missingParams.length > 0) {
      toast.error(`Missing required parameters: ${missingParams.join(", ")}`, {
        description: "Please fill in all required parameters before sending the request.",
        action: {
          label: "View Parameters",
          onClick: () => document.getElementById('parameters-section')?.scrollIntoView({ behavior: 'smooth' })
        }
      });
      return;
    }

    setLoading(true);
    setResponse(null);
    setResponseStatus(null);
    setResponseDuration(null);
    
    // Revoke any previous object URLs to avoid memory leaks
    activeBlobUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    activeBlobUrlsRef.current = [];
    
    const startTime = Date.now();

    try {
      const url = new URL(`${backendUrl}${selectedEndpoint.path}`);
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": selectedEndpoint.contentType || "application/json",
        },
      };

      // Add request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      options.signal = controller.signal;

      if (selectedEndpoint.method !== "GET" && Object.keys(parameters).length > 0) {
        options.body = JSON.stringify(parameters);
      } else if (selectedEndpoint.method === "GET" && Object.keys(parameters).length > 0) {
        Object.entries(parameters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), options);
      clearTimeout(timeoutId);
      
      const responseTime = Date.now() - startTime;
      setResponseDuration(responseTime);
      setResponseStatus(response.status);

      let responseData;
      const contentType = response.headers.get("content-type") || "";
      const isImage = contentType.includes("image/");
      const isPdf = contentType.includes("application/pdf");
      
      if (contentType.includes("application/json")) {
        responseData = await response.json();
      } else if (isImage || isPdf) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        activeBlobUrlsRef.current.push(blobUrl);
        responseData = {
          _isBinary: true,
          blobUrl,
          contentType,
          size: blob.size,
        };
      } else {
        responseData = await response.text();
      }

      setResponse(responseData);

      if (response.ok) {
        toast.success("Request completed successfully!", {
          description: `Status: ${response.status} | Time: ${responseTime}ms`,
          icon: <CheckCircle className="h-4 w-4 text-green-400" />
        });
      } else {
        toast.error(`Request failed with status ${response.status}`, {
          description: responseData?.error || responseData?.message || "An error occurred while processing your request.",
          icon: <AlertCircle className="h-4 w-4 text-red-400" />
        });
      }

      // Add to history (avoid serializing blobUrl / large binary structures directly if possible)
      const historyItem: PlaygroundRequest = {
        id: Date.now().toString(),
        endpoint: selectedEndpoint,
        parameters: { ...parameters },
        response: responseData._isBinary ? { _isBinary: true, contentType: responseData.contentType, size: responseData.size } : responseData,
        status: response.status,
        duration: responseTime,
        timestamp: new Date(),
        apiKey: apiKey
      };
      setRequestHistory(prev => [historyItem, ...prev].slice(0, 50)); // Keep last 50 requests

    } catch (error) {
      // console.error("Request failed:", error);
      
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Request timed out after 30 seconds";
        } else if (error.message.includes('fetch')) {
          errorMessage = "Network error - please check your connection";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error("Request failed", {
        description: errorMessage,
        icon: <AlertCircle className="h-4 w-4 text-red-400" />,
        action: {
          label: "Retry",
          onClick: () => executeRequest()
        }
      });

      setResponse({ 
        error: errorMessage,
        timestamp: new Date().toISOString(),
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCode = (language: string) => {
    if (!selectedEndpoint) return "";

    const baseUrl = backendUrl;
    const endpoint = selectedEndpoint;

    switch (language) {
      case "curl":
        let curlCommand = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"`;
        curlCommand += `\n  -H "X-API-Key: ${apiKey}"`;
        curlCommand += `\n  -H "Content-Type: ${endpoint.contentType || "application/json"}"`;
        
        if (endpoint.method !== "GET" && Object.keys(parameters).length > 0) {
          curlCommand += `\n  -d '${JSON.stringify(parameters, null, 2)}'`;
        } else if (endpoint.method === "GET" && Object.keys(parameters).length > 0) {
          const queryParams = new URLSearchParams();
          Object.entries(parameters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              queryParams.append(key, String(value));
            }
          });
          const queryString = queryParams.toString();
          if (queryString) {
            curlCommand = curlCommand.replace(endpoint.path, `${endpoint.path}?${queryString}`);
          }
        }
        return curlCommand;

      case "javascript":
        const jsCode = `const response = await fetch('${baseUrl}${endpoint.path}', {
  method: '${endpoint.method}',
  headers: {
    'X-API-Key': '${apiKey}',
    'Content-Type': '${endpoint.contentType || "application/json"}',
  }${
  endpoint.method !== "GET" && Object.keys(parameters).length > 0
    ? `,
  body: JSON.stringify(${JSON.stringify(parameters, null, 2)})`
    : ""
},
});

const data = await response.json();
// console.log(data);`;
        return jsCode;

      case "python":
        const pythonCode = `import requests
import json

url = '${baseUrl}${endpoint.path}'
headers = {
    'X-API-Key': '${apiKey}',
    'Content-Type': '${endpoint.contentType || "application/json"}',
}${
  endpoint.method !== "GET" && Object.keys(parameters).length > 0
    ? `
data = ${JSON.stringify(parameters, null, 2)}

response = requests.${endpoint.method.toLowerCase()}(url, headers=headers, json=data)`
    : `
response = requests.${endpoint.method.toLowerCase()}(url, headers=headers)`
}

result = response.json()
print(result)`;
        return pythonCode;

      case "node":
        const nodeCode = `const https = require('https');

const data = ${endpoint.method !== "GET" && Object.keys(parameters).length > 0 
  ? JSON.stringify(parameters, null, 2) 
  : 'null'};

const options = {
  hostname: '${baseUrl.replace('https://', '').replace('http://', '')}',
  port: 443,
  path: '${endpoint.path}',
  method: '${endpoint.method}',
  headers: {
    'X-API-Key': '${apiKey}',
    'Content-Type': '${endpoint.contentType || "application/json"}',
  },
};

const req = https.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    // console.log(responseData);
  });
});

if (data) {
  req.write(JSON.stringify(data));
}
req.end();`;
        return nodeCode;

      case "php":
        const phpCode = `<?php
$curl = curl_init();

$url = '${baseUrl}${endpoint.path}';
$headers = [
    'X-API-Key: ${apiKey}',
    'Content-Type: ${endpoint.contentType || "application/json"}',
];

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => '${endpoint.method}',
    CURLOPT_POSTFIELDS => ${endpoint.method !== "GET" && Object.keys(parameters).length > 0 
      ? 'json_encode(' + JSON.stringify(parameters, null, 2) + ')' 
      : 'null'},
    CURLOPT_HTTPHEADER => $headers,
]);

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    echo 'cURL Error #:' . $err;
} else {
    echo $response;
}
?>`;
        return phpCode;

      default:
        return "";
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const saveExample = () => {
    if (!selectedEndpoint) return;

    const name = prompt("Enter a name for this example:");
    if (!name) return;

    const example: SavedExample = {
      id: Date.now().toString(),
      name,
      endpoint: selectedEndpoint,
      parameters: { ...parameters },
      createdAt: new Date()
    };

    setSavedExamples(prev => [...prev, example]);
    toast.success("Example saved successfully!");
  };

  const loadExample = (example: SavedExample) => {
    setSelectedEndpoint(example.endpoint);
    setParameters(example.parameters);
    setShowSaved(false);
    toast.success("Example loaded!");
  };

  const deleteExample = (id: string) => {
    setSavedExamples(prev => prev.filter(ex => ex.id !== id));
    toast.success("Example deleted!");
  };

  const clearHistory = () => {
    setRequestHistory([]);
    localStorage.removeItem("api-playground-history");
    toast.success("History cleared!");
  };

  const filteredCategories = apiDocs?.endpoints?.map((category) => {
    const endpoints = category.endpoints.filter(
      (endpoint) =>
        endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.method.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, endpoints };
  }).filter((category) => category.endpoints.length > 0) || [];

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl fade-in">
        <div className="relative z-10 flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
          <div className="text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto sm:mx-0 playground-card border border-border">
                <Terminal className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <div>
                <h2 className="responsive-text-2xl sm:responsive-text-3xl lg:responsive-text-4xl font-bold text-foreground mb-1 sm:mb-2">
                  API Playground
                </h2>
                <p className="text-muted-foreground responsive-text-sm sm:responsive-text-base lg:responsive-text-lg">
                  Test API endpoints in real-time with our interactive playground
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 sm:gap-6 responsive-text-xs sm:responsive-text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot"></span>
                <span className="hidden sm:inline">Live Testing</span>
                <span className="sm:hidden">Live</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600" />
                <span className="hidden sm:inline">Instant Response</span>
                <span className="sm:hidden">Fast</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                <span className="hidden sm:inline">Secure</span>
                <span className="sm:hidden">Safe</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="border-border bg-card hover:bg-muted text-foreground responsive-text-xs sm:responsive-text-sm px-3 py-2 sm:px-4 focus-ring playground-card"
            >
              <History className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span>History ({requestHistory.length})</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaved(!showSaved)}
              className="border-border bg-card hover:bg-muted text-foreground responsive-text-xs sm:responsive-text-sm px-3 py-2 sm:px-4 focus-ring playground-card"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span>Saved ({savedExamples.length})</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced API Key Input */}
      <Card className="bg-card border border-border hover:shadow-md transition-all duration-300 overflow-hidden relative group">
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl flex items-center justify-center">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-foreground text-lg font-semibold">API Authentication</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your API key to start testing endpoints
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 relative z-10">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="playground-api-key-input"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  onApiKeyChange(e.target.value);
                }}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10 focus:border-primary/50 transition-colors"
              />
              {apiKey && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </div>
              )}
            </div>
            <Button
              id="playground-copy-key-btn"
              variant="outline"
              size="sm"
              onClick={() => copyCode(apiKey)}
              className="border-border bg-muted hover:bg-muted/80 px-4 text-foreground"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {!apiKey && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
              <span>API key is required to make requests. Get one from the Get Started tab.</span>
            </div>
          )}
          {apiKey && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
              <span>API key authenticated and ready to use</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Enhanced Endpoint Selection */}
        <div className="xl:col-span-1 min-w-0 order-1 xl:order-1">
          <Card className="bg-card border border-border hover:shadow-md transition-all duration-300 h-fit overflow-hidden relative group sticky top-4">
            <CardHeader className="pb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center shrink-0 border border-border">
                  <Terminal className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-base sm:text-lg">Select Endpoint</CardTitle>
                  <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                    Choose an endpoint to test
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto relative z-10 pr-2 scrollbar-thin">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="playground-filter-input"
                  type="text"
                  placeholder="Filter endpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background border-border text-foreground placeholder:text-muted-foreground text-xs h-9 focus:border-primary/50 transition-colors"
                />
              </div>

              {filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs">
                  No matching endpoints found
                </div>
              ) : (
                filteredCategories.map((category, catIndex) => (
                  <div key={catIndex} className="mb-4">
                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                      <span className="w-1.5 h-1.5 bg-primary/80 rounded-full"></span>
                      {category.category}
                    </h4>
                    {category.endpoints.map((endpoint, endIndex) => (
                      <button
                        key={endIndex}
                        onClick={() => handleEndpointSelect(endpoint)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all duration-200 mb-2 group endpoint-button relative overflow-hidden ${
                          selectedEndpoint === endpoint
                            ? "bg-primary/10 border-primary/40 shadow-sm"
                            : "bg-muted/15 border-border/60 hover:bg-muted/30 hover:border-border/80"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <Badge className={`${getMethodColor(endpoint.method)} text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-md`}>
                            {endpoint.method}
                          </Badge>
                          {selectedEndpoint === endpoint && (
                            <span className="w-2 h-2 bg-green-500 rounded-full pulse-dot"></span>
                          )}
                        </div>
                        <code className={`responsive-text-xs text-foreground block mb-1 font-mono break-all leading-normal ${
                          selectedEndpoint === endpoint ? "text-primary" : "group-hover:text-primary transition-colors"
                        }`}>
                          {endpoint.path}
                        </code>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{endpoint.name}</p>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Request Builder */}
        <div className="xl:col-span-2 space-y-4 min-w-0 order-2 xl:order-2">
          {selectedEndpoint ? (
            <>
              {/* Enhanced Endpoint Info */}
              <Card className="bg-card border border-border hover:shadow-md transition-all duration-300 overflow-hidden relative group">
                <CardHeader className="pb-3 relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0 border border-border">
                        <Send className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-foreground text-base sm:text-lg flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <Badge className={`${getMethodColor(selectedEndpoint.method)} text-xs sm:text-sm font-medium w-fit`}>
                            {selectedEndpoint.method}
                          </Badge>
                          <span className="break-words">{selectedEndpoint.name}</span>
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                          {selectedEndpoint.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        id="playground-send-request-btn"
                        onClick={executeRequest}
                        disabled={loading || !apiKey}
                        className="bg-green-600 hover:bg-green-650 transition-all duration-300 shadow-sm text-white text-sm sm:text-base w-full sm:w-auto"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span className="hidden sm:inline">Sending...</span>
                            <span className="sm:hidden">Sending</span>
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Send Request</span>
                            <span className="sm:hidden">Send</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Enhanced Parameters */}
              {selectedEndpoint.parameters.length > 0 && (
                <Card id="parameters-section" className="bg-card border border-border hover:shadow-md transition-all duration-300 overflow-hidden relative group">
                  <CardHeader className="pb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-border">
                        <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                      </div>
                      <div>
                        <CardTitle className="text-foreground text-base sm:text-lg">Parameters</CardTitle>
                        <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                          Configure request parameters
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    {selectedEndpoint.parameters.map((param) => (
                      <div key={param.name} className="space-y-2.5 p-4 bg-muted/10 hover:bg-muted/20 border border-border/60 hover:border-primary/20 transition-all duration-300 rounded-xl shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2 font-mono">
                              {param.name}
                              {param.required ? (
                                <Badge variant="destructive" className="text-[10px] bg-red-500/10 border-red-500/20 text-red-700 font-semibold px-2 py-0.5 rounded-md">
                                  Required
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-[10px] bg-muted border-border/60 text-muted-foreground font-semibold px-2 py-0.5 rounded-md">
                                  Optional
                                </Badge>
                              )}
                            </label>
                          </div>
                          <Badge variant="outline" className="text-[10px] border-border text-foreground bg-muted/50 px-2.5 py-0.5 rounded-md font-mono font-medium">
                            {param.type}
                          </Badge>
                        </div>
                        {param.type === "boolean" ? (
                          <Select
                            value={parameters[param.name]?.toString() || "false"}
                            onValueChange={(value) => handleParameterChange(param.name, value === "true")}
                          >
                            <SelectTrigger id={`param-input-${param.name}`} className="bg-background border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-xl text-foreground text-sm h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">true</SelectItem>
                              <SelectItem value="false">false</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : param.type === "text" || param.type === "string" ? (
                          <Textarea
                            id={`param-input-${param.name}`}
                            placeholder={param.description}
                            value={parameters[param.name] || ""}
                            onChange={(e) => handleParameterChange(param.name, e.target.value)}
                            className="bg-background border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-xl resize-none text-foreground text-sm p-3 min-h-[80px]"
                          />
                        ) : (
                          <Input
                            id={`param-input-${param.name}`}
                            type={param.type === "number" ? "number" : "text"}
                            placeholder={param.description}
                            value={parameters[param.name] || ""}
                            onChange={(e) => handleParameterChange(param.name, e.target.value)}
                            className="bg-background border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-xl text-foreground text-sm h-10 px-3"
                          />
                        )}
                        {param.default !== undefined && (
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                            <span>Default: <code className="bg-muted px-1 py-0.5 rounded text-[10px] font-mono text-foreground font-semibold">{String(param.default)}</code></span>
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Code Generation */}
              <Card className="bg-card border border-border hover:shadow-md transition-all duration-300 overflow-hidden relative group">
                <CardHeader className="pb-3 relative z-10">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0 border border-border">
                          <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-foreground text-base sm:text-lg flex items-center gap-2">
                            Code Generation
                          </CardTitle>
                          <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                            Export request in multiple programming languages
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        id="playground-save-request-btn"
                        variant="outline"
                        size="sm"
                        onClick={saveExample}
                        className="border-border bg-muted/20 hover:bg-muted/40 text-foreground px-3 py-1.5 text-xs h-8"
                      >
                        <Save className="h-3.5 w-3.5 mr-1.5" />
                        <span>Save Request</span>
                      </Button>
                    </div>
                    
                    {/* Horizontal tab-like selection bar */}
                    <div className="flex flex-wrap items-center gap-1.5 border-b border-border/80 pb-2">
                      {[
                        { id: "curl", label: "cURL", file: "request.sh" },
                        { id: "javascript", label: "JavaScript", file: "request.js" },
                        { id: "python", label: "Python", file: "request.py" },
                        { id: "node", label: "Node.js", file: "index.js" },
                        { id: "php", label: "PHP", file: "request.php" }
                      ].map(lang => (
                        <button
                          id={`playground-lang-btn-${lang.id}`}
                          key={lang.id}
                          onClick={() => setSelectedLanguage(lang.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                            selectedLanguage === lang.id
                              ? "bg-primary/10 text-primary border border-primary/25 font-semibold"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                          }`}
                        >
                          {lang.file}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 border-t border-border relative">
                  <div className="bg-[#0f141c] text-zinc-100 rounded-b-xl border border-zinc-800/80 shadow-inner overflow-hidden font-mono text-xs">
                    {/* macOS Chrome Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-zinc-800/80 select-none">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 mr-2">
                          <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                          <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                          <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="text-[10px] text-zinc-400 font-sans tracking-wide">
                          {selectedLanguage === "curl" ? "request.sh" :
                           selectedLanguage === "javascript" ? "request.js" :
                           selectedLanguage === "python" ? "request.py" :
                           selectedLanguage === "node" ? "index.js" : "request.php"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          id="playground-copy-code-btn"
                          size="sm"
                          variant="ghost"
                          onClick={() => copyCode(generateCode(selectedLanguage))}
                          className="h-7 px-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 text-xs border border-zinc-800/60 rounded-md font-sans"
                        >
                          {copiedCode === generateCode(selectedLanguage) ? (
                            <Check className="h-3 w-3 text-green-400 mr-1.5" />
                          ) : (
                            <Copy className="h-3 w-3 mr-1.5" />
                          )}
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 overflow-x-auto max-h-[300px] scrollbar-thin">
                      <pre className="m-0 leading-relaxed min-w-[280px]">
                        <code 
                          dangerouslySetInnerHTML={{ 
                            __html: highlightCode(generateCode(selectedLanguage), selectedLanguage) 
                          }} 
                        />
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Response */}
              {response && (
                <Card className="bg-card border border-border hover:shadow-md transition-all duration-300 overflow-hidden relative group">
                  <CardHeader className="pb-3 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-border">
                          <FileJson className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-foreground text-base sm:text-lg flex flex-col sm:flex-row sm:items-center gap-2">
                            Response
                            {responseStatus && (
                              <Badge 
                                className={`text-xs font-mono font-semibold ${getStatusColor(responseStatus)}`}
                              >
                                {responseStatus}
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm">
                            <span>API response data and metadata</span>
                            {responseStatus && (
                              <span className="text-xs px-2 py-1 rounded-full bg-muted border border-border w-fit text-foreground">
                                {responseStatus >= 200 && responseStatus < 300 ? 'Success' : 
                                 responseStatus >= 400 && responseStatus < 500 ? 'Client Error' :
                                 responseStatus >= 500 ? 'Server Error' : 'Redirect'}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {responseDuration && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted px-2 sm:px-3 py-1 rounded-full border border-border">
                            <Zap className="h-3 w-3 text-green-500" />
                            {responseDuration}ms
                          </div>
                        )}
                        <Select value={responseFormat} onValueChange={setResponseFormat}>
                          <SelectTrigger id="playground-response-format-select" className="w-20 sm:w-24 bg-background border-border text-foreground text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pretty">Pretty</SelectItem>
                            <SelectItem value="raw">Raw</SelectItem>
                            <SelectItem value="compact">Compact</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 border-t border-border relative">
                    <div className="bg-[#0f141c] text-zinc-100 rounded-b-xl border border-zinc-800/80 shadow-inner overflow-hidden font-mono text-xs">
                      {/* macOS Chrome Header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-zinc-800/80 select-none">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 mr-2">
                            <div className="w-2 h-2 rounded-full bg-rose-500/80" />
                            <div className="w-2 h-2 rounded-full bg-amber-500/80" />
                            <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
                          </div>
                          <span className="text-[10px] text-zinc-400 font-sans tracking-wide">
                            {response._isBinary ? "binary-data" : "response.json"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {!response._isBinary && (
                            <Button
                              id="playground-copy-response-btn"
                              size="sm"
                              variant="ghost"
                              onClick={() => copyCode(JSON.stringify(response, null, 2))}
                              className="h-7 px-2.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 text-xs border border-zinc-800/60 rounded-md font-sans animate-none"
                            >
                              {copiedCode === JSON.stringify(response, null, 2) ? (
                                <Check className="h-3.5 w-3.5 text-green-400 mr-1.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 mr-1.5" />
                              )}
                              Copy
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="p-4 overflow-x-auto max-h-[400px] scrollbar-thin">
                        {response._isBinary ? (
                          <div className="flex flex-col items-center justify-center p-6 bg-zinc-900 rounded-lg border border-zinc-800">
                            {response.contentType.includes("image/") ? (
                              <div className="space-y-4 text-center w-full">
                                <img 
                                  src={response.blobUrl} 
                                  alt="API Preview" 
                                  className="max-h-[250px] max-w-full rounded border border-zinc-700 shadow-md object-contain mx-auto" 
                                />
                                <div className="text-xs text-zinc-400 font-sans">
                                  Format: <span className="font-semibold text-emerald-400">{response.contentType}</span> | Size: <span className="font-semibold">{(response.size / 1024).toFixed(2)} KB</span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const a = document.createElement("a");
                                    a.href = response.blobUrl;
                                    a.download = `response-${Date.now()}.${response.contentType.split("/")[1] || "png"}`;
                                    a.click();
                                  }}
                                  className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 text-xs mx-auto"
                                >
                                  Download Image
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4 text-center w-full">
                                <FileJson className="h-12 w-12 text-blue-500 mx-auto" />
                                <div className="text-sm text-zinc-200 font-medium font-sans">PDF Document Output</div>
                                <div className="text-xs text-zinc-400 font-sans">
                                  Format: <span className="font-semibold text-emerald-400">{response.contentType}</span> | Size: <span className="font-semibold">{(response.size / 1024).toFixed(2)} KB</span>
                                </div>
                                <div className="flex gap-2 justify-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(response.blobUrl, "_blank")}
                                    className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 text-xs"
                                  >
                                    View PDF in New Tab
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const a = document.createElement("a");
                                      a.href = response.blobUrl;
                                      a.download = `response-${Date.now()}.pdf`;
                                      a.click();
                                    }}
                                    className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700 text-xs"
                                  >
                                    Download PDF
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <pre className="m-0 leading-relaxed min-w-[250px]">
                            <code 
                              dangerouslySetInnerHTML={{ 
                                __html: highlightJson(
                                  responseFormat === "pretty" 
                                    ? JSON.stringify(response, null, 2)
                                    : responseFormat === "raw"
                                    ? JSON.stringify(response)
                                    : JSON.stringify(response).replace(/\s+/g, " ")
                                )
                              }} 
                            />
                          </pre>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-gradient-to-br from-card to-muted/20 border border-border/80 rounded-2xl flex flex-col items-center justify-center text-center p-8 sm:p-12 min-h-[500px] relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-6 shadow-sm pulse-dot">
                  <Terminal className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 tracking-tight">
                  Interactive API Playground
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-md leading-relaxed">
                  Select an API endpoint from the sidebar to start customizing parameters, generating integration code, and executing real-time tests.
                </p>

                {/* macOS Terminal Graphic Mockup */}
                <div className="w-full max-w-md bg-[#0d1117] rounded-xl border border-zinc-800 shadow-xl overflow-hidden text-left mb-8 font-mono text-[11px] leading-relaxed select-none">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
                    </div>
                    <span className="text-zinc-400 text-xs font-sans">demo-request.sh</span>
                    <div className="w-10" />
                  </div>
                  <div className="p-4 space-y-2.5 text-zinc-300">
                    <div>
                      <span className="text-purple-400">curl</span> <span className="text-cyan-400">-X</span> <span className="text-yellow-400">POST</span> <span className="text-emerald-400">"https://api.dailytools247.app/api/v1/text/word-counter"</span> \
                    </div>
                    <div className="pl-4">
                      <span className="text-cyan-400">-H</span> <span className="text-emerald-400">"X-API-Key: dt_demo_key"</span> \
                    </div>
                    <div className="pl-4">
                      <span className="text-cyan-400">-H</span> <span className="text-emerald-400">"Content-Type: application/json"</span> \
                    </div>
                    <div className="pl-4">
                      <span className="text-cyan-400">-d</span> <span className="text-purple-400">'&#123;"text": "Test our API"&#125;'</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-800/80 text-zinc-500">
                      # Response (200 OK)
                    </div>
                    <div className="text-emerald-455 font-medium">
                      &#123;
                        <div className="pl-4"><span className="text-amber-400">"success"</span>: <span className="text-purple-400">true</span>,</div>
                        <div className="pl-4"><span className="text-amber-400">"words"</span>: <span className="text-blue-400">3</span>,</div>
                        <div className="pl-4"><span className="text-amber-400">"characters"</span>: <span className="text-blue-400">12</span></div>
                      &#125;
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                  <div className="bg-muted/40 border border-border/60 hover:border-primary/20 p-4 rounded-xl transition-all duration-300 text-center">
                    <Zap className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
                    <h4 className="text-xs font-semibold text-foreground mb-1">Real-time Testing</h4>
                    <p className="text-[11px] text-muted-foreground">Send real HTTP requests & view responses instantly</p>
                  </div>
                  <div className="bg-muted/40 border border-border/60 hover:border-primary/20 p-4 rounded-xl transition-all duration-300 text-center">
                    <Code2 className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                    <h4 className="text-xs font-semibold text-foreground mb-1">Code Export</h4>
                    <p className="text-[11px] text-muted-foreground">Export copy-paste snippets in 5 programming languages</p>
                  </div>
                  <div className="bg-muted/40 border border-border/60 hover:border-primary/20 p-4 rounded-xl transition-all duration-300 text-center">
                    <Shield className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
                    <h4 className="text-xs font-semibold text-foreground mb-1">Secure Sandboxing</h4>
                    <p className="text-[11px] text-muted-foreground">Safe execution using standard CORS setup</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Enhanced History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <Card className="bg-card border border-border max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center border border-border">
                    <History className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground text-base sm:text-lg font-semibold">Request History</CardTitle>
                    <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                      Your recent API requests and responses
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistory}
                    className="border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Clear All</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                    className="border-border text-foreground hover:bg-muted text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Close</span>
                    <span className="sm:hidden">✕</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[60vh] min-w-0">
              {requestHistory.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base mb-2">No request history yet</p>
                  <p className="text-muted-foreground/60 text-xs sm:text-sm">Start making API requests to see your history here</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {requestHistory.map((item) => (
                    <div key={item.id} className="p-3 sm:p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={`${getMethodColor(item.endpoint.method)} text-xs`}>
                            {item.endpoint.method}
                          </Badge>
                          <code className="text-xs text-foreground font-mono break-all">{item.endpoint.path}</code>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <Badge 
                            variant={item.status >= 200 && item.status < 300 ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                          <span className="bg-muted px-2 py-1 rounded border border-border">{item.duration}ms</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {Object.entries(item.parameters).map(([key, value]) => (
                          <span key={key} className="bg-muted px-2 py-1 rounded border border-border break-all font-mono">
                            {key}: {JSON.stringify(value)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Saved Examples Modal */}
      {showSaved && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <Card className="bg-card border border-border max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl flex items-center justify-center border border-border">
                    <Save className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground text-base sm:text-lg font-semibold">Saved Examples</CardTitle>
                    <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                      Your frequently used API request configurations
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaved(false)}
                  className="border-border text-foreground hover:bg-muted text-xs sm:text-sm"
                >
                  <span className="hidden sm:inline">Close</span>
                  <span className="sm:hidden">✕</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[60vh] min-w-0">
              {savedExamples.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Save className="h-6 w-6 sm:h-8 sm:w-8 text-slate-600" />
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base mb-2">No saved examples yet</p>
                  <p className="text-muted-foreground/60 text-xs sm:text-sm">Save your frequently used API requests for quick access</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {savedExamples.map((example) => (
                    <div key={example.id} className="p-3 sm:p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-foreground font-semibold mb-1 flex items-center gap-2 text-sm sm:text-base">
                            {example.name}
                            <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge className={`${getMethodColor(example.endpoint.method)} text-xs`}>
                              {example.endpoint.method}
                            </Badge>
                            <code className="text-xs text-foreground font-mono break-all">{example.endpoint.path}</code>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadExample(example)}
                            className="border-green-200 text-green-600 hover:bg-green-50 text-xs sm:text-sm"
                          >
                            <Rocket className="h-3.5 w-3.5 mr-1" />
                            <span className="hidden sm:inline">Load</span>
                            <span className="sm:hidden">→</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteExample(example.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline ml-1">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Created {example.createdAt.toLocaleDateString()} at {example.createdAt.toLocaleTimeString()}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default APIPlayground;
