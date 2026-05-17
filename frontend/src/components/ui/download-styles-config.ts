/**
 * Download Styles Configuration
 * Centralized configuration for all download UI styles and variants
 * Supports: compact, detailed, card, gallery, and minimal styles
 */

export type DownloadStyle = 'compact' | 'detailed' | 'card' | 'gallery' | 'minimal';
export type FileType = 'pdf' | 'image' | 'word' | 'excel' | 'powerpoint' | 'zip' | 'audio' | 'video' | 'json' | 'csv' | 'text';

export interface DownloadStyleConfig {
  style: DownloadStyle;
  showMetadata: boolean;
  showPreview: boolean;
  buttonSize: 'sm' | 'default' | 'lg';
  buttonVariant: 'default' | 'outline' | 'secondary' | 'ghost';
  containerClassName: string;
  showFileIcon: boolean;
  showFileSize: boolean;
  animationEnabled: boolean;
  responsiveGrid?: 'auto' | 'flex' | 'grid';
}

export interface FileTypeConfig {
  icon: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  mimeType: string;
  displayName: string;
  description?: string;
}

export interface QualityPreset {
  level: 'low' | 'medium' | 'high' | 'ultra';
  label: string;
  description: string;
  value: number;
  fileEstimate?: string;
}

export interface FormatPreset {
  id: string;
  format: string;
  label: string;
  mimeType: string;
  icon: string;
  description?: string;
}

/**
 * Download Style Definitions
 * Each style defines the visual presentation and layout
 */
export const DOWNLOAD_STYLES: Record<DownloadStyle, DownloadStyleConfig> = {
  compact: {
    style: 'compact',
    showMetadata: false,
    showPreview: false,
    buttonSize: 'sm',
    buttonVariant: 'default',
    containerClassName: 'inline-flex gap-2',
    showFileIcon: true,
    showFileSize: false,
    animationEnabled: true,
  },
  detailed: {
    style: 'detailed',
    showMetadata: true,
    showPreview: false,
    buttonSize: 'default',
    buttonVariant: 'default',
    containerClassName: 'space-y-4',
    showFileIcon: true,
    showFileSize: true,
    animationEnabled: true,
  },
  card: {
    style: 'card',
    showMetadata: true,
    showPreview: true,
    buttonSize: 'lg',
    buttonVariant: 'default',
    containerClassName: 'max-w-md mx-auto',
    showFileIcon: true,
    showFileSize: true,
    animationEnabled: true,
  },
  gallery: {
    style: 'gallery',
    showMetadata: true,
    showPreview: true,
    buttonSize: 'default',
    buttonVariant: 'default',
    containerClassName: 'w-full',
    showFileIcon: true,
    showFileSize: true,
    animationEnabled: true,
    responsiveGrid: 'grid',
  },
  minimal: {
    style: 'minimal',
    showMetadata: false,
    showPreview: false,
    buttonSize: 'sm',
    buttonVariant: 'ghost',
    containerClassName: 'inline',
    showFileIcon: false,
    showFileSize: false,
    animationEnabled: false,
  },
};

/**
 * File Type Styling Configuration
 * Defines colors, icons, and metadata for each file type
 */
export const FILE_TYPE_CONFIG: Record<FileType, FileTypeConfig> = {
  pdf: {
    icon: 'FileText',
    backgroundColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    mimeType: 'application/pdf',
    displayName: 'PDF Document',
    description: 'Adobe PDF format',
  },
  image: {
    icon: 'ImageIcon',
    backgroundColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    mimeType: 'image/png',
    displayName: 'Image',
    description: 'Image file',
  },
  word: {
    icon: 'FileText',
    backgroundColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    displayName: 'Word Document',
    description: 'Microsoft Word format',
  },
  excel: {
    icon: 'Table2',
    backgroundColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    displayName: 'Excel Spreadsheet',
    description: 'Microsoft Excel format',
  },
  powerpoint: {
    icon: 'Presentation',
    backgroundColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    displayName: 'PowerPoint Presentation',
    description: 'Microsoft PowerPoint format',
  },
  zip: {
    icon: 'Archive',
    backgroundColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
    mimeType: 'application/zip',
    displayName: 'ZIP Archive',
    description: 'Compressed archive',
  },
  audio: {
    icon: 'Music2',
    backgroundColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-200',
    mimeType: 'audio/mpeg',
    displayName: 'Audio File',
    description: 'Audio format',
  },
  video: {
    icon: 'Film',
    backgroundColor: 'bg-pink-100',
    textColor: 'text-pink-800',
    borderColor: 'border-pink-200',
    mimeType: 'video/mp4',
    displayName: 'Video File',
    description: 'Video format',
  },
  json: {
    icon: 'Code',
    backgroundColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    mimeType: 'application/json',
    displayName: 'JSON Data',
    description: 'JSON format',
  },
  csv: {
    icon: 'Table2',
    backgroundColor: 'bg-cyan-100',
    textColor: 'text-cyan-800',
    borderColor: 'border-cyan-200',
    mimeType: 'text/csv',
    displayName: 'CSV File',
    description: 'Comma-separated values',
  },
  text: {
    icon: 'FileText',
    backgroundColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
    mimeType: 'text/plain',
    displayName: 'Text File',
    description: 'Plain text format',
  },
};

