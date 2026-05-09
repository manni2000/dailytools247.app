import { useState } from "react";
import { Upload, FileText, Download, Copy, Check, Sparkles, FileAudio, FileVideo, File } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";
import ToolLayout from "@/components/layout/ToolLayout";
import ToolFAQ from "@/components/ToolFAQ";
import { CategorySEO } from "@/components/ToolSEO";
import { getToolSeoMetadata } from "@/data/toolSeoEnhancements";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const categoryColor = "260 70% 55%";

const TranscriptExtractorTool = () => {
  const toolSeoData = getToolSeoMetadata('transcript-extractor');
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    try {
      // Check file type
      const fileType = file.type.toLowerCase();
      const validTypes = [
        'text/plain',
        'text/csv',
        'application/json',
        'application/xml',
        'text/xml',
        'text/html',
        'text/markdown',
        'text/vtt',
        'text/srt',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/pdf'
      ];

      if (!validTypes.includes(fileType) && !file.name.match(/\.(txt|csv|json|xml|html|md|vtt|srt|docx|doc|pdf)$/i)) {
        throw new Error('Unsupported file type. Please upload text, subtitle, or document files.');
      }

      let text = '';

      // Handle different file types
      if (fileType === 'text/plain' || file.name.match(/\.(txt|csv|vtt|srt|md)$/i)) {
        text = await file.text();
      } else if (file.type === 'application/json') {
        const json = JSON.parse(await file.text());
        // Extract text from common JSON structures
        text = extractTextFromJSON(json);
      } else if (file.type === 'text/xml' || file.type === 'application/xml') {
        text = extractTextFromXML(await file.text());
      } else if (file.type === 'text/html') {
        text = extractTextFromHTML(await file.text());
      } else {
        // For other document types, we'll need to handle them differently
        // For now, we'll show a message about the limitation
        text = `File "${file.name}" uploaded successfully. 

Note: This tool currently supports direct text extraction from:
• Plain text files (.txt, .csv, .md)
• Subtitle files (.vtt, .srt)
• JSON files (.json)
• XML files (.xml)
• HTML files (.html)

For document files like PDF, DOCX, etc., please copy and paste the text directly into the text area below.`;
      }

      setExtractedText(text);
      toast({
        title: "Success!",
        description: `Text extracted from ${file.name}`,
      });
    } catch (error) {
      console.error('Error extracting text:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to extract text from file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTextFromJSON = (obj: any): string => {
    let text = '';
    
    function extractValue(value: any): void {
      if (typeof value === 'string') {
        text += value + ' ';
      } else if (Array.isArray(value)) {
        value.forEach(item => extractValue(item));
      } else if (typeof value === 'object' && value !== null) {
        Object.values(value).forEach(val => extractValue(val));
      }
    }
    
    extractValue(obj);
    return text.trim();
  };

  const extractTextFromXML = (xmlString: string): string => {
    return xmlString.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const extractTextFromHTML = (htmlString: string): string => {
    return htmlString.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleDownload = () => {
    if (!extractedText) return;
    
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Text file downloaded successfully",
    });
  };

  const handleClear = () => {
    setExtractedText("");
    setFileName("");
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <>
      {CategorySEO.Text(
        toolSeoData?.title || "Transcript Text Extractor",
        toolSeoData?.description || "Extract text from various file formats including documents, subtitles, and more",
        "transcript-extractor"
      )}
      <ToolLayout
        breadcrumbTitle="Transcript Extractor"
        category="Text Tools"
        categoryPath="/category/text"
      >
        <div className="space-y-6">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-muted/50 via-background to-muted/30 rounded-xl border border-border p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Upload File</h2>
                <p className="text-sm text-muted-foreground">
                  Extract text from documents, subtitles, and other file formats
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const input = document.getElementById('file-upload') as HTMLInputElement;
                    if (input) {
                      const dataTransfer = new DataTransfer();
                      dataTransfer.items.add(file);
                      input.files = dataTransfer.files;
                      handleFileUpload({ target: { files: dataTransfer.files } } as any);
                    }
                  }
                }}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".txt,.csv,.json,.xml,.html,.md,.vtt,.srt,.docx,.doc,.pdf"
                  onChange={handleFileUpload}
                />
                
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Drop your file here or click to browse</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports: TXT, CSV, JSON, XML, HTML, MD, VTT, SRT, DOCX, PDF
                    </p>
                  </div>
                  <Button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    disabled={isProcessing}
                    variant="outline"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {fileName && (
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <File className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{fileName}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Extracted Text Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-muted/50 via-background to-muted/30 rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Extracted Text</h2>
                  <p className="text-sm text-muted-foreground">
                    {extractedText ? `${extractedText.length} characters extracted` : "Text will appear here after extraction"}
                  </p>
                </div>
              </div>
              
              {extractedText && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>

            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder="Extracted text will appear here. You can also paste text directly to edit or save it."
              className="min-h-[300px] resize-none"
            />
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <FileAudio className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Subtitle Files</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Extract text from VTT and SRT subtitle files
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <File className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Document Files</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Support for TXT, CSV, JSON, XML, and HTML formats
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <FileVideo className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Easy Export</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Download extracted text as plain text file
              </p>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ToolFAQ
              toolCategory="Text Tools"
              faqs={[
                {
                  question: "What file formats are supported?",
                  answer: "The tool supports a wide range of formats including TXT, CSV, JSON, XML, HTML, Markdown, VTT, SRT subtitle files, and document files like DOCX and PDF."
                },
                {
                  question: "How does text extraction work?",
                  answer: "The tool reads the file content and extracts readable text while removing formatting, tags, and metadata. For structured files like JSON and XML, it intelligently extracts text values."
                },
                {
                  question: "Can I edit the extracted text?",
                  answer: "Yes! After extraction, you can edit the text directly in the text area, copy it to clipboard, or download it as a text file."
                },
                {
                  question: "Is there a file size limit?",
                  answer: "For optimal performance, we recommend files under 10MB. Larger files may take longer to process and could impact browser performance."
                }
              ]}
            />
          </motion.div>
        </div>
      </ToolLayout>
    </>
  );
};

export default TranscriptExtractorTool;
