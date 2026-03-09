import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-[10px] border border-[hsl(0_0%_100%/0.1)] bg-[hsl(0_0%_100%/0.04)] px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-[hsl(240_20%_30%)] focus-visible:outline-none focus-visible:border-[hsl(243_95%_69%/0.6)] focus-visible:shadow-[0_0_0_3px_hsl(243_95%_69%/0.15)] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
