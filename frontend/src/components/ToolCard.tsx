import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  className?: string
  iconColor?: string
  iconBg?: string
}

export default function ToolCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  className,
  iconColor = "text-primary",
  iconBg = "bg-primary/10"
}: ToolCardProps) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative z-10 flex flex-col gap-4">
          <div className={cn("inline-flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110", iconBg, iconColor)}>
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
