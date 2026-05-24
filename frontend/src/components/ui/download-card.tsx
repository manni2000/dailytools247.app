import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  FileText,
  ImageIcon,
  Music2,
  Film,
  Archive,
  Code,
  Table2,
  Share2,
  Copy,
  Check,
  Eye,
  X,
  ZoomIn,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  FileCode,
  AlertCircle,
  File,
  Layers,
  HardDrive,
  Maximize2,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { FileType, FILE_TYPE_CONFIG, formatFileSize } from './download-styles-config';
import { cn } from '@/lib/utils';
import { PreviewPDFEnhanced } from './preview-renderers';

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="h-6 w-6" />,
  ImageIcon: <ImageIcon className="h-6 w-6" />,
  Music2: <Music2 className="h-6 w-6" />,
  Film: <Film className="h-6 w-6" />,
  Archive: <Archive className="h-6 w-6" />,
  Code: <Code className="h-6 w-6" />,
  Table2: <Table2 className="h-6 w-6" />,
};

interface DownloadCardProps {
  fileName: string;
  fileType: FileType;
  fileSize?: number;
  fileUrl?: string;
  title?: string;
  description?: string;
  onDownload: () => void | Promise<void>;
  onDownloadZip?: () => void | Promise<void>;
  onConvertAnother?: () => void | Promise<void>;
  onConvertAnotherLabel?: string;
  onReset?: () => void | Promise<void>;
  onShare?: () => void | Promise<void>;
  previewUrl?: string | string[];
  metadata?: Record<string, string>;
  showPreview?: boolean;
  isLoading?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'compact' | 'detailed';
  disabled?: boolean;
  showStorageNotice?: boolean;
  additionalActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
}

const ProfessionalAudioPlayer = ({ src, fileName }: { src: string; fileName: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const vol = Number(e.target.value);
    audio.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-xs sm:max-w-md bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-2xl border border-slate-800 flex flex-col gap-5">
      <audio ref={audioRef} src={src} />
      
      <div className="flex flex-col items-center gap-3">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 relative shadow-inner">
          <Music2 className={cn("h-10 w-10 text-primary transition-transform duration-500", isPlaying && "scale-110 rotate-12")} />
          {isPlaying && (
            <div className="absolute inset-0 border border-primary/30 rounded-full animate-ping opacity-75" />
          )}
        </div>
        <div className="text-center w-full">
          <h4 className="font-semibold text-sm truncate px-4">{fileName}</h4>
          <p className="text-xs text-slate-400 mt-0.5">Audio Player</p>
        </div>
      </div>

      <div className="h-12 flex items-end justify-center gap-[3px] px-2 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => {
          const scale = isPlaying 
            ? `calc(0.2 + ${Math.sin((i + currentTime * 4) * 0.8) * 0.4 + 0.4})` 
            : '0.15';
          return (
            <div 
              key={i} 
              className={cn("w-[4px] bg-primary rounded-full transition-all duration-300")}
              style={{
                height: isPlaying ? '100%' : '12px',
                transform: `scaleY(${scale})`,
                transformOrigin: 'bottom',
                opacity: isPlaying ? 0.85 : 0.4
              }}
            />
          );
        })}
      </div>

      <div className="space-y-1">
        <input 
          type="range" 
          min={0} 
          max={duration || 100} 
          value={currentTime} 
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
          title="Progress"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <button 
          onClick={toggleMute} 
          className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>

        <button 
          onClick={togglePlay} 
          className="w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 animate-pulse-playing"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
        </button>

        <div className="flex items-center gap-2 w-20">
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.05} 
            value={isMuted ? 0 : volume} 
            onChange={handleVolumeChange}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
            title="Volume"
          />
        </div>
      </div>
    </div>
  );
};

