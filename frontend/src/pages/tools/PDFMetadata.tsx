import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function PDFMetadata() {
  const [files, setFiles] = useState<File[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (files.length === 0) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const response = await fetch("http://localhost:4002/api/pdf/metadata", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Metadata fetch failed");
      const data = await response.json();
      setMetadata(data.data);
    } catch (error) {
       toast.error("Failed to fetch metadata");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setMetadata(null);
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
          <h1 className="mb-2 text-3xl font-semibold tracking-tight uppercase">Metadata Viewer</h1>
          <p className="text-muted-foreground">View properties, author, and creation details of your PDF.</p>
        </motion.div>

        <div className="space-y-6">
          {!metadata && (
            <>
              <FileUploadDropzone
                accept=".pdf"
                multiple={false}
                files={files}
                onFilesChange={setFiles}
                label="Drop a PDF here or click to upload"
              />
              {files.length > 0 && (
                <Button onClick={handleProcess} size="lg" className="w-full" disabled={loading}>
                  {loading ? "Analyzing..." : "View Metadata"}
                </Button>
              )}
            </>
          )}

          {metadata && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">PDF Properties</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                   <div className="grid grid-cols-2 border-b pb-2">
                    <span className="text-sm text-muted-foreground">Page Count</span>
                    <span className="text-sm font-medium">{metadata.pageCount}</span>
                  </div>
                  <div className="grid grid-cols-2 border-b pb-2">
                    <span className="text-sm text-muted-foreground">Title</span>
                    <span className="text-sm font-medium">{metadata.title || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-2 border-b pb-2">
                    <span className="text-sm text-muted-foreground">Author</span>
                    <span className="text-sm font-medium">{metadata.author || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-2 border-b pb-2">
                    <span className="text-sm text-muted-foreground">Subject</span>
                    <span className="text-sm font-medium">{metadata.subject || "N/A"}</span>
                  </div>
                  <div className="grid grid-cols-2 border-b pb-2">
                    <span className="text-sm text-muted-foreground">Producer</span>
                    <span className="text-sm font-medium">{metadata.producer || "N/A"}</span>
                  </div>
                   <div className="grid grid-cols-2 border-b pb-2">
                    <span className="text-sm text-muted-foreground">Creation Date</span>
                    <span className="text-sm font-medium">{metadata.creationDate ? new Date(metadata.creationDate).toLocaleString() : "N/A"}</span>
                  </div>
                </CardContent>
              </Card>
              <Button onClick={handleReset} variant="outline" className="w-full">
                Check Another File
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
