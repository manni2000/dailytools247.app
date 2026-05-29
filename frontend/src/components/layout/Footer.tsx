import { Link } from "react-router-dom";
import { Wrench, Heart } from "lucide-react";
import { toolCategories } from "@/data/toolCategories";

const Footer = () => {
  // Category hub links for topical authority - Rule 7: Homepage links to high-value pages only
  const categoryHubs = [
    { name: "Free PDF Tools", path: "/category/pdf" },
    { name: "Online Image Tools", path: "/category/image" },
    { name: "Finance Calculators", path: "/category/finance" },
    { name: "Developer Tools", path: "/category/dev" },
    { name: "Security Tools", path: "/category/security" },
    { name: "Text Processing Tools", path: "/category/text" },
    { name: "E-commerce Tools", path: "/category/ecommerce" },
    { name: "Video Tools", path: "/category/video" },
    { name: "SEO Tools", path: "/category/seo" },
    { name: "Date & Time Tools", path: "/category/date-time" },
    { name: "Email Marketing Tools", path: "/category/email" },
  ];

  const popularTools = [
    { name: "QR Code Generator", path: "/qr-code-generator" },
    { name: "Image to PDF", path: "/image-to-pdf" },
    { name: "PDF to Word", path: "/pdf-to-word" },
    { name: "PDF to Image", path: "/pdf-to-image" },
    { name: "AI Background Remover", path: "/ai-background-remover" },
    { name: "Invoice Generator", path: "/invoice-generator" },
  ];

  const pdfTools = [
    { name: "PDF Merge", path: "/pdf-merge" },
    { name: "PDF Split", path: "/pdf-split" },
    { name: "PDF to Image", path: "/pdf-to-image" },
    { name: "PDF to Word", path: "/pdf-to-word" },
    { name: "PDF to PowerPoint", path: "/pdf-to-powerpoint" },
    { name: "PDF to Excel", path: "/pdf-to-excel" },
    { name: "Word to PDF", path: "/word-to-pdf" },
    { name: "PowerPoint to PDF", path: "/powerpoint-to-pdf" },
    { name: "HTML to PDF", path: "/html-to-pdf" },
    { name: "PDF Password Protector", path: "/pdf-password" },
    { name: "PDF Unlocker", path: "/pdf-unlock" },
    { name: "PDF Page Remover", path: "/pdf-page-remover" },
    { name: "PDF Rotate Pages", path: "/pdf-rotate" },
    { name: "PDF Reorder Pages", path: "/pdf-reorder" },
    { name: "PDF Add Signature", path: "/pdf-add-signature" },
    { name: "Crop PDF", path: "/crop-pdf" },
  ];

  const seoTools = [
    { name: "AI SEO Meta Description Generator", path: "/ai-meta-tag-generator" },
    { name: "Keyword Density Checker", path: "/ai-keyword-density-checker" },
    { name: "Robots.txt Generator", path: "/robots-txt-generator" },
    { name: "Sitemap Validator", path: "/sitemap-validator" },
    { name: "Page Speed Checklist Generator", path: "/page-speed-checklist-generator" },
    { name: "OG Image Preview Tool", path: "/og-image-preview-tool" },
    { name: "Broken Image Finder", path: "/broken-image-finder" },
    { name: "UTM Link Builder", path: "/utm-link-builder" },
    { name: "Domain Age Checker", path: "/domain-age-checker" },
    { name: "Website Tech Stack Detector", path: "/ai-tech-stack-detector" },
    { name: "Page SEO Analyzer", path: "/ai-page-seo-analyzer" },
  ];

  const zipTools = [
    { name: "Create ZIP", path: "/create-zip" },
    { name: "Extract ZIP", path: "/extract-zip" },
    { name: "Password-Protected ZIP", path: "/password-zip" },
    { name: "Compression Level ZIP", path: "/compression-zip" },
  ];

  const videoTools = [
    { name: "Video to Audio", path: "/ai-video-to-audio" },
    { name: "Video Trim", path: "/video-trim" },
    { name: "Video Speed Controller", path: "/video-speed" },
    { name: "Video Thumbnail Generator", path: "/video-thumbnail" },
    { name: "Video Resolution Converter", path: "/video-resolution" },
  ];

  const audioTools = [
    { name: "Audio Converter", path: "/audio-converter" },
    { name: "Speech to Text", path: "/ai-speech-to-text" },
    { name: "Audio Trimmer", path: "/audio-trimmer" },
    { name: "Audio Merger", path: "/audio-merger" },
    { name: "Audio Speed Changer", path: "/audio-speed" },
  ];

  const securityTools = [
    { name: "Password Generator", path: "/password-generator" },
    { name: "Password Strength Checker", path: "/password-strength" },
    { name: "Hash Generator", path: "/hash-generator" },
    { name: "Base64 Encoder", path: "/base64-encoder" },
    { name: "UUID Generator", path: "/uuid-generator" },
    { name: "Password Strength Explainer", path: "/ai-password-strength-explainer" },
    { name: "Data Breach Email Checker", path: "/data-breach-email-checker" },
    { name: "File Hash Comparison", path: "/file-hash-comparison" },
    { name: "EXIF Location Remover", path: "/exif-location-remover" },
    { name: "Text Redaction", path: "/ai-text-redaction" },
    { name: "QR Phishing Scanner", path: "/ai-qr-phishing-scanner" },
    { name: "Secure Notes", path: "/secure-notes" },
    { name: "URL Reputation Checker", path: "/ai-url-reputation-checker" },
  ];

  const internetTools = [
    { name: "IP Address Lookup", path: "/ip-lookup" },
    { name: "User-Agent Parser", path: "/user-agent-parser" },
    { name: "DNS Lookup", path: "/dns-lookup" },
    { name: "SSL Certificate Checker", path: "/ssl-checker" },
    { name: "Website Ping Test", path: "/website-ping" },
    { name: "Ping Test", path: "/ping-test" },
    { name: "Website Screenshot", path: "/website-screenshot" },
  ];

  const imageTools = [
    { name: "QR Code Generator", path: "/qr-code-generator" },
    { name: "QR Code Scanner", path: "/qr-code-scanner" },
    { name: "PNG to JPG Converter", path: "/png-to-jpg-converter" },
    { name: "JPG to PNG Converter", path: "/jpg-to-png-converter" },
    { name: "WebP to PNG Converter", path: "/webp-to-png-converter" },
    { name: "PNG to WebP Converter", path: "/png-to-webp-converter" },
    { name: "WebP to JPG Converter", path: "/webp-to-jpg-converter" },
    { name: "JPG to WebP Converter", path: "/jpg-to-webp-converter" },
    { name: "Image Compressor", path: "/image-compressor" },
    { name: "Image Resize", path: "/image-resize" },
    { name: "Image Crop", path: "/image-crop" },
    { name: "AI Background Remover", path: "/ai-background-remover" },
    { name: "Image to PDF", path: "/image-to-pdf" },
    { name: "Image DPI Checker", path: "/image-dpi-checker" },
    { name: "Favicon Generator", path: "/favicon-generator" },
    { name: "EXIF Viewer", path: "/exif-viewer" },
    { name: "Image ↔ Base64", path: "/image-base64" },
  ];

  const financeTools = [
    { name: "EMI Calculator", path: "/emi-calculator" },
    { name: "GST Calculator", path: "/gst-calculator" },
    { name: "Salary Calculator", path: "/salary-calculator" },
    { name: "Currency Converter", path: "/currency-converter" },
    { name: "Startup Burn Rate Calculator", path: "/startup-burn-rate-calculator" },
    { name: "SaaS Pricing Calculator", path: "/ai-saas-pricing-calculator" },
    { name: "EMI Comparison", path: "/emi-comparison" },
    { name: "Tax Slab Analyzer", path: "/ai-tax-slab-analyzer" },
    { name: "Invoice Generator", path: "/invoice-generator" },
    { name: "Profit Margin Calculator", path: "/profit-margin-calculator" },
    { name: "Freelancer Rate Calculator", path: "/freelancer-rate-calculator" },
    { name: "Salary Breakup Generator", path: "/salary-breakup-generator" },
    { name: "Budget Planner", path: "/ai-budget-planner" },
    { name: "Stock CAGR Calculator", path: "/stock-cagr-calculator" },
    { name: "Mutual Fund Calculator", path: "/mutual-fund-calculator" },
    { name: "Lumpsum Calculator", path: "/lumpsum-calculator" },
    { name: "SIP Calculator", path: "/sip-calculator" },
    { name: "ROI Calculator", path: "/roi-calculator" },
  ];

  const devTools = [
    { name: "JSON Formatter", path: "/json-formatter" },
    { name: "Regex Tester", path: "/regex-tester" },
    { name: "JWT Decoder", path: "/jwt-decoder" },
    { name: "URL Encoder", path: "/url-encoder" },
    { name: "Color Palettes Generator", path: "/color-palettes" },
    { name: "Lorem Ipsum Generator", path: "/lorem-ipsum-generator" },
    { name: "Cron Generator", path: "/ai-cron-generator" },
    { name: "HTTP Header Checker", path: "/http-header-checker" },
    { name: "Token Calculator", path: "/token-calculator" },
    { name: "API Response Formatter", path: "/api-response-formatter" },
    { name: "JSON to TypeScript", path: "/ai-json-to-typescript-interface" },
    { name: "SQL Query Beautifier", path: "/ai-sql-query-beautifier" },
    { name: "JWT Token Expiry Calculator", path: "/jwt-token-expiry-calculator" },
    { name: "Environment Variable Generator", path: "/environment-variable-generator" },
    { name: "Postman Collection Generator", path: "/ai-postman-collection-generator" },
    { name: "Dockerfile Generator", path: "/ai-dockerfile-generator" },
    { name: "Curl to Axios Converter", path: "/curl-to-axios-converter" },
    { name: "HTTP Status Code Explainer", path: "/http-status-code-explainer" },
    { name: "HTML Validator", path: "/html-validator" },
    { name: "CSS Validator", path: "/css-validator" },
  ];

  const educationTools = [
    { name: "Scientific Calculator", path: "/scientific-calculator" },
    { name: "CGPA to Percentage", path: "/cgpa-to-percentage" },
    { name: "LCM HCF Calculator", path: "/lcm-hcf-calculator" },
    { name: "Percentage Calculator", path: "/percentage-calculator" },
    { name: "Unit Converter", path: "/ai-unit-converter" },
    { name: "Compound Interest", path: "/compound-interest-calculator" },
    { name: "Simple Interest", path: "/simple-interest-calculator" },
    { name: "Study Timetable Generator", path: "/ai-study-timetable-generator" },
    { name: "MCQ Generator", path: "/ai-mcq-generator" },
    { name: "World Time", path: "/world-time" },
    { name: "Age Calculator", path: "/age-calculator" },
    { name: "Date Difference", path: "/date-difference" },
    { name: "Working Days Calculator", path: "/working-days-calculator" },
    { name: "Countdown Timer", path: "/countdown-timer" },
  ];

  const textTools = [
    { name: "Word Counter", path: "/word-counter" },
    { name: "Case Converter", path: "/case-converter" },
    { name: "Color Converter", path: "/color-converter" },
    { name: "Remove Spaces", path: "/remove-spaces" },
    { name: "Line Sorter", path: "/line-sorter" },
    { name: "Duplicate Remover", path: "/duplicate-remover" },
    { name: "Markdown to HTML", path: "/ai-markdown-to-html" },
    { name: "Text Summarizer", path: "/ai-text-summarizer" },
    { name: "Text Diff Checker", path: "/text-diff" },
  ];

  const socialMediaTools = [
    { name: "Hashtag Generator", path: "/ai-hashtag-generator" },
    { name: "Bio Generator", path: "/ai-bio-generator" },
    { name: "Caption Formatter", path: "/ai-caption-formatter" },
    { name: "Line Break Generator", path: "/line-break-generator" },
    { name: "Link-in-Bio", path: "/link-in-bio" },
    { name: "WhatsApp Status Generator", path: "/ai-whatsapp-status-generator" },
    { name: "Meme Generator", path: "/ai-meme-generator" },
  ];

  const govtLegalTools = [
    { name: "Passport Photo Resizer", path: "/passport-photo-resizer" },
    { name: "PDF Compressor", path: "/pdf-compressor" },
    { name: "Signature Maker", path: "/signature-maker" },
    { name: "Document Template", path: "/document-template" },
  ];

  const ecommerceTools = [
    { name: "Barcode Generator", path: "/barcode-generator" },
    { name: "GST Invoice Generator", path: "/gst-invoice-generator" },
    { name: "Business Calculator", path: "/ecommerce-calculator" },
    { name: "Shadow Adder", path: "/ai-shadow-adder" },
    { name: "Watermark Adder", path: "/watermark-adder" },
    { name: "White Background Adder", path: "/white-background-adder" },
    { name: "Bulk Image Resizer", path: "/bulk-image-resizer" },
    { name: "Image Color Enhancer", path: "/ai-image-color-enhancer" },
  ];

  const emailTools = [
    { name: "Email Subject Line Generator", path: "/ai-email-subject-line-generator" },
    { name: "Email Signature Generator", path: "/ai-email-signature-generator" },
    { name: "HTML Email Previewer", path: "/html-email-previewer" },
    { name: "Spam Score Checker", path: "/ai-spam-score-checker" },
    { name: "Email Template Builder", path: "/ai-email-template-builder" },
    { name: "Email Header Analyzer", path: "/ai-email-header-analyzer" },
    { name: "SPF Record Generator", path: "/spf-record-generator" },
    { name: "DKIM Generator", path: "/dkim-generator" },
    { name: "DMARC Generator", path: "/dmarc-generator" },
    { name: "Mailto Link Generator", path: "/mailto-link-generator" },
  ];

  const categories = toolCategories.slice(0, 8).map(cat => ({
    name: cat.name,
    path: `/category/${cat.id}`
  }));

  return (
    <footer className="border-t border-border bg-card" data-nosnippet="true">
      <div className="container py-12 [content-visibility:auto] [contain-intrinsic-size:1800px]">
        {/* Top Section - Brand + Popular Tools */}
        <div className="grid gap-8 sm:grid-cols-2 mb-10">
          {/* Brand */}
          <div className="flex flex-col sm:items-start gap-4">
            <div className="flex flex-col sm:items-start -mt-2">
              <div className="relative flex h-40 w-40 sm:h-48 sm:w-48 overflow-hidden ml-[-30px]">
                <img
                  src="/dailytools247.webp"
                  alt="dailytools247 logo"
                  className="h-40 w-40 sm:h-48 sm:w-48 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <Wrench className="h-20 w-20 sm:h-24 sm:w-24 text-primary hidden" />
              </div>
              <div className="flex flex-col sm:items-start sm:text-left -mt-8">
                <span className="text-xl font-bold tracking-tight">
                  Daily<span className="text-primary">tools247</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Free Online Tools
                </span>
                <p className="max-w-md text-sm text-muted-foreground mt-2">
                  200+ free online tools for images, PDFs, videos, text, and developer workflows.
                  No signup, no limits, 100% browser-local processing.
                </p>
                <div className="mt-4">
                  <Link
                    to="/categories"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow hover:bg-primary/95 transition-all duration-300"
                  >
                    View All 200+ Tools
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Popular Tools</h4>
            <ul className="space-y-2">
              {popularTools.map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 border-t border-border pt-6 md:pt-8">

          {/* PDF Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">PDF Tools</h4>
            <ul className="space-y-2">
              {pdfTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {pdfTools.length > 5 && (
                <li>
                  <Link to="/category/pdf" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all PDF Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Image Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Image Tools</h4>
            <ul className="space-y-2">
              {imageTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {imageTools.length > 5 && (
                <li>
                  <Link to="/category/image" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Image Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Security Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Security Tools</h4>
            <ul className="space-y-2">
              {securityTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {securityTools.length > 5 && (
                <li>
                  <Link to="/category/security" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Security Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Finance Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Finance Tools</h4>
            <ul className="space-y-2">
              {financeTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {financeTools.length > 5 && (
                <li>
                  <Link to="/category/finance" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Finance Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Govt Legal Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Govt Legal Tools</h4>
            <ul className="space-y-2">
              {govtLegalTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {govtLegalTools.length > 5 && (
                <li>
                  <Link to="/category/govt-legal" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Legal Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Developer Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Developer Tools</h4>
            <ul className="space-y-2">
              {devTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {devTools.length > 5 && (
                <li>
                  <Link to="/category/dev" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Dev Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Education Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Education Tools</h4>
            <ul className="space-y-2">
              {educationTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {educationTools.length > 5 && (
                <li>
                  <Link to="/category/education" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Edu Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Text Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Text Tools</h4>
            <ul className="space-y-2">
              {textTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {textTools.length > 5 && (
                <li>
                  <Link to="/category/text" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Text Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Video Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Video Tools</h4>
            <ul className="space-y-2">
              {videoTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {videoTools.length > 5 && (
                <li>
                  <Link to="/category/video" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Video Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Audio Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Audio Tools</h4>
            <ul className="space-y-2">
              {audioTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {audioTools.length > 5 && (
                <li>
                  <Link to="/category/audio" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Audio Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Internet Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Internet Tools</h4>
            <ul className="space-y-2">
              {internetTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {internetTools.length > 5 && (
                <li>
                  <Link to="/category/internet" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Internet Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* SEO Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">SEO Tools</h4>
            <ul className="space-y-2">
              {seoTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {seoTools.length > 5 && (
                <li>
                  <Link to="/category/seo" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all SEO Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* ZIP Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">ZIP Tools</h4>
            <ul className="space-y-2">
              {zipTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {zipTools.length > 5 && (
                <li>
                  <Link to="/category/zip" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all ZIP Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Social Media Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Social Media Tools</h4>
            <ul className="space-y-2">
              {socialMediaTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {socialMediaTools.length > 5 && (
                <li>
                  <Link to="/category/social" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Social Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* E-commerce Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">E-commerce Tools</h4>
            <ul className="space-y-2">
              {ecommerceTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {ecommerceTools.length > 5 && (
                <li>
                  <Link to="/category/ecommerce" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all E-commerce Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Email Marketing Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Email Marketing Tools</h4>
            <ul className="space-y-2">
              {emailTools.slice(0, 5).map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="text-sm text-muted-foreground hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
              {emailTools.length > 5 && (
                <li>
                  <Link to="/category/email" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center mt-1">
                    View all Email Tools →
                  </Link>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Categories Row - Hub Links for Topical Authority */}
        <div className="mt-10 border-t border-border pt-8">
          <h4 className="mb-4 text-sm font-semibold">Browse by Category</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categoryHubs.map(hub => (
              <Link
                key={hub.path}
                to={hub.path}
                className="text-sm text-muted-foreground hover:text-foreground hover:text-primary transition-colors"
              >
                {hub.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} dailytools247. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center sm:justify-start sm:text-left">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/write-for-us" className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap">
              Write for Us
            </Link>
            <Link to="/blogs" className="text-sm text-muted-foreground hover:text-foreground">
              Blogs
            </Link>
            <Link to="/api-docs" className="text-sm text-muted-foreground hover:text-foreground whitespace-nowrap">
              API for Developers
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-destructive" /> for everyone
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
