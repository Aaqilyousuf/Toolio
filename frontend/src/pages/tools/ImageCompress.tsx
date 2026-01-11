import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { DownloadButton } from "@/components/DownloadButton";
import { SuccessAlert } from "@/components/SuccessAlert";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type Status = "idle" | "processing" | "success" | "error";

export default function ImageCompress() {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState([80]);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleProcess = async () => {
    if (files.length === 0) return;

    setStatus("processing");
    setProgress(0);
    setOriginalSize(files[0].size);

    // Fake progress for UX since fetch doesn't support upload progress easily
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("quality", quality[0].toString());

      const response = await fetch("http://localhost:4001/api/image/compress", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Compression failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "compressed.jpg"; // Default name, can be anything
      
      // Store url for "Download" button if needed, 
      // but current UI has a separate handleDownload. 
      // We'll update handleDownload to use a stored URL or just auto-download? 
      // The current UI has a "Download" button (line 176 - <DownloadButton onClick={handleDownload} ... />).
      // So we should store the blob URL in state or something.
      // Looking at the component, there is no state for the result URL.
      // I should verify if I need to add state for the download URL.
      // Existing code Lines 60-63: const handleDownload = () => { console.log... }
      // I need to add state for `downloadUrl`.
      
      setDownloadUrl(url); // Need to add this state
      setCompressedSize(blob.size);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      clearInterval(interval);
      setProgress(100);
    }
  };

  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `compressed-${files[0].name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setStatus("idle");
    setProgress(0);
    setOriginalSize(null);
    setCompressedSize(null);
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
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">Compress Image</h1>
          <p className="text-muted-foreground">
            Reduce file size while maintaining quality. Your files never leave your browser.
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
                multiple={false}
                files={files}
                onFilesChange={setFiles}
                label="Drop an image here or click to upload"
              />

              {files.length > 0 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Quality</Label>
                      <span className="text-sm font-medium">{quality[0]}%</span>
                    </div>
                    <Slider
                      value={quality}
                      onValueChange={setQuality}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower quality = smaller file size
                    </p>
                  </div>

                  <Button
                    onClick={handleProcess}
                    size="lg"
                    className="w-full"
                  >
                    Compress Image
                  </Button>
                </div>
              )}
            </>
          )}

          {status === "processing" && (
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <ProgressIndicator progress={progress} label="Compressing image..." />
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <SuccessAlert message="Image compressed successfully!" />

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Original size</p>
                    <p className="text-lg font-medium">
                      {originalSize ? formatFileSize(originalSize) : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Compressed size</p>
                    <p className="text-lg font-medium">
                      {compressedSize ? formatFileSize(compressedSize) : "-"}
                    </p>
                  </div>
                </div>

                {originalSize && compressedSize && (
                  <p className="mb-4 text-sm text-muted-foreground">
                    Saved {Math.round((1 - compressedSize / originalSize) * 100)}% of the original size
                  </p>
                )}

                <div className="flex gap-3">
                  <DownloadButton onClick={handleDownload} label="Download" />
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    Compress Another
                  </Button>
                </div>
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
