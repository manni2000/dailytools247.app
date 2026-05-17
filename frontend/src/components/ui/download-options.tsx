import React, { useState, useMemo } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Label } from './label';
import { Badge } from './badge';
import { Slider } from './slider';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import {
  FileType,
  FILE_TYPE_CONFIG,
  IMAGE_QUALITY_PRESETS,
} from './download-styles-config';
import {
  getAvailableFormats,
  getAvailableQualityPresets,
  supportsQualitySelection,
  getMimeType,
  estimateFileSize,
  AUDIO_BITRATE_PRESETS,
  VIDEO_BITRATE_PRESETS,
  COLOR_SPACE_PRESETS,
  RESOLUTION_PRESETS,
} from '@/lib/download-presets';
import { cn } from '@/lib/utils';

export interface DownloadOptionsProps {
  fileType: FileType;
  fileName?: string;
  originalFileSize?: number;
  onApply: (options: AppliedDownloadOptions) => void | Promise<void>;
  onCancel?: () => void;
  defaultFormat?: string;
  defaultQuality?: 'low' | 'medium' | 'high' | 'ultra';
  showFormatSelector?: boolean;
  showQualitySelector?: boolean;
  showAdvancedOptions?: boolean;
  className?: string;
  compact?: boolean;
}

export interface AppliedDownloadOptions {
  format: string;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  compression?: number;
  resolution?: { width: number; height: number };
  colorSpace?: string;
  bitrate?: number;
  preserveMetadata?: boolean;
}

/**
 * Download Options Component
 * Allows users to select format, quality, and other options before download
 */
