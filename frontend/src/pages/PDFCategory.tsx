import { motion } from "framer-motion";
import { ArrowLeft, Merge } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ToolCard } from "@/components/ToolCard";

const tools = [
  {
    title: "Merge PDFs",
    description: "Combine multiple PDF files into one",
    icon: Merge,
    href: "/pdf/merge",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PDFCategory() {
  return (
    <Layout>
      <div className="container max-w-screen-xl py-12">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">PDF Tools</h1>
          <p className="text-muted-foreground">
            Merge, split, and manage your PDF documents.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tools.map((tool) => (
            <motion.div key={tool.title} variants={item}>
              <ToolCard {...tool} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
