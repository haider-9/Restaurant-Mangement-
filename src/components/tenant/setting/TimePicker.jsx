import React from "react";
import TimePicker from "react-time-picker";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

const CustomTimePicker = React.forwardRef(
  (
    {
      className,
      label,
      value,
      onChange,
      format = "24h", // '12h' or '24h'
      disabled = false,
      required = false,
      error,
      ...props
    },
    ref
  ) => {
    const timeFormat = format === "12h" ? "h:mm a" : "HH:mm";

    return (
      <div className="space-y-2">
        {label && (
          <Label
            className={cn(
              required && "after:content-['*'] after:ml-0.5 after:text-red-500"
            )}
          >
            {label}
          </Label>
        )}
        <div className={cn("relative ", className)}>
          <TimePicker
            ref={ref}
            value={value}
            onChange={onChange}
            format={timeFormat}
            disabled={disabled}
            clearIcon={null}
            clockIcon={null}
            disableClock={true}
            className={cn(
              "w-full rounded-md ",
              error && "border-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            {...props}
          />
        </div>
        {error && <div className="text-xs text-red-500">{error}</div>}
      </div>
    );
  }
);

CustomTimePicker.displayName = "CustomTimePicker";

export { CustomTimePicker };
