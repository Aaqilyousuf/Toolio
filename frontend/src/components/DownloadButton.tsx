import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export function DownloadButton({ onClick, disabled = false, label = "Download" }: DownloadButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="lg"
      className="w-full gap-2"
    >
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}
