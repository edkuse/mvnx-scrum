import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ToastOptions = {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

export function showToast({
  title,
  description,
  variant = "default",
  duration = 3000,
}: ToastOptions) {
  toast({
    className: cn("top-1 right-1 flex fixed md:max-w-[420px] md:top-4 md:right-4"),
    title,
    description,
    variant,
    duration,
  });
}
