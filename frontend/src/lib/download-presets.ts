/**
 * Download Presets and Utilities
 * Common format and quality presets for different file types
 */

import {
  IMAGE_QUALITY_PRESETS,
  FORMAT_PRESETS,
  QualityPreset,
  FormatPreset,
  FileType,
} from './download-styles-config';

/**
 * Download Preset for a specific tool/conversion
 */
export interface DownloadPresetConfig {
  fileType: FileType;
  defaultFormat?: string;
  defaultQuality?: 'low' | 'medium' | 'high' | 'ultra';
  availableFormats?: string[];
  availableQualities?: ('low' | 'medium' | 'high' | 'ultra')[];
  allowQualitySelection?: boolean;
  allowFormatSelection?: boolean;
  compressionLevelRange?: { min: number; max: number };
  resolutionOptions?: Array<{ width: number; height: number; label: string }>;
  colorSpaceOptions?: string[];
}

/**
 * PDF Download Presets
 */
export const PDF_PRESETS: DownloadPresetConfig = {
  fileType: 'pdf',
  defaultQuality: 'high',
  allowQualitySelection: true,
  allowFormatSelection: false,
  availableQualities: ['low', 'medium', 'high', 'ultra'],
  compressionLevelRange: { min: 50, max: 100 },
};

/**
 * Image Download Presets (for converters, resizers, etc)
 */
export const IMAGE_PRESETS: DownloadPresetConfig = {
  fileType: 'image',
  defaultFormat: 'png',
  defaultQuality: 'high',
  availableFormats: ['png', 'jpg', 'webp', 'gif', 'svg'],
  availableQualities: ['low', 'medium', 'high', 'ultra'],
  allowQualitySelection: true,
  allowFormatSelection: true,
  colorSpaceOptions: ['RGB', 'CMYK', 'Grayscale'],
  resolutionOptions: [
    { width: 640, height: 480, label: 'VGA (640x480)' },
    { width: 1024, height: 768, label: 'XGA (1024x768)' },
    { width: 1920, height: 1080, label: 'Full HD (1920x1080)' },
    { width: 2560, height: 1440, label: '2K (2560x1440)' },
    { width: 3840, height: 2160, label: '4K (3840x2160)' },
  ],
};

/**
 * Video Download Presets
 */
export const VIDEO_PRESETS: DownloadPresetConfig = {
  fileType: 'video',
  defaultFormat: 'mp4',
  defaultQuality: 'high',
  availableFormats: ['mp4', 'webm', 'avi', 'mov'],
  availableQualities: ['low', 'medium', 'high', 'ultra'],
  allowQualitySelection: true,
  allowFormatSelection: true,
  resolutionOptions: [
    { width: 640, height: 360, label: '360p (SD)' },
    { width: 854, height: 480, label: '480p (Standard)' },
    { width: 1280, height: 720, label: '720p (HD)' },
    { width: 1920, height: 1080, label: '1080p (Full HD)' },
    { width: 2560, height: 1440, label: '1440p (2K)' },
    { width: 3840, height: 2160, label: '2160p (4K)' },
  ],
};

/**
 * Audio Download Presets
 */
export const AUDIO_PRESETS: DownloadPresetConfig = {
  fileType: 'audio',
  defaultFormat: 'mp3',
  defaultQuality: 'high',
  availableFormats: ['mp3', 'wav', 'aac', 'ogg'],
  availableQualities: ['low', 'medium', 'high', 'ultra'],
  allowQualitySelection: true,
  allowFormatSelection: true,
};

/**
 * Get preset configuration for a file type
 */
export function getPresetConfig(fileType: FileType): DownloadPresetConfig {
  switch (fileType) {
    case 'pdf':
      return PDF_PRESETS;
    case 'image':
      return IMAGE_PRESETS;
    case 'video':
      return VIDEO_PRESETS;
    case 'audio':
      return AUDIO_PRESETS;
    default:
      return PDF_PRESETS;
  }
}

/**
 * Get available quality presets for download
 */
export function getAvailableQualityPresets(fileType: FileType): Record<string, QualityPreset> {
  if (fileType === 'image' || fileType === 'video' || fileType === 'audio') {
    return IMAGE_QUALITY_PRESETS;
  }
  return IMAGE_QUALITY_PRESETS;
}

/**
 * Get available format presets by file type
 */
export function getAvailableFormats(fileType: FileType): FormatPreset[] {
  switch (fileType) {
    case 'image':
      return FORMAT_PRESETS.image || [];
    case 'audio':
      return FORMAT_PRESETS.audio || [];
    case 'video':
      return FORMAT_PRESETS.video || [];
    case 'pdf':
    case 'word':
    case 'excel':
    case 'powerpoint':
      return FORMAT_PRESETS.document || [];
    default:
      return [];
  }
}

