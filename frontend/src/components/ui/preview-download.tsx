import React, { useState, Suspense } from 'react';
import {
  Download,
  FileText,
  ImageIcon,
  Music2,
  Film,
  Eye,
  EyeOff,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { DownloadCard } from './download-card';
import { FileType, FILE_TYPE_CONFIG, formatFileSize } from './download-styles-config';
import {
  PreviewPDFEnhanced,
  PreviewVideoEnhanced,
  PreviewAudioEnhanced,
  PreviewDocumentEnhanced,
  PreviewImageEnhanced,
  PreviewFileFallback,
  PreviewErrorBoundary,
} from './preview-renderers';
import { cn } from '@/lib/utils';

export interface PreviewDownloadProps {
  // Preview configuration
  fileData: string | Blob;
  fileType: FileType;
  fileName: string;
  fileSize?: number;
  title?: string;
  description?: string;

  // Download configuration
  onDownload: () => void | Promise<void>;
  onShare?: () => void;

  // Preview options
  showPreviewToggle?: boolean;
  defaultShowPreview?: boolean;
  previewHeight?: string;
  previewTitle?: string;

  // Additional options
  metadata?: Record<string, string>;
  className?: string;
  downloadVariant?: 'default' | 'minimal' | 'compact' | 'detailed';
  additionalActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }>;
}

/**
 * Unified Preview + Download Component
 * Shows file preview above download button for all file types
 * Supports: PDF, Images, Videos, Audio, Documents, etc.
 */
export const PreviewDownload = ({
  fileData,
  fileType,
  fileName,
  fileSize,
  title = 'Preview',
  description,
  onDownload,
  onShare,
  showPreviewToggle = true,
  defaultShowPreview = true,
  previewHeight = 'max-h-96',
  previewTitle,
  metadata = {},
  className,
  downloadVariant = 'default',
  additionalActions = [],
}: PreviewDownloadProps) => {
  const [showPreview, setShowPreview] = useState(defaultShowPreview);
  const [previewZoom, setPreviewZoom] = useState(100);
  const [fullScreenPreview, setFullScreenPreview] = useState(false);

  // Convert data to preview URL
  const getPreviewUrl = (): string => {
    if (typeof fileData === 'string') {
      return fileData;
    }
    return URL.createObjectURL(fileData);
  };

  const previewUrl = getPreviewUrl();

  // Render appropriate preview based on file type
  const renderPreview = () => {
    switch (fileType) {
      case 'image':
        return <PreviewImageEnhanced url={previewUrl} fileName={fileName} zoom={previewZoom} />;
      case 'pdf':
        return <PreviewErrorBoundary fileName={fileName}>
          <PreviewPDFEnhanced data={fileData} fileName={fileName} />
        </PreviewErrorBoundary>;
      case 'video':
        return <PreviewVideoEnhanced data={fileData} fileName={fileName} />;
      case 'audio':
        return <PreviewAudioEnhanced data={fileData} fileName={fileName} />;
      case 'word':
      case 'excel':
      case 'powerpoint':
        return <PreviewDocumentEnhanced fileType={fileType} fileName={fileName} fileSize={fileSize} />;
      default:
        return <PreviewFileFallback fileType={fileType} fileName={fileName} onDownload={onDownload} />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Preview Section */}
      {showPreviewToggle && (
        <div className="space-y-3">
          {/* Toggle Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={showPreview ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="gap-2"
              >
                {showPreview ? (
                  <>
                    <Eye className="h-4 w-4" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Show Preview
                  </>
                )}
              </Button>
            </div>

            {/* Zoom controls for images */}
            {showPreview && fileType === 'image' && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewZoom(Math.max(50, previewZoom - 10))}
                  disabled={previewZoom <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium px-2 min-w-12 text-center">
                  {previewZoom}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewZoom(Math.min(200, previewZoom + 10))}
                  disabled={previewZoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Preview Container */}
          {showPreview && (
            <Card className="overflow-hidden bg-muted/30 border-dashed">
              <CardContent className={cn('p-4', previewHeight, 'overflow-auto flex items-center justify-center')}>
                <Suspense fallback={<LoadingPreview fileName={fileName} />}>
                  {renderPreview()}
                </Suspense>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Download Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Download</h3>
          <Badge variant="outline" className="text-xs">
            {fileType.toUpperCase()}
            {fileSize && <span className="ml-2">{formatFileSize(fileSize)}</span>}
          </Badge>
        </div>

        <DownloadCard
          fileName={fileName}
          fileType={fileType}
          fileSize={fileSize}
          title={title}
          description={description}
          onDownload={onDownload}
          onShare={onShare}
          metadata={metadata}
          variant={downloadVariant}
          additionalActions={additionalActions}
          showPreview={false}
        />
      </div>

      {/* Full Screen Preview Modal */}
      {fullScreenPreview && fileType === 'image' && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setFullScreenPreview(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full">
            <img
              src={previewUrl}
              alt="Full screen preview"
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setFullScreenPreview(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Loading Preview Component
 */
const LoadingPreview = ({ fileName }: { fileName: string }) => (
  <div className="flex flex-col items-center justify-center w-full h-full gap-2">
    <div className="h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
    <p className="text-sm text-muted-foreground">Loading {fileName}...</p>
  </div>
);

export default PreviewDownload;
