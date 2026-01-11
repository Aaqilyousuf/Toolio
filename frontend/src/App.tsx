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
import VideoTrim from "./pages/tools/VideoTrim";
import VideoToAudio from "./pages/tools/VideoToAudio";
import AudioConvert from "./pages/tools/AudioConvert";
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
