const express = require("express");
const crypto = require("crypto");
const { strictLimiter } = require("../middleware/security");
const { cache } = require("../redis");

const router = express.Router();

const apiKeys = new Map();

function generateKey() {
  return "dt247_" + crypto.randomBytes(24).toString("hex");
}

function getKeyUsageToday(key) {
  const record = apiKeys.get(key);
  if (!record) return null;
  const today = new Date().toDateString();
  if (record.lastReset !== today) {
    record.usageToday = 0;
    record.lastReset = today;
  }
  return record;
}

function validateApiKey(req, res, next) {
  const key = req.headers["x-api-key"];
  if (!key) {
    return res
      .status(401)
      .json({
        success: false,
        error: "API key required. Add X-API-Key header.",
      });
  }
  const record = getKeyUsageToday(key);
  if (!record) {
    return res
      .status(401)
      .json({
        success: false,
        error: "Invalid API key. Generate one at /api-docs.",
      });
  }
  const limit = record.tier === "pro" ? 1000 : 100;
  if (record.usageToday >= limit) {
    return res.status(429).json({
      success: false,
      error: "Daily API limit reached.",
      limit,
      resetAt: "midnight UTC",
    });
  }
  record.usageToday++;
  record.totalRequests++;
  res.setHeader("X-RateLimit-Limit", limit);
  res.setHeader("X-RateLimit-Remaining", limit - record.usageToday);
  req.apiKeyRecord = record;
  next();
}

