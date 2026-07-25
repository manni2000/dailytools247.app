import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Copy,
  Share2,
  Eye,
  FileText,
  ImageIcon,
  Music2,
  Film,
  Check,
  Grid,
  List,
  ZoomIn,
  X,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Calendar,
  File,
  Layers,
  HardDrive,
  Code,
  Table2,
  RefreshCw
} from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { useToast } from "@/hooks/use-toast";
import { PreviewPDFEnhanced } from "./preview-renderers";
import { cn } from "@/lib/utils";

interface DownloadOption {
  label: string;
  format: string;
  action: () => void | Promise<void>;
  icon?: React.ReactNode;
}

interface EnhancedDownloadProps {
  data?: string;
  fileName?: string;
  fileType?: 'pdf' | 'image' | 'word' | 'excel' | 'powerpoint' | 'zip' | 'audio' | 'video';
  title?: string;
  description?: string;
  fileSize?: string;
  dimensions?: { width: number; height: number };
  pageCount?: number;
  multipleFiles?: Array<{ url: string; name: string; page?: number }>;
  onConvertAnother?: () => void | Promise<void>;
  onConvertAnotherLabel?: string;
  onReset?: () => void | Promise<void>;
  options?: DownloadOption[];
  primaryLabel?: string;
  showCopy?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
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
          className="w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
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

const DocumentPreviewMockup = ({ fileType, fileName, fileSize }: { fileType: 'word' | 'excel' | 'powerpoint'; fileName: string; fileSize?: string }) => {
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
        <span>{fileSize || 'Document'}</span>
        <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-bold uppercase", config.lightColor, config.textColor)}>
          {fileType === 'word' ? 'DOCX' : fileType === 'excel' ? 'XLSX' : 'PPTX'}
        </span>
      </div>
    </div>
  );
};

