import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Scissors } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { DownloadButton } from "@/components/DownloadButton";
import { SuccessAlert } from "@/components/SuccessAlert";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Status = "idle" | "processing" | "success" | "error";

export default function PDFSplit() {
  const [files, setFiles] = useState<File[]>([]);
  const [startPage, setStartPage] = useState("1");
  const [endPage, setEndPage] = useState("1");
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
      formData.append("start", startPage);
      formData.append("end", endPage);

      const response = await fetch("http://localhost:4002/api/pdf/split", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Split failed");

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
      link.download = `split-${files[0].name}`;
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
          <h1 className="mb-2 text-3xl font-semibold tracking-tight uppercase">Split PDF</h1>
          <p className="text-muted-foreground">Extract a range of pages into a new PDF document.</p>
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
                <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start">Start Page</Label>
                      <Input
                        id="start"
                        type="number"
                        min="1"
                        value={startPage}
                        onChange={(e) => setStartPage(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end">End Page</Label>
                      <Input
                        id="end"
                        type="number"
                        min="1"
                        value={endPage}
                        onChange={(e) => setEndPage(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleProcess} size="lg" className="w-full">
                    Split PDF
                  </Button>
                </div>
              )}
            </>
          )}

          {status === "processing" && (
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <ProgressIndicator progress={progress} label="Splitting PDF..." />
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <SuccessAlert message="PDF split successfully!" />
              <div className="flex gap-3">
                <DownloadButton onClick={handleDownload} label="Download Split PDF" />
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Split Another
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
