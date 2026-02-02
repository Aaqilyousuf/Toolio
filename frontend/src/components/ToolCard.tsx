import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export function ToolCard({ title, description, icon: Icon, href }: ToolCardProps) {
  return (
    <Link to={href}>
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="group h-full cursor-pointer border border-border/50 bg-card/50 shadow-none transition-all hover:border-primary/60 hover:bg-card/80 hover:shadow-[0_0_20px_rgba(45,212,191,0.05)] rounded-2xl">
          <CardContent className="flex flex-col items-start p-7">
            <div className="mb-4 rounded-xl bg-primary/5 p-3.5 transition-colors group-hover:bg-primary/10">
              <Icon className="h-7 w-7 text-primary" strokeWidth={2} />
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <h3 className="font-heading text-lg font-medium uppercase tracking-wider text-foreground/90">{title}</h3>
              <p className="text-sm text-muted-foreground/70 font-body line-clamp-2 leading-snug">{description}</p>
            </div>
            <div className="mt-5 flex items-center text-[11px] font-bold uppercase tracking-widest text-primary/70 opacity-0 transition-opacity group-hover:opacity-100">
              Open Tool <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