export const EnhancedDownload = ({
  data,
  fileName,
  fileType,
  title,
  description,
  fileSize,
  dimensions,
  pageCount,
  multipleFiles,
  options = [],
  primaryLabel = 'Download',
  showCopy = true,
  variant = 'default',
  onConvertAnother,
  onConvertAnotherLabel,
  onReset
}: EnhancedDownloadProps) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const resolvedFileType = fileType ?? 'image';
  const resolvedFileName = fileName ?? 'file';
  const resolvedData = data ?? '';
  const hasFileOutput = Boolean(data) || Boolean(multipleFiles && multipleFiles.length > 0);

  const getFileIcon = () => {
    switch (resolvedFileType) {
      case 'pdf': return <FileText className="h-5 w-5" />;
      case 'image': return <ImageIcon className="h-5 w-5" />;
      case 'audio': return <Music2 className="h-5 w-5" />;
      case 'video': return <Film className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getFileColor = () => {
    switch (resolvedFileType) {
      case 'pdf': return 'bg-red-100 text-red-800 border-red-200';
      case 'image': return 'bg-green-100 text-green-800 border-green-200';
      case 'word': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'excel': return 'bg-green-100 text-green-800 border-green-200';
      case 'powerpoint': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'zip': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'audio': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'video': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const copyToClipboard = async () => {
    if (!resolvedData) return;
    try {
      await navigator.clipboard.writeText(resolvedData);
      setCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "File link has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareFile = async () => {
    if (!resolvedData) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: resolvedFileName,
          text: description || `Check out this ${resolvedFileType} file`,
          url: resolvedData,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyToClipboard();
    }
  };

  const downloadFile = (url: string, name: string) => {
    try {
      const link = document.createElement('a');
      
      if (url.startsWith('blob:')) {
        link.href = url;
      } else if (resolvedFileType === 'word') {
        const base64Data = url.startsWith('data:') ? url.split(',')[1] : url;
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        link.href = URL.createObjectURL(blob);
      } else if (resolvedFileType === 'pdf') {
        const base64Data = url.startsWith('data:') ? url.split(',')[1] : url;
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'application/pdf' });
        link.href = URL.createObjectURL(blob);
      } else {
        link.href = url;
      }
      
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL if created
      if (link.href.startsWith('blob:')) {
        URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      // console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Could not download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {options.length > 0 && (
        <div className="space-y-3">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">{title || 'Processing Complete'}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
            {options.map((option, index) => (
              <Button
                key={index}
                type="button"
                variant={variant}
                onClick={() => option.action()}
                className="gap-2"
              >
                {option.icon || <Download className="h-4 w-4" />}
                <span>{option.label}</span>
                <span className="text-xs uppercase opacity-70">{option.format}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {hasFileOutput && (multipleFiles && multipleFiles.length > 0 ? (
        <div className="space-y-6">
          {/* Header with controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {multipleFiles.length} {multipleFiles.length === 1 ? 'file' : 'files'} converted
            </div>
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Files display */}
          {viewMode === 'grid' ? (
            /* Grid View - Professional Gallery */
            <div className={`grid gap-4 sm:gap-6 ${
              multipleFiles.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
              multipleFiles.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {multipleFiles.map((file, index) => (
                <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/20">
                  {/* Image Preview */}
                  {resolvedFileType === 'image' && file.url.startsWith('data:') && (
                    <div className="relative aspect-[3/4] sm:aspect-[4/3] overflow-hidden bg-muted/30">
                      <img
                        src={file.url}
                        alt={`Page ${file.page}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Overlay with page number */}
                      {multipleFiles.length > 1 && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-black/70 text-white border-0 text-xs">
                            Page {file.page}
                          </Badge>
                        </div>
                      )}
                      {/* Quick actions overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setSelectedImage(file.url)}
                          className="h-8 w-8 p-0 sm:h-10 sm:w-10"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => downloadFile(file.url, file.name || 'download')}
                          className="h-8 w-8 p-0 sm:h-10 sm:w-10"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* File info */}
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                          <Badge variant="outline" className="text-xs w-fit">
                            {file.name?.split('.').pop()?.toUpperCase() || 'FILE'}
                          </Badge>
                          {fileSize && (
                            <span className="text-xs text-muted-foreground">
                              {fileSize}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => downloadFile(file.url, file.name || 'download')}
                        className="w-full"
                        size="sm"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* List View - Compact and Professional */
            <div className="space-y-3 max-w-4xl mx-auto">
              {multipleFiles.map((file, index) => (
                <Card key={index} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      {/* Thumbnail */}
                      {fileType === 'image' && file.url.startsWith('data:') && (
                        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-muted/30 mx-auto sm:mx-0">
                          <img
                            src={file.url}
                            alt={`Page ${file.page}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* File info */}
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <p className="text-sm font-medium text-foreground truncate" title={file.name}>
                            {file.name}
                          </p>
                          {multipleFiles.length > 1 && (
                            <Badge className={`${getFileColor()} variant="outline text-xs"`}>
                              Page {file.page}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground">
                          <span>{resolvedFileType.toUpperCase()}</span>
                          {fileSize && <span>{fileSize}</span>}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-center sm:justify-end gap-2">
                        {resolvedFileType === 'image' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedImage(file.url)}
                            className="h-8 w-8 p-0"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => downloadFile(file.url, file.name || 'download')}
                          className="flex-1 sm:flex-none px-3 sm:px-4"
                        >
                          <Download className="h-4 w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full space-y-6">
          {/* Success Alert Banner inside EnhancedDownload */}
          <div className="relative z-10 rounded-2xl border border-green-200 bg-green-50/70 p-4 text-green-900 flex items-start justify-between gap-4 shadow-sm backdrop-blur-sm">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-green-800 text-[15px] leading-tight mb-0.5">{title || 'Processing Complete!'}</h4>
                <p className="text-xs text-green-700/90 leading-normal">{description || 'Your file is ready for download.'}</p>
              </div>
            </div>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            {/* Left Column: Preview */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between h-7">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  Preview
                </h3>
              </div>
              
              <div className="relative aspect-[4/3] rounded-2xl border border-border bg-slate-50/80 dark:bg-slate-900/40 flex items-center justify-center p-4 overflow-hidden w-full min-h-[350px] max-h-[450px] shadow-sm">
                {/* Image Preview */}
                {resolvedFileType === 'image' && resolvedData && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={resolvedData}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain rounded-lg shadow-md cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]"
                      onClick={() => setSelectedImage(resolvedData)}
                    />
                  </div>
                )}

                {/* PDF Preview */}
                {resolvedFileType === 'pdf' && resolvedData && (
                  <div className="w-full h-full flex items-center justify-center">
                    <PreviewPDFEnhanced data={resolvedData} fileName={resolvedFileName} />
                  </div>
                )}

                {/* Word/Excel/Powerpoint Previews */}
                {(resolvedFileType === 'word' || resolvedFileType === 'excel' || resolvedFileType === 'powerpoint') && (
                  <div className="w-full h-full flex items-center justify-center">
                    <DocumentPreviewMockup fileType={resolvedFileType} fileName={resolvedFileName} fileSize={fileSize} />
                  </div>
                )}

                {/* Video Preview */}
                {resolvedFileType === 'video' && resolvedData && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <video
                      src={resolvedData}
                      controls
                      className="max-w-full max-h-full rounded-xl shadow-lg border border-slate-200/50 bg-slate-950"
                    />
                  </div>
                )}

                {/* Audio Preview */}
                {resolvedFileType === 'audio' && resolvedData && (
                  <div className="w-full h-full flex items-center justify-center">
                    <ProfessionalAudioPlayer src={resolvedData} fileName={resolvedFileName} />
                  </div>
                )}

                {/* General Fallback for other formats (zip, json, code, etc.) */}
                {resolvedFileType !== 'pdf' && resolvedFileType !== 'image' && resolvedFileType !== 'word' && resolvedFileType !== 'excel' && resolvedFileType !== 'powerpoint' && resolvedFileType !== 'video' && resolvedFileType !== 'audio' && (
                  <div className="flex flex-col items-center justify-center text-center gap-3">
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-md bg-muted/80")}>
                      {getFileIcon()}
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-foreground truncate max-w-[220px]" title={resolvedFileName}>{resolvedFileName}</h5>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{resolvedFileType} File</p>
                    </div>
                    {fileSize && (
                      <Badge variant="secondary" className="text-[10px] tracking-wide">
                        {fileSize}
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
                      <span className="font-semibold text-foreground truncate max-w-[180px]" title={resolvedFileName}>
                        {resolvedFileName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Code className="h-3.5 w-3.5" />
                        Format
                      </span>
                      <span className="font-semibold text-foreground uppercase">
                        {resolvedFileType === 'word' ? 'DOCX' : resolvedFileType === 'excel' ? 'XLSX' : resolvedFileType === 'powerpoint' ? 'PPTX' : resolvedFileType.toUpperCase()}
                      </span>
                    </div>

                    {pageCount && (
                      <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-2 text-muted-foreground font-medium">
                          <Layers className="h-3.5 w-3.5" />
                          Pages
                        </span>
                        <span className="font-semibold text-foreground">
                          {pageCount}
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
                          {fileSize}
                        </span>
                      </div>
                    )}

                    {dimensions && (
                      <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="flex items-center gap-2 text-muted-foreground font-medium">
                          <Maximize2 className="h-3.5 w-3.5" />
                          Dimensions
                        </span>
                        <span className="font-semibold text-foreground">
                          {dimensions.width} x {dimensions.height} px
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-2">
                      <span className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        Created On
                      </span>
                      <span className="font-semibold text-foreground font-mono text-xs">
                        {new Intl.DateTimeFormat('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }).format(new Date())}
                      </span>
                    </div>
                  </div>

                  {/* Actions Panel */}
                  <div className="flex flex-col gap-3.5 pt-2">
                    <Button
                      onClick={() => downloadFile(resolvedData, resolvedFileName)}
                      className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 rounded-xl font-medium shadow-md transition-all active:scale-[0.99]"
                      size="lg"
                    >
                      <Download className="h-4 w-4" />
                      {primaryLabel}
                    </Button>

                    {/* Presets/Options if provided */}
                    {options && options.length > 0 && (
                      <div className="flex flex-col gap-2.5">
                        {options.map((option, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant="outline"
                            onClick={() => option.action()}
                            className="w-full h-12 border border-primary text-primary hover:bg-primary/5 flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.99]"
                          >
                            {option.icon || <Download className="h-4 w-4" />}
                            <span>{option.label}</span>
                            <span className="text-xs uppercase opacity-70">({option.format})</span>
                          </Button>
                        ))}
                      </div>
                    )}

                    {/* Convert Another button if reset callback exists */}
                    {(onConvertAnother || onReset) && (
                      <Button
                        onClick={onConvertAnother || onReset}
                        variant="outline"
                        className="w-full h-12 border border-primary text-primary hover:bg-primary/5 flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.99]"
                      >
                        <RefreshCw className="h-4 w-4" />
                        {onConvertAnotherLabel || `Convert Another ${resolvedFileType === 'word' ? 'DOCX' : resolvedFileType === 'excel' ? 'XLSX' : resolvedFileType === 'powerpoint' ? 'PPTX' : resolvedFileType.toUpperCase()}`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Zoom modal for images */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm cursor-zoom-out"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl max-h-[90vh] w-full">
                <img
                  src={selectedImage}
                  alt="Zoomed Preview"
                  className="w-full h-full object-contain rounded-xl"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-950 text-white border-0 w-8 h-8 rounded-full p-0 flex items-center justify-center"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Image Preview Modal */}
      {/* Image modal removed */}
    </div>
  );
};
