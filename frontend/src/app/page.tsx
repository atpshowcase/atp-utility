import ToolCard from "@/components/ToolCard"
import { FileDown, FileUp, Files, Image, Scissors, Merge, Zap, Shrink } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto mb-12 mt-8 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-foreground">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed pt-2">
          Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
        </p>
      </section>

      {/* Filter Chips */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button className="bg-foreground text-background px-6 py-2 rounded-full text-sm font-medium">All</button>
        <button className="bg-white border border-border text-foreground hover:bg-gray-50 px-6 py-2 rounded-full text-sm font-medium transition-colors">Workflows</button>
        <button className="bg-white border border-border text-foreground hover:bg-gray-50 px-6 py-2 rounded-full text-sm font-medium transition-colors">Organize PDF</button>
        <button className="bg-white border border-border text-foreground hover:bg-gray-50 px-6 py-2 rounded-full text-sm font-medium transition-colors">Optimize PDF</button>
        <button className="bg-white border border-border text-foreground hover:bg-gray-50 px-6 py-2 rounded-full text-sm font-medium transition-colors">Convert PDF</button>
        <button className="bg-white border border-border text-foreground hover:bg-gray-50 px-6 py-2 rounded-full text-sm font-medium transition-colors">Edit PDF</button>
      </div>

      {/* Popular Tools Grid */}
      <section className="w-full max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <ToolCard 
            title="Merge PDF"
            description="Combine multiple PDFs into one unified document in seconds."
            icon={Merge}
            href="/pdf-tools/merge"
            iconColor="text-orange-500"
            iconBg="bg-orange-100"
          />
          <ToolCard 
            title="Split PDF"
            description="Extract pages or split a large PDF into smaller files."
            icon={Scissors}
            href="/pdf-tools/split"
            iconColor="text-orange-500"
            iconBg="bg-orange-100"
          />
          <ToolCard 
            title="Compress PDF"
            description="Reduce file size while maintaining maximum visual quality."
            icon={Shrink}
            href="/pdf-tools/compress"
            iconColor="text-green-500"
            iconBg="bg-green-100"
          />
          <ToolCard 
            title="PDF to Word"
            description="Convert your PDF to an editable Word document effortlessly."
            icon={FileDown}
            href="/pdf-tools/word"
            iconColor="text-blue-500"
            iconBg="bg-blue-100"
          />
          
          <ToolCard 
            title="Resize Image"
            description="Change image dimensions by percentage or exact pixels."
            icon={Image}
            href="/image-tools/resize"
            iconColor="text-yellow-500"
            iconBg="bg-yellow-100"
          />
          <ToolCard 
            title="Compress Image"
            description="Optimize JPEGs and PNGs for web without losing quality."
            icon={Zap}
            href="/image-tools/compress"
            iconColor="text-green-500"
            iconBg="bg-green-100"
          />
          <ToolCard 
            title="Convert to JPG"
            description="Turn PNG, GIF, TIF, or RAW formats into JPG format."
            icon={FileUp}
            href="/image-tools/convert"
            iconColor="text-yellow-500"
            iconBg="bg-yellow-100"
          />
          <ToolCard 
            title="Image Crop"
            description="Crop images perfectly for social media and web banners."
            icon={Files}
            href="/image-tools/crop"
            iconColor="text-yellow-500"
            iconBg="bg-yellow-100"
          />
        </div>
      </section>
    </div>
  )
}
