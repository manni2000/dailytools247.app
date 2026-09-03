import { useRef } from "react";
import { Upload, File } from "lucide-react";
import { validateUploadedFile, getFileFormats } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface GeneralFileUploadZoneProps {
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

export const GeneralFileUploadZone = ({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick,
  onFileSelect,
  accept = "*/*",
  maxSize = "50MB",
  multiple = false,
  title = "Drop file here or click to browse",
  subtitle = `Supports files up to ${maxSize}`,
  buttonLabel = "Choose File",
}: GeneralFileUploadZoneProps) => {
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
          description: `Please upload a valid ${uploadFormat || "supported"} file to proceed.`,
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
          description: `Please drop a valid ${uploadFormat || "supported"} file.`,
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
      className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
        isDragging
          ? "border-primary bg-primary/10 shadow-xl shadow-primary/10 scale-[1.01]"
          : "border-border/80 bg-card/60 hover:border-primary/50 hover:bg-card/90 dark:border-white/10 dark:bg-[#0D1017]/80 dark:hover:border-primary/50"
      }`}
    >
      <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md">
        <div
          className={`flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl border transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/20 scale-110 shadow-lg shadow-primary/25"
              : "border-border/80 bg-background/80 group-hover:border-primary/40 group-hover:scale-105 shadow-sm"
          }`}
        >
          <File
            className={`h-8 w-8 md:h-10 md:w-10 transition-colors ${
              isDragging ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            }`}
          />
        </div>

        <div>
          <p className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-light">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/95 active:scale-95"
        >
          <Upload className="h-4 w-4" />
          <span>{buttonLabel}{multiple ? "s" : ""}</span>
        </button>

        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground/70 font-mono">
          <span>Local browser sandbox execution</span>
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