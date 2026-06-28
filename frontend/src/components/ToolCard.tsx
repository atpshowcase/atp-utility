import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  className?: string
}

export default function ToolCard({ title, description, icon: Icon, href, className }: ToolCardProps) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <div className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:bg-card/80">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
            <p className="text-sm text-muted leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
