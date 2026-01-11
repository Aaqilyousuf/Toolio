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
        whileHover={{ y: -2, scale: 1.01 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Card className="group h-full cursor-pointer border-2 border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-lg">
          <CardContent className="flex items-start gap-4 p-6">
            <div className="rounded-md bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
              <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-heading text-lg uppercase tracking-wider">{title}</h3>
              <p className="text-sm text-muted-foreground font-body">{description}</p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
