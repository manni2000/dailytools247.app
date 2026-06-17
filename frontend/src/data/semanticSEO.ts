// EXTREME SEO: Semantic Entity Recognition System
export interface SemanticEntity {
  type: 'Person' | 'Organization' | 'Place' | 'Product' | 'Service' | 'Technology' | 'Concept';
  name: string;
  description: string;
  properties: Record<string, any>;
  relationships: Array<{
    target: string;
    type: string;
    strength: number;
  }>;
}

export interface TopicalCluster {
  mainTopic: string;
  relatedEntities: string[];
  supportingKeywords: string[];
  userIntents: Array<{
    intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
    keywords: string[];
    questions: string[];
  }>;
  contentAngles: string[];
  semanticVariations: string[];
}

const normalizeCluster = (key: string): string => {
  const map: Record<string, string> = {
    'pdf-conversion': 'pdf-tools',
    'pdf-tools': 'pdf-tools',
    'PDF Tools': 'pdf-tools',
    'image-optimization': 'image-tools',
    'image-tools': 'image-tools',
    'Image Tools': 'image-tools',
    'Developer Tools': 'dev-tools',
    'dev-tools': 'dev-tools',
    'Security Tools': 'security-tools',
    'security-tools': 'security-tools',
    'SEO Tools': 'seo-tools',
    'seo-tools': 'seo-tools',
    'Email Marketing Tools': 'email-tools',
    'email-tools': 'email-tools',
    'Social Media Tools': 'social-tools',
    'social-tools': 'social-tools',
    'Finance Tools': 'finance-tools',
    'finance-tools': 'finance-tools',
    'Education Tools': 'education-tools',
    'education-tools': 'education-tools',
    'ZIP Tools': 'zip-tools',
    'zip-tools': 'zip-tools',
    'Govt Legal Tools': 'govt-legal-tools',
    'govt-legal-tools': 'govt-legal-tools',
    'E-commerce Tools': 'ecommerce-tools',
    'ecommerce-tools': 'ecommerce-tools',
    'Video Tools': 'video-tools',
    'video-tools': 'video-tools',
    'Audio Tools': 'audio-tools',
    'audio-tools': 'audio-tools',
    'Text Tools': 'text-tools',
    'text-tools': 'text-tools',
    'Date & Time Tools': 'date-time-tools',
    'date-time-tools': 'date-time-tools',
    'Internet Tools': 'internet-tools',
    'internet-tools': 'internet-tools',
    'AI Utilities': 'ai-tools',
    'ai-tools': 'ai-tools',
    'Date & Time': 'date-time-tools',
    'Social Media': 'social-tools'
  };
  return map[key] || key;
};

