"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Download, Zap, RefreshCw } from "lucide-react";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function CompressImagePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  
  const [quality, setQuality] = useState<number>(0.8); // 0.1 to 1.0
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedDataUrl, setCompressedDataUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setOriginalSize(file.size);
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      setCompressedBlob(null);
      setCompressedDataUrl(null);
      setCompressedSize(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Process compression
  const handleCompress = () => {
    if (!previewUrl || !imageFile) return;
    
    setIsCompressing(true);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Fill with white background in case of transparent png being converted to jpeg
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      
      // Determine format - force jpeg for better compression if it's not a png that needs transparency,
      // but for simplicity we keep the original format or use image/jpeg as default
      const outputFormat = imageFile.type === "image/png" ? "image/jpeg" : imageFile.type;
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob);
            setCompressedSize(blob.size);
            
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              setCompressedDataUrl(reader.result as string);
              setIsCompressing(false);
            };
          } else {
            setIsCompressing(false);
          }
        },
        outputFormat,
        quality
      );
    };
    img.src = previewUrl;
  };

  const handleDownload = () => {
    if (compressedBlob && imageFile) {
      const url = URL.createObjectURL(compressedBlob);
      const link = document.createElement("a");
      link.href = url;
      // Replace original extension with .jpg if we converted to jpeg
      const outputFormat = imageFile.type === "image/png" ? "image/jpeg" : imageFile.type;
      const ext = outputFormat === "image/jpeg" ? ".jpg" : "";
      
      link.download = `compressed_${imageFile.name}${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 pb-2">
          Compress Image
        </h1>
        <p className="text-muted mt-2 text-lg">
          Reduce image file sizes instantly without losing visible quality.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Upload & Preview */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col h-full min-h-[400px]">
          {!previewUrl ? (
            <div 
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-primary/50 transition-all group"
              onClick={triggerFileInput}
            >
              <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Click or drag image here</h3>
              <p className="text-muted text-sm text-center max-w-[250px]">
                Supports JPG, PNG, WEBP, and more.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2 text-gray-900">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Image Preview
                </h3>
                <button 
                  onClick={() => {
                    setImageFile(null);
                    setPreviewUrl(null);
                    setCompressedDataUrl(null);
                    setCompressedBlob(null);
                  }}
                  className="text-xs text-muted hover:text-gray-900 transition-colors bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full"
                >
                  Change Image
                </button>
              </div>
              
              <div className="flex-1 bg-gray-100 rounded-xl flex items-center justify-center p-4 border border-gray-200 overflow-hidden relative min-h-[250px]">
                <img 
                  src={compressedDataUrl || previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-[300px] object-contain rounded-md transition-opacity duration-300"
                />
              </div>
              
              {compressedSize !== null && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex flex-col gap-1 text-green-700 text-sm">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Compression Complete!</span>
                    <span>Saved {Math.round((1 - compressedSize / originalSize) * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*"
            className="hidden" 
          />
        </div>

        {/* Right Column: Settings */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm relative">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900">
            Compression Settings
          </h3>

          <div className="space-y-6 opacity-100 transition-opacity" style={{ opacity: previewUrl ? 1 : 0.5, pointerEvents: previewUrl ? 'auto' : 'none' }}>
            
            {/* File Size Comparison Info */}
            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex-1">
                <div className="text-xs text-muted mb-1">Original Size</div>
                <div className="font-medium text-lg text-gray-900">{formatBytes(originalSize)}</div>
              </div>
              <div className="w-px bg-gray-300"></div>
              <div className="flex-1">
                <div className="text-xs text-muted mb-1">Compressed Size</div>
                <div className={`font-medium text-lg ${compressedSize ? 'text-green-600' : 'text-gray-400'}`}>
                  {compressedSize ? formatBytes(compressedSize) : '---'}
                </div>
              </div>
            </div>

            {/* Quality Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Quality Level</label>
                <span className="text-sm font-semibold text-primary">{Math.round(quality * 100)}%</span>
              </div>
              <input 
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted">
                <span>Smaller File</span>
                <span>Better Quality</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              {!compressedDataUrl ? (
                <button
                  onClick={handleCompress}
                  disabled={!previewUrl || isCompressing}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCompressing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                  {isCompressing ? "Compressing..." : "Compress Image"}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setCompressedDataUrl(null);
                      setCompressedBlob(null);
                      setCompressedSize(null);
                    }}
                    className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Adjust
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
