export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 bg-background/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted">
        <p>&copy; {new Date().getFullYear()} ATP Utility. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}
