"use client";

import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { UploadCloud, Image as ImageIcon, Download, Scissors, RefreshCw, Maximize, Crop as CropIcon } from "lucide-react";

export default function ImageCropPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [croppedDataUrl, setCroppedDataUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      setCroppedDataUrl(null);
      setCrop(undefined);
      setCompletedCrop(null);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 80,
        },
        aspect || 16 / 9, // default if undefined
        width,
        height
      ),
      width,
      height
    );
    // Only set default if no aspect is strictly required initially, or we set a default 16:9 
    if (aspect) {
      setCrop(initialCrop);
    } else {
      // Default loose crop
      setCrop({
        unit: '%',
        width: 80,
        height: 80,
        x: 10,
        y: 10
      });
    }
  };

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (newAspect && imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(
        centerCrop(
          makeAspectCrop({ unit: '%', width: 80 }, newAspect, width, height),
          width,
          height
        )
      );
    }
  };

  // Perform crop
  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current || !imageFile) return;
    
    setIsCropping(true);
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = imgRef.current;
    
    if (!ctx) {
      setIsCropping(false);
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.imageSmoothingQuality = "high";

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    const dataUrl = canvas.toDataURL(imageFile.type, 1.0);
    setCroppedDataUrl(dataUrl);
    setIsCropping(false);
  };

  const handleDownload = () => {
    if (croppedDataUrl && imageFile) {
      const link = document.createElement("a");
      link.href = croppedDataUrl;
      link.download = `cropped_${imageFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 pb-2">
          Image Crop
        </h1>
        <p className="text-muted mt-2 text-lg">
          Frame your images perfectly for any social media or web layout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        
        {/* Left Column: Upload & Crop Area */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col min-h-[500px]">
          {!previewUrl ? (
            <div 
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-primary/50 transition-all group"
              onClick={() => fileInputRef.current?.click()}
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
                  <CropIcon className="w-5 h-5 text-primary" />
                  {croppedDataUrl ? "Cropped Result" : "Crop Area"}
                </h3>
                <button 
                  onClick={() => {
                    setImageFile(null);
                    setPreviewUrl(null);
                    setCroppedDataUrl(null);
                  }}
                  className="text-xs text-muted hover:text-gray-900 transition-colors bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full"
                >
                  Change Image
                </button>
              </div>
              
              <div className="flex-1 bg-gray-100 rounded-xl flex items-center justify-center p-4 border border-gray-200 overflow-hidden relative min-h-[400px]">
                {!croppedDataUrl ? (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    className="max-h-[60vh] max-w-full"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={previewUrl}
                      onLoad={onImageLoad}
                      className="max-h-[60vh] object-contain max-w-full block"
                      style={{ maxWidth: '100%' }}
                    />
                  </ReactCrop>
                ) : (
                  <img 
                    src={croppedDataUrl} 
                    alt="Cropped result" 
                    className="max-w-full max-h-[60vh] object-contain rounded-md border border-gray-300 shadow-md"
                  />
                )}
              </div>
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
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm relative h-fit sticky top-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900">
            Crop Options
          </h3>

          <div className="space-y-6 opacity-100 transition-opacity" style={{ opacity: previewUrl ? 1 : 0.5, pointerEvents: previewUrl ? 'auto' : 'none' }}>
            
            {/* Aspect Ratio Buttons */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block">Aspect Ratio</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleAspectChange(undefined)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${!aspect ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  Freeform
                </button>
                <button 
                  onClick={() => handleAspectChange(1)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${aspect === 1 ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  1:1 (Square)
                </button>
                <button 
                  onClick={() => handleAspectChange(16 / 9)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${aspect === 16/9 ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  16:9 (Landscape)
                </button>
                <button 
                  onClick={() => handleAspectChange(4 / 3)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${aspect === 4/3 ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  4:3 (Standard)
                </button>
                <button 
                  onClick={() => handleAspectChange(9 / 16)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${aspect === 9/16 ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                >
                  9:16 (Story)
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              {!croppedDataUrl ? (
                <button
                  onClick={handleCrop}
                  disabled={!previewUrl || !completedCrop || isCropping}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCropping ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Scissors className="w-5 h-5" />
                  )}
                  {isCropping ? "Cropping..." : "Crop Image"}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCroppedDataUrl(null)}
                    className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reset
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
      
      {/* Global override for react-image-crop styling to fit dark mode better */}
      <style dangerouslySetInnerHTML={{__html: `
        .ReactCrop__crop-selection {
          border: 2px solid #6366f1;
        }
        .ReactCrop__drag-handle::after {
          background-color: #6366f1;
          border-color: #ffffff;
        }
      `}} />
    </div>
  );
}