export const semanticEntities: Record<string, SemanticEntity[]> = {
  'pdf-tools': [
    {
      type: 'Technology',
      name: 'PDF',
      description: 'Portable Document Format, a file format developed by Adobe for presenting documents',
      properties: {
        fileExtension: '.pdf',
        mimeType: 'application/pdf',
        developer: 'Adobe Systems',
        released: '1993',
        standard: 'ISO 32000-1'
      },
      relationships: [
        { target: 'Word', type: 'converts_to', strength: 0.95 },
        { target: 'Excel', type: 'converts_to', strength: 0.85 },
        { target: 'PowerPoint', type: 'converts_to', strength: 0.80 }
      ]
    },
    {
      type: 'Service',
      name: 'Document Conversion',
      description: 'Process of converting documents from one format to another',
      properties: {
        process: 'file transformation',
        output: 'different format',
        preservation: 'formatting, content, structure'
      },
      relationships: [
        { target: 'PDF', type: 'processes', strength: 0.90 }
      ]
    }
  ],
  'image-tools': [
    {
      type: 'Technology',
      name: 'Image Compression',
      description: 'Process of reducing image file size while maintaining quality',
      properties: {
        algorithms: ['JPEG', 'PNG', 'WebP'],
        metrics: ['PSNR', 'SSIM', 'LPIPS'],
        tradeoff: 'size vs quality'
      },
      relationships: [
        { target: 'Website Performance', type: 'improves', strength: 0.95 },
        { target: 'SEO', type: 'improves', strength: 0.85 }
      ]
    }
  ],
  'dev-tools': [
    {
      type: 'Technology',
      name: 'JSON',
      description: 'JavaScript Object Notation, a lightweight data-interchange format',
      properties: {
        standard: 'ECMA-404',
        mimeType: 'application/json'
      },
      relationships: [
        { target: 'TypeScript', type: 'converts_to', strength: 0.90 }
      ]
    }
  ],
  'security-tools': [
    {
      type: 'Technology',
      name: 'Encryption',
      description: 'Process of encoding information to prevent unauthorized access',
      properties: {
        standard: 'AES-256',
        keys: 'symmetric, asymmetric'
      },
      relationships: [
        { target: 'Secure Notes', type: 'protects', strength: 0.95 }
      ]
    }
  ],
  'seo-tools': [
    {
      type: 'Service',
      name: 'Search Engine Optimization',
      description: 'Optimizing websites to improve search visibility and traffic',
      properties: {
        factors: ['meta tags', 'keywords', 'page speed', 'sitemaps']
      },
      relationships: [
        { target: 'Web Performance', type: 'correlates_with', strength: 0.90 }
      ]
    }
  ],
  'email-tools': [
    {
      type: 'Technology',
      name: 'Email Delivery Protocol',
      description: 'Authentication and validation frameworks for email security',
      properties: {
        standards: ['SPF', 'DKIM', 'DMARC']
      },
      relationships: [
        { target: 'Deliverability', type: 'improves', strength: 0.95 }
      ]
    }
  ],
  'social-tools': [
    {
      type: 'Service',
      name: 'Social Media Optimization',
      description: 'Creating and formatting high-engagement content for social media channels',
      properties: {
        platforms: ['Instagram', 'TikTok', 'WhatsApp', 'Facebook']
      },
      relationships: [
        { target: 'Engagement Rate', type: 'drives', strength: 0.90 }
      ]
    }
  ],
  'finance-tools': [
    {
      type: 'Technology',
      name: 'SaaS Pricing Calculator',
      description: 'Calculator tool for modeling subscription business unit economics, MRR, ARR, LTV, and CAC.',
      properties: {
        applicationType: 'Financial Modeler',
        outputs: ['Monthly Recurring Revenue', 'Customer Lifetime Value', 'Customer Acquisition Cost Ratio'],
        calculationMethod: 'Local Browser-based JS Calculations'
      },
      relationships: [
        { target: 'Unit Economics', type: 'analyzes', strength: 0.95 },
        { target: 'Business Viability', type: 'forecasts', strength: 0.90 }
      ]
    }
  ],
  'ai-tools': [
    {
      type: 'Technology',
      name: 'Artificial Intelligence Utilities',
      description: 'Local web-browser based AI utilities powered by client-side heuristic engines and models.',
      properties: {
        modelsUsed: ['PII Redactor', 'Background Remover', 'MCQ Generator', 'SaaS Pricing Optimizer'],
        processingType: 'Local Client-side Heuristics'
      },
      relationships: [
        { target: 'Data Privacy', type: 'ensures', strength: 0.98 },
        { target: 'Web Automation', type: 'powers', strength: 0.90 }
      ]
    }
  ],
  'video-tools': [
    {
      type: 'Technology',
      name: 'Video Processing API',
      description: 'Web browser-based video editing, format conversion, and rendering.',
      properties: {
        supportedCodecs: ['H.264', 'VP8', 'VP9', 'AAC', 'MP3'],
        outputFormats: ['MP4', 'WebM', 'MP3']
      },
      relationships: [
        { target: 'Media Optimization', type: 'supports', strength: 0.95 }
      ]
    }
  ],
  'audio-tools': [
    {
      type: 'Technology',
      name: 'Web Audio Engine',
      description: 'Client-side audio manipulation, conversion, speed adjustment, and trimming.',
      properties: {
        formats: ['MP3', 'WAV', 'M4A', 'OGG']
      },
      relationships: [
        { target: 'Speech to Text', type: 'transcribes_to', strength: 0.92 }
      ]
    }
  ],
  'text-tools': [
    {
      type: 'Concept',
      name: 'Text Processing and Analytics',
      description: 'Parsing, sanitizing, and manipulating text structures such as markdown, diff, case, and line spacing.',
      properties: {
        operations: ['Diffing', 'Case Conversion', 'Word Count', 'Space Sanitization']
      },
      relationships: [
        { target: 'SEO Content', type: 'improves', strength: 0.85 }
      ]
    }
  ],
  'education-tools': [
    {
      type: 'Service',
      name: 'Academic Calculators',
      description: 'Mathematical and scientific equations, unit conversions, and timetable generators.',
      properties: {
        mathFormulas: ['Percentage', 'Interest', 'CGPA', 'LCM/HCF']
      },
      relationships: [
        { target: 'Student Productivity', type: 'improves', strength: 0.90 }
      ]
    }
  ],
  'zip-tools': [
    {
      type: 'Technology',
      name: 'ZIP Compression Engine',
      description: 'High-ratio file compression and password encryption executed client-side in JS.',
      properties: {
        format: 'ZIP',
        encryption: 'AES'
      },
      relationships: [
        { target: 'File Portability', type: 'improves', strength: 0.95 }
      ]
    }
  ],
  'govt-legal-tools': [
    {
      type: 'Service',
      name: 'Legal and Govt Utilities',
      description: 'Tools for official identity submissions and legal document template generation.',
      properties: {
        outputs: ['Rental Agreement', 'Passport Photo Resizing', 'Digital Signature']
      },
      relationships: [
        { target: 'Document Workflow', type: 'accelerates', strength: 0.95 }
      ]
    }
  ],
  'internet-tools': [
    {
      type: 'Service',
      name: 'Network Diagnostics',
      description: 'Analyzing internet parameters, domain reputation, and active server routes.',
      properties: {
        queries: ['DNS Lookup', 'SSL Checking', 'IP Geolocation', 'Ping Test']
      },
      relationships: [
        { target: 'Domain Security', type: 'checks', strength: 0.95 }
      ]
    }
  ],
  'date-time-tools': [
    {
      type: 'Concept',
      name: 'Temporal Operations',
      description: 'Time zone offsets, date intervals, and calendar arithmetic calculations.',
      properties: {
        calculations: ['Date Difference', 'Countdown', 'Working Days']
      },
      relationships: [
        { target: 'Scheduling Integrity', type: 'maintains', strength: 0.90 }
      ]
    }
  ],
  'ecommerce-tools': [
    {
      type: 'Service',
      name: 'E-commerce Utility Pack',
      description: 'Operations for digital merchant catalog preparation and invoice structuring.',
      properties: {
        features: ['Background Remover', 'Barcode Generator', 'GST Invoice Builder']
      },
      relationships: [
        { target: 'Seller Workflow', type: 'streamlines', strength: 0.95 }
      ]
    }
  ]
};