const DocumentPreviewMockup = ({ fileType, fileName, fileSize }: { fileType: 'word' | 'excel' | 'powerpoint'; fileName: string; fileSize?: number }) => {
  const configs = {
    word: {
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      lightColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: <FileText className="h-12 w-12 text-blue-600" />,
      label: 'DOCX Document'
    },
    excel: {
      color: 'bg-emerald-600',
      textColor: 'text-emerald-600',
      lightColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: <Table2 className="h-12 w-12 text-emerald-600" />,
      label: 'XLSX Spreadsheet'
    },
    powerpoint: {
      color: 'bg-orange-600',
      textColor: 'text-orange-600',
      lightColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: <Film className="h-12 w-12 text-orange-600" />,
      label: 'PPTX Presentation'
    }
  };

  const config = configs[fileType] || configs.word;

  return (
    <div className="w-56 h-72 bg-white rounded-lg shadow-xl border border-slate-200/80 flex flex-col justify-between overflow-hidden relative group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
      <div className={cn("h-2.5 w-full", config.color)} />
      
      <div className="flex-1 p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          {config.icon}
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{config.label}</span>
            <h5 className="font-semibold text-xs text-slate-800 truncate" title={fileName}>{fileName}</h5>
          </div>
        </div>

        <div className="space-y-2 mt-2">
          <div className="h-2 bg-slate-100 rounded w-11/12" />
          <div className="h-2 bg-slate-100 rounded w-full" />
          <div className="h-2 bg-slate-100 rounded w-4/5" />
          <div className="h-2 bg-slate-100 rounded w-10/12" />
          <div className="h-2 bg-slate-100 rounded w-3/5" />
        </div>

        {fileType === 'excel' && (
          <div className="border border-slate-100 rounded overflow-hidden grid grid-cols-3 gap-0.5 bg-slate-50 p-1 text-[8px] font-mono text-slate-400 mt-1">
            <div className="bg-slate-100 p-0.5 font-bold">A1</div>
            <div className="bg-slate-100 p-0.5 font-bold">B1</div>
            <div className="bg-slate-100 p-0.5 font-bold">C1</div>
            <div className="bg-white p-0.5">120</div>
            <div className="bg-white p-0.5">450</div>
            <div className="bg-white p-0.5">570</div>
            <div className="bg-white p-0.5">340</div>
            <div className="bg-white p-0.5">520</div>
            <div className="bg-white p-0.5">860</div>
          </div>
        )}

        {fileType === 'powerpoint' && (
          <div className="border border-slate-100 rounded aspect-video bg-slate-900 p-2 mt-1 relative flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 absolute top-1.5 left-1.5 animate-pulse" />
            <div className="text-[7px] text-white font-semibold">Title Slide</div>
          </div>
        )}
      </div>

      <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between text-[10px] text-slate-500 font-medium">
        <span>{fileSize ? formatFileSize(fileSize) : 'Document'}</span>
        <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-bold uppercase", config.lightColor, config.textColor)}>
          {fileType === 'word' ? 'DOCX' : fileType === 'excel' ? 'XLSX' : 'PPTX'}
        </span>
      </div>
    </div>
  );
};

/**
 * Professional Download Card Component
 * Displays file information with download actions
 */
