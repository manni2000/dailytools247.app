import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateUploadedFile(file: File, accept: string | undefined): boolean {
  if (!accept || accept.trim() === "" || accept === "*/*") {
    return true;
  }

  const acceptedTypes = accept.split(",").map((type) => type.trim().toLowerCase());
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  for (const type of acceptedTypes) {
    if (type.startsWith(".")) {
      // Extension match, e.g. .pdf, .jpg
      if (fileName.endsWith(type)) {
        return true;
      }
    } else if (type.endsWith("/*")) {
      // Wildcard mime type, e.g. image/*
      const prefix = type.slice(0, -1); // e.g. "image/"
      if (fileType.startsWith(prefix)) {
        return true;
      }
    } else {
      // Exact mime type match, e.g. application/pdf
      if (fileType === type) {
        return true;
      }
    }
  }

  return false;
}

export function getFileFormats(pathname: string, accept: string | undefined): { uploadFormat: string, outputFormat: string } {
  // Normalize pathname
  const path = pathname.toLowerCase().replace(/^\//, '').replace(/\/$/, '');
  
  // Custom mappings for specific tools or pathnames
  const mappings: Record<string, { uploadFormat: string; outputFormat: string }> = {
    // Image converters
    'png-to-jpg-converter': { uploadFormat: 'PNG', outputFormat: 'JPG' },
    'jpg-to-png-converter': { uploadFormat: 'JPG', outputFormat: 'PNG' },
    'webp-to-jpg-converter': { uploadFormat: 'WebP', outputFormat: 'JPG' },
    'jpg-to-webp-converter': { uploadFormat: 'JPG', outputFormat: 'WebP' },
    'webp-to-png-converter': { uploadFormat: 'WebP', outputFormat: 'PNG' },
    'png-to-webp-converter': { uploadFormat: 'PNG', outputFormat: 'WebP' },
    'image-to-pdf': { uploadFormat: 'Image (JPG/PNG/WebP)', outputFormat: 'PDF' },
    
    // PDF converters
    'pdf-to-image': { uploadFormat: 'PDF', outputFormat: 'Image' },
    'pdf-to-word': { uploadFormat: 'PDF', outputFormat: 'Word (DOCX)' },
    'pdf-to-powerpoint': { uploadFormat: 'PDF', outputFormat: 'PowerPoint (PPTX)' },
    'pdf-to-excel': { uploadFormat: 'PDF', outputFormat: 'Excel (XLSX)' },
    'word-to-pdf': { uploadFormat: 'Word (DOCX)', outputFormat: 'PDF' },
    'powerpoint-to-pdf': { uploadFormat: 'PowerPoint (PPTX)', outputFormat: 'PDF' },
    'html-to-pdf': { uploadFormat: 'HTML', outputFormat: 'PDF' },
    
    // PDF processing (upload PDF, output PDF)
    'pdf-merge': { uploadFormat: 'PDF', outputFormat: 'Merged PDF' },
    'pdf-split': { uploadFormat: 'PDF', outputFormat: 'Split PDF' },
    'pdf-password': { uploadFormat: 'PDF', outputFormat: 'Password Protected PDF' },
    'pdf-unlock': { uploadFormat: 'PDF', outputFormat: 'Unlocked PDF' },
    'pdf-page-remover': { uploadFormat: 'PDF', outputFormat: 'Modified PDF' },
    'pdf-rotate': { uploadFormat: 'PDF', outputFormat: 'Rotated PDF' },
    'pdf-reorder': { uploadFormat: 'PDF', outputFormat: 'Reordered PDF' },
    'pdf-add-signature': { uploadFormat: 'PDF', outputFormat: 'Signed PDF' },
    'crop-pdf': { uploadFormat: 'PDF', outputFormat: 'Cropped PDF' },
    'pdf-compressor': { uploadFormat: 'PDF', outputFormat: 'Compressed PDF' },
    
    // Video / Audio tools
    'video-to-audio': { uploadFormat: 'Video (MP4/AVI/MOV)', outputFormat: 'Audio (MP3)' },
    'video-trim': { uploadFormat: 'Video (MP4/AVI/MOV)', outputFormat: 'Trimmed Video' },
    'video-speed': { uploadFormat: 'Video (MP4/AVI/MOV)', outputFormat: 'Modified Video' },
    'video-thumbnail': { uploadFormat: 'Video (MP4/AVI/MOV)', outputFormat: 'Image (Thumbnail)' },
    'video-resolution': { uploadFormat: 'Video (MP4/AVI/MOV)', outputFormat: 'Resized Video' },
    'audio-converter': { uploadFormat: 'Audio (MP3/WAV/AAC/FLAC)', outputFormat: 'Converted Audio' },
    'speech-to-text': { uploadFormat: 'Audio', outputFormat: 'Text Transcript' },
    'audio-trimmer': { uploadFormat: 'Audio', outputFormat: 'Trimmed Audio' },
    'audio-merger': { uploadFormat: 'Audio', outputFormat: 'Merged Audio' },
    'audio-speed': { uploadFormat: 'Audio', outputFormat: 'Modified Audio' },
    
    // ZIP tools
    'create-zip': { uploadFormat: 'Files/Folders', outputFormat: 'ZIP Archive' },
    'extract-zip': { uploadFormat: 'ZIP Archive', outputFormat: 'Extracted Files' },
    'password-zip': { uploadFormat: 'ZIP Archive', outputFormat: 'Password Protected ZIP' },
    'compression-zip': { uploadFormat: 'ZIP Archive', outputFormat: 'Compressed ZIP' },
    
    // Image styling tools
    'image-compressor': { uploadFormat: 'Image (JPG/PNG/WebP)', outputFormat: 'Compressed Image' },
    'image-resize': { uploadFormat: 'Image (JPG/PNG/WebP)', outputFormat: 'Resized Image' },
    'image-crop': { uploadFormat: 'Image (JPG/PNG/WebP)', outputFormat: 'Cropped Image' },
    'background-remover': { uploadFormat: 'Image (JPG/PNG/WebP)', outputFormat: 'Image (No Background)' },
    'image-base64': { uploadFormat: 'Image', outputFormat: 'Base64 Text' },
    'image-dpi-checker': { uploadFormat: 'Image', outputFormat: 'DPI Checked Image' },
    'exif-viewer': { uploadFormat: 'Image', outputFormat: 'EXIF Data' },
    'favicon-generator': { uploadFormat: 'Image', outputFormat: 'Favicon ICO' },
    
    // Ecommerce tools
    'shadow-adder': { uploadFormat: 'Image', outputFormat: 'Image with Shadow' },
    'watermark-adder': { uploadFormat: 'Image', outputFormat: 'Watermarked Image' },
    'white-background-adder': { uploadFormat: 'Image', outputFormat: 'Image with White Background' },
    'bulk-image-resizer': { uploadFormat: 'Images', outputFormat: 'Resized Images' },
    'image-color-enhancer': { uploadFormat: 'Image', outputFormat: 'Enhanced Image' },
    'passport-photo-resizer': { uploadFormat: 'Image', outputFormat: 'Passport Photo' },
    'signature-maker': { uploadFormat: 'Image/Canvas', outputFormat: 'Signature Image' },
    
    // Text / markdown tools
    'markdown-to-html': { uploadFormat: 'Markdown (.md)', outputFormat: 'HTML' }
  };

  if (mappings[path]) {
    return mappings[path];
  }

  // Fallbacks based on path naming conventions, e.g. "X-to-Y"
  const toParts = path.split('-to-');
  if (toParts.length === 2) {
    const upload = toParts[0].toUpperCase();
    const output = toParts[1].replace('-converter', '').toUpperCase();
    return { uploadFormat: upload, outputFormat: output };
  }

  // Fallbacks based on accept attribute
  let uploadFormat = 'supported formats';
  let outputFormat = 'desired output';

  if (accept) {
    if (accept.includes('pdf')) {
      uploadFormat = 'PDF';
      outputFormat = 'modified PDF';
    } else if (accept.includes('image')) {
      uploadFormat = 'Image';
      outputFormat = 'processed Image';
    } else if (accept.includes('audio')) {
      uploadFormat = 'Audio';
      outputFormat = 'processed Audio';
    } else if (accept.includes('video')) {
      uploadFormat = 'Video';
      outputFormat = 'processed Video';
    } else if (accept.includes('zip') || accept.includes('rar') || accept.includes('7z') || accept.includes('tar') || accept.includes('gz')) {
      uploadFormat = 'ZIP/Archive';
      outputFormat = 'extracted/created Archive';
    }
  }

  return { uploadFormat, outputFormat };
}
