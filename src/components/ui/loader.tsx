import { Loader2 } from "lucide-react";

export function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center h-64 w-full ${className}`}>
      <Loader2 className="animate-spin w-10 h-10 text-primary" />
    </div>
  );
} 