import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

// Core Pages
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const About = lazy(() => import("./pages/About"));
const WriteForUs = lazy(() => import("./pages/WriteForUs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const BlogListPage = lazy(() => import("./pages/blog/BlogListPage"));
const BlogPostPage = lazy(() => import("./pages/blog/BlogPostPage"));
const APIDocs = lazy(() => import("./pages/APIDocs"));

// Image Tools
const QRGeneratorTool = lazy(() => import("./pages/tools/image/QRGeneratorTool"));
const QRScannerTool = lazy(() => import("./pages/tools/image/QRScannerTool"));
const PNGToJPGConverter = lazy(() => import("./pages/tools/image/PNGToJPGConverter"));
const JPGToPNGConverter = lazy(() => import("./pages/tools/image/JPGToPNGConverter"));
const WebPToPNGConverter = lazy(() => import("./pages/tools/image/WebPToPNGConverter"));
const PNGToWebPConverter = lazy(() => import("./pages/tools/image/PNGToWebPConverter"));
const WebPToJPGConverter = lazy(() => import("./pages/tools/image/WebPToJPGConverter"));
const JPGToWebPConverter = lazy(() => import("./pages/tools/image/JPGToWebPConverter"));
const ImageCompressorTool = lazy(() => import("./pages/tools/image/ImageCompressorTool"));
const ImageResizeTool = lazy(() => import("./pages/tools/image/ImageResizeTool"));
const ImageCropTool = lazy(() => import("./pages/tools/image/ImageCropTool"));
const BackgroundRemoverTool = lazy(() => import("./pages/tools/image/BackgroundRemoverTool"));
const ImageBase64Tool = lazy(() => import("./pages/tools/image/ImageBase64Tool"));
const ImageDPITool = lazy(() => import("./pages/tools/image/ImageDPITool"));
const EXIFViewerTool = lazy(() => import("./pages/tools/image/EXIFViewerTool"));
const FaviconGeneratorTool = lazy(() => import("./pages/tools/image/FaviconGeneratorTool"));
const ImageToPDFTool = lazy(() => import("./pages/tools/image/ImageToPDFTool"));

// PDF Tools
const PDFMergeTool = lazy(() => import("./pages/tools/pdf/PDFMergeTool"));
const PDFSplitTool = lazy(() => import("./pages/tools/pdf/PDFSplitTool"));
const PDFToImageTool = lazy(() => import("./pages/tools/pdf/PDFToImageTool"));
const PDFPasswordTool = lazy(() => import("./pages/tools/pdf/PDFPasswordTool"));
const PDFUnlockTool = lazy(() => import("./pages/tools/pdf/PDFUnlockTool"));
const PDFPageRemoverTool = lazy(() => import("./pages/tools/pdf/PDFPageRemoverTool"));
const PDFRotateTool = lazy(() => import("./pages/tools/pdf/PDFRotateTool"));
const PDFToWordTool = lazy(() => import("./pages/tools/pdf/PDFToWordTool"));
const PDFToPowerPointTool = lazy(() => import("./pages/tools/pdf/PDFToPowerPointTool"));
const PDFToExcelTool = lazy(() => import("./pages/tools/pdf/PDFToExcelTool"));
const WordToPDFTool = lazy(() => import("./pages/tools/pdf/WordToPDFTool"));
const PowerPointToPDFTool = lazy(() => import("./pages/tools/pdf/PowerPointToPDFTool"));
const HTMLToPDFTool = lazy(() => import("./pages/tools/pdf/HTMLToPDFTool"));
const PDFReorderTool = lazy(() => import("./pages/tools/pdf/PDFReorderTool"));
const PDFAddSignatureTool = lazy(() => import("./pages/tools/pdf/PDFAddSignatureTool"));
const CropPDFTool = lazy(() => import("./pages/tools/pdf/CropPDFTool"));

// Govt Legal Tools
const PassportPhotoResizerTool = lazy(() => import("./pages/tools/govt-legal/PassportPhotoResizerTool"));
const PDFCompressorTool = lazy(() => import("./pages/tools/govt-legal/PDFCompressorTool"));
const SignatureMakerTool = lazy(() => import("./pages/tools/govt-legal/SignatureMakerTool"));
const DocumentTemplateTool = lazy(() => import("./pages/tools/govt-legal/DocumentTemplateTool"));

// E-commerce Seller Tools
const ShadowAdderTool = lazy(() => import("./pages/tools/ecommerce/ShadowAdderTool"));
const BarcodeGeneratorTool = lazy(() => import("./pages/tools/ecommerce/BarcodeGeneratorTool"));
const GSTInvoiceGeneratorTool = lazy(() => import("./pages/tools/ecommerce/GSTInvoiceGeneratorTool"));
const EcommerceCalculatorTool = lazy(() => import("./pages/tools/ecommerce/EcommerceCalculatorTool"));
const WatermarkAdderTool = lazy(() => import("./pages/tools/ecommerce/WatermarkAdderTool"));
const WhiteBackgroundAdderTool = lazy(() => import("./pages/tools/ecommerce/WhiteBackgroundAdderTool"));
const BulkImageResizerTool = lazy(() => import("./pages/tools/ecommerce/BulkImageResizerTool"));
const ImageColorEnhancerTool = lazy(() => import("./pages/tools/ecommerce/ImageColorEnhancerTool"));

// Video Tools
const VideoToAudioTool = lazy(() => import("./pages/tools/video/VideoToAudioTool"));
const VideoTrimTool = lazy(() => import("./pages/tools/video/VideoTrimTool"));
const VideoSpeedTool = lazy(() => import("./pages/tools/video/VideoSpeedTool"));
const VideoThumbnailTool = lazy(() => import("./pages/tools/video/VideoThumbnailTool"));
const VideoResolutionTool = lazy(() => import("./pages/tools/video/VideoResolutionTool"));

// Audio Tools
const AudioConverterTool = lazy(() => import("./pages/tools/audio/AudioConverterTool"));
const SpeechToTextTool = lazy(() => import("./pages/tools/audio/SpeechToTextTool"));
const AudioTrimmerTool = lazy(() => import("./pages/tools/audio/AudioTrimmerTool"));
const AudioMergerTool = lazy(() => import("./pages/tools/audio/AudioMergerTool"));
const AudioSpeedTool = lazy(() => import("./pages/tools/audio/AudioSpeedTool"));

// Text Tools
const WordCounterTool = lazy(() => import("./pages/tools/text/WordCounterTool"));
const CaseConverterTool = lazy(() => import("./pages/tools/text/CaseConverterTool"));
const MarkdownHTMLTool = lazy(() => import("./pages/tools/text/MarkdownHTMLTool"));
const RemoveSpacesTool = lazy(() => import("./pages/tools/text/RemoveSpacesTool"));
const LineSorterTool = lazy(() => import("./pages/tools/text/LineSorterTool"));
const DuplicateRemoverTool = lazy(() => import("./pages/tools/text/DuplicateRemoverTool"));
const TextSummarizerTool = lazy(() => import("./pages/tools/text/TextSummarizerTool"));
const TextDiffTool = lazy(() => import("./pages/tools/text/TextDiffTool"));

// Security Tools
const PasswordGeneratorTool = lazy(() => import("./pages/tools/security/PasswordGeneratorTool"));
const PasswordStrengthTool = lazy(() => import("./pages/tools/security/PasswordStrengthTool"));
const HashGeneratorTool = lazy(() => import("./pages/tools/security/HashGeneratorTool"));
const Base64Tool = lazy(() => import("./pages/tools/security/Base64Tool"));
const UUIDGeneratorTool = lazy(() => import("./pages/tools/security/UUIDGeneratorTool"));
const PasswordStrengthExplainerTool = lazy(() => import("./pages/tools/security/PasswordStrengthExplainerTool"));
const DataBreachEmailCheckerTool = lazy(() => import("./pages/tools/security/DataBreachEmailCheckerTool"));
const FileHashComparisonTool = lazy(() => import("./pages/tools/security/FileHashComparisonTool"));
const EXIFLocationRemoverTool = lazy(() => import("./pages/tools/security/EXIFLocationRemoverTool"));
const TextRedactionTool = lazy(() => import("./pages/tools/security/TextRedactionTool"));
const QRPhishingScannerTool = lazy(() => import("./pages/tools/security/QRPhishingScannerTool"));
const SecureNotesTool = lazy(() => import("./pages/tools/security/SecureNotesTool"));
const URLReputationCheckerTool = lazy(() => import("./pages/tools/security/URLReputationCheckerTool"));

// Date & Time Tools
const DateDifferenceTool = lazy(() => import("./pages/tools/date-time/DateDifferenceTool"));
const WorkingDaysTool = lazy(() => import("./pages/tools/date-time/WorkingDaysTool"));
const CountdownTimerTool = lazy(() => import("./pages/tools/date-time/CountdownTimerTool"));
const WorldTimeTool = lazy(() => import("./pages/tools/date-time/WorldTimeTool"));
const AgeCalculatorTool = lazy(() => import("./pages/tools/date-time/AgeCalculatorTool"));

// Developer Tools
const JSONFormatterTool = lazy(() => import("./pages/tools/dev/JSONFormatterTool"));
const RegexTesterTool = lazy(() => import("./pages/tools/dev/RegexTesterTool"));
const URLEncoderTool = lazy(() => import("./pages/tools/dev/URLEncoderTool"));
const ColorConverterTool = lazy(() => import("./pages/tools/dev/ColorConverterTool"));
const LoremGeneratorTool = lazy(() => import("./pages/tools/dev/LoremGeneratorTool"));
const JWTDecoderTool = lazy(() => import("./pages/tools/dev/JWTDecoderTool"));
const CronGeneratorTool = lazy(() => import("./pages/tools/dev/CronGeneratorTool"));
const HTTPHeaderTool = lazy(() => import("./pages/tools/dev/HTTPHeaderTool"));
const WebsiteScreenshotTool = lazy(() => import("./pages/tools/internet/WebsiteScreenshotTool"));
const TokenCalculatorTool = lazy(() => import("./pages/tools/dev/TokenCalculatorTool"));
const ColorPalettesTool = lazy(() => import("./pages/tools/dev/ColorPalettesTool"));
const APIResponseFormatterTool = lazy(() => import("./pages/tools/dev/APIResponseFormatterTool"));
const JsonToTypeScriptTool = lazy(() => import("./pages/tools/dev/JsonToTypeScriptTool"));
const SQLQueryBeautifierTool = lazy(() => import("./pages/tools/dev/SQLQueryBeautifierTool"));
const JWTExpiryTool = lazy(() => import("./pages/tools/dev/JWTExpiryTool"));
const EnvironmentVariableTool = lazy(() => import("./pages/tools/dev/EnvironmentVariableTool"));
const PostmanCollectionTool = lazy(() => import("./pages/tools/dev/PostmanCollectionTool"));
const DockerfileGeneratorTool = lazy(() => import("./pages/tools/dev/DockerfileGeneratorTool"));
const CurlToAxiosTool = lazy(() => import("./pages/tools/dev/CurlToAxiosTool"));
const HTTPStatusCodeTool = lazy(() => import("./pages/tools/dev/HTTPStatusCodeTool"));
const HTMLValidatorTool = lazy(() => import("./pages/tools/dev/HTMLValidatorTool"));
const CSSValidatorTool = lazy(() => import("./pages/tools/dev/CSSValidatorTool"));

// Internet Tools
const IPLookupTool = lazy(() => import("./pages/tools/internet/IPLookupTool"));
const UserAgentTool = lazy(() => import("./pages/tools/internet/UserAgentTool"));
const DNSLookupTool = lazy(() => import("./pages/tools/internet/DNSLookupTool"));
const SSLCheckerTool = lazy(() => import("./pages/tools/internet/SSLCheckerTool"));
const WebsitePingTool = lazy(() => import("./pages/tools/internet/WebsitePingTool"));
const PingTestTool = lazy(() => import("./pages/tools/internet/PingTestTool"));

// Education Tools
const ScientificCalculatorTool = lazy(() => import("./pages/tools/education/ScientificCalculatorTool"));
const PercentageCalculatorTool = lazy(() => import("./pages/tools/education/PercentageCalculatorTool"));
const UnitConverterTool = lazy(() => import("./pages/tools/education/UnitConverterTool"));
const CompoundInterestTool = lazy(() => import("./pages/tools/education/CompoundInterestTool"));
const SimpleInterestTool = lazy(() => import("./pages/tools/education/SimpleInterestTool"));
const CGPAToPercentageTool = lazy(() => import("./pages/tools/education/CGPAToPercentageTool"));
const LCMHCFTool = lazy(() => import("./pages/tools/education/LCMHCFTool"));
const StudyTimetableTool = lazy(() => import("./pages/tools/education/StudyTimetableTool"));
const MCQGeneratorTool = lazy(() => import("./pages/tools/education/MCQGeneratorTool"));

// Finance Tools
const EMICalculatorTool = lazy(() => import("./pages/tools/finance/EMICalculatorTool"));
const GSTCalculatorTool = lazy(() => import("./pages/tools/finance/GSTCalculatorTool"));
const SalaryCalculatorTool = lazy(() => import("./pages/tools/finance/SalaryCalculatorTool"));
const CurrencyConverterTool = lazy(() => import("./pages/tools/finance/CurrencyConverterTool"));
const StartupBurnRateCalculatorTool = lazy(() => import("./pages/tools/finance/StartupBurnRateCalculatorTool"));
const SaaSPricingCalculatorTool = lazy(() => import("./pages/tools/finance/SaaSPricingCalculatorTool"));
const EMIComparisonTool = lazy(() => import("./pages/tools/finance/EMIComparisonTool"));
const TaxSlabAnalyzerTool = lazy(() => import("./pages/tools/finance/TaxSlabAnalyzerTool"));
const InvoiceGeneratorTool = lazy(() => import("./pages/tools/finance/InvoiceGeneratorTool"));
const ProfitMarginCalculatorTool = lazy(() => import("./pages/tools/finance/ProfitMarginCalculatorTool"));
const FreelancerRateCalculatorTool = lazy(() => import("./pages/tools/finance/FreelancerRateCalculatorTool"));
const SalaryBreakupGeneratorTool = lazy(() => import("./pages/tools/finance/SalaryBreakupGeneratorTool"));
const BudgetPlannerTool = lazy(() => import("./pages/tools/finance/BudgetPlannerTool"));
const StockCAGRCalculatorTool = lazy(() => import("./pages/tools/finance/StockCAGRCalculatorTool"));
const MutualFundCalculatorTool = lazy(() => import("./pages/tools/finance/MutualFundCalculatorTool"));
const LumpsumCalculatorTool = lazy(() => import("./pages/tools/finance/LumpsumCalculatorTool"));
const SIPCalculatorTool = lazy(() => import("./pages/tools/finance/SIPCalculatorTool"));
const ROICalculatorTool = lazy(() => import("./pages/tools/finance/ROICalculatorTool"));

// SEO Tools
const MetaTitleDescriptionTool = lazy(() => import("./pages/tools/seo/MetaTitleDescriptionTool"));
const KeywordDensityTool = lazy(() => import("./pages/tools/seo/KeywordDensityTool"));
const RobotsTxtTool = lazy(() => import("./pages/tools/seo/RobotsTxtTool"));
const SitemapValidatorTool = lazy(() => import("./pages/tools/seo/SitemapValidatorTool"));
const PageSpeedChecklistTool = lazy(() => import("./pages/tools/seo/PageSpeedChecklistTool"));
const OGImagePreviewTool = lazy(() => import("./pages/tools/seo/OGImagePreviewTool"));
const BrokenImageFinderTool = lazy(() => import("./pages/tools/seo/BrokenImageFinderTool"));
const UTMLinkBuilderTool = lazy(() => import("./pages/tools/seo/UTMLinkBuilderTool"));
const DomainAgeTool = lazy(() => import("./pages/tools/seo/DomainAgeTool"));
const TechStackDetectorTool = lazy(() => import("./pages/tools/seo/TechStackDetectorTool"));
const PageSEOTool = lazy(() => import("./pages/tools/seo/PageSEOTool"));

// ZIP Tools
const CreateZipTool = lazy(() => import("./pages/tools/zip/CreateZipTool"));
const ExtractZipTool = lazy(() => import("./pages/tools/zip/ExtractZipTool"));
const PasswordZipTool = lazy(() => import("./pages/tools/zip/PasswordZipTool"));
const CompressionZipTool = lazy(() => import("./pages/tools/zip/CompressionZipTool"));

// Social Tools
const HashtagGeneratorTool = lazy(() => import("./pages/tools/social/HashtagGeneratorTool"));
const BioGeneratorTool = lazy(() => import("./pages/tools/social/BioGeneratorTool"));
const CaptionFormatterTool = lazy(() => import("./pages/tools/social/CaptionFormatterTool"));
const LineBreakGeneratorTool = lazy(() => import("./pages/tools/social/LineBreakGeneratorTool"));
const LinkInBioTool = lazy(() => import("./pages/tools/social/LinkInBioTool"));
const MemeGeneratorTool = lazy(() => import("./pages/tools/social/MemeGeneratorTool"));
const WhatsAppStatusTool = lazy(() => import("./pages/tools/social/WhatsAppStatusTool"));

// Email Marketing Tools
const EmailSubjectLineGeneratorTool = lazy(() => import("./pages/tools/email/EmailSubjectLineGeneratorTool"));
const EmailSignatureGeneratorTool = lazy(() => import("./pages/tools/email/EmailSignatureGeneratorTool"));
const HTMLEmailPreviewerTool = lazy(() => import("./pages/tools/email/HTMLEmailPreviewerTool"));
const SpamScoreCheckerTool = lazy(() => import("./pages/tools/email/SpamScoreCheckerTool"));
const EmailTemplateBuilderTool = lazy(() => import("./pages/tools/email/EmailTemplateBuilderTool"));
const EmailHeaderAnalyzerTool = lazy(() => import("./pages/tools/email/EmailHeaderAnalyzerTool"));
const SPFRecordGeneratorTool = lazy(() => import("./pages/tools/email/SPFRecordGeneratorTool"));
const DKIMGeneratorTool = lazy(() => import("./pages/tools/email/DKIMGeneratorTool"));
const DMARCGeneratorTool = lazy(() => import("./pages/tools/email/DMARCGeneratorTool"));
const MailtoLinkGeneratorTool = lazy(() => import("./pages/tools/email/MailtoLinkGeneratorTool"));

const queryClient = new QueryClient();

const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-muted-foreground font-medium">Loading...</span>
    </div>
  </div>
);

const AnimatedRoutes = () => {
  return (
    <Routes>
      {/* Index and Info Pages */}
      <Route path="/" element={<Index />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/write-for-us" element={<WriteForUs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/blogs" element={<BlogListPage />} />
      <Route caseSensitive path="/blogs/DailyTools247-vs-ilovepdf-vs-smallpdf-2026" element={<Navigate to="/blogs/dailytools247-vs-ilovepdf-vs-smallpdf-2026" replace />} />
      <Route path="/blogs/:slug" element={<BlogPostPage />} />
      <Route path="/api-docs" element={<APIDocs />} />
      <Route path="/developers" element={<Navigate to="/api-docs" replace />} />

      {/* Image Tools - SEO friendly routes */}
      <Route path="/qr-code-generator" element={<QRGeneratorTool />} />
      <Route path="/qr-scanner" element={<Navigate to="/qr-code-scanner" replace />} />
      <Route path="/qr-code-scanner" element={<QRScannerTool />} />
      <Route path="/png-to-jpg-converter" element={<PNGToJPGConverter />} />
      <Route path="/jpg-to-png-converter" element={<JPGToPNGConverter />} />
      <Route path="/webp-to-jpg-converter" element={<WebPToJPGConverter />} />
      <Route path="/jpg-to-webp-converter" element={<JPGToWebPConverter />} />
      <Route path="/webp-to-png-converter" element={<WebPToPNGConverter />} />
      <Route path="/png-to-webp-converter" element={<PNGToWebPConverter />} />
      <Route path="/image-compressor" element={<ImageCompressorTool />} />
      <Route path="/image-resize" element={<ImageResizeTool />} />
      <Route path="/image-crop" element={<ImageCropTool />} />
      <Route path="/background-remover" element={<Navigate to="/ai-background-remover" replace />} />
      <Route path="/ai-background-remover" element={<BackgroundRemoverTool />} />
      <Route path="/image-base64" element={<ImageBase64Tool />} />
      <Route path="/image-dpi-checker" element={<ImageDPITool />} />
      <Route path="/exif-viewer" element={<EXIFViewerTool />} />
      <Route path="/favicon-generator" element={<FaviconGeneratorTool />} />
      <Route path="/image-to-pdf" element={<ImageToPDFTool />} />

      {/* PDF Tools */}
      <Route path="/pdf-merge" element={<PDFMergeTool />} />
      <Route path="/pdf-split" element={<PDFSplitTool />} />
      <Route path="/pdf-to-image" element={<PDFToImageTool />} />
      <Route path="/pdf-password" element={<PDFPasswordTool />} />
      <Route path="/pdf-unlock" element={<PDFUnlockTool />} />
      <Route path="/pdf-page-remover" element={<PDFPageRemoverTool />} />
      <Route path="/pdf-rotate" element={<PDFRotateTool />} />
      <Route path="/pdf-to-word" element={<PDFToWordTool />} />
      <Route path="/pdf-to-powerpoint" element={<PDFToPowerPointTool />} />
      <Route path="/pdf-to-excel" element={<PDFToExcelTool />} />
      <Route path="/word-to-pdf" element={<WordToPDFTool />} />
      <Route path="/powerpoint-to-pdf" element={<PowerPointToPDFTool />} />
      <Route path="/html-to-pdf" element={<HTMLToPDFTool />} />
      <Route path="/pdf-reorder" element={<PDFReorderTool />} />
      <Route path="/pdf-add-signature" element={<PDFAddSignatureTool />} />
      <Route path="/crop-pdf" element={<CropPDFTool />} />

      {/* Govt Legal Tools */}
      <Route path="/passport-photo-resizer" element={<PassportPhotoResizerTool />} />
      <Route path="/pdf-compressor" element={<PDFCompressorTool />} />
      <Route path="/signature-maker" element={<SignatureMakerTool />} />
      <Route path="/document-template" element={<DocumentTemplateTool />} />

      {/* E-commerce Seller Tools */}
      <Route path="/shadow-adder" element={<Navigate to="/ai-shadow-adder" replace />} />
      <Route path="/ai-shadow-adder" element={<ShadowAdderTool />} />
      <Route path="/barcode-generator" element={<BarcodeGeneratorTool />} />
      <Route path="/gst-invoice-generator" element={<GSTInvoiceGeneratorTool />} />
      <Route path="/ecommerce-calculator" element={<EcommerceCalculatorTool />} />
      <Route path="/watermark-adder" element={<WatermarkAdderTool />} />
      <Route path="/white-background-adder" element={<WhiteBackgroundAdderTool />} />
      <Route path="/bulk-image-resizer" element={<BulkImageResizerTool />} />
      <Route path="/image-color-enhancer" element={<Navigate to="/ai-image-color-enhancer" replace />} />
      <Route path="/ai-image-color-enhancer" element={<ImageColorEnhancerTool />} />

      {/* Video Tools */}
      <Route path="/ai-video-to-audio" element={<Navigate to="/video-to-audio" replace />} />
      <Route path="/video-to-audio" element={<VideoToAudioTool />} />
      <Route path="/video-trim" element={<VideoTrimTool />} />
      <Route path="/video-speed" element={<VideoSpeedTool />} />
      <Route path="/video-thumbnail" element={<VideoThumbnailTool />} />
      <Route path="/video-resolution" element={<VideoResolutionTool />} />

      {/* Audio Tools */}
      <Route path="/audio-converter" element={<AudioConverterTool />} />
      <Route path="/speech-to-text" element={<Navigate to="/ai-speech-to-text" replace />} />
      <Route path="/ai-speech-to-text" element={<SpeechToTextTool />} />
      <Route path="/audio-trimmer" element={<AudioTrimmerTool />} />
      <Route path="/audio-merger" element={<AudioMergerTool />} />
      <Route path="/audio-speed" element={<AudioSpeedTool />} />

      {/* Text Tools */}
      <Route path="/word-counter" element={<WordCounterTool />} />
      <Route path="/case-converter" element={<CaseConverterTool />} />
      <Route path="/ai-markdown-to-html" element={<Navigate to="/markdown-to-html" replace />} />
      <Route path="/markdown-to-html" element={<MarkdownHTMLTool />} />
      <Route path="/remove-spaces" element={<RemoveSpacesTool />} />
      <Route path="/line-sorter" element={<LineSorterTool />} />
      <Route path="/duplicate-remover" element={<DuplicateRemoverTool />} />
      <Route path="/text-summarizer" element={<Navigate to="/ai-text-summarizer" replace />} />
      <Route path="/ai-text-summarizer" element={<TextSummarizerTool />} />
      <Route path="/text-diff" element={<TextDiffTool />} />

      {/* Security Tools */}
      <Route path="/password-generator" element={<PasswordGeneratorTool />} />
      <Route path="/password-strength" element={<PasswordStrengthTool />} />
      <Route path="/hash-generator" element={<HashGeneratorTool />} />
      <Route path="/base64-encoder" element={<Base64Tool />} />
      <Route path="/uuid-generator" element={<UUIDGeneratorTool />} />
      <Route path="/password-strength-explainer" element={<Navigate to="/ai-password-strength-explainer" replace />} />
      <Route path="/ai-password-strength-explainer" element={<PasswordStrengthExplainerTool />} />
      <Route path="/data-breach-email-checker" element={<DataBreachEmailCheckerTool />} />
      <Route path="/file-hash-comparison" element={<FileHashComparisonTool />} />
      <Route path="/exif-location-remover" element={<EXIFLocationRemoverTool />} />
      <Route path="/text-redaction" element={<Navigate to="/ai-text-redaction" replace />} />
      <Route path="/ai-text-redaction" element={<TextRedactionTool />} />
      <Route path="/qr-phishing-scanner" element={<Navigate to="/ai-qr-phishing-scanner" replace />} />
      <Route path="/ai-qr-phishing-scanner" element={<QRPhishingScannerTool />} />
      <Route path="/secure-notes" element={<SecureNotesTool />} />
      <Route path="/url-reputation-checker" element={<Navigate to="/ai-url-reputation-checker" replace />} />
      <Route path="/ai-url-reputation-checker" element={<URLReputationCheckerTool />} />

      {/* Date & Time Tools */}
      <Route path="/age-calculator" element={<AgeCalculatorTool />} />
      <Route path="/date-difference" element={<DateDifferenceTool />} />
      <Route path="/working-days-calculator" element={<WorkingDaysTool />} />
      <Route path="/countdown-timer" element={<CountdownTimerTool />} />
      <Route path="/world-time" element={<WorldTimeTool />} />

      {/* Developer Tools */}
      <Route path="/json-formatter" element={<JSONFormatterTool />} />
      <Route path="/regex-tester" element={<RegexTesterTool />} />
      <Route path="/url-encoder" element={<URLEncoderTool />} />
      <Route path="/color-converter" element={<ColorConverterTool />} />
      <Route path="/lorem-ipsum-generator" element={<LoremGeneratorTool />} />
      <Route path="/jwt-decoder" element={<JWTDecoderTool />} />
      <Route path="/cron-generator" element={<Navigate to="/ai-cron-generator" replace />} />
      <Route path="/ai-cron-generator" element={<CronGeneratorTool />} />
      <Route path="/http-header-checker" element={<HTTPHeaderTool />} />
      <Route path="/token-calculator" element={<TokenCalculatorTool />} />
      <Route path="/color-palettes" element={<ColorPalettesTool />} />
      <Route path="/api-response-formatter" element={<APIResponseFormatterTool />} />
      <Route path="/json-to-typescript-interface" element={<Navigate to="/ai-json-to-typescript-interface" replace />} />
      <Route path="/ai-json-to-typescript-interface" element={<JsonToTypeScriptTool />} />
      <Route path="/sql-query-beautifier" element={<Navigate to="/ai-sql-query-beautifier" replace />} />
      <Route path="/ai-sql-query-beautifier" element={<SQLQueryBeautifierTool />} />
      <Route path="/jwt-token-expiry-calculator" element={<JWTExpiryTool />} />
      <Route path="/environment-variable-generator" element={<EnvironmentVariableTool />} />
      <Route path="/postman-collection-generator" element={<Navigate to="/ai-postman-collection-generator" replace />} />
      <Route path="/ai-postman-collection-generator" element={<PostmanCollectionTool />} />
      <Route path="/dockerfile-generator" element={<Navigate to="/ai-dockerfile-generator" replace />} />
      <Route path="/ai-dockerfile-generator" element={<DockerfileGeneratorTool />} />
      <Route path="/curl-to-axios-converter" element={<CurlToAxiosTool />} />
      <Route path="/http-status-code-explainer" element={<HTTPStatusCodeTool />} />
      <Route path="/html-validator" element={<HTMLValidatorTool />} />
      <Route path="/css-validator" element={<CSSValidatorTool />} />

      {/* Internet Tools */}
      <Route path="/ip-lookup" element={<IPLookupTool />} />
      <Route path="/user-agent-parser" element={<UserAgentTool />} />
      <Route path="/dns-lookup" element={<DNSLookupTool />} />
      <Route path="/ssl-checker" element={<SSLCheckerTool />} />
      <Route path="/website-ping" element={<WebsitePingTool />} />
      <Route path="/ping-test" element={<PingTestTool />} />
      <Route path="/website-screenshot" element={<WebsiteScreenshotTool />} />

      {/* Education Tools */}
      <Route path="/scientific-calculator" element={<ScientificCalculatorTool />} />
      <Route path="/percentage-calculator" element={<PercentageCalculatorTool />} />
      <Route path="/ai-unit-converter" element={<Navigate to="/unit-converter" replace />} />
      <Route path="/unit-converter" element={<UnitConverterTool />} />
      <Route path="/compound-interest-calculator" element={<CompoundInterestTool />} />
      <Route path="/simple-interest-calculator" element={<SimpleInterestTool />} />
      <Route path="/cgpa-to-percentage" element={<CGPAToPercentageTool />} />
      <Route path="/lcm-hcf-calculator" element={<LCMHCFTool />} />
      <Route path="/study-timetable-generator" element={<Navigate to="/ai-study-timetable-generator" replace />} />
      <Route path="/ai-study-timetable-generator" element={<StudyTimetableTool />} />
      <Route path="/mcq-generator" element={<Navigate to="/ai-mcq-generator" replace />} />
      <Route path="/ai-mcq-generator" element={<MCQGeneratorTool />} />

      {/* Finance Tools */}
      <Route path="/emi-calculator" element={<EMICalculatorTool />} />
      <Route path="/gst-calculator" element={<GSTCalculatorTool />} />
      <Route path="/salary-calculator" element={<SalaryCalculatorTool />} />
      <Route path="/currency-converter" element={<CurrencyConverterTool />} />
      <Route path="/startup-burn-rate-calculator" element={<StartupBurnRateCalculatorTool />} />
      <Route path="/saas-pricing-calculator" element={<Navigate to="/ai-saas-pricing-calculator" replace />} />
      <Route path="/ai-saas-pricing-calculator" element={<SaaSPricingCalculatorTool />} />
      <Route path="/emi-comparison" element={<EMIComparisonTool />} />
      <Route path="/tax-slab-analyzer" element={<Navigate to="/ai-tax-slab-analyzer" replace />} />
      <Route path="/ai-tax-slab-analyzer" element={<TaxSlabAnalyzerTool />} />
      <Route path="/invoice-generator" element={<InvoiceGeneratorTool />} />
      <Route path="/profit-margin-calculator" element={<ProfitMarginCalculatorTool />} />
      <Route path="/freelancer-rate-calculator" element={<FreelancerRateCalculatorTool />} />
      <Route path="/salary-breakup-generator" element={<SalaryBreakupGeneratorTool />} />
      <Route path="/budget-planner" element={<Navigate to="/ai-budget-planner" replace />} />
      <Route path="/ai-budget-planner" element={<BudgetPlannerTool />} />
      <Route path="/stock-cagr-calculator" element={<StockCAGRCalculatorTool />} />
      <Route path="/mutual-fund-calculator" element={<MutualFundCalculatorTool />} />
      <Route path="/lumpsum-calculator" element={<LumpsumCalculatorTool />} />
      <Route path="/sip-calculator" element={<SIPCalculatorTool />} />
      <Route path="/roi-calculator" element={<ROICalculatorTool />} />

      {/* SEO Tools */}
      <Route path="/meta-title-description-generator" element={<Navigate to="/ai-meta-tag-generator" replace />} />
      <Route path="/ai-meta-tag-generator" element={<MetaTitleDescriptionTool />} />
      <Route path="/ai-keyword-density-checker" element={<Navigate to="/keyword-density-checker" replace />} />
      <Route path="/keyword-density-checker" element={<KeywordDensityTool />} />
      <Route path="/robots-txt-generator" element={<RobotsTxtTool />} />
      <Route path="/sitemap-validator" element={<SitemapValidatorTool />} />
      <Route path="/page-speed-checklist-generator" element={<PageSpeedChecklistTool />} />
      <Route path="/og-image-preview-tool" element={<OGImagePreviewTool />} />
      <Route path="/broken-image-finder" element={<BrokenImageFinderTool />} />
      <Route path="/utm-link-builder" element={<UTMLinkBuilderTool />} />
      <Route path="/domain-age-checker" element={<DomainAgeTool />} />
      <Route path="/tech-stack-detector" element={<Navigate to="/ai-tech-stack-detector" replace />} />
      <Route path="/ai-tech-stack-detector" element={<TechStackDetectorTool />} />
      <Route path="/page-seo-analyzer" element={<Navigate to="/ai-page-seo-analyzer" replace />} />
      <Route path="/ai-page-seo-analyzer" element={<PageSEOTool />} />

      {/* ZIP Tools */}
      <Route path="/create-zip" element={<CreateZipTool />} />
      <Route path="/extract-zip" element={<ExtractZipTool />} />
      <Route path="/password-zip" element={<PasswordZipTool />} />
      <Route path="/compression-zip" element={<CompressionZipTool />} />

      {/* Social Tools */}
      <Route path="/hashtag-generator" element={<Navigate to="/ai-hashtag-generator" replace />} />
      <Route path="/ai-hashtag-generator" element={<HashtagGeneratorTool />} />
      <Route path="/bio-generator" element={<Navigate to="/ai-bio-generator" replace />} />
      <Route path="/ai-bio-generator" element={<BioGeneratorTool />} />
      <Route path="/ai-caption-formatter" element={<Navigate to="/caption-formatter" replace />} />
      <Route path="/caption-formatter" element={<CaptionFormatterTool />} />
      <Route path="/line-break-generator" element={<LineBreakGeneratorTool />} />
      <Route path="/link-in-bio" element={<LinkInBioTool />} />
      <Route path="/meme-generator" element={<Navigate to="/ai-meme-generator" replace />} />
      <Route path="/ai-meme-generator" element={<MemeGeneratorTool />} />
      <Route path="/ai-whatsapp-status-generator" element={<WhatsAppStatusTool />} />

      {/* Email Marketing Tools */}
      <Route path="/email-subject-line-generator" element={<Navigate to="/ai-email-subject-line-generator" replace />} />
      <Route path="/ai-email-subject-line-generator" element={<EmailSubjectLineGeneratorTool />} />
      <Route path="/email-signature-generator" element={<Navigate to="/ai-email-signature-generator" replace />} />
      <Route path="/ai-email-signature-generator" element={<EmailSignatureGeneratorTool />} />
      <Route path="/html-email-previewer" element={<HTMLEmailPreviewerTool />} />
      <Route path="/spam-score-checker" element={<Navigate to="/ai-spam-score-checker" replace />} />
      <Route path="/ai-spam-score-checker" element={<SpamScoreCheckerTool />} />
      <Route path="/email-template-builder" element={<Navigate to="/ai-email-template-builder" replace />} />
      <Route path="/ai-email-template-builder" element={<EmailTemplateBuilderTool />} />
      <Route path="/email-header-analyzer" element={<Navigate to="/ai-email-header-analyzer" replace />} />
      <Route path="/ai-email-header-analyzer" element={<EmailHeaderAnalyzerTool />} />
      <Route path="/spf-record-generator" element={<SPFRecordGeneratorTool />} />
      <Route path="/dkim-generator" element={<DKIMGeneratorTool />} />
      <Route path="/dmarc-generator" element={<DMARCGeneratorTool />} />
      <Route path="/mailto-link-generator" element={<MailtoLinkGeneratorTool />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Suspense fallback={<PageLoadingFallback />}>
            <AnimatedRoutes />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
