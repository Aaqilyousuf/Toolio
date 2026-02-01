import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Copy, RefreshCw, Terminal, Globe, Hash, Dice5 } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SystemTools() {
  const [userAgent, setUserAgent] = useState("");
  const [ip, setIp] = useState("");
  const [uuid, setUuid] = useState("");
  const [randomNum, setRandomNum] = useState<number | null>(null);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);

  const fetchUA = async () => {
    try {
      const res = await fetch("http://localhost:4005/api/utils/user-agent");
      const data = await res.json();
      setUserAgent(data.data.userAgent);
    } catch (e) {
      toast.error("Failed to fetch User Agent");
    }
  };

  const fetchIP = async () => {
    try {
      const res = await fetch("http://localhost:4005/api/utils/ip");
      const data = await res.json();
      setIp(data.data.ip);
    } catch (e) {
      toast.error("Failed to fetch IP");
    }
  };

  const generateUUID = async () => {
    try {
      const res = await fetch("http://localhost:4005/api/utils/uuid");
      const data = await res.json();
      setUuid(data.data.uuid);
    } catch (e) {
      toast.error("Failed to generate UUID");
    }
  };

  const generateRandom = async () => {
    try {
      const res = await fetch(`http://localhost:4005/api/utils/random?min=${min}&max=${max}`);
      const data = await res.json();
      setRandomNum(data.data.number);
    } catch (e) {
      toast.error("Failed to generate random number");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  useEffect(() => {
    fetchUA();
    fetchIP();
    generateUUID();
  }, []);

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
          <h1 className="mb-2 text-3xl font-semibold tracking-tight">System & Request Tools</h1>
          <p className="text-muted-foreground">
            Information about your browser, connection, and secure generators.
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* User Agent */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Agent</CardTitle>
              <Terminal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={userAgent} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(userAgent)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* IP Address */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your IP Address</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={ip} readOnly className="font-mono" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(ip)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={fetchIP}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* UUID Generator */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">UUID v4 Generator</CardTitle>
              <Hash className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={uuid} readOnly className="font-mono" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(uuid)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={generateUUID}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Random Number Generator */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Random Number Generator</CardTitle>
              <Dice5 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="min">Min</Label>
                  <Input id="min" type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} />
                </div>
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="max">Max</Label>
                  <Input id="max" type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} />
                </div>
                <Button onClick={generateRandom}>Generate</Button>
              </div>
              {randomNum !== null && (
                <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
                  <span className="text-4xl font-bold">{randomNum}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
