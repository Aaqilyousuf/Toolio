import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Shield, Lock, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your files never leave your device. All processing happens locally in your browser or on our secure, ephemeral backend."
  },
  {
    icon: Lock,
    title: "Secure Processing",
    description: "We use state-of-the-art encryption and security protocols to ensure your data stays as yours."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed, Toolio processes even large videos and PDFs in seconds."
  },
  {
    icon: Globe,
    title: "Open & Accessible",
    description: "Built for everyone, Toolio provides powerful file manipulation tools without any cost or tracking."
  }
];

const About = () => {
  return (
    <Layout>
      <div className="container max-w-screen-xl py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="mb-6 text-5xl font-heading uppercase tracking-widest md:text-6xl">
            About Toolio
          </h1>
          <p className="text-xl text-muted-foreground font-body leading-relaxed">
            Toolio was born out of a simple need: powerful, high-quality file tools that don't compromise your privacy. 
            Most online converters trade your data for their services—we don't.
          </p>
        </motion.div>

        <section className="mt-24 grid gap-12 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-6 rounded-[2.5rem] border border-border p-8 bg-card/50 backdrop-blur-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 text-xl font-heading uppercase tracking-wider">{feature.title}</h3>
                <p className="text-muted-foreground font-body leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 rounded-[3rem] bg-primary/5 p-12 text-center md:p-20"
        >
          <h2 className="mb-6 text-3xl font-heading uppercase tracking-widest md:text-4xl">
            Our Mission
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground font-body leading-relaxed">
            We believe that basic file utilities should be a human right on the web. 
            Whether you're merging PDFs, trimming videos, or optimizing images, you should be able to do it quickly, 
            beautifully, and without fear of being tracked.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default About;
