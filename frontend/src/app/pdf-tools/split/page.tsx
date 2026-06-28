"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Download, Scissors, RefreshCw, Info } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function SplitPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  
  const [pageSelection, setPageSelection] = useState<string>("");
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [splitDataUrl, setSplitDataUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        setErrorMsg("Please upload a valid PDF file.");
        return;
      }
      
      setPdfFile(file);
      setErrorMsg(null);
      setSplitDataUrl(null);
      setPageSelection("");
      
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdfDoc.getPageCount());
      } catch (err) {
        setErrorMsg("Could not read PDF. It might be encrypted or corrupted.");
        setPdfFile(null);
      }
    }
  };

  const parsePageSelection = (selection: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = selection.split(',').map(s => s.trim());
    
    for (const part of parts) {
      if (!part) continue;
      
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= max) pages.add(i);
          }
        }
      } else {
        const num = parseInt(part);
        if (!isNaN(num) && num >= 1 && num <= max) {
          pages.add(num);
        }
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!pdfFile || !pageSelection.trim()) {
      setErrorMsg("Please enter the pages you want to extract.");
      return;
    }

    const pagesToExtract = parsePageSelection(pageSelection, totalPages);
    if (pagesToExtract.length === 0) {
      setErrorMsg("Invalid page selection. Please check the range.");
      return;
    }

    setIsSplitting(true);
    setErrorMsg(null);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const srcDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      // PDF-lib uses 0-indexed pages, our selection is 1-indexed
      const indices = pagesToExtract.map(p => p - 1);
      const copiedPages = await newPdf.copyPages(srcDoc, indices);

      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      setSplitDataUrl(url);
    } catch (err) {
      setErrorMsg("Failed to split PDF. It might be protected.");
      console.error(err);
    } finally {
      setIsSplitting(false);
    }
  };

  const handleDownload = () => {
    if (splitDataUrl && pdfFile) {
      const link = document.createElement("a");
      link.href = splitDataUrl;
      link.download = `split_${pdfFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 pb-2">
          Split PDF
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Extract pages or split your PDF files seamlessly in the browser.
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
              <p className="text-gray-500 text-sm text-center max-w-[250px]">
                Only PDF files are supported.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2 text-gray-900">
                  <FileText className="w-5 h-5 text-primary" />
                  Source File
                </h3>
                <button 
                  onClick={() => {
                    setPdfFile(null);
                    setSplitDataUrl(null);
                    setSplitBlob(null);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full"
                >
                  Change File
                </button>
              </div>
              
              <div className="flex-1 bg-gray-100 rounded-xl flex flex-col items-center justify-center p-8 border border-gray-200 text-center">
                <FileText className="w-16 h-16 text-gray-400 mb-4" />
                <h4 className="font-medium text-lg mb-1 break-all text-gray-900 line-clamp-2">{pdfFile.name}</h4>
                <p className="text-gray-500 text-sm mb-4">
                  {(pdfFile.size / 1024 / 1024).toFixed(2)} MB • {pageCount} pages
                </p>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                  Ready to split
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

        {/* Right Column: Settings */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm relative">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900">
            Split Settings
          </h3>

          <div className="space-y-6 opacity-100 transition-opacity" style={{ opacity: pdfFile ? 1 : 0.5, pointerEvents: pdfFile ? 'auto' : 'none' }}>
            
            {/* Split Options */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Split Method</label>
              
              <div 
                className={`p-4 rounded-xl border cursor-pointer transition-all ${splitMode === "extract" ? "border-primary bg-primary/5 ring-1 ring-primary/50" : "border-gray-200 hover:border-primary/50 bg-white"}`}
                onClick={() => setSplitMode("extract")}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${splitMode === "extract" ? "border-primary" : "border-gray-400"}`}>
                    {splitMode === "extract" && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  <h4 className="font-medium text-gray-900">Extract Pages</h4>
                </div>
                <p className="text-sm text-gray-500 ml-7">Create a new PDF containing only the selected pages.</p>
                
                {splitMode === "extract" && (
                  <div className="mt-4 ml-7">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Pages to extract</label>
                    <input 
                      type="text"
                      placeholder="e.g. 1-3, 5, 8"
                      value={pageSelection}
                      onChange={(e) => setPageSelection(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400"
                    />
                    <p className="text-[11px] text-gray-500 mt-1.5">Enter page numbers or ranges separated by commas.</p>
                    
                    {error && (
                      <div className="mt-2 text-red-500 text-xs flex items-center gap-1 bg-red-50 p-2 rounded">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Success State */}
            {splitDataUrl && !error && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-green-800 font-medium text-sm mb-1">Success! {extractedCount} pages extracted.</h4>
                  <p className="text-green-700/80 text-xs">Your new PDF is ready to download.</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              {!splitDataUrl ? (
                <button
                  onClick={handleSplit}
                  disabled={!pdfFile || isSplitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSplitting ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Scissors className="w-5 h-5" />
                  )}
                  {isSplitting ? "Processing..." : "Split PDF"}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setSplitDataUrl(null);
                      setSplitBlob(null);
                    }}
                    className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Modify
                  </button>
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
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
