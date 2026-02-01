import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { DownloadButton } from "@/components/DownloadButton";
import { SuccessAlert } from "@/components/SuccessAlert";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Button } from "@/components/ui/button";

type Status = "idle" | "processing" | "success" | "error";

export default function PDFToImages() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleProcess = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const response = await fetch("http://localhost:4002/api/pdf/to-images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      clearInterval(interval);
      setProgress(100);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `images-${files[0].name.replace(".pdf", "")}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setDownloadUrl(null);
  };

  return (
    <Layout>
      <div className="container max-w-screen-md py-12">
        <Link
          to="/pdf"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to PDF Tools
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight uppercase">PDF to Images</h1>
          <p className="text-muted-foreground">Convert each page of your PDF into a high-quality PNG image.</p>
        </motion.div>

        <div className="space-y-6">
          {status === "idle" && (
            <>
              <FileUploadDropzone
                accept=".pdf"
                multiple={false}
                files={files}
                onFilesChange={setFiles}
                label="Drop a PDF here or click to upload"
              />

              {files.length > 0 && (
                <Button onClick={handleProcess} size="lg" className="w-full">
                  Convert to Images
                </Button>
              )}
            </>
          )}

          {status === "processing" && (
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <ProgressIndicator progress={progress} label="Converting PDF to images..." />
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <SuccessAlert message="PDF converted to images successfully!" />
              <div className="flex gap-3">
                <DownloadButton onClick={handleDownload} label="Download ZIP" />
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Convert Another
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <ErrorAlert message="Something went wrong. Please try again." />
              <Button onClick={handleReset} variant="outline" className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
