import { useRef } from "react";
import { FileText, Upload } from "lucide-react";
import { validateUploadedFile, getFileFormats } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface PDFUploadZoneProps {
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: string;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
}

export const PDFUploadZone = ({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick,
  onFileSelect,
  accept = "application/pdf",
  maxSize = "50MB",
  multiple = false,
  title = "Drop PDF document here or click to browse",
  subtitle = `Supports PDF files up to ${maxSize}`,
  buttonLabel = "Choose PDF",
}: PDFUploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
    onClick();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        if (validateUploadedFile(files[i], accept)) {
          validFiles.push(files[i]);
        }
      }

      if (validFiles.length < files.length) {
        const { uploadFormat } = getFileFormats(
          window.location.pathname,
          accept
        );
        toast({
          title: "Unsupported File Format",
          description: `Please upload a valid ${uploadFormat || "PDF"} document to proceed.`,
          variant: "destructive",
        });
        e.target.value = "";
        return;
      }

      if (multiple) {
        Array.from(files).forEach(onFileSelect);
      } else if (files[0]) {
        onFileSelect(files[0]);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const validFiles: File[] = [];
      for (let i = 0; i < files.length; i++) {
        if (validateUploadedFile(files[i], accept)) {
          validFiles.push(files[i]);
        }
      }

      if (validFiles.length < files.length) {
        const { uploadFormat } = getFileFormats(
          window.location.pathname,
          accept
        );
        toast({
          title: "Unsupported File Format",
          description: `Please drop a valid ${uploadFormat || "PDF"} document.`,
          variant: "destructive",
        });
        onDragLeave(e);
        return;
      }
    }
    onDrop(e);
  };

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 md:p-14 text-center transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl ${
        isDragging
          ? "border-red-500 bg-red-500/10 shadow-2xl shadow-red-500/20 scale-[1.01]"
          : "border-slate-300/90 bg-white/85 shadow-md shadow-slate-900/5 hover:border-red-500/60 hover:shadow-xl hover:bg-white"
      }`}
    >
      <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md">
        <div
          className={`flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl border transition-all duration-300 ${
            isDragging
              ? "border-red-500 bg-red-500/20 scale-110 shadow-lg shadow-red-500/25"
              : "border-slate-200 bg-slate-50 group-hover:border-red-500/40 group-hover:scale-105 shadow-sm"
          }`}
        >
          <FileText
            className={`h-8 w-8 md:h-10 md:w-10 transition-colors ${
              isDragging ? "text-red-500" : "text-muted-foreground group-hover:text-red-500"
            }`}
          />
        </div>

        <div>
          <p className="text-base sm:text-lg font-bold text-foreground group-hover:text-red-600 transition-colors">
            {title}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-rose-500 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-red-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/35 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Upload className="h-4 w-4" />
          <span>{buttonLabel}{multiple ? "s" : ""}</span>
        </button>

        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground font-mono">
          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5">.PDF</span>
          <span className="text-slate-400">· Fast in-memory parsing</span>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};