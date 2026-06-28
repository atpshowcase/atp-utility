"use client"
import { useState, useRef } from "react"
import { UploadCloud, File as FileIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PdfUploaderProps {
  onFilesChange: (files: File[]) => void
}

export default function PdfUploader({ onFilesChange }: PdfUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true)
    else if (e.type === "dragleave") setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files))
    }
  }

  const addFiles = (newFiles: File[]) => {
    const pdfs = newFiles.filter(f => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"))
    const updated = [...files, ...pdfs]
    setFiles(updated)
    onFilesChange(updated)
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    setFiles(updated)
    onFilesChange(updated)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div 
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300",
          isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border/60 bg-card/40 hover:border-primary/50 hover:bg-card/60 cursor-pointer"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          multiple 
          accept="application/pdf"
          className="hidden" 
          onChange={handleFileChange} 
        />
        <div className="flex flex-col items-center gap-4 pointer-events-none">
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <UploadCloud className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xl font-semibold mb-1">Click or drag PDF files here</p>
            <p className="text-sm text-muted">Supports multiple files</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground ml-1">Selected Files ({files.length})</h3>
          <ul className="space-y-2">
            {files.map((file, i) => (
              <li key={`${file.name}-${i}`} className="flex items-center justify-between p-3 rounded-lg bg-card/60 border border-border/50 group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                    <FileIcon className="h-5 w-5" />
                  </div>
                  <span className="truncate text-sm font-medium">{file.name}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(i)
                  }}
                  className="p-2 rounded-md text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
