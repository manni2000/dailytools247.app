import { useState, useEffect } from "react";
import { Copy, Check, FileText, Layout, Paintbrush, User, Link, ClipboardCheck, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIProcessingIndicator from "@/components/AIProcessingIndicator";
import { fadeInUp } from "@/lib/animations";
import ToolLayout from "@/components/layout/ToolLayout";
import ToolFAQ from "@/components/ToolFAQ";
import ToolHero from "@/components/ToolHero";
import { API_URLS } from "@/lib/api-complete";
import { CategorySEO } from "@/components/ToolSEO";
import { getToolSeoMetadata } from "@/data/toolSeoEnhancements";

const categoryColor = "250 85% 55%";

const EmailSignatureGeneratorTool = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const toolSeoData = getToolSeoMetadata('ai-email-signature-generator');
  const [name, setName] = useState("John Doe");
  const [role, setRole] = useState("Marketing Director");
  const [company, setCompany] = useState("Acme Corporation");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [email, setEmail] = useState("john.doe@acme.com");
  const [website, setWebsite] = useState("www.acme.com");
  const [address, setAddress] = useState("123 Business Way, San Francisco, CA");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80");
  
  const [facebook, setFacebook] = useState("https://facebook.com");
  const [twitter, setTwitter] = useState("https://twitter.com");
  const [linkedin, setLinkedin] = useState("https://linkedin.com");
  const [instagram, setInstagram] = useState("https://instagram.com");

  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [accentColor, setAccentColor] = useState("#f59e0b");
  const [layout, setLayout] = useState("classic");

  const [signatureHtml, setSignatureHtml] = useState("");
  const [copied, setCopied] = useState(false);
  const [snippetCopied, setSnippetCopied] = useState(false);

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(signatureHtml);
    setSnippetCopied(true);
    setTimeout(() => setSnippetCopied(false), 2000);
  };

  const fetchSignature = async () => {
    try {
      const response = await fetch(`${API_URLS.BASE_URL}${API_URLS.EMAIL_SIGNATURE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          company,
          phone,
          email,
          website,
          address,
          avatarUrl,
          socialLinks: { facebook, twitter, linkedin, instagram },
          primaryColor,
          accentColor,
          layout,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSignatureHtml(data.html);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSignature();
    }, 400); // Debounce fetch signatures

    return () => clearTimeout(timer);
  }, [name, role, company, phone, email, website, address, avatarUrl, facebook, twitter, linkedin, instagram, primaryColor, accentColor, layout]);

  const handleCopy = () => {
    // Copy HTML to clipboard
    navigator.clipboard.writeText(signatureHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorPresets = [
    { label: "Indigo", primary: "#6366f1", accent: "#f59e0b" },
    { label: "Red", primary: "#ef4444", accent: "#10b981" },
    { label: "Blue", primary: "#3b82f6", accent: "#ec4899" },
    { label: "Dark", primary: "#1f2937", accent: "#6b7280" },
    { label: "Emerald", primary: "#10b981", accent: "#f59e0b" },
  ];

  return (
    <>
      {CategorySEO.Email(
        toolSeoData?.title || "AI Email Signature Generator",
        toolSeoData?.description || "Create modern, responsive HTML email signatures that copy directly into your email client.",
        "ai-email-signature-generator"
      )}
      <ToolLayout
        breadcrumbTitle="AI Email Signature Generator"
        category="Email Marketing Tools"
        categoryPath="/category/email"
      >
        <div className="space-y-6">
          <ToolHero
            title="AI Email Signature Generator"
            subtitle="Create modern, responsive HTML email signatures that copy directly into your email client."
            tags={["email signature", "html signature", "email template"]}
            Icon={Mail}
            categoryColor={categoryColor}
          />

          <div className="grid gap-6 lg:grid-cols-12">
            {/* Input Config Panels (Left) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Profile details */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-500" />
                  Personal Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="John Doe"
                      title="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Job Title</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none"
                      placeholder="Senior Developer"
                      title="Enter your job title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none"
                      placeholder="Company Inc."
                      title="Enter your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none"
                      placeholder="(555) 123-4567"
                      title="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none"
                      placeholder="john@example.com"
                      title="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Website URL</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none"
                      placeholder="https://example.com"
                      title="Enter your website URL"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Physical Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none"
                      placeholder="123 Business St, City, State 12345"
                      title="Enter your physical address"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Avatar / Logo Image URL</label>
                    <input
                      type="text"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none"
                      placeholder="https://example.com/avatar.png"
                      title="Enter your avatar or logo image URL"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Social URLs */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Link className="h-5 w-5 text-indigo-500" />
                  Social Media Links
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Twitter / X</label>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="https://twitter.com/username"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Facebook</label>
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="https://facebook.com/username"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Instagram</label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="https://instagram.com/username"
                      className="w-full rounded-lg bg-muted px-3 py-2 border border-border focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Layout & Colors */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Paintbrush className="h-5 w-5 text-indigo-500" />
                  Design Options
                </h3>
                <div>
                  <label className="block text-sm font-medium mb-2">Select Template Style</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "classic", label: "Classic" },
                      { id: "modern", label: "Modern Accent" },
                      { id: "minimalist", label: "Minimalist Code" },
                      { id: "creative", label: "Creative Banner" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLayout(item.id)}
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
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Primary Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        aria-label="Primary color"
                        title="Primary color"
                        className="h-9 w-12 rounded border border-border cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        title="Primary color hex value"
                        className="flex-1 rounded-lg bg-muted px-2 py-1.5 border border-border text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Accent Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        aria-label="Accent color"
                        title="Accent color"
                        className="h-9 w-12 rounded border border-border cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        placeholder="Accent color hex value"
                        title="Accent color hex value"
                        className="flex-1 rounded-lg bg-muted px-2 py-1.5 border border-border text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block text-xs font-medium text-muted-foreground mb-2">Or select a color palette preset:</span>
                  <div className="flex flex-wrap gap-2">
                    {colorPresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPrimaryColor(preset.primary);
                          setAccentColor(preset.accent);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs hover:bg-muted font-medium"
                      >
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Live Preview / Code pane (Right) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="sticky top-6 space-y-6">
                {/* Live Preview */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Layout className="h-5 w-5 text-indigo-500" />
                    Live Signature Preview
                  </h3>
                  <div className="p-4 border border-border rounded-lg bg-white overflow-x-auto min-h-[140px] flex items-center justify-center">
                    <div dangerouslySetInnerHTML={{ __html: signatureHtml }} />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex-1 rounded-lg py-2.5 font-medium text-white flex items-center justify-center gap-2"
                      style={{
                        background: `linear-gradient(135deg, hsl(${categoryColor}) 0%, hsl(${categoryColor} / 0.8) 100%)`,
                      }}
                    >
                      {copied ? <ClipboardCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied!" : "Copy HTML Code"}
                    </button>
                  </div>
                </motion.div>

                {/* HTML Output View */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Raw HTML Snippet
                    </h3>
                    <button
                      type="button"
                      onClick={handleCopySnippet}
                      className="p-1.5 rounded hover:bg-muted text-muted-foreground transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      {snippetCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy HTML</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <textarea
                      readOnly
                      aria-label="Raw HTML snippet"
                      title="Raw HTML snippet"
                      value={signatureHtml}
                      className="w-full h-80 rounded-lg bg-muted p-3 font-mono text-xs text-foreground border border-border focus:outline-none scrollbar-thin"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Copy this inline-styled HTML code and paste it into your signature settings in Outlook, Gmail, or Apple Mail.
                  </p>
                </motion.div>
              </div>
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
              <User className="h-5 w-5 text-blue-500" />
              What is an Email Signature?
            </h3>
            <p className="text-muted-foreground mb-4">
              An Email Signature is a block of personalized text, links, and images placed at the end of an email. It provides professional branding, contact info, and links to websites or social profiles.
            </p>
            
            <h4 className="font-semibold mb-2">How It Works</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-4">
              <li>Choose a layout template (Classic, Modern, Minimalist, Creative).</li>
              <li>Fill in personal details, company name, contact info, and website links.</li>
              <li>Add profile image URLs and social media links.</li>
              <li>Copy the generated signature as rich text or raw HTML to configure in Gmail, Outlook, or Apple Mail.</li>
            </ol>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-1">Key Features</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Custom design layouts & styles</li>
                  <li>• Custom brand colors & palettes</li>
                  <li>• Social media link integration</li>
                  <li>• Live preview and HTML output</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-1">Use Cases</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Corporate professional communications</li>
                  <li>• Consistent team branding</li>
                  <li>• Marketing call-to-actions</li>
                  <li>• Easy contact details sharing</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <ToolFAQ
            faqs={[
              {
                question: "How do I install the signature in Gmail?",
                answer: "1. Click 'Copy HTML Code'. 2. Open Gmail settings (Gear Icon > See all settings). 3. Scroll down to 'Signature'. 4. Create new, then paste (Ctrl+V / Cmd+V) directly into the rich text signature box. 5. Save changes at the bottom.",
              },
              {
                question: "Why should email signatures use tables?",
                answer: "Email client software (like Microsoft Outlook) renders layouts using older HTML parsing engines. Table structures ensure widths, paddings, and alignment remain consistent and do not break.",
              },
              {
                question: "Can I use external image links for my photo?",
                answer: "Yes. Simply upload your headshot or logo to a public host (like Imgur, Unsplash, or your website server) and paste the URL in the Avatar field.",
              },
            ]}
          />
        </div>
      </ToolLayout>
    </>
  );
};

export default EmailSignatureGeneratorTool;
