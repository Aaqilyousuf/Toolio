import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  toolCount: number;
}

export function CategoryCard({ title, description, icon: Icon, href, toolCount }: CategoryCardProps) {
  return (
    <Link to={href} className="block h-full">
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="h-full"
      >
        <Card className="group h-full cursor-pointer border-2 border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-lg">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="mb-4 rounded-md bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
              <Icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="mb-2 font-heading text-xl uppercase tracking-wider">{title}</h3>
            <p className="mb-3 text-sm text-muted-foreground font-body">{description}</p>
            <span className="rounded-sm bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              {toolCount} {toolCount === 1 ? "tool" : "tools"}
            </span>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