export const topicalClusters: Record<string, TopicalCluster> = {
  'pdf-tools': {
    mainTopic: 'PDF Document Conversion',
    relatedEntities: ['PDF', 'Microsoft Word', 'Adobe Acrobat', 'Document Management'],
    supportingKeywords: [
      'document workflow', 'file format conversion', 'digital transformation', 
      'office productivity', 'paperless office', 'document automation',
      'file compatibility', 'cross-platform documents', 'universal document format'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['convert pdf to word', 'pdf converter online', 'pdf to docx free'],
        questions: [
          'how to convert pdf to word',
          'best pdf to word converter',
          'convert pdf without losing formatting'
        ]
      },
      {
        intent: 'informational',
        keywords: ['pdf vs word', 'pdf format explained', 'document formats comparison'],
        questions: [
          'what is pdf format',
          'difference between pdf and word',
          'when to use pdf vs word'
        ]
      }
    ],
    contentAngles: [
      'Professional Document Workflow',
      'Academic Research Papers',
      'Legal Document Processing',
      'Business Report Generation',
      'Educational Material Creation'
    ],
    semanticVariations: [
      'portable document format conversion',
      'digital document transformation',
      'file format interoperability',
      'document format standardization'
    ]
  },
  'image-tools': {
    mainTopic: 'Image Optimization for Web',
    relatedEntities: ['JPEG', 'PNG', 'WebP', 'Website Performance', 'Core Web Vitals'],
    supportingKeywords: [
      'page speed optimization', 'image compression', 'web performance',
      'user experience', 'mobile optimization', 'SEO ranking factors',
      'visual content optimization', 'media optimization', 'bandwidth reduction'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['compress image', 'reduce image size', 'image optimizer'],
        questions: [
          'how to compress images for web',
          'best image compression tool',
          'reduce image file size without quality loss'
        ]
      },
      {
        intent: 'commercial',
        keywords: ['website speed optimization', 'SEO image optimization'],
        questions: [
          'how images affect SEO',
          'best image format for web',
          'optimize images for Core Web Vitals'
        ]
      }
    ],
    contentAngles: [
      'E-commerce Product Images',
      'Blog Visual Content',
      'Social Media Graphics',
      'Website Hero Images',
      'Mobile App Screenshots'
    ],
    semanticVariations: [
      'visual asset optimization',
      'digital image compression',
      'web-ready image processing',
      'media file size reduction'
    ]
  },
  'dev-tools': {
    mainTopic: 'Developer Utilities and Syntax Converters',
    relatedEntities: ['JSON', 'TypeScript', 'Regex', 'Postman', 'Docker'],
    supportingKeywords: [
      'syntax formatting', 'code validation', 'regular expressions',
      'API debugging', 'web development toolset', 'JSON schema translation'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['format json online', 'json to typescript interface', 'sql query beautifier'],
        questions: [
          'how to convert json to typescript',
          'beautify sql queries online',
          'generate dockerfile with ai'
        ]
      }
    ],
    contentAngles: [
      'Full Stack Development',
      'DevOps Workflow Automation',
      'Database Administration',
      'API Engineering'
    ],
    semanticVariations: [
      'software developer helpers',
      'programmer syntax formatters',
      'code parsing tools'
    ]
  },
  'security-tools': {
    mainTopic: 'Cybersecurity, Cryptography, and Privacy',
    relatedEntities: ['AES-256', 'Password Strength', 'Phishing detection', 'Redaction'],
    supportingKeywords: [
      'password generator', 'secure hashing algorithms', 'data redaction',
      'qr code phishing scanner', 'url reputation checker', 'private secure notes'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['generate strong password', 'check data breach email', 'encrypt text notes'],
        questions: [
          'how to check password strength',
          'redact sensitive information from text',
          'check if qr code is safe'
        ]
      }
    ],
    contentAngles: [
      'Personal Cybersecurity',
      'Corporate Privacy Compliance',
      'Safe Web Browsing'
    ],
    semanticVariations: [
      'digital privacy protection',
      'cryptographic hash generation',
      'data leak scanner'
    ]
  },
  'seo-tools': {
    mainTopic: 'Search Engine Optimization and Technical Audit',
    relatedEntities: ['Meta Tags', 'Robots.txt', 'Sitemap Validator', 'Core Web Vitals'],
    supportingKeywords: [
      'meta description generator', 'keyword density checker', 'robots.txt creator',
      'sitemap analysis', 'page speed analyzer', 'utm link builder'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['generate seo meta tags', 'validate xml sitemaps', 'check domain age'],
        questions: [
          'how to generate click-through optimized descriptions',
          'how to audit website tech stack',
          'best free page seo analyzer'
        ]
      }
    ],
    contentAngles: [
      'Content Marketing',
      'Technical SEO Auditing',
      'Growth Hacking'
    ],
    semanticVariations: [
      'seo page optimization',
      'technical search optimization',
      'metadata generators'
    ]
  },
  'email-tools': {
    mainTopic: 'Email Marketing Optimization and Deliverability',
    relatedEntities: ['SPF', 'DKIM', 'DMARC', 'Spam Filters', 'Email Signature'],
    supportingKeywords: [
      'subject line generator', 'spam score checker', 'email template builder',
      'header analysis', 'dns security records', 'mailto link generator'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['check email spam score', 'create email signature', 'generate spf record'],
        questions: [
          'how to improve email open rates',
          'generate dkim public key online',
          'create html emails free'
        ]
      }
    ],
    contentAngles: [
      'B2B Email Outreach',
      'Drip Campaign Design',
      'Newsletter Deliverability'
    ],
    semanticVariations: [
      'email deliverability setup',
      'email subject copywriting',
      'dns mail authentication'
    ]
  },
  'social-tools': {
    mainTopic: 'Social Media Management and Engagement',
    relatedEntities: ['Instagram Bio', 'Hashtags', 'WhatsApp Status', 'Meme Generator'],
    supportingKeywords: [
      'social bio link', 'hashtag generator', 'caption formatter',
      'whatsapp status generator', 'custom mobile landing page'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['generate instagram hashtags', 'create link in bio page', 'format caption line breaks'],
        questions: [
          'how to format instagram captions with spaces',
          'best bio link builders',
          'generate viral meme online'
        ]
      }
    ],
    contentAngles: [
      'Social Influencer Marketing',
      'Brand Engagement Campaigns',
      'Viral Content Formatting'
    ],
    semanticVariations: [
      'social marketing optimization',
      'instagram biography generator',
      'line break formatter'
    ]
  },
  'finance-tools': {
    mainTopic: 'SaaS Pricing & Unit Economics',
    relatedEntities: ['SaaS Pricing Calculator', 'Customer Lifetime Value', 'Customer Acquisition Cost', 'Monthly Recurring Revenue'],
    supportingKeywords: [
      'saas pricing optimizer', 'subscription pricing tiers', 'saas unit economics modeler',
      'ltv cac ratio calculator', 'churn rate impact on ltv', 'payback period projection'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['calculate saas pricing', 'optimize subscription pricing tiers', 'model saas unit economics'],
        questions: [
          'what is a good ltv cac ratio',
          'how to calculate customer lifetime value',
          'how to optimize subscription pricing'
        ]
      }
    ],
    contentAngles: [
      'SaaS Startups Financial Projections',
      'Subscription Business Growth Strategy',
      'Unit Economics Optimizations'
    ],
    semanticVariations: [
      'subscription software pricing calculator',
      'saas unit economics modeler online',
      'calculate subscription payback period'
    ]
  },
  'ai-tools': {
    mainTopic: 'AI Utilities and Client-Side Models',
    relatedEntities: ['AI Background Remover', 'Speech to Text', 'Text Summarizer', 'AI MCQ Generator'],
    supportingKeywords: [
      'client side artificial intelligence', 'local browser ai models',
      'privacy focused ai tools', 'free ai generators online'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['free ai speech to text', 'ai background remover online', 'ai summary tool'],
        questions: ['how to remove image background with ai', 'best free offline speech to text']
      }
    ],
    contentAngles: ['Privacy-first AI', 'Student Exam Prep', 'Developer Automation'],
    semanticVariations: ['local browser heuristic models', 'machine learning online tools']
  },
  'video-tools': {
    mainTopic: 'Web Video Compression and Conversion',
    relatedEntities: ['MP4', 'WebM', 'Video Trim', 'Thumbnail Generator'],
    supportingKeywords: [
      'reduce video size online', 'convert video to mp3', 'video resizer', 'free video clipper'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['trim video online free', 'extract mp3 from video', 'change video resolution'],
        questions: ['how to make a video smaller without quality loss', 'how to crop video online']
      }
    ],
    contentAngles: ['Content Creation', 'Social Media Shorts', 'Presentation Formatting'],
    semanticVariations: ['video processing browser engine', 'free video utility software']
  },
  'audio-tools': {
    mainTopic: 'Audio Manipulation and Speech Processing',
    relatedEntities: ['Audio Converter', 'Audio Trimmer', 'Audio Merger', 'AI Speech to Text'],
    supportingKeywords: [
      'convert mp3 to wav', 'join audio files online', 'speed up audio player', 'voice to text transcription'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['transcribe audio file free', 'merge audio clips online', 'trim mp3 ringtone'],
        questions: ['how to convert speech to text online', 'how to cut audio files free']
      }
    ],
    contentAngles: ['Podcast Production', 'Voice Notes Transcription', 'Music Ringtone Editing'],
    semanticVariations: ['audio compiler tools', 'sound editors online']
  },
  'text-tools': {
    mainTopic: 'Text Transformation and Character Auditing',
    relatedEntities: ['Word Counter', 'Case Converter', 'Markdown Editor', 'Text Diff'],
    supportingKeywords: [
      'word and character counter', 'line sorter alphabetical', 'remove duplicate lines', 'markdown to HTML conversion'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['compare two text files', 'convert uppercase to lowercase', 'clean text spacing'],
        questions: ['how to count words in text document', 'how to sort lines alphabetically online']
      }
    ],
    contentAngles: ['Copywriting Editing', 'Coding Syntax Sanitation', 'Academic Writing Auditing'],
    semanticVariations: ['string utilities web application', 'character counter tools']
  },
  'education-tools': {
    mainTopic: 'Educational Calculators and Mathematical Solvers',
    relatedEntities: ['Scientific Calculator', 'GPA Calculator', 'Percentage Calculator', 'Compound Interest'],
    supportingKeywords: [
      'convert units physics', 'compound interest calculator', 'percentage change finder', 'study scheduler tool'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['calculate percentage online', 'convert cgpa to percentage', 'solve physics dimensional formula'],
        questions: ['how compound interest is calculated monthly', 'best online scientific calculator']
      }
    ],
    contentAngles: ['Student Homework Helpers', 'Financial Literacy Learning', 'Physics Calculation Aides'],
    semanticVariations: ['academic solver tools', 'curriculum timeline planner']
  },
  'zip-tools': {
    mainTopic: 'File Archiving and Encryption',
    relatedEntities: ['Create ZIP', 'Extract ZIP', 'Password ZIP', 'Compression Level ZIP'],
    supportingKeywords: [
      'compress files into zip', 'extract zip files online', 'encrypted zip maker', 'free zip creator'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['create password protected zip', 'unzip files online free', 'reduce file folder size'],
        questions: ['how to password protect a zip folder', 'how to compress files without installing winrar']
      }
    ],
    contentAngles: ['File Sharing Security', 'Data Storage Compression', 'Batch File Organisation'],
    semanticVariations: ['archive packer tools', 'zip decompression online']
  },
  'govt-legal-tools': {
    mainTopic: 'Official Identity Resizing and Document Drafting',
    relatedEntities: ['Passport Photo Resizer', 'Signature Maker', 'Document Template Generator'],
    supportingKeywords: [
      'resize photo for govt application', 'rental agreement format PDF', 'make signature online', 'document layout builder'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['resize photo under 50kb', 'generate rental agreement online', 'draw digital signature free'],
        questions: ['how to size passport photo for aadhaar card', 'how to sign a document digitally']
      }
    ],
    contentAngles: ['Govt Application Preparations', 'Legal Agreement Templates', 'Identity Document Formats'],
    semanticVariations: ['official application form helpers', 'legal contract generators']
  },
  'internet-tools': {
    mainTopic: 'Network Diagnostics and Domain Auditing',
    relatedEntities: ['DNS Lookup', 'SSL Checker', 'IP Address Lookup', 'Ping Test'],
    supportingKeywords: [
      'domain ssl validity checker', 'query dns records mx txt', 'check current public ip', 'test network delay speed'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['lookup ip geolocation', 'verify ssl certificate expiration', 'check dns records online'],
        questions: ['how to run a ping test online', 'what is my user agent string']
      }
    ],
    contentAngles: ['Webmaster Diagnostics', 'Network Troubleshooting', 'Domain Management Auditing'],
    semanticVariations: ['dns nameserver queries', 'network path checkers']
  },
  'date-time-tools': {
    mainTopic: 'Temporal Operations and Interval Tracking',
    relatedEntities: ['Date Difference', 'Age Calculator', 'Working Days Calculator', 'Countdown Timer'],
    supportingKeywords: [
      'days between dates finder', 'calculate exact age in seconds', 'business day duration tracker', 'world clock timezones'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['count business days between dates', 'calculate days until target date', 'find timezone difference'],
        questions: ['how many working days in a month', 'what is my exact age today']
      }
    ],
    contentAngles: ['HR Business Day Planning', 'Event Goal Countdowns', 'Global Time Scheduling'],
    semanticVariations: ['temporal interval calculators', 'calendar duration solvers']
  },
  'ecommerce-tools': {
    mainTopic: 'E-commerce Asset Production and Billing Utilities',
    relatedEntities: ['GST Invoice Generator', 'Barcode Generator', 'White Background Adder', 'AI Shadow Adder'],
    supportingKeywords: [
      'generate tax invoice free', 'create barcode for retail', 'make product photos white background', 'add drop shadow products'
    ],
    userIntents: [
      {
        intent: 'transactional',
        keywords: ['generate gst invoice PDF', 'create barcode code128', 'enhance product photos online'],
        questions: ['how to generate barcode online', 'how to create professional invoices for customers']
      }
    ],
    contentAngles: ['Small Business Scaling', 'Product Catalogue Designing', 'Seller Invoice Compliance'],
    semanticVariations: ['merchant catalog enhancers', 'retail billing systems']
  }
};

