"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Download, FileType2, RefreshCw, CheckCircle2 } from "lucide-react";

export default function PdfToWordPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      
      // Reset state
      setIsConverting(false);
      setProgress(0);
      setIsDone(false);
    }
  };

  const handleConvert = () => {
    if (!pdfFile) return;
    
    setIsConverting(true);
    setProgress(0);
    
    // Simulate a complex conversion process with a progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsConverting(false);
          setIsDone(true);
          return 100;
        }
        // Random progress increments for realism
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 400);
  };

  const handleDownload = () => {
    if (isDone && pdfFile) {
      // For now, we mock the download by creating an empty blob with docx MIME type
      // In a real scenario, this would be the data returned from the backend
      const mockContent = "This is a mocked DOCX file. Backend conversion coming soon.";
      const blob = new Blob([mockContent], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      // Change extension to .docx
      const newName = pdfFile.name.replace(/\.[^/.]+$/, "") + ".docx";
      link.download = newName;
      
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
          PDF to Word
        </h1>
        <p className="text-muted mt-2 text-lg">
          Convert your PDF files to editable Word documents instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Upload */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col h-full min-h-[400px]">
          {!pdfFile ? (
            <div 
              className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-primary/50 transition-all group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Click or drag PDF here</h3>
              <p className="text-muted text-sm text-center max-w-[250px]">
                Only PDF files are supported.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2 text-gray-900">
                  <FileText className="w-5 h-5 text-primary" />
                  Source File
                </h3>
                <button 
                  onClick={() => {
                    setPdfFile(null);
                    setIsDone(false);
                    setIsConverting(false);
                  }}
                  className="text-xs text-muted hover:text-gray-900 transition-colors bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full"
                >
                  Change File
                </button>
              </div>
              
              <div className="flex-1 bg-gray-100 rounded-xl flex flex-col items-center justify-center p-8 border border-gray-200 text-center">
                <FileText className="w-16 h-16 text-muted mb-4" />
                <h4 className="font-medium text-lg mb-1 break-all text-gray-900 line-clamp-2">{pdfFile.name}</h4>
                <p className="text-muted text-sm mb-4">
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                  Ready to convert
                </div>
              </div>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf"
            className="hidden" 
          />
        </div>

        {/* Right Column: Convert Actions */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm relative">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900">
            Conversion Status
          </h3>

          <div className="space-y-6 opacity-100 transition-opacity flex flex-col justify-between h-[calc(100%-3rem)]" style={{ opacity: pdfFile ? 1 : 0.5, pointerEvents: pdfFile ? 'auto' : 'none' }}>
            
            {/* Status Visualizer */}
            <div className="flex-1 flex flex-col justify-center py-8">
              {!isConverting && !isDone && (
                <div className="text-center text-muted">
                  <FileType2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Ready to convert to DOCX format.<br/>Formatting and layout will be preserved.</p>
                </div>
              )}

              {isConverting && (
                <div className="space-y-4 w-full px-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-primary animate-pulse">Extracting text & layout...</span>
                    <span className="text-gray-900">{Math.min(progress, 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border border-gray-300">
                    <div 
                      className="bg-primary h-full transition-all duration-300 ease-out relative"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    >
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 animate-[shimmer_1s_infinite] w-full" />
                    </div>
                  </div>
                </div>
              )}

              {isDone && (
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-2 border border-green-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-semibold text-green-700">Conversion Complete!</h4>
                  <p className="text-muted text-sm">Your Word document is ready for download.</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200 mt-auto">
              {!isDone ? (
                <button
                  onClick={handleConvert}
                  disabled={!pdfFile || isConverting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConverting ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <FileType2 className="w-5 h-5" />
                  )}
                  {isConverting ? "Converting..." : "Convert to Word"}
                </button>
              ) : (
                <button
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Word File
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
