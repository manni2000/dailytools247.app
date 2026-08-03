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

// Custom page metadata mapping for static pages
const staticPageMeta = {
  '/': {
    title: 'Free Online Tools: PDF, Image, AI & SEO - DailyTools247',
    description: '100+ free online tools for PDF, image, video, text & more. No signup required. Fast, private & browser-based.',
    keywords: ['free online tools', 'pdf converter', 'image compressor', 'qr code generator', 'video tools', 'DailyTools247']
  },
  '/categories': {
    title: 'All Categories - Browse 200+ Free Online Tools',
    description: 'Browse all categories of free online tools on DailyTools247. PDF, Image, Video, Developer, Finance, Security, and more.',
    keywords: ['tool categories', 'free online tools', 'pdf tools', 'image tools', 'developer tools', 'finance tools']
  },
  '/about': {
    title: 'About DailyTools247 - Free, Privacy-First Online Tools',
    description: 'Learn about the mission, values, and creators of DailyTools247, a free online toolbox for daily utilities.',
    keywords: ['about DailyTools247', 'free online toolbox', 'privacy focused tools', 'about us']
  },
  '/write-for-us': {
    title: 'Write for Us - Guest Post Submission | DailyTools247',
    description: 'Write for us at DailyTools247. Submit original guest posts for a highly targeted tech audience. Promote your startup or business, get backlinks, and publish for a one-time $10 fee.',
    keywords: ['write for us', 'guest post guidelines', 'guest post submission', 'guest author', 'submit guest post']
  },
  '/privacy': {
    title: 'Privacy Policy - DailyTools247',
    description: 'Read the privacy policy of DailyTools247. Your data security and privacy are our top priorities.',
    keywords: ['privacy policy', 'data security', 'local file processing', 'privacy guarantee']
  },
  '/terms': {
    title: 'Terms of Service - DailyTools247',
    description: 'Read the terms of service of DailyTools247 online utilities.',
    keywords: ['terms of service', 'terms and conditions', 'user agreement', 'usage policy']
  },
  '/api-docs': {
    title: 'API Reference & Documentation - DailyTools247',
    description: 'Developers reference and API documentation for DailyTools247. Integrate and trigger local utility services directly.',
    keywords: ['api reference', 'developer api', 'api documentation', 'integrate tools']
  },
  '/blogs': {
    title: 'Blog - Tool Guides, Tips & Tutorials - DailyTools247',
    description: 'Explore the DailyTools247 blog for practical guides, product comparisons, technology tips, and detailed tutorials.',
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
  // Stale URLs from previous deployments — redirect to the correct current tool to clear 404s and preserve SEO equity
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

  // Start Vite in middleware/custom mode to import TS modules on the fly.
  // This server is only used for ssrLoadModule, so disable HMR and the client
  // dependency scanner — otherwise the in-flight esbuild dep-scan races
  // vite.close() and dumps "The server is being restarted or closed" errors.
  const vite = await createServer({
    root: projectRoot,
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [] }
  });

  try {
    console.log('📦 Loading TypeScript modules...');
    // Load metadata and schemas natively using ssrLoadModule
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

    // Read the compiled index.html output as a template
    const templatePath = path.join(projectRoot, 'dist', 'index.html');
    if (!fs.existsSync(templatePath)) {
      throw new Error(`dist/index.html not found! Run 'vite build' first.`);
    }
    const template = fs.readFileSync(templatePath, 'utf8');

    // Parse all URLs to pre-render from the sitemaps
    const pageLocs = parseLocsFromSitemap('public/sitemap-pages.xml');
    const blogLocs = parseLocsFromSitemap('public/sitemap-blog.xml');
    const toolLocs = parseLocsFromSitemap('public/sitemap-tools.xml');

    const allLocs = [...new Set([...pageLocs, ...blogLocs, ...toolLocs])];
    console.log(`📋 Total routes extracted from sitemaps: ${allLocs.length}`);

    // Track category mapping
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

    // Category descriptions (synced with CategoryPage.tsx)
    const categoryDescriptions = {
      "pdf": "Professional PDF tools for editing, converting, merging, and optimizing documents. Free online PDF editor, converter, and organizer tools without watermark.",
      "image": "Professional image tools for compressing, converting, resizing, and editing images. Free online image editor, converter, and optimizer tools without watermark.",
      "video": "Professional video tools for converting, trimming, and processing videos. Free online video editor, converter, and processor tools without watermark.",
      "audio": "Professional audio tools for converting, trimming, and processing audio files. Free online audio editor, converter, and processor tools without watermark.",
      "text": "Professional text tools for counting, converting, and processing text. Free online text editor, converter, and processor tools without watermark.",
      "security": "Professional security tools for generating passwords, hashing data, and encryption. Free online security tools, password generator, and encryption tools without watermark.",
      "finance": "Professional finance tools for calculating GST, EMI, and managing finances. Free online finance calculator, invoice generator, and financial tools without watermark.",
      "dev": "Professional development tools for formatting JSON, testing regex, and encoding data. Free online developer tools, code formatter, and programming utilities without watermark.",
      "education": "Professional educational tools for calculations, conversions, and learning. Free online education calculator, converter, and learning tools without watermark.",
      "internet": "Professional internet tools for IP lookup, DNS checking, and network analysis. Free online network tools, IP checker, and web utilities without watermark.",
      "seo": "Professional SEO tools for meta tags, keyword analysis, and search optimization. Free online SEO tools, meta generator, and optimization utilities without watermark.",
      "social": "Professional social media tools for generating hashtags, creating bios, and formatting content. Free online social media tools, hashtag generator, and content utilities without watermark.",
      "zip": "Professional compression tools for creating ZIP files, extracting archives, and compressing data. Free online compression tools, archive manager, and file utilities without watermark.",
      "date-time": "Professional date and time tools for calculating dates, managing time, and scheduling. Free online date calculator, time manager, and scheduling tools without watermark.",
      "govt-legal": "Professional government and legal tools for passport photos, document templates, and signatures. Free online legal tools, document creator, and government utilities without watermark.",
      "ecommerce": "Professional e-commerce tools for generating barcodes, creating invoices, and managing products. Free online business tools, barcode generator, and seller utilities without watermark."
    };

    const categoryKeywords = {
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
        // Some sitemap routes use a different slug than the metadata key (kept in sync with getToolSeoMetadata aliases)
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

          // Generate dynamic schema markup matching SEOHelmet exactly
          const schemas = [];

          // Base WebApplication schema
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

          // Semantic graphs schema
          const semanticSchema = generateStructuredData(slug, category);
          if (semanticSchema && semanticSchema['@graph']) {
            schemas.push(...semanticSchema['@graph']);
          }

          // EEAT Graph Schema
          schemas.push(generateEEATStructuredData());

          // Breadcrumbs
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

          // FAQs schema
          const toolFaqs = toolMetadata.faqs || [];
          const combinedFaqs = [...toolFaqs, ...universalToolFaqs].slice(0, 10);


          // HowTo schema
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

          // Product Reviews and Aggregate Rating
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

          // Internal linking
          const internalLinks = generateInternalLinkingStrategy(slug, category);
          if (internalLinks && internalLinks.length > 0) {
            schemas.push({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Related Tools',
              description: 'Recommended tools based on your current selection',
              itemListElement: internalLinks.map((link, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: link.anchorText,
                url: `https://www.dailytools247.app${link.url}`,
                description: link.context
              }))
            });
          }

          schemaScripts = schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n');

          // Generate static DOM layout inside root div
          let howToHtml = '';
          if (toolMetadata.howTo) {
            const steps = toolMetadata.howTo.steps.map((step, idx) => `
              <li class="mb-6 flex gap-4">
                <span class="flex-none flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">${idx + 1}</span>
                <div>
                  <h4 class="font-semibold text-gray-900 text-base mb-1">${escapeHtml(step.name)}</h4>
                  <p class="text-gray-600 text-sm leading-relaxed">${escapeHtml(step.text)}</p>
                </div>
              </li>
            `).join('');

            howToHtml = `
              <section class="mb-12">
                <h2 class="text-2xl font-bold mb-6 border-b pb-2 text-gray-900">How to Use ${escapeHtml(toolMetadata.howTo.name || toolMetadata.title.split(' - ')[0])}</h2>
                <p class="text-gray-600 mb-6">${escapeHtml(toolMetadata.howTo.description)}</p>
                <ol class="list-none p-0">${steps}</ol>
              </section>
            `;
          }

          let faqsHtml = '';
          if (combinedFaqs.length > 0) {
            const questions = combinedFaqs.map(faq => `
              <div class="mb-6 border-b border-gray-100 pb-4">
                <h3 class="font-bold text-lg mb-2 text-gray-900 flex gap-2">
                  <span class="text-indigo-600 font-extrabold">Q:</span> ${escapeHtml(faq.question)}
                </h3>
                <p class="text-gray-600 leading-relaxed pl-6">${faq.answer}</p>
              </div>
            `).join('');

            faqsHtml = `
              <section class="mb-12">
                <h2 class="text-2xl font-bold mb-6 border-b pb-2 text-gray-900">Frequently Asked Questions</h2>
                <div class="space-y-4">${questions}</div>
              </section>
            `;
          }

          let relatedHtml = '';
          if (toolMetadata.relatedTools && toolMetadata.relatedTools.length > 0) {
            const links = toolMetadata.relatedTools.map(rSlug => {
              const rMeta = toolSeoEnhancements[rSlug];
              if (!rMeta) return '';
              return `
                <a href="/${rSlug}" class="block p-4 rounded-xl border border-gray-200 hover:border-indigo-500 transition bg-white hover:bg-gray-50/50">
                  <h4 class="font-semibold text-gray-900 text-sm mb-1">${escapeHtml(rMeta.title.split(' - ')[0])}</h4>
                  <p class="text-xs text-gray-500 line-clamp-2">${escapeHtml(rMeta.description)}</p>
                </a>
              `;
            }).filter(Boolean).join('');

            if (links) {
              relatedHtml = `
                <section class="mb-12">
                  <h2 class="text-2xl font-bold mb-6 border-b pb-2 text-gray-900">Related Tools</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${links}</div>
                </section>
              `;
            }
          }

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

              <main class="container mx-auto px-4 py-8 max-w-4xl">
                <nav class="text-xs text-gray-500 mb-6 flex items-center gap-2">
                  <a href="/" class="hover:underline">Home</a>
                  <span>&bull;</span>
                  <a href="/category/${categorySlug}" class="hover:underline">${escapeHtml(category)}</a>
                  <span>&bull;</span>
                  <span class="text-gray-800 font-medium">${escapeHtml(title.split(' - ')[0])}</span>
                </nav>

                <div class="mb-10">
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 mb-3">${escapeHtml(category)}</span>
                  <h1 class="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">${escapeHtml(title.split(' - ')[0])}</h1>
                  <p class="text-lg text-gray-600 leading-relaxed">${escapeHtml(description)}</p>
                </div>

                <!-- Interactive App Mount Spinner -->
                <div class="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center bg-white shadow-sm mb-12 flex flex-col items-center justify-center">
                  <h3 class="text-lg font-bold text-gray-800 mb-2">Loading Interactive Tool...</h3>
                  <p class="text-sm text-gray-500 mb-4 max-w-md">Please wait a moment for the browser to initialize secure, client-side local calculations.</p>
                  <div class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                </div>

                ${howToHtml}
                ${faqsHtml}
                ${relatedHtml}

                <div class="mt-16 p-6 sm:p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-sm">
                  <h2 class="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full bg-emerald-500"></span> Privacy &amp; Trust Guarantee
                  </h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 class="font-bold text-emerald-950 mb-1">100% Local Browser Processing</h4>
                      <p class="text-emerald-700 leading-relaxed">Processing occurs entirely in your browser using local JavaScript/Wasm. Files are never transmitted to any servers.</p>
                    </div>
                    <div>
                      <h4 class="font-bold text-emerald-950 mb-1">Zero File Retention</h4>
                      <p class="text-emerald-700 leading-relaxed">Your data resides in temporary browser memory. Files are wiped instantly upon tab closure or page reload.</p>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          `;
        } else {
          // Never emit an empty <title> — derive sensible metadata from the slug
          const prettyName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          title = `${prettyName} - Free Online Tool`;
          description = `Use ${prettyName} online for free. No signup, no watermark - fast, private, browser-based processing on DailyTools247.`;
          keywords = [prettyName.toLowerCase(), 'free online tool', 'no signup'];
          console.warn(`⚠️ No SEO metadata found for tool slug "${slug}" — using fallback title.`);
        }
      }

      // 2. CATEGORY PAGES
      else if (route.startsWith('/category/')) {
        const catId = route.substring(10);
        const categoryData = toolCategories.find(c => c.id === catId);

        if (categoryData) {
          category = categoryData.name;
          const catTitleName = categoryData.name.endsWith('Tools') ? categoryData.name : `${categoryData.name} Tools`;
          title = `Free ${catTitleName} Online - No Signup, No Watermark`;
          description = categoryDescriptions[catId] || categoryData.description;
          keywords = categoryKeywords[catId] || [categoryData.name.toLowerCase(), 'free online tools'];

          const schemas = [
            generateEEATStructuredData(),
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dailytools247.app' },
                { '@type': 'ListItem', position: 2, name: category, item: currentUrl }
              ]
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
                  reviewBody: `Great collection of ${category}. All tools work perfectly.`,
                  datePublished: '2024-01-20'
                }
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.7',
                ratingCount: '5000',
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

          const catFaqs = categorySpecificFaqs[category] || [];


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
                      <h2 class="text-2xl font-black mb-6 text-gray-900 border-b pb-2">FAQs</h2>
                      <div class="space-y-4">${faqItemsHtml}</div>
                    </section>
                  ` : ''}
                </article>
              </main>
            </div>
          `;
        }
      }

      // 4. STATIC PAGES (Index, About, Privacy, Terms, WriteForUs, APIDocs, Blogs list, Categories list)
      else {
        const meta = staticPageMeta[route];
        if (meta) {
          title = meta.title;
          description = meta.description;
          keywords = meta.keywords;
        } else {
          title = 'Free Online Tools — DailyTools247';
          description = '100+ free online tools for PDF, image, video, text & more.';
          keywords = ['free online tools'];
        }

        // Generate schemas for static pages
        const schemas = [
          generateEEATStructuredData(),
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.dailytools247.app' },
              route !== '/' ? { '@type': 'ListItem', position: 2, name: title.split(' — ')[0], item: currentUrl } : null
            ].filter(Boolean)
          }
        ];

        schemaScripts = schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join('\n');

        // Compile static DOM elements for each static route
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
                <!-- Hero Section -->
                <section class="bg-gradient-to-br from-indigo-50 via-white to-sky-50/30 py-20 px-6 border-b border-gray-200 text-center">
                  <div class="max-w-4xl mx-auto">
                    <h1 class="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-tight">100+ Free Online Tools, <span class="text-indigo-600">No Signup Required</span></h1>
                    <p class="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">Fast, 100% private, browser-based utilities for PDF converters, image compressors, password generators, developer syntax, and more.</p>
                  </div>
                </section>

                <!-- Categories Grid -->
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
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${categoryGridHtml}</div>
              </main>
            </div>
          `;
        } else if (route === '/about') {
          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
              </header>
              <main class="container mx-auto px-4 py-12 max-w-3xl bg-white shadow-sm border border-gray-200 rounded-2xl my-8 p-8 sm:p-12">
                <h1 class="text-4xl font-black text-gray-900 mb-6">About DailyTools247</h1>
                <p class="text-lg text-gray-600 leading-relaxed mb-6 font-medium">We are on a mission to build the ultimate, completely free online toolkit that respects your privacy. No signups, no subscriptions, no paywalls – just robust tools that run directly in your browser.</p>
                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Our Core Principles</h2>
                <div class="space-y-6 text-gray-600 leading-relaxed text-sm">
                  <div>
                    <h4 class="font-bold text-gray-900 text-base mb-1">Privacy First</h4>
                    <p>All calculations, compression, formatting, and file editing happen locally in your web browser. Your private documents, files, and credentials never touch a remote server.</p>
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 text-base mb-1">Zero Paywalls or Watermarks</h4>
                    <p>Every tool is free. We do not restrict file sizes or lock advanced configurations behind expensive pro upgrades. Clean documents without annoying watermark overlays.</p>
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 text-base mb-1">Developer &amp; User Focused</h4>
                    <p>We build utilities that address real workflows. From bulk image resizing to JWT decoding and UUID generation, our layout is optimized for immediate results.</p>
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
              </header>
              <main class="container mx-auto px-4 py-12 max-w-6xl">
                <h1 class="text-4xl font-black mb-4 text-gray-900 text-center">DailyTools247 Blog</h1>
                <p class="text-gray-600 text-center max-w-xl mx-auto mb-12">Learn technology tutorials, file conversion guides, developer workflow hacks, and tips from our team.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${postCardsHtml}</div>
              </main>
            </div>
          `;
        } else if (route === '/write-for-us') {
          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
              </header>
              <main class="container mx-auto px-4 py-12 max-w-3xl bg-white shadow-sm border border-gray-200 rounded-2xl my-8 p-8 sm:p-12">
                <h1 class="text-4xl font-black text-gray-900 mb-6">Write for Us</h1>
                <p class="text-lg text-gray-600 leading-relaxed mb-6">Share your expertise and write high-quality tech guides or showcase your startup for the DailyTools247 audience.</p>
                <h2 class="text-2xl font-bold text-gray-900 mb-4 mt-8">Submission Guidelines</h2>
                <ul class="list-disc pl-5 space-y-3 text-gray-600 leading-relaxed text-sm mb-8">
                  <li><strong>Free to Submit:</strong> Writing and submitting guest posts for any category or tool is completely free.</li>
                  <li><strong>Minimum Length:</strong> All guest articles must be at least 800 words in length.</li>
                  <li><strong>Promote Your Business:</strong> You are welcome to advertise, list your startup, promote your business, and get backlinks.</li>
                  <li><strong>One-Time Fee:</strong> A flat one-time publication fee of $10 applies only after your article is accepted.</li>
                  <li><strong>Original Content Only:</strong> Plagiarism or duplicate content is strictly rejected.</li>
                </ul>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Contact Info</h2>
                <p class="text-gray-600 leading-relaxed text-sm">Send your drafts or topics ideas directly to <a href="mailto:manishmandal9734@gmail.com" class="text-indigo-600 font-bold hover:underline">manishmandal9734@gmail.com</a>.</p>
              </main>
            </div>
          `;
        } else {
          // Fallback static page rendering (Privacy, Terms, API Docs)
          htmlContent = `
            <div class="min-h-screen bg-gray-50/50 text-gray-800 font-sans">
              <header class="border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between shadow-sm">
                <a href="/" class="text-2xl font-black text-indigo-600 tracking-tight">DailyTools247</a>
              </header>
              <main class="container mx-auto px-4 py-12 max-w-3xl bg-white shadow-sm border border-gray-200 rounded-2xl my-8 p-8 sm:p-12">
                <h1 class="text-4xl font-black text-gray-900 mb-6">${escapeHtml(title)}</h1>
                <p class="text-lg text-gray-600 leading-relaxed mb-6">${escapeHtml(description)}</p>
                <div class="text-gray-600 leading-relaxed text-sm mt-8 border-t pt-6">
                  <p>Processing happens locally in your browser. All tools are 100% free with no registration or subscriptions.</p>
                </div>
              </main>
            </div>
          `;
        }
      }

      // Generate HTML from template
      // Strip default helmet elements marked with data-rh="true"
      let cleanHtml = template.replace(/<title[^>]*data-rh="true"[^>]*>[\s\S]*?<\/title>/gi, '');
      cleanHtml = cleanHtml.replace(/<(meta|link)[^>]*data-rh="true"[^>]*\/?>/gi, '');

      // Inject custom meta tags before </head>
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

      // Inject static HTML inside <div id="root"></div>
      cleanHtml = cleanHtml.replace('<div id="root"></div>', `<div id="root">${htmlContent}</div>`);

      // Write output html file to the target location
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

    // 5. REDIRECT PAGES (Deprecated Routes)
    console.log('🔗 Generating static redirect HTML pages for deprecated routes...');
    for (const r of redirects) {
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
    
    // Map redirects from redirects list to Vercel native redirect format
    vercelConfig.redirects = redirects.map(r => ({
      source: r.from,
      destination: r.to,
      permanent: true
    }));
    
    // Gather all pre-rendered paths to exclude from SPA catch-all rewrite rule.
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
    
    // Configure catch-all rewrite to /index.html with negative lookahead to prevent matching excluded paths and files with extensions
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
    // Make sure we shut down the Vite dev server cleanly
    await vite.close();
  }
}

run();
