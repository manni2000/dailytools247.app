/**
 * Enhanced Preview Renderers for PreviewDownload Component
 * 
 * Implements actual content rendering for:
 * - PDF (first page via pdf.js)
 * - Word documents (metadata + icon)
 * - Video (HTML5 player)
 * - Audio (HTML5 player)
 * - Image (with zoom)
 * 
 * File: frontend/src/components/ui/preview-renderers.tsx
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Film,
  Music2,
  FileCode,
  AlertCircle,
  Loader2,
  Download,
  Eye,
} from 'lucide-react';
import { Button } from './button';
import * as pdfjsLib from 'pdfjs-dist';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * PDF PREVIEW RENDERER
 * Renders first page of PDF using pdf.js
 */
export const PreviewPDFEnhanced = ({
  data,
  fileName,
}: {
  data: string | Blob;
  fileName: string;
}) => {
  const [pdfPage, setPdfPage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    const renderFirstPage = async () => {
      try {
        setLoading(true);
        
        // Convert data to ArrayBuffer
        let arrayBuffer: ArrayBuffer;
        if (data instanceof Blob) {
          arrayBuffer = await data.arrayBuffer();
        } else {
          // Convert data URL to Blob then to ArrayBuffer
          const response = await fetch(data);
          arrayBuffer = await response.arrayBuffer();
        }

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPageCount(pdf.numPages);

        // Get first page
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        // Create canvas and render
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Could not get canvas context');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        setPdfPage(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error('PDF preview error:', err);
        setError('Could not render PDF preview. You can still download the file.');
      } finally {
        setLoading(false);
      }
    };

    renderFirstPage();
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading PDF preview...</p>
      </div>
    );
  }

  if (error || !pdfPage) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-3">
        <FileText className="h-16 w-16 text-red-500" />
        <p className="text-sm font-medium text-center">{fileName}</p>
        <p className="text-xs text-muted-foreground">PDF • {pageCount} pages</p>
        {error && (
          <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
      <img
        src={pdfPage}
        alt="PDF first page"
        className="max-w-full max-h-full object-contain rounded"
      />
      <p className="text-xs text-muted-foreground text-center">
        PDF Preview (Page 1 of {pageCount})
      </p>
    </div>
  );
};

/**
 * WORD/DOCUMENT PREVIEW RENDERER
 * Shows document icon and metadata
 * (Full rendering requires third-party service like OneDrive API)
 */
export const PreviewDocumentEnhanced = ({
  fileType,
  fileName,
  fileSize,
}: {
  fileType: 'word' | 'excel' | 'powerpoint';
  fileName: string;
  fileSize?: number;
}) => {
  const icons: Record<string, React.ReactNode> = {
    word: <FileText className="h-16 w-16 text-blue-600" />,
    excel: <FileCode className="h-16 w-16 text-green-600" />,
    powerpoint: <Film className="h-16 w-16 text-orange-600" />,
  };

  const labels: Record<string, string> = {
    word: 'Word Document',
    excel: 'Excel Spreadsheet',
    powerpoint: 'PowerPoint Presentation',
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-3">
      {icons[fileType]}
      <p className="text-sm font-medium text-center">{fileName}</p>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">{labels[fileType]}</p>
        {fileSize && (
          <p className="text-xs text-muted-foreground">
            {formatFileSize(fileSize)}
          </p>
        )}
      </div>
      <p className="text-xs text-amber-600 mt-2">
        ℹ️ Download to view full content
      </p>
    </div>
  );
};

/**
 * ENHANCED VIDEO PREVIEW RENDERER
 * HTML5 video player with duration and resolution info
 */
export const PreviewVideoEnhanced = ({
  data,
  fileName,
}: {
  data: string | Blob;
  fileName: string;
}) => {
  const [duration, setDuration] = useState<number | null>(null);
  const videoUrl = typeof data === 'string' ? data : URL.createObjectURL(data);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2">
      <video
        src={videoUrl}
        controls
        onLoadedMetadata={(e) => {
          const video = e.currentTarget;
          setDuration(video.duration);
        }}
        className="max-w-full max-h-[calc(100%-60px)] rounded"
        style={{ maxHeight: '100%' }}
      >
        <p>Your browser does not support the video tag.</p>
      </video>
      {duration && (
        <p className="text-xs text-muted-foreground">
          Duration: {formatDuration(duration)}
        </p>
      )}
    </div>
  );
};

/**
 * ENHANCED AUDIO PREVIEW RENDERER
 * HTML5 audio player with duration info
 */
export const PreviewAudioEnhanced = ({
  data,
  fileName,
}: {
  data: string | Blob;
  fileName: string;
}) => {
  const [duration, setDuration] = useState<number | null>(null);
  const audioUrl = typeof data === 'string' ? data : URL.createObjectURL(data);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <Music2 className="h-12 w-12 text-purple-500" />
      <p className="text-sm font-medium text-center">{fileName}</p>
      <audio
        src={audioUrl}
        controls
        onLoadedMetadata={(e) => {
          const audio = e.currentTarget;
          setDuration(audio.duration);
        }}
        className="w-full max-w-md"
      >
        Your browser does not support the audio tag.
      </audio>
      {duration && (
        <p className="text-xs text-muted-foreground">
          Duration: {formatDuration(duration)}
        </p>
      )}
    </div>
  );
};

/**
 * ENHANCED IMAGE PREVIEW RENDERER
 * Shows image with zoom capability
 */
export const PreviewImageEnhanced = ({
  url,
  fileName,
  zoom = 100,
}: {
  url: string;
  fileName: string;
  zoom?: number;
}) => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <img
        src={url}
        alt={fileName}
        className="max-w-full max-h-full object-contain rounded"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
      />
    </div>
  );
};

/**
 * GENERIC FILE PREVIEW FALLBACK
 * For file types without specific preview
 */
export const PreviewFileFallback = ({
  fileType,
  fileName,
  onDownload,
}: {
  fileType: string;
  fileName: string;
  onDownload?: () => void;
}) => {
  const getIconForType = (type: string) => {
    if (type.includes('zip') || type.includes('archive')) return '📦';
    if (type.includes('json') || type.includes('csv')) return '📊';
    if (type.includes('text')) return '📄';
    return '📁';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <div className="text-5xl">{getIconForType(fileType)}</div>
      <div className="text-center space-y-1">
        <p className="text-sm font-medium">{fileName}</p>
        <p className="text-xs text-muted-foreground capitalize">{fileType} File</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Preview not available for this file type
      </p>
      {onDownload && (
        <Button size="sm" variant="outline" onClick={onDownload} className="mt-2 gap-2">
          <Download className="h-3 w-3" />
          Download to View
        </Button>
      )}
    </div>
  );
};

/**
 * UTILITY: Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * UTILITY: Format duration in seconds to MM:SS
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * ERROR BOUNDARY for preview rendering
 */
export class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode; fileName: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fileName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Preview rendering error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full gap-2">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground text-center">
            Error loading preview for {this.props.fileName}
          </p>
          <p className="text-xs text-muted-foreground">
            Download the file to view it
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
