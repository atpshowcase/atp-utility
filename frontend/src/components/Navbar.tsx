import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">ATP Utility</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/pdf-tools" className="text-muted hover:text-foreground transition-colors">PDF Tools</Link>
          <Link href="/image-tools" className="text-muted hover:text-foreground transition-colors">Image Tools</Link>
          <Link href="/pro" className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-full transition-colors">Go Premium</Link>
        </nav>
      </div>
    </header>
  )
}
