import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, Link as LinkIcon, RefreshCw, Unlink, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function UrlTools() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [unshortenedUrl, setUnshortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEncode = async () => {
    if (!inputText) return;
    try {
      const res = await fetch(`http://localhost:4005/api/utils/url-encode?text=${encodeURIComponent(inputText)}`);
      const data = await res.json();
      setOutputText(data.data.encoded);
    } catch (e) {
      toast.error("Failed to encode URL");
    }
  };

  const handleDecode = async () => {
    if (!inputText) return;
    try {
      const res = await fetch(`http://localhost:4005/api/utils/url-decode?text=${encodeURIComponent(inputText)}`);
      const data = await res.json();
      setOutputText(data.data.decoded);
    } catch (e) {
      toast.error("Failed to decode URL");
    }
  };

  const handleUnshorten = async () => {
    if (!shortUrl) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4005/api/utils/unshorten?url=${encodeURIComponent(shortUrl)}`);
      const data = await res.json();
      if (data.success) {
        setUnshortenedUrl(data.data.originalUrl);
      } else {
        toast.error(data.error || "Failed to unshorten URL");
      }
    } catch (e) {
      toast.error("Failed to unshorten URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Layout>
      <div className="container max-w-screen-md py-12">
        <Link
          to="/utils"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Utilities
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">URL Tools</h1>
          <p className="text-muted-foreground">
            Encode, decode, and unshorten URLs safely and privately.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* Encoder / Decoder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <LinkIcon className="h-5 w-5" />
                URL Encoder & Decoder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Paste your URL or text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[100px] font-mono text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEncode} className="flex-1">Encode</Button>
                <Button onClick={handleDecode} variant="outline" className="flex-1">Decode</Button>
              </div>
              {outputText && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Result:</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(outputText)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <Textarea value={outputText} readOnly className="min-h-[100px] bg-muted font-mono text-sm" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Unshortener */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Unlink className="h-5 w-5" />
                URL Unshortener
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="https://bit.ly/..."
                  value={shortUrl}
                  onChange={(e) => setShortUrl(e.target.value)}
                />
                <Button onClick={handleUnshorten} disabled={loading}>
                  {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Expand
                </Button>
              </div>
              {unshortenedUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Original URL:</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(unshortenedUrl)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={unshortenedUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="break-all rounded-lg border bg-muted p-3 font-mono text-sm">
                    {unshortenedUrl}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
