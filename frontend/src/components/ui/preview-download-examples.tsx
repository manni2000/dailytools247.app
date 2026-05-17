/**
 * Preview + Download Integration Guide
 * For all tools that generate output files
 */

import React, { useState } from 'react';
import { PreviewDownload } from '@/components/ui/preview-download';

/**
 * PATTERN 1: Simple Image Tool
 * 
 * Image converter, resizer, compressor, etc.
 */
export function ImageToolExample() {
  const [outputImage, setOutputImage] = useState<string | null>(null);

  const handleConvert = async (inputFile: File) => {
    // Convert image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      // Get data URL
      const dataUrl = canvas.toDataURL('image/png');
      setOutputImage(dataUrl);
    };
    img.src = URL.createObjectURL(inputFile);
  };

  return (
    outputImage && (
      <PreviewDownload
        fileData={outputImage}
        fileType="image"
        fileName="converted-image.png"
        fileSize={50000} // bytes
        title="Image Conversion Complete"
        description="Your image has been converted successfully"
        onDownload={() => {
          const link = document.createElement('a');
          link.href = outputImage;
          link.download = 'converted-image.png';
          link.click();
        }}
        metadata={{
          'Format': 'PNG',
          'Status': 'Ready',
        }}
        showPreviewToggle={true}
        previewHeight="max-h-80"
        downloadVariant="default"
      />
    )
  );
}

/**
 * PATTERN 2: PDF Tool
 * 
 * PDF merge, split, convert, etc.
 */
export function PDFToolExample() {
  const [outputPDF, setOutputPDF] = useState<Blob | null>(null);

  return (
    outputPDF && (
      <PreviewDownload
        fileData={outputPDF}
        fileType="pdf"
        fileName="merged-document.pdf"
        fileSize={outputPDF.size}
        title="PDF Ready for Download"
        description="Your PDF has been processed successfully"
        onDownload={() => {
          const url = URL.createObjectURL(outputPDF);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'merged-document.pdf';
          link.click();
        }}
        metadata={{
          'Pages': '10',
          'Size': `${(outputPDF.size / 1024).toFixed(2)} KB`,
        }}
        showPreviewToggle={true}
        previewHeight="max-h-96"
      />
    )
  );
}

/**
 * PATTERN 3: Video Tool
 * 
 * Video trim, convert, extract, etc.
 */
export function VideoToolExample() {
  const [outputVideo, setOutputVideo] = useState<Blob | null>(null);

  return (
    outputVideo && (
      <PreviewDownload
        fileData={outputVideo}
        fileType="video"
        fileName="trimmed-video.mp4"
        fileSize={outputVideo.size}
        title="Video Processing Complete"
        description="Your video is ready to download"
        onDownload={() => {
          const url = URL.createObjectURL(outputVideo);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'trimmed-video.mp4';
          link.click();
        }}
        metadata={{
          'Format': 'MP4',
          'Duration': '00:05:30',
        }}
        showPreviewToggle={true}
        previewHeight="max-h-96"
      />
    )
  );
}

/**
 * PATTERN 4: Audio Tool
 * 
 * Audio converter, trimmer, merger, etc.
 */
export function AudioToolExample() {
  const [outputAudio, setOutputAudio] = useState<Blob | null>(null);

  return (
    outputAudio && (
      <PreviewDownload
        fileData={outputAudio}
        fileType="audio"
        fileName="converted-audio.mp3"
        fileSize={outputAudio.size}
        title="Audio Conversion Complete"
        description="Your audio file is ready to download"
        onDownload={() => {
          const url = URL.createObjectURL(outputAudio);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'converted-audio.mp3';
          link.click();
        }}
        metadata={{
          'Format': 'MP3',
          'Bitrate': '192 kbps',
        }}
        showPreviewToggle={true}
      />
    )
  );
}

/**
 * PATTERN 5: Word Document Tool
 * 
 * Text to Word, document generator, etc.
 */
export function WordToolExample() {
  const [outputDoc, setOutputDoc] = useState<Blob | null>(null);

  return (
    outputDoc && (
      <PreviewDownload
        fileData={outputDoc}
        fileType="word"
        fileName="generated-document.docx"
        fileSize={outputDoc.size}
        title="Document Generated"
        description="Your Word document is ready to download"
        onDownload={() => {
          const url = URL.createObjectURL(outputDoc);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'generated-document.docx';
          link.click();
        }}
        metadata={{
          'Pages': '5',
          'Format': 'DOCX',
        }}
      />
    )
  );
}

/**
 * PATTERN 6: Multiple File Outputs
 * 
 * For tools that generate multiple files
 */
