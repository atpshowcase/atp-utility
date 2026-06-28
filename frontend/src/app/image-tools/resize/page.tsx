"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, Image as ImageIcon, Download, Lock, Unlock, RefreshCw } from "lucide-react";

export default function ResizeImagePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizedDataUrl, setResizedDataUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = objectUrl;
      setResizedDataUrl(null); // Reset when new image loaded
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle dimension changes
  const handleWidthChange = (val: string) => {
    const newWidth = parseInt(val) || 0;
    setWidth(newWidth);
    if (maintainRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (val: string) => {
    const newHeight = parseInt(val) || 0;
    setHeight(newHeight);
    if (maintainRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  // Process resize
  const handleResize = () => {
    if (!previewUrl || width <= 0 || height <= 0) return;
    
    setIsResizing(true);
    
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    
    const img = new Image();
    img.onload = () => {
      // Draw resized image
      ctx?.drawImage(img, 0, 0, width, height);
      // Convert to data url
      const dataUrl = canvas.toDataURL(imageFile?.type || "image/png", 0.9);
      setResizedDataUrl(dataUrl);
      setIsResizing(false);
    };
    img.src = previewUrl;
  };

  const handleDownload = () => {
    if (resizedDataUrl && imageFile) {
      const link = document.createElement("a");
      link.href = resizedDataUrl;
      link.download = `resized_${imageFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 pb-2">
          Resize Image
        </h1>
        <p className="text-muted mt-2 text-lg">
          Change image dimensions exactly how you want them in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Upload & Preview */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden flex flex-col h-full min-h-[400px]">
          {!previewUrl ? (
            <div 
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-all group"
              onClick={triggerFileInput}
            >
              <div className="bg-primary/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Click or drag image here</h3>
              <p className="text-muted text-sm text-center max-w-[250px]">
                Supports JPG, PNG, WEBP, and more.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Image Preview
                </h3>
                <button 
                  onClick={() => {
                    setImageFile(null);
                    setPreviewUrl(null);
                    setResizedDataUrl(null);
                  }}
                  className="text-xs text-muted hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full"
                >
                  Change Image
                </button>
              </div>
              <div className="flex-1 bg-black/20 rounded-xl flex items-center justify-center p-4 border border-border/50 overflow-hidden relative">
                <img 
                  src={resizedDataUrl || previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-[300px] object-contain rounded-md"
                />
              </div>
              
              {resizedDataUrl && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between text-green-400 text-sm">
                  <span>Image successfully resized!</span>
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
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl relative">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            Resize Settings
          </h3>

          <div className="space-y-6 opacity-100 transition-opacity" style={{ opacity: previewUrl ? 1 : 0.5, pointerEvents: previewUrl ? 'auto' : 'none' }}>
            
            {/* Dimensions Info */}
            <div className="flex gap-4 p-4 bg-black/20 rounded-xl border border-border/50">
              <div className="flex-1">
                <div className="text-xs text-muted mb-1">Original Size</div>
                <div className="font-medium text-lg">{originalWidth} &times; {originalHeight}</div>
              </div>
            </div>

            {/* Input fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 relative">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">Width (px)</label>
                  <input 
                    type="number"
                    value={width || ''}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full bg-black/30 border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1.5">Height (px)</label>
                  <input 
                    type="number"
                    value={height || ''}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full bg-black/30 border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white"
                  />
                </div>
                
                {/* Lock Ratio Button in the middle */}
                <div className="absolute left-1/2 top-[34px] -translate-x-1/2 flex items-center justify-center">
                  <button 
                    onClick={() => setMaintainRatio(!maintainRatio)}
                    className={`p-1.5 rounded-full border ${maintainRatio ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-card border-border text-muted'} hover:bg-primary/30 transition-colors z-10 shadow-lg`}
                    title="Toggle Aspect Ratio"
                  >
                    {maintainRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-border/50">
              {!resizedDataUrl ? (
                <button
                  onClick={handleResize}
                  disabled={!previewUrl || isResizing}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResizing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                  {isResizing ? "Resizing..." : "Resize Image"}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setResizedDataUrl(null);
                      setWidth(originalWidth);
                      setHeight(originalHeight);
                    }}
                    className="bg-card hover:bg-white/5 border border-border text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reset
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:shadow-[0_0_25px_rgba(22,163,74,0.5)] flex items-center justify-center gap-2"
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
