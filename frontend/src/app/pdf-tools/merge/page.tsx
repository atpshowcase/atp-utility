"use client"
import { useState } from "react"
import PdfUploader from "@/modules/pdf-tools/components/PdfUploader"
import { pdfService } from "@/modules/pdf-tools/services/pdf.service"
import { Loader2, Merge } from "lucide-react"

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isMerging, setIsMerging] = useState(false)
  const [error, setError] = useState("")

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge.")
      return
    }
    setError("")
    setIsMerging(true)

    try {
      const blob = await pdfService.mergePDFs(files)
      
      // Trigger download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `merged_${Date.now()}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || "An error occurred while merging.")
    } finally {
      setIsMerging(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 text-primary mb-6">
          <Merge className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Merge PDF Files</h1>
        <p className="text-lg text-muted">
          Combine multiple PDFs into one unified document instantly. Drag and drop your files below to get started.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-card/20 border border-border/40 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-2xl">
        <PdfUploader onFilesChange={setFiles} />
        
        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mt-10 flex justify-center border-t border-border/40 pt-8">
          <button
            onClick={handleMerge}
            disabled={files.length < 2 || isMerging}
            className="group relative flex items-center justify-center gap-2 bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground hover:bg-primary/90 px-8 py-3.5 rounded-full font-semibold transition-all disabled:shadow-none shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed overflow-hidden w-full sm:w-auto min-w-[200px]"
          >
            {isMerging ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Merge className="h-5 w-5" />
                Merge PDFs
              </>
            )}
            {!isMerging && files.length >= 2 && (
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
