import { motion } from "framer-motion";
import { ArrowLeft, Cpu, Globe, Link as LinkIcon, Hash, Search, ShieldCheck, Activity, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ToolCard } from "@/components/ToolCard";

const toolGroups = [
  {
    name: "Request & System",
    description: "System information and generators",
    tools: [
      {
        title: "System Info",
        description: "User Agent and IP finder",
        icon: Terminal,
        href: "/utils/system",
      },
      {
        title: "Random Generators",
        description: "UUID and Random Numbers",
        icon: Hash,
        href: "/utils/system",
      },
    ]
  },
  {
    name: "URL & Text",
    description: "Process and transform URLs",
    tools: [
      {
        title: "URL Tools",
        description: "Encode, Decode, and Unshorten",
        icon: LinkIcon,
        href: "/utils/url",
      },
    ]
  },
  {
    name: "Network & Security",
    description: "Analyze websites and network security",
    tools: [
      {
        title: "Site Diagnostics",
        description: "Status, Headers, and Redirects",
        icon: Search,
        href: "/utils/network",
      },
      {
        title: "Network Tools",
        description: "Ping and SSL Status",
        icon: ShieldCheck,
        href: "/utils/network",
      },
    ]
  }
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

export default function UtilityCategory() {
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
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">Utility Tools</h1>
          <p className="text-muted-foreground">
            Fast, private, and powerful tools for everyday tasks.
          </p>
        </motion.div>

        <div className="space-y-12">
          {toolGroups.map((group) => (
            <section key={group.name}>
              <div className="mb-4">
                <h2 className="text-xl font-medium">{group.name}</h2>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {group.tools.map((tool) => (
                  <motion.div key={tool.title} variants={item}>
                    <ToolCard {...tool} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
