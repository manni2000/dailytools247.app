import { useState, useRef } from "react";
import { Upload, Merge, X, FileText, GripVertical, Sparkles, Layers, Download } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, scaleIn } from "@/lib/animations";

import ToolHero from "@/components/ToolHero";
import ToolLayout from "@/components/layout/ToolLayout";
import { PDFDocument } from "pdf-lib";
import { DownloadCard } from "@/components/ui/download-card";
import { PDFUploadZone } from "@/components/ui/pdf-upload-zone";
import { CategorySEO } from "@/components/ToolSEO";
import { getToolSeoMetadata } from "@/data/toolSeoEnhancements";
import ToolFAQ from "@/components/ToolFAQ";

const categoryColor = "0 70% 50%";

const PDFMergeTool = () => {
  const toolSeoData = getToolSeoMetadata("pdf-merge");
  const [files, setFiles] = useState<{ file: File; name: string }[]>([]);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const pdfFiles = Array.from(newFiles)
      .filter((f) => f.type === "application/pdf")
      .map((file) => ({ file, name: file.name }));
    setFiles((prev) => [...prev, ...pdfFiles]);
    setMergedUrl(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setMergedUrl(null);
  };

  const moveFile = (from: number, to: number) => {
    const updated = [...files];
    const [removed] = updated.splice(from, 1);
    updated.splice(to, 0, removed);
    setFiles(updated);
    setMergedUrl(null);
  };

  const merge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const { file } of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedBytes)], { type: "application/pdf" });
      setMergedUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error merging PDFs:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {CategorySEO.PDF(
        toolSeoData?.title || "PDF Merge",
        toolSeoData?.description || "Combine multiple PDF files into one document",
        "pdf-merge"
      )}
      <ToolLayout
        breadcrumbTitle="PDF Merge"
        category="PDF Tools"
        categoryPath="/category/pdf"
      >
        <div className="space-y-6">
          <ToolHero
            title="PDF Merge"
            subtitle="Combine multiple PDF files into a single, organized document. 100% Online Free."
            Icon={Layers}
            categoryColor={categoryColor}
          />

          {/* Upload Area */}
          <PDFUploadZone
            isDragging={isDragging}
            onDragEnter={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            onFileSelect={(file) => {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              handleFiles(dataTransfer.files);
            }}
            multiple={true}
            title="Drop PDF files here or click to browse"
            subtitle="Select multiple PDF files to merge (up to 50MB each)"
          />

          {/* File List */}
          {files.length > 0 && (
            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm dark:border-white/10 dark:bg-[#0D1017]">
              <h3 className="mb-4 font-bold text-foreground">
                Files to Merge ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-xl bg-muted/40 p-3 border border-border/50"
                  >
                    <GripVertical className="h-4 w-4 cursor-move text-muted-foreground" />
                    <FileText className="h-4.5 w-4.5 text-primary flex-shrink-0" />
                    <span className="flex-1 truncate text-xs sm:text-sm font-medium">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveFile(index, index - 1)}
                          className="rounded-lg p-1 text-xs hover:bg-muted font-mono"
                          title="Move file up"
                          aria-label="Move file up"
                        >
                          ↑
                        </button>
                      )}
                      {index < files.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveFile(index, index + 1)}
                          className="rounded-lg p-1 text-xs hover:bg-muted font-mono"
                          title="Move file down"
                          aria-label="Move file down"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="rounded-lg p-1 text-destructive hover:bg-destructive/10"
                        title="Remove file"
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={merge}
              disabled={files.length < 2 || isProcessing}
              className="btn-primary flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <Merge className="h-4 w-4" />
              <span>{isProcessing ? "Merging..." : "Merge PDFs"}</span>
            </button>
          </div>

          {files.length === 1 && (
            <p className="text-center text-xs text-muted-foreground font-light">
              Add at least 2 PDF files to merge into a single document
            </p>
          )}

          {mergedUrl && (
            <div className="flex justify-center mt-6 w-full">
              <DownloadCard
                fileUrl={mergedUrl}
                fileName={
                  files.length > 0
                    ? `${files[0].name.replace(/\.[^/.]+$/, "")}-merged.pdf`
                    : "merged.pdf"
                }
                fileType="pdf"
                fileSize={files.reduce((acc, f) => acc + f.file.size, 0)}
                title="PDFs Merged Successfully!"
                description={`${files.length} PDF files have been merged into one document`}
                onDownload={() => {
                  const link = document.createElement("a");
                  link.href = mergedUrl;
                  link.download =
                    files.length > 0
                      ? `${files[0].name.replace(/\.[^/.]+$/, "")}-merged.pdf`
                      : "merged.pdf";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                onConvertAnother={() => {
                  setFiles([]);
                  setMergedUrl(null);
                }}
                metadata={{
                  Files: `${files.length} combined`,
                  Format: "PDF",
                }}
                showPreview={true}
                variant="default"
                onConvertAnotherLabel="Merge More PDFs"
              />
            </div>
          )}
        </div>

        <div className="mt-8">
          <ToolFAQ
            faqs={[
              {
                question: "Is there a limit to how many PDFs I can merge?",
                answer:
                  "You can merge multiple PDFs together. The process executes directly in client memory without arbitrary platform limits.",
              },
              {
                question: "Will the quality of my PDFs be affected?",
                answer:
                  "No, the merging process preserves the original vector quality of all PDFs. Text, images, and formatting remain 100% untouched.",
              },
              {
                question: "Can I change the order of pages after uploading?",
                answer:
                  "Yes, you can use the move buttons to rearrange their order before merging. The final merged PDF will follow your chosen sequence.",
              },
            ]}
          />
        </div>
      </ToolLayout>
    </>
  );
};

export default PDFMergeTool;
