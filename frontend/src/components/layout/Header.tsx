import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 max-w-screen-xl items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-heading uppercase tracking-widest text-primary">Toolio</span>
        </Link>
        <nav className="ml-auto flex items-center space-x-6 text-sm font-medium">
          <Link to="/image" className="text-muted-foreground transition-colors hover:text-foreground">
            Image
          </Link>
          <Link to="/video" className="text-muted-foreground transition-colors hover:text-foreground">
            Video
          </Link>
          <Link to="/audio" className="text-muted-foreground transition-colors hover:text-foreground">
            Audio
          </Link>
          <Link to="/pdf" className="text-muted-foreground transition-colors hover:text-foreground">
            PDF
          </Link>
          <Link to="/about" className="text-muted-foreground transition-colors hover:text-foreground">
            About
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