export const generateSemanticKeywords = (cluster: string, baseKeywords: string[]): string[] => {
  const normalizedKey = normalizeCluster(cluster);
  const topicalData = topicalClusters[normalizedKey];
  if (!topicalData) return baseKeywords;
  
  const semanticKeywords: string[] = [...baseKeywords];
  
  // Add entity-based keywords
  topicalData.relatedEntities.forEach(entity => {
    semanticKeywords.push(`${entity} ${topicalData.mainTopic.toLowerCase()}`);
    semanticKeywords.push(`${topicalData.mainTopic} ${entity}`);
  });
  
  // Add supporting keywords
  semanticKeywords.push(...topicalData.supportingKeywords);
  
  // Add semantic variations
  semanticKeywords.push(...topicalData.semanticVariations);
  
  // Add intent-based keywords
  topicalData.userIntents.forEach(intent => {
    semanticKeywords.push(...intent.keywords);
    semanticKeywords.push(...intent.questions);
  });
  
  // Add content angle variations
  topicalData.contentAngles.forEach(angle => {
    semanticKeywords.push(`${topicalData.mainTopic} for ${angle}`);
    semanticKeywords.push(`${angle} ${topicalData.mainTopic}`);
  });
  
  return [...new Set(semanticKeywords)]; // Remove duplicates
};

export const generateStructuredData = (toolSlug: string, cluster: string) => {
  const normalizedKey = normalizeCluster(cluster);
  const entities = semanticEntities[normalizedKey] || [];
  const clusterData = topicalClusters[normalizedKey];
  
  const graphElements: any[] = [
    ...entities.map(entity => ({
      '@context': 'https://schema.org',
      '@type': entity.type,
      name: entity.name,
      description: entity.description,
      ...entity.properties
    }))
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': graphElements
  };
};