export function MultipleFilesExample() {
  const [outputFiles, setOutputFiles] = useState<
    Array<{
      data: Blob;
      fileName: string;
      fileType: FileType;
    }>
  >([]);

  return (
    <div className="space-y-6">
      {outputFiles.map((file, index) => (
        <PreviewDownload
          key={index}
          fileData={file.data}
          fileType={file.fileType}
          fileName={file.fileName}
          fileSize={file.data.size}
          onDownload={() => {
            const url = URL.createObjectURL(file.data);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.fileName;
            link.click();
          }}
          metadata={{
            'File': `${index + 1} of ${outputFiles.length}`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * PATTERN 7: With Quality/Format Options
 * 
 * Shows options before preview
 */
export function ToolWithOptionsExample() {
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState('png');
  const [selectedQuality, setSelectedQuality] = useState('high');

  const handleDownloadWithOptions = async () => {
    // Apply options and generate output
    console.log('Download with format:', selectedFormat, 'quality:', selectedQuality);
  };

  return (
    <div className="space-y-6">
      {/* Options Panel */}
      {!outputImage && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Quality</label>
            <select
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            >
              <option value="low">Low (smaller file)</option>
              <option value="medium">Medium</option>
              <option value="high">High (better quality)</option>
            </select>
          </div>

          <button onClick={handleDownloadWithOptions} className="btn-primary w-full">
            Convert
          </button>
        </div>
      )}

      {/* Preview + Download */}
      {outputImage && (
        <PreviewDownload
          fileData={outputImage}
          fileType="image"
          fileName={`image.${selectedFormat}`}
          title="Conversion Complete"
          description={`Your image has been converted to ${selectedFormat.toUpperCase()} with ${selectedQuality} quality`}
          onDownload={() => {
            const link = document.createElement('a');
            link.href = outputImage;
            link.download = `image.${selectedFormat}`;
            link.click();
          }}
          metadata={{
            'Format': selectedFormat.toUpperCase(),
            'Quality': selectedQuality,
          }}
        />
      )}
    </div>
  );
}

/**
 * INTEGRATION CHECKLIST FOR TOOLS
 * 
 * When adding PreviewDownload to your tool:
 * 
 * 1. Import the component
 *    import { PreviewDownload } from '@/components/ui/preview-download';
 * 
 * 2. Create state for output data
 *    const [outputData, setOutputData] = useState<string | Blob | null>(null);
 * 
 * 3. Create handler for generating output
 *    const handleConvert = async () => {
 *      const result = await convertFile(inputData);
 *      setOutputData(result);
 *    };
 * 
 * 4. Render the component
 *    {outputData && (
 *      <PreviewDownload
 *        fileData={outputData}
 *        fileType="image"
 *        fileName="output.png"
 *        onDownload={handleDownload}
 *      />
 *    )}
 * 
 * 5. Test on mobile and desktop
 * 
 * 6. Test with different file types
 */

/**
 * SUPPORTED FILE TYPES
 * 
 * ✅ image - PNG, JPG, WebP, GIF, SVG (with image preview and zoom)
 * ✅ pdf - Shows PDF indicator with download link
 * ✅ video - HTML5 video player preview
 * ✅ audio - HTML5 audio player preview
 * ✅ word - Word document indicator
 * ✅ excel - Excel spreadsheet indicator
 * ✅ powerpoint - PowerPoint presentation indicator
 * ✅ zip - Archive file indicator
 * ✅ text - Text file indicator
 * ✅ json - JSON file indicator
 * ✅ csv - CSV file indicator
 */

/**
 * PROPS REFERENCE
 * 
 * Required:
 * - fileData: string | Blob - The file content (data URL or Blob)
 * - fileType: FileType - Type of file (image, pdf, video, etc.)
 * - fileName: string - Name of the file
 * - onDownload: () => void - Download handler
 * 
 * Optional:
 * - fileSize?: number - File size in bytes
 * - title?: string - Preview section title (default: "Preview")
 * - description?: string - Description under title
 * - onShare?: () => void - Share handler
 * - showPreviewToggle?: boolean - Show hide/show button (default: true)
 * - defaultShowPreview?: boolean - Show preview by default (default: true)
 * - previewHeight?: string - Preview container height (default: "max-h-96")
 * - previewTitle?: string - Title for preview section
 * - metadata?: Record<string, string> - Additional file metadata
 * - className?: string - Wrapper class name
 * - downloadVariant?: 'default' | 'minimal' | 'compact' | 'detailed'
 * - additionalActions?: Array - Extra action buttons
 */
