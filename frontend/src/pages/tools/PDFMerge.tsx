import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, GripVertical, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { DownloadButton } from "@/components/DownloadButton";
import { SuccessAlert } from "@/components/SuccessAlert";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Button } from "@/components/ui/button";

type Status = "idle" | "processing" | "success" | "error";

export default function PDFMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleProcess = async () => {
    if (files.length < 2) return;

    setStatus("processing");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("http://localhost:4002/api/pdf/merge", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Merge failed");

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
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "merged.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
  };

  const moveFile = (from: number, to: number) => {
    const newFiles = [...files];
    const [removed] = newFiles.splice(from, 1);
    newFiles.splice(to, 0, removed);
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">Merge PDFs</h1>
          <p className="text-muted-foreground">
            Combine multiple PDF files into one. Drag to reorder.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {status === "idle" && (
            <>
              <FileUploadDropzone
                accept=".pdf"
                multiple={true}
                maxFiles={20}
                files={files}
                onFilesChange={setFiles}
                label="Drop PDF files here or click to upload"
              />

              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {files.length} file{files.length !== 1 ? "s" : ""} selected. Drag to reorder.
                  </p>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                      >
                        <button
                          type="button"
                          className="cursor-grab text-muted-foreground hover:text-foreground"
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-muted-foreground">
                          {index + 1}.
                        </span>
                        <span className="flex-1 truncate text-sm">{file.name}</span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => index > 0 && moveFile(index, index - 1)}
                            disabled={index === 0}
                            className="rounded p-1 text-xs text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-30"
                          >
                            Up
                          </button>
                          <button
                            type="button"
                            onClick={() => index < files.length - 1 && moveFile(index, index + 1)}
                            disabled={index === files.length - 1}
                            className="rounded p-1 text-xs text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-30"
                          >
                            Down
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {files.length >= 2 && (
                <Button onClick={handleProcess} size="lg" className="w-full">
                  Merge PDFs
                </Button>
              )}

              {files.length === 1 && (
                <p className="text-center text-sm text-muted-foreground">
                  Add at least one more PDF to merge
                </p>
              )}
            </>
          )}

          {status === "processing" && (
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <ProgressIndicator progress={progress} label="Merging PDFs..." />
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <SuccessAlert message="PDFs merged successfully!" />
              <div className="flex gap-3">
                <DownloadButton onClick={handleDownload} label="Download Merged PDF" />
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Merge More
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
        </motion.div>
      </div>
    </Layout>
  );
}
