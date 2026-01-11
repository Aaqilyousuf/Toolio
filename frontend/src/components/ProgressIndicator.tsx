import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  progress: number;
  label?: string;
}

export function ProgressIndicator({ progress, label }: ProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label || "Processing..."}</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
