import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search, Activity, ShieldCheck, Globe, RefreshCw, Copy, ListTree, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function NetworkTools() {
  const [url, setUrl] = useState("");
  const [host, setHost] = useState("");
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});

  const handleTool = async (tool: string, target: string, endpoint: string) => {
    if (!target) return;
    setLoading(prev => ({ ...prev, [tool]: true }));
    try {
      const res = await fetch(`http://localhost:4005/api/utils/${endpoint}?${endpoint.includes('host') ? 'host' : 'url'}=${encodeURIComponent(target)}`);
      const data = await res.json();
      if (data.success) {
        setResults(prev => ({ ...prev, [tool]: data.data }));
      } else {
        toast.error(data.error || `Failed to run ${tool}`);
      }
    } catch (e) {
      toast.error(`Failed to run ${tool}`);
    } finally {
      setLoading(prev => ({ ...prev, [tool]: false }));
    }
  };

  const copyToClipboard = (text: string) => {
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
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">Network & Diagnostics</h1>
          <p className="text-muted-foreground">
            Analyze website availability, security, and performance.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {/* Website Diagnostics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5" />
                Website Diagnostics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Button variant="outline" size="sm" onClick={() => handleTool('status', url, 'site-status')} disabled={loading['status']}>
                  {loading['status'] ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <Activity className="mr-2 h-3 w-3" />}
                  Status
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleTool('headers', url, 'headers')} disabled={loading['headers']}>
                  {loading['headers'] ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <ListTree className="mr-2 h-3 w-3" />}
                  Headers
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleTool('redirects', url, 'redirects')} disabled={loading['redirects']}>
                  {loading['redirects'] ? <RefreshCw className="mr-2 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-2 h-3 w-3" />}
                  Redirects
                </Button>
              </div>

              {/* Status Result */}
              {results['status'] && (
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">HTTP Status:</span>
                    <Badge variant={results['status'].ok ? "success" : "destructive"}>
                      {results['status'].status}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Headers Result */}
              {results['headers'] && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Headers:</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(JSON.stringify(results['headers'].headers, null, 2))}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="max-h-[200px] overflow-auto rounded-lg bg-muted p-4 font-mono text-xs">
                    {JSON.stringify(results['headers'].headers, null, 2)}
                  </pre>
                </div>
              )}

              {/* Redirects Result */}
              {results['redirects'] && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Redirect Chain:</span>
                  <div className="space-y-1 rounded-lg bg-muted p-4">
                    {results['redirects'].redirects.length > 0 ? (
                      results['redirects'].redirects.map((r: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-mono">
                          <Badge variant="secondary" className="px-1 text-[10px]">{i + 1}</Badge>
                          <span className="truncate">{r}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No redirects found.</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Network Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5" />
                Network Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Input
                  placeholder="google.com"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => handleTool('ping', host, 'ping')} disabled={loading['ping']}>
                  <Zap className="mr-2 h-4 w-4" />
                  TCP Ping
                </Button>
                <Button variant="outline" onClick={() => handleTool('ssl', host, 'ssl')} disabled={loading['ssl']}>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  SSL Checker
                </Button>
              </div>

              {/* Ping Result */}
              {results['ping'] && (
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Target Alive:</span>
                    <Badge variant={results['ping'].alive ? "success" : "destructive"}>
                      {results['ping'].alive ? "YES" : "NO"}
                    </Badge>
                  </div>
                  {results['ping'].alive && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Response time: {results['ping'].time}ms
                    </div>
                  )}
                </div>
              )}

              {/* SSL Result */}
              {results['ssl'] && (
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SSL Certificate:</span>
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="grid gap-2 text-xs">
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Issuer:</span>
                      <span className="font-medium">{results['ssl'].issuer.O}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Valid From:</span>
                      <span className="font-medium">{new Date(results['ssl'].valid_from).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <span className="text-muted-foreground">Valid Until:</span>
                      <span className="font-medium">{new Date(results['ssl'].valid_to).toLocaleDateString()}</span>
                    </div>
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
