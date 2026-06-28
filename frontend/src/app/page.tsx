import ToolCard from "@/components/ToolCard"
import { FileDown, FileUp, Files, Image, Scissors, Merge, Zap, Shrink } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-24 mt-12 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          New: AI-Powered Image Compression
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 pb-2">
          Every Tool You Need, <br /> One Premium Platform.
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed pt-2">
          Merge, split, compress, and edit your PDFs and Images with blazing fast, secure, and beautiful utilities designed for modern workflows.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3.5 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:-translate-y-0.5">
            Explore PDF Tools
          </button>
          <button className="bg-card text-foreground border border-border hover:bg-border/50 px-8 py-3.5 rounded-full font-semibold transition-all">
            Explore Image Tools
          </button>
        </div>
      </section>

      {/* Popular Tools Grid */}
      <section className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold tracking-tight">Popular Utilities</h2>
          <span className="text-sm text-primary font-medium cursor-pointer hover:underline">View All &rarr;</span>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ToolCard 
            title="Merge PDF"
            description="Combine multiple PDFs into one unified document in seconds."
            icon={Merge}
            href="/pdf-tools/merge"
          />
          <ToolCard 
            title="Split PDF"
            description="Extract pages or split a large PDF into smaller files."
            icon={Scissors}
            href="/pdf-tools/split"
          />
          <ToolCard 
            title="Compress PDF"
            description="Reduce file size while maintaining maximum visual quality."
            icon={Shrink}
            href="/pdf-tools/compress"
          />
          <ToolCard 
            title="PDF to Word"
            description="Convert your PDF to an editable Word document effortlessly."
            icon={FileDown}
            href="/pdf-tools/word"
          />
          
          <ToolCard 
            title="Resize Image"
            description="Change image dimensions by percentage or exact pixels."
            icon={Image}
            href="/image-tools/resize"
          />
          <ToolCard 
            title="Compress Image"
            description="Optimize JPEGs and PNGs for web without losing quality."
            icon={Zap}
            href="/image-tools/compress"
          />
          <ToolCard 
            title="Convert to JPG"
            description="Turn PNG, GIF, TIF, or RAW formats into JPG format."
            icon={FileUp}
            href="/image-tools/convert"
          />
          <ToolCard 
            title="Image Crop"
            description="Crop images perfectly for social media and web banners."
            icon={Files}
            href="/image-tools/crop"
          />
        </div>
      </section>
    </div>
  )
}