/**
 * Quality Presets for Images and Videos
 */
export const IMAGE_QUALITY_PRESETS: Record<string, QualityPreset> = {
  low: {
    level: 'low',
    label: 'Low',
    description: 'Smallest file size, good for web',
    value: 60,
    fileEstimate: '20-30% smaller',
  },
  medium: {
    level: 'medium',
    label: 'Medium',
    description: 'Balanced quality and size',
    value: 75,
    fileEstimate: 'Normal size',
  },
  high: {
    level: 'high',
    label: 'High',
    description: 'Good quality, slightly larger file',
    value: 90,
    fileEstimate: '20-40% larger',
  },
  ultra: {
    level: 'ultra',
    label: 'Ultra',
    description: 'Highest quality, largest file',
    value: 100,
    fileEstimate: 'Maximum quality',
  },
};

/**
 * Format Presets for Different Tool Categories
 */
export const FORMAT_PRESETS: Record<string, FormatPreset[]> = {
  image: [
    { id: 'png', format: 'PNG', label: 'PNG (Lossless)', mimeType: 'image/png', icon: 'ImageIcon', description: 'Best for transparency' },
    { id: 'jpg', format: 'JPG', label: 'JPG (Compressed)', mimeType: 'image/jpeg', icon: 'ImageIcon', description: 'Standard format' },
    { id: 'webp', format: 'WebP', label: 'WebP (Modern)', mimeType: 'image/webp', icon: 'ImageIcon', description: 'Smaller file size' },
    { id: 'gif', format: 'GIF', label: 'GIF (Animated)', mimeType: 'image/gif', icon: 'ImageIcon', description: 'For animations' },
    { id: 'svg', format: 'SVG', label: 'SVG (Vector)', mimeType: 'image/svg+xml', icon: 'ImageIcon', description: 'Scalable graphics' },
  ],
  audio: [
    { id: 'mp3', format: 'MP3', label: 'MP3 (Lossy)', mimeType: 'audio/mpeg', icon: 'Music2', description: 'Most compatible' },
    { id: 'wav', format: 'WAV', label: 'WAV (Lossless)', mimeType: 'audio/wav', icon: 'Music2', description: 'High quality' },
    { id: 'aac', format: 'AAC', label: 'AAC (Lossy)', mimeType: 'audio/aac', icon: 'Music2', description: 'Better quality' },
    { id: 'ogg', format: 'OGG', label: 'OGG (Free)', mimeType: 'audio/ogg', icon: 'Music2', description: 'Open source format' },
  ],
  video: [
    { id: 'mp4', format: 'MP4', label: 'MP4 (H.264)', mimeType: 'video/mp4', icon: 'Film', description: 'Most compatible' },
    { id: 'webm', format: 'WebM', label: 'WebM (VP8)', mimeType: 'video/webm', icon: 'Film', description: 'Web optimized' },
    { id: 'avi', format: 'AVI', label: 'AVI (Legacy)', mimeType: 'video/x-msvideo', icon: 'Film', description: 'Older format' },
    { id: 'mov', format: 'MOV', label: 'MOV (QuickTime)', mimeType: 'video/quicktime', icon: 'Film', description: 'Apple format' },
  ],
  document: [
    { id: 'pdf', format: 'PDF', label: 'PDF', mimeType: 'application/pdf', icon: 'FileText', description: 'Universal format' },
    { id: 'docx', format: 'DOCX', label: 'Word', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', icon: 'FileText', description: 'Editable' },
    { id: 'xlsx', format: 'XLSX', label: 'Excel', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', icon: 'Table2', description: 'Spreadsheet' },
    { id: 'pptx', format: 'PPTX', label: 'PowerPoint', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', icon: 'Presentation', description: 'Presentation' },
  ],
};

/**
 * Download Button Presets for Common Use Cases
 */
export const BUTTON_PRESETS = {
  primary: {
    variant: 'default' as const,
    size: 'default' as const,
    className: 'w-full h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200',
  },
  secondary: {
    variant: 'outline' as const,
    size: 'default' as const,
    className: 'w-full h-10 text-sm font-medium',
  },
  compact: {
    variant: 'default' as const,
    size: 'sm' as const,
    className: 'px-3 py-2',
  },
  minimal: {
    variant: 'ghost' as const,
    size: 'sm' as const,
    className: 'text-xs',
  },
};

/**
 * Get download style configuration for a given style type
 */
export function getDownloadStyleConfig(style: DownloadStyle): DownloadStyleConfig {
  return DOWNLOAD_STYLES[style] || DOWNLOAD_STYLES.detailed;
}

/**
 * Get file type configuration
 */
export function getFileTypeConfig(fileType: FileType): FileTypeConfig {
  return FILE_TYPE_CONFIG[fileType] || FILE_TYPE_CONFIG.text;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get quality presets for a given file type
 */
export function getQualityPresets(fileType: 'image' | 'video'): Record<string, QualityPreset> {
  if (fileType === 'image') {
    return IMAGE_QUALITY_PRESETS;
  }
  // Video quality presets would be similar
  return IMAGE_QUALITY_PRESETS;
}

/**
 * Get format presets for a category
 */
export function getFormatPresets(category: string): FormatPreset[] {
  return FORMAT_PRESETS[category] || [];
}
