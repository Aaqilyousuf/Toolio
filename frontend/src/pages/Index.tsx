import { motion } from "framer-motion";
import { Image, Video, Music, FileText } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/CategoryCard";
import { GitHubButton } from "@/components/GitHubButton";

const categories = [
  {
    title: "Image",
    description: "Compress, convert, and optimize your images",
    icon: Image,
    href: "/image",
    toolCount: 2,
  },
  {
    title: "Video",
    description: "Trim, convert, and extract audio from videos",
    icon: Video,
    href: "/video",
    toolCount: 2,
  },
  {
    title: "Audio",
    description: "Convert and process audio files",
    icon: Music,
    href: "/audio",
    toolCount: 1,
  },
  {
    title: "PDF",
    description: "Merge, split, and manage PDF documents",
    icon: FileText,
    href: "/pdf",
    toolCount: 1,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Index = () => {
  return (
    <Layout>
      <section className="container max-w-screen-xl py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h1 className="mb-4 text-6xl font-heading uppercase tracking-widest md:text-7xl lg:text-8xl">
            Toolio
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Privacy-first tools to solve everyday file problems.
          </p>
          
          <div className="mt-8 flex justify-center">
            <GitHubButton />
          </div>
        </motion.div>
      </section>

      <section className="container max-w-screen-xl pb-24">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {categories.map((category) => (
            <motion.div key={category.title} variants={item}>
              <CategoryCard {...category} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </Layout>
  );
};

export default Index;