export const DownloadOptions = ({
  fileType,
  fileName,
  originalFileSize,
  onApply,
  onCancel,
  defaultFormat,
  defaultQuality = 'high',
  showFormatSelector = true,
  showQualitySelector = true,
  showAdvancedOptions = false,
  className,
  compact = false,
}: DownloadOptionsProps) => {
  const [selectedFormat, setSelectedFormat] = useState(
    defaultFormat || getAvailableFormats(fileType)[0]?.id || ''
  );
  const [selectedQuality, setSelectedQuality] = useState<'low' | 'medium' | 'high' | 'ultra'>(defaultQuality);
  const [compression, setCompression] = useState(70);
  const [selectedResolution, setSelectedResolution] = useState('original');
  const [selectedColorSpace, setSelectedColorSpace] = useState('rgb');
  const [selectedBitrate, setSelectedBitrate] = useState('high');
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(showAdvancedOptions);

  const availableFormats = useMemo(
    () => getAvailableFormats(fileType),
    [fileType]
  );

  const availableQualities = useMemo(
    () => getAvailableQualityPresets(fileType),
    [fileType]
  );

  const selectedFormatPreset = availableFormats.find((f) => f.id === selectedFormat);
  const qualityPreset = availableQualities[selectedQuality];
  const supportsQuality = supportsQualitySelection(selectedFormat);

  const estimatedSize = useMemo(() => {
    if (!originalFileSize) return null;
    return estimateFileSize(originalFileSize, selectedQuality);
  }, [originalFileSize, selectedQuality]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const options: AppliedDownloadOptions = {
        format: selectedFormat,
      };

      if (showQualitySelector && supportsQuality) {
        options.quality = selectedQuality;
      }

      if (showAdvanced && selectedResolution !== 'original') {
        const res = Object.values(RESOLUTION_PRESETS).find(
          (r) => r.label === selectedResolution
        );
        if (res && res.width > 0) {
          options.resolution = { width: res.width, height: res.height };
        }
      }

      if (showAdvanced && fileType === 'image') {
        options.colorSpace = selectedColorSpace;
      }

      if (showAdvanced && (fileType === 'audio' || fileType === 'video')) {
        const bitrateMap =
          fileType === 'audio' ? AUDIO_BITRATE_PRESETS : VIDEO_BITRATE_PRESETS;
        const bitrate = bitrateMap[selectedBitrate as keyof typeof bitrateMap];
        if (bitrate) {
          options.bitrate = bitrate.bitrate;
        }
      }

      if (showAdvanced) {
        options.compression = compression;
        options.preserveMetadata = preserveMetadata;
      }

      await onApply(options);
    } finally {
      setIsApplying(false);
    }
  };

  // Compact mode - inline options
  if (compact) {
    return (
      <div className={cn('flex flex-col gap-3', className)}>
        {showFormatSelector && availableFormats.length > 0 && (
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label className="text-xs mb-1 block">Format</Label>
              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableFormats.map((fmt) => (
                    <SelectItem key={fmt.id} value={fmt.id}>
                      {fmt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {showQualitySelector && supportsQuality && (
              <div className="flex-1">
                <Label className="text-xs mb-1 block">Quality</Label>
                <Select
                  value={selectedQuality}
                  onValueChange={
                    (val) => setSelectedQuality(val as 'low' | 'medium' | 'high' | 'ultra')
                  }
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(availableQualities).map(([key, preset]) => (
                      <SelectItem key={key} value={key}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleApply}
          disabled={isApplying}
          className="w-full"
          size="sm"
        >
          {isApplying ? 'Applying...' : 'Download'}
        </Button>

        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full"
            size="sm"
          >
            Cancel
          </Button>
        )}
      </div>
    );
  }

  // Full mode
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Download Options</CardTitle>
        {fileName && <CardDescription>{fileName}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Format Selection */}
        {showFormatSelector && availableFormats.length > 0 && (
          <div className="space-y-3">
            <Label>File Format</Label>
            <div className="grid grid-cols-2 gap-2">
              {availableFormats.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id)}
                  className={cn(
                    'p-3 rounded-lg border-2 text-sm font-medium transition-all text-left',
                    selectedFormat === fmt.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="font-semibold">{fmt.label}</div>
                  {fmt.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {fmt.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quality Selection */}
        {showQualitySelector &&
          supportsQuality &&
          Object.keys(availableQualities).length > 0 && (
            <div className="space-y-3">
              <Label>Quality</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(availableQualities).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setSelectedQuality(key as 'low' | 'medium' | 'high' | 'ultra')
                    }
                    className={cn(
                      'p-3 rounded-lg border-2 text-sm font-medium transition-all text-left',
                      selectedQuality === key
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="font-semibold">{preset.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {preset.fileEstimate}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Size Estimate */}
        {estimatedSize && (
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm">
            <Info className="h-4 w-4 text-blue-600" />
            <span>
              Estimated size: <strong>{Math.round(estimatedSize / 1024)}KB</strong>
            </span>
          </div>
        )}

        {/* Advanced Options */}
        {showAdvanced && (
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between"
              >
                Advanced Options
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    showAdvanced && 'rotate-180'
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-6 pt-4">
              {/* Resolution for images/videos */}
              {(fileType === 'image' || fileType === 'video') && (
                <div className="space-y-3">
                  <Label>Resolution</Label>
                  <Select value={selectedResolution} onValueChange={setSelectedResolution}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(RESOLUTION_PRESETS).map((res) => (
                        <SelectItem key={res.label} value={res.label}>
                          {res.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Color Space for images */}
              {fileType === 'image' && (
                <div className="space-y-3">
                  <Label>Color Space</Label>
                  <Select value={selectedColorSpace} onValueChange={setSelectedColorSpace}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COLOR_SPACE_PRESETS).map(([key, preset]) => (
                        <SelectItem key={key} value={key}>
                          <div>
                            <div className="font-medium">{preset.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {preset.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Bitrate for audio/video */}
              {(fileType === 'audio' || fileType === 'video') && (
                <div className="space-y-3">
                  <Label>Bitrate</Label>
                  <Select value={selectedBitrate} onValueChange={setSelectedBitrate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(
                        fileType === 'audio'
                          ? AUDIO_BITRATE_PRESETS
                          : VIDEO_BITRATE_PRESETS
                      ).map(([key, preset]) => (
                        <SelectItem key={key} value={key}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Compression slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Compression Level</Label>
                  <Badge variant="secondary">{compression}%</Badge>
                </div>
                <Slider
                  value={[compression]}
                  onValueChange={(val) => setCompression(val[0])}
                  min={0}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Preserve Metadata */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <input
                  type="checkbox"
                  id="metadata"
                  checked={preserveMetadata}
                  onChange={(e) => setPreserveMetadata(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="metadata" className="text-sm cursor-pointer">
                  Preserve metadata (EXIF, etc.)
                </label>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleApply}
            disabled={isApplying}
            className="flex-1"
          >
            {isApplying ? 'Applying...' : 'Download with Options'}
          </Button>
          {onCancel && (
            <Button onClick={onCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadOptions;
