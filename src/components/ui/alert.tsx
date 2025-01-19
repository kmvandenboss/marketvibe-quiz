// src/components/ui/alert.tsx
import * as React from "react"
import { twMerge } from "tailwind-merge"

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "destructive"
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={twMerge(
      variant === "destructive" 
        ? "rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        : "rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700",
      className
    )}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }
