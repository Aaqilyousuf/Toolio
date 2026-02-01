import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import ImageCategory from "./pages/ImageCategory";
import VideoCategory from "./pages/VideoCategory";
import AudioCategory from "./pages/AudioCategory";
import PDFCategory from "./pages/PDFCategory";
import ImageCompress from "./pages/tools/ImageCompress";
import ImageToPDF from "./pages/tools/ImageToPDF";
import PDFMerge from "./pages/tools/PDFMerge";
import PDFSplit from "./pages/tools/PDFSplit";
import PDFCompress from "./pages/tools/PDFCompress";
import PDFToImages from "./pages/tools/PDFToImages";
import PDFRotate from "./pages/tools/PDFRotate";
import PDFExtract from "./pages/tools/PDFExtract";
import PDFMetadata from "./pages/tools/PDFMetadata";
import VideoTrim from "./pages/tools/VideoTrim";
import VideoToAudio from "./pages/tools/VideoToAudio";
import AudioConvert from "./pages/tools/AudioConvert";
import UtilityCategory from "./pages/UtilityCategory";
import SystemTools from "./pages/tools/utils/SystemTools";
import UrlTools from "./pages/tools/utils/UrlTools";
import NetworkTools from "./pages/tools/utils/NetworkTools";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/image" element={<ImageCategory />} />
            <Route path="/image/compress" element={<ImageCompress />} />
            <Route path="/image/to-pdf" element={<ImageToPDF />} />
            <Route path="/video" element={<VideoCategory />} />
            <Route path="/video/trim" element={<VideoTrim />} />
            <Route path="/video/to-audio" element={<VideoToAudio />} />
            <Route path="/audio" element={<AudioCategory />} />
            <Route path="/audio/convert" element={<AudioConvert />} />
            <Route path="/pdf" element={<PDFCategory />} />
            <Route path="/pdf/merge" element={<PDFMerge />} />
            <Route path="/pdf/split" element={<PDFSplit />} />
            <Route path="/pdf/compress" element={<PDFCompress />} />
            <Route path="/pdf/to-images" element={<PDFToImages />} />
            <Route path="/pdf/images-to-pdf" element={<ImageToPDF />} />
            <Route path="/pdf/rotate" element={<PDFRotate />} />
            <Route path="/pdf/reorder" element={<PDFExtract />} />
            <Route path="/pdf/extract" element={<PDFExtract />} />
            <Route path="/pdf/metadata" element={<PDFMetadata />} />
            <Route path="/utils" element={<UtilityCategory />} />
            <Route path="/utils/system" element={<SystemTools />} />
            <Route path="/utils/url" element={<UrlTools />} />
            <Route path="/utils/network" element={<NetworkTools />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
