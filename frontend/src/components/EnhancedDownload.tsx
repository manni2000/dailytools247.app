import { useState } from 'react';
import { Download, Copy, Check, FileDown, FileText, Palette, Settings } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { DownloadStyle, formatFileSize } from './ui/download-styles-config';

export interface DownloadOption {
  label: string;
  format: string;
  icon?: React.ReactNode;
  action: () => void | Promise<void>;
}

interface EnhancedDownloadProps {
  options?: DownloadOption[];
  primaryAction?: () => void | Promise<void>;
  primaryLabel?: string;
  copyText?: string;
  showCopy?: boolean;
  fileName?: string;
  fileSize?: number;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  style?: DownloadStyle;
  showFormatBadge?: boolean;
  showStyleSelector?: boolean;
  title?: string;
  description?: string;
  onStyleChange?: (style: DownloadStyle) => void;
}

/**
 * Enhanced download/export component with multiple format support and style variants
 */
export const EnhancedDownload = ({
  options = [],
  primaryAction,
  primaryLabel = 'Download',
  copyText,
  showCopy = true,
  fileName,
  fileSize,
  className,
  variant = 'default',
  size = 'default',
  style = 'detailed',
  showFormatBadge = true,
  showStyleSelector = false,
  title,
  description,
  onStyleChange,
}: EnhancedDownloadProps) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<DownloadStyle>(style);

  const handleCopy = async () => {
    if (!copyText) return;

    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      toast.copied();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error({ title: 'Copy failed', description: 'Could not copy to clipboard' });
    }
  };

  const handlePrimaryDownload = async () => {
    if (!primaryAction) return;

    setIsDownloading(true);
    try {
      await primaryAction();
      toast.downloaded(fileName);
    } catch (error) {
      toast.error({ title: 'Download failed', description: 'Could not download file' });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOptionDownload = async (option: DownloadOption) => {
    try {
      await option.action();
      toast.downloaded(`${fileName || 'file'}.${option.format}`);
    } catch (error) {
      toast.error({ title: 'Download failed', description: `Could not download ${option.format}` });
    }
  };

  const handleStyleChange = (newStyle: DownloadStyle) => {
    setCurrentStyle(newStyle);
    onStyleChange?.(newStyle);
  };

  // Minimal style - just icon and text
  if (currentStyle === 'minimal') {
    return (
      <Button
        onClick={handlePrimaryDownload}
        disabled={isDownloading}
        variant="ghost"
        size="sm"
        className={cn('text-xs', className)}
      >
        <Download className="w-3 h-3 mr-1" />
        {primaryLabel}
      </Button>
    );
  }

  // Compact style - small inline button
  if (currentStyle === 'compact') {
    return (
      <div className={cn('flex gap-2', className)}>
        <Button
          onClick={handlePrimaryDownload}
          disabled={isDownloading}
          variant={variant}
          size="sm"
        >
          <Download className="w-3 h-3 mr-1" />
          {isDownloading ? 'Downloading...' : primaryLabel}
        </Button>
        {showCopy && copyText && (
          <Button onClick={handleCopy} variant="outline" size="sm">
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </Button>
        )}
      </div>
    );
  }

  // Detailed style - with file info and metadata
  if (currentStyle === 'detailed') {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-4 space-y-3">
          {(title || description) && (
            <div>
              {title && <h4 className="font-semibold text-sm">{title}</h4>}
              {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {fileName && <span className="text-sm font-medium truncate">{fileName}</span>}
              {fileSize && showFormatBadge && (
                <Badge variant="secondary" className="text-xs">{formatFileSize(fileSize)}</Badge>
              )}
              {options.length > 0 && options[0].format && showFormatBadge && (
                <Badge variant="outline" className="text-xs">{options[0].format}</Badge>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                onClick={handlePrimaryDownload}
                disabled={isDownloading}
                variant={variant}
                size="sm"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
              {showCopy && copyText && (
                <Button onClick={handleCopy} variant="outline" size="sm">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Gallery style - grid layout for multiple files
  if (currentStyle === 'gallery' && options.length > 0) {
    return (
      <div className={cn('space-y-3', className)}>
        {(title || description) && (
          <div>
            {title && <h4 className="font-semibold text-sm">{title}</h4>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleOptionDownload(option)}
              variant="outline"
              className="justify-start h-auto py-3 px-3"
            >
              <div className="flex flex-col items-start text-left">
                <div className="font-medium text-sm">{option.label}</div>
                <Badge variant="secondary" className="text-xs mt-1">{option.format}</Badge>
              </div>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Default style - full featured download options
  // Single download button (no options)
  if (options.length === 0 && !showCopy) {
    return (
      <div className={cn('flex gap-2 items-center', className)}>
        {showStyleSelector && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size={size}
                className="px-2"
                title="Download style"
              >
                <Palette className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStyleChange('minimal')}>
                <span>Minimal</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStyleChange('compact')}>
                <span>Compact</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStyleChange('detailed')}>
                <span>Detailed</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStyleChange('card')}>
                <span>Card</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStyleChange('gallery')}>
                <span>Gallery</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button
          onClick={handlePrimaryDownload}
          disabled={isDownloading}
          variant={variant}
          size={size}
          className={showFormatBadge ? '' : className}
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Downloading...' : primaryLabel}
        </Button>
      </div>
    );
  }

  // Download with copy button
  if (options.length === 0 && showCopy && copyText) {
    return (
      <div className={cn('flex gap-2', className)}>
        {showStyleSelector && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={size} className="px-2">
                <Palette className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStyleChange('minimal')}>Minimal</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStyleChange('compact')}>Compact</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStyleChange('detailed')}>Detailed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button
          onClick={handlePrimaryDownload}
          disabled={isDownloading}
          variant={variant}
          size={size}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Downloading...' : primaryLabel}
        </Button>
        <Button onClick={handleCopy} variant="outline" size={size}>
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span className="sr-only">Copy</span>
        </Button>
      </div>
    );
  }

  // Multiple download options with dropdown
  return (
    <div className={cn('flex gap-2', className)}>
      {showStyleSelector && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={size} className="px-2">
              <Palette className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStyleChange('minimal')}>Minimal</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStyleChange('compact')}>Compact</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStyleChange('detailed')}>Detailed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStyleChange('card')}>Card</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStyleChange('gallery')}>Gallery</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {showCopy && copyText && (
        <Button onClick={handleCopy} variant="outline" size={size}>
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
      )}

      {options.length > 1 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={variant} size={size} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              {primaryLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {options.map((option, index) => (
              <div key={index}>
                {index > 0 && index % 3 === 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem onClick={() => handleOptionDownload(option)}>
                  {option.icon || <FileDown className="w-4 h-4 mr-2" />}
                  <span>{option.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground uppercase">
                    {option.format}
                  </span>
                </DropdownMenuItem>
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : options.length === 1 ? (
        <Button
          onClick={() => handleOptionDownload(options[0])}
          variant={variant}
          size={size}
          className="flex-1"
        >
          {options[0].icon || <Download className="w-4 h-4 mr-2" />}
          {options[0].label}
        </Button>
      ) : (
        <Button
          onClick={handlePrimaryDownload}
          disabled={isDownloading}
          variant={variant}
          size={size}
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Downloading...' : primaryLabel}
        </Button>
      )}
    </div>
  );
};

/**
 * Utility for downloading files
 */
export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Utility for downloading text as file
 */
export const downloadText = (text: string, filename: string, mimeType = 'text/plain') => {
  const blob = new Blob([text], { type: mimeType });
  downloadFile(blob, filename);
};

/**
 * Utility for downloading JSON
 */
export const downloadJSON = (data: Record<string, unknown>, filename: string) => {
  const json = JSON.stringify(data, null, 2);
  downloadText(json, filename, 'application/json');
};