export const DownloadCard = ({
  fileName,
  fileType,
  fileSize,
  fileUrl,
  title = 'Download Ready',
  description = 'Your file is ready for download',
  onDownload,
  onDownloadZip,
  onConvertAnother,
  onConvertAnotherLabel,
  onReset,
  onShare,
  previewUrl,
  metadata = {},
  showPreview = false,
  isLoading = false,
  className,
  variant = 'default',
  disabled = false,
  showStorageNotice = true,
  additionalActions = [],
}: DownloadCardProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showNotice, setShowNotice] = useState(true);
  const dismissNotice = () => setShowNotice(false);

  const fileConfig = FILE_TYPE_CONFIG[fileType];
  const getFileIcon = () => ICON_MAP[fileConfig.icon] || <FileText className="h-6 w-6" />;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = () => {
    if (fileUrl) {
      navigator.clipboard.writeText(fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (onShare) {
      await onShare();
    }
  };

  // Minimal variant - Just the button
  if (variant === 'minimal') {
    return (
      <Button
        onClick={handleDownload}
        disabled={isDownloading || disabled}
        className={cn('gap-2', className)}
      >
        <Download className="h-4 w-4" />
        {isDownloading ? 'Downloading...' : 'Download'}
      </Button>
    );
  }

  // Compact variant - Small card with essentials
  if (variant === 'compact') {
    return (
      <Card className={cn('overflow-hidden hover:shadow-md transition-shadow', className)}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', fileConfig.backgroundColor)}>
              {getFileIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{fileName}</p>
              {fileSize && <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>}
            </div>
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading || disabled}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed variant - Full card with all info
  if (variant === 'detailed') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>

          {/* File Info */}
          <div className={cn('p-4 rounded-lg', fileConfig.backgroundColor)}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-white/50 rounded-lg">
                  {getFileIcon()}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{fileName}</h4>
                  <p className="text-xs mt-1">{fileConfig.displayName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Format</span>
              <p className="font-medium">{fileType.toUpperCase()}</p>
            </div>
            {fileSize && (
              <div>
                <span className="text-muted-foreground">Size</span>
                <p className="font-medium">{formatFileSize(fileSize)}</p>
              </div>
            )}
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key}>
                <span className="text-muted-foreground capitalize">{key}</span>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* Preview */}
          {previewUrl && showPreview && (
            <div className="rounded-lg overflow-hidden bg-muted/30 max-h-32">
              <img
                src={typeof previewUrl === 'string' ? previewUrl : previewUrl[0]}
                alt=""
                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedPreview(typeof previewUrl === 'string' ? previewUrl : previewUrl[0])}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading || disabled}
              className="flex-1"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
            {onShare && (
              <Button
                onClick={handleShare}
                variant="outline"
                size="lg"
                disabled={disabled}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}

          </div>

          {/* Additional Actions */}
          {additionalActions.length > 0 && (
            <div className="flex gap-2 pt-2 flex-wrap">
              {additionalActions.map((action, idx) => (
                <Button
                  key={idx}
                  onClick={action.onClick}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  {action.icon}
                  <span className="ml-1">{action.label}</span>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant - Redesigned to two-column premium format
  if (variant === 'default') {
    const urls = Array.isArray(previewUrl) 
      ? previewUrl 
      : previewUrl 
        ? typeof previewUrl === 'string' && previewUrl.includes(',') 
          ? previewUrl.split(',').map(s => s.trim())
          : [previewUrl]
        : [];

    const [pageIndex, setPageIndex] = useState(0);
    const pagesCount = urls.length;

    const handlePrevPage = () => {
      setPageIndex(prev => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
      setPageIndex(prev => Math.min(pagesCount - 1, prev + 1));
    };

    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date());

    return (
      <div className={cn("w-full space-y-6", className)}>
        {/* Success Alert Banner */}
        {showNotice && (
          <div className="relative z-10 rounded-2xl border border-green-200 bg-green-50/70 p-4 text-green-900 flex items-start justify-between gap-4 shadow-sm backdrop-blur-sm">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-green-800 text-[15px] leading-tight mb-0.5">{title}</h4>
                <p className="text-xs text-green-700/90 leading-normal">{description}</p>
              </div>
            </div>
            <button
              onClick={() => setShowNotice(false)}
              className="w-7 h-7 flex items-center justify-center text-green-700 hover:bg-green-100 rounded-lg transition-colors flex-shrink-0 mt-0.5"
              aria-label="Dismiss success notice"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Left Column: Preview */}
          <div className="lg:col-span-7 flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between h-7">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                Preview {pagesCount > 0 ? `(${pagesCount} Page${pagesCount !== 1 ? 's' : ''})` : ''}
              </h3>
            </div>
            
            <div className="relative aspect-[4/3] rounded-2xl border border-border bg-slate-50/80 dark:bg-slate-900/40 flex items-center justify-center p-4 overflow-hidden w-full min-h-[350px] max-h-[450px] shadow-sm">
              {/* Image Previews */}
              {pagesCount > 0 && (fileType === 'image' || fileType === 'pdf') && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={urls[pageIndex]}
                    alt={`Preview Page ${pageIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-md cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
                    onClick={() => setSelectedPreview(urls[pageIndex])}
                  />

                  {/* Arrow controls if multiple pages */}
                  {pagesCount > 1 && (
                    <>
                      <button
                        onClick={handlePrevPage}
                        disabled={pageIndex === 0}
                        className={cn(
                          "absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200/50 flex items-center justify-center transition-all z-10 active:scale-95",
                          pageIndex === 0 && "opacity-40 cursor-not-allowed"
                        )}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={handleNextPage}
                        disabled={pageIndex === pagesCount - 1}
                        className={cn(
                          "absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200/50 flex items-center justify-center transition-all z-10 active:scale-95",
                          pageIndex === pagesCount - 1 && "opacity-40 cursor-not-allowed"
                        )}
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Page indicator pill */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 text-slate-800 border border-slate-200 px-3 py-1 rounded-full text-[11px] font-semibold shadow-sm">
                    Page {pageIndex + 1} / {pagesCount}
                  </div>
                </div>
              )}

              {/* PDF Preview Fallback (if raw PDF is available and not images) */}
              {pagesCount === 0 && fileType === 'pdf' && fileUrl && (
                <div className="w-full h-full flex items-center justify-center">
                  <PreviewPDFEnhanced data={fileUrl} fileName={fileName} />
                </div>
              )}

              {/* Word/Excel/Powerpoint Previews */}
              {(fileType === 'word' || fileType === 'excel' || fileType === 'powerpoint') && (
                <div className="w-full h-full flex items-center justify-center">
                  <DocumentPreviewMockup fileType={fileType} fileName={fileName} fileSize={fileSize} />
                </div>
              )}

              {/* Video Preview */}
              {fileType === 'video' && (fileUrl || (typeof previewUrl === 'string' && previewUrl)) && (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <video
                    src={fileUrl || (typeof previewUrl === 'string' ? previewUrl : undefined)}
                    controls
                    className="max-w-full max-h-full rounded-xl shadow-lg border border-slate-200/50 bg-slate-950"
                  />
                </div>
              )}

              {/* Audio Preview */}
              {fileType === 'audio' && (fileUrl || (typeof previewUrl === 'string' && previewUrl)) && (
                <div className="w-full h-full flex items-center justify-center">
                  <ProfessionalAudioPlayer
                    src={fileUrl || (typeof previewUrl === 'string' ? previewUrl : '')}
                    fileName={fileName}
                  />
                </div>
              )}

              {/* General Fallback for other formats (zip, json, code, etc.) */}
              {pagesCount === 0 && fileType !== 'pdf' && fileType !== 'word' && fileType !== 'excel' && fileType !== 'powerpoint' && fileType !== 'video' && fileType !== 'audio' && (
                <div className="flex flex-col items-center justify-center text-center gap-3">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-md", fileConfig.backgroundColor)}>
                    {getFileIcon()}
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-foreground truncate max-w-[220px]" title={fileName}>{fileName}</h5>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{fileType} File</p>
                  </div>
                  {fileSize && (
                    <Badge variant="secondary" className="text-[10px] tracking-wide">
                      {formatFileSize(fileSize)}
                    </Badge>
                  )}
                  <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
                    Direct preview not available for this format. Download to view contents.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: File Details & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between h-7">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <File className="h-4 w-4 text-muted-foreground" />
                File Details
              </h3>
            </div>
            <Card className="border border-border/80 bg-card rounded-2xl shadow-sm overflow-hidden w-full">
              <CardContent className="p-6 flex flex-col gap-5">

                {/* Metadata List */}
                <div className="flex flex-col text-sm text-foreground">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-2 text-muted-foreground font-medium">
                      <File className="h-3.5 w-3.5" />
                      File Name
                    </span>
                    <span className="font-semibold text-foreground truncate max-w-[180px]" title={fileName}>
                      {fileName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-2 text-muted-foreground font-medium">
                      <Code className="h-3.5 w-3.5" />
                      Format
                    </span>
                    <span className="font-semibold text-foreground uppercase">
                      {fileType === 'word' ? 'DOCX' : fileType === 'excel' ? 'XLSX' : fileType === 'powerpoint' ? 'PPTX' : fileType.toUpperCase()}
                    </span>
                  </div>

                  {pagesCount > 0 && (
                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Layers className="h-3.5 w-3.5" />
                        Pages
                      </span>
                      <span className="font-semibold text-foreground">
                        {pagesCount}
                      </span>
                    </div>
                  )}

                  {fileSize && (
                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-2 text-muted-foreground font-medium">
                        <HardDrive className="h-3.5 w-3.5" />
                        File Size
                      </span>
                      <span className="font-semibold text-foreground">
                        {formatFileSize(fileSize)}
                      </span>
                    </div>
                  )}

                  {metadata['Resolution'] && (
                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Maximize2 className="h-3.5 w-3.5" />
                        Dimensions
                      </span>
                      <span className="font-semibold text-foreground">
                        {metadata['Resolution']}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2 text-muted-foreground font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      Created On
                    </span>
                    <span className="font-semibold text-foreground">
                      {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="flex flex-col gap-3.5 pt-2">
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading || disabled || isLoading}
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 rounded-xl font-medium shadow-md transition-all active:scale-[0.99] focus:ring-primary focus:ring-offset-2"
                    size="lg"
                  >
                    <Download className="h-4 w-4" />
                    {isDownloading || isLoading ? 'Downloading...' : `Download ${fileType === 'word' ? 'DOCX' : fileType === 'excel' ? 'XLSX' : fileType === 'powerpoint' ? 'PPTX' : fileType.toUpperCase()}`}
                  </Button>

                  {/* ZIP download button if callback exists */}
                  {onDownloadZip && (
                    <Button
                      onClick={onDownloadZip}
                      variant="outline"
                      className="w-full h-12 border border-primary text-primary hover:bg-primary/5 flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.99]"
                      size="lg"
                      disabled={disabled || isLoading}
                    >
                      <Archive className="h-4 w-4" />
                      Download ZIP Package
                    </Button>
                  )}

                  {/* Convert Another button if reset callback exists */}
                  {/* Convert Another button if reset callback exists */}
                  {(onConvertAnother || onReset) && (
                    <Button
                      onClick={onConvertAnother || onReset}
                      variant="outline"
                      className="w-full h-12 border border-primary text-primary hover:bg-primary/5 flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.99]"
                      size="lg"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {onConvertAnotherLabel || `Convert Another ${fileType === 'pdf' ? 'PDF' : fileType === 'image' ? 'Image' : fileType === 'audio' ? 'Audio' : fileType === 'video' ? 'Video' : 'File'}`}
                    </Button>
                  )}

                  {/* Share action */}
                  {onShare && (
                    <div className="flex gap-2.5 mt-1">
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        className="w-full hover:bg-slate-50 transition-colors h-11 border border-border rounded-xl"
                        disabled={disabled}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  )}

                  {/* Additional actions (if any) */}
                  {additionalActions.length > 0 && (
                    <div className="flex gap-2.5 flex-wrap mt-1">
                      {additionalActions.map((action, idx) => (
                        <Button
                          key={idx}
                          onClick={action.onClick}
                          variant="ghost"
                          size="sm"
                          className="text-xs hover:bg-slate-50 rounded-lg h-9 flex items-center"
                          disabled={disabled}
                        >
                          {action.icon}
                          <span className="ml-1.5">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Selected preview zoom modal */}
        {selectedPreview && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
            onClick={() => setSelectedPreview(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <img
                src={selectedPreview}
                alt="Zoomed Preview"
                className="w-full h-full object-contain rounded-xl"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-950 text-white border-0 w-8 h-8 rounded-full p-0 flex items-center justify-center"
                onClick={() => setSelectedPreview(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
};


export default DownloadCard;
