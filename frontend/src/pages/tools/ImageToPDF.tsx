import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { ArrowLeft, GripVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { DownloadButton } from "@/components/DownloadButton";
import { SuccessAlert } from "@/components/SuccessAlert";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Button } from "@/components/ui/button";

type Status = "idle" | "processing" | "success" | "error";

export default function ImageToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleProcess = async () => {
    if (files.length === 0) return;

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

      const response = await fetch("http://localhost:4002/api/pdf/images-to-pdf", {
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
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "images.pdf";
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

  return (
    <Layout>
      <div className="container max-w-screen-md py-12">
        <Link
          to="/image"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Image Tools
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">Image to PDF</h1>
          <p className="text-muted-foreground">
            Convert images to a PDF document. Drag to reorder pages.
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
                accept=".jpg,.jpeg,.png,.webp"
                multiple={true}
                maxFiles={20}
                files={files}
                onFilesChange={setFiles}
                label="Drop images here or click to upload"
              />

              {files.length > 1 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Drag to reorder pages
                  </p>
                  <Reorder.Group
                    axis="y"
                    values={files}
                    onReorder={setFiles}
                    className="space-y-2"
                  >
                    {files.map((file, index) => (
                      <Reorder.Item
                        key={`${file.name}-${index}`}
                        value={file}
                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm"
                      >
                        <div className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing">
                          <GripVertical className="h-4 w-4" />
                        </div>
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
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              )}

              {files.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    A4 size, auto-orientation applied
                  </p>
                  <Button onClick={handleProcess} size="lg" className="w-full">
                    Create PDF
                  </Button>
                </div>
              )}
            </>
          )}

          {status === "processing" && (
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <ProgressIndicator progress={progress} label="Creating PDF..." />
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <SuccessAlert message="PDF created successfully!" />
              <div className="flex gap-3">
                <DownloadButton onClick={handleDownload} label="Download PDF" />
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  Create Another
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