/**
 * Calculate estimated file size based on quality/format
 */
export function estimateFileSize(
  originalSize: number,
  qualityLevel: 'low' | 'medium' | 'high' | 'ultra'
): number {
  const multipliers = {
    low: 0.3,
    medium: 0.7,
    high: 0.95,
    ultra: 1.2,
  };

  return Math.round(originalSize * multipliers[qualityLevel]);
}

/**
 * Get quality label with file size estimate
 */
export function getQualityLabel(
  level: 'low' | 'medium' | 'high' | 'ultra'
): string {
  const preset = IMAGE_QUALITY_PRESETS[level];
  return preset ? `${preset.label} - ${preset.fileEstimate}` : level;
}

/**
 * Create download metadata object
 */
export function createDownloadMetadata(
  fileName: string,
  fileType: FileType,
  format?: string,
  quality?: 'low' | 'medium' | 'high' | 'ultra'
): Record<string, string> {
  const metadata: Record<string, string> = {};

  metadata['File'] = fileName;
  metadata['Type'] = fileType.toUpperCase();

  if (format) {
    metadata['Format'] = format.toUpperCase();
  }

  if (quality) {
    const preset = IMAGE_QUALITY_PRESETS[quality];
    if (preset) {
      metadata['Quality'] = preset.label;
    }
  }

  return metadata;
}

/**
 * Compression level presets for PDFs and archives
 */
export const COMPRESSION_PRESETS = {
  none: { level: 0, label: 'No Compression', fileSize: '100%' },
  low: { level: 3, label: 'Low', fileSize: '80-90%' },
  medium: { level: 6, label: 'Medium', fileSize: '60-75%' },
  high: { level: 9, label: 'High', fileSize: '40-60%' },
};

/**
 * Resolution presets for images and videos
 */
export const RESOLUTION_PRESETS = {
  thumbnail: { width: 150, height: 150, label: 'Thumbnail (150x150)' },
  small: { width: 400, height: 300, label: 'Small (400x300)' },
  medium: { width: 800, height: 600, label: 'Medium (800x600)' },
  large: { width: 1920, height: 1080, label: 'Large (1920x1080)' },
  original: { width: 0, height: 0, label: 'Original Size' },
};

/**
 * Color space conversion presets
 */
export const COLOR_SPACE_PRESETS = {
  rgb: { label: 'RGB', description: 'Standard for web and screens' },
  cmyk: { label: 'CMYK', description: 'For print materials' },
  grayscale: { label: 'Grayscale', description: 'Black and white' },
  srgb: { label: 'sRGB', description: 'Web-safe colors' },
};

/**
 * Batch download presets
 */
export interface BatchDownloadConfig {
  compressToZip: boolean;
  zipCompressionLevel: number;
  preserveFileStructure: boolean;
  includeLogs: boolean;
  fileName: string;
}

export const DEFAULT_BATCH_CONFIG: BatchDownloadConfig = {
  compressToZip: true,
  zipCompressionLevel: 6,
  preserveFileStructure: true,
  includeLogs: false,
  fileName: 'batch-download',
};

/**
 * Audio bitrate presets
 */
export const AUDIO_BITRATE_PRESETS = {
  low: { bitrate: 96, label: '96 kbps (Low Quality)' },
  medium: { bitrate: 128, label: '128 kbps (Good Quality)' },
  high: { bitrate: 192, label: '192 kbps (High Quality)' },
  ultra: { bitrate: 320, label: '320 kbps (Lossless Quality)' },
};

/**
 * Video bitrate presets
 */
export const VIDEO_BITRATE_PRESETS = {
  low: { bitrate: 500, label: '500 kbps (Low, Streaming)' },
  medium: { bitrate: 1500, label: '1500 kbps (Medium, Good)' },
  high: { bitrate: 5000, label: '5000 kbps (High, Best)' },
  ultra: { bitrate: 10000, label: '10000 kbps (Ultra, Maximum)' },
};

/**
 * Check if format supports quality selection
 */
export function supportsQualitySelection(format: string): boolean {
  const loossyFormats = ['jpg', 'jpeg', 'webp', 'mp3', 'aac', 'ogg', 'mp4', 'webm'];
  return loossyFormats.includes(format.toLowerCase());
}

/**
 * Check if format supports transparency
 */
export function supportsTransparency(format: string): boolean {
  const transparentFormats = ['png', 'gif', 'webp', 'svg'];
  return transparentFormats.includes(format.toLowerCase());
}

/**
 * Get MIME type for format
 */
export function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    mp4: 'video/mp4',
    webm: 'video/webm',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    zip: 'application/zip',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };

  return mimeTypes[format.toLowerCase()] || 'application/octet-stream';
}
