import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("shimmer-bg rounded-lg", className)} {...props} />;
}

export { Skeleton };