const API_DOCUMENTATION = {
  version: "2.0.0",
  baseUrl: "/api/v1",
  description:
    "DailyTools247 Developer API - 100+ tool endpoints across 10 categories - Free tier with 100 requests/day",
  endpoints: [
    {
      category: "Text",
      endpoints: [
        {
          method: "POST",
          path: "/api/v1/text/word-counter",
          name: "Word Counter",
          description: "Count words, characters, sentences in text",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "Text to analyze",
            },
          ],
          example: {
            curl: `curl -X POST /api/v1/text/word-counter -H "X-API-Key: YOUR_KEY" -d '{"text":"Hello world!"}'`,
            response: {
              success: true,
              result: { words: 2, characters: 12, sentences: 1 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/v1/text/case-converter",
          name: "Case Converter",
          description:
            "Convert text to different cases (upper, lower, title, camel, snake, kebab, pascal, alternating, inverse)",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "Text to convert",
            },
            {
              name: "case",
              type: "string",
              required: true,
              default: "upper",
              description:
                "upper | lower | title | camel | snake | kebab | pascal | alternating | inverse",
            },
          ],
          example: {
            curl: `curl -X POST /api/v1/text/case-converter -H "X-API-Key: YOUR_KEY" -d '{"text":"hello world","case":"title"}'`,
            response: { success: true, result: { converted: "Hello World" } },
          },
        },
        {
          method: "POST",
          path: "/api/v1/text/markdown-to-html",
          name: "Markdown to HTML",
          description: "Convert Markdown text to HTML",
          contentType: "application/json",
          parameters: [
            {
              name: "markdown",
              type: "string",
              required: true,
              description: "Markdown content",
            },
          ],
          example: {
            curl: `curl -X POST /api/v1/text/markdown-to-html -H "X-API-Key: YOUR_KEY" -d '{"markdown":"# Hello"}'`,
            response: { success: true, result: { html: "<h1>Hello</h1>" } },
          },
        },
        {
          method: "POST",
          path: "/api/v1/text/remove-spaces",
          name: "Remove Spaces",
          description: "Remove extra spaces, tabs, blank lines from text",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "Text to process",
            },
            {
              name: "type",
              type: "string",
              required: false,
              default: "extra",
              description: "extra | all | leading | trailing | blank | tabs",
            },
          ],
          example: {
            curl: `curl -X POST /api/v1/text/remove-spaces -H "X-API-Key: YOUR_KEY" -d '{"text":"  hello  world  ","type":"extra"}'`,
            response: { success: true, result: { output: "hello world" } },
          },
        },
        {
          method: "POST",
          path: "/api/v1/text/line-sorter",
          name: "Line Sorter",
          description: "Sort lines alphabetically, remove duplicates",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "Text with lines to sort",
            },
            {
              name: "order",
              type: "string",
              required: false,
              default: "asc",
              description: "asc | desc | random",
            },
            {
              name: "removeDuplicates",
              type: "boolean",
              required: false,
              default: false,
            },
            {
              name: "caseSensitive",
              type: "boolean",
              required: false,
              default: false,
            },
          ],
          example: {
            curl: `curl -X POST /api/v1/text/line-sorter -H "X-API-Key: YOUR_KEY" -d '{"text":"banana\\napple\\ncherry","order":"asc"}'`,
            response: {
              success: true,
              result: { output: "apple\nbanana\ncherry", lineCount: 3 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/v1/text/duplicate-remover",
          name: "Duplicate Remover",
          description: "Remove duplicate lines from text",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "Text with potential duplicates",
            },
            {
              name: "caseSensitive",
              type: "boolean",
              required: false,
              default: false,
            },
          ],
          example: {
            curl: `curl -X POST /api/v1/text/duplicate-remover -H "X-API-Key: YOUR_KEY" -d '{"text":"apple\\nbanana\\napple"}'`,
            response: {
              success: true,
              result: {
                output: "apple\nbanana",
                original: 3,
                unique: 2,
                duplicatesRemoved: 1,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/v1/text/text-diff",
          name: "Text Diff",
          description: "Compare two texts and show differences",
          contentType: "application/json",
          parameters: [
            {
              name: "text1",
              type: "string",
              required: true,
              description: "Original text",
            },
            {
              name: "text2",
              type: "string",
              required: true,
              description: "Modified text",
            },
          ],
          example: {
            curl: `curl -X POST /api/v1/text/text-diff -H "X-API-Key: YOUR_KEY" -d '{"text1":"hello","text2":"hello world"}'`,
            response: {
              success: true,
              result: {
                diff: [{ type: "unchanged", line: "hello" }],
                stats: { added: 1, removed: 0, unchanged: 1 },
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/v1/text/ai-text-summarizer",
          name: "Text Summarizer",
          description: "Summarize text by extracting key sentences",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "Text to summarize",
            },
            {
              name: "sentences",
              type: "number",
              required: false,
              default: 3,
              description: "Number of sentences in summary",
            },
          ],
          example: {
            curl: `curl -X POST /api/v1/text/ai-text-summarizer -H "X-API-Key: YOUR_KEY" -d '{"text":"Long text here...","sentences":3}'`,
            response: {
              success: true,
              result: {
                summary: "...",
                originalSentences: 10,
                summarySentences: 3,
              },
            },
          },
        },
      ],
    },
    {
      category: "Image",
      endpoints: [
        {
          method: "POST",
          path: "/api/image/compress",
          name: "Image Compressor",
          description: "Compress images (JPEG, PNG, WebP) with quality control",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Image file (JPEG, PNG, WebP, GIF, AVIF)",
            },
            {
              name: "quality",
              type: "number",
              required: false,
              default: 80,
              description: "Quality 1-100",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/compress -H "X-API-Key: YOUR_KEY" -F "image=@photo.jpg" -F "quality=75"`,
            response: "Binary image data",
          },
        },
        {
          method: "POST",
          path: "/api/image/resize",
          name: "Image Resizer",
          description: "Resize images to specified dimensions",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Image file",
            },
            {
              name: "width",
              type: "number",
              required: false,
              description: "Target width in pixels",
            },
            {
              name: "height",
              type: "number",
              required: false,
              description: "Target height in pixels",
            },
            {
              name: "maintainAspect",
              type: "boolean",
              required: false,
              default: true,
              description: "Maintain aspect ratio",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/resize -H "X-API-Key: YOUR_KEY" -F "image=@photo.jpg" -F "width=800"`,
            response: "Binary image data",
          },
        },
        {
          method: "POST",
          path: "/api/image/crop",
          name: "Image Cropper",
          description: "Crop images to specified dimensions",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Image file",
            },
            {
              name: "x",
              type: "number",
              required: true,
              description: "X coordinate",
            },
            {
              name: "y",
              type: "number",
              required: true,
              description: "Y coordinate",
            },
            {
              name: "width",
              type: "number",
              required: true,
              description: "Crop width",
            },
            {
              name: "height",
              type: "number",
              required: true,
              description: "Crop height",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/crop -H "X-API-Key: YOUR_KEY" -F "image=@photo.jpg" -F "x=0" -F "y=0" -F "width=500" -F "height=500"`,
            response: "Binary image data",
          },
        },
        {
          method: "POST",
          path: "/api/image/convert",
          name: "Image Format Converter",
          description:
            "Convert images between formats: JPEG, PNG, WebP, AVIF, TIFF, GIF",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Source image file",
            },
            {
              name: "format",
              type: "string",
              required: true,
              default: "png",
              description: "jpeg | png | webp | avif | tiff | gif",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/convert -H "X-API-Key: YOUR_KEY" -F "image=@photo.png" -F "format=webp"`,
            response: "Binary image data",
          },
        },
        {
          method: "POST",
          path: "/api/image/qr-generator",
          name: "QR Code Generator",
          description: "Generate QR codes for any text or URL",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "Text or URL to encode",
            },
            {
              name: "size",
              type: "number",
              required: false,
              default: 300,
              description: "Size in pixels (64-1024)",
            },
            {
              name: "format",
              type: "string",
              required: false,
              default: "png",
              description: "png | svg | base64",
            },
            {
              name: "errorCorrectionLevel",
              type: "string",
              required: false,
              default: "M",
              description: "L | M | Q | H",
            },
            {
              name: "darkColor",
              type: "string",
              required: false,
              default: "#000000",
              description: "QR dark color hex",
            },
            {
              name: "lightColor",
              type: "string",
              required: false,
              default: "#ffffff",
              description: "QR light color hex",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/qr-generator -H "X-API-Key: YOUR_KEY" -d '{"text":"https://dailytools247.app","size":300}'`,
            response: "Binary PNG image",
          },
        },
        {
          method: "POST",
          path: "/api/image/qr-scanner",
          name: "QR Code Scanner",
          description: "Scan and decode QR codes from images",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Image containing QR code (PNG, JPEG, WebP)",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/qr-scanner -H "X-API-Key: YOUR_KEY" -F "image=@qrcode.png"`,
            response: {
              success: true,
              result: { text: "https://example.com", version: 2 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/image/dpi-checker",
          name: "DPI Checker",
          description: "Check image DPI and print dimensions",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Image file",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/dpi-checker -H "X-API-Key: YOUR_KEY" -F "image=@photo.jpg"`,
            response: {
              success: true,
              result: {
                dpi: 72,
                width: 1920,
                height: 1080,
                quality: "Screen (72-149 DPI)",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/image/base64",
          name: "Image Base64",
          description: "Encode image to Base64 or decode Base64 to image",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: false,
              description: "Image file (for encoding)",
            },
            {
              name: "action",
              type: "string",
              required: false,
              default: "encode",
              description: "encode | decode",
            },
            {
              name: "data",
              type: "string",
              required: false,
              description: "Base64 string (for decoding)",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/base64 -H "X-API-Key: YOUR_KEY" -F "image=@photo.jpg" -F "action=encode"`,
            response: {
              success: true,
              result: { base64: "...", dataUrl: "data:image/jpeg;base64,..." },
            },
          },
        },
        {
          method: "POST",
          path: "/api/image/exif-viewer",
          name: "EXIF Viewer",
          description: "View EXIF metadata from images",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Image file",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/exif-viewer -H "X-API-Key: YOUR_KEY" -F "image=@photo.jpg"`,
            response: {
              success: true,
              result: {
                format: "jpeg",
                width: 1920,
                height: 1080,
                dpi: 72,
                hasProfile: true,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/image/favicon-generator",
          name: "Favicon Generator",
          description: "Generate favicons from images",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Image file",
            },
            {
              name: "size",
              type: "number",
              required: false,
              default: 32,
              description: "Size: 16, 32, 48, 64, 128, 256",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/favicon-generator -H "X-API-Key: YOUR_KEY" -F "image=@logo.png" -F "size=32"`,
            response: "Binary PNG image",
          },
        },
        {
          method: "POST",
          path: "/api/image/ai-background-remover",
          name: "AI Background Remover",
          description: "Remove background from images using AI",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Image file (PNG, JPEG, WebP)",
            },
            {
              name: "threshold",
              type: "number",
              required: false,
              default: 30,
              description: "Threshold for background detection (1-100)",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/ai-background-remover -H "X-API-Key: YOUR_KEY" -F "image=@photo.jpg"`,
            response: {
              success: true,
              result: {
                image: "base64...",
                format: "png",
                width: 1920,
                height: 1080,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/image/image-to-pdf",
          name: "Images to PDF",
          description: "Convert multiple images to a single PDF",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "images",
              type: "file[]",
              required: true,
              description: "Image files (up to 20)",
            },
          ],
          example: {
            curl: `curl -X POST /api/image/image-to-pdf -H "X-API-Key: YOUR_KEY" -F "images=@photo1.jpg" -F "images=@photo2.png"`,
            response: "Binary PDF data",
          },
        },
      ],
    },
    {
      category: "PDF",
      endpoints: [
        {
          method: "POST",
          path: "/api/pdf/merge",
          name: "PDF Merge",
          description: "Merge multiple PDF files into one",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "files",
              type: "file[]",
              required: true,
              description: "PDF files to merge (2-20 files)",
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/merge -H "X-API-Key: YOUR_KEY" -F "files=@doc1.pdf" -F "files=@doc2.pdf"`,
            response: "Binary PDF data",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/split",
          name: "PDF Split",
          description: "Extract a range of pages from a PDF",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PDF file to split",
            },
            {
              name: "fromPage",
              type: "number",
              required: false,
              default: 1,
              description: "Start page (1-indexed)",
            },
            {
              name: "toPage",
              type: "number",
              required: false,
              description: "End page (default: last page)",
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/split -H "X-API-Key: YOUR_KEY" -F "file=@doc.pdf" -F "fromPage=1" -F "toPage=3"`,
            response: "Binary PDF data",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/compress",
          name: "PDF Compress",
          description: "Compress a PDF to reduce file size",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PDF file to compress",
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/compress -H "X-API-Key: YOUR_KEY" -F "file=@doc.pdf"`,
            response: "Binary PDF data",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/info",
          name: "PDF Info",
          description: "Get metadata and info from a PDF file",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PDF file to inspect",
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/info -H "X-API-Key: YOUR_KEY" -F "file=@doc.pdf"`,
            response: {
              success: true,
              result: {
                pageCount: 5,
                title: "My Doc",
                author: null,
                fileSizeKB: "120.50",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/pdf/password",
          name: "PDF Password Protect",
          description: "Add password protection to a PDF",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PDF file",
            },
            {
              name: "password",
              type: "string",
              required: true,
              description: "Password to protect the PDF",
            },
            {
              name: "ownerPassword",
              type: "string",
              required: false,
              description: "Owner password (optional)",
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/password -H "X-API-Key: YOUR_KEY" -F "file=@doc.pdf" -F "password=secret123"`,
            response: "Binary PDF data",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/rotate",
          name: "PDF Rotate",
          description: "Rotate pages in a PDF",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PDF file",
            },
            {
              name: "rotation",
              type: "number",
              required: false,
              default: 90,
              description: "Degrees: 90, 180, 270",
            },
            {
              name: "pages",
              type: "string",
              required: false,
              description: 'Page numbers (e.g. "1,3") or "all"',
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/rotate -H "X-API-Key: YOUR_KEY" -F "file=@doc.pdf" -F "rotation=90"`,
            response: "Binary PDF data",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/remove-pages",
          name: "PDF Remove Pages",
          description: "Remove specific pages from a PDF",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PDF file",
            },
            {
              name: "pages",
              type: "string",
              required: true,
              description: 'Page numbers to remove (e.g. "1,3,5")',
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/remove-pages -H "X-API-Key: YOUR_KEY" -F "file=@doc.pdf" -F "pages=2,4"`,
            response: "Binary PDF data",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/unlock",
          name: "PDF Unlock",
          description: "Remove password protection from a PDF (if possible)",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PDF file to unlock",
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/unlock -H "X-API-Key: YOUR_KEY" -F "file=@doc.pdf"`,
            response: "Binary PDF data",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/html-to-pdf",
          name: "HTML to PDF",
          description: "Convert HTML content to a PDF document",
          contentType: "application/json",
          parameters: [
            {
              name: "html",
              type: "string",
              required: true,
              description: "HTML content to convert",
            },
            {
              name: "title",
              type: "string",
              required: false,
              default: "Document",
              description: "PDF document title",
            },
            {
              name: "fontSize",
              type: "number",
              required: false,
              default: 12,
              description: "Base font size (8-18)",
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/html-to-pdf -H "X-API-Key: YOUR_KEY" -d '{"html":"<h1>Hello</h1><p>World</p>","title":"My Doc"}'`,
            response: "Binary PDF data",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/to-word",
          name: "PDF to Word",
          description:
            "Extract text from PDF and create a Word (.docx) document",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PDF file to convert",
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/to-word -H "X-API-Key: YOUR_KEY" -F "file=@doc.pdf"`,
            response: "Binary DOCX data",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/to-excel",
          name: "PDF to Excel",
          description:
            "Extract tabular text from PDF and create an Excel (.xlsx) file",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PDF file to convert",
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/to-excel -H "X-API-Key: YOUR_KEY" -F "file=@doc.pdf"`,
            response: "Binary XLSX data",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/word-to-pdf",
          name: "Word to PDF",
          description: "Convert plain text to PDF",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "Text file (.txt)",
            },
          ],
          example: {
            curl: `curl -X POST /api/pdf/word-to-pdf -H "X-API-Key: YOUR_KEY" -F "file=@document.txt"`,
            response: "Binary PDF data",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/powerpoint-to-pdf",
          name: "PowerPoint to PDF",
          description:
            "Convert PowerPoint presentation to PDF (requires server configuration)",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PowerPoint file (.pptx)",
            },
          ],
          example: {
            curl: 'curl -X POST /api/pdf/powerpoint-to-pdf -H "X-API-Key: YOUR_KEY" -F "file=@presentation.pptx"',
            response: "Binary PDF data or error info",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/to-image",
          name: "PDF to Image",
          description:
            "Convert PDF pages to image format (requires server configuration)",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PDF file",
            },
          ],
          example: {
            curl: 'curl -X POST /api/pdf/to-image -H "X-API-Key: YOUR_KEY" -F "file=@doc.pdf"',
            response: "Binary image data or error info",
          },
        },
        {
          method: "POST",
          path: "/api/pdf/to-powerpoint",
          name: "PDF to PowerPoint",
          description: "Convert PDF pages to PowerPoint presentation slides",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "PDF file",
            },
          ],
          example: {
            curl: 'curl -X POST /api/pdf/to-powerpoint -H "X-API-Key: YOUR_KEY" -F "file=@doc.pdf"',
            response: {
              success: true,
              file: "Base64...",
              filename: "doc.pptx",
              pages: 5,
              slides: 5,
            },
          },
        },
      ],
    },
    {
      category: "Security",
      endpoints: [
        {
          method: "POST",
          path: "/api/security/password-generator",
          name: "Password Generator",
          description: "Generate secure random passwords",
          contentType: "application/json",
          parameters: [
            {
              name: "length",
              type: "number",
              required: false,
              default: 16,
              description: "Password length (4-128)",
            },
            {
              name: "uppercase",
              type: "boolean",
              required: false,
              default: true,
            },
            {
              name: "lowercase",
              type: "boolean",
              required: false,
              default: true,
            },
            {
              name: "numbers",
              type: "boolean",
              required: false,
              default: true,
            },
            {
              name: "symbols",
              type: "boolean",
              required: false,
              default: true,
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/password-generator -H "X-API-Key: YOUR_KEY" -d \'{"length":20}\'',
            response: {
              success: true,
              result: {
                password: "xK9#mP2$vL5@nQ8!",
                strength: "Very Strong",
                length: 20,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/password-strength",
          name: "Password Strength Checker",
          description: "Check password strength and get suggestions",
          contentType: "application/json",
          parameters: [
            {
              name: "password",
              type: "string",
              required: true,
              description: "Password to check",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/password-strength -H "X-API-Key: YOUR_KEY" -d \'{"password":"MyP@ssw0rd123"}\'',
            response: {
              success: true,
              result: {
                score: 83,
                strengthLabel: "Strong",
                checks: {},
                suggestions: [],
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/ai-password-strength-explainer",
          name: "Password Strength Explainer",
          description:
            "Detailed password analysis with entropy and crack time estimation",
          contentType: "application/json",
          parameters: [
            {
              name: "password",
              type: "string",
              required: true,
              description: "Password to analyze",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/ai-password-strength-explainer -H "X-API-Key: YOUR_KEY" -d \'{"password":"MyP@ssw0rd123"}\'',
            response: {
              success: true,
              result: {
                entropy: 65,
                crackTime: "Centuries",
                strength: "Very Strong",
                feedback: [],
                suggestions: [],
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/hash-generator",
          name: "Hash Generator",
          description: "Generate MD5, SHA1, SHA256, SHA384, SHA512 hashes",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "Text to hash",
            },
            {
              name: "algorithm",
              type: "string",
              required: false,
              default: "sha256",
              description: "md5 | sha1 | sha256 | sha384 | sha512",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/hash-generator -H "X-API-Key: YOUR_KEY" -d \'{"text":"hello","algorithm":"sha256"}\'',
            response: {
              success: true,
              result: {
                requested:
                  "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
                all: {},
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/base64",
          name: "Base64 Encoder/Decoder",
          description: "Encode or decode Base64 strings",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "Text to encode/decode",
            },
            {
              name: "action",
              type: "string",
              required: false,
              default: "encode",
              description: "encode | decode",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/base64 -H "X-API-Key: YOUR_KEY" -d \'{"text":"hello world","action":"encode"}\'',
            response: {
              success: true,
              result: { output: "aGVsbG8gd29ybGQ=", action: "encode" },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/uuid-generator",
          name: "UUID Generator",
          description: "Generate random UUID v4 strings",
          contentType: "application/json",
          parameters: [
            {
              name: "count",
              type: "number",
              required: false,
              default: 1,
              description: "Number of UUIDs (1-100)",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/uuid-generator -H "X-API-Key: YOUR_KEY" -d \'{"count":5}\'',
            response: {
              success: true,
              result: {
                uuids: ["550e8400-e29b-41d4-a716-446655440000"],
                count: 1,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/ai-text-redaction",
          name: "Text Redaction",
          description:
            "Redact sensitive information like emails, phones, SSN, credit cards, IPs from text",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "Text to redact",
            },
            {
              name: "redactionTypes",
              type: "object",
              required: false,
              description: "Override which types to redact",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/ai-text-redaction -H "X-API-Key: YOUR_KEY" -d \'{"text":"Contact us at test@example.com or 555-1234"}\'',
            response: {
              success: true,
              result: {
                redacted: "Contact us at [EMAIL REDACTED] or [PHONE REDACTED]",
                totalRedacted: 2,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/file-hash-comparison",
          name: "File Hash Comparison",
          description:
            "Compare two files to check if they are identical using hash",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file1",
              type: "file",
              required: true,
              description: "First file",
            },
            {
              name: "file2",
              type: "file",
              required: true,
              description: "Second file",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/file-hash-comparison -H "X-API-Key: YOUR_KEY" -F "file1=@file1.pdf" -F "file2=@file2.pdf"',
            response: {
              success: true,
              result: {
                match: true,
                file1: { sha256: "...", size: 1024 },
                file2: { sha256: "...", size: 1024 },
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/ai-qr-phishing-scanner",
          name: "QR Phishing Scanner",
          description: "Scan QR code URLs for phishing risks",
          contentType: "application/json",
          parameters: [
            {
              name: "url",
              type: "string",
              required: true,
              description: "URL from QR code",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/ai-qr-phishing-scanner -H "X-API-Key: YOUR_KEY" -d \'{"url":"https://example.com/login"}\'',
            response: {
              success: true,
              result: {
                riskScore: 20,
                riskLevel: "Low Risk",
                risks: [],
                isSafe: true,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/ai-url-reputation-checker",
          name: "URL Reputation Checker",
          description: "Check URL reputation and safety",
          contentType: "application/json",
          parameters: [
            {
              name: "url",
              type: "string",
              required: true,
              description: "URL to check",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/ai-url-reputation-checker -H "X-API-Key: YOUR_KEY" -d \'{"url":"https://example.com"}\'',
            response: {
              success: true,
              result: { reputationScore: 100, rating: "Safe", risks: [] },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/secure-notes",
          name: "Secure Notes",
          description: "Encrypt or decrypt notes with AES-256 encryption",
          contentType: "application/json",
          parameters: [
            {
              name: "note",
              type: "string",
              required: true,
              description: "Note text",
            },
            {
              name: "key",
              type: "string",
              required: true,
              description: "Encryption key/password",
            },
            {
              name: "action",
              type: "string",
              required: false,
              default: "encrypt",
              description: "encrypt | decrypt",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/secure-notes -H "X-API-Key: YOUR_KEY" -d \'{"note":"Secret message","key":"mykey","action":"encrypt"}\'',
            response: {
              success: true,
              result: { output: "...", action: "encrypt" },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/data-breach-checker",
          name: "Data Breach Checker",
          description: "Check if email has been in data breaches",
          contentType: "application/json",
          parameters: [
            {
              name: "email",
              type: "string",
              required: true,
              description: "Email to check",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/data-breach-checker -H "X-API-Key: YOUR_KEY" -d \'{"email":"test@example.com"}\'',
            response: {
              success: true,
              result: {
                email: "test@example.com",
                breachCount: 0,
                checked: true,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/security/exif-location-remover",
          name: "EXIF Location Remover",
          description: "Remove EXIF metadata and GPS location from images",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Image file (JPEG, PNG, WebP)",
            },
          ],
          example: {
            curl: 'curl -X POST /api/security/exif-location-remover -H "X-API-Key: YOUR_KEY" -F "image=@photo.jpg"',
            response: {
              success: true,
              result: {
                hadGpsData: true,
                imageData: "data:image/jpeg;base64,...",
              },
            },
          },
        },
      ],
    },
    {
      category: "Developer",
      endpoints: [
        {
          method: "POST",
          path: "/api/dev/json-formatter",
          name: "JSON Formatter",
          description: "Format, validate and minify JSON",
          contentType: "application/json",
          parameters: [
            {
              name: "json",
              type: "string",
              required: true,
              description: "JSON string to format",
            },
            {
              name: "action",
              type: "string",
              required: false,
              default: "format",
              description: "format | minify | validate",
            },
            {
              name: "indent",
              type: "number",
              required: false,
              default: 2,
              description: "Indentation spaces",
            },
          ],
          example: {
            curl: 'curl -X POST /api/dev/json-formatter -H "X-API-Key: YOUR_KEY" -d \'{"json":"{\\"a\\":1}","action":"format"}\'',
            response: {
              success: true,
              result: { formatted: '{\n  "a": 1\n}', valid: true },
            },
          },
        },
        {
          method: "POST",
          path: "/api/dev/ai-json-to-typescript-interface",
          name: "JSON to TypeScript",
          description: "Convert JSON to TypeScript interfaces",
          contentType: "application/json",
          parameters: [
            {
              name: "json",
              type: "string",
              required: true,
              description: "JSON string",
            },
            {
              name: "interfaceName",
              type: "string",
              required: false,
              default: "RootObject",
              description: "Name for root interface",
            },
          ],
          example: {
            curl: 'curl -X POST /api/dev/ai-json-to-typescript-interface -H "X-API-Key: YOUR_KEY" -d \'{"json":"{\\"name\\":\\"John\\",\\"age\\":30}"}\'',
            response: {
              success: true,
              result: {
                typescript:
                  "interface RootObject {\n  name: string;\n  age: number;\n}",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/dev/url-encoder",
          name: "URL Encoder/Decoder",
          description: "Encode or decode URLs",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "URL or text to encode/decode",
            },
            {
              name: "action",
              type: "string",
              required: false,
              default: "encode",
              description: "encode | decode",
            },
          ],
          example: {
            curl: 'curl -X POST /api/dev/url-encoder -H "X-API-Key: YOUR_KEY" -d \'{"text":"hello world","action":"encode"}\'',
            response: { success: true, result: { output: "hello%20world" } },
          },
        },
        {
          method: "POST",
          path: "/api/dev/lorem-generator",
          name: "Lorem Ipsum Generator",
          description: "Generate placeholder text",
          contentType: "application/json",
          parameters: [
            {
              name: "paragraphs",
              type: "number",
              required: false,
              default: 1,
              description: "Number of paragraphs",
            },
            {
              name: "words",
              type: "number",
              required: false,
              description: "Number of words",
            },
            {
              name: "sentences",
              type: "number",
              required: false,
              description: "Number of sentences",
            },
          ],
          example: {
            curl: 'curl -X POST /api/dev/lorem-generator -H "X-API-Key: YOUR_KEY" -d \'{"paragraphs":3}\'',
            response: { success: true, result: { text: "Lorem ipsum..." } },
          },
        },
        {
          method: "POST",
          path: "/api/dev/ai-sql-query-beautifier",
          name: "SQL Query Beautifier",
          description: "Format and beautify SQL queries",
          contentType: "application/json",
          parameters: [
            {
              name: "sql",
              type: "string",
              required: true,
              description: "SQL query to format",
            },
            {
              name: "indent",
              type: "number",
              required: false,
              default: 2,
              description: "Indentation spaces",
            },
          ],
          example: {
            curl: 'curl -X POST /api/dev/ai-sql-query-beautifier -H "X-API-Key: YOUR_KEY" -d \'{"sql":"SELECT * FROM users WHERE id=1"}\'',
            response: {
              success: true,
              result: {
                formatted: "SELECT\n  *\nFROM\n  users\nWHERE\n  id = 1",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/dev/ai-cron-generator",
          name: "Cron Expression Generator",
          description: "Generate and interpret cron expressions",
          contentType: "application/json",
          parameters: [
            { name: "minute", type: "string", required: false, default: "*" },
            { name: "hour", type: "string", required: false, default: "*" },
            {
              name: "dayOfMonth",
              type: "string",
              required: false,
              default: "*",
            },
            { name: "month", type: "string", required: false, default: "*" },
            {
              name: "dayOfWeek",
              type: "string",
              required: false,
              default: "*",
            },
            {
              name: "description",
              type: "string",
              required: false,
              description: "Custom description",
            },
          ],
          example: {
            curl: 'curl -X POST /api/dev/ai-cron-generator -H "X-API-Key: YOUR_KEY" -d \'{"minute":"0","hour":"9"}\'',
            response: {
              success: true,
              result: {
                expression: "0 9 * * *",
                description: "Every day at 9:00",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/dev/http-header-checker",
          name: "HTTP Header Checker",
          description: "Check HTTP headers and security headers of a URL",
          contentType: "application/json",
          parameters: [
            {
              name: "url",
              type: "string",
              required: true,
              description: "URL to check",
            },
          ],
          example: {
            curl: 'curl -X POST /api/dev/http-header-checker -H "X-API-Key: YOUR_KEY" -d \'{"url":"https://example.com"}\'',
            response: {
              success: true,
              result: {
                url: "https://example.com",
                statusCode: 200,
                securityHeaders: {},
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/dev/curl-to-axios",
          name: "cURL to Axios Converter",
          description: "Convert cURL commands to Axios code",
          contentType: "application/json",
          parameters: [
            {
              name: "curl",
              type: "string",
              required: true,
              description: "cURL command",
            },
          ],
          example: {
            curl: 'curl -X POST /api/dev/curl-to-axios -H "X-API-Key: YOUR_KEY" -d \'{"curl":"curl -X POST https://api.example.com/data"}\'',
            response: {
              success: true,
              result: { axios: "const response = await axios.post(...)" },
            },
          },
        },
        {
          method: "POST",
          path: "/api/dev/jwt-decoder",
          name: "JWT Decoder",
          description: "Decode and inspect JWT tokens",
          contentType: "application/json",
          parameters: [
            {
              name: "token",
              type: "string",
              required: true,
              description: "JWT token",
            },
          ],
          example: {
            curl: 'curl -X POST /api/dev/jwt-decoder -H "X-API-Key: YOUR_KEY" -d \'{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}\'',
            response: {
              success: true,
              result: { header: {}, payload: {}, isExpired: false },
            },
          },
        },
        {
          method: "POST",
          path: "/api/dev/ai-dockerfile-generator",
          name: "Dockerfile Generator",
          description: "Generate Dockerfile for various languages",
          contentType: "application/json",
          parameters: [
            {
              name: "language",
              type: "string",
              required: false,
              default: "node",
              description: "node | python | react | go",
            },
            {
              name: "version",
              type: "string",
              required: false,
              default: "latest",
            },
            { name: "appPort", type: "number", required: false, default: 3000 },
            { name: "startCommand", type: "string", required: false },
          ],
          example: {
            curl: 'curl -X POST /api/dev/ai-dockerfile-generator -H "X-API-Key: YOUR_KEY" -d \'{"language":"node","version":"18"}\'',
            response: {
              success: true,
              result: { dockerfile: "FROM node:18-alpine..." },
            },
          },
        },
        {
          method: "POST",
          path: "/api/dev/color-converter",
          name: "Color Converter",
          description: "Convert colors between HEX, RGB, HSL",
          contentType: "application/json",
          parameters: [
            {
              name: "color",
              type: "string",
              required: true,
              description: "Color value",
            },
            {
              name: "from",
              type: "string",
              required: false,
              default: "hex",
              description: "hex | rgb | hsl",
            },
          ],
          example: {
            curl: 'curl -X POST /api/dev/color-converter -H "X-API-Key: YOUR_KEY" -d \'{"color":"#ff0000","from":"hex"}\'',
            response: {
              success: true,
              result: {
                hex: "#ff0000",
                rgb: { r: 255, g: 0, b: 0 },
                hsl: { h: 0, s: 100, l: 50 },
              },
            },
          },
        },
        {
          method: "GET",
          path: "/api/dev/http-status-codes",
          name: "HTTP Status Codes",
          description: "Get list of standard HTTP status codes",
          contentType: "application/json",
          parameters: [],
          example: {
            curl: 'curl -X GET /api/dev/http-status-codes -H "X-API-Key: YOUR_KEY"',
            response: {
              success: true,
              result: {
                "1xx": { name: "Informational", codes: { 100: "Continue" } },
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/dev/uuid-generator",
          name: "UUID Generator (Dev)",
          description: "Generate multiple random UUIDs (version 1 or 4)",
          contentType: "application/json",
          parameters: [
            {
              name: "count",
              type: "number",
              required: false,
              default: 1,
              description: "Number of UUIDs to generate (1-100)",
            },
            {
              name: "version",
              type: "number",
              required: false,
              default: 4,
              description: "UUID version (1 or 4)",
            },
          ],
          example: {
            curl: 'curl -X POST /api/dev/uuid-generator -H "X-API-Key: YOUR_KEY" -d \'{"count":3,"version":4}\'',
            response: {
              success: true,
              result: {
                uuids: ["uuid1", "uuid2", "uuid3"],
                count: 3,
                version: 4,
              },
            },
          },
        },
      ],
    },
    {
      category: "Finance",
      endpoints: [
        {
          method: "POST",
          path: "/api/finance/emi-calculator",
          name: "EMI Calculator",
          description: "Calculate loan EMI (Equated Monthly Installment)",
          contentType: "application/json",
          parameters: [
            {
              name: "principal",
              type: "number",
              required: true,
              description: "Loan amount",
            },
            {
              name: "rate",
              type: "number",
              required: true,
              description: "Annual interest rate (%)",
            },
            {
              name: "tenure",
              type: "number",
              required: true,
              description: "Loan tenure in months",
            },
            {
              name: "tenureType",
              type: "string",
              required: false,
              default: "months",
              description: "months | years",
            },
          ],
          example: {
            curl: 'curl -X POST /api/finance/emi-calculator -H "X-API-Key: YOUR_KEY" -d \'{"principal":500000,"rate":8.5,"tenure":60}\'',
            response: {
              success: true,
              result: {
                emi: 10233.4,
                totalPayment: 614004,
                totalInterest: 114004,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/emi-comparison",
          name: "EMI Comparison",
          description: "Compare EMIs across different interest rates",
          contentType: "application/json",
          parameters: [
            { name: "principal", type: "number", required: true },
            { name: "tenure", type: "number", required: true },
            {
              name: "tenureType",
              type: "string",
              required: false,
              default: "years",
            },
            {
              name: "rates",
              type: "number[]",
              required: true,
              description: "Array of interest rates to compare",
            },
          ],
          example: {
            curl: 'curl -X POST /api/finance/emi-comparison -H "X-API-Key: YOUR_KEY" -d \'{"principal":500000,"tenure":5,"rates":[8,8.5,9]}\'',
            response: {
              success: true,
              result: {
                comparison: [
                  { rate: 8, emi: 10138 },
                  { rate: 8.5, emi: 10233 },
                ],
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/currency-converter",
          name: "Currency Converter",
          description: "Convert between currencies using live rates",
          contentType: "application/json",
          parameters: [
            { name: "amount", type: "number", required: true },
            { name: "from", type: "string", required: false, default: "USD" },
            { name: "to", type: "string", required: false, default: "EUR" },
          ],
          example: {
            curl: 'curl -X POST /api/finance/currency-converter -H "X-API-Key: YOUR_KEY" -d \'{"amount":100,"from":"USD","to":"EUR"}\'',
            response: {
              success: true,
              result: { from: "USD", to: "EUR", amount: 100, converted: 92.5 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/gst-calculator",
          name: "GST Calculator",
          description: "Calculate GST amount (India)",
          contentType: "application/json",
          parameters: [
            { name: "amount", type: "number", required: true },
            { name: "gstRate", type: "number", required: true },
            {
              name: "type",
              type: "string",
              required: false,
              default: "exclusive",
              description: "exclusive | inclusive",
            },
          ],
          example: {
            curl: 'curl -X POST /api/finance/gst-calculator -H "X-API-Key: YOUR_KEY" -d \'{"amount":1000,"gstRate":18}\'',
            response: {
              success: true,
              result: { original: 1000, gstAmount: 180, total: 1180 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/profit-margin",
          name: "Profit Margin Calculator",
          description: "Calculate profit margin and markup",
          contentType: "application/json",
          parameters: [
            { name: "cost", type: "number", required: true },
            { name: "revenue", type: "number", required: true },
            { name: "sellingPrice", type: "number", required: false },
          ],
          example: {
            curl: 'curl -X POST /api/finance/profit-margin -H "X-API-Key: YOUR_KEY" -d \'{"cost":80,"revenue":100}\'',
            response: {
              success: true,
              result: {
                cost: 80,
                revenue: 100,
                profit: 20,
                grossMargin: 20,
                markup: 25,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/salary-calculator",
          name: "Salary Calculator",
          description: "Convert salary between annual, monthly, weekly, hourly",
          contentType: "application/json",
          parameters: [
            { name: "grossSalary", type: "number", required: true },
            {
              name: "frequency",
              type: "string",
              required: false,
              default: "annual",
              description: "annual | monthly | weekly | hourly",
            },
          ],
          example: {
            curl: 'curl -X POST /api/finance/salary-calculator -H "X-API-Key: YOUR_KEY" -d \'{"grossSalary":60000,"frequency":"annual"}\'',
            response: {
              success: true,
              result: {
                annual: 60000,
                monthly: 5000,
                weekly: 1154,
                hourly: 29,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/compound-interest",
          name: "Compound Interest Calculator",
          description: "Calculate compound interest",
          contentType: "application/json",
          parameters: [
            { name: "principal", type: "number", required: true },
            { name: "rate", type: "number", required: true },
            { name: "time", type: "number", required: true },
            {
              name: "compoundFrequency",
              type: "number",
              required: false,
              default: 12,
            },
          ],
          example: {
            curl: 'curl -X POST /api/finance/compound-interest -H "X-API-Key: YOUR_KEY" -d \'{"principal":10000,"rate":5,"time":5}\'',
            response: {
              success: true,
              result: { principal: 10000, amount: 12833.59, interest: 2833.59 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/salary-breakup-generator",
          name: "Salary Breakup Generator",
          description: "Generate detailed salary breakup (India)",
          contentType: "application/json",
          parameters: [
            { name: "ctc", type: "number", required: true },
            {
              name: "city",
              type: "string",
              required: false,
              default: "metro",
              description: "metro | non-metro",
            },
          ],
          example: {
            curl: 'curl -X POST /api/finance/salary-breakup-generator -H "X-API-Key: YOUR_KEY" -d \'{"ctc":1200000,"city":"metro"}\'',
            response: {
              success: true,
              result: { annual: 1200000, monthly: 100000, breakdown: {} },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/ai-tax-slab-analyzer",
          name: "Tax Slab Analyzer",
          description: "Analyze income tax slabs (India)",
          contentType: "application/json",
          parameters: [
            { name: "income", type: "number", required: true },
            {
              name: "regime",
              type: "string",
              required: false,
              default: "new",
              description: "new | old",
            },
            {
              name: "age_group",
              type: "string",
              required: false,
              default: "below_60",
            },
          ],
          example: {
            curl: 'curl -X POST /api/finance/ai-tax-slab-analyzer -H "X-API-Key: YOUR_KEY" -d \'{"income":1000000}\'',
            response: {
              success: true,
              result: {
                income: 1000000,
                totalTax: 112500,
                effectiveRate: 11.25,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/invoice-generator",
          name: "Invoice Generator",
          description: "Generate professional invoice HTML",
          contentType: "application/json",
          parameters: [
            { name: "company_name", type: "string", required: true },
            { name: "client_name", type: "string", required: true },
            {
              name: "items",
              type: "array",
              required: true,
              description: "Array of line items",
            },
            { name: "invoice_number", type: "string", required: false },
            { name: "invoice_date", type: "string", required: false },
            {
              name: "currency",
              type: "string",
              required: false,
              default: "INR",
            },
          ],
          example: {
            curl: `curl -X POST /api/finance/invoice-generator -H "X-API-Key: YOUR_KEY" -d '{"company_name":"ABC Corp","client_name":"XYZ Inc","items":[{"name":"Service","quantity":1,"price":1000}]}'`,
            response: "HTML invoice document",
          },
        },
        {
          method: "POST",
          path: "/api/finance/burn-rate-calculator",
          name: "Burn Rate Calculator",
          description:
            "Calculate gross burn rate, net burn, and runway months for a business",
          contentType: "application/json",
          parameters: [
            {
              name: "monthlyExpenses",
              type: "array",
              required: true,
              description: "List of monthly expenses or total expense number",
            },
            {
              name: "monthlyRevenue",
              type: "number",
              required: false,
              default: 0,
            },
            {
              name: "cashBalance",
              type: "number",
              required: false,
              default: 0,
            },
          ],
          example: {
            curl: 'curl -X POST /api/finance/burn-rate-calculator -H "X-API-Key: YOUR_KEY" -d \'{"monthlyExpenses":[{"name":"rent","amount":2000}],"monthlyRevenue":1000,"cashBalance":10000}\'',
            response: {
              success: true,
              result: {
                grossBurn: 2000,
                revenue: 1000,
                netBurn: 1000,
                cashBalance: 10000,
                runwayMonths: 10,
                runwayDate: "March 2027",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/freelancer-rate-calculator",
          name: "Freelancer Rate Calculator",
          description:
            "Calculate target hourly, daily, weekly, and monthly rates for freelancers",
          contentType: "application/json",
          parameters: [
            {
              name: "annualIncome",
              type: "number",
              required: true,
              description: "Desired net annual income",
            },
            {
              name: "weeklyHours",
              type: "number",
              required: false,
              default: 40,
            },
            { name: "weeksOff", type: "number", required: false, default: 4 },
            {
              name: "businessExpenses",
              type: "number",
              required: false,
              default: 0,
            },
            { name: "taxRate", type: "number", required: false, default: 30 },
            {
              name: "billablePercent",
              type: "number",
              required: false,
              default: 70,
            },
          ],
          example: {
            curl: 'curl -X POST /api/finance/freelancer-rate-calculator -H "X-API-Key: YOUR_KEY" -d \'{"annualIncome":80000,"weeklyHours":40,"weeksOff":4,"businessExpenses":5000,"taxRate":25}\'',
            response: {
              success: true,
              result: {
                hourlyRate: 85,
                dailyRate: 680,
                weeklyRate: 2380,
                monthlyRate: 9444,
                annualGross: 113333,
                billableHoursPerYear: 1344,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/roi-calculator",
          name: "ROI Calculator",
          description:
            "Calculate Return on Investment (ROI) and Compound Annual Growth Rate (CAGR)",
          contentType: "application/json",
          parameters: [
            { name: "initialInvestment", type: "number", required: true },
            { name: "finalValue", type: "number", required: true },
            {
              name: "years",
              type: "number",
              required: true,
              description: "Time period in years",
            },
            { name: "months", type: "number", required: false, default: 0 },
          ],
          example: {
            curl: 'curl -X POST /api/finance/roi-calculator -H "X-API-Key: YOUR_KEY" -d \'{"initialInvestment":10000,"finalValue":15000,"years":3}\'',
            response: {
              success: true,
              result: {
                initialInvestment: 10000,
                finalValue: 15000,
                totalYears: 3,
                absoluteGain: 5000,
                roiPercentage: 50,
                annualizedRoi: 14.47,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/sip-calculator",
          name: "SIP Calculator",
          description:
            "Calculate Systematic Investment Plan (SIP) returns and future wealth gain",
          contentType: "application/json",
          parameters: [
            { name: "monthlyInvestment", type: "number", required: true },
            {
              name: "annualRate",
              type: "number",
              required: true,
              description: "Expected annual return rate (%)",
            },
            { name: "years", type: "number", required: true },
          ],
          example: {
            curl: 'curl -X POST /api/finance/sip-calculator -H "X-API-Key: YOUR_KEY" -d \'{"monthlyInvestment":2000,"annualRate":12,"years":5}\'',
            response: {
              success: true,
              result: {
                monthlyInvestment: 2000,
                annualRate: 12,
                years: 5,
                totalInvested: 120000,
                amount: 164973,
                wealthGain: 44973,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/stock-cagr-calculator",
          name: "Stock CAGR Calculator",
          description:
            "Calculate Compound Annual Growth Rate (CAGR) and absolute returns for stocks",
          contentType: "application/json",
          parameters: [
            { name: "initialValue", type: "number", required: true },
            { name: "finalValue", type: "number", required: true },
            {
              name: "years",
              type: "number",
              required: false,
              description: "Time period in years",
            },
            {
              name: "initialDate",
              type: "string",
              required: false,
              description: "YYYY-MM-DD (Alternative to years)",
            },
            {
              name: "finalDate",
              type: "string",
              required: false,
              description: "YYYY-MM-DD",
            },
          ],
          example: {
            curl: 'curl -X POST /api/finance/stock-cagr-calculator -H "X-API-Key: YOUR_KEY" -d \'{"initialValue":100,"finalValue":200,"years":5}\'',
            response: {
              success: true,
              result: {
                initialValue: 100,
                finalValue: 200,
                years: 5,
                cagr: 14.87,
                absoluteReturn: 100,
                gain: 100,
              },
            },
          },
        },
      ],
    },
    {
      category: "SEO",
      endpoints: [
        {
          method: "POST",
          path: "/api/seo/meta-title-description",
          name: "Meta Title & Description Checker",
          description:
            "Check and analyze meta title and description from a URL",
          contentType: "application/json",
          parameters: [
            {
              name: "url",
              type: "string",
              required: true,
              description: "URL to analyze",
            },
          ],
          example: {
            curl: `curl -X POST /api/seo/meta-title-description -H "X-API-Key: YOUR_KEY" -d '{"url":"https://example.com"}'`,
            response: {
              success: true,
              result: {
                title: "Example",
                titleLength: 7,
                description: "...",
                descriptionLength: 50,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/seo/keyword-density-checker",
          name: "Keyword Density Analyzer",
          description: "Analyze keyword density in text",
          contentType: "application/json",
          parameters: [
            { name: "text", type: "string", required: true },
            { name: "topN", type: "number", required: false, default: 20 },
          ],
          example: {
            curl: `curl -X POST /api/seo/keyword-density-checker -H "X-API-Key: YOUR_KEY" -d '{"text":"Your text here..."}'`,
            response: {
              success: true,
              result: {
                totalWords: 100,
                keywords: [{ word: "example", count: 5, density: "5%" }],
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/seo/robots-txt-generator",
          name: "Robots.txt Generator",
          description: "Generate robots.txt file",
          contentType: "application/json",
          parameters: [
            {
              name: "userAgent",
              type: "string",
              required: false,
              default: "*",
            },
            { name: "disallowPaths", type: "array", required: false },
            { name: "allowPaths", type: "array", required: false },
            { name: "sitemap", type: "string", required: false },
          ],
          example: {
            curl: `curl -X POST /api/seo/robots-txt-generator -H "X-API-Key: YOUR_KEY" -d '{"disallowPaths":["/admin"]}'`,
            response: {
              success: true,
              result: { robotsTxt: "User-agent: *\nDisallow: /admin" },
            },
          },
        },
        {
          method: "POST",
          path: "/api/seo/sitemap-validator",
          name: "Sitemap Validator",
          description: "Validate and parse XML sitemap",
          contentType: "application/json",
          parameters: [{ name: "url", type: "string", required: true }],
          example: {
            curl: `curl -X POST /api/seo/sitemap-validator -H "X-API-Key: YOUR_KEY" -d '{"url":"https://example.com/sitemap.xml"}'`,
            response: {
              success: true,
              result: { isValid: true, urlCount: 50 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/seo/og-image-preview",
          name: "Open Graph Preview",
          description: "Extract Open Graph and Twitter Card meta tags",
          contentType: "application/json",
          parameters: [{ name: "url", type: "string", required: true }],
          example: {
            curl: `curl -X POST /api/seo/og-image-preview -H "X-API-Key: YOUR_KEY" -d '{"url":"https://example.com"}'`,
            response: {
              success: true,
              result: {
                og: { title: "...", image: "..." },
                twitter: { card: "summary" },
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/seo/broken-image-finder",
          name: "Broken Image Finder",
          description: "Find broken images on a webpage",
          contentType: "application/json",
          parameters: [{ name: "url", type: "string", required: true }],
          example: {
            curl: `curl -X POST /api/seo/broken-image-finder -H "X-API-Key: YOUR_KEY" -d '{"url":"https://example.com"}'`,
            response: {
              success: true,
              result: { totalImages: 20, brokenImages: 2 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/seo/domain-age-checker",
          name: "Domain Age Checker",
          description: "Check domain age and registration info",
          contentType: "application/json",
          parameters: [{ name: "domain", type: "string", required: true }],
          example: {
            curl: `curl -X POST /api/seo/domain-age-checker -H "X-API-Key: YOUR_KEY" -d '{"domain":"example.com"}'`,
            response: {
              success: true,
              result: {
                domain: "example.com",
                age: 15,
                creationDate: "2009-01-01",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/seo/ai-tech-stack-detector",
          name: "Tech Stack Detector",
          description: "Detect technologies used by a website",
          contentType: "application/json",
          parameters: [{ name: "url", type: "string", required: true }],
          example: {
            curl: `curl -X POST /api/seo/ai-tech-stack-detector -H "X-API-Key: YOUR_KEY" -d '{"url":"https://example.com"}'`,
            response: {
              success: true,
              result: { technologies: ["React", "Node.js", "MongoDB"] },
            },
          },
        },
        {
          method: "POST",
          path: "/api/seo/utm-link-builder",
          name: "UTM Link Builder",
          description: "Build UTM tracking links",
          contentType: "application/json",
          parameters: [
            { name: "url", type: "string", required: true },
            { name: "source", type: "string", required: true },
            { name: "medium", type: "string", required: false, default: "cpc" },
            { name: "campaign", type: "string", required: true },
            { name: "term", type: "string", required: false },
            { name: "content", type: "string", required: false },
          ],
          example: {
            curl: `curl -X POST /api/seo/utm-link-builder -H "X-API-Key: YOUR_KEY" -d '{"url":"https://example.com","source":"google","campaign":"spring"}'`,
            response: {
              success: true,
              result: {
                url: "https://example.com?utm_source=google&utm_campaign=spring",
              },
            },
          },
        },
      ],
    },
    {
      category: "Social Media",
      endpoints: [
        {
          method: "POST",
          path: "/api/social/ai-hashtag-generator",
          name: "Hashtag Generator",
          description: "Generate relevant hashtags for social media posts",
          contentType: "application/json",
          parameters: [
            { name: "topic", type: "string", required: true },
            { name: "niche", type: "string", required: false },
            { name: "count", type: "number", required: false, default: 30 },
          ],
          example: {
            curl: `curl -X POST /api/social/ai-hashtag-generator -H "X-API-Key: YOUR_KEY" -d '{"topic":"fitness","count":20}'`,
            response: {
              success: true,
              result: {
                hashtags: ["#fitness", "#workout", "#health"],
                count: 20,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/social/ai-bio-generator",
          name: "Bio Generator",
          description: "Generate social media bios",
          contentType: "application/json",
          parameters: [
            { name: "name", type: "string", required: true },
            { name: "profession", type: "string", required: true },
            { name: "skills", type: "array", required: false },
            { name: "emoji", type: "boolean", required: false, default: true },
            {
              name: "platform",
              type: "string",
              required: false,
              default: "instagram",
              description: "instagram | linkedin | twitter",
            },
          ],
          example: {
            curl: `curl -X POST /api/social/ai-bio-generator -H "X-API-Key: YOUR_KEY" -d '{"name":"John","profession":"Developer","platform":"linkedin"}'`,
            response: {
              success: true,
              result: {
                bio: "John | Developer | Passionate about innovation",
                characterCount: 50,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/social/caption-formatter",
          name: "Caption Formatter",
          description: "Format social media captions with special styles",
          contentType: "application/json",
          parameters: [
            { name: "text", type: "string", required: true },
            {
              name: "style",
              type: "string",
              required: false,
              default: "default",
              description: "default | spaced | bold | italic",
            },
            {
              name: "addEmojis",
              type: "boolean",
              required: false,
              default: false,
            },
          ],
          example: {
            curl: `curl -X POST /api/social/caption-formatter -H "X-API-Key: YOUR_KEY" -d '{"text":"Hello World","style":"bold"}'`,
            response: {
              success: true,
              result: { formatted: "𝐇𝐞𝐥𝐥𝐨 𝐖𝐨𝐫𝐥𝐝", style: "bold" },
            },
          },
        },
        {
          method: "POST",
          path: "/api/social/line-break-generator",
          name: "Line Break Generator",
          description: "Add line breaks for social media platforms",
          contentType: "application/json",
          parameters: [
            { name: "text", type: "string", required: true },
            {
              name: "platform",
              type: "string",
              required: false,
              default: "instagram",
              description: "instagram | generic",
            },
          ],
          example: {
            curl: `curl -X POST /api/social/line-break-generator -H "X-API-Key: YOUR_KEY" -d '{"text":"Line 1\\nLine 2\\nLine 3"}'`,
            response: {
              success: true,
              result: {
                formatted: "Line 1\n.\nLine 2\n.\nLine 3",
                platform: "instagram",
              },
            },
          },
        },
      ],
    },
    {
      category: "Internet",
      endpoints: [
        {
          method: "POST",
          path: "/api/internet/ip-lookup",
          name: "IP Lookup",
          description: "Lookup IP address information",
          contentType: "application/json",
          parameters: [
            {
              name: "ip",
              type: "string",
              required: false,
              description: "IP address (defaults to client IP)",
            },
          ],
          example: {
            curl: `curl -X POST /api/internet/ip-lookup -H "X-API-Key: YOUR_KEY" -d '{"ip":"8.8.8.8"}'`,
            response: {
              success: true,
              result: {
                ip: "8.8.8.8",
                country: "United States",
                city: "Mountain View",
                isp: "Google LLC",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/internet/dns-lookup",
          name: "DNS Lookup",
          description: "Perform DNS record lookups",
          contentType: "application/json",
          parameters: [
            { name: "domain", type: "string", required: true },
            {
              name: "recordType",
              type: "string",
              required: false,
              default: "A",
              description: "A | AAAA | MX | TXT | NS | CNAME | SOA",
            },
          ],
          example: {
            curl: `curl -X POST /api/internet/dns-lookup -H "X-API-Key: YOUR_KEY" -d '{"domain":"example.com","recordType":"A"}'`,
            response: {
              success: true,
              result: {
                domain: "example.com",
                recordType: "A",
                records: ["93.184.216.34"],
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/internet/ssl-checker",
          name: "SSL Checker",
          description: "Check SSL certificate information",
          contentType: "application/json",
          parameters: [{ name: "domain", type: "string", required: true }],
          example: {
            curl: `curl -X POST /api/internet/ssl-checker -H "X-API-Key: YOUR_KEY" -d '{"domain":"example.com"}'`,
            response: {
              success: true,
              result: {
                domain: "example.com",
                isValid: true,
                daysRemaining: 90,
                issuer: "Let's Encrypt",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/internet/website-ping",
          name: "Website Ping",
          description: "Ping a website to check availability and response time",
          contentType: "application/json",
          parameters: [{ name: "url", type: "string", required: true }],
          example: {
            curl: `curl -X POST /api/internet/website-ping -H "X-API-Key: YOUR_KEY" -d '{"url":"https://example.com"}'`,
            response: {
              success: true,
              result: {
                url: "https://example.com",
                avgTime: 45,
                status: "online",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/internet/user-agent",
          name: "User Agent Parser",
          description: "Parse and analyze user agent strings",
          contentType: "application/json",
          parameters: [{ name: "userAgent", type: "string", required: false }],
          example: {
            curl: 'curl -X POST /api/internet/user-agent -H "X-API-Key: YOUR_KEY" -d \'{"userAgent":"Mozilla/5.0 (Windows NT 10.0) Chrome/120.0"}\'',
            response: {
              success: true,
              result: {
                browser: "Chrome",
                os: "Windows",
                deviceType: "Desktop",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/internet/website-screenshot",
          name: "Website Screenshot",
          description: "Capture screenshot of a website",
          contentType: "application/json",
          parameters: [
            { name: "url", type: "string", required: true },
            { name: "width", type: "number", required: false, default: 1440 },
            { name: "height", type: "number", required: false, default: 900 },
            {
              name: "format",
              type: "string",
              required: false,
              default: "png",
              description: "png | jpeg",
            },
          ],
          example: {
            curl: 'curl -X POST /api/internet/website-screenshot -H "X-API-Key: YOUR_KEY" -d \'{"url":"https://example.com","width":1440}\'',
            response: {
              success: true,
              result: {
                screenshot: "data:image/png;base64,...",
                width: 1440,
                height: 900,
              },
            },
          },
        },
      ],
    },
    {
      category: "Govt & Legal",
      endpoints: [
        {
          method: "POST",
          path: "/api/govt-legal/document-template",
          name: "Document Template Generator",
          description: "Generate legal document and agreement templates",
          contentType: "application/json",
          parameters: [
            {
              name: "templateType",
              type: "string",
              required: true,
              description: "Type of document template",
            },
            {
              name: "data",
              type: "object",
              required: true,
              description: "Document data fields",
            },
          ],
          example: {
            curl: 'curl -X POST /api/govt-legal/document-template -H "X-API-Key: YOUR_KEY" -d \'{"templateType":"nda","data":{"party1":"John Doe","party2":"Jane Smith"}}\'',
            response: {
              success: true,
              result: { document: "Generated document content..." },
            },
          },
        },
        {
          method: "POST",
          path: "/api/govt-legal/pdf-compressor",
          name: "PDF Compressor",
          description: "Compress PDF files for document submission",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "pdf",
              type: "file",
              required: true,
              description: "PDF file to compress",
            },
            {
              name: "compressionLevel",
              type: "string",
              required: false,
              default: "medium",
              description: "low | medium | high",
            },
          ],
          example: {
            curl: 'curl -X POST /api/govt-legal/pdf-compressor -H "X-API-Key: YOUR_KEY" -F "pdf=@document.pdf" -F "compressionLevel=medium"',
            response: "Binary compressed PDF",
          },
        },
        {
          method: "POST",
          path: "/api/govt-legal/passport-photo-resizer",
          name: "Passport Photo Resizer",
          description: "Resize photos for passport and Aadhaar under 50KB",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Photo to resize",
            },
            {
              name: "preset",
              type: "string",
              required: false,
              default: "passport",
              description: "passport | aadhaar | visa | pan | license",
            },
          ],
          example: {
            curl: 'curl -X POST /api/govt-legal/passport-photo-resizer -H "X-API-Key: YOUR_KEY" -F "image=@photo.jpg" -F "preset=passport"',
            response: "Binary resized photo",
          },
        },
        {
          method: "POST",
          path: "/api/govt-legal/signature-maker",
          name: "Signature Maker",
          description: "Draw and create digital signatures",
          contentType: "application/json",
          parameters: [
            {
              name: "signatureData",
              type: "string",
              required: true,
              description: "Base64 encoded signature image",
            },
            {
              name: "format",
              type: "string",
              required: false,
              default: "png",
              description: "png | svg | base64",
            },
          ],
          example: {
            curl: 'curl -X POST /api/govt-legal/signature-maker -H "X-API-Key: YOUR_KEY" -d \'{"signatureData":"data:image/png;base64,...","format":"png"}\'',
            response: {
              success: true,
              result: { signature: "Processed signature data..." },
            },
          },
        },
      ],
    },
    {
      category: "Ecommerce",
      endpoints: [
        {
          method: "POST",
          path: "/api/ecommerce/barcode-generator",
          name: "Barcode Generator",
          description: "Generate barcodes for products and inventory",
          contentType: "application/json",
          parameters: [
            {
              name: "text",
              type: "string",
              required: true,
              description: "Text to encode in barcode",
            },
            {
              name: "format",
              type: "string",
              required: false,
              default: "CODE128",
              description:
                "CODE128 | CODE39 | EAN13 | EAN8 | UPC | ITF14 | MSI | pharmacode",
            },
            {
              name: "width",
              type: "number",
              required: false,
              default: 2,
              description: "Bar width",
            },
            {
              name: "height",
              type: "number",
              required: false,
              default: 100,
              description: "Barcode height",
            },
          ],
          example: {
            curl: 'curl -X POST /api/ecommerce/barcode-generator -H "X-API-Key: YOUR_KEY" -d \'{"text":"123456789","format":"CODE128"}\'',
            response: "Binary barcode image",
          },
        },
        {
          method: "POST",
          path: "/api/ecommerce/bulk-image-resizer",
          name: "Bulk Image Resizer",
          description: "Resize multiple images at once for e-commerce",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "images",
              type: "file[]",
              required: true,
              description: "Array of image files",
            },
            {
              name: "width",
              type: "number",
              required: false,
              default: 800,
              description: "Target width",
            },
            {
              name: "height",
              type: "number",
              required: false,
              default: 800,
              description: "Target height",
            },
            {
              name: "maintainAspect",
              type: "boolean",
              required: false,
              default: true,
              description: "Maintain aspect ratio",
            },
          ],
          example: {
            curl: 'curl -X POST /api/ecommerce/bulk-image-resizer -H "X-API-Key: YOUR_KEY" -F "images=@photo1.jpg" -F "images=@photo2.jpg" -F "width=800"',
            response: {
              success: true,
              result: { processedImages: ["data:image/jpeg;base64,..."] },
            },
          },
        },
        {
          method: "POST",
          path: "/api/ecommerce/calculator",
          name: "Ecommerce Calculator",
          description:
            "Calculate GST, profit margins, and EMI for your business",
          contentType: "application/json",
          parameters: [
            {
              name: "type",
              type: "string",
              required: true,
              description: "gst | margin | emi",
            },
            {
              name: "data",
              type: "object",
              required: true,
              description: "Calculation data based on type",
            },
          ],
          example: {
            curl: 'curl -X POST /api/ecommerce/calculator -H "X-API-Key: YOUR_KEY" -d \'{"type":"gst","data":{"amount":1000,"rate":18,"type":"exclusive"}}\'',
            response: {
              success: true,
              result: { gstAmount: 180, totalAmount: 1180 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/ecommerce/gst-invoice-generator",
          name: "GST Invoice Generator",
          description: "Create GST-compliant invoices for your business",
          contentType: "application/json",
          parameters: [
            {
              name: "businessName",
              type: "string",
              required: true,
              description: "Business name",
            },
            {
              name: "businessGST",
              type: "string",
              required: true,
              description: "Business GST number",
            },
            {
              name: "clientName",
              type: "string",
              required: true,
              description: "Client name",
            },
            {
              name: "items",
              type: "array",
              required: true,
              description: "Array of invoice items",
            },
          ],
          example: {
            curl: 'curl -X POST /api/ecommerce/gst-invoice-generator -H "X-API-Key: YOUR_KEY" -d \'{"businessName":"ABC Corp","businessGST":"27AAAPL1234C1ZV","clientName":"XYZ Ltd","items":[{"description":"Product A","quantity":2,"price":500}]}\'',
            response: {
              success: true,
              result: { invoicePdf: "data:application/pdf;base64,..." },
            },
          },
        },
        {
          method: "POST",
          path: "/api/ecommerce/image-color-enhancer",
          name: "Image Color Enhancer",
          description: "Enhance colors in product photos",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Product image to enhance",
            },
            {
              name: "brightness",
              type: "number",
              required: false,
              default: 0,
              description: "Brightness adjustment (-100 to 100)",
            },
            {
              name: "contrast",
              type: "number",
              required: false,
              default: 0,
              description: "Contrast adjustment (-100 to 100)",
            },
            {
              name: "saturation",
              type: "number",
              required: false,
              default: 0,
              description: "Saturation adjustment (-100 to 100)",
            },
          ],
          example: {
            curl: 'curl -X POST /api/ecommerce/image-color-enhancer -H "X-API-Key: YOUR_KEY" -F "image=@product.jpg" -F "brightness=10" -F "contrast=5"',
            response: "Binary enhanced image",
          },
        },
        {
          method: "POST",
          path: "/api/ecommerce/shadow-adder",
          name: "Shadow Adder",
          description: "Add professional shadows to product images",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Product image",
            },
            {
              name: "shadowBlur",
              type: "number",
              required: false,
              default: 20,
              description: "Shadow blur radius",
            },
            {
              name: "shadowOffsetX",
              type: "number",
              required: false,
              default: 0,
              description: "Horizontal shadow offset",
            },
            {
              name: "shadowOffsetY",
              type: "number",
              required: false,
              default: 10,
              description: "Vertical shadow offset",
            },
            {
              name: "shadowColor",
              type: "string",
              required: false,
              default: "#000000",
              description: "Shadow color hex",
            },
            {
              name: "shadowOpacity",
              type: "number",
              required: false,
              default: 0.3,
              description: "Shadow opacity (0-1)",
            },
          ],
          example: {
            curl: 'curl -X POST /api/ecommerce/shadow-adder -H "X-API-Key: YOUR_KEY" -F "image=@product.jpg" -F "shadowBlur=20" -F "shadowColor="#000000"',
            response: "Binary image with shadow",
          },
        },
        {
          method: "POST",
          path: "/api/ecommerce/watermark-adder",
          name: "Watermark Adder",
          description: "Add watermarks to protect product images",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Product image",
            },
            {
              name: "watermarkText",
              type: "string",
              required: true,
              description: "Watermark text",
            },
            {
              name: "fontSize",
              type: "number",
              required: false,
              default: 24,
              description: "Font size",
            },
            {
              name: "opacity",
              type: "number",
              required: false,
              default: 50,
              description: "Opacity percentage (0-100)",
            },
            {
              name: "position",
              type: "string",
              required: false,
              default: "bottom-right",
              description:
                "top-left | top-right | bottom-left | bottom-right | center",
            },
          ],
          example: {
            curl: 'curl -X POST /api/ecommerce/watermark-adder -H "X-API-Key: YOUR_KEY" -F "image=@product.jpg" -F "watermarkText=© Your Brand" -F "opacity=50"',
            response: "Binary watermarked image",
          },
        },
        {
          method: "POST",
          path: "/api/ecommerce/white-background-adder",
          name: "White Background Adder",
          description: "Add white background to product images",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "image",
              type: "file",
              required: true,
              description: "Product image",
            },
          ],
          example: {
            curl: 'curl -X POST /api/ecommerce/white-background-adder -H "X-API-Key: YOUR_KEY" -F "image=@product.jpg"',
            response: "Binary image with white background",
          },
        },
      ],
    },
    {
      category: "Audio",
      endpoints: [
        {
          method: "POST",
          path: "/api/audio/convert",
          name: "Audio Converter",
          description:
            "Convert between audio formats (mp3, wav, aac, ogg, m4a)",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "audio",
              type: "file",
              required: true,
              description: "Audio file to convert",
            },
            {
              name: "format",
              type: "string",
              required: true,
              default: "mp3",
              description: "Target format (mp3 | wav | aac | ogg | m4a)",
            },
          ],
          example: {
            curl: 'curl -X POST /api/audio/convert -H "X-API-Key: YOUR_KEY" -F "audio=@song.wav" -F "format=mp3"',
            response: "Binary audio data",
          },
        },
        {
          method: "POST",
          path: "/api/audio/ai-speech-to-text",
          name: "AI Speech to Text",
          description:
            "Convert speech in audio files to text transcript using AI",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "audio",
              type: "file",
              required: true,
              description: "Audio file with speech (wav, mp3, m4a)",
            },
          ],
          example: {
            curl: 'curl -X POST /api/audio/ai-speech-to-text -H "X-API-Key: YOUR_KEY" -F "audio=@recording.wav"',
            response: {
              success: true,
              result: {
                text: "Hello, this is a transcript of the audio recording.",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/audio/trim",
          name: "Audio Trimmer",
          description: "Cut/trim audio files",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "audio",
              type: "file",
              required: true,
              description: "Audio file",
            },
            {
              name: "start",
              type: "number",
              required: true,
              description: "Start time in seconds",
            },
            {
              name: "end",
              type: "number",
              required: true,
              description: "End time in seconds",
            },
          ],
          example: {
            curl: 'curl -X POST /api/audio/trim -H "X-API-Key: YOUR_KEY" -F "audio=@song.mp3" -F "start=10" -F "end=30"',
            response: "Binary audio data",
          },
        },
        {
          method: "POST",
          path: "/api/audio/merge",
          name: "Audio Merger",
          description: "Merge multiple audio files into one",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "audioFiles",
              type: "file[]",
              required: true,
              description: "Audio files to merge",
            },
          ],
          example: {
            curl: 'curl -X POST /api/audio/merge -H "X-API-Key: YOUR_KEY" -F "audioFiles=@part1.mp3" -F "audioFiles=@part2.mp3"',
            response: "Binary merged audio data",
          },
        },
        {
          method: "POST",
          path: "/api/audio/speed",
          name: "Audio Speed Changer",
          description: "Change speed of audio files",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "audio",
              type: "file",
              required: true,
              description: "Audio file",
            },
            {
              name: "speed",
              type: "number",
              required: true,
              default: 1.0,
              description: "Speed factor (0.5 to 2.0)",
            },
          ],
          example: {
            curl: 'curl -X POST /api/audio/speed -H "X-API-Key: YOUR_KEY" -F "audio=@song.mp3" -F "speed=1.5"',
            response: "Binary speed-adjusted audio data",
          },
        },
      ],
    },
    {
      category: "Video",
      endpoints: [
        {
          method: "POST",
          path: "/api/video/video-to-audio",
          name: "Video to Audio Converter",
          description: "Extract audio from video files",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "video",
              type: "file",
              required: true,
              description: "Video file (mp4, avi, mov)",
            },
            {
              name: "format",
              type: "string",
              required: false,
              default: "mp3",
              description: "mp3 | wav",
            },
          ],
          example: {
            curl: 'curl -X POST /api/video/video-to-audio -H "X-API-Key: YOUR_KEY" -F "video=@movie.mp4"',
            response: "Binary extracted audio file",
          },
        },
        {
          method: "POST",
          path: "/api/video/trim",
          name: "Video Trimmer",
          description: "Cut/trim video clips",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "video",
              type: "file",
              required: true,
              description: "Video file",
            },
            {
              name: "start",
              type: "number",
              required: true,
              description: "Start time in seconds",
            },
            {
              name: "end",
              type: "number",
              required: true,
              description: "End time in seconds",
            },
          ],
          example: {
            curl: 'curl -X POST /api/video/trim -H "X-API-Key: YOUR_KEY" -F "video=@movie.mp4" -F "start=5" -F "end=15"',
            response: "Binary trimmed video file",
          },
        },
        {
          method: "POST",
          path: "/api/video/speed",
          name: "Video Speed Controller",
          description: "Change video speed",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "video",
              type: "file",
              required: true,
              description: "Video file",
            },
            {
              name: "speed",
              type: "number",
              required: true,
              default: 1.0,
              description: "Speed factor (0.5 to 2.0)",
            },
          ],
          example: {
            curl: 'curl -X POST /api/video/speed -H "X-API-Key: YOUR_KEY" -F "video=@movie.mp4" -F "speed=1.25"',
            response: "Binary speed-adjusted video file",
          },
        },
        {
          method: "POST",
          path: "/api/video/thumbnail",
          name: "Video Thumbnail Generator",
          description: "Extract thumbnail images from video files",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "video",
              type: "file",
              required: true,
              description: "Video file",
            },
            {
              name: "time",
              type: "number",
              required: false,
              default: 1,
              description: "Time offset in seconds",
            },
          ],
          example: {
            curl: 'curl -X POST /api/video/thumbnail -H "X-API-Key: YOUR_KEY" -F "video=@movie.mp4" -F "time=2"',
            response: "Binary JPEG thumbnail image",
          },
        },
        {
          method: "POST",
          path: "/api/video/resolution",
          name: "Video Resolution Changer",
          description: "Change video resolution",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "video",
              type: "file",
              required: true,
              description: "Video file",
            },
            {
              name: "resolution",
              type: "string",
              required: true,
              default: "720p",
              description: "480p | 720p | 1080p",
            },
          ],
          example: {
            curl: 'curl -X POST /api/video/resolution -H "X-API-Key: YOUR_KEY" -F "video=@movie.mp4" -F "resolution=720p"',
            response: "Binary resized video file",
          },
        },
      ],
    },
    {
      category: "ZIP",
      endpoints: [
        {
          method: "POST",
          path: "/api/zip/create",
          name: "Create ZIP",
          description: "Compress multiple files into a single ZIP archive",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "files",
              type: "file[]",
              required: true,
              description: "Files to compress",
            },
          ],
          example: {
            curl: 'curl -X POST /api/zip/create -H "X-API-Key: YOUR_KEY" -F "files=@doc.pdf" -F "files=@img.png"',
            response: "Binary ZIP archive data",
          },
        },
        {
          method: "POST",
          path: "/api/zip/extract",
          name: "Extract ZIP",
          description: "Extract files from a ZIP archive",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "file",
              type: "file",
              required: true,
              description: "ZIP archive file",
            },
          ],
          example: {
            curl: 'curl -X POST /api/zip/extract -H "X-API-Key: YOUR_KEY" -F "file=@archive.zip"',
            response: {
              success: true,
              result: { files: [{ name: "doc.pdf", size: 12345 }] },
            },
          },
        },
        {
          method: "POST",
          path: "/api/zip/password",
          name: "Password Protected ZIP",
          description: "Create encrypted ZIP archives",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "files",
              type: "file[]",
              required: true,
              description: "Files to compress",
            },
            {
              name: "password",
              type: "string",
              required: true,
              description: "ZIP password",
            },
          ],
          example: {
            curl: 'curl -X POST /api/zip/password -H "X-API-Key: YOUR_KEY" -F "files=@doc.pdf" -F "password=secret"',
            response: "Binary encrypted ZIP data",
          },
        },
        {
          method: "POST",
          path: "/api/zip/compression-test",
          name: "Compression Test ZIP",
          description: "ZIP with custom compression levels",
          contentType: "multipart/form-data",
          parameters: [
            {
              name: "files",
              type: "file[]",
              required: true,
              description: "Files to compress",
            },
            {
              name: "level",
              type: "number",
              required: false,
              default: 6,
              description: "Compression level 1-9",
            },
          ],
          example: {
            curl: 'curl -X POST /api/zip/compression-test -H "X-API-Key: YOUR_KEY" -F "files=@doc.pdf" -F "level=9"',
            response: "Binary optimized ZIP data",
          },
        },
      ],
    },
    {
      category: "Date & Time",
      endpoints: [
        {
          method: "POST",
          path: "/api/date-time/date-difference",
          name: "Date Difference Calculator",
          description: "Calculate days between two dates",
          contentType: "application/json",
          parameters: [
            {
              name: "startDate",
              type: "string",
              required: true,
              description: "YYYY-MM-DD",
            },
            {
              name: "endDate",
              type: "string",
              required: true,
              description: "YYYY-MM-DD",
            },
          ],
          example: {
            curl: 'curl -X POST /api/date-time/date-difference -H "X-API-Key: YOUR_KEY" -d \'{"startDate":"2026-01-01","endDate":"2026-01-10"}\'',
            response: {
              success: true,
              result: { days: 9, weeks: 1, hours: 216 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/date-time/age-calculator",
          name: "Age Calculator",
          description: "Calculate exact age from birthdate",
          contentType: "application/json",
          parameters: [
            {
              name: "birthdate",
              type: "string",
              required: true,
              description: "YYYY-MM-DD",
            },
          ],
          example: {
            curl: 'curl -X POST /api/date-time/age-calculator -H "X-API-Key: YOUR_KEY" -d \'{"birthdate":"1990-05-15"}\'',
            response: {
              success: true,
              result: { years: 36, months: 0, days: 14 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/date-time/working-days",
          name: "Working Days Calculator",
          description: "Calculate business days between dates",
          contentType: "application/json",
          parameters: [
            {
              name: "startDate",
              type: "string",
              required: true,
              description: "YYYY-MM-DD",
            },
            {
              name: "endDate",
              type: "string",
              required: true,
              description: "YYYY-MM-DD",
            },
          ],
          example: {
            curl: 'curl -X POST /api/date-time/working-days -H "X-API-Key: YOUR_KEY" -d \'{"startDate":"2026-01-01","endDate":"2026-01-10"}\'',
            response: {
              success: true,
              result: { workingDays: 7, holidays: 0, weekendDays: 2 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/date-time/countdown",
          name: "Countdown Timer",
          description: "Create countdown metrics to any date",
          contentType: "application/json",
          parameters: [
            {
              name: "targetDate",
              type: "string",
              required: true,
              description: "YYYY-MM-DD HH:MM:SS",
            },
          ],
          example: {
            curl: 'curl -X POST /api/date-time/countdown -H "X-API-Key: YOUR_KEY" -d \'{"targetDate":"2026-12-31 23:59:59"}\'',
            response: {
              success: true,
              result: {
                daysRemaining: 215,
                hoursRemaining: 9,
                minutesRemaining: 20,
              },
            },
          },
        },
        {
          method: "GET",
          path: "/api/date-time/world-time",
          name: "World Time",
          description: "View current time across different zones",
          contentType: "application/json",
          parameters: [],
          example: {
            curl: 'curl -X GET /api/date-time/world-time -H "X-API-Key: YOUR_KEY"',
            response: {
              success: true,
              result: {
                zones: {
                  UTC: "2026-05-29T09:00:00Z",
                  EST: "2026-05-29T04:00:00-05:00",
                },
              },
            },
          },
        },
      ],
    },
    {
      category: "Education",
      endpoints: [
        {
          method: "POST",
          path: "/api/education/percentage-calculator",
          name: "Percentage Calculator",
          description: "Calculate percentages easily",
          contentType: "application/json",
          parameters: [
            { name: "value", type: "number", required: true },
            { name: "total", type: "number", required: true },
            {
              name: "type",
              type: "string",
              required: false,
              default: "percentage",
              description: "percentage | of | change",
            },
          ],
          example: {
            curl: 'curl -X POST /api/education/percentage-calculator -H "X-API-Key: YOUR_KEY" -d \'{"value":50,"total":200,"type":"percentage"}\'',
            response: { success: true, result: { percentage: 25 } },
          },
        },
        {
          method: "POST",
          path: "/api/education/unit-converter",
          name: "Unit Converter",
          description:
            "Convert length, weight, volume, area, temperature, data units",
          contentType: "application/json",
          parameters: [
            { name: "value", type: "number", required: true },
            { name: "from", type: "string", required: true },
            { name: "to", type: "string", required: true },
            {
              name: "category",
              type: "string",
              required: true,
              description:
                "length | weight | temperature | volume | area | speed | data | time",
            },
          ],
          example: {
            curl: 'curl -X POST /api/education/unit-converter -H "X-API-Key: YOUR_KEY" -d \'{"value":100,"from":"c","to":"f","category":"temperature"}\'',
            response: {
              success: true,
              result: { value: 100, from: "c", to: "f", converted: 212 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/education/lcm-hcf",
          name: "LCM & HCF Calculator",
          description:
            "Calculate Least Common Multiple and Highest Common Factor",
          contentType: "application/json",
          parameters: [
            {
              name: "numbers",
              type: "array",
              required: true,
              description: "Array of positive integers",
            },
          ],
          example: {
            curl: 'curl -X POST /api/education/lcm-hcf -H "X-API-Key: YOUR_KEY" -d \'{"numbers":[12,18,24]}\'',
            response: {
              success: true,
              result: { numbers: [12, 18, 24], hcf: 6, lcm: 72 },
            },
          },
        },
        {
          method: "POST",
          path: "/api/education/simple-interest",
          name: "Simple Interest Calculator",
          description: "Calculate simple interest on principal",
          contentType: "application/json",
          parameters: [
            { name: "principal", type: "number", required: true },
            { name: "rate", type: "number", required: true },
            { name: "time", type: "number", required: true },
          ],
          example: {
            curl: 'curl -X POST /api/education/simple-interest -H "X-API-Key: YOUR_KEY" -d \'{"principal":10000,"rate":5,"time":2}\'',
            response: {
              success: true,
              result: {
                principal: 10000,
                rate: 5,
                time: 2,
                simpleInterest: 1000,
                totalAmount: 11000,
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/education/cgpa-to-percentage",
          name: "CGPA to Percentage Calculator",
          description: "Convert CGPA to percentage",
          contentType: "application/json",
          parameters: [
            { name: "cgpa", type: "number", required: true },
            { name: "scale", type: "number", required: false, default: 10 },
          ],
          example: {
            curl: 'curl -X POST /api/education/cgpa-to-percentage -H "X-API-Key: YOUR_KEY" -d \'{"cgpa":9.5,"scale":10}\'',
            response: {
              success: true,
              result: { cgpa: 9.5, scale: 10, percentage: 90.25, grade: "A+" },
            },
          },
        },
      ],
    },
    {
      category: "Email Marketing",
      endpoints: [
        {
          method: "POST",
          path: "/api/email/ai-subject-line-generator",
          name: "AI Email Subject Generator",
          description:
            "Generate high-converting email subject lines using AI and dynamic scoring",
          contentType: "application/json",
          parameters: [
            { name: "keywords", type: "string", required: true },
            {
              name: "tone",
              type: "string",
              required: false,
              default: "professional",
            },
          ],
          example: {
            curl: 'curl -X POST /api/email/ai-subject-line-generator -H "X-API-Key: YOUR_KEY" -d \'{"keywords":"sale, discount","tone":"friendly"}\'',
            response: {
              success: true,
              result: {
                subjectLines: [
                  { text: "Get ready for our big sale!", score: 95 },
                ],
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/email/ai-signature-generator",
          name: "AI Email Signature Generator",
          description: "Build professional email signatures",
          contentType: "application/json",
          parameters: [
            { name: "name", type: "string", required: true },
            { name: "role", type: "string", required: true },
            { name: "company", type: "string", required: false },
          ],
          example: {
            curl: 'curl -X POST /api/email/ai-signature-generator -H "X-API-Key: YOUR_KEY" -d \'{"name":"John Doe","role":"Manager"}\'',
            response: {
              success: true,
              result: { htmlSignature: "<div>...</div>" },
            },
          },
        },
        {
          method: "POST",
          path: "/api/email/previewer-analyze",
          name: "HTML Email Previewer",
          description: "Preview HTML emails and check rendering issues",
          contentType: "application/json",
          parameters: [{ name: "html", type: "string", required: true }],
          example: {
            curl: 'curl -X POST /api/email/previewer-analyze -H "X-API-Key: YOUR_KEY" -d \'{"html":"<html>...</html>"}\'',
            response: { success: true, result: { preview: "...", issues: [] } },
          },
        },
        {
          method: "POST",
          path: "/api/email/ai-spam-checker",
          name: "AI Email Spam Checker",
          description:
            "Analyze email subject & body for spam risk and deliverability",
          contentType: "application/json",
          parameters: [
            { name: "subject", type: "string", required: true },
            { name: "body", type: "string", required: true },
          ],
          example: {
            curl: 'curl -X POST /api/email/ai-spam-checker -H "X-API-Key: YOUR_KEY" -d \'{"subject":"Earn $$ now","body":"Click here"}\'',
            response: {
              success: true,
              result: {
                score: 75,
                spamTriggers: ["$$", "Click here"],
                verdict: "High Risk",
              },
            },
          },
        },
        {
          method: "POST",
          path: "/api/email/ai-template-builder",
          name: "AI Email Template Builder",
          description:
            "Generate responsive HTML email newsletter templates using AI layouts",
          contentType: "application/json",
          parameters: [
            {
              name: "purpose",
              type: "string",
              required: true,
              description: "newsletter | promo | welcome",
            },
            {
              name: "themeColor",
              type: "string",
              required: false,
              default: "#3b82f6",
            },
          ],
          example: {
            curl: 'curl -X POST /api/email/ai-template-builder -H "X-API-Key: YOUR_KEY" -d \'{"purpose":"newsletter"}\'',
            response: {
              success: true,
              result: { templateHtml: "<html>...</html>" },
            },
          },
        },
        {
          method: "POST",
          path: "/api/email/ai-header-analyzer",
          name: "AI Email Header Analyzer",
          description:
            "Analyze raw email headers for hops, delays, and authentication status",
          contentType: "application/json",
          parameters: [
            {
              name: "headers",
              type: "string",
              required: true,
              description: "Raw email headers block",
            },
          ],
          example: {
            curl: 'curl -X POST /api/email/ai-header-analyzer -H "X-API-Key: YOUR_KEY" -d \'{"headers":"Received: from mail.example.com..."}\'',
            response: {
              success: true,
              details: { from: "...", to: "..." },
              hops: [],
              authStatus: { spf: "pass", dkim: "pass", dmarc: "pass" },
            },
          },
        },
        {
          method: "POST",
          path: "/api/email/spf-generator",
          name: "SPF Record Generator",
          description: "Generate and validate SPF DNS TXT records",
          contentType: "application/json",
          parameters: [
            { name: "domain", type: "string", required: true },
            {
              name: "ip4Addresses",
              type: "array",
              required: false,
              description: "List of IPv4 addresses",
            },
            {
              name: "ip6Addresses",
              type: "array",
              required: false,
              description: "List of IPv6 addresses",
            },
            { name: "mxHosts", type: "array", required: false },
            { name: "aHosts", type: "array", required: false },
            { name: "includeDomains", type: "array", required: false },
            {
              name: "allPolicy",
              type: "string",
              required: false,
              default: "softfail",
              description: "softfail | fail | neutral",
            },
          ],
          example: {
            curl: 'curl -X POST /api/email/spf-generator -H "X-API-Key: YOUR_KEY" -d \'{"domain":"example.com","ip4Addresses":["192.168.1.1"]}\'',
            response: {
              success: true,
              record: "v=spf1 ip4:192.168.1.1 ~all",
              existingRecords: [],
              isValid: true,
              domain: "example.com",
            },
          },
        },
        {
          method: "POST",
          path: "/api/email/dkim-generator",
          name: "DKIM Record Generator",
          description:
            "Generate DKIM public/private keys and DNS record selector",
          contentType: "application/json",
          parameters: [
            { name: "domain", type: "string", required: true },
            {
              name: "selector",
              type: "string",
              required: true,
              default: "default",
            },
            {
              name: "keyLength",
              type: "number",
              required: false,
              default: 2048,
              description: "1024 | 2048",
            },
          ],
          example: {
            curl: 'curl -X POST /api/email/dkim-generator -H "X-API-Key: YOUR_KEY" -d \'{"domain":"example.com","selector":"sig1"}\'',
            response: {
              success: true,
              domain: "example.com",
              selector: "sig1",
              host: "sig1._domainkey.example.com",
              record: "v=DKIM1; k=rsa; p=...",
              publicKeyPem: "...",
              privateKeyPem: "...",
            },
          },
        },
        {
          method: "POST",
          path: "/api/email/dmarc-generator",
          name: "DMARC Record Generator",
          description: "Generate and validate DMARC DNS records",
          contentType: "application/json",
          parameters: [
            { name: "domain", type: "string", required: true },
            {
              name: "policy",
              type: "string",
              required: true,
              default: "none",
              description: "none | quarantine | reject",
            },
            {
              name: "rua",
              type: "string",
              required: false,
              description: "Aggregate report email",
            },
            {
              name: "ruf",
              type: "string",
              required: false,
              description: "Forensics report email",
            },
            {
              name: "subdomainPolicy",
              type: "string",
              required: false,
              description: "none | quarantine | reject",
            },
            { name: "pct", type: "number", required: false, default: 100 },
            {
              name: "adkim",
              type: "string",
              required: false,
              default: "r",
              description: "r (relaxed) | s (strict)",
            },
            {
              name: "aspf",
              type: "string",
              required: false,
              default: "r",
              description: "r (relaxed) | s (strict)",
            },
          ],
          example: {
            curl: 'curl -X POST /api/email/dmarc-generator -H "X-API-Key: YOUR_KEY" -d \'{"domain":"example.com","policy":"quarantine"}\'',
            response: {
              success: true,
              record: "v=DMARC1; p=quarantine; pct=100",
              host: "_dmarc.example.com",
              existingRecords: [],
              domain: "example.com",
            },
          },
        },
        {
          method: "POST",
          path: "/api/email/mailto-generator",
          name: "Mailto Link Generator",
          description:
            "Generate mailto links with CC, BCC, subject, and body parameters",
          contentType: "application/json",
          parameters: [
            { name: "to", type: "string", required: true },
            { name: "cc", type: "string", required: false },
            { name: "bcc", type: "string", required: false },
            { name: "subject", type: "string", required: false },
            { name: "body", type: "string", required: false },
          ],
          example: {
            curl: 'curl -X POST /api/email/mailto-generator -H "X-API-Key: YOUR_KEY" -d \'{"to":"test@example.com","subject":"Hello"}\'',
            response: {
              success: true,
              mailtoUrl: "mailto:test@example.com?subject=Hello",
              htmlLink: '<a href="...">Send Email</a>',
              markdownLink: "[Send Email](...)",
            },
          },
        },
      ],
    },
    {
      category: "Finance Additions",
      endpoints: [
        {
          method: "POST",
          path: "/api/finance/ai-saas-pricing-calculator",
          name: "AI SaaS Pricing Optimizer",
          description:
            "Optimize SaaS pricing strategy and model unit economics",
          contentType: "application/json",
          parameters: [
            { name: "cac", type: "number", required: true },
            { name: "arpu", type: "number", required: true },
            { name: "churn", type: "number", required: true },
          ],
          example: {
            curl: 'curl -X POST /api/finance/ai-saas-pricing-calculator -H "X-API-Key: YOUR_KEY" -d \'{"cac":100,"arpu":30,"churn":5}\'',
            response: {
              success: true,
              result: { ltv: 600, paybackMonths: 3.3, rating: "Excellent" },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/ai-budget-planner",
          name: "AI Budget Planner & Optimizer",
          description: "Generate and forecast monthly budget models",
          contentType: "application/json",
          parameters: [
            { name: "income", type: "number", required: true },
            { name: "expenses", type: "object", required: true },
          ],
          example: {
            curl: 'curl -X POST /api/finance/ai-budget-planner -H "X-API-Key: YOUR_KEY" -d \'{"income":5000,"expenses":{"rent":1500,"food":500}}\'',
            response: {
              success: true,
              result: { savings: 3000, recommendedAllocation: {} },
            },
          },
        },
        {
          method: "POST",
          path: "/api/finance/ai-tax-slab-analyzer",
          name: "AI Tax Slab Analyzer & Planner",
          description: "Analyze tax slabs and plan liability using heuristics",
          contentType: "application/json",
          parameters: [
            { name: "income", type: "number", required: true },
            { name: "deductions", type: "number", required: false, default: 0 },
          ],
          example: {
            curl: 'curl -X POST /api/finance/ai-tax-slab-analyzer -H "X-API-Key: YOUR_KEY" -d \'{"income":1200000,"deductions":150000}\'',
            response: {
              success: true,
              result: {
                taxableIncome: 1050000,
                estimatedTax: 125000,
                effectiveRate: "11.9%",
              },
            },
          },
        },
      ],
    },

  ],
};

router.post("/keys/generate", strictLimiter, async (req, res) => {
  const { email, name = "Default" } = req.body;
  if (!email || !email.includes("@")) {
    return res
      .status(400)
      .json({ success: false, error: "Valid email required" });
  }

  const emailKeys = [...apiKeys.values()].filter((k) => k.email === email);
  if (emailKeys.length >= 3) {
    return res.status(400).json({
      success: false,
      error:
        "Maximum 3 API keys per email. Delete an existing key to create a new one.",
    });
  }

  const key = generateKey();
  const today = new Date().toDateString();

  apiKeys.set(key, {
    key,
    name,
    email,
    status: "active",
    tier: "free",
    dailyLimit: 100,
    usageToday: 0,
    totalRequests: 0,
    lastReset: today,
    createdAt: new Date().toISOString(),
  });

  // Invalidate cache for this email's key list
  try {
    const cacheKey = cache.generateKey("api", "keys", email);
    await cache.del(cacheKey);
  } catch (error) {
    // console.error('Cache invalidation error in /keys/generate:', error);
  }

  res.json({
    success: true,
    data: {
      apiKey: key,
      name,
      email,
      tier: "free",
      dailyLimit: 100,
      status: "active",
      createdAt: new Date().toISOString(),
    },
  });
});

router.post("/keys/list", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res
      .status(400)
      .json({ success: false, error: "Valid email required" });
  }

  const cacheKey = cache.generateKey("api", "keys", email);

  try {
    // Try to get from cache first (short TTL since usage changes frequently)
    const cachedKeys = await cache.get(cacheKey);
    if (cachedKeys) {
      return res.json(cachedKeys);
    }

    const keys = [...apiKeys.values()]
      .filter((k) => k.email === email)
      .map((k) => ({
        key: k.key.substring(0, 12) + "...",
        name: k.name,
        status: k.status,
        tier: k.tier,
        dailyLimit: k.dailyLimit,
        usageToday: k.usageToday,
        totalRequests: k.totalRequests,
        createdAt: k.createdAt,
      }));

    const response = { success: true, keys };

    // Cache for 5 minutes (300 seconds) since usage changes
    await cache.set(cacheKey, response, 300);

    res.json(response);
  } catch (error) {
    // console.error('Cache error in /keys/list:', error);
    // Fallback to direct response if cache fails
    const keys = [...apiKeys.values()]
      .filter((k) => k.email === email)
      .map((k) => ({
        key: k.key.substring(0, 12) + "...",
        name: k.name,
        status: k.status,
        tier: k.tier,
        dailyLimit: k.dailyLimit,
        usageToday: k.usageToday,
        totalRequests: k.totalRequests,
        createdAt: k.createdAt,
      }));

    res.json({ success: true, keys });
  }
});

let cachedDocsResponse = null;

router.get("/docs", async (req, res) => {
  if (cachedDocsResponse) {
    return res.json(cachedDocsResponse);
  }

  const cacheKey = cache.generateKey("api", "docs");

  try {
    const cachedDocs = await cache.get(cacheKey);
    if (cachedDocs) {
      cachedDocsResponse = cachedDocs;
      return res.json(cachedDocs);
    }

    const response = {
      success: true,
      ...API_DOCUMENTATION,
      tier: req.apiKeyRecord?.tier || "free",
    };

    cachedDocsResponse = response;
    await cache.set(cacheKey, response, 3600);

    res.json(response);
  } catch (error) {
    const fallbackResponse = {
      success: true,
      ...API_DOCUMENTATION,
    };
    cachedDocsResponse = fallbackResponse;
    res.json(fallbackResponse);
  }
});

router.post("/docs/clear-cache", async (req, res) => {
  const cacheKey = cache.generateKey("api", "docs");
  cachedDocsResponse = null; 

  try {
    await cache.del(cacheKey);
    res.json({ success: true, message: "API docs cache cleared successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to clear cache" });
  }
});

router.post("/text/word-counter", validateApiKey, (req, res) => {
  const { text } = req.body;
  if (!text)
    return res.status(400).json({ success: false, error: "text is required" });

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[.!?]+/g) || []).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const lines = text.split("\n").length;
  const readingTime = Math.max(1, Math.round(words / 200));

  res.json({
    success: true,
    result: {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingTimeMinutes: readingTime,
    },
  });
});

router.post("/text/case-converter", validateApiKey, (req, res) => {
  const { text, case: targetCase = "upper" } = req.body;
  if (!text)
    return res.status(400).json({ success: false, error: "text is required" });

  let converted;
  const converters = {
    upper: (t) => t.toUpperCase(),
    lower: (t) => t.toLowerCase(),
    title: (t) =>
      t.replace(
        /\w\S*/g,
        (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
      ),
    sentence: (t) => t.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
    camel: (t) =>
      t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    pascal: (t) =>
      t
        .replace(
          /\w+/g,
          (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
        )
        .replace(/\s+/g, ""),
    snake: (t) =>
      t
        .replace(/\s+/g, "_")
        .replace(/[A-Z]/g, (c) => "_" + c.toLowerCase())
        .replace(/^_/, "")
        .toLowerCase(),
    kebab: (t) =>
      t
        .replace(/\s+/g, "-")
        .replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())
        .replace(/^-/, "")
        .toLowerCase(),
    alternating: (t) =>
      t
        .split("")
        .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
    inverse: (t) =>
      t
        .split("")
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join(""),
  };

  const convert = converters[targetCase.toLowerCase()];
  if (!convert)
    return res
      .status(400)
      .json({
        success: false,
        error:
          "Invalid case. Use: upper, lower, title, sentence, camel, pascal, snake, kebab, alternating, inverse",
      });

  res.json({
    success: true,
    result: { original: text, converted: convert(text), case: targetCase },
  });
});

router.post("/text/markdown-to-html", validateApiKey, (req, res) => {
  const { markdown } = req.body;
  if (!markdown)
    return res
      .status(400)
      .json({ success: false, error: "markdown is required" });

  let html = markdown
    .replace(/^#{6}\s+(.+)$/gm, "<h6>$1</h6>")
    .replace(/^#{5}\s+(.+)$/gm, "<h5>$1</h5>")
    .replace(/^#{4}\s+(.+)$/gm, "<h4>$1</h4>")
    .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[a-z])/gm, "<p>")
    .replace(/(?<!\>)\n/g, "<br>");

  res.json({ success: true, result: { html } });
});

router.post("/text/remove-spaces", validateApiKey, (req, res) => {
  const { text, type = "extra" } = req.body;
  if (text === undefined)
    return res.status(400).json({ success: false, error: "text is required" });

  const processors = {
    extra: (t) =>
      t
        .replace(/[ \t]+/g, " ")
        .replace(/^ /gm, "")
        .replace(/ $/gm, ""),
    all: (t) => t.replace(/\s+/g, ""),
    leading: (t) => t.replace(/^[ \t]+/gm, ""),
    trailing: (t) => t.replace(/[ \t]+$/gm, ""),
    blank: (t) => t.replace(/^\s*[\r\n]/gm, ""),
    tabs: (t) => t.replace(/\t/g, "    "),
  };

  const fn = processors[type] || processors.extra;
  res.json({ success: true, result: { output: fn(text) } });
});

router.post("/text/line-sorter", validateApiKey, (req, res) => {
  const {
    text,
    order = "asc",
    caseSensitive = false,
    removeDuplicates = false,
  } = req.body;
  if (text === undefined)
    return res.status(400).json({ success: false, error: "text is required" });

  let lines = text.split("\n");
  if (removeDuplicates) {
    const seen = new Set();
    lines = lines.filter((l) => {
      const key = caseSensitive ? l : l.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  lines.sort((a, b) => {
    const ca = caseSensitive ? a : a.toLowerCase();
    const cb = caseSensitive ? b : b.toLowerCase();
    return order === "desc" ? cb.localeCompare(ca) : ca.localeCompare(cb);
  });

  if (order === "random") {
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
  }

  res.json({
    success: true,
    result: { output: lines.join("\n"), lineCount: lines.length },
  });
});

router.post("/text/duplicate-remover", validateApiKey, (req, res) => {
  const { text, caseSensitive = false } = req.body;
  if (text === undefined)
    return res.status(400).json({ success: false, error: "text is required" });

  const lines = text.split("\n");
  const seen = new Set();
  const unique = lines.filter((l) => {
    const key = caseSensitive ? l : l.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const duplicates = lines.length - unique.length;
  res.json({
    success: true,
    result: {
      output: unique.join("\n"),
      original: lines.length,
      unique: unique.length,
      duplicatesRemoved: duplicates,
    },
  });
});

router.post("/text/text-diff", validateApiKey, (req, res) => {
  const { text1 = "", text2 = "" } = req.body;

  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");
  const diff = [];

  const maxLen = Math.max(lines1.length, lines2.length);
  let added = 0,
    removed = 0,
    unchanged = 0;

  for (let i = 0; i < maxLen; i++) {
    const l1 = lines1[i];
    const l2 = lines2[i];

    if (l1 === undefined) {
      diff.push({ type: "added", line: l2, lineNum: i + 1 });
      added++;
    } else if (l2 === undefined) {
      diff.push({ type: "removed", line: l1, lineNum: i + 1 });
      removed++;
    } else if (l1 === l2) {
      diff.push({ type: "unchanged", line: l1, lineNum: i + 1 });
      unchanged++;
    } else {
      diff.push(
        { type: "removed", line: l1, lineNum: i + 1 },
        { type: "added", line: l2, lineNum: i + 1 },
      );
      removed++;
      added++;
    }
  }

  res.json({
    success: true,
    result: { diff, stats: { added, removed, unchanged, total: maxLen } },
  });
});

router.post("/text/ai-text-summarizer", validateApiKey, (req, res) => {
  const { text, sentences: sentenceCount = 3 } = req.body;
  if (!text)
    return res.status(400).json({ success: false, error: "text is required" });

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const wordFreq = {};
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/);
  for (const w of words) if (w.length > 3) wordFreq[w] = (wordFreq[w] || 0) + 1;

  const scoredSentences = sentences.map((s, i) => {
    const words = s.toLowerCase().split(/\s+/);
    const score =
      words.reduce((acc, w) => acc + (wordFreq[w] || 0), 0) /
      (words.length || 1);
    return { sentence: s.trim(), score, index: i };
  });

  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(parseInt(sentenceCount) || 3, sentences.length));
  const summary = topSentences
    .sort((a, b) => a.index - b.index)
    .map((s) => s.sentence)
    .join(" ");

  res.json({
    success: true,
    result: {
      summary,
      originalSentences: sentences.length,
      summarySentences: topSentences.length,
      compressionRatio: `${Math.round((1 - summary.length / text.length) * 100)}%`,
    },
  });
});

router.post("/security/password-generator", validateApiKey, (req, res) => {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
    count = 1,
  } = req.body;

  const len = Math.min(Math.max(parseInt(length) || 16, 8), 128);
  let charset = "";
  if (uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (numbers) charset += "0123456789";
  if (symbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (!charset)
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const generateOne = () => {
    let pw = "";
    for (let i = 0; i < len; i++) {
      pw += charset[crypto.randomInt(charset.length)];
    }
    return pw;
  };

  const passwords = Array.from(
    { length: Math.min(parseInt(count) || 1, 10) },
    generateOne,
  );
  const pw = passwords[0];
  let strength = "Weak";
  if (len >= 12 && uppercase && lowercase && numbers && symbols)
    strength = "Very Strong";
  else if (
    len >= 10 &&
    ((uppercase && lowercase && numbers) || (uppercase && lowercase && symbols))
  )
    strength = "Strong";
  else if (len >= 8 && ((uppercase && lowercase) || (lowercase && numbers)))
    strength = "Medium";

  res.json({
    success: true,
    result: {
      password: pw,
      passwords: passwords.length > 1 ? passwords : undefined,
      length: len,
      strength,
    },
  });
});

router.post("/security/hash-generator", validateApiKey, (req, res) => {
  const { text, algorithm = "sha256", encoding = "hex" } = req.body;
  if (!text)
    return res.status(400).json({ success: false, error: "text is required" });

  const validAlgorithms = [
    "md5",
    "sha1",
    "sha256",
    "sha512",
    "sha224",
    "sha384",
  ];
  const alg = algorithm.toLowerCase();
  if (!validAlgorithms.includes(alg)) {
    return res
      .status(400)
      .json({
        success: false,
        error: `Invalid algorithm. Use: ${validAlgorithms.join(", ")}`,
      });
  }

  const hash = crypto
    .createHash(alg)
    .update(text)
    .digest(encoding === "base64" ? "base64" : "hex");
  res.json({
    success: true,
    result: {
      hash,
      algorithm: alg,
      encoding: encoding === "base64" ? "base64" : "hex",
      inputLength: text.length,
    },
  });
});

router.post("/security/uuid-generator", validateApiKey, (req, res) => {
  const count = Math.min(Math.max(parseInt(req.body.count) || 1, 1), 100);
  const uuids = Array.from({ length: count }, () => crypto.randomUUID());
  res.json({ success: true, result: { uuids, count } });
});

router.post("/dev/json-formatter", validateApiKey, (req, res) => {
  const { json, action = "format", indent = 2 } = req.body;
  if (!json)
    return res.status(400).json({ success: false, error: "json is required" });

  try {
    const parsed = JSON.parse(json);
    let result;
    if (action === "minify") {
      result = JSON.stringify(parsed);
    } else if (action === "validate") {
      return res.json({
        success: true,
        result: {
          valid: true,
          type: typeof parsed,
          keys: typeof parsed === "object" ? Object.keys(parsed).length : null,
        },
      });
    } else {
      result = JSON.stringify(parsed, null, parseInt(indent) || 2);
    }
    res.json({
      success: true,
      result: { formatted: result, valid: true, action },
    });
  } catch (e) {
    res.json({
      success: true,
      result: { valid: false, error: e.message, action: "validate" },
    });
  }
});

router.post("/dev/url-encoder", validateApiKey, (req, res) => {
  const { text, action = "encode" } = req.body;
  if (!text)
    return res.status(400).json({ success: false, error: "text is required" });

  const output =
    action === "decode" ? decodeURIComponent(text) : encodeURIComponent(text);
  res.json({ success: true, result: { input: text, output, action } });
});

router.post("/finance/emi-calculator", validateApiKey, (req, res) => {
  const { principal, rate, tenure, tenureType = "months" } = req.body;
  if (!principal || !rate || !tenure) {
    return res
      .status(400)
      .json({
        success: false,
        error: "principal, rate, and tenure are required",
      });
  }

  const p = parseFloat(principal);
  const annualRate = parseFloat(rate);
  const months =
    tenureType === "years" ? parseInt(tenure) * 12 : parseInt(tenure);
  const r = annualRate / 100 / 12;

  if (r === 0) {
    const emi = p / months;
    return res.json({
      success: true,
      result: {
        emi: +emi.toFixed(2),
        totalPayment: +(emi * months).toFixed(2),
        totalInterest: 0,
        principal: p,
      },
    });
  }

  const emi = (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - p;

  res.json({
    success: true,
    result: {
      emi: +emi.toFixed(2),
      totalPayment: +totalPayment.toFixed(2),
      totalInterest: +totalInterest.toFixed(2),
      principal: p,
      rate: annualRate,
      tenure: months,
      tenureType,
    },
  });
});

router.get("/health", (req, res) => {
  res.json({
    success: true,
    version: "2.0.0",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

router.get("/openapi.json", (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");
    const specPath = path.join(__dirname, "../../frontend/public/openapi.json");
    if (fs.existsSync(specPath)) {
      const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
      return res.json(spec);
    }
    return res
      .status(404)
      .json({ success: false, error: "OpenAPI specification not found" });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        error: "Failed to load API specification: " + err.message,
      });
  }
});

module.exports = router;
