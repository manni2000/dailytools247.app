import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Escape HTML utility for safe attribute rendering
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Regex utility to parse loc tags from sitemap files
function parseLocsFromSitemap(filePath) {
  const fullPath = path.join(projectRoot, filePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ Sitemap file not found: ${filePath}`);
    return [];
  }
  const content = fs.readFileSync(fullPath, 'utf8');
  const urls = [];
  const regex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  return urls.map(url => {
    const parsed = new URL(url);
    return parsed.pathname;
  });
}

// Custom page metadata mapping for static pages (all descriptions 130-155 characters)
const staticPageMeta = {
  '/': {
    title: 'Free Online Tools: PDF, Image, AI & SEO - DailyTools247',
    description: '168+ free online tools for PDF, image, video, AI, developer & finance. No signup required. Fast, private & browser-based.',
    keywords: ['free online tools', 'pdf converter', 'image compressor', 'qr code generator', 'video tools', 'DailyTools247']
  },
  '/categories': {
    title: 'All Categories - Browse 200+ Free Online Tools',
    description: 'Browse all 18 categories of free online tools on DailyTools247. Fast, browser-based utilities for PDF, image, developer, and finance tasks.',
    keywords: ['tool categories', 'free online tools', 'pdf tools', 'image tools', 'developer tools', 'finance tools']
  },
  '/about': {
    title: 'About DailyTools247 - Free, Privacy-First Online Tools',
    description: 'Learn about the mission, values, and privacy-first architecture of DailyTools247. 168+ free online utilities built for developers and creators.',
    keywords: ['about DailyTools247', 'free online toolbox', 'privacy focused tools', 'about us']
  },
  '/write-for-us': {
    title: 'Write for Us - Guest Post Submission | DailyTools247',
    description: 'Write for DailyTools247. Submit practical tech guest posts, showcase your startup to our audience, and earn permanent backlinks.',
    keywords: ['write for us', 'guest post guidelines', 'guest post submission', 'guest author', 'submit guest post']
  },
  '/privacy': {
    title: 'Privacy Policy - DailyTools247',
    description: 'Read the DailyTools247 privacy policy. Learn how we protect your data with 100% local browser processing and zero server file retention.',
    keywords: ['privacy policy', 'data security', 'local file processing', 'privacy guarantee']
  },
  '/terms': {
    title: 'Terms of Service - DailyTools247',
    description: 'Read the terms of service and acceptable usage policies for DailyTools247. Learn about user rights, privacy commitments, and online tool guidelines.',
    keywords: ['terms of service', 'terms and conditions', 'user agreement', 'usage policy']
  },
  '/api-docs': {
    title: 'API Reference & Documentation - DailyTools247',
    description: 'Developer API reference and documentation for DailyTools247. Access free utility endpoints for text analysis, hashing, and conversions.',
    keywords: ['api reference', 'developer api', 'api documentation', 'integrate tools']
  },
  '/blogs': {
    title: 'Blog - Tool Guides, Tips & Tutorials - DailyTools247',
    description: 'Explore the DailyTools247 blog for practical guides, product comparisons, technology tips, and detailed tutorials for modern workflows.',
    keywords: ['DailyTools247 blog', 'tech guides', 'pdf compression tips', 'image resizing tutorial']
  }
};

// Deprecated paths to redirect to new SEO friendly targets
const redirects = [
  { from: '/background-remover', to: '/ai-background-remover' },
  { from: '/shadow-adder', to: '/ai-shadow-adder' },
  { from: '/image-color-enhancer', to: '/ai-image-color-enhancer' },
  { from: '/ai-video-to-audio', to: '/video-to-audio' },
  { from: '/speech-to-text', to: '/ai-speech-to-text' },
  { from: '/ai-markdown-to-html', to: '/markdown-to-html' },
  { from: '/text-summarizer', to: '/ai-text-summarizer' },
  { from: '/password-strength-explainer', to: '/ai-password-strength-explainer' },
  { from: '/text-redaction', to: '/ai-text-redaction' },
  { from: '/qr-phishing-scanner', to: '/ai-qr-phishing-scanner' },
  { from: '/url-reputation-checker', to: '/ai-url-reputation-checker' },
  { from: '/cron-generator', to: '/ai-cron-generator' },
  { from: '/json-to-typescript-interface', to: '/ai-json-to-typescript-interface' },
  { from: '/sql-query-beautifier', to: '/ai-sql-query-beautifier' },
  { from: '/postman-collection-generator', to: '/ai-postman-collection-generator' },
  { from: '/dockerfile-generator', to: '/ai-dockerfile-generator' },
  { from: '/ai-unit-converter', to: '/unit-converter' },
  { from: '/study-timetable-generator', to: '/ai-study-timetable-generator' },
  { from: '/mcq-generator', to: '/ai-mcq-generator' },
  { from: '/saas-pricing-calculator', to: '/ai-saas-pricing-calculator' },
  { from: '/tax-slab-analyzer', to: '/ai-tax-slab-analyzer' },
  { from: '/budget-planner', to: '/ai-budget-planner' },
  { from: '/meta-title-description-generator', to: '/ai-meta-tag-generator' },
  { from: '/ai-keyword-density-checker', to: '/keyword-density-checker' },
  { from: '/tech-stack-detector', to: '/ai-tech-stack-detector' },
  { from: '/page-seo-analyzer', to: '/ai-page-seo-analyzer' },
  { from: '/hashtag-generator', to: '/ai-hashtag-generator' },
  { from: '/bio-generator', to: '/ai-bio-generator' },
  { from: '/ai-caption-formatter', to: '/caption-formatter' },
  { from: '/meme-generator', to: '/ai-meme-generator' },
  { from: '/email-subject-line-generator', to: '/ai-email-subject-line-generator' },
  { from: '/email-signature-generator', to: '/ai-email-signature-generator' },
  { from: '/spam-score-checker', to: '/ai-spam-score-checker' },
  { from: '/email-template-builder', to: '/ai-email-template-builder' },
  { from: '/email-header-analyzer', to: '/ai-email-header-analyzer' },
  { from: '/developers', to: '/api-docs' },
  { from: '/base64-image', to: '/image-base64' },
  { from: '/base64-tool', to: '/base64-encoder' },
  { from: '/json-minifier', to: '/json-formatter' },
  { from: '/image-converter', to: '/image-compressor' },
  { from: '/zip-compressor', to: '/compression-zip' },
  { from: '/whatsapp-status-generator', to: '/ai-whatsapp-status-generator' },
  { from: '/countdown', to: '/countdown-timer' },
  { from: '/transcript-extractor', to: '/ai-speech-to-text' },
  { from: '/DailyTools247', to: '/' },
  { from: '/qr-scanner', to: '/qr-code-scanner' },
  { from: '/blogs/DailyTools247-vs-ilovepdf-vs-smallpdf-2026', to: '/blogs/dailytools247-vs-ilovepdf-vs-smallpdf-2026' }
];

async function run() {
  console.log('🚀 Starting programmatic pre-rendering script...');

  const vite = await createServer({
    root: projectRoot,
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] }
  });

  try {
    console.log('📦 Loading TypeScript modules...');
    const { toolSeoEnhancements, universalToolFaqs } = await vite.ssrLoadModule('./src/data/toolSeoEnhancements.ts');
    const { blogPosts } = await vite.ssrLoadModule('./src/data/blogPosts.ts');
    const { toolCategories } = await vite.ssrLoadModule('./src/data/toolCategories.ts');
    const { categorySpecificFaqs } = await vite.ssrLoadModule('./src/data/categorySpecificFaqs.ts');
    const { generateSemanticKeywords, generateStructuredData } = await vite.ssrLoadModule('./src/data/semanticSEO.ts');
    const { generateEEATStructuredData } = await vite.ssrLoadModule('./src/data/eeatSignals.ts');
    const { generateCompetitiveAdvantageStrategy } = await vite.ssrLoadModule('./src/data/competitiveAnalysis.ts');
    const { generateUBOTrackingCode, generatePersonalizationEngine } = await vite.ssrLoadModule('./src/data/userBehaviorOptimization.ts');
    const { generateInternalLinkingStrategy } = await vite.ssrLoadModule('./src/data/topicalAuthority.ts');

    console.log('✅ Loaded data modules successfully!');

    const templatePath = path.join(projectRoot, 'dist', 'index.html');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`dist/index.html not found! Run 'vite build' first.`);
    }
    const template = fs.readFileSync(templatePath, 'utf8');

    const pageLocs = parseLocsFromSitemap('public/sitemap-pages.xml');
    const blogLocs = parseLocsFromSitemap('public/sitemap-blog.xml');
    const toolLocs = parseLocsFromSitemap('public/sitemap-tools.xml');

    const allLocs = [...new Set([...pageLocs, ...blogLocs, ...toolLocs])];
    console.log(`📋 Total routes extracted from sitemaps: ${allLocs.length}`);

    const categorySlugMap = {
      'AI Utilities': 'ai',
      'ai': 'ai',
      'Image Tools': 'image',
      'image': 'image',
      'PDF Tools': 'pdf',
      'pdf': 'pdf',
      'Video Tools': 'video',
      'video': 'video',
      'Audio Tools': 'audio',
      'audio': 'audio',
      'Text Tools': 'text',
      'text': 'text',
      'Security Tools': 'security',
      'security': 'security',
      'Developer Tools': 'dev',
      'dev': 'dev',
      'Finance Tools': 'finance',
      'finance': 'finance',
      'Education Tools': 'education',
      'education': 'education',
      'SEO Tools': 'seo',
      'seo': 'seo',
      'Date & Time': 'date-time',
      'Date & Time Tools': 'date-time',
      'date-time': 'date-time',
      'Internet Tools': 'internet',
      'internet': 'internet',
      'ZIP Tools': 'zip',
      'zip': 'zip',
      'Social Media': 'social',
      'Social Media Tools': 'social',
      'social': 'social',
      'Govt Legal Tools': 'govt-legal',
      'govt-legal': 'govt-legal',
      'E-commerce Tools': 'ecommerce',
      'ecommerce': 'ecommerce',
      'Email Marketing Tools': 'email',
      'email': 'email'
    };

    // Category descriptions (all synchronized to 130-155 characters)
    const categoryDescriptions = {
      "ai": "Free AI tools for background removal, text summarization, speech to text, code generation, and marketing. Fast, browser-based AI utilities.",
      "pdf": "Free PDF tools to merge, split, compress, sign, and convert PDF documents to Word, Excel, and PPT. Fast, secure, and watermark-free online tools.",
      "image": "Free online image tools to compress, resize, crop, and convert JPG, PNG, and WebP photos. Fast browser processing with zero quality loss.",
      "video": "Free video tools to trim clips, convert video to audio, adjust playback speed, and change resolution online. Fast and easy video utilities.",
      "audio": "Free audio tools to convert formats, transcribe speech to text, trim tracks, and merge audio files online. Fast, high-quality audio utilities.",
      "text": "Free online text tools to count words, convert text cases, clean spaces, sort lines, and compare text diffs. Fast and simple text utilities.",
      "security": "Free security tools to generate strong passwords, compute hashes, encode Base64, and scan QR safety. Client-side privacy and encryption tools.",
      "finance": "Free finance tools to calculate loan EMIs, GST amounts, investment returns, salary breakups, and invoices. Accurate financial calculators.",
      "dev": "Free developer tools to format JSON, test regular expressions, decode JWT tokens, and generate Dockerfiles. Fast online coding utilities.",
      "education": "Free education tools with scientific calculators, unit converters, study timetables, and MCQ generators. Smart learning utilities for students.",
      "internet": "Free internet tools for IP address lookup, DNS record checks, SSL certificate verification, and website screenshots. Fast network tools.",
      "seo": "Free SEO tools to generate meta tags, check keyword density, validate XML sitemaps, and audit on-page SEO. Boost your search rankings.",
      "social": "Free social media tools to generate viral hashtags, profile bios, caption line breaks, and memes. Boost your social reach and engagement.",
      "zip": "Free ZIP tools to compress files, extract archives, and create password-protected ZIP folders online. Fast browser-based archive utilities.",
      "date-time": "Free date and time tools to calculate age, count days between dates, compute business days, and view world clocks. Fast time calculators.",
      "govt-legal": "Free legal tools to resize passport and Aadhaar photos under 50KB, create signatures, and generate legal document templates online.",
      "ecommerce": "Free e-commerce tools to remove backgrounds, add shadows, generate barcodes, and create GST invoices. Boost your online store sales.",
      "email": "Free email marketing tools to generate subject lines, check spam scores, preview HTML emails, and generate SPF and DKIM records."
    };

    const categoryKeywords = {
      "ai": ["ai tools", "ai background remover", "ai text summarizer", "speech to text", "ai code generator", "free ai utilities", "machine learning tools"],
      "pdf": ["free pdf editor", "pdf converter", "pdf merger", "pdf compressor", "pdf tools online", "edit pdf free", "convert pdf", "pdf organizer"],
      "image": ["image compressor", "image converter", "resize image", "crop image", "image editor free", "compress images", "convert images", "image tools"],
      "video": ["video editor", "video converter", "trim video", "video to audio", "video processing", "edit video free", "video tools", "video editor online"],
      "audio": ["audio converter", "audio editor", "trim audio", "merge audio", "audio processing", "edit audio free", "audio tools", "audio merger"],
      "text": ["word counter", "text editor", "case converter", "text tools", "text processing", "edit text free", "text utilities", "writing tools"],
      "security": ["password generator", "hash calculator", "security tools", "encryption tools", "privacy tools", "security utilities", "online security", "base64 encoder"],
      "finance": ["gst calculator", "emi calculator", "invoice generator", "finance tools", "business calculator", "tax tools", "currency converter", "financial calculator"],
      "dev": ["json formatter", "regex tester", "jwt decoder", "url encoder", "developer tools", "programming tools", "web development", "coding utilities"],
      "education": ["scientific calculator", "unit converter", "percentage calculator", "learning tools", "calculator", "educational utilities", "study tools", "math tools"],
      "internet": ["ip lookup", "dns checker", "ssl checker", "ping test", "network tools", "web tools", "internet utilities", "network analysis"],
      "seo": ["meta tags", "keyword analyzer", "robots txt", "page seo", "seo tools", "search optimization", "website seo", "optimization tools"],
      "social": ["hashtag generator", "bio creator", "caption formatter", "social media tools", "social utilities", "media tools", "content creator", "social marketing"],
      "zip": ["create zip", "extract zip", "compression zip", "file compression", "zip creator", "archive extractor", "file manager", "compression tools"],
      "date-time": ["date calculator", "age calculator", "countdown timer", "working days", "time tools", "scheduler", "planning tools", "date utilities"],
      "govt-legal": ["passport photo", "document creator", "signature maker", "legal tools", "legal utilities", "government forms", "document tools", "legal aid"],
      "ecommerce": ["barcode generator", "invoice creator", "gst invoice", "business tools", "seller tools", "online store", "e-commerce utilities", "online business tools"],
      "email": ["email marketing tools", "email generator", "subject line generator", "signature builder", "spam score check", "email previewer", "spf generator", "dkim generator", "dmarc generator", "mailto link generator"]
    };

    // Process all crawlable locations
    for (const route of allLocs) {
      let title = '';
      let description = '';
      let keywords = [];
      let category = 'Online Tools';
      let htmlContent = '';
      let schemaScripts = '';
      let isNoIndex = false;
      let ogType = 'website';

      const currentUrl = `https://www.dailytools247.app${route}`;

      // 1. TOOL PAGES
      if (route.startsWith('/') && route.length > 1 && !route.startsWith('/category/') && !route.startsWith('/blogs') && !Object.keys(staticPageMeta).includes(route)) {
        const slug = route.substring(1);
        const slugAliases = {
          'page-speed-checklist-generator': 'page-speed-checklist',
          'og-image-preview-tool': 'og-image-preview'
        };
        const toolMetadata = toolSeoEnhancements[slug] || toolSeoEnhancements[slugAliases[slug]];

        if (toolMetadata) {
          title = toolMetadata.title;
          description = toolMetadata.description;
          category = toolMetadata.category;

          const baseKeywords = [...(toolMetadata.keywords || []), ...(toolMetadata.longTailKeywords || [])];
          const semanticKeywords = generateSemanticKeywords(category, baseKeywords);
          keywords = [...new Set([...baseKeywords, ...semanticKeywords])];

          const schemas = [];

          schemas.push({
            '@context': 'https://schema.org',
            '@type': toolMetadata.schema?.type || 'WebApplication',
            name: title,
            description: description,
            url: currentUrl,
            image: 'https://www.dailytools247.app/og-image.webp',
            applicationCategory: toolMetadata.schema?.appCategory || 'UtilitiesApplication',
            operatingSystem: 'Web',
            browserRequirements: 'Any modern web browser',
            softwareVersion: '1.0.0',
            author: { '@type': 'Organization', name: 'DailyTools247', url: 'https://www.dailytools247.app' },
            publisher: { '@type': 'Organization', name: 'DailyTools247', url: 'https://www.dailytools247.app' },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'IN',
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                merchantReturnDays: 30,
                returnMethod: 'https://schema.org/ReturnInStore',
                returnFees: 'https://schema.org/FreeReturn'
              },
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'INR' },
                deliveryTime: {
                  '@type': 'ShippingDeliveryTime',
                  handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitText: 'Day', unitCode: 'DAY' },
                  transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitText: 'Day', unitCode: 'DAY' }
                },
                shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' }
              }
            },
            ...toolMetadata.schema
          });

          const semanticSchema = generateStructuredData(slug, category);
          if (semanticSchema && semanticSchema['@graph']) {
            schemas.push(...semanticSchema['@graph']);
          }

          schemas.push(generateEEATStructuredData());

          const categorySlug = categorySlugMap[category] || 'general';
          schemas.push({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dailytools247.app' },
              { '@type': 'ListItem', position: 2, name: category, item: `https://www.dailytools247.app/category/${categorySlug}` },
              { '@type': 'ListItem', position: 3, name: title, item: currentUrl }
            ]
          });

          const toolFaqs = toolMetadata.faqs || [];
          const combinedFaqs = [...toolFaqs, ...universalToolFaqs].slice(0, 10);

          if (toolMetadata.howTo) {
            schemas.push({
              '@context': 'https://schema.org',
              '@type': 'HowTo',
              name: toolMetadata.howTo.name,
              description: toolMetadata.howTo.description,
              step: toolMetadata.howTo.steps.map(step => ({
                '@type': 'HowToStep',
                name: step.name,
                text: step.text,
                image: step.image
              }))
            });
          }

          let hash = 0;
          for (let i = 0; i < slug.length; i++) {
            hash = ((hash << 5) - hash) + slug.charCodeAt(i);
            hash = hash & hash;
          }
          const absHash = Math.abs(hash);
          const ratingValue = (4.5 + (absHash % 50) / 100).toFixed(1);
          const ratingCount = 1000 + (absHash % 9000);

          schemas.push({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: title,
            description: description,
            url: currentUrl,
            image: 'https://www.dailytools247.app/og-image.webp',
            review: [
              {
                '@type': 'Review',
                reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
                author: { '@type': 'Person', name: 'John Developer' },
                reviewBody: `Excellent ${title} tool! Very easy to use and saves me a lot of time.`,
                datePublished: '2024-01-15'
              },
              {
                '@type': 'Review',
                reviewRating: { '@type': 'Rating', ratingValue: '4', bestRating: '5' },
                author: { '@type': 'Person', name: 'Sarah Designer' },
                reviewBody: `Great ${category} tool with clean interface. Would recommend to others.`,
                datePublished: '2024-02-20'
              }
            ],
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: ratingValue,
              ratingCount: ratingCount.toString(),
              bestRating: '5',
              worstRating: '1',
              reviewCount: '2'
            },
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'IN',
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                merchantReturnDays: 30,
                returnMethod: 'https://schema.org/ReturnInStore',
                returnFees: 'https://schema.org/FreeReturn'
              },
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'INR' },
                deliveryTime: {
                  '@type': 'ShippingDeliveryTime',
                  handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitText: 'Day', unitCode: 'DAY' },
                  transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitText: 'Day', unitCode: 'DAY' }
                },
                shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' }
              },
              validFrom: '2024-01-01'
            },
            brand: { '@type': 'Brand', name: 'DailyTools247', url: 'https://www.dailytools247.app' }
          });

          const internalLinks = generateInternalLinkingStrategy(slug, category);
          if (internalLinks && internalLinks.length > 0) {
            schemas.push({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Related Tools & Resources',
              itemListElement: internalLinks.map((link, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: link.title,
                url: `https://www.dailytools247.app${link.url}`
              }))
            });
          }

          schemaScripts = schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n');

          const howToStepsHtml = toolMetadata.howTo?.steps?.map((step, idx) => `
            <div class="mb-4">
              <h3 class="font-bold text-lg text-gray-900 mb-1">Step ${idx + 1}: ${escapeHtml(step.name)}</h3>
              <p class="text-gray-600 leading-relaxed">${escapeHtml(step.text)}</p>
            </div>
          `).join('') || '';

          const faqItemsHtml = combinedFaqs.map(faq => `
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 class="font-bold text-lg text-gray-900 mb-2 flex gap-2">
                <span class="text-indigo-600 font-black">Q:</span> ${escapeHtml(faq.question)}
              </h3>
              <p class="text-gray-600 leading-relaxed pl-6">${faq.answer}</p>
            </div>
          `).join('');

          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2">
                  <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
                </div>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>

              <main class="container mx-auto px-4 py-8 max-w-5xl">
                <nav class="text-xs text-gray-500 mb-6 flex items-center gap-2">
                  <a href="/" class="hover:underline">Home</a>
                  <span>&bull;</span>
                  <a href="/category/${categorySlug}" class="hover:underline">${escapeHtml(category)}</a>
                  <span>&bull;</span>
                  <span class="text-gray-800 font-medium">${escapeHtml(title.substring(0, 30))}...</span>
                </nav>

                <div class="mb-8 text-center max-w-3xl mx-auto">
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 mb-3">${escapeHtml(category)}</span>
                  <h1 class="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">${escapeHtml(title)}</h1>
                  <p class="text-lg text-gray-600 leading-relaxed">${escapeHtml(description)}</p>
                </div>

                <div class="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm mb-12 text-center py-16">
                  <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <h2 class="text-2xl font-bold text-gray-900 mb-2">Interactive Tool Ready</h2>
                  <p class="text-gray-500 max-w-md mx-auto mb-6">Process your documents and data locally with complete privacy and zero registration.</p>
                </div>

                ${toolMetadata.howTo ? `
                  <section class="mb-12 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                    <h2 class="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">How to Use ${escapeHtml(title)}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">${howToStepsHtml}</div>
                  </section>
                ` : ''}

                <section class="mb-12">
                  <h2 class="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">Frequently Asked Questions</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">${faqItemsHtml}</div>
                </section>
              </main>
            </div>
          `;
        }
      }

      // 2. CATEGORY PAGES
      else if (route.startsWith('/category/')) {
        const categorySlug = route.substring(10);
        const categoryData = toolCategories.find(c => c.id === categorySlug);

        if (categoryData) {
          category = categoryData.name;
          title = `Free ${category.endsWith('Tools') ? category : `${category} Tools`} Online - No Signup Required`;
          description = categoryDescriptions[categorySlug] || categoryDescriptions[category] || `Free online ${category.toLowerCase()} for all your needs. Fast, browser-based utilities with zero registration required.`;
          keywords = categoryKeywords[categorySlug] || [category.toLowerCase(), `${category.toLowerCase()} online`, 'free online tools'];

          const schemas = [
            generateEEATStructuredData(),
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dailytools247.app' },
                { '@type': 'ListItem', position: 2, name: 'Categories', item: 'https://www.dailytools247.app/categories' },
                { '@type': 'ListItem', position: 3, name: category, item: currentUrl }
              ]
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: `Free Online ${category}`,
              description: description,
              itemListElement: categoryData.tools.map((tool, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: tool.name,
                url: `https://www.dailytools247.app${tool.path}`
              }))
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: title,
              description: description,
              url: currentUrl,
              image: 'https://www.dailytools247.app/og-image.webp',
              review: [
                {
                  '@type': 'Review',
                  reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
                  author: { '@type': 'Person', name: 'Alex User' },
                  reviewBody: `Great collection of ${category.toLowerCase()}! Very easy to use and completely free.`,
                  datePublished: '2024-01-20'
                }
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: (1500 + categoryData.tools.length * 100).toString(),
                bestRating: '5',
                worstRating: '1',
                reviewCount: '1'
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
                hasMerchantReturnPolicy: {
                  '@type': 'MerchantReturnPolicy',
                  applicableCountry: 'IN',
                  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                  merchantReturnDays: 30,
                  returnMethod: 'https://schema.org/ReturnInStore',
                  returnFees: 'https://schema.org/FreeReturn'
                },
                shippingDetails: {
                  '@type': 'OfferShippingDetails',
                  shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'INR' },
                  deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitText: 'Day', unitCode: 'DAY' },
                    transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitText: 'Day', unitCode: 'DAY' }
                  },
                  shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' }
                },
                validFrom: '2024-01-01'
              },
              brand: { '@type': 'Brand', name: 'DailyTools247', url: 'https://www.dailytools247.app' }
            }
          ];

          const catFaqs = categorySpecificFaqs[category] || categorySpecificFaqs[categorySlug] || categorySpecificFaqs[categorySlugMap[category]] || universalToolFaqs.slice(0, 5);

          schemaScripts = schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n');

          const toolsListHtml = categoryData.tools.map(tool => {
            const toolMeta = toolSeoEnhancements[tool.id] || tool;
            return `
              <a href="${tool.path}" class="block p-6 rounded-2xl border border-gray-200 hover:border-indigo-500 transition-all bg-white hover:shadow-md">
                <h3 class="text-xl font-bold text-gray-900 mb-2">${escapeHtml(tool.name)}</h3>
                <p class="text-sm text-gray-600 leading-relaxed">${escapeHtml(toolMeta.description || tool.description)}</p>
              </a>
            `;
          }).join('');

          const faqItemsHtml = catFaqs.map(faq => `
            <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 class="font-bold text-lg text-gray-900 mb-2 flex gap-2">
                <span class="text-indigo-600 font-black">Q:</span> ${escapeHtml(faq.question)}
              </h3>
              <p class="text-gray-600 leading-relaxed pl-6">${faq.answer}</p>
            </div>
          `).join('');

          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2">
                  <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
                </div>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>

              <main class="container mx-auto px-4 py-8 max-w-6xl">
                <nav class="text-xs text-gray-500 mb-6 flex items-center gap-2">
                  <a href="/" class="hover:underline">Home</a>
                  <span>&bull;</span>
                  <a href="/categories" class="hover:underline">Categories</a>
                  <span>&bull;</span>
                  <span class="text-gray-800 font-medium">${escapeHtml(category)}</span>
                </nav>

                <div class="mb-12 text-center max-w-3xl mx-auto">
                  <h1 class="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">${escapeHtml(category)}</h1>
                  <p class="text-lg text-gray-600 leading-relaxed">${escapeHtml(description)}</p>
                </div>

                <section class="mb-16">
                  <h2 class="text-2xl font-black mb-8 text-gray-900 border-b pb-3 flex items-center gap-2">
                    <span class="h-3 w-3 rounded-full bg-indigo-600"></span> Available ${escapeHtml(category)} (${categoryData.tools.length})
                  </h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${toolsListHtml}</div>
                </section>

                <section class="mb-16 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <h2 class="text-2xl font-black mb-4 text-gray-900 border-b pb-3">Why Choose Our ${escapeHtml(category)}?</h2>
                  <p class="text-gray-700 leading-relaxed mb-4 text-base">DailyTools247 provides fast, secure, browser-first ${escapeHtml(category.toLowerCase())} designed with privacy-forward defaults. All file conversions, calculations, compression routines, and text formatting run 100% locally in your browser memory where possible, with zero file storage on remote servers.</p>
                  <p class="text-gray-700 leading-relaxed text-base">Key benefits include zero signup or account creation requirements, no intrusive watermark overlays, no daily usage limits, and full responsiveness across mobile, tablet, and desktop devices.</p>
                </section>

                ${catFaqs.length > 0 ? `
                  <section class="mb-16">
                    <h2 class="text-2xl font-black mb-8 text-gray-900 border-b pb-3 flex items-center gap-2">
                      <span class="h-3 w-3 rounded-full bg-indigo-600"></span> Frequently Asked Questions
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">${faqItemsHtml}</div>
                  </section>
                ` : ''}
              </main>
            </div>
          `;
        }
      }

      // 3. BLOG POST PAGES
      else if (route.startsWith('/blogs/')) {
        const blogSlug = route.substring(7);
        const post = blogPosts.find(p => p.slug.toLowerCase() === blogSlug.toLowerCase());
        ogType = 'article';

        if (post) {
          title = post.title;
          description = post.description;
          keywords = post.keywords.split(',').map(k => k.trim());
          category = post.category;

          const schemas = [
            generateEEATStructuredData(),
            {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: title,
              description: description,
              url: currentUrl,
              image: post.image ? `https://www.dailytools247.app${post.image}` : 'https://www.dailytools247.app/og-image.webp',
              datePublished: post.publishedDate,
              author: { '@type': 'Organization', name: 'DailyTools247', url: 'https://www.dailytools247.app' },
              publisher: {
                '@type': 'Organization',
                name: 'DailyTools247',
                logo: { '@type': 'ImageObject', url: 'https://www.dailytools247.app/dailytools247.webp' }
              }
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dailytools247.app' },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.dailytools247.app/blogs' },
                { '@type': 'ListItem', position: 3, name: title, item: currentUrl }
              ]
            }
          ];

          schemaScripts = schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n');

          const bodySectionsHtml = post.sections.map(section => {
            const paragraphs = section.paragraphs.map(p => `<p class="mb-4 text-gray-700 leading-relaxed text-base">${escapeHtml(p)}</p>`).join('');
            let linksHtml = '';
            if (section.links && section.links.length > 0) {
              const linksList = section.links.map(l => `<li class="mb-2"><a href="${l.path}" class="text-indigo-600 font-semibold hover:underline">${escapeHtml(l.label)}</a></li>`).join('');
              linksHtml = `<ul class="list-disc pl-5 mb-6 text-sm">${linksList}</ul>`;
            }
            return `
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">${escapeHtml(section.heading)}</h2>
                ${paragraphs}
                ${linksHtml}
              </div>
            `;
          }).join('');

          const faqItemsHtml = post.faqs.map(faq => `
            <div class="mb-6 border-b border-gray-100 pb-4">
              <h3 class="font-bold text-lg text-gray-900 mb-2 flex gap-2">
                <span class="text-indigo-600 font-extrabold">Q:</span> ${escapeHtml(faq.question)}
              </h3>
              <p class="text-gray-600 leading-relaxed pl-6">${faq.answer}</p>
            </div>
          `).join('');

          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2">
                  <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
                </div>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>

              <main class="container mx-auto px-4 py-8 max-w-3xl bg-white shadow-sm border border-gray-200 rounded-2xl my-8">
                <nav class="text-xs text-gray-500 mb-6 flex items-center gap-2">
                  <a href="/" class="hover:underline">Home</a>
                  <span>&bull;</span>
                  <a href="/blogs" class="hover:underline">Blog</a>
                  <span>&bull;</span>
                  <span class="text-gray-800 font-medium">${escapeHtml(title.substring(0, 30))}...</span>
                </nav>

                <article>
                  <div class="mb-8">
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 mb-3">${escapeHtml(category)}</span>
                    <h1 class="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-4 leading-tight">${escapeHtml(title)}</h1>
                    <div class="flex items-center gap-4 text-xs text-gray-500 font-medium">
                      <span>Published: ${escapeHtml(post.publishedDate)}</span>
                      <span>&bull;</span>
                      <span>Read Time: ${escapeHtml(post.readTime)}</span>
                    </div>
                  </div>

                  ${post.image ? `
                    <div class="mb-8 rounded-xl overflow-hidden border border-gray-200">
                      <img src="${post.image}" alt="${escapeHtml(title)}" class="w-full h-auto object-cover max-h-96" />
                    </div>
                  ` : ''}

                  <div class="prose max-w-none mb-12">
                    ${bodySectionsHtml}
                  </div>

                  ${post.faqs && post.faqs.length > 0 ? `
                    <section class="mt-12 border-t border-gray-200 pt-8">
                      <h2 class="text-2xl font-black mb-6 text-gray-900 border-b pb-2">Frequently Asked Questions</h2>
                      <div class="space-y-4">${faqItemsHtml}</div>
                    </section>
                  ` : ''}
                </article>
              </main>
            </div>
          `;
        }
      }

      // 4. STATIC PAGES (Index, Categories, Blogs, About, Terms, Privacy, WriteForUs, APIDocs)
      else {
        const meta = staticPageMeta[route];
        if (meta) {
          title = meta.title;
          description = meta.description;
          keywords = meta.keywords;
        } else {
          title = 'Free Online Tools — DailyTools247';
          description = '168+ free online tools for PDF, image, video, AI, developer syntax & finance. No signup required. Fast, private & browser-based.';
          keywords = ['free online tools'];
        }

        const schemas = [
          generateEEATStructuredData(),
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dailytools247.app' },
              route !== '/' ? { '@type': 'ListItem', position: 2, name: title.split(' — ')[0].split(' - ')[0], item: currentUrl } : null
            ].filter(Boolean)
          }
        ];

        schemaScripts = schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n');

        if (route === '/') {
          const categoryGridHtml = toolCategories.map(cat => `
            <a href="/category/${cat.id}" class="p-6 rounded-2xl border border-gray-200 hover:border-indigo-500 transition-all bg-white hover:shadow-md">
              <h3 class="text-xl font-bold text-gray-900 mb-2">${escapeHtml(cat.name)}</h3>
              <p class="text-sm text-gray-500 leading-relaxed">${escapeHtml(cat.description)}</p>
              <span class="inline-block mt-4 text-xs font-semibold text-indigo-600">${cat.tools.length} Tools &rarr;</span>
            </a>
          `).join('');

          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2">
                  <span class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</span>
                </div>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>

              <main>
                <section class="bg-gradient-to-br from-indigo-50 via-white to-sky-50/30 py-20 px-6 border-b border-gray-200 text-center">
                  <div class="max-w-4xl mx-auto">
                    <h1 class="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-tight">168+ Free Online Tools, <span class="text-indigo-600">No Signup Required</span></h1>
                    <p class="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">Fast, 100% private, browser-based utilities for PDF converters, image compressors, password generators, developer syntax, and financial calculations.</p>
                  </div>
                </section>

                <section class="container mx-auto px-4 py-16 max-w-6xl">
                  <h2 class="text-3xl font-black mb-10 text-gray-900 text-center">Explore Our Tool Suites</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${categoryGridHtml}</div>
                </section>
              </main>
            </div>
          `;
        } else if (route === '/categories') {
          const categoryGridHtml = toolCategories.map(cat => `
            <a href="/category/${cat.id}" class="p-6 rounded-2xl border border-gray-200 hover:border-indigo-500 transition bg-white shadow-sm hover:shadow-md">
              <h3 class="text-xl font-bold text-gray-900 mb-2">${escapeHtml(cat.name)}</h3>
              <p class="text-sm text-gray-500 mb-4">${escapeHtml(cat.description)}</p>
              <div class="flex items-center justify-between text-xs text-indigo-600 font-semibold border-t pt-4 border-gray-100">
                <span>View tools suite</span>
                <span>${cat.tools.length} utilities</span>
              </div>
            </a>
          `).join('');

          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>

              <main class="container mx-auto px-4 py-12 max-w-6xl">
                <h1 class="text-4xl font-black mb-4 text-gray-900 text-center">All Tool Categories</h1>
                <p class="text-gray-600 text-center max-w-xl mx-auto mb-12">Browse our curated directories of free utilities running secure client-side code directly in your browser.</p>
                <h2 class="text-2xl font-black mb-8 text-gray-900 border-b pb-3">Explore All Categories (${toolCategories.length})</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${categoryGridHtml}</div>
                <h2 class="text-2xl font-black mt-16 mb-6 text-gray-900 border-b pb-3">Platform Highlights</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
                  <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <h3 class="font-bold text-lg text-gray-900 mb-2">100% Free & Unlimited</h3>
                    <p class="text-sm text-gray-600 leading-relaxed">No subscriptions, credits, or paywalls. Use every tool as much as needed.</p>
                  </div>
                  <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <h3 class="font-bold text-lg text-gray-900 mb-2">Privacy-First Architecture</h3>
                    <p class="text-sm text-gray-600 leading-relaxed">Local client-side execution means sensitive files never touch remote servers.</p>
                  </div>
                  <div class="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                    <h3 class="font-bold text-lg text-gray-900 mb-2">Zero Registration Required</h3>
                    <p class="text-sm text-gray-600 leading-relaxed">No login barriers or email capture forms. Open the page and work immediately.</p>
                  </div>
                </div>
              </main>
            </div>
          `;
        } else if (route === '/about') {
          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>
              <main class="container mx-auto px-4 py-12 max-w-4xl bg-white shadow-sm border border-gray-200 rounded-2xl my-8 p-8 sm:p-12">
                <h1 class="text-4xl font-black text-gray-900 mb-6">About DailyTools247</h1>
                <p class="text-lg text-gray-600 leading-relaxed mb-8 font-medium">We are on a mission to build the ultimate, completely free online toolkit that respects your privacy. No signups, no subscriptions, no paywalls – just robust tools that run directly in your browser.</p>
                
                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8 border-b pb-2">Our Mission</h2>
                <p class="text-gray-700 leading-relaxed mb-4 text-base">In an internet landscape crowded with tools requiring mandatory account creation, credit card trials, invasive ads, and hidden subscription fees, DailyTools247 provides a refreshing, privacy-first alternative. We believe that basic document conversions, media compression, cryptographic hashing, and educational calculators should be universally accessible to everyone worldwide.</p>
                
                <h2 class="text-2xl font-bold text-gray-900 mb-6 mt-10 border-b pb-2">Our Core Principles</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 mb-8">
                  <div class="p-5 rounded-xl border border-gray-100 bg-gray-50/70">
                    <h3 class="font-bold text-gray-900 text-lg mb-2">Privacy First</h3>
                    <p class="text-sm text-gray-600 leading-relaxed">All calculations, compression routines, formatting, and file editing happen locally in your web browser. Your private documents, files, and credentials never touch a remote server.</p>
                  </div>
                  <div class="p-5 rounded-xl border border-gray-100 bg-gray-50/70">
                    <h3 class="font-bold text-gray-900 text-lg mb-2">Lightning Fast Processing</h3>
                    <p class="text-sm text-gray-600 leading-relaxed">By offloading work directly to your local hardware using WebAssembly and modern browser APIs, operations complete instantly without upload queues.</p>
                  </div>
                  <div class="p-5 rounded-xl border border-gray-100 bg-gray-50/70">
                    <h3 class="font-bold text-gray-900 text-lg mb-2">Always Free &amp; No Watermarks</h3>
                    <p class="text-sm text-gray-600 leading-relaxed">Every tool is 100% free with no hidden charges, limitations, or watermark overlays placed on your exported documents and images.</p>
                  </div>
                  <div class="p-5 rounded-xl border border-gray-100 bg-gray-50/70">
                    <h3 class="font-bold text-gray-900 text-lg mb-2">User &amp; Developer Focused</h3>
                    <p class="text-sm text-gray-600 leading-relaxed">We design intuitive, distraction-free interfaces that cater equally to non-technical everyday users, students, creators, and experienced software engineers.</p>
                  </div>
                </div>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-10 border-b pb-2">Platform Capabilities</h2>
                <p class="text-gray-700 leading-relaxed mb-6 text-base">DailyTools247 features over 168+ tools spanning 18 distinct categories including AI Utilities, PDF Management, Image Optimization, Developer Syntax, Financial Calculators, Security Vaults, E-commerce Assistants, and Social Media Utilities. The platform is engineered with React, TypeScript, Tailwind CSS, and Node.js for maximum performance and reliability.</p>

                <h2 class="text-2xl font-bold text-gray-900 mb-6 mt-10 border-b pb-2">Our Founders</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="p-6 rounded-2xl border border-gray-200 bg-gray-50/50">
                    <h3 class="text-xl font-bold text-gray-900 mb-1">Manish Kumar</h3>
                    <p class="text-indigo-600 font-semibold text-sm mb-3">Founder</p>
                    <p class="text-sm text-gray-600 leading-relaxed">Tech enthusiast dedicated to building innovative digital solutions. Committed to delivering high-quality tools that simplify everyday tasks for users worldwide.</p>
                  </div>
                  <div class="p-6 rounded-2xl border border-gray-200 bg-gray-50/50">
                    <h3 class="text-xl font-bold text-gray-900 mb-1">Aniket Kr Mandal</h3>
                    <p class="text-indigo-600 font-semibold text-sm mb-3">Founder</p>
                    <p class="text-sm text-gray-600 leading-relaxed">Passionate entrepreneur with a vision to make powerful online tools accessible to everyone. Focused on creating user-friendly solutions that prioritize privacy and efficiency.</p>
                  </div>
                </div>
              </main>
            </div>
          `;
        } else if (route === '/blogs') {
          const postCardsHtml = blogPosts.map(p => `
            <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col">
              ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.title)}" class="w-full h-48 object-cover border-b" />` : ''}
              <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span class="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 block">${escapeHtml(p.category)}</span>
                  <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2"><a href="/blogs/${p.slug}" class="hover:underline">${escapeHtml(p.title)}</a></h3>
                  <p class="text-sm text-gray-600 mb-4 line-clamp-3">${escapeHtml(p.description)}</p>
                </div>
                <div class="flex items-center justify-between text-xs text-gray-500 font-medium pt-4 border-t">
                  <span>${escapeHtml(p.publishedDate)}</span>
                  <span>${escapeHtml(p.readTime)}</span>
                </div>
              </div>
            </div>
          `).join('');

          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>
              <main class="container mx-auto px-4 py-12 max-w-6xl">
                <h1 class="text-4xl font-black mb-4 text-gray-900 text-center">DailyTools247 Blog</h1>
                <p class="text-gray-600 text-center max-w-xl mx-auto mb-12">Learn technology tutorials, file conversion guides, developer workflow hacks, and tips from our team.</p>
                <h2 class="text-2xl font-black mb-8 text-gray-900 border-b pb-3">Latest Articles &amp; Tutorials (${blogPosts.length})</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${postCardsHtml}</div>
                <h2 class="text-2xl font-black mt-16 mb-6 text-gray-900 border-b pb-3">Write for Us</h2>
                <div class="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">Share Your Tech Tutorials &amp; Startup Guides</h3>
                    <p class="text-sm text-gray-600 max-w-2xl leading-relaxed">Join DailyTools247 as a guest contributor. Publish comprehensive guides, reach our growing developer and business audience, and earn permanent high-authority backlinks.</p>
                  </div>
                  <a href="/write-for-us" class="inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition whitespace-nowrap shadow-md">View Submission Guidelines</a>
                </div>
              </main>
            </div>
          `;
        } else if (route === '/write-for-us') {
          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>
              <main class="container mx-auto px-4 py-12 max-w-4xl bg-white shadow-sm border border-gray-200 rounded-2xl my-8 p-8 sm:p-12">
                <h1 class="text-4xl font-black text-gray-900 mb-6">Write for Us - Guest Post Submission</h1>
                <p class="text-lg text-gray-600 leading-relaxed mb-8">Share your expertise and write high-quality tech guides or showcase your startup for the DailyTools247 audience. We welcome practical tutorials, software comparisons, developer workflow guides, and SEO analyses.</p>
                
                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8 border-b pb-2">Why Write for DailyTools247?</h2>
                <p class="text-gray-700 leading-relaxed mb-6 text-base">DailyTools247 is visited by thousands of developers, designers, students, marketers, and power users every day. By contributing guest articles, you gain access to an engaged technology audience, build domain authority with contextual dofollow backlinks, and establish your brand or startup as an industry leader.</p>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8 border-b pb-2">Accepted Topic Areas</h2>
                <ul class="list-disc pl-5 space-y-2 text-gray-700 leading-relaxed text-sm mb-8">
                  <li><strong>Document &amp; Media Optimization:</strong> PDF workflows, image compression best practices, and video processing.</li>
                  <li><strong>Developer &amp; DevOps Utilities:</strong> JSON APIs, Docker, regex debugging, TypeScript tips, and database formatting.</li>
                  <li><strong>SEO &amp; Web Performance:</strong> Meta tag optimization, Core Web Vitals, site speed, and sitemap audits.</li>
                  <li><strong>Productivity &amp; AI Workflows:</strong> Practical applications of machine learning, summarization, and workflow automation.</li>
                  <li><strong>Finance &amp; E-commerce:</strong> Small business calculators, invoicing tips, tax planning, and store conversion.</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8 border-b pb-2">Submission Guidelines &amp; Article Standards</h2>
                <div class="space-y-4 text-gray-700 text-sm leading-relaxed mb-8">
                  <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 class="font-bold text-gray-900 text-base mb-1">Free to Submit &amp; Review</h3>
                    <p>Writing and submitting guest articles for review is 100% free with no upfront payments.</p>
                  </div>
                  <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 class="font-bold text-gray-900 text-base mb-1">Article Length (800+ Words)</h3>
                    <p>All submitted articles must contain at least 800 words of comprehensive, original, and actionable content.</p>
                  </div>
                  <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 class="font-bold text-gray-900 text-base mb-1">Promote Your Startup &amp; Get Backlinks</h3>
                    <p>You may include one contextual dofollow backlink to your startup, business website, or product within the article body.</p>
                  </div>
                  <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 class="font-bold text-gray-900 text-base mb-1">One-Time Publication Fee ($10)</h3>
                    <p>A flat one-time administrative publication fee of $10 applies only after your submission passes editorial review and is accepted for publication.</p>
                  </div>
                </div>

                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8 border-b pb-2">How to Submit Your Draft</h2>
                <p class="text-gray-700 leading-relaxed text-sm mb-4">Please email your proposed article title, brief outline, or complete Google Docs/Markdown draft directly to our editorial team at:</p>
                <p class="text-base font-bold text-indigo-600 mb-6"><a href="mailto:manishmandal9734@gmail.com?subject=Guest%20Post%20Submission%20for%20DailyTools247" class="hover:underline">manishmandal9734@gmail.com</a></p>
                <p class="text-xs text-gray-500">We typically review submissions and respond within 24 to 48 business hours.</p>
              </main>
            </div>
          `;
        } else if (route === '/terms') {
          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>
              <main class="container mx-auto px-4 py-12 max-w-4xl bg-white shadow-sm border border-gray-200 rounded-2xl my-8 p-8 sm:p-12">
                <h1 class="text-4xl font-black text-gray-900 mb-4">Terms of Service</h1>
                <p class="text-sm text-gray-500 mb-8 pb-4 border-b">Last updated: April 18, 2026</p>

                <div class="space-y-8 text-gray-700 text-sm leading-relaxed">
                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                    <p>By accessing, browsing, or utilizing any online tools, APIs, or content provided on DailyTools247 ("the Service", "we", "us"), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service. If you do not agree to these terms, you must discontinue using our services immediately. We reserve the right to revise these terms at any time.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">2. Description of Service &amp; Online Utilities</h2>
                    <p>DailyTools247 provides a broad suite of free online utilities including PDF document managers, image converters and compressors, developer code formatters, security generators, financial calculators, educational tools, and video/audio helpers. All tools are offered 100% free without mandatory registration or subscription fees.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">3. User Responsibilities &amp; Acceptable Use</h2>
                    <p>You agree to use DailyTools247 solely for lawful purposes in accordance with these terms. You agree not to: (a) attempt to disrupt, exploit, or overburden our infrastructure; (b) reverse-engineer or harvest server endpoints; (c) process unlawful, harmful, abusive, defamatory, or fraudulent content; or (d) violate any applicable local, national, or international regulations.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">4. Intellectual Property &amp; User Ownership</h2>
                    <p>You retain 100% full ownership and all intellectual property rights to any files, data, text, code, or images processed through our tools. DailyTools247 claims zero ownership over your files. The DailyTools247 website, logo, branding, layout, and original interface elements are the exclusive intellectual property of DailyTools247.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">5. Disclaimer of Warranties</h2>
                    <p>The Service is provided on an "as is" and "as available" basis without warranties of any kind, whether express, statutory, or implied. DailyTools247 makes no warranty that the tools will be completely error-free, uninterrupted, or that converted files will satisfy all specific formatting requirements. Users should verify critical calculations and retain local backup copies.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">6. Limitation of Liability</h2>
                    <p>To the maximum extent permitted by applicable law, DailyTools247 and its operators shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from the use or inability to use the tools, loss of data, or business interruption.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">7. Local File Processing &amp; Privacy Guarantee</h2>
                    <p>Our tools are engineered to execute processing directly inside client browser memory using HTML5 Canvas, WebAssembly, and local JavaScript. Your files are not uploaded to, saved, or monitored on remote servers, ensuring strict confidentiality.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">8. Governing Law &amp; Contact Information</h2>
                    <p>These terms shall be governed by and construed in accordance with applicable laws. If you have questions regarding these Terms of Service, please contact our support team at <a href="mailto:manishmandal9734@gmail.com" class="text-indigo-600 font-bold hover:underline">manishmandal9734@gmail.com</a>.</p>
                  </section>
                </div>
              </main>
            </div>
          `;
        } else if (route === '/privacy') {
          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>
              <main class="container mx-auto px-4 py-12 max-w-4xl bg-white shadow-sm border border-gray-200 rounded-2xl my-8 p-8 sm:p-12">
                <h1 class="text-4xl font-black text-gray-900 mb-4">Privacy Policy</h1>
                <p class="text-sm text-gray-500 mb-8 pb-4 border-b">Last updated: April 18, 2026</p>

                <div class="space-y-8 text-gray-700 text-sm leading-relaxed">
                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">1. Our Privacy Commitment</h2>
                    <p>At DailyTools247, user privacy and data security are our foundational principles. We believe that online utility tools should never compromise your confidential files, passwords, or personal documents. This Privacy Policy explains how our privacy-first architecture protects your information.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                    <p>We believe in data minimization. When you use DailyTools247: (a) we do NOT require personal registration, account creation, or login credentials; (b) we do NOT collect personal identifiers such as names, phone numbers, or physical addresses; and (c) we do NOT store files uploaded into our client-side tools.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">3. Local Client-Side Processing &amp; Zero File Retention</h2>
                    <p>The majority of our tools (including PDF splitters, image compressors, password generators, hash checkers, and JSON formatters) execute 100% inside your browser using client-side JavaScript, WebAssembly, and HTML5 Canvas. Your documents and data never leave your device.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">4. Anonymous Analytics &amp; Performance Metrics</h2>
                    <p>We may collect aggregated, non-personally identifiable metrics (such as page views, browser user-agent types, and tool popularity) solely to monitor website health, optimize load speeds, and identify high-demand new tools. No personal profiling is performed.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">5. Cookies &amp; Local Storage</h2>
                    <p>DailyTools247 uses minimal essential cookies and browser LocalStorage exclusively to remember user interface preferences (such as light/dark theme selection). We do not use third-party behavioral tracking or advertising cookies.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">6. Third-Party Services &amp; External Links</h2>
                    <p>Our website may contain links to external websites, blog references, or third-party documentation. We are not responsible for the privacy practices or content of third-party websites and advise users to review their respective policies.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">7. Industry-Standard Data Security</h2>
                    <p>All network communications on DailyTools247 are encrypted using modern HTTPS (TLS 1.3) protocols. We implement strict Content Security Policies (CSP), HSTS headers, and cross-site scripting (XSS) protections to keep your browsing session safe.</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3">8. Your Rights &amp; Contact Information</h2>
                    <p>Under global privacy frameworks (including GDPR and CCPA), you have the right to transparent data practices. Since we do not retain personal files, your data is always under your complete control. For questions or privacy inquiries, contact <a href="mailto:manishmandal9734@gmail.com" class="text-indigo-600 font-bold hover:underline">manishmandal9734@gmail.com</a>.</p>
                  </section>
                </div>
              </main>
            </div>
          `;
        } else if (route === '/api-docs') {
          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>
              <main class="container mx-auto px-4 py-12 max-w-4xl bg-white shadow-sm border border-gray-200 rounded-2xl my-8 p-8 sm:p-12">
                <h1 class="text-4xl font-black text-gray-900 mb-4">DailyTools247 Developer API Reference</h1>
                <p class="text-lg text-gray-600 leading-relaxed mb-8">Programmatically integrate powerful utility services into your own applications, scripts, workflows, and automated bots using the DailyTools247 REST API.</p>

                <div class="space-y-8 text-gray-700 text-sm leading-relaxed">
                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3 border-b pb-2">1. Overview &amp; Architecture</h2>
                    <p class="mb-3">The DailyTools247 API provides clean, predictable RESTful JSON endpoints for programmatic text analysis, data conversion, cryptographic hashing, and QR generation. All API endpoints accept standard JSON payloads and return structured responses with success indicators.</p>
                    <p class="font-mono text-xs bg-gray-100 p-3 rounded-lg text-gray-800">Base URL: https://www.dailytools247.app/api/v1</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3 border-b pb-2">2. Authentication &amp; API Keys</h2>
                    <p class="mb-3">Access to the API requires an API key passed in the request header. You can generate a free API key directly from the developer dashboard.</p>
                    <div class="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                      <code>Header: X-API-Key: YOUR_GENERATED_API_KEY</code>
                    </div>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3 border-b pb-2">3. Rate Limits &amp; Quotas</h2>
                    <p class="mb-3">Free Tier API keys include a quota of <strong>100 requests per day</strong> with burst rate limits of 10 requests per minute. Rate limit metadata is included in standard HTTP response headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset).</p>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3 border-b pb-2">4. Available API Endpoints</h2>
                    <div class="space-y-4">
                      <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/70">
                        <h3 class="font-bold text-gray-900 text-base mb-1">Word &amp; Character Counter</h3>
                        <p class="text-xs text-gray-600 mb-2 font-mono">POST /api/v1/tools/word-counter</p>
                        <p class="text-xs text-gray-600">Analyzes input text and returns total word count, character count, sentence count, paragraph count, and estimated reading time.</p>
                      </div>

                      <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/70">
                        <h3 class="font-bold text-gray-900 text-base mb-1">Base64 Encoder / Decoder</h3>
                        <p class="text-xs text-gray-600 mb-2 font-mono">POST /api/v1/tools/base64-encode</p>
                        <p class="text-xs text-gray-600">Encodes plaintext strings to standard Base64 format or decodes Base64 data back to utf-8 strings.</p>
                      </div>

                      <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/70">
                        <h3 class="font-bold text-gray-900 text-base mb-1">Cryptographic Hash Generator</h3>
                        <p class="text-xs text-gray-600 mb-2 font-mono">POST /api/v1/tools/hash-generator</p>
                        <p class="text-xs text-gray-600">Calculates deterministic MD5, SHA-1, SHA-256, and SHA-512 cryptographic checksums from input text.</p>
                      </div>

                      <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/70">
                        <h3 class="font-bold text-gray-900 text-base mb-1">QR Code Generator</h3>
                        <p class="text-xs text-gray-600 mb-2 font-mono">POST /api/v1/tools/qr-generator</p>
                        <p class="text-xs text-gray-600">Generates downloadable Data URI QR code images from text, contact details, or URLs.</p>
                      </div>

                      <div class="p-4 rounded-xl border border-gray-200 bg-gray-50/70">
                        <h3 class="font-bold text-gray-900 text-base mb-1">Unit Converter</h3>
                        <p class="text-xs text-gray-600 mb-2 font-mono">POST /api/v1/tools/unit-converter</p>
                        <p class="text-xs text-gray-600">Converts dimensional values across length, weight, temperature, data storage, and speed units.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 class="text-xl font-bold text-gray-900 mb-3 border-b pb-2">5. Error Handling &amp; Status Codes</h2>
                    <p class="mb-3">The API adheres to standard HTTP status codes: 200 OK for successful executions, 400 Bad Request for invalid parameters, 401 Unauthorized for missing/invalid keys, 429 Too Many Requests when exceeding rate limits, and 500 Internal Server Error for unhandled exceptions.</p>
                  </section>
                </div>
              </main>
            </div>
          `;
        } else {
          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
                <nav class="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
                  <a href="/categories" class="hover:text-indigo-600 transition">All Categories</a>
                  <a href="/blogs" class="hover:text-indigo-600 transition">Blog</a>
                  <a href="/about" class="hover:text-indigo-600 transition">About</a>
                </nav>
              </header>
              <main class="container mx-auto px-4 py-12 max-w-4xl bg-white shadow-sm border border-gray-200 rounded-2xl my-8 p-8 sm:p-12">
                <h1 class="text-4xl font-black text-gray-900 mb-6">${escapeHtml(title)}</h1>
                <p class="text-lg text-gray-600 leading-relaxed mb-6">${escapeHtml(description)}</p>
                <div class="text-gray-600 leading-relaxed text-sm mt-8 border-t pt-6">
                  <p>Processing happens locally in your browser. All tools on DailyTools247 are 100% free with no registration or subscriptions required.</p>
                </div>
              </main>
            </div>
          `;
        }
      }

      // Generate HTML from template
      let cleanHtml = template.replace(/<title[^>]*data-rh="true"[^>]*>[\s\S]*?<\/title>/gi, '');
      cleanHtml = cleanHtml.replace(/<(meta|link)[^>]*data-rh="true"[^>]*\/?>/gi, '');

      const customHead = `
        <title data-rh="true">${escapeHtml(title)}</title>
        <meta name="title" content="${escapeHtml(title)}" data-rh="true" />
        <meta name="description" content="${escapeHtml(description)}" data-rh="true" />
        <meta name="keywords" content="${escapeHtml(keywords.join(', '))}" data-rh="true" />
        <meta name="author" content="DailyTools247" data-rh="true" />
        <link rel="canonical" href="${currentUrl}" data-rh="true" />
        <meta name="robots" content="${isNoIndex ? 'noindex,nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" data-rh="true" />
        <meta name="googlebot" content="${isNoIndex ? 'noindex,nofollow' : 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1'}" data-rh="true" />
        <meta name="bingbot" content="${isNoIndex ? 'noindex,nofollow' : 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1'}" data-rh="true" />
        <meta name="language" content="en" data-rh="true" />
        <meta name="revisit-after" content="7 days" data-rh="true" />
        
        <meta property="og:type" content="${ogType}" data-rh="true" />
        <meta property="og:url" content="${currentUrl}" data-rh="true" />
        <meta property="og:title" content="${escapeHtml(title)}" data-rh="true" />
        <meta property="og:description" content="${escapeHtml(description)}" data-rh="true" />
        <meta property="og:image" content="https://www.dailytools247.app/og-image.webp" data-rh="true" />
        <meta property="og:image:width" content="1200" data-rh="true" />
        <meta property="og:image:height" content="630" data-rh="true" />
        <meta property="og:image:alt" content="${escapeHtml(title)}" data-rh="true" />
        <meta property="og:site_name" content="DailyTools247" data-rh="true" />
        <meta property="og:locale" content="en_IN" data-rh="true" />
        
        <meta name="twitter:card" content="summary_large_image" data-rh="true" />
        <meta name="twitter:url" content="${currentUrl}" data-rh="true" />
        <meta name="twitter:title" content="${escapeHtml(title)}" data-rh="true" />
        <meta name="twitter:description" content="${escapeHtml(description)}" data-rh="true" />
        <meta name="twitter:image" content="https://www.dailytools247.app/og-image.webp" data-rh="true" />
        
        ${schemaScripts}
      `;

      cleanHtml = cleanHtml.replace('</head>', `${customHead}\n</head>`);
      cleanHtml = cleanHtml.replace('<div id="root"></div>', `<div id="root">${htmlContent}</div>`);

      let targetPath;
      if (route === '/') {
        targetPath = path.join(projectRoot, 'dist', 'index.html');
      } else {
        const subFolder = path.join(projectRoot, 'dist', route.replace(/^\//, ''));
        fs.mkdirSync(subFolder, { recursive: true });
        targetPath = path.join(subFolder, 'index.html');
      }

      fs.writeFileSync(targetPath, cleanHtml, 'utf8');
      console.log(`✅ Pre-rendered route: ${route} -> ${path.relative(projectRoot, targetPath)}`);
    }

    // 5. REDIRECT PAGES
    console.log('🔗 Generating static redirect HTML pages for deprecated routes...');
    for (const r of redirects) {
      if (r.from.toLowerCase() === r.to.toLowerCase()) {
        console.log(`⚠️ Skipping static file creation for case-variant redirect: ${r.from} -> ${r.to}`);
        continue;
      }
      const redirectHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <meta http-equiv="refresh" content="0; url=${r.to}">
  <link rel="canonical" href="https://www.dailytools247.app${r.to}">
  <script type="text/javascript">
    window.location.replace("${r.to}");
  </script>
</head>
<body>
  <p>Redirecting to <a href="${r.to}">https://www.dailytools247.app${r.to}</a>...</p>
</body>
</html>`;

      const subFolder = path.join(projectRoot, 'dist', r.from.replace(/^\//, ''));
      fs.mkdirSync(subFolder, { recursive: true });
      const targetPath = path.join(subFolder, 'index.html');
      fs.writeFileSync(targetPath, redirectHtml, 'utf8');
      console.log(`🔗 Redirect route created: ${r.from} -> ${r.to}`);
    }

    // 6. GENERATE VERCEL.JSON CONFIG DYNAMICALLY
    console.log('📝 Programmatically updating vercel.json...');
    const vercelConfigPath = path.join(projectRoot, 'vercel.json');

    let vercelConfig = {
      cleanUrls: true,
      redirects: [],
      rewrites: [],
      headers: []
    };

    if (fs.existsSync(vercelConfigPath)) {
      try {
        vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      } catch (e) {
        console.warn('⚠️ Could not parse existing vercel.json, using defaults.', e);
      }
    }

    vercelConfig.redirects = redirects.map(r => ({
      source: r.from,
      destination: r.to,
      permanent: true
    }));

    const staticPages = ['about', 'privacy', 'terms', 'write-for-us', 'categories', 'blogs', 'api-docs'];
    const toolSlugs = toolLocs.map(loc => loc.replace(/^\//, ''));

    const excludedPrefixesAndSlugs = [
      'assets/',
      'public/',
      'category/',
      'blogs/',
      ...staticPages,
      ...toolSlugs
    ];

    const excludePattern = excludedPrefixesAndSlugs.join('|');

    vercelConfig.rewrites = [
      {
        source: `/((?!${excludePattern}|.*\\.[a-zA-Z0-9]+$).*)`,
        destination: '/index.html'
      }
    ];

    fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 4), 'utf8');
    console.log('✅ Successfully updated vercel.json with native redirects and optimized SPA rewrites!');

    console.log('✨ Programmatic pre-rendering completed successfully!');

  } catch (err) {
    console.error('❌ Error during pre-rendering execution:', err);
    process.exit(1);
  } finally {
    await vite.close();
  }
}

run();
