import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva } from "class-variance-authority";
import { X } from "lucide-react"
import { cn } from "../../../lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-md gap-2", // Adjusted for md breakpoint width and gap
      className
    )}
    {...props} />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-6 shadow-md transition-all",
  {
    variants: {
      variant: {
        default: "border-gray-200 bg-white text-gray-800",
        destructive:
          "border-red-600 bg-red-500 text-white", 
        success: // Added a success variant for good measure
          "border-green-600 bg-green-500 text-white",
        warning: // Added a warning variant
          "border-yellow-500 bg-yellow-400 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    (<ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props} />)
  );
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-transparent px-3 text-sm font-medium transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", // Simpler action button styles
      "group-[.destructive]:border-red-400 group-[.destructive]:hover:bg-red-700 group-[.destructive]:text-white", // Destructive group specific styles
      "group-[.success]:border-green-400 group-[.success]:hover:bg-green-700 group-[.success]:text-white", // Success group specific styles
      "group-[.warning]:border-orange-300 group-[.warning]:hover:bg-orange-600 group-[.warning]:text-white", // Warning group specific styles
      className
    )}
    {...props} />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-gray-400 opacity-80 transition-opacity hover:text-gray-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-300 group-hover:opacity-100", // Simpler close button styles
      "group-[.destructive]:text-red-200 group-[.destructive]:hover:text-red-100 group-[.destructive]:focus:ring-red-400", // Destructive group specific styles
      "group-[.success]:text-green-200 group-[.success]:hover:text-green-100 group-[.success]:focus:ring-green-400", // Success group specific styles
      "group-[.warning]:text-orange-200 group-[.warning]:hover:text-orange-100 group-[.warning]:focus:ring-orange-400", // Warning group specific styles
      className
    )}
    toast-close="" // Keep this attribute if your underlying library uses it
    {...props}>
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-base font-semibold", className)} {...props} /> // Slightly larger title
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction };