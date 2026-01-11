import { Github, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface GitHubButtonProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export function GitHubButton({ href = "https://github.com/Aaqilyousuf/Toolio", className, ...props }: GitHubButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 transition-all duration-300 ease-out",
        "bg-neutral-900 text-white shadow-xl hover:scale-105 hover:shadow-2xl",
        "border border-white/10",
        "after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-white/0 after:via-white/20 after:to-white/0 after:opacity-0 after:transition-opacity after:duration-500 hover:after:opacity-100",
        "focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <Github className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />
      
      <span className="font-medium tracking-wide font-body">Star on GitHub</span>
      
      <div className="flex items-center gap-1 border-l border-white/20 pl-3 md:pl-2">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 transition-transform duration-300 group-hover:scale-110" />
        {/* Optional: Add star count here if you fetch it */}
      </div>
    </a>
  );
}
