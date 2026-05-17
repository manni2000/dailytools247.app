import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { FileType, FILE_TYPE_CONFIG, formatFileSize } from './download-styles-config';
import { cn } from '@/lib/utils';

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
  onShare?: () => void | Promise<void>;
  previewUrl?: string;
  metadata?: Record<string, string>;
  showPreview?: boolean;
  isLoading?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'compact' | 'detailed';
  disabled?: boolean;
  additionalActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
}

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
  onShare,
  previewUrl,
  metadata = {},
  showPreview = true,
  isLoading = false,
  className,
  variant = 'default',
  disabled = false,
  additionalActions = [],
}: DownloadCardProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedPreview(previewUrl)}
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
            {fileUrl && (
              <Button
                onClick={handleCopy}
                variant="outline"
                size="lg"
                disabled={disabled}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
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

  // Default variant - Professional card with all features
  return (
    <Card className={cn('overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/20', className)}>
      <CardContent className="p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* File Icon */}
        <div className="flex justify-center">
          <div className={cn('w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg', fileConfig.backgroundColor)}>
            {getFileIcon()}
          </div>
        </div>

        {/* File Info */}
        <div className="text-center space-y-2">
          <h4 className="font-semibold text-lg line-clamp-2">{fileName}</h4>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            <Badge variant="secondary">{fileType.toUpperCase()}</Badge>
            {fileSize && <span>{formatFileSize(fileSize)}</span>}
            {Object.entries(metadata).map(([key, value]) => (
              <span key={key} className="text-xs">
                {value}
              </span>
            ))}
          </div>
        </div>

        {/* Preview */}
        {previewUrl && showPreview && fileType === 'image' && (
          <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-auto max-h-48 object-contain cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedPreview(previewUrl)}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleDownload}
            disabled={isDownloading || disabled || isLoading}
            className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            {isDownloading || isLoading ? 'Downloading...' : 'Download'}
          </Button>

          {/* Secondary Actions */}
          {(onShare || fileUrl) && (
            <div className="flex gap-2">
              {onShare && (
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex-1"
                  disabled={disabled}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
              {fileUrl && (
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1"
                  disabled={disabled}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Additional Actions */}
          {additionalActions.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {additionalActions.map((action, idx) => (
                <Button
                  key={idx}
                  onClick={action.onClick}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  disabled={disabled}
                >
                  {action.icon}
                  <span className="ml-1">{action.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Preview Modal */}
      {selectedPreview && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPreview(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <img
              src={selectedPreview}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setSelectedPreview(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DownloadCard;
