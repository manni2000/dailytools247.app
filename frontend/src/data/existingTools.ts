// List of all existing tools based on the actual routes in App.tsx
export const existingTools = [
  // Audio Tools
  'audio-converter',
  'ai-speech-to-text',
  'audio-trimmer',
  'audio-merger',
  'audio-speed',
  
  // Date & Time Tools
  'age-calculator',
  'date-difference',
  'working-days-calculator',
  'countdown-timer',
  'world-time',
  
  // Developer Tools
  'json-formatter',
  'regex-tester',
  'url-encoder',
  'color-converter',
  'lorem-ipsum-generator',
  'jwt-decoder',
  'ai-cron-generator',
  'http-header-checker',
  'token-calculator',
  'color-palettes',
  'api-response-formatter',
  'ai-json-to-typescript-interface',
  'ai-sql-query-beautifier',
  'jwt-token-expiry-calculator',
  'environment-variable-generator',
  'ai-postman-collection-generator',
  'ai-dockerfile-generator',
  'curl-to-axios-converter',
  'http-status-code-explainer',
  
  // Education Tools
  'scientific-calculator',
  'percentage-calculator',
  'unit-converter',
  'compound-interest-calculator',
  'simple-interest-calculator',
  'cgpa-to-percentage',
  'lcm-hcf-calculator',
  'ai-study-timetable-generator',
  'ai-mcq-generator',
  
  // Finance Tools
  'emi-calculator',
  'gst-calculator',
  'salary-calculator',
  'currency-converter',
  'startup-burn-rate-calculator',
  'ai-saas-pricing-calculator',
  'emi-comparison',
  'ai-tax-slab-analyzer',
  'invoice-generator',
  'profit-margin-calculator',
  'freelancer-rate-calculator',
  'salary-breakup-generator',
  'ai-budget-planner',
  'stock-cagr-calculator',
  'mutual-fund-calculator',
  'lumpsum-calculator',
  
  // Image Tools
  'qr-code-generator',
  'qr-code-scanner',
  'png-to-jpg-converter',
  'jpg-to-png-converter',
  'webp-to-png-converter',
  'png-to-webp-converter',
  'webp-to-jpg-converter',
  'jpg-to-webp-converter',
  'image-compressor',
  'image-resize',
  'image-crop',
  'ai-background-remover',
  'ai-whatsapp-status-generator',
  'image-base64',
  'image-dpi-checker',
  'exif-viewer',
  'favicon-generator',
  'image-to-pdf',
  
  // Internet Tools
  'ip-lookup',
  'user-agent-parser',
  'dns-lookup',
  'ssl-checker',
  'website-ping',
  'website-screenshot',
  
  // PDF Tools
  'pdf-merge',
  'pdf-split',
  'pdf-to-image',
  'pdf-password',
  'pdf-unlock',
  'pdf-page-remover',
  'pdf-rotate',
  'pdf-to-word',
  'pdf-to-powerpoint',
  'pdf-to-excel',
  'word-to-pdf',
  'powerpoint-to-pdf',
  'html-to-pdf',
  'pdf-reorder',
  'pdf-add-signature',
  'crop-pdf',
  
  // Security Tools
  'password-generator',
  'password-strength',
  'hash-generator',
  'base64-encoder',
  'uuid-generator',
  'ai-password-strength-explainer',
  'data-breach-email-checker',
  'file-hash-comparison',
  'exif-location-remover',
  'ai-text-redaction',
  'ai-qr-phishing-scanner',
  'secure-notes',
  'ai-url-reputation-checker',
  
  // SEO Tools
  'ai-meta-tag-generator',
  'keyword-density-checker',
  'robots-txt-generator',
  'sitemap-validator',
  'page-speed-checklist-generator',
  'og-image-preview-tool',
  'broken-image-finder',
  'utm-link-builder',
  'domain-age-checker',
  'ai-tech-stack-detector',
  'ai-page-seo-analyzer',
  
  // Social Media Tools
  'ai-hashtag-generator',
  'ai-bio-generator',
  'caption-formatter',
  'line-break-generator',
  'link-in-bio',
  'ai-meme-generator',
  
  // Text Tools
  'word-counter',
  'case-converter',
  'markdown-to-html',
  'remove-spaces',
  'line-sorter',
  'duplicate-remover',
  'ai-text-summarizer',
  'text-diff',
  
  // Video Tools
  'video-to-audio',
  'video-trim',
  'video-speed',
  'video-thumbnail',
  'video-resolution',
  
  // Zip Tools
  'create-zip',
  'extract-zip',
  'password-zip',
  'compression-zip',

  // Email Marketing Tools
  'ai-email-subject-line-generator',
  'ai-email-signature-generator',
  'html-email-previewer',
  'ai-spam-score-checker',
  'ai-email-template-builder',
  'ai-email-header-analyzer',
  'spf-record-generator',
  'dkim-generator',
  'dmarc-generator',
  'mailto-link-generator'
];

// Helper function to check if a tool exists
export const toolExists = (slug: string): boolean => {
  return existingTools.includes(slug);
};
