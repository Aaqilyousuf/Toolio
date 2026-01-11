import { motion } from "framer-motion";
import { ArrowLeft, Scissors, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ToolCard } from "@/components/ToolCard";

const tools = [
  {
    title: "Trim Video",
    description: "Cut and trim your video to the desired length",
    icon: Scissors,
    href: "/video/trim",
  },
  {
    title: "Video to Audio",
    description: "Extract audio track from video files",
    icon: Music,
    href: "/video/to-audio",
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

export default function VideoCategory() {
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
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">Video Tools</h1>
          <p className="text-muted-foreground">
            Trim, convert, and extract audio from your video files.
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
